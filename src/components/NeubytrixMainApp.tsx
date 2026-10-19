import React, { useState, useEffect } from 'react';
import { UserProfile, ThemeMode, RegisteredUser, Material, Achievement, TimelineMilestone, SubjectMastery } from '../types';
import {
  defaultMaterials,
  defaultAchievements,
  defaultTimeline,
  defaultSubjectMastery,
  initialProfile,
} from '../data/defaultData';
import {
  UserCodeData,
  UserLearningData,
  StudyStats,
  loadUserDataByCode,
  saveUserDataByCode,
  addStudySecondsToCode,
  addXpToCode,
  recordQuizAttemptToCode,
  recordFlashcardToCode,
  recordAiQuestionToCode,
  toggleTimelineTargetInCode,
  createCleanZeroStats,
} from '../utils/userCodeStore';
import { Header } from './Header';
import { Sidebar, ExtendedView } from './Sidebar';
import { BottomNav, MainTabType } from './BottomNav';
import { DashboardView } from '../views/DashboardView';
import { MaterialsView } from '../views/MaterialsView';
import { MaterialDetailView } from '../views/MaterialDetailView';
import { FlashcardsView } from '../views/FlashcardsView';
import { QuizView } from '../views/QuizView';
import { AiTutorView } from '../views/AiTutorView';
import { ProgressView } from '../views/ProgressView';
import { TimelineView } from '../views/TimelineView';
import { SettingsView } from '../views/SettingsView';

interface NeubytrixMainAppProps {
  user: RegisteredUser;
  profile: UserProfile;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout: () => void;
  onViewHomePage: () => void;
  onReopenOnboarding: () => void;
}

export const NeubytrixMainApp: React.FC<NeubytrixMainAppProps> = ({
  user,
  profile: initialUserProf,
  theme,
  onToggleTheme,
  onLogout,
  onViewHomePage,
  onReopenOnboarding,
}) => {
  const userCode = user.code || 'NBT-2026-0001';

  // Load persistent user data specifically keyed to this code
  const [codeData, setCodeData] = useState<UserCodeData>(() => {
    return loadUserDataByCode(userCode, {
      fullName: user.fullName || initialUserProf.name,
      email: user.email || initialUserProf.email,
    });
  });

  // Views
  const [currentView, setCurrentView] = useState<ExtendedView>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // States synchronized with user's specific code store
  const [profile, setProfile] = useState<UserProfile>(codeData.profile);
  const [materials, setMaterials] = useState<Material[]>(codeData.materials);
  const [achievements, setAchievements] = useState<Achievement[]>(codeData.achievements);
  const [timeline, setTimeline] = useState<TimelineMilestone[]>(codeData.timeline);
  const [subjectMastery, setSubjectMastery] = useState<SubjectMastery[]>(codeData.subjectMastery);
  const [studyStats, setStudyStats] = useState<StudyStats>(codeData.studyStats);
  const [activeMaterial, setActiveMaterial] = useState<Material>(codeData.materials[0] || defaultMaterials[0]);

  // When user code changes, reload this code's exact dataset
  useEffect(() => {
    const loaded = loadUserDataByCode(userCode, {
      fullName: user.fullName || initialUserProf.name,
      email: user.email || initialUserProf.email,
    });
    setCodeData(loaded);
    setProfile(loaded.profile);
    setMaterials(loaded.materials);
    setAchievements(loaded.achievements);
    setTimeline(loaded.timeline);
    setSubjectMastery(loaded.subjectMastery);
    setStudyStats(loaded.studyStats);
    setActiveMaterial(loaded.materials[0] || defaultMaterials[0]);
  }, [userCode, user.fullName, user.email]);

  // Real-time active study time tracker
  // Ticks every second, calculates how long the user spends in the app,
  // unlocks daily streak when 5 minutes (300s) is reached, and persists everything to code
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = addStudySecondsToCode(userCode, 1);
      setStudyStats(updated.studyStats);
      setProfile(updated.profile);
      setAchievements(updated.achievements);
    }, 1000);

    return () => clearInterval(interval);
  }, [userCode]);

  // Ensure scroll is immediately reset to top when switching views so headers never clip content
  useEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [currentView]);

  // Sync profile edits to code
  const handleUpdateProfile = (updated: UserProfile) => {
    setProfile(updated);
    setCodeData((prev) => {
      const next = { ...prev, profile: updated };
      saveUserDataByCode(userCode, next);
      return next;
    });
  };

  const handleAddXp = (amount: number) => {
    const updated = addXpToCode(userCode, amount);
    setCodeData(updated);
    setProfile(updated.profile);
    setAchievements(updated.achievements);
  };

  const handlePomodoroComplete = (durationMinutes: number, earnedXp: number) => {
    addStudySecondsToCode(userCode, durationMinutes * 60);
    const updated = addXpToCode(userCode, earnedXp);
    setCodeData(updated);
    setProfile(updated.profile);
    setStudyStats(updated.studyStats);
    setAchievements(updated.achievements);
  };

  const handleCheckInDataUpdated = (updated: UserLearningData) => {
    setCodeData(updated);
    setProfile(updated.profile);
    setStudyStats(updated.studyStats);
    setAchievements(updated.achievements);
  };

  const handleQuizComplete = (correctCount: number, totalCount: number, earnedScore: number) => {
    const updated = recordQuizAttemptToCode(
      userCode,
      totalCount,
      correctCount,
      earnedScore,
      activeMaterial.title
    );
    setCodeData(updated);
    setProfile(updated.profile);
    setStudyStats(updated.studyStats);
    setAchievements(updated.achievements);
    setSubjectMastery(updated.subjectMastery);
  };

  const handleCardReviewed = (_topic: string, mastered: boolean) => {
    const updated = recordFlashcardToCode(userCode, mastered);
    setCodeData(updated);
    setProfile(updated.profile);
    setStudyStats(updated.studyStats);
    setAchievements(updated.achievements);
  };

  const handleAiQuestionAsked = () => {
    const updated = recordAiQuestionToCode(userCode);
    setCodeData(updated);
    setProfile(updated.profile);
    setStudyStats(updated.studyStats);
    setAchievements(updated.achievements);
  };

  const handleToggleTimelineTarget = (month: number, targetIndex: number) => {
    const updated = toggleTimelineTargetInCode(userCode, month, targetIndex);
    setCodeData(updated);
    setTimeline(updated.timeline);
    setProfile(updated.profile);
    setAchievements(updated.achievements);
  };

  const handleAddMaterial = (newMat: Material) => {
    const updatedMats = [newMat, ...materials];
    setMaterials(updatedMats);
    setActiveMaterial(newMat);
    setCodeData((prev) => {
      const next = {
        ...prev,
        materials: updatedMats,
        profile: {
          ...prev.profile,
          materialsLearned: (prev.profile.materialsLearned || 0) + 1,
        },
      };
      saveUserDataByCode(userCode, next);
      return next;
    });
    handleAddXp(50);
  };

  const handleResetData = () => {
    const freshZero = createCleanZeroStats(userCode, {
      fullName: user.fullName || profile.name,
      email: user.email || profile.email,
    });
    saveUserDataByCode(userCode, freshZero);
    setCodeData(freshZero);
    setProfile(freshZero.profile);
    setMaterials(freshZero.materials);
    setAchievements(freshZero.achievements);
    setTimeline(freshZero.timeline);
    setSubjectMastery(freshZero.subjectMastery);
    setStudyStats(freshZero.studyStats);
    setActiveMaterial(freshZero.materials[0] || defaultMaterials[0]);
    setCurrentView('home');
  };

  const handleSelectMaterial = (mat: Material) => {
    setActiveMaterial(mat);
    setCurrentView('material-detail');
  };

  // Map active main tab for bottom navigation
  const getBottomNavTab = (): MainTabType => {
    if (currentView === 'home') return 'home';
    if (currentView === 'materi' || currentView === 'material-detail') return 'materi';
    if (currentView === 'ai') return 'ai';
    if (currentView === 'quiz') return 'quiz';
    if (currentView === 'progress') return 'progress';
    return 'home';
  };

  const handleBottomNavChange = (tab: MainTabType) => {
    setCurrentView(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      id="neubytrix-main-app-container"
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#090A0F] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      } ${profile.isLiquidGlass ? 'backdrop-blur-sm' : ''}`}
    >
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar
        currentView={currentView}
        onChangeView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        onLogout={onLogout}
        onViewHomePage={onViewHomePage}
        onReopenOnboarding={onReopenOnboarding}
      />

      {/* Main Content Area (offset left by sidebar width on desktop) */}
      <div className="md:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          profile={profile}
          onOpenMobileMenu={() => setIsSidebarOpen(true)}
          onOpenProfile={() => {
            setCurrentView('settings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenNotifications={() => {
            alert('Belum ada notifikasi baru hari ini. Terus pertahankan belajarmu!');
          }}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto">
          {currentView === 'home' && (
            <DashboardView
              profile={profile}
              materials={materials}
              achievements={achievements}
              studyStats={studyStats}
              userCode={userCode}
              onDataUpdated={handleCheckInDataUpdated}
              onNavigate={(tab) => {
                setCurrentView(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectMaterial={handleSelectMaterial}
              onAddXp={handleAddXp}
              onPomodoroComplete={handlePomodoroComplete}
            />
          )}

          {currentView === 'materi' && (
            <MaterialsView
              materials={materials}
              userCode={userCode}
              onSelectMaterial={handleSelectMaterial}
              onAddMaterial={handleAddMaterial}
              schoolLevel={profile.schoolLevel}
              grade={profile.grade}
            />
          )}

          {currentView === 'material-detail' && (
            <MaterialDetailView
              material={activeMaterial}
              onBack={() => setCurrentView('materi')}
              onOpenFlashcards={() => setCurrentView('flashcards')}
              onOpenQuiz={() => setCurrentView('quiz')}
              onAskAi={(topic) => {
                setCurrentView('ai');
              }}
            />
          )}

          {currentView === 'flashcards' && (
            <FlashcardsView
              material={activeMaterial}
              onBack={() => setCurrentView('material-detail')}
              onAddXp={handleAddXp}
              onCardReviewed={handleCardReviewed}
            />
          )}

          {currentView === 'quiz' && (
            <QuizView
              material={activeMaterial}
              onBack={() => setCurrentView('material-detail')}
              onAddXp={handleAddXp}
              onQuizComplete={handleQuizComplete}
            />
          )}

          {currentView === 'ai' && (
            <AiTutorView
              profile={profile}
              activeMaterial={activeMaterial}
              userCode={userCode}
              onAddXp={handleAddXp}
              onAiQuestionAsked={handleAiQuestionAsked}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              profile={profile}
              achievements={achievements}
              subjectMastery={subjectMastery}
              studyStats={studyStats}
            />
          )}

          {currentView === 'timeline' && (
            <TimelineView
              timeline={timeline}
              onToggleTarget={handleToggleTimelineTarget}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              profile={profile}
              theme={theme}
              userCode={userCode}
              onToggleTheme={onToggleTheme}
              onUpdateProfile={handleUpdateProfile}
              onResetData={handleResetData}
              onReopenOnboarding={onReopenOnboarding}
            />
          )}
        </main>

        {/* Bottom Navigation for Mobile */}
        <BottomNav
          activeTab={getBottomNavTab()}
          onChangeTab={handleBottomNavChange}
        />
      </div>
    </div>
  );
};
