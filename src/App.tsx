/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStatement } from './components/TrustStatement';
import { ProductsSection } from './components/ProductsSection';
import { ServicesSection } from './components/ServicesSection';
import { FeatureSection } from './components/FeatureSection';
import { StatisticsSection } from './components/StatisticsSection';
import { AboutSection } from './components/AboutSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { ProjectInquiryModal } from './components/ProjectInquiryModal';
import { ResourceModal } from './components/ResourceModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { NeubytrixMainApp } from './components/NeubytrixMainApp';
import { ProductItem, ServiceItem, ThemeMode, RegisteredUser, UserProfile } from './types';
import { initialProfile } from './data/defaultData';
import { verifyFirestoreConnection } from './services/firebase';

export default function App() {
  // Theme state: defaults to 'dark'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neubytrix-theme') as ThemeMode;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neubytrix-current-user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // View state: 'landing' or 'dashboard'
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // User profile state for NeubytrixID - Main
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neubytrix-user-profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return initialProfile;
  });

  // Track if Onboarding (Langkah 1-6) is active (only opened when explicitly requested)
  const [isOnboardingActive, setIsOnboardingActive] = useState<boolean>(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [modalInitialMode, setModalInitialMode] = useState<'register' | 'enter-code'>('register');
  const [resourceModalType, setResourceModalType] = useState<'docs' | 'support' | 'faq' | null>(null);

  // Dynamic document title based on current view
  useEffect(() => {
    if (currentView === 'dashboard') {
      document.title = 'NeubytrixID - Main';
    } else {
      document.title = 'NeubytrixID - Home Page';
    }
  }, [currentView]);

  // Sync theme with HTML document class & localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('neubytrix-theme', theme);
  }, [theme]);

  // Test Firestore connection on boot (Firebase Skill requirement)
  useEffect(() => {
    verifyFirestoreConnection().then((connected) => {
      if (!connected) {
        console.warn('Firestore database is initializing or running in offline mode.');
      }
    });
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenAuthModal = (mode: 'register' | 'enter-code' = 'register') => {
    setModalInitialMode(mode);
    setIsProjectModalOpen(true);
  };

  const handleLoginSuccess = (user: RegisteredUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('neubytrix-current-user', JSON.stringify(user));
    } catch (err) {
      console.error(err);
    }

    // Update user profile name
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        name: user.fullName || prev.name,
        email: user.email || prev.email,
      };
      try {
        localStorage.setItem('neubytrix-user-profile', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    // Check if user has already completed onboarding
    const saved = localStorage.getItem('neubytrix-user-profile');
    let completed = false;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        completed = !!parsed.onboardingCompleted;
      } catch (e) {}
    }

    if (!completed) {
      setIsOnboardingActive(true);
    } else {
      setIsOnboardingActive(false);
    }

    // Langsung arahkan ke dashboard
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('neubytrix-current-user');
    } catch (err) {
      console.error(err);
    }
    setCurrentView('landing');
  };

  const handleScrollToSection = (sectionId: string) => {
    if (currentView === 'dashboard') {
      setCurrentView('landing');
      setTimeout(() => {
        const cleanId = sectionId.replace('#', '');
        const element = document.getElementById(cleanId);
        if (element) {
          const navHeight = 72;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 100);
      return;
    }

    const cleanId = sectionId.replace('#', '');
    const element = document.getElementById(cleanId);
    if (element) {
      const navHeight = 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenProjectWithService = (_service: ServiceItem) => {
    handleOpenAuthModal('register');
  };

  // If Onboarding is active, render OnboardingFlow immediately
  if (isOnboardingActive) {
    return (
      <div id="neubytrix-onboarding-view">
        <OnboardingFlow
          initialUser={currentUser}
          initialProfile={userProfile}
          theme={theme}
          onToggleTheme={toggleTheme}
          onComplete={(updatedProfile) => {
            setUserProfile(updatedProfile);
            setIsOnboardingActive(false);

            // Establish active session if guest completed onboarding
            if (!currentUser) {
              const defaultUser: RegisteredUser = {
                fullName: updatedProfile.name || 'Pelajar Neubytrix',
                email: updatedProfile.email || 'siswa@neubytrix.id',
                code: 'NBT-2026-STUDENT',
                createdAt: new Date().toISOString(),
                role: 'NeubytrixID Verified Member',
              };
              setCurrentUser(defaultUser);
              try {
                localStorage.setItem('neubytrix-current-user', JSON.stringify(defaultUser));
              } catch (e) {}
            }

            try {
              localStorage.setItem('neubytrix-user-profile', JSON.stringify(updatedProfile));
            } catch (err) {
              console.error(err);
            }

            // Setelah itu, masuk ke halaman utama , dan pengguna siap menggunakan & belajar!
            setCurrentView('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExit={() => setIsOnboardingActive(false)}
        />
      </div>
    );
  }

  // If in dashboard view and user is authenticated, render NeubytrixID - Main
  if (currentView === 'dashboard' && currentUser) {
    return (
      <div id="neubytrix-main-app-view">
        <NeubytrixMainApp
          user={currentUser}
          profile={userProfile}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={handleLogout}
          onViewHomePage={() => setCurrentView('landing')}
          onReopenOnboarding={() => setIsOnboardingActive(true)}
        />
      </div>
    );
  }

  return (
    <div
      id="neubytrix-app"
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-[#090A0F] text-slate-100'
          : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Top sticky navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenProjectModal={(mode) => handleOpenAuthModal(mode || 'register')}
        currentUser={currentUser}
        onGoToDashboard={() => setCurrentView('dashboard')}
        onOpenOnboarding={() => setIsOnboardingActive(true)}
      />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10">
        {/* 1. Hero Section (matching the screenshot) */}
        <Hero
          onExploreClick={() => handleScrollToSection('products')}
          onGetStartedClick={() => handleOpenAuthModal('register')}
          onStartOnboarding={() => setIsOnboardingActive(true)}
        />

        {/* 2. Trust / Brand Statement */}
        <TrustStatement />

        {/* 3. Products Section */}
        <ProductsSection
          onLearnMore={(product) => setSelectedProduct(product)}
        />

        {/* 4. Services Section */}
        <ServicesSection
          onSelectService={handleOpenProjectWithService}
        />

        {/* 5. Feature Section with Asymmetric Layout & Interactive Panel */}
        <FeatureSection />

        {/* 6. Statistics Section */}
        <StatisticsSection />

        {/* 7. About Section with Isometric Graphics */}
        <AboutSection />

        {/* 8. Call To Action Section */}
        <CtaSection
          onStartProject={() => handleOpenAuthModal('register')}
          onContactUs={() => handleOpenAuthModal('enter-code')}
        />
      </main>

      {/* 9. Multi-Column Footer */}
      <Footer
        onNavClick={handleScrollToSection}
        onOpenModal={(type) => setResourceModalType(type)}
      />

      {/* Interactive Modals */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onGetStarted={() => {
          setSelectedProduct(null);
          handleOpenAuthModal('register');
        }}
      />

      {/* Authentication & Code Access Modal */}
      <ProjectInquiryModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={modalInitialMode}
      />

      <ResourceModal
        type={resourceModalType}
        onClose={() => setResourceModalType(null)}
        onContactUs={() => {
          handleOpenAuthModal('register');
        }}
      />
    </div>
  );
}
