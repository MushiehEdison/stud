// ============================================================
// TestimonialsWidget.jsx
// ─────────────────────────────────────────────────────────────
// Exports TWO things:
//   1. <TestimonialsCarousel /> — small home-page section showing
//      3 approved testimonials from Supabase
//   2. <FeedbackFAB />         — floating action button (bottom-right)
//      opens a modal to submit a new testimonial
//
// Supabase table expected:
//   testimonials (
//     id          uuid default gen_random_uuid() primary key,
//     name        text not null,
//     role        text,
//     body        text not null,
//     rating      int  default 5,    -- 1-5
//     approved    bool default false,
//     created_at  timestamptz default now()
//   )
// ============================================================

import { useState, useEffect, useRef } from "react";
import { MessageSquarePlus, Star, X, ChevronLeft, ChevronRight, Send, CheckCircle } from "lucide-react";
import { supabase } from "../lib/superbase";

// ── shared CSS ───────────────────────────────────────────────
const CSS = `
  /* ══════════════════════════════════════════════
     CAROUSEL SECTION
  ══════════════════════════════════════════════ */
  .testi-section {
    border-bottom: 1px solid rgba(10,10,10,0.12);
    overflow: hidden;
    background: #F5F0E8;
  }

  .testi-hdr {
    max-width: 1280px;
    margin: 0 auto;
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid rgba(10,10,10,0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .testi-hdr-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.75rem;
    letter-spacing: 0.06em;
    color: #0A0A0A;
  }
  .testi-hdr-title span { color: #F57C00; }
  .testi-hdr-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.54rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #88887F;
  }

  .testi-body {
    max-width: 1280px;
    margin: 0 auto;
    padding: 3.5rem 2.5rem 3rem;
    position: relative;
  }

  /* ── slide track ── */
  .testi-track-wrap {
    overflow: hidden;
  }
  .testi-track {
    display: flex;
    transition: transform 0.55s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .testi-card {
    flex: 0 0 calc(33.333% - 1rem);
    min-width: 260px;
    margin-right: 1.5rem;
    background: #FAFAF8;
    border: 1px solid rgba(10,10,10,0.08);
    padding: 2.25rem 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;
    transition: box-shadow 0.25s, transform 0.25s;
  }
  .testi-card:hover {
    box-shadow: 0 8px 32px rgba(10,10,10,0.08);
    transform: translateY(-2px);
  }

  .testi-quote-mark {
    font-family: 'Fraunces', serif;
    font-size: 4rem;
    line-height: 1;
    color: rgba(245,124,0,0.18);
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    user-select: none;
  }

  .testi-stars {
    display: flex;
    gap: 2px;
  }

  .testi-body-text {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 0.9rem;
    line-height: 1.75;
    color: #3D3D38;
    flex: 1;
  }

  .testi-author-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(10,10,10,0.08);
    margin-top: auto;
  }
  .testi-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #1565C0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.9rem;
    color: #fff;
    flex-shrink: 0;
  }
  .testi-name {
    font-family: 'Fraunces', serif;
    font-weight: 700;
    font-size: 0.82rem;
    color: #0A0A0A;
  }
  .testi-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.48rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #88887F;
    margin-top: 2px;
  }

  /* nav buttons */
  .testi-nav {
    display: flex;
    gap: 0.5rem;
    margin-top: 2rem;
    align-items: center;
  }
  .testi-nav-btn {
    width: 40px; height: 40px;
    border: 1.5px solid rgba(10,10,10,0.15);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    color: #0A0A0A;
  }
  .testi-nav-btn:hover:not(:disabled) {
    background: #0A0A0A;
    color: #FAFAF8;
    border-color: #0A0A0A;
  }
  .testi-nav-btn:disabled { opacity: 0.25; cursor: default; }

  .testi-dots {
    display: flex;
    gap: 6px;
    margin-left: 1rem;
  }
  .testi-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(10,10,10,0.15);
    transition: background 0.2s, transform 0.2s;
    cursor: pointer;
    border: none;
  }
  .testi-dot--active {
    background: #F57C00;
    transform: scale(1.4);
  }

  /* empty state */
  .testi-empty {
    padding: 4rem 0;
    text-align: center;
    font-family: 'Fraunces', serif;
    font-style: italic;
    color: #88887F;
    font-size: 0.9rem;
  }
  .testi-empty strong {
    display: block;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    color: #DDDDD5;
    letter-spacing: 0.04em;
    margin-bottom: 0.5rem;
    font-style: normal;
  }

  /* ══════════════════════════════════════════════
     FLOATING ACTION BUTTON
  ══════════════════════════════════════════════ */
  .fab-wrap {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 900;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.65rem;
  }

  .fab-tooltip {
    background: #0A0A0A;
    color: rgba(255,255,255,0.85);
    font-family: 'DM Mono', monospace;
    font-size: 0.52rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 0.4rem 0.75rem;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(6px);
    transition: opacity 0.25s, transform 0.25s;
    pointer-events: none;
  }
  .fab-wrap:hover .fab-tooltip {
    opacity: 1;
    transform: translateX(0);
  }

  .fab-btn {
    width: 54px; height: 54px;
    background: #F57C00;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4px 20px rgba(245,124,0,0.4);
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .fab-btn:hover {
    background: #E65100;
    transform: scale(1.06);
    box-shadow: 0 6px 28px rgba(245,124,0,0.5);
  }

  /* ping animation */
  .fab-ping {
    position: absolute;
    inset: 0;
    border-radius: 0;
    background: rgba(245,124,0,0.3);
    animation: fab-ping 2.5s ease-out infinite;
  }
  @keyframes fab-ping {
    0%   { transform: scale(1); opacity: 0.6; }
    70%  { transform: scale(1.7); opacity: 0; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  /* ══════════════════════════════════════════════
     MODAL
  ══════════════════════════════════════════════ */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(10,10,10,0.65);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 2rem;
    animation: backdrop-in 0.25s ease;
  }
  @keyframes backdrop-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .modal-panel {
    background: #FAFAF8;
    width: 100%;
    max-width: 460px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: panel-in 0.35s cubic-bezier(0.34,1.56,0.64,1);
    border-top: 4px solid #F57C00;
  }
  @keyframes panel-in {
    from { transform: translateY(40px) scale(0.97); opacity: 0; }
    to   { transform: none; opacity: 1; }
  }

  .modal-header {
    padding: 1.75rem 2rem 1.25rem;
    border-bottom: 1px solid rgba(10,10,10,0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .modal-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.6rem;
    letter-spacing: 0.04em;
    color: #0A0A0A;
    line-height: 1;
  }
  .modal-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.5rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #88887F;
    margin-top: 4px;
  }
  .modal-close {
    width: 32px; height: 32px;
    background: transparent;
    border: 1px solid rgba(10,10,10,0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0A0A0A;
    transition: all 0.2s;
    flex-shrink: 0;
  }
  .modal-close:hover { background: #0A0A0A; color: #FAFAF8; }

  .modal-body {
    padding: 1.75rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* form fields */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .form-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.5rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #88887F;
  }
  .form-input, .form-textarea {
    font-family: 'Fraunces', serif;
    font-size: 0.9rem;
    color: #0A0A0A;
    background: #fff;
    border: 1.5px solid rgba(10,10,10,0.12);
    padding: 0.75rem 1rem;
    outline: none;
    transition: border-color 0.2s;
    resize: none;
    width: 100%;
    box-sizing: border-box;
  }
  .form-input::placeholder, .form-textarea::placeholder {
    color: rgba(10,10,10,0.25);
    font-style: italic;
  }
  .form-input:focus, .form-textarea:focus {
    border-color: #F57C00;
  }
  .form-textarea { min-height: 110px; }

  /* star rating */
  .star-row {
    display: flex;
    gap: 4px;
  }
  .star-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    transition: transform 0.15s;
    color: rgba(10,10,10,0.15);
  }
  .star-btn:hover, .star-btn.active { color: #F9A825; }
  .star-btn:hover { transform: scale(1.2); }

  /* char count */
  .char-count {
    font-family: 'DM Mono', monospace;
    font-size: 0.48rem;
    color: #88887F;
    text-align: right;
  }
  .char-count.warn { color: #F57C00; }

  /* submit */
  .modal-submit {
    width: 100%;
    padding: 0.9rem;
    background: #F57C00;
    border: none;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.2s, transform 0.15s;
    margin-top: 0.25rem;
  }
  .modal-submit:hover:not(:disabled) { background: #E65100; transform: translateY(-1px); }
  .modal-submit:disabled { opacity: 0.5; cursor: not-allowed; }

  /* success state */
  .modal-success {
    padding: 3.5rem 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .modal-success-icon { color: #2E7D32; }
  .modal-success-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.8rem;
    letter-spacing: 0.04em;
    color: #0A0A0A;
  }
  .modal-success-msg {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 0.88rem;
    color: #3D3D38;
    line-height: 1.7;
    max-width: 300px;
  }

  /* anonymous toggle */
  .anon-toggle {
    display: flex;
    align-items: flex-start;
    gap: 0.6rem;
    cursor: pointer;
    user-select: none;
    padding: 0.65rem 0.9rem;
    border: 1.5px solid rgba(10,10,10,0.1);
    background: rgba(10,10,10,0.02);
    transition: border-color 0.2s, background 0.2s;
  }
  .anon-toggle:hover { border-color: rgba(10,10,10,0.2); background: rgba(10,10,10,0.04); }
  .anon-toggle--active { border-color: #F57C00; background: #FFF8F0; }
  .anon-checkbox {
    width: 15px; height: 15px; flex-shrink: 0; margin-top: 1px;
    border: 1.5px solid rgba(10,10,10,0.2);
    display: flex; align-items: center; justify-content: center;
    background: #fff;
    transition: background 0.15s, border-color 0.15s;
  }
  .anon-toggle--active .anon-checkbox { background: #F57C00; border-color: #F57C00; }
  .anon-label-wrap { display: flex; flex-direction: column; gap: 1px; }
  .anon-label {
    font-family: 'DM Mono', monospace; font-size: 0.54rem;
    letter-spacing: 0.14em; text-transform: uppercase; color: #88887F;
  }
  .anon-toggle--active .anon-label { color: #E65100; }
  .anon-sub {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 0.7rem; color: rgba(10,10,10,0.3);
  }

  /* note */
  .form-note {
    font-family: 'DM Mono', monospace;
    font-size: 0.46rem;
    letter-spacing: 0.1em;
    color: rgba(10,10,10,0.3);
    text-align: center;
    line-height: 1.6;
  }

  /* ── responsive ── */
  @media (max-width: 1024px) {
    .testi-card { flex: 0 0 calc(50% - 0.75rem); }
  }
  @media (max-width: 768px) {
    .testi-body { padding: 2.5rem 1.5rem 2rem; }
    .testi-hdr { padding: 1.25rem 1.5rem; }
    .testi-card { flex: 0 0 calc(100% - 0rem); margin-right: 1rem; }
    .modal-backdrop { padding: 0; align-items: flex-end; }
    .modal-panel { max-width: 100%; border-radius: 0; max-height: 85vh; }
    .fab-wrap { bottom: 1.25rem; right: 1.25rem; }
  }
`;

// ── Max chars for testimonial body ──────────────────────────
const MAX_CHARS = 280;

// ── static fallback testimonials shown while loading / if DB empty ──
const STATIC_TESTIMONIALS = [
  {
    id: "s1",
    name: "Dr. Suzanne Mballa",
    role: "Enseignante — ESSEC",
    body: "La STUD est un moment exceptionnel qui nous rappelle la valeur de chaque travailleur. Une organisation impeccable, des activités riches et une atmosphère de cohésion rare.",
    rating: 5,
  },
  {
    id: "s2",
    name: "M. Jean-Pierre Nkomo",
    role: "Personnel Administratif — Campus 2",
    body: "J'attends cette semaine avec impatience chaque année. Le sentiment d'appartenance à notre université est renforcé à chaque édition. Bravo à l'équipe organisatrice !",
    rating: 5,
  },
  {
    id: "s3",
    name: "Mme Carine Essono",
    role: "Bibliothécaire — Campus 1",
    body: "Les concours culturels et sportifs sont une occasion fantastique de découvrir les talents cachés de nos collègues. La STUD 2026 promet d'être mémorable.",
    rating: 4,
  },
];

// ── helpers ─────────────────────────────────────────────────
function StarDisplay({ rating, size = 13 }) {
  return (
    <div className="testi-stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill={s <= rating ? "#F9A825" : "none"}
          color={s <= rating ? "#F9A825" : "rgba(10,10,10,0.15)"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

function initials(name) {
  if (!name || name === "Anonyme") return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase() || "?";
}

// ════════════════════════════════════════════════════════════
// 1. CAROUSEL
// ════════════════════════════════════════════════════════════
export function TestimonialsCarousel() {
  const [items, setItems] = useState(STATIC_TESTIMONIALS);
  const [idx, setIdx] = useState(0);
  const [perPage, setPerPage] = useState(3);

  useEffect(() => {
    const fetchApproved = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, name, role, body, rating")
        .order("created_at", { ascending: false })
        .limit(9);
      console.log("[CAROUSEL] result:", { count: data?.length, error });
      if (error) {
        console.error("[CAROUSEL] error:", error.message);
        // keep static fallback on error
        return;
      }
      // Replace static fallback only when real data exists
      if (data && data.length > 0) setItems(data);
      // If approved list is empty, show empty state (not static fallback)
      else if (data && data.length === 0) setItems([]);
    };
    fetchApproved();
  }, []);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setPerPage(1);
      else if (window.innerWidth < 1024) setPerPage(2);
      else setPerPage(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIdx = Math.max(0, items.length - perPage);
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(maxIdx, i + 1));

  const trackOffset = `calc(-${idx * (100 / perPage)}% - ${idx * (1.5 / perPage)}rem)`;

  return (
    <section className="testi-section">
      <style>{CSS}</style>
      <div className="testi-hdr">
        <h2 className="testi-hdr-title">
          Ce Qu'ils <span>Disent</span>
        </h2>
        <span className="testi-hdr-sub">Témoignages — Personnel UDo</span>
      </div>

      <div className="testi-body">
        {items.length === 0 ? (
          <div className="testi-empty">
            <strong>À VENIR</strong>
            Les premiers témoignages seront publiés prochainement.
          </div>
        ) : (
          <>
            <div className="testi-track-wrap">
              <div
                className="testi-track"
                style={{ transform: `translateX(${trackOffset})` }}
              >
                {items.map((t) => (
                  <div key={t.id} className="testi-card">
                    <span className="testi-quote-mark">"</span>
                    <StarDisplay rating={t.rating} />
                    <p className="testi-body-text">«&nbsp;{t.body}&nbsp;»</p>
                    <div className="testi-author-row">
                      <div
                        className="testi-avatar"
                        style={{
                          background:
                            t.name === "Anonyme" ? "#88887F"
                            : t.rating >= 5 ? "#1565C0"
                            : t.rating >= 4 ? "#F57C00"
                            : "#3D3D38",
                        }}
                      >
                        {t.name === "Anonyme" ? "?" : initials(t.name)}
                      </div>
                      <div>
                        <div className="testi-name">
                          {t.name === "Anonyme"
                            ? <span style={{ fontStyle: "italic", color: "#88887F" }}>Anonyme</span>
                            : t.name}
                        </div>
                        {t.role && t.name !== "Anonyme" && <div className="testi-role">{t.role}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="testi-nav">
              <button className="testi-nav-btn" onClick={prev} disabled={idx === 0}>
                <ChevronLeft size={16} />
              </button>
              <button className="testi-nav-btn" onClick={next} disabled={idx >= maxIdx}>
                <ChevronRight size={16} />
              </button>
              <div className="testi-dots">
                {Array.from({ length: maxIdx + 1 }).map((_, i) => (
                  <button
                    key={i}
                    className={`testi-dot ${i === idx ? "testi-dot--active" : ""}`}
                    onClick={() => setIdx(i)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════
// 2. FLOATING ACTION BUTTON + MODAL
// ════════════════════════════════════════════════════════════
export function FeedbackFAB() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", body: "", rating: 5 });
  const [anon, setAnon] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef(null);

  // close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  // trap focus / escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // reset form when re-opened
  useEffect(() => {
    if (open) {
      setSuccess(false);
      setError("");
      setAnon(false);
      setForm({ name: "", role: "", body: "", rating: 5 });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!anon && !form.name.trim()) {
      setError("Veuillez renseigner votre nom ou choisir l'option anonyme.");
      return;
    }
    if (!form.body.trim()) {
      setError("Veuillez écrire votre avis.");
      return;
    }
    if (form.body.length > MAX_CHARS) {
      setError(`Votre avis dépasse ${MAX_CHARS} caractères.`);
      return;
    }
    setLoading(true);
    setError("");
    const { error: dbErr } = await supabase.from("testimonials").insert([
      {
        name: anon ? "Anonyme" : form.name.trim(),
        role: anon ? null : (form.role.trim() || null),
        body: form.body.trim(),
        rating: form.rating,
        approved: true, // auto-publish — no admin approval needed
      },
    ]);
    setLoading(false);
    if (dbErr) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } else {
      setSuccess(true);
    }
  };

  const charsLeft = MAX_CHARS - form.body.length;

  return (
    <>
      <style>{CSS}</style>

      {/* FAB */}
      <div className="fab-wrap">
        <div className="fab-tooltip">Donner votre avis</div>
        <button className="fab-btn" onClick={() => setOpen(true)} aria-label="Donner votre avis">
          <div className="fab-ping" />
          <MessageSquarePlus size={22} />
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-backdrop" onClick={handleBackdrop}>
          <div className="modal-panel" ref={panelRef}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Votre Avis</div>
                <div className="modal-sub">STUD 2026 — Université de Douala</div>
              </div>
              <button className="modal-close" onClick={() => setOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {success ? (
              <div className="modal-success">
                <CheckCircle size={48} className="modal-success-icon" />
                <div className="modal-success-title">Merci !</div>
                <p className="modal-success-msg">
                  Votre témoignage a bien été soumis. Il sera publié après validation par notre équipe.
                </p>
              </div>
            ) : (
              <div className="modal-body">
                {/* Rating */}
                <div className="form-group">
                  <span className="form-label">Note globale</span>
                  <div className="star-row">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        className={`star-btn ${s <= (hoverStar || form.rating) ? "active" : ""}`}
                        onMouseEnter={() => setHoverStar(s)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setForm((f) => ({ ...f, rating: s }))}
                        type="button"
                      >
                        <Star size={22} fill={s <= (hoverStar || form.rating) ? "#F9A825" : "none"} strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Anonymous toggle */}
                <div
                  className={`anon-toggle ${anon ? "anon-toggle--active" : ""}`}
                  onClick={() => { setAnon(a => !a); setForm(f => ({ ...f, name: "", role: "" })); }}
                >
                  <div className="anon-checkbox">
                    {anon && <span style={{ color: "#fff", fontSize: "0.65rem", lineHeight: 1, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="anon-label-wrap">
                    <span className="anon-label">Rester anonyme</span>
                    <span className="anon-sub">Votre nom ne sera pas affiché publiquement</span>
                  </div>
                </div>

                {/* Name — hidden when anon */}
                {!anon && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="testi-name">Nom complet *</label>
                    <input
                      id="testi-name"
                      className="form-input"
                      type="text"
                      placeholder="Pr. Jean Dupont"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      maxLength={80}
                    />
                  </div>
                )}

                {/* Role — hidden when anon */}
                {!anon && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="testi-role">Rôle / Établissement</label>
                    <input
                      id="testi-role"
                      className="form-input"
                      type="text"
                      placeholder="Enseignant — ESSEC"
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                      maxLength={80}
                    />
                  </div>
                )}

                {/* Body */}
                <div className="form-group">
                  <label className="form-label" htmlFor="testi-body">Votre avis *</label>
                  <textarea
                    id="testi-body"
                    className="form-textarea"
                    placeholder="Partagez votre expérience de la STUD…"
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    maxLength={MAX_CHARS + 20}
                  />
                  <div className={`char-count ${charsLeft < 30 ? "warn" : ""}`}>
                    {charsLeft} caractère{charsLeft !== 1 ? "s" : ""} restant{charsLeft !== 1 ? "s" : ""}
                  </div>
                </div>

                {error && (
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#C62828", letterSpacing: "0.1em" }}>
                    ⚠ {error}
                  </p>
                )}

                <button
                  className="modal-submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Envoi…" : <><Send size={13} /> Soumettre mon avis</>}
                </button>

                <p className="form-note">
                  Votre témoignage sera relu par notre équipe avant publication.<br />
                  Aucune information personnelle ne sera partagée.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}