import React, { useState } from 'react';
import { ArrowLeft, RotateCw, CheckCircle2, XCircle, Sparkles, HelpCircle, Layers } from 'lucide-react';
import { Material, FlashcardItem } from '../types';

interface FlashcardsViewProps {
  material: Material;
  onBack: () => void;
  onAddXp: (amount: number) => void;
  onCardReviewed?: (topic: string, mastered: boolean) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ material, onBack, onAddXp, onCardReviewed }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  const cards = material.flashcards;
  const currentCard: FlashcardItem = cards[currentIndex] || {
    id: 'empty',
    question: 'Belum ada flashcard untuk materi ini.',
    answer: 'Silakan upload materi baru untuk dibuatkan kartu belajar oleh AI.',
  };

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      setLearnedCount((prev) => prev + 1);
      onAddXp(20);
    }
    if (onCardReviewed) {
      onCardReviewed(material.title || 'Umum', mastered);
    }
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div id="neubytrix-flashcards-view" className="space-y-6 pb-20 md:pb-8 max-w-xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Materi</span>
        </button>

        <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/20">
          Kartu {currentIndex + 1} dari {cards.length}
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Active Recall Flashcards 🗂️
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{material.title}</p>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[280px] rounded-3xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all shadow-sm relative overflow-hidden"
      >
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {isFlipped ? '💡 Jawaban / Konsep' : '❓ Pertanyaan'}
          </span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Klik untuk membalik</span>
          </span>
        </div>

        <div className="py-6 text-center">
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {isFlipped ? currentCard.answer : currentCard.question}
          </p>

          {!isFlipped && showHint && currentCard.hint && (
            <p className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 p-2.5 rounded-xl mt-4 max-w-md mx-auto">
              💡 Hint: {currentCard.hint}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Tingkat: {currentCard.difficulty || 'sedang'}</span>
          {!isFlipped && currentCard.hint && !showHint && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHint(true);
              }}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Buka Petunjuk</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => handleNext(false)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400 font-semibold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Masih Ragu</span>
        </button>

        <button
          onClick={() => handleNext(true)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Sudah Paham (+20 XP)</span>
        </button>
      </div>
    </div>
  );
};
