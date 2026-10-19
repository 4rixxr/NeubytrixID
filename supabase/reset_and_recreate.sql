-- ==============================================================================
-- NEUBYTRIX ID - CLEAN RESET & RECREATE (OPSIONAL / JIKA INGIN BERSIH TOTAL)
-- Gunakan script ini jika tabel 'documents' atau 'materials' lama di Supabase Anda
-- berasal dari project lain dan ingin diganti bersih untuk NeubytrixID.
-- ==============================================================================

-- 1. Hapus tabel lama yang konflik jika ada
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.study_stats CASCADE;
DROP TABLE IF EXISTS public.quiz_attempts CASCADE;
DROP TABLE IF EXISTS public.materials CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. Aktifkan ekstensi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Setup Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', true, 52428800, NULL),
  ('materials', 'materials', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE 
SET public = true;

DROP POLICY IF EXISTS "Public Access for Documents" ON storage.objects;
CREATE POLICY "Public Access for Documents"
ON storage.objects FOR SELECT
USING (bucket_id IN ('documents', 'materials'));

DROP POLICY IF EXISTS "Allow Uploads to Documents" ON storage.objects;
CREATE POLICY "Allow Uploads to Documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('documents', 'materials'));

DROP POLICY IF EXISTS "Allow Update and Delete Documents" ON storage.objects;
CREATE POLICY "Allow Update and Delete Documents"
ON storage.objects FOR ALL
USING (bucket_id IN ('documents', 'materials'));

-- 4. Tabel Users
CREATE TABLE public.users (
  code TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT,
  role TEXT DEFAULT 'NeubytrixID Verified Member',
  auth_provider TEXT DEFAULT 'google',
  school_level TEXT DEFAULT 'SMA',
  grade TEXT DEFAULT 'Kelas 11',
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  level_title TEXT DEFAULT 'Novice Learner',
  streak_days INTEGER DEFAULT 0,
  total_study_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- 5. Tabel Documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  file_url TEXT,
  storage_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_documents_user_code ON public.documents (user_code);
CREATE INDEX idx_documents_created_at ON public.documents (created_at DESC);

-- 6. Tabel Materials
CREATE TABLE public.materials (
  id TEXT PRIMARY KEY,
  user_code TEXT NOT NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  school_level TEXT,
  grade TEXT,
  file_type TEXT,
  original_file_name TEXT,
  upload_date TEXT,
  pages_or_slides INTEGER DEFAULT 1,
  main_concepts_count INTEGER DEFAULT 0,
  key_terms_count INTEGER DEFAULT 0,
  raw_text TEXT,
  summary JSONB DEFAULT '{}'::jsonb,
  flashcards JSONB DEFAULT '[]'::jsonb,
  quiz_questions JSONB DEFAULT '[]'::jsonb,
  concept_map JSONB DEFAULT '[]'::jsonb,
  ai_explanation TEXT,
  mastered BOOLEAN DEFAULT false,
  supabase_url TEXT,
  supabase_storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_materials_user_code ON public.materials (user_code);
CREATE INDEX idx_materials_subject ON public.materials (subject);

-- 7. Tabel Quiz Attempts
CREATE TABLE public.quiz_attempts (
  id TEXT PRIMARY KEY,
  user_code TEXT NOT NULL,
  material_id TEXT,
  material_title TEXT,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  wrong_count INTEGER NOT NULL,
  weak_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_recommendation TEXT,
  attempted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX idx_quiz_attempts_user_code ON public.quiz_attempts (user_code);
CREATE INDEX idx_quiz_attempts_attempted_at ON public.quiz_attempts (attempted_at DESC);

-- 8. Tabel Study Stats
CREATE TABLE public.study_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code TEXT NOT NULL,
  stat_date DATE DEFAULT CURRENT_DATE,
  active_seconds INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  flashcards_reviewed INTEGER DEFAULT 0,
  ai_questions_asked INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()),
  CONSTRAINT unique_user_daily_stat UNIQUE (user_code, stat_date)
);

CREATE INDEX idx_study_stats_user_date ON public.study_stats (user_code, stat_date);

-- 9. Tabel User Achievements
CREATE TABLE public.user_achievements (
  id TEXT NOT NULL,
  user_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 50,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  PRIMARY KEY (user_code, id)
);

CREATE INDEX idx_user_achievements_user ON public.user_achievements (user_code);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow read documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Allow insert documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update documents" ON public.documents FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow read materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Allow insert materials" ON public.materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update materials" ON public.materials FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow read quiz_attempts" ON public.quiz_attempts FOR SELECT USING (true);
CREATE POLICY "Allow insert quiz_attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all study_stats" ON public.study_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all user_achievements" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);
