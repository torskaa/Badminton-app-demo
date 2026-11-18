# Security Specification - SmashAI Soft Launch

## 1. Data Invariants
1. A `UserProfile` at `/users/{userId}` can only be read or written by the authenticated user whose `request.auth.uid == userId` and `email_verified == true`. It contains PII (`email`) and private `walletBalance`, so list queries (`allow list`) are strictly denied (`if false`).
2. Public ranking rows at `/leaderboard/{userId}` never store email or PII. Only the matching user (`request.auth.uid == userId`) can create/update their own leaderboard document. List queries require `resource.data.visibility == 'community'`.
3. A `CourtBooking` at `/bookings/{bookingId}` belongs strictly to `ownerId == request.auth.uid`. Reads (`get` and `list`) are allowed only when `resource.data.ownerId == request.auth.uid`. Once `status == 'cancelled'` or `status == 'completed'`, updates are permanently locked, and updates from `confirmed` may only transition `status` to `completed` or `cancelled`.
4. A `MatchRecord` at `/matches/{matchId}` is immutable after creation (`update: if false`, `delete: if owner`). Lists are allowed only if `resource.data.isPublic == true || resource.data.ownerId == request.auth.uid`.
5. A `FeedPost` at `/feedPosts/{postId}` enforces `authorId == request.auth.uid` on create and `resource.data.visibility == 'community'` on list. Updating another user's post is strictly restricted to incrementing/decrementing `cheersCount` (`affectedKeys().hasOnly(['cheersCount', 'updatedAt'])`).
6. `WalletTransaction` records at `/walletTransactions/{txId}` are private financial entries (`ownerId == request.auth.uid`), immutable after creation (`update: if false`).
7. `GuildAttendee` subdocuments under `/guildEvents/{eventId}/attendees/{userId}` verify parent event existence (`exists(...)`), validate `resource.data.userId is string` on list queries, and strictly restrict create/update/delete to `request.auth.uid == userId`.
8. `UserBadge` subdocuments under `/users/{userId}/badges/{badgeId}` require parent profile existence (`exists(/databases/$(database)/documents/users/$(userId))`), enforce `ownerId == request.auth.uid` and `badgeId == badgeId`, allow list only when `isOwner(userId) && resource.data.ownerId == request.auth.uid`, enforce strict `affectedKeys().hasOnly(...)` on update, and forbid client deletes (`allow delete: if false`).

## 2. "Dirty Dozen" Adversarial Payloads (Must All Fail with PERMISSION_DENIED)
1. **Unauthenticated Read**: `GET /users/uid_1` with `auth: null` -> DENIED.
2. **Cross-User PII Read**: `GET /users/uid_other` by `uid_attacker` -> DENIED.
3. **Blanket User Scrape**: `LIST /users` by signed-in user -> DENIED.
4. **Identity Spoofing on Booking**: `CREATE /bookings/b1` with `ownerId: "victim_uid"` -> DENIED.
5. **Shadow Ghost Field Injection**: `CREATE /users/uid_1` with `{ ..., isAdmin: true }` or `CREATE /users/uid_1/badges/b1` with `{ ..., expBonus: 99999 }` -> DENIED via `hasOnly()`.
6. **Unverified Email Write**: `CREATE /matches/m1` where `auth.token.email_verified == false` -> DENIED.
7. **Timestamp Forgery**: `CREATE /bookings/b1` or `CREATE /users/uid_1/badges/b1` with client timestamp instead of `request.time` -> DENIED.
8. **ID Poisoning Attack**: `CREATE /bookings/${'a'.repeat(300)}` or `CREATE /users/uid_1/badges/${'b'.repeat(200)}` -> DENIED via `isValidId()`.
9. **Terminal State Bypass**: `UPDATE /bookings/b_cancelled` or `/bookings/b_completed` where `existing.status in ['cancelled', 'completed']` -> DENIED.
10. **Other User Post Hijack**: `UPDATE /feedPosts/p1` (owned by `uid_other`) changing `headline` -> DENIED via `affectedKeys().hasOnly(['cheersCount', 'updatedAt'])`.
11. **Transaction Tampering**: `UPDATE /walletTransactions/tx1` changing `amount` from `-560` to `999999` -> DENIED (`allow update: if false`).
12. **Orphaned Subcollection Write**: `CREATE /guildEvents/nonexistent_event/attendees/uid_1` or `CREATE /users/nonexistent_user/badges/b_smash_king` -> DENIED via parent `exists()` check.
13. **Cross-User Badge Hijack**: `LIST /users/uid_other/badges` or `UPDATE /users/uid_other/badges/b_smash_king` by `uid_attacker` -> DENIED via `isOwner(userId)` + `existing().ownerId == request.auth.uid`.
