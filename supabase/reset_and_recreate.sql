-- The old script dropped all user data and installed public read/write policies.
-- Destructive reset was intentionally removed. Use schema.sql for a fresh optional setup.
DO $$ BEGIN
  RAISE EXCEPTION 'Destructive reset disabled. Back up your database and review schema.sql before making changes.';
END $$;
