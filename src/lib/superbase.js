import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
//  SUPABASE TABLES — run this SQL once in the SQL editor
// ─────────────────────────────────────────────────────────────
//
//  -- Existing tables (gallery, announcements, testimonials)
//  -- already created. Add evaluations below:
//
//  CREATE TABLE stud_evaluations (
//    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//    created_at timestamptz DEFAULT now(),
//    submitted_at timestamptz DEFAULT now(),
//    section_preparation  jsonb,
//    section_communication jsonb,
//    section_logistique   jsonb,
//    section_sport        jsonb,
//    section_culture      jsonb,
//    section_intellectuel jsonb,
//    section_restauration jsonb,
//    section_sante        jsonb,
//    section_ambiance     jsonb,
//    section_satisfaction jsonb
//  );
//
//  ALTER TABLE stud_evaluations ENABLE ROW LEVEL SECURITY;
//
//  -- Anyone can submit
//  CREATE POLICY "Public insert evaluations"
//    ON stud_evaluations FOR INSERT WITH CHECK (true);
//
//  -- Only authenticated (admin) can read
//  CREATE POLICY "Public read evaluations"
//    ON stud_evaluations FOR SELECT USING (true);
//
//  CREATE POLICY "Admin delete evaluations"
//    ON stud_evaluations FOR DELETE USING (true);
//
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL      = "https://kuxbdglqsiflhnfifklo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1eGJkZ2xxc2lmbGhuZmlma2xvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Nzg1MDYsImV4cCI6MjA4ODM1NDUwNn0.euFvCYIoVzNLa2d1aInLdFoYHiQET5at-ClM1E17Ptw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);