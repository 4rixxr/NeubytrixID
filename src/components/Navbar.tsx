import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { RegisteredUser, ThemeMode } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenProjectModal: (initialMode?: 'register' | 'enter-code') => void;
  currentUser?: RegisteredUser | null;
  onGoToDashboard?: () => void;
  onOpenOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenProjectModal,
  currentUser,
  onGoToDashboard,
  onOpenOnboarding,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['home', 'products', 'services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
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

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3.5 bg-white/90 dark:bg-[#090A0F]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-xs'
          : 'py-5 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            aria-label="NeubytrixID Home"
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg cursor-pointer"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/90 dark:bg-white/[0.04] backdrop-blur-md"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-white bg-slate-900 shadow-xs dark:text-white dark:bg-white/15 dark:shadow-none'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {onOpenOnboarding && (
              <button
                id="nav-onboarding-btn"
                type="button"
                onClick={onOpenOnboarding}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                title="Kenalan dulu dengan cara belajarmu"
              >
                <span>🎓 Onboarding</span>
              </button>
            )}

            {currentUser ? (
              <button
                id="nav-user-dashboard-btn"
                type="button"
                onClick={onGoToDashboard}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 cursor-pointer transition-all border border-indigo-400/30"
              >
                <div className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-white">NeubytrixID - Main</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-enter-code-btn"
                  type="button"
                  onClick={() => onOpenProjectModal('enter-code')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer shadow-xs"
                  title="Already have a code? Enter it here"
                >
                  Enter Code
                </button>

                <button
                  id="nav-cta-btn"
                  type="button"
                  onClick={() => onOpenProjectModal('register')}
                  className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              id="mobile-menu-trigger"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Overlay Menu */}
      <div
        id="mobile-menu-overlay"
        aria-hidden={!mobileMenuOpen}
        className={`md:hidden fixed inset-x-0 top-[65px] bottom-0 z-40 transition-all duration-300 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto backdrop-blur-2xl bg-white/95 dark:bg-[#090A0F]/95'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full overflow-y-auto px-6 py-8 flex flex-col justify-between max-w-md mx-auto">
          <div className="space-y-2">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Navigation
            </div>
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-white bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-white/10 space-y-3">
            {onOpenOnboarding && (
              <button
                id="mobile-onboarding-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenOnboarding();
                }}
                className="w-full py-3 px-4 rounded-xl text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🎓 1. Onboarding: Kenalan dulu dengan cara belajarmu</span>
              </button>
            )}

            {currentUser ? (
              <button
                id="mobile-dashboard-btn"
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onGoToDashboard) onGoToDashboard();
                }}
                className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Masuk ke NeubytrixID - Main</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  id="mobile-cta-btn"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProjectModal('register');
                  }}
                  className="w-full py-3.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Started</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  id="mobile-enter-code-btn"
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProjectModal('enter-code');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Already have a code? Enter it here</span>
                </button>
              </>
            )}
            <div className="text-center text-xs text-slate-400 dark:text-slate-500">
              NeubytrixID Platform • 2026 Release
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
