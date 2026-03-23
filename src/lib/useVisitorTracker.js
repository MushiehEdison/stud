// ============================================================
// useVisitorTracker.js
// Tracks unique site visitors — no duplicates per day.
//
// Logic:
//   1. On first ever visit → generate a persistent visitor ID
//      stored in localStorage (survives tab closes, not clears)
//   2. Check localStorage for "last_counted_date"
//      - If today → already counted, skip
//      - If different day or never → record this visit in Supabase
//   3. Supabase stores: visitor_id (hashed), date, counted_at
//
// Result: one person visiting 50x today = 1 row. ✓
//
// SUPABASE TABLE (run once):
//
// CREATE TABLE site_visits (
//   id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
//   visitor_id   text        NOT NULL,   -- SHA-256 hash of random ID
//   visit_date   date        NOT NULL,   -- YYYY-MM-DD
//   counted_at   timestamptz DEFAULT now(),
//   UNIQUE (visitor_id, visit_date)      -- prevents any duplicate
// );
// ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Public insert visits"
//   ON site_visits FOR INSERT WITH CHECK (true);
// CREATE POLICY "Public read visits"
//   ON site_visits FOR SELECT USING (true);
//
// ============================================================

import { useEffect } from "react";
import { supabase } from "./superbase";

// Generate a random 32-char hex ID
function generateId() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2,"0")).join("");
}

// SHA-256 hash using Web Crypto API (async)
async function hashId(raw) {
  const encoder = new TextEncoder();
  const data     = encoder.encode(raw);
  const hashBuf  = await crypto.subtle.digest("SHA-256", data);
  const hashArr  = Array.from(new Uint8Array(hashBuf));
  return hashArr.map(b => b.toString(16).padStart(2,"0")).join("");
}

// Today as YYYY-MM-DD in local time
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function useVisitorTracker() {
  useEffect(() => {
    const track = async () => {
      try {
        const today = todayStr();

        // Already counted today? → skip entirely
        const lastCounted = localStorage.getItem("stud_last_counted");
        if (lastCounted === today) return;

        // Get or create persistent visitor ID
        let visitorRaw = localStorage.getItem("stud_visitor_id");
        if (!visitorRaw) {
          visitorRaw = generateId();
          localStorage.setItem("stud_visitor_id", visitorRaw);
        }

        // Hash it before sending to DB (privacy — we never store raw ID)
        const visitorId = await hashId(visitorRaw);

        // Insert into Supabase
        // The UNIQUE constraint on (visitor_id, visit_date) means
        // even if this runs twice (e.g. React StrictMode double-invoke),
        // Supabase will just ignore the duplicate silently
        const { error } = await supabase
          .from("site_visits")
          .insert({ visitor_id: visitorId, visit_date: today })
          .select()
          .single();

        if (error) {
          // Code 23505 = unique constraint violation → already counted, fine
          if (error.code === "23505") {
            localStorage.setItem("stud_last_counted", today);
            return;
          }
          console.error("[TRACKER] insert error:", error.message);
          return;
        }

        // Mark as counted today in localStorage
        localStorage.setItem("stud_last_counted", today);
        console.log("[TRACKER] new unique visit recorded for", today);

      } catch (e) {
        // Never crash the app over analytics
        console.error("[TRACKER] unexpected error:", e);
      }
    };

    // Small delay so it doesn't block page render
    const t = setTimeout(track, 1500);
    return () => clearTimeout(t);
  }, []);
}

// ── Fetch total unique visitor count (for home page counter) ──
export async function fetchTotalVisitors() {
  const { count, error } = await supabase
    .from("site_visits")
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count;
}

// ── Fetch daily stats for the last N days (for admin chart) ──
export async function fetchDailyStats(days = 30) {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const fromStr = from.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("site_visits")
    .select("visit_date")
    .gte("visit_date", fromStr)
    .order("visit_date", { ascending: true });

  if (error || !data) return [];

  // Group by date → count
  const counts = {};
  data.forEach(row => {
    counts[row.visit_date] = (counts[row.visit_date] || 0) + 1;
  });

  // Fill in missing days with 0
  const result = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label   = d.toLocaleDateString("fr-FR", { day:"2-digit", month:"short" });
    result.push({ date: dateStr, label, count: counts[dateStr] || 0 });
  }
  return result;
}