export type ThemeMode = 'dark' | 'light';

export interface ProductItem {
  id: string;
  name: string;
  category: 'AI Intelligence' | 'Cloud Infrastructure' | 'Creative Studio' | 'Next-Gen Labs';
  badge: string;
  description: string;
  iconName: 'Cpu' | 'Cloud' | 'Layers' | 'Sparkles' | 'Terminal' | 'Shield';
  accentColor: string;
  version: string;
  highlights: string[];
  specs: {
    label: string;
    value: string;
  }[];
  overview: string;
  capabilities: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: 'Globe' | 'Layout' | 'Code2' | 'Bot' | 'Fingerprint' | 'Compass';
  accentColor: string;
  deliverables: string[];
  scopeTimeline: string;
  impactMetrics: string;
  extendedDetails: string;
}

export interface FeaturePillar {
  id: string;
  title: string;
  summary: string;
  badge: string;
  details: string;
  metric: string;
  metricLabel: string;
  iconName: 'Zap' | 'Minimize2' | 'Atom' | 'ShieldCheck' | 'Maximize' | 'Sparkle';
}

export interface StatisticItem {
  id: string;
  label: string;
  tagline: string;
  icon: string;
  subtext: string;
}

export interface RegisteredUser {
  fullName: string;
  email: string;
  password?: string;
  code: string;
  createdAt: string;
  role?: string;
  avatarUrl?: string;
  authProvider?: 'google' | 'manual';
}

export interface ProjectInquiryData {
  fullName: string;
  email: string;
  password?: string;
  code?: string;
  companyOrOrg?: string;
  serviceInterest?: string;
  budgetRange?: string;
  timeline?: string;
  projectOverview?: string;
}

export type SchoolLevel = 'SD' | 'SMP' | 'SMA' | 'SMK' | 'SMA/SMK';

export interface FlashcardItem {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  difficulty?: 'mudah' | 'sedang' | 'sulit';
  status?: 'unseen' | 'learning' | 'good' | 'mastered';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  topic: string;
}

export interface QuizAttempt {
  id: string;
  materialId?: string;
  materialTitle: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  weakTopics: string[];
  aiRecommendation: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  description: string;
  connections: string[];
}

export interface Material {
  id: string;
  title: string;
  subject: string;
  schoolLevel: SchoolLevel;
  grade: string;
  fileType: string;
  originalFileName: string;
  uploadDate: string;
  pagesOrSlides: number;
  mainConceptsCount: number;
  keyTermsCount: number;
  rawText: string;
  summary: {
    simpleOverview: string;
    bulletPoints: string[];
    keyTerms: { term: string; definition: string }[];
  };
  flashcards: FlashcardItem[];
  quizQuestions: QuizQuestion[];
  conceptMap: ConceptNode[];
  aiExplanation: string;
  mastered: boolean;
  supabaseUrl?: string;
  supabaseStoragePath?: string;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
  xpReward: number;
}

export interface TimelineTarget {
  text: string;
  completed: boolean;
}

export interface TimelineMilestone {
  month: number;
  title: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  description: string;
  targets: TimelineTarget[];
}

export type TimelineMonth = TimelineMilestone;

export interface SubjectMastery {
  subject: string;
  percentage: number;
  grade?: string;
  color?: string;
  masteredTopics: number;
  totalTopics: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  schoolLevel: SchoolLevel;
  grade: string;
  targets: string[];
  learningStyles: string[];
  dailyStudyTime: string;
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  target6MonthProgress: number;
  isDarkMode: boolean;
  isLiquidGlass?: boolean;
  onboardingCompleted: boolean;
  totalStudyMinutes: number;
  quizzesCompleted: number;
  materialsLearned: number;
  tutorStyle?: string;
  soundEffects?: boolean;
}
