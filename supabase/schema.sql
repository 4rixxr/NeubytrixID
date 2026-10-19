-- Optional fresh schema for the standalone Supabase adapter. Not used by Firebase.
-- Use Supabase Auth sessions. Firebase IDs and local profile codes are not Supabase credentials.
-- This file does not delete existing tables or migrate unsafe legacy policies.
CREATE TABLE IF NOT EXISTS public.study_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.study_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "study_documents_owner" ON public.study_documents;
CREATE POLICY "study_documents_owner" ON public.study_documents FOR ALL TO authenticated
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
INSERT INTO storage.buckets (id, name, public, file_size_limit)
  VALUES ('documents', 'documents', false, 10485760)
  ON CONFLICT (id) DO UPDATE SET public = false, file_size_limit = 10485760;
DROP POLICY IF EXISTS "study_files_owner" ON storage.objects;
CREATE POLICY "study_files_owner" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
-- Existing installations: audit and revoke any legacy public policies separately.
-- PostgreSQL combines permissive policies with OR; adding an owner rule does not override a public rule.
