import {
  UserProfile,
  RegisteredUser,
  Material,
  Achievement,
  TimelineMilestone,
  SubjectMastery,
} from '../types';
import {
  defaultMaterials,
  defaultAchievements,
  defaultTimeline,
  defaultSubjectMastery,
} from '../data/defaultData';

export interface StudyStats {
  totalSecondsSpent: number;
  totalStudyMinutes: number;
  activeSecondsToday: number;
  todayDate: string; // YYYY-MM-DD
  dailyStreakClaimedToday: boolean;
  streakThresholdSeconds: number; // 300 seconds = 5 minutes required to claim daily streak
  quizzesCompleted: number;
  questionsAnswered: number;
  correctQuestionsCount: number;
  accuracy: number;
  flashcardsReviewed: number;
  aiQuestionsAsked: number;
}

export interface DailyCheckInStatus {
  lastCheckInDate: string; // YYYY-MM-DD
  streakDays: number; // Persistent daily login streak
  claimedToday: boolean;
  totalCheckIns: number;
  currentDayInCycle: number; // 1 to 7
  history: string[]; // List of YYYY-MM-DD check-in dates
}

export const CHECK_IN_REWARDS = [
  { day: 1, xp: 25, label: 'Hari 1', title: 'Langkah Awal', icon: '🌱' },
  { day: 2, xp: 35, label: 'Hari 2', title: 'Konsistensi', icon: '⚡' },
  { day: 3, xp: 50, label: 'Hari 3', title: 'Fokus Belajar', icon: '🔥' },
  { day: 4, xp: 65, label: 'Hari 4', title: 'Ritme Hebat', icon: '🎯' },
  { day: 5, xp: 80, label: 'Hari 5', title: 'Mental Juara', icon: '🧠' },
  { day: 6, xp: 100, label: 'Hari 6', title: 'Master Disiplin', icon: '⭐' },
  { day: 7, xp: 150, label: 'Hari 7', title: 'Jackpot Semester!', icon: '👑' },
];

export interface UserLearningData {
  code: string;
  user: RegisteredUser;
  profile: UserProfile;
  materials: Material[];
  achievements: Achievement[];
  timeline: TimelineMilestone[];
  subjectMastery: SubjectMastery[];
  studyStats: StudyStats;
  dailyCheckIn: DailyCheckInStatus;
  lastActiveAt: string;
}

export type UserCodeData = UserLearningData;

export const STREAK_REQUIRED_SECONDS = 300; // 5 Menit Belajar Aktif di Neubytrix.id

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const calculateLevel = (xp: number): { level: number; title: string; nextLevelXp: number } => {
  if (xp < 500) {
    return { level: 1, title: 'Pemula (Siswa Baru)', nextLevelXp: 500 - xp };
  } else if (xp < 1000) {
    return { level: 2, title: 'Penjelajah Konsep', nextLevelXp: 1000 - xp };
  } else if (xp < 1500) {
    return { level: 3, title: 'Pelajar Berbakat', nextLevelXp: 1500 - xp };
  } else if (xp < 2500) {
    return { level: 4, title: 'Cendekiawan Muda', nextLevelXp: 2500 - xp };
  } else {
    const lvl = 5 + Math.floor((xp - 2500) / 1000);
    const nextXp = 1000 - ((xp - 2500) % 1000);
    return { level: lvl, title: 'Master Neubytrix', nextLevelXp: nextXp };
  }
};

/**
 * Creates pure 0 statistics for any newly generated code or new user registration
 */
export const createCleanZeroStats = (
  code: string,
  userInfo?: { fullName?: string; email?: string }
): UserLearningData => {
  const cleanCode = code.trim().toUpperCase();
  const name = userInfo?.fullName || 'Siswa Neubytrix';
  const email = userInfo?.email || `${cleanCode.toLowerCase()}@neubytrix.id`;

  const profile: UserProfile = {
    id: `user_${cleanCode}`,
    name,
    email,
    schoolLevel: 'SMP',
    grade: 'Kelas 8',
    targets: ['Meningkatkan nilai ujian', 'Membangun kebiasaan belajar harian'],
    learningStyles: ['Flashcards', 'Kuis Interaktif', 'AI Tutor'],
    dailyStudyTime: '30 menit/hari (Rekomendasi Standar)',
    xp: 0,
    level: 1,
    levelTitle: 'Pemula (Siswa Baru)',
    streakDays: 0,
    target6MonthProgress: 0,
    isDarkMode: true,
    isLiquidGlass: false,
    onboardingCompleted: false,
    totalStudyMinutes: 0,
    quizzesCompleted: 0,
    materialsLearned: 0,
    tutorStyle: 'Santai, Riang & Penuh Analogi Nyata',
    soundEffects: true,
  };

  const studyStats: StudyStats = {
    totalSecondsSpent: 0,
    totalStudyMinutes: 0,
    activeSecondsToday: 0,
    todayDate: getTodayDateString(),
    dailyStreakClaimedToday: false,
    streakThresholdSeconds: STREAK_REQUIRED_SECONDS,
    quizzesCompleted: 0,
    questionsAnswered: 0,
    correctQuestionsCount: 0,
    accuracy: 0,
    flashcardsReviewed: 0,
    aiQuestionsAsked: 0,
  };

  const materials = defaultMaterials.map((m) => ({
    ...m,
    mastered: false,
  }));

  const achievements: Achievement[] = defaultAchievements.map((a) => ({
    ...a,
    unlocked: false,
    unlockedDate: undefined,
  }));

  const timeline: TimelineMilestone[] = defaultTimeline.map((t) => ({
    ...t,
    status: t.month === 1 ? 'in_progress' : 'upcoming',
    targets: t.targets.map((tgt) => ({
      ...tgt,
      completed: false,
    })),
  }));

  const subjectMastery: SubjectMastery[] = defaultSubjectMastery.map((s) => ({
    ...s,
    percentage: 0,
    masteredTopics: 0,
    grade: 'Pemula',
  }));

  const dailyCheckIn: DailyCheckInStatus = {
    lastCheckInDate: '',
    streakDays: 0,
    claimedToday: false,
    totalCheckIns: 0,
    currentDayInCycle: 1,
    history: [],
  };

  const user: RegisteredUser = {
    fullName: name,
    email,
    code: cleanCode,
    createdAt: new Date().toISOString(),
    role: 'NeubytrixID Verified Member',
  };

  return {
    code: cleanCode,
    user,
    profile,
    materials,
    achievements,
    timeline,
    subjectMastery,
    studyStats,
    dailyCheckIn,
    lastActiveAt: new Date().toISOString(),
  };
};

const getStorageKey = (code: string) => `neubytrix-data-${code.trim().toUpperCase()}`;

/**
 * Save user learning data explicitly keyed by the user's member code
 */
export const saveUserDataByCode = (code: string, data: UserLearningData): void => {
  if (typeof window === 'undefined') return;
  try {
    const key = getStorageKey(code);
    const serialized = JSON.stringify({
      ...data,
      lastActiveAt: new Date().toISOString(),
    });
    localStorage.setItem(key, serialized);

    // Keep active user profile in sync
    localStorage.setItem('neubytrix-user-profile', JSON.stringify(data.profile));
  } catch (err) {
    console.error('Failed to save data for code:', code, err);
  }
};

/**
 * Load user learning data by code. If code does not exist, automatically creates clean 0 statistics and saves it.
 */
export const loadUserDataByCode = (
  code: string,
  userFallback?: { fullName?: string; email?: string }
): UserLearningData => {
  const cleanCode = code.trim().toUpperCase();
  if (typeof window === 'undefined') {
    return createCleanZeroStats(cleanCode, userFallback);
  }

  const key = getStorageKey(cleanCode);
  const existing = localStorage.getItem(key);

  if (!existing) {
    // Generate fresh zero statistics for this code
    const freshData = createCleanZeroStats(cleanCode, userFallback);
    saveUserDataByCode(cleanCode, freshData);
    return freshData;
  }

  try {
    const parsed: UserLearningData = JSON.parse(existing);
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();

    let needsSave = false;

    // Check if new day: reset daily active seconds and streak claimed flag
    if (parsed.studyStats.todayDate !== today) {
      parsed.studyStats.todayDate = today;
      parsed.studyStats.activeSecondsToday = 0;
      parsed.studyStats.dailyStreakClaimedToday = false;
      needsSave = true;
    }

    // Initialize or migrate dailyCheckIn if missing
    if (!parsed.dailyCheckIn) {
      parsed.dailyCheckIn = {
        lastCheckInDate: '',
        streakDays: parsed.profile.streakDays || 0,
        claimedToday: false,
        totalCheckIns: 0,
        currentDayInCycle: 1,
        history: [],
      };
      needsSave = true;
    }

    // Recompute claimedToday dynamically based on today's date
    const claimedToday = parsed.dailyCheckIn.lastCheckInDate === today;
    if (parsed.dailyCheckIn.claimedToday !== claimedToday) {
      parsed.dailyCheckIn.claimedToday = claimedToday;
      needsSave = true;
    }

    // Check if daily streak broke (missed a day between check-ins)
    if (
      parsed.dailyCheckIn.lastCheckInDate &&
      parsed.dailyCheckIn.lastCheckInDate !== today &&
      parsed.dailyCheckIn.lastCheckInDate !== yesterday
    ) {
      // Streak broken if gap is > 1 day
      if (parsed.dailyCheckIn.streakDays > 0) {
        parsed.dailyCheckIn.streakDays = 0;
        parsed.dailyCheckIn.currentDayInCycle = 1;
        needsSave = true;
      }
    }

    if (needsSave) {
      saveUserDataByCode(cleanCode, parsed);
    }

    return parsed;
  } catch (err) {
    console.error('Failed to parse data for code:', cleanCode, err);
    const freshData = createCleanZeroStats(cleanCode, userFallback);
    saveUserDataByCode(cleanCode, freshData);
    return freshData;
  }
};

/**
 * Adds active study time (in seconds) to the code data.
 * When user reaches 300 seconds (5 minutes) active today, unlocks daily streak!
 */
export const addStudySecondsToCode = (
  code: string,
  secondsToAdd: number
): UserLearningData => {
  const data = loadUserDataByCode(code);
  const today = getTodayDateString();

  if (data.studyStats.todayDate !== today) {
    data.studyStats.todayDate = today;
    data.studyStats.activeSecondsToday = 0;
    data.studyStats.dailyStreakClaimedToday = false;
  }

  data.studyStats.totalSecondsSpent += secondsToAdd;
  data.studyStats.activeSecondsToday += secondsToAdd;
  data.studyStats.totalStudyMinutes = Math.floor(data.studyStats.totalSecondsSpent / 60);
  data.profile.totalStudyMinutes = data.studyStats.totalStudyMinutes;

  let justUnlockedStreak = false;

  // Check if daily streak can be claimed (spent >= 5 minutes)
  if (
    data.studyStats.activeSecondsToday >= data.studyStats.streakThresholdSeconds &&
    !data.studyStats.dailyStreakClaimedToday
  ) {
    data.studyStats.dailyStreakClaimedToday = true;
    data.profile.streakDays += 1;

    // Award XP for claiming daily streak
    data.profile.xp += 50;
    const lvlInfo = calculateLevel(data.profile.xp);
    data.profile.level = lvlInfo.level;
    data.profile.levelTitle = lvlInfo.title;

    // Check 7-day streak achievement
    if (data.profile.streakDays >= 7) {
      const ach = data.achievements.find((a) => a.id === 'ach-2');
      if (ach && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedDate = 'Hari ini';
        data.profile.xp += ach.xpReward;
      }
    }
  }

  // Check First Lesson achievement (at least 5 study minutes)
  if (data.studyStats.totalStudyMinutes >= 5) {
    const ach1 = data.achievements.find((a) => a.id === 'ach-1');
    if (ach1 && !ach1.unlocked) {
      ach1.unlocked = true;
      ach1.unlockedDate = 'Hari ini';
      data.profile.xp += ach1.xpReward;
    }
  }

  saveUserDataByCode(code, data);
  return data;
};

/**
 * Add XP to user's code data
 */
export const addXpToCode = (code: string, amount: number): UserLearningData => {
  const data = loadUserDataByCode(code);
  data.profile.xp += amount;
  const lvlInfo = calculateLevel(data.profile.xp);
  data.profile.level = lvlInfo.level;
  data.profile.levelTitle = lvlInfo.title;

  saveUserDataByCode(code, data);
  return data;
};

/**
 * Record quiz attempt into user's code statistics
 */
export const recordQuizAttemptToCode = (
  code: string,
  totalQ: number,
  correctQ: number,
  earnedXp: number,
  subjectName?: string
): UserLearningData => {
  const data = loadUserDataByCode(code);

  data.studyStats.quizzesCompleted += 1;
  data.profile.quizzesCompleted = data.studyStats.quizzesCompleted;
  data.studyStats.questionsAnswered += totalQ;
  data.studyStats.correctQuestionsCount += correctQ;

  if (data.studyStats.questionsAnswered > 0) {
    data.studyStats.accuracy = Math.round(
      (data.studyStats.correctQuestionsCount / data.studyStats.questionsAnswered) * 100
    );
  }

  // Add XP
  data.profile.xp += earnedXp;
  const lvlInfo = calculateLevel(data.profile.xp);
  data.profile.level = lvlInfo.level;
  data.profile.levelTitle = lvlInfo.title;

  // Update subject mastery
  if (subjectName) {
    const sub = data.subjectMastery.find(
      (s) => s.subject.toLowerCase() === subjectName.toLowerCase()
    );
    if (sub) {
      if (sub.masteredTopics < sub.totalTopics) {
        sub.masteredTopics += 1;
      }
      sub.percentage = Math.round((sub.masteredTopics / sub.totalTopics) * 100);
      if (sub.percentage >= 80) sub.grade = 'A';
      else if (sub.percentage >= 60) sub.grade = 'B';
      else if (sub.percentage >= 40) sub.grade = 'C';
      else sub.grade = 'D';
    }
  }

  // Check achievements
  if (data.studyStats.quizzesCompleted >= 5) {
    const ach = data.achievements.find((a) => a.id === 'ach-4');
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      ach.unlockedDate = 'Hari ini';
      data.profile.xp += ach.xpReward;
    }
  }

  saveUserDataByCode(code, data);
  return data;
};

/**
 * Record flashcard interaction
 */
export const recordFlashcardToCode = (
  code: string,
  mastered: boolean
): UserLearningData => {
  const data = loadUserDataByCode(code);
  data.studyStats.flashcardsReviewed += 1;

  if (mastered) {
    data.profile.materialsLearned += 1;
    data.profile.xp += 20;
    const lvlInfo = calculateLevel(data.profile.xp);
    data.profile.level = lvlInfo.level;
    data.profile.levelTitle = lvlInfo.title;
  }

  // Check 100 flashcards achievement
  if (data.studyStats.flashcardsReviewed >= 100) {
    const ach = data.achievements.find((a) => a.id === 'ach-5');
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      ach.unlockedDate = 'Hari ini';
      data.profile.xp += ach.xpReward;
    }
  }

  saveUserDataByCode(code, data);
  return data;
};

/**
 * Record AI question interaction
 */
export const recordAiQuestionToCode = (code: string): UserLearningData => {
  const data = loadUserDataByCode(code);
  data.studyStats.aiQuestionsAsked += 1;
  data.profile.xp += 25;
  const lvlInfo = calculateLevel(data.profile.xp);
  data.profile.level = lvlInfo.level;
  data.profile.levelTitle = lvlInfo.title;

  if (data.studyStats.aiQuestionsAsked >= 25) {
    const ach = data.achievements.find((a) => a.id === 'ach-6');
    if (ach && !ach.unlocked) {
      ach.unlocked = true;
      ach.unlockedDate = 'Hari ini';
      data.profile.xp += ach.xpReward;
    }
  }

  saveUserDataByCode(code, data);
  return data;
};

/**
 * Toggle timeline milestone target and dynamically calculate 6-month progress
 */
export const toggleTimelineTargetInCode = (
  code: string,
  month: number,
  targetIndex: number
): UserLearningData => {
  const data = loadUserDataByCode(code);

  data.timeline = data.timeline.map((m) => {
    if (m.month === month) {
      return {
        ...m,
        targets: m.targets.map((tgt, i) =>
          i === targetIndex ? { ...tgt, completed: !tgt.completed } : tgt
        ),
      };
    }
    return m;
  });

  // Calculate dynamic 6-month progress
  let totalTargets = 0;
  let completedTargets = 0;
  data.timeline.forEach((m) => {
    m.targets.forEach((tgt) => {
      totalTargets++;
      if (tgt.completed) completedTargets++;
    });
  });

  const progressPercentage = totalTargets > 0 ? Math.round((completedTargets / totalTargets) * 100) : 0;
  data.profile.target6MonthProgress = progressPercentage;

  saveUserDataByCode(code, data);
  return data;
};

/**
 * Reset code statistics purely back to 0
 */
export const resetCodeDataToZero = (code: string): UserLearningData => {
  const cleanData = createCleanZeroStats(code);
  saveUserDataByCode(code, cleanData);
  return cleanData;
};

/**
 * Persists registered credentials including password and Google auth info
 */
export const saveUserCredentials = (
  code: string,
  password: string,
  user: RegisteredUser
) => {
  const cleanCode = code.trim().toUpperCase();
  try {
    localStorage.setItem(`neubytrix-pwd-${cleanCode}`, password);
    const storedUsersStr = localStorage.getItem('neubytrix-registered-users');
    const storedUsers: RegisteredUser[] = storedUsersStr ? JSON.parse(storedUsersStr) : [];
    const existingIdx = storedUsers.findIndex((u) => u.code.toUpperCase() === cleanCode);
    const updatedUser = { ...user, code: cleanCode, password };
    if (existingIdx >= 0) {
      storedUsers[existingIdx] = updatedUser;
    } else {
      storedUsers.push(updatedUser);
    }
    localStorage.setItem('neubytrix-registered-users', JSON.stringify(storedUsers));
    localStorage.setItem('neubytrix-last-code', cleanCode);
  } catch (err) {
    console.error('Error saving user credentials:', err);
  }
};

/**
 * Verifies code AND password for login
 */
export const verifyUserCodePassword = (
  code: string,
  password: string
): { valid: boolean; user?: RegisteredUser; message?: string } => {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, message: 'Harap masukkan kode akses akun Anda.' };
  }
  if (!password || !password.trim()) {
    return { valid: false, message: 'Password wajib diisi untuk masuk ke akun Anda.' };
  }

  let storedUsers: RegisteredUser[] = [];
  try {
    const storedStr = localStorage.getItem('neubytrix-registered-users');
    if (storedStr) storedUsers = JSON.parse(storedStr);
  } catch {
    storedUsers = [];
  }

  const user = storedUsers.find((u) => u.code.toUpperCase() === cleanCode);
  const directPwd = localStorage.getItem(`neubytrix-pwd-${cleanCode}`);

  const expectedPassword = user?.password || directPwd;

  if (expectedPassword) {
    if (expectedPassword !== password) {
      return {
        valid: false,
        message: 'Password salah! Harap periksa kembali password akun Anda.',
      };
    }
  } else {
    // If no password registered yet (first time login with a custom code), assign this password
    localStorage.setItem(`neubytrix-pwd-${cleanCode}`, password);
  }

  const finalUser: RegisteredUser = user || {
    fullName: 'Siswa Neubytrix',
    email: `${cleanCode.toLowerCase()}@neubytrix.id`,
    code: cleanCode,
    password,
    createdAt: new Date().toISOString(),
    role: 'NeubytrixID Verified Member',
  };

  return { valid: true, user: finalUser };
};

/**
 * Retrieves the current daily check-in status for a given user code
 */
export const getDailyCheckInStatus = (code: string): DailyCheckInStatus => {
  const data = loadUserDataByCode(code);
  return data.dailyCheckIn;
};

/**
 * Claim daily check-in reward for the current user code.
 * Rewards user with progressive XP, increments persistent streak counter,
 * updates level, and writes persistently into localStorage keyed by member code.
 */
export const claimDailyCheckIn = (
  code: string
): {
  data: UserLearningData;
  xpAwarded: number;
  newStreak: number;
  dayInCycle: number;
  alreadyClaimed: boolean;
  message: string;
} => {
  const cleanCode = code.trim().toUpperCase();
  const data = loadUserDataByCode(cleanCode);
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (!data.dailyCheckIn) {
    data.dailyCheckIn = {
      lastCheckInDate: '',
      streakDays: data.profile.streakDays || 0,
      claimedToday: false,
      totalCheckIns: 0,
      currentDayInCycle: 1,
      history: [],
    };
  }

  // Already claimed today
  if (data.dailyCheckIn.lastCheckInDate === today) {
    return {
      data,
      xpAwarded: 0,
      newStreak: data.dailyCheckIn.streakDays,
      dayInCycle: data.dailyCheckIn.currentDayInCycle || 1,
      alreadyClaimed: true,
      message: 'Kamu sudah melakukan check-in hari ini! Kembali lagi besok untuk reward streak selanjutnya.',
    };
  }

  // Calculate new streak count
  let newStreak = 1;
  if (data.dailyCheckIn.lastCheckInDate === yesterday) {
    newStreak = (data.dailyCheckIn.streakDays || 0) + 1;
  } else {
    // Started fresh or missed day
    newStreak = 1;
  }

  // Day in the 7-day cycle: 1 to 7
  const dayInCycle = ((newStreak - 1) % 7) + 1;
  const rewardItem = CHECK_IN_REWARDS.find((r) => r.day === dayInCycle) || CHECK_IN_REWARDS[0];
  const xpAwarded = rewardItem.xp;

  // Update check-in record
  data.dailyCheckIn.lastCheckInDate = today;
  data.dailyCheckIn.claimedToday = true;
  data.dailyCheckIn.streakDays = newStreak;
  data.dailyCheckIn.totalCheckIns = (data.dailyCheckIn.totalCheckIns || 0) + 1;
  data.dailyCheckIn.currentDayInCycle = dayInCycle;
  if (!data.dailyCheckIn.history) data.dailyCheckIn.history = [];
  if (!data.dailyCheckIn.history.includes(today)) {
    data.dailyCheckIn.history.push(today);
  }

  // Sync profile streakDays & add XP
  data.profile.streakDays = newStreak;
  data.profile.xp += xpAwarded;

  const lvlInfo = calculateLevel(data.profile.xp);
  data.profile.level = lvlInfo.level;
  data.profile.levelTitle = lvlInfo.title;

  // Check 7-day streak achievement
  if (newStreak >= 7) {
    const ach2 = data.achievements.find((a) => a.id === 'ach-2');
    if (ach2 && !ach2.unlocked) {
      ach2.unlocked = true;
      ach2.unlockedDate = 'Hari ini';
      data.profile.xp += ach2.xpReward;
    }
  }

  // Persist to userCodeStore
  saveUserDataByCode(cleanCode, data);

  return {
    data,
    xpAwarded,
    newStreak,
    dayInCycle,
    alreadyClaimed: false,
    message: `🎉 Check-in Hari ke-${dayInCycle} Berhasil! +${xpAwarded} XP telah ditambahkan. Pertahankan streak-mu besok!`,
  };
};


