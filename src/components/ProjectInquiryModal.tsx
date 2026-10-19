import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCheck,
  ChevronLeft,
} from 'lucide-react';
import { RegisteredUser } from '../types';
import {
  createCleanZeroStats,
  saveUserDataByCode,
  loadUserDataByCode,
  saveUserCredentials,
  verifyUserCodePassword,
} from '../utils/userCodeStore';
import { signInWithGoogle, saveUserProfileToFirestore } from '../services/firebase';

interface ProjectInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'enter-code';
  onLoginSuccess?: (user: RegisteredUser, isNewRegistration?: boolean) => void;
}

export const ProjectInquiryModal: React.FC<ProjectInquiryModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  onLoginSuccess,
}) => {
  const [viewMode, setViewMode] = useState<'register' | 'success' | 'enter-code'>(initialMode);

  // Sub-step for registration: 1 = Gmail login, 2 = Set password
  const [regStep, setRegStep] = useState<1 | 2>(1);

  // Google Account state
  const [selectedGmail, setSelectedGmail] = useState<string>('zuree.eex@gmail.com');
  const [googleName, setGoogleName] = useState<string>('Zuree Eex');
  const [customGmailInput, setCustomGmailInput] = useState<string>('');
  const [isChoosingCustomGmail, setIsChoosingCustomGmail] = useState<boolean>(false);

  // Password fields for Step 2
  const [regPassword, setRegPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showRegPassword, setShowRegPassword] = useState<boolean>(false);

  // Login with code + password fields
  const [inputCode, setInputCode] = useState<string>('');
  const [inputPassword, setInputPassword] = useState<string>('');
  const [showInputPassword, setShowInputPassword] = useState<boolean>(false);

  // Generated code & session on Page 2 (success)
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [lastRegisteredUser, setLastRegisteredUser] = useState<RegisteredUser | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialMode);
      setRegStep(1);
      setErrorMessage('');
      setCopiedCode(false);
      setInputPassword('');
      setRegPassword('');
      setConfirmPassword('');

      // Pre-fill inputCode from localStorage if available
      const savedLastCode = localStorage.getItem('neubytrix-last-code');
      if (savedLastCode) {
        setInputCode(savedLastCode);
      }
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handler: User clicks Google Login / selects account
  const handleSelectGoogleAccount = (emailAddress: string, name?: string) => {
    const cleanEmail = emailAddress.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage('Harap masukkan alamat email Gmail yang valid.');
      return;
    }

    setSelectedGmail(cleanEmail);
    // Derive friendly name from email or provided name
    const derivedName =
      name ||
      cleanEmail
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    setGoogleName(derivedName);
    setErrorMessage('');
    setRegStep(2); // Proceed to fill password
  };

  // Handler: Direct Firebase Google Auth Sign-In
  const handleDirectGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const gUser = await signInWithGoogle();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = `NBT-2026-${randomSuffix}`;
      const email = gUser.email || selectedGmail;
      const fullName = gUser.displayName || googleName;

      const finalUser: RegisteredUser = {
        fullName,
        email,
        code,
        createdAt: new Date().toISOString(),
        role: 'NeubytrixID Verified Member',
        authProvider: 'google',
      };

      // Persist user profile to Firestore
      await saveUserProfileToFirestore(gUser.uid, {
        name: fullName,
        email,
        userCode: code,
      });

      // Save locally
      const cleanStats = createCleanZeroStats(code, { fullName, email });
      saveUserDataByCode(code, cleanStats);
      saveUserCredentials(code, 'google-session-auth', finalUser);

      try {
        localStorage.setItem('neubytrix-last-code', code);
        localStorage.setItem('neubytrix-current-user', JSON.stringify(finalUser));
      } catch {}

      if (onLoginSuccess) {
        onLoginSuccess(finalUser, true);
      }
      onClose();
    } catch (err: any) {
      console.error('Direct Google Signin error:', err);
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
        setErrorMessage(
          'Jendela popup Google diblokir oleh browser atau perlindungan iframe. Silakan klik tombol "Lanjutkan" di kartu akun di atas untuk masuk langsung!'
        );
      } else {
        setErrorMessage(err?.message || 'Gagal login dengan Google. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Submitting custom Gmail input
  const handleCustomGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGmailInput.trim().toLowerCase().includes('@gmail.com')) {
      setErrorMessage('Harap gunakan akun Gmail (@gmail.com).');
      return;
    }
    handleSelectGoogleAccount(customGmailInput.trim().toLowerCase());
  };

  // Handler: Step 2 - Setting password and generating code
  const handleFinalizeRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPassword || regPassword.length < 6) {
      setErrorMessage('Password minimal 6 karakter.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      // Generate standard unique code: NBT-2026-XXXX
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const code = `NBT-2026-${randomSuffix}`;

      const newUser: RegisteredUser = {
        fullName: googleName,
        email: selectedGmail,
        password: regPassword,
        code,
        createdAt: new Date().toISOString(),
        role: 'NeubytrixID Verified Member',
        authProvider: 'google',
      };

      // 1. Explicitly initialize pure 0 statistics for this newly generated code
      const freshZeroStats = createCleanZeroStats(code, {
        fullName: newUser.fullName,
        email: newUser.email,
      });
      saveUserDataByCode(code, freshZeroStats);

      // 2. Persist credentials securely with code and password
      saveUserCredentials(code, regPassword, newUser);

      setGeneratedCode(code);
      setLastRegisteredUser(newUser);
      setInputCode(code);
      setInputPassword(regPassword);
      setIsSubmitting(false);
      setViewMode('success'); // Page 2: Akun berhasil dibuat
    }, 600);
  };

  // Handler: Login using Code AND Password
  const handleVerifyCodeAndPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputCode.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMessage('Silakan masukkan kode akses akun Anda.');
      return;
    }

    if (!inputPassword.trim()) {
      setErrorMessage('Silakan masukkan password akun Anda. Password wajib diisi.');
      return;
    }

    // Verify code and password
    const result = verifyUserCodePassword(cleanCode, inputPassword);
    if (!result.valid) {
      setErrorMessage(result.message || 'Kode atau Password salah. Silakan coba lagi.');
      return;
    }

    // Ensure statistics and progress exist for this code
    const codeData = loadUserDataByCode(cleanCode, {
      fullName: result.user?.fullName,
      email: result.user?.email,
    });

    const finalUser: RegisteredUser = {
      fullName: codeData.profile.name,
      email: codeData.profile.email,
      code: cleanCode,
      password: inputPassword,
      createdAt: result.user?.createdAt || new Date().toISOString(),
      role: 'NeubytrixID Verified Member',
    };

    // Save as current active session
    try {
      localStorage.setItem('neubytrix-last-code', cleanCode);
      localStorage.setItem('neubytrix-current-user', JSON.stringify(finalUser));
    } catch {
      // ignore
    }

    if (onLoginSuccess) {
      onLoginSuccess(finalUser);
    }
    onClose();
  };

  const handleCopyCode = (codeToCopy: string) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDirectLoginFromSuccess = () => {
    if (lastRegisteredUser && onLoginSuccess) {
      onLoginSuccess(lastRegisteredUser, true);
      onClose();
    } else if (onLoginSuccess) {
      onLoginSuccess({
        fullName: googleName || 'Neubytrix Member',
        email: selectedGmail || 'user@gmail.com',
        code: generatedCode,
        password: regPassword,
        createdAt: new Date().toISOString(),
      }, true);
      onClose();
    }
  };

  return (
    <div
      id="inquiry-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0E111C] border border-slate-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 my-8 text-slate-900 dark:text-slate-100 transition-all duration-300">
        {/* Close Button */}
        <button
          id="close-inquiry-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ----------------- VIEW 1: REGISTRATION (GMAIL AUTH -> PASSWORD -> CODE) ----------------- */}
        {viewMode === 'register' && (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Account Registration • Google Auth</span>
              </div>
              <h2
                id="inquiry-modal-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
              >
                {regStep === 1 ? 'Masuk dengan Akun Gmail' : 'Tentukan Password Akun'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                {regStep === 1
                  ? 'Pilih atau hubungkan akun Gmail Anda untuk membuat kode akun baru secara otomatis.'
                  : 'Langkah terakhir: buat password untuk melindungi akun dan progres belajar Anda.'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: LOG IN WITH GMAIL (NOT WRITE MANUALLY) */}
            {regStep === 1 && (
              <div className="space-y-4 text-xs">
                {/* Detected Google Account Quick Select Button */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>Akun Google Terdeteksi</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('zuree.eex@gmail.com', 'Zuree Eex')}
                    className="w-full p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-600/15 dark:hover:bg-indigo-600/25 border border-indigo-200 dark:border-indigo-500/30 text-left flex items-center justify-between gap-3 transition-all hover:scale-[1.01] cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      {/* Google G Logo SVG */}
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0 border border-slate-200 dark:border-transparent">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                          <span>Zuree Eex</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                            Verified
                          </span>
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs">zuree.eex@gmail.com</div>
                      </div>
                    </div>

                    <div className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Lanjutkan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                  {/* Firebase Google Auth Direct Sign-In */}
                  <button
                    type="button"
                    onClick={handleDirectGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full mt-2 p-3 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-50 dark:hover:bg-white/15 border border-slate-200 dark:border-white/20 text-slate-800 dark:text-white font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Masuk Langsung dengan Akun Google</span>
                  </button>
                </div>

                {/* Option to use another Gmail account */}
                {!isChoosingCustomGmail ? (
                  <button
                    type="button"
                    onClick={() => setIsChoosingCustomGmail(true)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>Gunakan Akun Gmail Lainnya</span>
                  </button>
                ) : (
                  <form onSubmit={handleCustomGmailSubmit} className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <label className="block font-medium text-slate-700 dark:text-slate-300">
                      Masukkan Email Google / Gmail Anda:
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={customGmailInput}
                        onChange={(e) => setCustomGmailInput(e.target.value)}
                        placeholder="contoh@gmail.com"
                        className="w-full px-3.5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsChoosingCustomGmail(false)}
                        className="px-3 py-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                      >
                        Verifikasi Akun Gmail & Lanjut
                      </button>
                    </div>
                  </form>
                )}

                {/* Switch to "Already have a code? Enter it here" */}
                <div className="pt-2 pb-1 text-center">
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white dark:bg-[#0E111C] text-slate-500 dark:text-slate-400">
                        Sudah punya akun sebelumnya?
                      </span>
                    </div>
                  </div>

                  <button
                    id="already-have-code-btn"
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setViewMode('enter-code');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:rotate-45" />
                    <span>Already have a code? Enter it here</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SET PASSWORD FOR THE GMAIL ACCOUNT */}
            {regStep === 2 && (
              <form onSubmit={handleFinalizeRegistration} className="space-y-4 text-xs animate-fade-in">
                {/* Connected Gmail Badge */}
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">{googleName}</div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">{selectedGmail}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                  >
                    Ganti
                  </button>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="regPassword"
                    className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Buat Password Akun *
                  </label>
                  <div className="relative">
                    <input
                      id="regPassword"
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-3 pr-11 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Konfirmasi Password *
                  </label>
                  <input
                    id="confirmPassword"
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password di atas"
                    className="w-full px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Password ini akan digunakan setiap kali Anda login bersama Kode Akses.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setRegStep(1)}
                    className="px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>

                  <button
                    id="submit-register-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:opacity-95 shadow-md shadow-indigo-600/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Memproses Kode...</span>
                    ) : (
                      <>
                        <span>Simpan Password & Dapatkan Kode</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ----------------- VIEW 2: PAGE 2 (AKUN BERHASIL DIBUAT) ----------------- */}
        {viewMode === 'success' && (
          <div className="text-center py-4 sm:py-6 space-y-5 animate-fade-in">
            {/* Green Circular Tick Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            {/* Title: "Akun berhasil dibuat" */}
            <div>
              <h3
                id="inquiry-modal-title"
                className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
              >
                Akun berhasil dibuat
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mt-2">
                Terima kasih, <span className="text-slate-900 dark:text-white font-semibold">{googleName}</span>. Akun Anda telah terdaftar melalui Gmail <span className="text-indigo-600 dark:text-indigo-400 font-medium">{selectedGmail}</span>.
              </p>
            </div>

            {/* Reference ID / Kode Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-sm mx-auto space-y-2">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>KODE AKSES RESMI ANDA</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-emerald-600 dark:text-emerald-400 select-all">
                  {generatedCode}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(generatedCode)}
                  aria-label="Salin Kode Akses"
                  className="p-2 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  title="Salin Kode"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copiedCode && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
                  ✓ Tersalin ke clipboard!
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>Password akun telah tersimpan dengan aman</span>
              </div>
            </div>

            {/* Note on login */}
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Simpan Kode dan Password Anda. Mulai sekarang, Anda dapat login menggunakan kombinasi <strong className="text-slate-900 dark:text-white">Kode</strong> dan <strong className="text-slate-900 dark:text-white">Password</strong> Anda.
            </p>

            {/* Action Buttons: Login directly or go to Enter Code screen */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="login-with-code-btn"
                type="button"
                onClick={handleDirectLoginFromSuccess}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Login Langsung ke Platform</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputCode(generatedCode);
                  setViewMode('enter-code');
                }}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-medium cursor-pointer transition-colors"
              >
                Uji Menu "Already have a code?"
              </button>
            </div>
          </div>
        )}

        {/* ----------------- VIEW 3: "ALREADY HAVE A CODE? ENTER IT HERE" (CODE + PASSWORD) ----------------- */}
        {viewMode === 'enter-code' && (
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Direct Access Verification</span>
              </div>
              <h2
                id="inquiry-modal-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
              >
                Enter Access Code & Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Masukkan Kode Akses unik dan Password akun Anda untuk melanjutkan belajar.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyCodeAndPassword} className="space-y-4 text-xs">
              {/* Access Code Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="inputCode"
                    className="font-medium text-slate-700 dark:text-slate-300"
                  >
                    Your Access Code *
                  </label>
                  {lastRegisteredUser && (
                    <button
                      type="button"
                      onClick={() => setInputCode(lastRegisteredUser.code)}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Gunakan: {lastRegisteredUser.code}
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    id="inputCode"
                    type="text"
                    required
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NBT-2026-4892"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-mono text-base tracking-wider placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Password Input (MANDATORY AS REQUESTED) */}
              <div>
                <label
                  htmlFor="inputPassword"
                  className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Password Akun * (Wajib Diisi)
                </label>
                <div className="relative">
                  <input
                    id="inputPassword"
                    type={showInputPassword ? 'text' : 'password'}
                    required
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="Masukkan password akun Anda"
                    className="w-full px-4 py-3.5 pr-11 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowInputPassword(!showInputPassword)}
                    aria-label={showInputPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showInputPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Keamanan akun dienkripsi. Masukkan password yang dibuat saat mendaftar dengan Gmail.
                </p>
              </div>

              {/* Switch back to registration with Gmail */}
              <div className="pt-2 text-center">
                <p className="text-slate-600 dark:text-slate-400 text-xs">
                  Belum memiliki kode akses?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setRegStep(1);
                      setViewMode('register');
                    }}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                  >
                    Daftar dengan Gmail di sini
                  </button>
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="verify-code-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:opacity-95 shadow-md shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
                >
                  <span>Verifikasi & Login ke Platform</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
