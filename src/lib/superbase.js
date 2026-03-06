import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
//  SETUP INSTRUCTIONS (5 minutes)
//yx?/#w68+%-cECr
//  1. Go to https://supabase.com → "New project" (free, no card)
//  2. Once created, go to Settings → API
//     Copy "Project URL" and "anon public" key → paste below
//
//  3. In Supabase → SQL Editor → run this SQL to create tables:
//
//  CREATE TABLE gallery (
//    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//    url text NOT NULL,
//    caption text,
//    category text DEFAULT 'Cérémonie',
//    type text DEFAULT 'image',
//    created_at timestamptz DEFAULT now()
//  );

//  CREATE TABLE announcements (
//    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//    title text NOT NULL,
//    body text NOT NULL,
//    author text DEFAULT 'Comité Organisateur',
//    category text DEFAULT 'Général',
//    pinned boolean DEFAULT false,
//    created_at timestamptz DEFAULT now()
//  );
//
//  -- Allow public read on both tables:
//  ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
//  ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
//  CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
//  CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
//  CREATE POLICY "Admin insert gallery" ON gallery FOR INSERT WITH CHECK (true);
//  CREATE POLICY "Admin delete gallery" ON gallery FOR DELETE USING (true);
//  CREATE POLICY "Admin insert announcements" ON announcements FOR INSERT WITH CHECK (true);
//  CREATE POLICY "Admin delete announcements" ON announcements FOR DELETE USING (true);
//  CREATE POLICY "Admin update announcements" ON announcements FOR UPDATE USING (true);
//
//  4. For image uploads (optional):
//     Go to Storage → New bucket → name: "gallery-media" → Public: ON
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = "https://kuxbdglqsiflhnfifklo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1eGJkZ2xxc2lmbGhuZmlma2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzg1MDYsImV4cCI6MjA4ODM1NDUwNn0.euFvCYIoVzNLa2d1aInLdFoYHiQET5at-ClM1E17Ptw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);