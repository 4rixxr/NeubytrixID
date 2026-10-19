import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, Sparkles, RotateCcw } from 'lucide-react';
import { Material, QuizQuestion } from '../types';

interface QuizViewProps {
  material: Material;
  onBack: () => void;
  onAddXp: (amount: number) => void;
  onQuizComplete?: (correctCount: number, totalCount: number, earnedScore: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ material, onBack, onAddXp, onQuizComplete }) => {
  const questions = material.quizQuestions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIndex] || {
    id: 'empty',
    topic: 'Umum',
    difficulty: 'mudah',
    question: 'Belum ada soal kuis.',
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    explanation: 'Upload materi untuk membuat kuis otomatis.',
  };

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
    setIsSubmitted(true);

    if (index === currentQ.correctIndex) {
      setScore((prev) => prev + 25);
      setCorrectCount((prev) => prev + 1);
      onAddXp(50);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      if (onQuizComplete) {
        onQuizComplete(correctCount + (selectedOption === currentQ.correctIndex ? 1 : 0), questions.length, score);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setCorrectCount(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div id="quiz-completed-view" className="space-y-6 pb-20 md:pb-8 max-w-lg mx-auto text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-3xl">
            🏆
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kuis Selesai!</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Kamu telah menyelesaikan latihan soal untuk materi <strong>{material.title}</strong>.
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
            <span className="text-xs text-slate-500 dark:text-slate-400">Total Skor Akhir</span>
            <div className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{score} Poin</div>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:text-slate-900 dark:hover:text-white shadow-xs cursor-pointer"
            >
              Ulangi Kuis
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Kembali ke Materi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="neubytrix-quiz-view" className="space-y-6 pb-20 md:pb-8 max-w-2xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
          Soal {currentIndex + 1} dari {questions.length}
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Latihan Kuis Pemahaman ❓
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{material.title}</p>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentQ.topic}</span>
          <span className="capitalize text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {currentQ.difficulty}
          </span>
        </div>

        <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5 pt-2">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs';
            if (isSubmitted) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200 font-semibold';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500/50 text-rose-800 dark:text-rose-200';
              } else {
                btnStyle = 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/40 text-slate-400 dark:text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt}</span>
                {isSubmitted && idx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                )}
                {isSubmitted && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation when submitted */}
        {isSubmitted && (
          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 space-y-1.5 animate-fadeIn">
            <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pembahasan Konsep:</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      {/* Next button */}
      {isSubmitted && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            {currentIndex < questions.length - 1 ? 'Soal Selanjutnya →' : 'Lihat Hasil Akhir'}
          </button>
        </div>
      )}
    </div>
  );
};
