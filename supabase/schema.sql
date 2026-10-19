-- ==============================================================================
-- NEUBYTRIX ID - SUPABASE DATABASE SCHEMA & STORAGE CONFIGURATION (FIXED)
-- Project URL: https://fqlywgozktuzpyrllqx.supabase.co
-- Run this script in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE STORAGE BUCKETS ('documents' and 'materials')
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', true, 52428800, NULL),
  ('materials', 'materials', true, 52428800, NULL)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- Storage Policies
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


-- ==============================================================================
-- 3. USERS TABLE (Neubytrix Access Code & Credentials)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.users (
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

-- If users table already existed without certain columns, add them safely
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'NeubytrixID Verified Member';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'google';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS school_level TEXT DEFAULT 'SMA';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS grade TEXT DEFAULT 'Kelas 11';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS level_title TEXT DEFAULT 'Novice Learner';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_study_minutes INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_code ON public.users (code);


-- ==============================================================================
-- 4. DOCUMENTS TABLE (Uploaded Files via Neubytrix Cloud Storage)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  file_url TEXT,
  storage_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

-- Crucial: If public.documents already existed in Supabase without user_code, add it first!
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS user_code TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_size BIGINT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS storage_path TEXT;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

-- Now safely create index on user_code
CREATE INDEX IF NOT EXISTS idx_documents_user_code ON public.documents (user_code);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents (created_at DESC);


-- ==============================================================================
-- 5. MATERIALS TABLE (Parsed Curricula, Summaries, Concept Maps)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.materials (
  id TEXT PRIMARY KEY,
  user_code TEXT,
  title TEXT,
  subject TEXT,
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

-- Crucial: Ensure user_code and columns exist if materials table already existed
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS user_code TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS school_level TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS file_type TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS original_file_name TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS upload_date TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS pages_or_slides INTEGER DEFAULT 1;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS main_concepts_count INTEGER DEFAULT 0;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS key_terms_count INTEGER DEFAULT 0;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS raw_text TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS summary JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS flashcards JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS quiz_questions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS concept_map JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS ai_explanation TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS mastered BOOLEAN DEFAULT false;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS supabase_url TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS supabase_storage_path TEXT;
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());
ALTER TABLE public.materials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

CREATE INDEX IF NOT EXISTS idx_materials_user_code ON public.materials (user_code);
CREATE INDEX IF NOT EXISTS idx_materials_subject ON public.materials (subject);


-- ==============================================================================
-- 6. QUIZ ATTEMPTS TABLE (Exam & Diagnostic Quiz History)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id TEXT PRIMARY KEY,
  user_code TEXT,
  material_id TEXT,
  material_title TEXT,
  score INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  weak_topics TEXT[] DEFAULT ARRAY[]::TEXT[],
  ai_recommendation TEXT,
  attempted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS user_code TEXT;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS material_id TEXT;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS material_title TEXT;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS correct_count INTEGER DEFAULT 0;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS wrong_count INTEGER DEFAULT 0;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS weak_topics TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS ai_recommendation TEXT;
ALTER TABLE public.quiz_attempts ADD COLUMN IF NOT EXISTS attempted_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_code ON public.quiz_attempts (user_code);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_attempted_at ON public.quiz_attempts (attempted_at DESC);


-- ==============================================================================
-- 7. STUDY STATS & DAILY PROGRESS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.study_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_code TEXT,
  stat_date DATE DEFAULT CURRENT_DATE,
  active_seconds INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  flashcards_reviewed INTEGER DEFAULT 0,
  ai_questions_asked INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS user_code TEXT;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS stat_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS active_seconds INTEGER DEFAULT 0;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS quizzes_completed INTEGER DEFAULT 0;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS questions_answered INTEGER DEFAULT 0;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS flashcards_reviewed INTEGER DEFAULT 0;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS ai_questions_asked INTEGER DEFAULT 0;
ALTER TABLE public.study_stats ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW());

CREATE INDEX IF NOT EXISTS idx_study_stats_user_date ON public.study_stats (user_code, stat_date);


-- ==============================================================================
-- 8. USER ACHIEVEMENTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id TEXT NOT NULL,
  user_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 50,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  PRIMARY KEY (user_code, id)
);

ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS user_code TEXT;
ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS xp_reward INTEGER DEFAULT 50;
ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS unlocked BOOLEAN DEFAULT false;
ALTER TABLE public.user_achievements ADD COLUMN IF NOT EXISTS unlocked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements (user_code);


-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 9.1 USERS Policies
DROP POLICY IF EXISTS "Allow read users" ON public.users;
CREATE POLICY "Allow read users" ON public.users FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert users" ON public.users;
CREATE POLICY "Allow insert users" ON public.users FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update users" ON public.users;
CREATE POLICY "Allow update users" ON public.users FOR UPDATE USING (true) WITH CHECK (true);

-- 9.2 DOCUMENTS Policies
DROP POLICY IF EXISTS "Allow read documents" ON public.documents;
CREATE POLICY "Allow read documents" ON public.documents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert documents" ON public.documents;
CREATE POLICY "Allow insert documents" ON public.documents FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update documents" ON public.documents;
CREATE POLICY "Allow update documents" ON public.documents FOR UPDATE USING (true) WITH CHECK (true);

-- 9.3 MATERIALS Policies
DROP POLICY IF EXISTS "Allow read materials" ON public.materials;
CREATE POLICY "Allow read materials" ON public.materials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert materials" ON public.materials;
CREATE POLICY "Allow insert materials" ON public.materials FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update materials" ON public.materials;
CREATE POLICY "Allow update materials" ON public.materials FOR UPDATE USING (true) WITH CHECK (true);

-- 9.4 QUIZ ATTEMPTS Policies
DROP POLICY IF EXISTS "Allow read quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Allow read quiz_attempts" ON public.quiz_attempts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow insert quiz_attempts" ON public.quiz_attempts;
CREATE POLICY "Allow insert quiz_attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (true);

-- 9.5 STUDY STATS Policies
DROP POLICY IF EXISTS "Allow all study_stats" ON public.study_stats;
CREATE POLICY "Allow all study_stats" ON public.study_stats FOR ALL USING (true) WITH CHECK (true);

-- 9.6 USER ACHIEVEMENTS Policies
DROP POLICY IF EXISTS "Allow all user_achievements" ON public.user_achievements;
CREATE POLICY "Allow all user_achievements" ON public.user_achievements FOR ALL USING (true) WITH CHECK (true);


-- ==============================================================================
-- 10. REALTIME PUBLICATION SETUP
-- ==============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'documents'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'study_stats'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.study_stats;
  END IF;
END $$;
