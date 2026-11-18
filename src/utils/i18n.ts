export type Language = 'th' | 'en';

export const TRANSLATIONS = {
  th: {
    // Navigation Tabs
    tabHome: 'หน้าแรก',
    tabClub: 'สโมสร',
    tabDiscover: 'ค้นหา',
    tabMore: 'ฟีด',
    tabFeed: 'ฟีด',
    tabProfile: 'โปรไฟล์',

    // Global
    back: 'ย้อนกลับ',
    seeAll: 'ดูทั้งหมด',
    close: 'ปิด',
    confirm: 'ยืนยัน',
    success: 'สำเร็จ',
    newBadge: 'ใหม่',
    hotBadge: 'ยอดนิยม',
    hrUnit: 'ชม.',
    personUnit: 'คน',
    tubeUnit: 'หลอด',
    baht: '฿',

    // Home Header & Widgets
    searchGlobal: 'ค้นหาสนาม, ก๊วน, โค้ช...',
    goodEvening: 'สวัสดีตอนค่ำ',
    subGreeting: 'พร้อมลงคอร์ทวันนี้หรือยัง!',
    city: 'กรุงเทพฯ',
    walletTitle: 'กระเป๋าเงินสแมชเพย์',
    topUpQuick: '+ เติมเงิน',
    nextMatch: 'แมตช์ถัดไป',
    nextMatchDetail: 'คอร์ท 3 · 19:00 น.',
    nextMatchLocation: 'วินเนอร์ อารีน่า พระราม 9',
    quickFindCourts: 'ค้นหาสนาม',
    quickFindGroups: 'ค้นหาก๊วน',
    groupsLabel: 'ก๊วนเปิดรับ',

    // Services Matrix
    servicesTitle: 'บริการแนะนำสำหรับคุณ',
    servicesCount: '8 บริการหลัก',
    serviceFindCourts: 'ค้นหาสนาม',
    serviceFindGroups: 'หาก๊วน',
    serviceCreateGroup: 'สร้างก๊วน',
    serviceClubTools: 'กล่องเครื่องมือ',
    serviceFindCoach: 'หาโค้ชสอน',
    serviceTournaments: 'ทัวร์นาเมนต์',
    serviceActivity: 'กิจกรรมเด่น',
    serviceLevelQuiz: 'วัดระดับฝีมือ',

    // Line OpenChat Banner
    openChatBadge: 'ชุมชนคนตีแบด',
    openChatTitle: 'เข้ากลุ่มแชตคนตีแบด',
    openChatDesc: 'หาเพื่อนตีแบดและแชร์โปรคอร์ท 1,480 คน',
    openChatBtn: 'เข้ากลุ่มไลน์',

    // Book Court Section
    bookCourtTitle: 'จองคอร์ทแบดมินตัน',
    bookCourtSub: 'สนามมาตรฐาน พร้อมระบบจองทันที',
    bookedAgo: 'จองเมื่อ 5 นาทีก่อน',
    bookableTag: 'เปิดจอง',
    bookCourtBtn: 'จองคอร์ท',

    // Discover / Map Screen
    searchMap: 'ค้นหาสนามแบดมินตัน...',
    filterParking: 'ที่จอดรถ',
    filterShower: 'ห้องอาบน้ำ',
    filterEv: 'จุดชาร์จรถ EV',
    filterRental: 'เช่าไม้แบด',
    btnShowPrice: 'แสดงราคา',
    btnBookable: 'สนามเปิดจอง',
    nearbyCourts: 'สนามใกล้คุณ',
    expandList: 'ดูทั้งหมด',
    collapseList: 'ย่อลง',

    // Club Tools Screen
    clubToolsHeader: 'เครื่องมือ',
    clubToolsHeaderSub: 'นับแต้ม จัดทีม และหารบิล',
    backToMenu: '← เมนูหลัก',
    toolScoreboard: 'นับคะแนนสด',
    toolScoreboardDesc: 'นับแต้มและดูฝั่งเสิร์ฟ',
    toolRandomizer: 'สุ่มแบ่งทีม',
    toolRandomizerDesc: 'สุ่มคู่สมดุล 50/50',
    toolTactic: 'กระดานแท็กติก',
    toolTacticDesc: 'วางตำแหน่งการเล่น',
    toolCalc: 'คำนวณหารค่าคอร์ท',
    toolCalcDesc: 'หารค่าคอร์ทและลูกแบด',
    quickClubTitle: 'ก๊วนด่วน',
    fridaySquad: 'ก๊วนวันศุกร์',
    fridaySquadSub: 'เปิดรับ · เหลือ 4 ที่',
    seasonLeaderboard: 'อันดับก๊วน',
    seasonLeaderboardSub: 'เช็กคะแนนและอันดับ',

    // Scoreboard Tool
    scorerSet: 'เซตที่',
    scorerBestOf: '2 ใน 3 เซต',
    teamA: 'ทีม A',
    teamB: 'ทีม B',
    pointBtn: '+1 แต้ม',
    setsWon: 'เซตที่ชนะ',
    resetSetBtn: 'รีเซ็ตเซต',
    openFullScorer: 'เปิดหน้าบันทึกแต้มเต็ม',

    // Randomizer Tool
    randomizerHeader: 'สุ่มคู่จัดทีมสมดุล',
    shuffleBtn: 'สลับคู่ใหม่',
    court1: 'คอร์ท 1',
    balanceRate: 'ความสมดุล',
    balanceDesc: 'สูสี 50/50',

    // Tactic Tool
    tacticHeader: 'กระดานแผนการเล่น',
    formationAttack: 'หน้า-หลัง (บุก)',
    formationDefense: 'ซ้าย-ขวา (รับ)',
    tacticAttackDesc: 'แผนบุก: หน้าคุมเน็ต หลังคอยตบปิดแต้ม',
    tacticDefenseDesc: 'แผนรับ: ยืนคู่ขนานซ้าย-ขวา บล็อกลูกตบ',

    // Cost Calc Tool
    calcHeader: 'หารค่าคอร์ทและลูกแบด',
    equalSplit: 'หารเท่ากัน',
    courtHoursLabel: 'ชั่วโมงคอร์ท',
    shuttleTubesLabel: 'ลูกขนไก่',
    playersLabel: 'จำนวนผู้เล่น',
    totalExpenseLabel: 'ยอดรวมทั้งหมด',
    perPersonLabel: 'คนละประมาณ',
    calcFormulaDesc: 'คำนวณตามค่าคอร์ทและลูกขนไก่จริง',
    shareToRsvpBtn: 'ส่งไปยังหน้านัดก๊วน',

    // Finance Screen
    financeHeader: 'การเงิน',
    financeHeaderSub: 'กระเป๋าเงินและประวัติจ่าย',
    zeroFeesBadge: 'ฟรีค่าธรรมเนียม',
    payLaterTitle: 'วงเงินผ่อนชำระ',
    creditBadge: 'พร้อมใช้',
    topUpAction: 'เติมเงิน',
    transferAction: 'โอนเงิน',
    recommendedTitle: 'สิทธิพิเศษแนะนำ',
    promoCashback: 'รับเงินคืน 10% เมื่อเติมเงิน',
    promoTrueMoney: 'จ่ายง่ายผ่านทรูมันนี่และพร้อมเพย์',
    recentTxTitle: 'ประวัติธุรกรรมล่าสุด',
    viewAllTx: 'ดูทั้งหมด',
    completedStatus: 'สำเร็จ',
    topUpModalTitle: 'เติมเงินเข้ากระเป๋า',
    selectAmount: 'เลือกจำนวนเงิน',
    topUpPromptPayBtn: 'ยืนยันเติมผ่านพร้อมเพย์',
    topUpSuccessMsg: 'เติมเงินสำเร็จแล้ว!',

    // Settings Modal
    settingsLanguage: 'ภาษา',
    settingsTheme: 'ธีมและรูปแบบ',
    settingsSound: 'เสียงเอฟเฟกต์',
    thaiLang: 'ภาษาไทย',
    engLang: 'อังกฤษ',
  },

  en: {
    // Navigation Tabs
    tabHome: 'Home',
    tabClub: 'Club',
    tabDiscover: 'Discover',
    tabMore: 'Feed',
    tabFeed: 'Feed',
    tabProfile: 'Profile',

    // Global
    back: 'Back',
    seeAll: 'See All',
    close: 'Close',
    confirm: 'Confirm',
    success: 'Success',
    newBadge: 'NEW',
    hotBadge: 'HOT',
    hrUnit: 'hr',
    personUnit: 'players',
    tubeUnit: 'tubes',
    baht: '฿',

    // Home Header & Widgets
    searchGlobal: 'Search courts, groups, coaches...',
    goodEvening: 'Good evening',
    subGreeting: 'Badminton is life. Every court awaits!',
    city: 'Bangkok',
    walletTitle: 'SmashPay Wallet',
    topUpQuick: '+ Top up',
    nextMatch: 'Next Match',
    nextMatchDetail: 'Court 3 at 19:00',
    nextMatchLocation: 'Winner Arena Rama 9',
    quickFindCourts: 'Find Courts',
    quickFindGroups: 'Find Groups',
    groupsLabel: 'Groups Open',

    // Services Matrix
    servicesTitle: 'What do you want to do?',
    servicesCount: '8 Core Services',
    serviceFindCourts: 'Find Courts',
    serviceFindGroups: 'Find Groups',
    serviceCreateGroup: 'Create Group',
    serviceClubTools: 'Club Tools',
    serviceFindCoach: 'Find a Coach',
    serviceTournaments: 'Tournaments',
    serviceActivity: 'Activity',
    serviceLevelQuiz: 'Level Quiz',

    // Line OpenChat Banner
    openChatBadge: 'COMMUNITY CHAT',
    openChatTitle: 'Join Badminton Community OpenChat',
    openChatDesc: 'Find sparring partners, share court deals & live scores with 1,480+ players',
    openChatBtn: 'Join LINE Chat',

    // Book Court Section
    bookCourtTitle: 'Book a Badminton Court',
    bookCourtSub: 'BWF Certified Courts with Instant Digital Pass',
    bookedAgo: 'Booked 5m ago',
    bookableTag: 'Bookable',
    bookCourtBtn: 'Book Court',

    // Discover / Map Screen
    searchMap: 'Search badminton courts...',
    filterParking: 'Parking',
    filterShower: 'Shower',
    filterEv: 'EV charging ⚡',
    filterRental: 'Racket Rental',
    btnShowPrice: 'Show price/hour',
    btnBookable: 'Bookable courts',
    nearbyCourts: 'nearby badminton courts',
    expandList: 'Expand All',
    collapseList: 'Collapse',

    // Club Tools Screen
    clubToolsHeader: 'Tools',
    clubToolsHeaderSub: 'Scoreboard, teams & split bills.',
    backToMenu: '← Tool Menu',
    toolScoreboard: 'Scoreboard v2',
    toolScoreboardDesc: 'Live scorer & service box indicator',
    toolRandomizer: 'Team Randomizer v2',
    toolRandomizerDesc: '50/50 fair matchup squad shuffler',
    toolTactic: 'Tactic Board',
    toolTacticDesc: 'Interactive court formation diagram',
    toolCalc: 'Group Cost Calc',
    toolCalcDesc: 'Automatic split-bill for courts & shuttlecocks',
    quickClubTitle: 'Quick Club Services',
    fridaySquad: 'Friday Night Squad',
    fridaySquadSub: 'RSVP Open · 4 spots left',
    seasonLeaderboard: 'Season Leaderboard',
    seasonLeaderboardSub: 'View team points & tiers',

    // Scoreboard Tool
    scorerSet: 'Set',
    scorerBestOf: 'Best of 3 Sets',
    teamA: 'TEAM A',
    teamB: 'TEAM B',
    pointBtn: '+1 Point',
    setsWon: 'Sets Won',
    resetSetBtn: 'Reset Current Set',
    openFullScorer: 'Open Full Match Scorer',

    // Randomizer Tool
    randomizerHeader: 'Fair Play Team Randomizer',
    shuffleBtn: 'Shuffle Teams',
    court1: 'Court 1',
    balanceRate: 'Matchup Balance',
    balanceDesc: '50/50 Fair matchup, closely matched skill',

    // Tactic Tool
    tacticHeader: 'Tactic Board',
    formationAttack: 'Front-Back (Attack)',
    formationDefense: 'Side-Side (Defense)',
    tacticAttackDesc: 'Attack Plan: Front player intercepts net drops, back player executes jump smashes',
    tacticDefenseDesc: 'Defense Plan: Players stand parallel to block and counter steep smashes',

    // Cost Calc Tool
    calcHeader: 'Automatic Split-Bill Estimator',
    equalSplit: 'Split Equally',
    courtHoursLabel: 'Court Rental Time',
    shuttleTubesLabel: 'Shuttlecock Tubes',
    playersLabel: 'Total Players Present',
    totalExpenseLabel: 'Total Session Expense',
    perPersonLabel: 'Estimated Cost Per Player',
    calcFormulaDesc: 'Calculated from court hours and shuttlecock tubes across attendees',
    shareToRsvpBtn: 'Share Bill to Event RSVP',

    // Finance Screen
    financeHeader: 'Finance',
    financeHeaderSub: 'Wallet balance & court receipts.',
    zeroFeesBadge: 'Zero Fees for Badminton Courts',
    payLaterTitle: 'PayLater Credit',
    creditBadge: 'Available Limit',
    topUpAction: 'Top up',
    transferAction: 'Transfer',
    recommendedTitle: 'Recommended for you',
    promoCashback: 'Get 10% cashback on wallet top-up',
    promoTrueMoney: 'Pay easily with TrueMoney & PromptPay',
    recentTxTitle: 'Recent Transactions',
    viewAllTx: 'View All',
    completedStatus: 'Completed',
    topUpModalTitle: 'Top Up SmashPay Wallet',
    selectAmount: 'Select Top-Up Amount',
    topUpPromptPayBtn: 'Confirm Top-Up via PromptPay QR',
    topUpSuccessMsg: 'Top-up successful! Wallet balance updated.',

    // Settings Modal
    settingsLanguage: 'Language',
    settingsTheme: 'Theme & Style',
    settingsSound: 'Sound Effects',
    thaiLang: 'Thai (TH)',
    engLang: 'English (EN)',
  },
};
