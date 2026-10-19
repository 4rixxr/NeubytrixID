import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  Cpu,
  Zap,
  Globe,
  Key,
  Terminal,
  LogOut,
  Copy,
  Check,
  Code2,
  Play,
  Server,
  Layers,
  Activity,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { RegisteredUser, ThemeMode } from '../types';

interface MemberDashboardProps {
  user: RegisteredUser;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout: () => void;
  onViewLandingPage: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  user,
  theme,
  onToggleTheme,
  onLogout,
  onViewLandingPage,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'cloud' | 'sdk' | 'projects'>('ai');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // AI Console State
  const [aiPrompt, setAiPrompt] = useState('Buat arsitektur backend microservice dengan latensi sub-millisecond');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Cloud deployment simulator
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([
    '[00:00:01] Edge cluster initialization: 384 nodes discovered',
    '[00:00:02] Quantum cryptographic handshake: verified (Kyber-1024)',
    '[00:00:03] Routing tables synced with 0.72ms mean ping',
  ]);

  const apiKey = `nbx_live_${user.code.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}_${btoa(user.email).slice(0, 8)}`;

  const handleCopy = (text: string, type: 'code' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const handleRunAi = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/gemini/neural-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          userEmail: user.email,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.output) {
          setAiResponse(data.output);
          setIsGenerating(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Fallback neural inference:', err);
    }

    // Fallback if offline
    setTimeout(() => {
      setAiResponse(
        `// Neubytrix Next-Gen Microservice Architecture (v2026.4)\n` +
        `import { createEdgeMesh, EnclaveGuard } from '@neubytrix/sdk';\n\n` +
        `const mesh = createEdgeMesh({\n` +
        `  region: 'ap-southeast-jakarta',\n` +
        `  quantumSecurity: true,\n` +
        `  maxLatencyMs: 1.0\n` +
        `});\n\n` +
        `export async function handleRequest(req) {\n` +
        `  const verifiedSession = await EnclaveGuard.verify(req.headers['authorization']);\n` +
        `  return mesh.dispatch({\n` +
        `    target: 'neural-inference-v4',\n` +
        `    payload: req.body,\n` +
        `    telemetry: { userId: '${user.email}' }\n` +
        `  });\n` +
        `}\n` +
        `// Status: Optimized • 0.68ms edge execution latency verified`
      );
      setIsGenerating(false);
    }, 600);
  };

  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    const newLog = `[${new Date().toLocaleTimeString()}] Memulai build edge deployment untuk tenant ${user.code}...`;
    setDeployLogs((prev) => [...prev, newLog]);

    setTimeout(() => {
      setDeployLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Mengalokasikan 4x vCPU Edge Workers (Tokyo, Singapore, Frankfurt)...`,
      ]);
    }, 600);

    setTimeout(() => {
      setDeployLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Selesai! Layanan aktif di: https://${user.code.toLowerCase()}.edge.neubytrix.id (Status: Healthy)`,
      ]);
      setIsDeploying(false);
    }, 1400);
  };

  return (
    <div
      id="member-dashboard"
      className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#07090E] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}
    >
      {/* Platform Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#07090E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Brand and platform indicator */}
            <div className="flex items-center gap-4">
              <a
                href="#dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  onViewLandingPage();
                }}
                className="flex items-center gap-2 cursor-pointer"
                title="Lihat Landing Page"
              >
                <Logo size="sm" />
              </a>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span>MEMBER PORTAL OS • 2026.4</span>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                  {user.fullName.charAt(0)}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                    {user.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {user.code}
                  </div>
                </div>
              </div>

              {/* View Landing Page button */}
              <button
                type="button"
                onClick={onViewLandingPage}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <span>Landing Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <ThemeToggle theme={theme} onToggle={onToggleTheme} />

              {/* Logout button */}
              <button
                id="dashboard-logout-btn"
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors focus:outline-none cursor-pointer"
                title="Keluar / Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white dark:from-indigo-900/20 dark:via-purple-900/15 dark:to-transparent overflow-hidden shadow-xl">
          {/* Subtle glow */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>Akun Terverifikasi via Kode</span>
              </div>
              <h1
                className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
                style={{ fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif" }}
              >
                Selamat Datang, {user.fullName}!
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                Sesi autentikasi Anda aktif di platform NeubytrixID. Akses instrumen AI, Cloud Mesh, dan SDK pengembang berkecepatan tinggi.
              </p>
            </div>

            {/* Access Code Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#0F121E] border border-slate-200 dark:border-white/10 shadow-md min-w-[260px]">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>KODE AKSES ANDA</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">AKTIF</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {user.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(user.code, 'code')}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Salin Kode"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <div className="space-y-0.5">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span>Edge Latency</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">0.72 ms</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Neural Quota</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">1,000,000</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                <span>Security Tier</span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">Kyber-1024</div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Global Mesh</span>
              </div>
              <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">384 Nodes OK</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Neural Console</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cloud')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Cloud Mesh & Nodes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sdk'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>API & SDK Tokens</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Project Workspace</span>
          </button>
        </div>

        {/* Tab 1: AI Neural Console */}
        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
            <div className="lg:col-span-5 space-y-4">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0E111C] border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span>Interactive Neural Prompt</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Uji coba kemampuan model inferensi Neubytrix AI 2026 langsung di edge runtime.
                </p>

                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ketik instruksi atau prompt Anda di sini..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />

                  {/* Sample prompt chips */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAiPrompt('Buat arsitektur backend microservice dengan latensi sub-millisecond')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Microservice Mesh
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiPrompt('Audit keamanan smart contract dan zero-knowledge enclave')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Security Audit
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiPrompt('Optimasi WebGL shader untuk 120 FPS di low-end devices')}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-[11px] text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      WebGL Optimization
                    </button>
                  </div>

                  <button
                    id="run-ai-btn"
                    type="button"
                    onClick={handleRunAi}
                    disabled={isGenerating}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    {isGenerating ? (
                      <span>Memproses inferensi neural...</span>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Eksekusi di Edge Engine</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-3xl bg-[#0A0C14] text-slate-100 border border-white/10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
                      <Terminal className="w-4 h-4" />
                      <span>NEURAL RUNTIME OUTPUT (STREAM)</span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400">200 OK • 108ms</span>
                  </div>

                  {aiResponse ? (
                    <pre className="text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed p-2 bg-black/40 rounded-xl border border-white/5">
                      {aiResponse}
                    </pre>
                  ) : (
                    <div className="py-16 text-center text-slate-500 text-xs font-mono">
                      Klik "Eksekusi di Edge Engine" untuk menjalankan inferensi AI langsung ke pipeline.
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Model: Neubytrix-Ultra-2026</span>
                  <span>Enclave: Isolated Memory</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cloud Mesh & Nodes */}
        {activeTab === 'cloud' && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E111C] border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    <span>Global Edge Deployment Nodes</span>
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Routing otomatis ke 380+ lokasi edge server dengan failover otonom.
                  </p>
                </div>
                <button
                  id="deploy-service-btn"
                  type="button"
                  onClick={handleTriggerDeploy}
                  disabled={isDeploying}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{isDeploying ? 'Deploying...' : 'Deploy Microservice'}</span>
                </button>
              </div>

              {/* Node status grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {[
                  { city: 'Jakarta (JKT-01)', ping: '0.45ms', load: '12%', status: 'Online' },
                  { city: 'Singapore (SIN-02)', ping: '0.62ms', load: '18%', status: 'Online' },
                  { city: 'Tokyo (HND-01)', ping: '0.78ms', load: '24%', status: 'Online' },
                  { city: 'Frankfurt (FRA-01)', ping: '1.10ms', load: '31%', status: 'Online' },
                  { city: 'San Jose (SJC-04)', ping: '1.25ms', load: '28%', status: 'Online' },
                ].map((node) => (
                  <div
                    key={node.city}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-slate-900 dark:text-white mb-1">
                      <span>{node.city}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                    </div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">{node.ping}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Beban: {node.load}</div>
                  </div>
                ))}
              </div>

              {/* Console log box */}
              <div className="p-4 rounded-2xl bg-[#090A10] text-slate-300 font-mono text-xs border border-white/10 space-y-1.5 max-h-48 overflow-y-auto">
                <div className="text-slate-500 text-[11px] uppercase tracking-wider mb-2">
                  // Realtime Mesh Event Stream
                </div>
                {deployLogs.map((log, index) => (
                  <div key={index} className="text-slate-300 leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API & SDK */}
        {activeTab === 'sdk' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0E111C] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>Kunci API Pribadi Anda</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Kunci ini dibuat secara otomatis dari kode akses Anda (<span className="font-mono text-indigo-600 dark:text-indigo-400">{user.code}</span>) untuk mengamankan integrasi aplikasi.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 truncate select-all">{apiKey}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(apiKey, 'key')}
                  className="p-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                  title="Salin Kunci API"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="pt-2">
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2">Instalasi SDK:</div>
                <div className="p-3 rounded-xl bg-black/80 dark:bg-black/50 text-emerald-400 font-mono text-xs border border-white/10 select-all">
                  npm install @neubytrix/sdk@latest
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0A0C14] text-slate-100 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="text-xs font-mono text-slate-400">TypeScript Client Example</div>
                <span className="text-[11px] font-mono text-indigo-400">v2.4.0</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`import { Neubytrix } from '@neubytrix/sdk';

const client = new Neubytrix({
  apiKey: '${apiKey}',
  edgeRegion: 'auto'
});

// Contoh query neural streaming
const stream = await client.ai.stream({
  model: 'ultra-fast',
  prompt: 'Analisis performa server'
});`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 4: Project Workspace */}
        {activeTab === 'projects' && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0E111C] border border-slate-200 dark:border-white/10 shadow-sm animate-fade-in space-y-6">
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <span>Project Sprints & Inquiries</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Lacak status proyek pengembangan dan konsultasi teknis Anda bersama tim engineering NeubytrixID.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      Proyek Awal: {user.fullName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                      ONBOARDING
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Terkoneksi via akun {user.email} • Kode: {user.code}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">Status: Siap Kolaborasi</span>
                  <button
                    type="button"
                    onClick={onViewLandingPage}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-white text-xs cursor-pointer transition-colors"
                  >
                    Jelajahi Ekosistem
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
