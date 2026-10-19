import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  FileText,
  Share2,
} from 'lucide-react';
import { Material } from '../types';

interface MaterialDetailViewProps {
  material: Material;
  onBack: () => void;
  onOpenFlashcards: () => void;
  onOpenQuiz: () => void;
  onAskAi: (topic: string) => void;
}

export const MaterialDetailView: React.FC<MaterialDetailViewProps> = ({
  material,
  onBack,
  onOpenFlashcards,
  onOpenQuiz,
  onAskAi,
}) => {
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'istilah' | 'peta'>('ringkasan');

  return (
    <div id="neubytrix-material-detail-view" className="space-y-6 pb-20 md:pb-8">
      {/* Top back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Koleksi Materi</span>
        </button>
      </div>

      {/* Title Header Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            {material.subject}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
            {material.fileType}
          </span>
          {material.supabaseUrl && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <span>☁️</span>
              <span>Supabase Cloud Document</span>
            </span>
          )}
          <span className="text-xs text-slate-500">• {material.uploadDate}</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
          {material.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {material.summary.simpleOverview}
        </p>

        {/* Action bar */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            onClick={onOpenFlashcards}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>🗂️ Flashcards ({material.flashcards.length})</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>❓ Mulai Kuis ({material.quizQuestions.length})</span>
          </button>

          <button
            onClick={() => onAskAi(material.title)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Tanya AI Tutor</span>
          </button>
        </div>
      </div>

      {/* Tabs: Ringkasan, Istilah Kunci, Peta Konsep */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ringkasan')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'ringkasan'
              ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Poin Kunci Ringkasan
        </button>
        <button
          onClick={() => setActiveTab('istilah')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'istilah'
              ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Istilah Penting ({material.summary.keyTerms.length})
        </button>
        <button
          onClick={() => setActiveTab('peta')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'peta'
              ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Peta Konsep ({material.conceptMap.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'ringkasan' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Rangkuman Konseptual Inti</span>
            </h3>
            <ul className="space-y-2.5">
              {material.summary.bulletPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 p-5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Penjelasan Santai AI Tutor</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {material.aiExplanation}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'istilah' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {material.summary.keyTerms.map((kt, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-300">{kt.term}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{kt.definition}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'peta' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {material.conceptMap.map((node) => (
              <div key={node.id} className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{node.label}</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">{node.description}</p>
                {node.connections.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Terhubung ke: {node.connections.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
