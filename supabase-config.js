// ─────────────────────────────────────────────
//  SUPABASE CONFIG — fill in your values here
// ─────────────────────────────────────────────
//
//  1. Go to https://supabase.com and create a free project
//  2. In your project go to Settings → API
//  3. Copy "Project URL" → paste as SUPABASE_URL below
//  4. Copy "anon / public" key → paste as SUPABASE_ANON_KEY below
//  5. Run this SQL in your Supabase SQL editor:
//
//     CREATE TABLE scores (
//       id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
//       player_name text NOT NULL,
//       game text NOT NULL,
//       score integer NOT NULL,
//       max_score integer NOT NULL,
//       grade text,
//       created_at timestamptz DEFAULT now()
//     );
//     ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
//     CREATE POLICY "public insert" ON scores FOR INSERT WITH CHECK (true);
//     CREATE POLICY "public read"   ON scores FOR SELECT USING (true);

const SUPABASE_URL     = 'https://urmbaokzhhkftfrxgyxb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVybWJhb2t6aGhrZnRmcnhneXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4MjM2MzQsImV4cCI6MjA5ODM5OTYzNH0.eXkT4GfNhefsB5liNLiLtNI1B8Y51P56xLD8Dxyr2vc'; // long string starting with eyJ...

// ─────────────────────────────────────────────
//  Shared helpers — used by all game pages
// ─────────────────────────────────────────────

async function submitScore(playerName, game, score, maxScore, grade) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        player_name: playerName,
        game,
        score,
        max_score: maxScore,
        grade
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchAllScores(limit = 50) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?select=player_name,game,score,max_score,grade,created_at&order=created_at.desc&limit=${limit}`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getSavedName() {
  return localStorage.getItem('gcse_player_name') || '';
}
