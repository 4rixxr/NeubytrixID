import React, { useState, useEffect } from 'react';
import { Menu, Bell, Flame, Zap, Globe, Database, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { NeubytrixLogoIcon } from './Logo';
import { auth, onAuthUserChanged, signInWithGoogle, logOutFromFirebase } from '../services/firebase';
import { User } from 'firebase/auth';

interface HeaderProps {
  profile: UserProfile;
  onOpenMobileMenu: () => void;
  onOpenProfile: () => void;
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenMobileMenu,
  onOpenProfile,
  onOpenNotifications,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(auth.currentUser);

  useEffect(() => {
    const unsub = onAuthUserChanged((u) => setFirebaseUser(u));
    return () => unsub();
  }, []);

  const handleGoogleAuth = async () => {
    if (firebaseUser) {
      // already signed in, open profile
      onOpenProfile();
    } else {
      try {
        await signInWithGoogle();
      } catch (err: any) {
        console.warn('Header Google signin popup blocked or dismissed:', err);
        // Open profile dialog so user can manage credentials or copy login code
        onOpenProfile();
      }
    }
  };

  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'B';

  return (
    <header
      id="neubytrix-header"
      className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/85 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-3 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left side: Hamburger & School level badge */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle-btn"
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/40 md:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <NeubytrixLogoIcon size={30} />
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-baseline">
              <span>Neubytrix</span><span className="text-indigo-600 dark:text-indigo-400 font-black">ID</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            <span>{profile.schoolLevel} • {profile.grade}</span>
          </div>
        </div>

        {/* Right side: Google Auth Sync, Streak pill, XP pill, Bell, Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Firebase Google Auth Button */}
          {firebaseUser ? (
            <div
              title={`Tersambung ke Cloud Firestore (${firebaseUser.email})`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="truncate max-w-[120px]">{firebaseUser.displayName || 'Cloud Synced'}</span>
            </div>
          ) : (
            <button
              id="header-google-signin-btn"
              onClick={handleGoogleAuth}
              title="Masuk dengan Google untuk sinkronkan data & dokumen ke Firestore"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Google Sign-In</span>
            </button>
          )}

          {/* Streak pill */}
          <div
            id="header-streak-pill"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800/90 text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 dark:text-amber-400 dark:fill-amber-400" />
            <span>{profile.streakDays} Hari</span>
          </div>

          {/* XP pill */}
          <div
            id="header-xp-pill"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-purple-50 dark:bg-slate-900 border border-purple-200 dark:border-slate-800/90 text-xs font-semibold text-purple-700 dark:text-purple-400 shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-purple-600 fill-purple-600 dark:text-purple-400 dark:fill-purple-400" />
            <span>{profile.xp} XP</span>
          </div>

          {/* Notifications bell with badge */}
          <button
            id="header-bell-btn"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            aria-label="Pemberitahuan"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-950"></span>
          </button>

          {/* User avatar circle with photo or first initial */}
          <button
            id="header-avatar-btn"
            onClick={onOpenProfile}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full avatar-gradient-bg text-white font-bold text-sm flex items-center justify-center shadow-md shadow-purple-600/30 hover:ring-2 hover:ring-purple-400 transition-all focus:outline-none cursor-pointer overflow-hidden"
            aria-label="Buka profil akun"
          >
            {firebaseUser?.photoURL ? (
              <img src={firebaseUser.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              initial
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

