import type { Material } from '../types';
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const textArray = (v: unknown): v is string[] => Array.isArray(v) && v.every(text);
export function validAnalysis(v: unknown): v is Pick<Material, 'title' | 'summary' | 'flashcards' | 'quizQuestions' | 'conceptMap' | 'aiExplanation'> {
  if (!object(v) || !text(v.title) || !object(v.summary)) return false;
  const s = v.summary;
  if (!text(s.simpleOverview) || !textArray(s.bulletPoints) || !Array.isArray(s.keyTerms) || !s.keyTerms.every(t => object(t) && text(t.term) && text(t.definition))) return false;
  if (!Array.isArray(v.flashcards) || !v.flashcards.every(c => object(c) && text(c.question) && text(c.answer))) return false;
  if (!Array.isArray(v.quizQuestions) || !v.quizQuestions.every(q => object(q) && text(q.question) && textArray(q.options) && q.options.length >= 2 && Number.isInteger(q.correctIndex) && Number(q.correctIndex) >= 0 && Number(q.correctIndex) < q.options.length && text(q.explanation))) return false;
  if (!Array.isArray(v.conceptMap) || !v.conceptMap.every(c => object(c) && text(c.id) && text(c.label) && typeof c.description === 'string' && textArray(c.connections))) return false;
  return typeof v.aiExplanation === 'string';
}
