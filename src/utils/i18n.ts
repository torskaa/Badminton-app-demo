export type Language = 'th' | 'en';

export const TRANSLATIONS = {
  th: {
    // Navigation Tabs
    tabHome: 'หน้าแรก',
    tabClub: 'สโมสร',
    tabDiscover: 'ค้นหา',
    tabMore: 'การเงิน',
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
    subGreeting: 'แบดมินตันคือชีวิต ทุกสนามรอคุณอยู่!',
    city: 'กรุงเทพฯ',
    walletTitle: 'กระเป๋าเงิน SmashPay',
    topUpQuick: '+ เติมเงิน',
    nextMatch: 'แมตช์ถัดไป',
    nextMatchDetail: 'คอร์ท 3 เวลา 19:00 น.',
    nextMatchLocation: 'Winner Arena พระราม 9',
    quickFindCourts: 'ค้นหาสนาม',
    quickFindGroups: 'ค้นหาก๊วน',
    groupsLabel: 'ก๊วนเปิดรับ',

    // Services Matrix
    servicesTitle: 'บริการแนะนำสำหรับคุณ',
    servicesCount: '8 บริการหลัก',
    serviceFindCourts: 'ค้นหาสนาม',
    serviceFindGroups: 'ค้นหากลุ่ม',
    serviceCreateGroup: 'สร้างก๊วน',
    serviceClubTools: 'กล่องเครื่องมือ',
    serviceFindCoach: 'หาโค้ชสอน',
    serviceTournaments: 'ทัวร์นาเมนต์',
    serviceActivity: 'กิจกรรมเด่น',
    serviceLevelQuiz: 'วัดระดับฝีมือ',

    // Line OpenChat Banner
    openChatBadge: 'ชุมชนคนตีแบด',
    openChatTitle: 'เข้าร่วม Line OpenChat แอปตีแบด',
    openChatDesc: 'หาเพื่อนตีแบด แชร์โปรคอร์ท และนัดแมตช์สด 1,480 คน',
    openChatBtn: 'เข้ากลุ่ม LINE',

    // Book Court Section
    bookCourtTitle: 'จองคอร์ทแบดมินตัน',
    bookCourtSub: 'สนามแนะนำมาตรฐาน BWF พร้อมระบบจองอัตโนมัติ',
    bookedAgo: 'จองแล้วเมื่อ 5 นาทีก่อน',
    bookableTag: 'เปิดจอง',
    bookCourtBtn: 'จองคอร์ท',

    // Discover / Map Screen
    searchMap: 'ค้นหาสนามแบดมินตัน...',
    filterParking: 'ที่จอดรถ',
    filterShower: 'ห้องอาบน้ำ',
    filterEv: 'EV charging ⚡',
    filterRental: 'บริการเช่าแร็กเกต',
    btnShowPrice: 'แสดงราคา/ชม.',
    btnBookable: 'สนามที่เปิดจอง',
    nearbyCourts: 'สนามแบดมินตันใกล้คุณ',
    expandList: 'ขยายดูทั้งหมด',
    collapseList: 'ย่อลง',

    // Club Tools Screen
    clubToolsHeader: 'กล่องเครื่องมือสโมสร',
    clubToolsHeaderSub: 'ชุดเครื่องมือผู้ช่วยก๊วนและสโมสรแบดมินตัน',
    backToMenu: '← เมนูเครื่องมือ',
    toolScoreboard: 'สมุดบันทึกคะแนน v2',
    toolScoreboardDesc: 'ระบบนับคะแนนสดและตัวช่วยเสิร์ฟ',
    toolRandomizer: 'ระบบสุ่มแบ่งทีม v2',
    toolRandomizerDesc: 'ระบบสุ่มจับคู่ก๊วนสมดุล 50/50',
    toolTactic: 'กระดานแท็กติก',
    toolTacticDesc: 'กระดานจัดตำแหน่งแผนการเล่น',
    toolCalc: 'คำนวณแชร์ค่าใช้จ่าย',
    toolCalcDesc: 'หารค่าคอร์ทและค่าลูกแบดอัตโนมัติ',
    quickClubTitle: 'บริการก๊วนด่วน',
    fridaySquad: 'ก๊วนวันศุกร์นี้',
    fridaySquadSub: 'ลงชื่อเข้าร่วม เหลือ 4 ที่',
    seasonLeaderboard: 'อันดับก๊วนประจำซีซัน',
    seasonLeaderboardSub: 'ดูคะแนนและอันดับทีม',

    // Scoreboard Tool
    scorerSet: 'เซตที่',
    scorerBestOf: 'ระบบ 2 ใน 3 เซต',
    teamA: 'ทีม A',
    teamB: 'ทีม B',
    pointBtn: '+1 แต้ม',
    setsWon: 'เซตที่ชนะ',
    resetSetBtn: 'รีเซ็ตเซตนี้',
    openFullScorer: 'เปิดโหมดบันทึกแต้มเต็ม C1',

    // Randomizer Tool
    randomizerHeader: 'สลับคู่มือสมดุล (Team Randomizer)',
    shuffleBtn: 'สลับคู่ใหม่',
    court1: 'คอร์ท 1',
    balanceRate: 'ความสมดุลคู่แข่ง',
    balanceDesc: 'โอกาสชนะ 50/50 ฝีมือสูสี',

    // Tactic Tool
    tacticHeader: 'กระดานแท็กติก (Tactic Board)',
    formationAttack: 'หน้า-หลัง (บุก)',
    formationDefense: 'ซ้าย-ขวา (รับ)',
    tacticAttackDesc: 'แผนบุก: ผู้เล่นหน้าคุมลูกหยอดดักหน้าเน็ต ผู้เล่นหลังจัมป์ตบทำคะแนน',
    tacticDefenseDesc: 'แผนรับ: ผู้เล่นยืนขนานซ้าย-ขวาเพื่อบล็อกและตัดจังหวะลูกตบสวนกลับ',

    // Cost Calc Tool
    calcHeader: 'ระบบคำนวณหารค่าใช้จ่ายก๊วน',
    equalSplit: 'หารคนละเท่าๆ กัน',
    courtHoursLabel: 'ชั่วโมงคอร์ท',
    shuttleTubesLabel: 'ลูกแบดมินตัน',
    playersLabel: 'จำนวนคนในก๊วน',
    totalExpenseLabel: 'ยอดรวมทั้งหมด',
    perPersonLabel: 'จ่ายคนละประมาณ',
    calcFormulaDesc: 'คำนวณจากค่าคอร์ทและค่าลูกแบดตามจำนวนคนจริง',
    shareToRsvpBtn: 'ส่งบิลนี้ไปยังหน้านัดก๊วน RSVP',

    // Finance Screen
    financeHeader: 'การเงิน & กระเป๋าเงิน',
    financeHeaderSub: 'จัดการค่าใช้จ่ายก๊วนและคอร์ทได้สะดวกในที่เดียว',
    zeroFeesBadge: 'ฟรีค่าธรรมเนียมการจองคอร์ท',
    payLaterTitle: 'วงเงิน PayLater',
    creditBadge: 'วงเงินพร้อมใช้',
    topUpAction: 'เติมเงิน',
    transferAction: 'โอนเงิน',
    recommendedTitle: 'สิทธิพิเศษแนะนำ',
    promoCashback: 'รับเงินคืน 10% เมื่อเติมเงินกระเป๋า',
    promoTrueMoney: 'ชำระง่ายผ่าน TrueMoney และพร้อมเพย์',
    recentTxTitle: 'ประวัติธุรกรรมล่าสุด',
    viewAllTx: 'ดูทั้งหมด',
    completedStatus: 'สำเร็จ',
    topUpModalTitle: 'เติมเงินเข้า SmashPay Wallet',
    selectAmount: 'เลือกจำนวนเงินที่ต้องการเติม',
    topUpPromptPayBtn: 'ยืนยันเติมเงินผ่าน PromptPay QR',
    topUpSuccessMsg: 'เติมเงินสำเร็จ ยอดเงินอัปเดตเรียบร้อย!',

    // Settings Modal
    settingsLanguage: 'ภาษา / Language',
    settingsTheme: 'ธีมสีและรูปแบบ / Theme',
    settingsSound: 'เสียงเอฟเฟกต์ / Retro Sound',
    thaiLang: 'ภาษาไทย (TH)',
    engLang: 'English (EN)',
  },

  en: {
    // Navigation Tabs
    tabHome: 'Home',
    tabClub: 'Club',
    tabDiscover: 'Discover',
    tabMore: 'Finance',
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
    clubToolsHeader: 'Club Tools',
    clubToolsHeaderSub: 'Assistant toolbox for squads & badminton clubs',
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
    openFullScorer: 'Open Full Match Scorer (C1)',

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
    shareToRsvpBtn: 'Share Bill to Event RSVP (E2)',

    // Finance Screen
    financeHeader: 'Finance & Wallet',
    financeHeaderSub: 'Do more with your money with SmashFinance!',
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
