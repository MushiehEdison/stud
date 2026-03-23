// ============================================================
// TestimonialsPage.jsx — STUD 2026
// Route: /temoignages — standalone shareable page
// Mobile-first: form on top, feed below on mobile
//               side-by-side on desktop
// ============================================================

import { useState, useEffect } from "react";
import { Star, Send, CheckCircle, MessageSquare, ArrowLeft, ChevronDown } from "lucide-react";
import { supabase } from "../lib/superbase";
import { Link } from "react-router-dom";

const MAX_CHARS = 280;
const B   = "#1565C0";
const BDK = "#0D47A1";
const BLT = "#EEF4FF";
const INK = "#0A0A0A";
const GRY = "#88887F";
const BDR = "#EAEAE5";
const BG  = "#F4F6F9";
const WHT = "#FFFFFF";

const AVATAR_COLORS = [B, "#2E7D32", "#6A1B9A", "#00695C", "#AD1457", "#E65100"];

function avatarColor(name) {
  if (!name || name === "Anonyme") return GRY;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name) {
  if (!name || name === "Anonyme") return "?";
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
}
function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime(), m = Math.floor(d / 60000);
  if (m < 1)  return "À l'instant";
  if (m < 60) return "Il y a " + m + "min";
  const h = Math.floor(m / 60);
  if (h < 24) return "Il y a " + h + "h";
  return "Il y a " + Math.floor(h / 24) + "j";
}

// ── Stars ─────────────────────────────────────────────────────
function Stars({ rating, size = 13 }) {
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          fill={s <= rating ? "#F9A825" : "none"}
          color={s <= rating ? "#F9A825" : "rgba(10,10,10,0.12)"}
          strokeWidth={1.5} />
      ))}
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────
function TestiCard({ t, idx }) {
  const ac = avatarColor(t.name);
  return (
    <div style={{
      background: WHT,
      borderRadius: 14,
      border: "1px solid " + BDR,
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: "0.875rem",
      position: "relative",
      overflow: "hidden",
      animation: "fadeUp .45s ease " + (Math.min(idx, 8) * 0.05) + "s both",
    }}>
      {/* top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: "linear-gradient(90deg, " + ac + ", transparent)",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", gap: "0.5rem" }}>
        <Stars rating={t.rating} />
        {t.created_at && (
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
            color:"rgba(10,10,10,0.25)", flexShrink:0 }}>
            {timeAgo(t.created_at)}
          </span>
        )}
      </div>

      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:"0.92rem", lineHeight:1.72, color:"#3D3D38", margin:0, flex:1 }}>
        {"\u00ab\u00a0" + t.body + "\u00a0\u00bb"}
      </p>

      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem",
        paddingTop:"0.875rem", borderTop:"1px solid " + BDR }}>
        <div style={{ width:36, height:36, borderRadius:"50%",
          background:ac, display:"flex", alignItems:"center",
          justifyContent:"center", fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"0.9rem", color:"#fff", flexShrink:0,
          boxShadow:"0 2px 8px " + ac + "40" }}>
          {initials(t.name)}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700,
            fontSize:"0.85rem", color:INK,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
            {t.name === "Anonyme"
              ? <span style={{ fontStyle:"italic", color:GRY }}>Anonyme</span>
              : t.name}
          </div>
          {t.role && t.name !== "Anonyme" && (
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
              letterSpacing:"0.1em", textTransform:"uppercase",
              color:GRY, marginTop:2 }}>
              {t.role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Submission form ───────────────────────────────────────────
function SubmitForm({ onSuccess }) {
  const [form,    setForm]    = useState({ name:"", role:"", body:"", rating:5 });
  const [anon,    setAnon]    = useState(false);
  const [hover,   setHover]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [done,    setDone]    = useState(false);

  const charsLeft = MAX_CHARS - form.body.length;

  async function handleSubmit() {
    if (!anon && !form.name.trim()) { setError("Renseignez votre nom ou choisissez anonyme."); return; }
    if (!form.body.trim()) { setError("Écrivez votre avis."); return; }
    if (form.body.length > MAX_CHARS) { setError("Trop long."); return; }
    setLoading(true); setError("");
    const { error:dbErr } = await supabase.from("testimonials").insert([{
      name:  anon ? "Anonyme" : form.name.trim(),
      role:  anon ? null : (form.role.trim() || null),
      body:  form.body.trim(),
      rating: form.rating,
      approved: true,
    }]);
    setLoading(false);
    if (dbErr) setError("Erreur: " + dbErr.message);
    else { setDone(true); onSuccess && onSuccess(); }
  }

  const fieldStyle = {
    width:"100%", padding:"0.75rem 1rem",
    border:"1.5px solid " + BDR, borderRadius:10,
    background:WHT, fontFamily:"'Fraunces',serif",
    fontSize:"0.9rem", color:INK, outline:"none",
    transition:"border-color .2s", boxSizing:"border-box",
  };
  const labelStyle = {
    display:"block", fontFamily:"'DM Mono',monospace",
    fontSize:"0.5rem", letterSpacing:"0.14em",
    textTransform:"uppercase", color:GRY, marginBottom:"0.35rem",
  };

  if (done) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", gap:"1rem", padding:"2.5rem 1.5rem",
      textAlign:"center", background:WHT, borderRadius:16,
      border:"1px solid " + BDR }}>
      <div style={{ width:60, height:60, borderRadius:"50%",
        background:BLT, display:"flex", alignItems:"center",
        justifyContent:"center" }}>
        <CheckCircle size={28} color={B} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem",
        letterSpacing:"0.04em", color:INK }}>
        Merci !
      </div>
      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:"0.9rem", color:"#3D3D38", lineHeight:1.7,
        maxWidth:260, margin:0 }}>
        Votre témoignage est maintenant visible par tous.
      </p>
      <button
        onClick={function() { setDone(false); setForm({name:"",role:"",body:"",rating:5}); setAnon(false); }}
        style={{ background:"none", border:"1.5px solid " + BDR,
          borderRadius:8, padding:"0.6rem 1.25rem", cursor:"pointer",
          fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
          letterSpacing:"0.12em", textTransform:"uppercase", color:GRY,
          transition:"all .2s" }}
        onMouseEnter={function(e){ e.currentTarget.style.borderColor=INK; e.currentTarget.style.color=INK; }}
        onMouseLeave={function(e){ e.currentTarget.style.borderColor=BDR; e.currentTarget.style.color=GRY; }}>
        Écrire un autre avis
      </button>
    </div>
  );

  return (
    <div style={{ background:WHT, borderRadius:16, border:"1px solid " + BDR,
      padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* header */}
      <div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
          letterSpacing:"0.18em", textTransform:"uppercase",
          color:GRY, marginBottom:"0.3rem" }}>
          Partagez votre avis
        </div>
        <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem",
          letterSpacing:"0.04em", color:INK, lineHeight:0.95, margin:0 }}>
          VOTRE EXPÉRIENCE{" "}
          <span style={{ color:B }}>COMPTE</span>
        </h2>
      </div>

      {/* star rating */}
      <div>
        <label style={labelStyle}>Note globale</label>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} type="button"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setForm(f => ({ ...f, rating:s }))}
              style={{ background:"transparent", border:"none", cursor:"pointer",
                padding:"2px", transition:"transform .15s",
                transform: s <= (hover || form.rating) ? "scale(1.18)" : "scale(1)" }}>
              <Star size={28}
                fill={s <= (hover || form.rating) ? "#F9A825" : "none"}
                color={s <= (hover || form.rating) ? "#F9A825" : "rgba(10,10,10,0.15)"}
                strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      {/* anonymous toggle */}
      <div
        onClick={() => { setAnon(a => !a); setForm(f => ({ ...f, name:"", role:"" })); }}
        style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem",
          padding:"0.875rem 1rem", borderRadius:10, cursor:"pointer",
          border:"1.5px solid " + (anon ? B : BDR),
          background: anon ? BLT : BG,
          transition:"all .2s" }}>
        <div style={{ width:18, height:18, flexShrink:0, marginTop:1,
          border:"1.5px solid " + (anon ? B : BDR), borderRadius:5,
          background: anon ? B : WHT,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all .15s" }}>
          {anon && <span style={{ color:"#fff", fontSize:"0.6rem", fontWeight:700 }}>✓</span>}
        </div>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
            letterSpacing:"0.12em", textTransform:"uppercase",
            color: anon ? B : GRY, fontWeight: anon ? 700 : 400 }}>
            Rester anonyme
          </div>
          <div style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:"0.72rem", color:"rgba(10,10,10,0.3)", marginTop:2 }}>
            Votre nom ne sera pas affiché
          </div>
        </div>
      </div>

      {!anon && (
        <div>
          <label style={labelStyle} htmlFor="tp-name">Nom complet *</label>
          <input id="tp-name" type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name:e.target.value }))}
            placeholder="Pr. Jean Dupont" maxLength={80}
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor=B}
            onBlur={e => e.target.style.borderColor=BDR} />
        </div>
      )}

      {!anon && (
        <div>
          <label style={labelStyle} htmlFor="tp-role">Rôle / Établissement</label>
          <input id="tp-role" type="text" value={form.role}
            onChange={e => setForm(f => ({ ...f, role:e.target.value }))}
            placeholder="Enseignant — ESSEC" maxLength={80}
            style={fieldStyle}
            onFocus={e => e.target.style.borderColor=B}
            onBlur={e => e.target.style.borderColor=BDR} />
        </div>
      )}

      <div>
        <label style={labelStyle} htmlFor="tp-body">Votre avis *</label>
        <textarea id="tp-body" value={form.body}
          onChange={e => setForm(f => ({ ...f, body:e.target.value }))}
          placeholder="Partagez votre expérience de la STUD 2026…"
          maxLength={MAX_CHARS + 20} rows={4}
          style={{ ...fieldStyle, resize:"vertical", minHeight:100 }}
          onFocus={e => e.target.style.borderColor=B}
          onBlur={e => e.target.style.borderColor=BDR} />
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
          color: charsLeft < 30 ? "#E65100" : "rgba(10,10,10,0.3)",
          textAlign:"right", marginTop:"0.25rem" }}>
          {charsLeft} caractère{charsLeft !== 1 ? "s" : ""} restant{charsLeft !== 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
          color:"#C62828", letterSpacing:"0.08em", margin:0 }}>
          ⚠ {error}
        </p>
      )}

      <button type="button" onClick={handleSubmit} disabled={loading}
        style={{ width:"100%", padding:"0.95rem",
          background: loading ? BDR : B,
          border:"none", borderRadius:10,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
          letterSpacing:"0.16em", textTransform:"uppercase",
          color: loading ? GRY : "#fff",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
          transition:"background .2s",
          boxShadow: loading ? "none" : "0 4px 16px rgba(21,101,192,0.3)" }}
        onMouseEnter={function(e){ if(!loading) e.currentTarget.style.background=BDK; }}
        onMouseLeave={function(e){ if(!loading) e.currentTarget.style.background=B; }}>
        {loading ? "Envoi..." : <><Send size={14} /> Soumettre mon avis</>}
      </button>

      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
        letterSpacing:"0.08em", color:"rgba(10,10,10,0.28)",
        textAlign:"center", lineHeight:1.6, margin:0 }}>
        Publié immédiatement · Visible par tous
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════
export default function TestimonialsPage() {
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showForm,    setShowForm]    = useState(false); // mobile toggle

  async function fetchAll() {
    const { data } = await supabase
      .from("testimonials")
      .select("id,name,role,body,rating,created_at")
      .eq("approved", true)
      .order("created_at", { ascending:false })
      .limit(60);
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel("testi-page-v2")
      .on("postgres_changes",
        { event:"INSERT", schema:"public", table:"testimonials" },
        () => fetchAll())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const avgRating = items.length
    ? (items.reduce((a, t) => a + t.rating, 0) / items.length).toFixed(1)
    : null;

  return (
    <div style={{ background:BG, minHeight:"100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }

        /* Desktop layout */
        .tp-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          min-height: calc(100vh - 64px);
          max-width: 1240px;
          margin: 0 auto;
        }
        .tp-form-col {
          border-left: 1px solid ${BDR};
          background: ${BG};
          position: sticky;
          top: 64px;
          height: calc(100vh - 64px);
          overflow-y: auto;
          padding: 2rem 1.75rem;
        }
        .tp-feed-col {
          padding: 2rem 2.5rem;
          overflow-y: auto;
        }
        .tp-mobile-form-toggle {
          display: none;
        }

        /* Mobile */
        @media (max-width: 860px) {
          .tp-layout {
            grid-template-columns: 1fr;
            max-width: 100%;
          }
          .tp-form-col {
            display: none;
            position: static;
            height: auto;
            border-left: none;
            border-top: 1px solid ${BDR};
            padding: 1.25rem;
          }
          .tp-form-col.visible {
            display: block;
          }
          .tp-feed-col {
            padding: 1.25rem;
          }
          .tp-mobile-form-toggle {
            display: flex;
          }
        }

        /* Feed grid */
        .tp-feed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .tp-feed-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ background:INK, borderBottom:"3px solid " + B,
        height:64, display:"flex", alignItems:"center",
        padding:"0 1.5rem", gap:"1rem",
        position:"sticky", top:0, zIndex:50,
        animation:"fadeIn .3s ease" }}>
        <Link to="/" style={{ display:"flex", alignItems:"center", gap:"0.4rem",
          color:"rgba(255,255,255,0.45)", textDecoration:"none",
          fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
          letterSpacing:"0.12em", textTransform:"uppercase",
          transition:"color .2s", flexShrink:0 }}
          onMouseEnter={e => e.currentTarget.style.color="#fff"}
          onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
          <ArrowLeft size={13} />
          <span>Accueil</span>
        </Link>

        <div style={{ width:1, height:20, background:"rgba(255,255,255,0.1)" }} />

        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.25rem",
          letterSpacing:"0.06em", color:"#fff" }}>
          TÉMOIGNAGES
          <span style={{ color:B, marginLeft:"0.35rem" }}>STUD 2026</span>
        </div>

        {/* stats */}
        {items.length > 0 && (
          <div style={{ marginLeft:"auto", display:"flex",
            alignItems:"center", gap:"1rem" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"1.4rem", color:B, lineHeight:1 }}>
                {items.length}
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
                letterSpacing:"0.12em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.3)" }}>
                Avis
              </div>
            </div>
            {avgRating && (
              <>
                <div style={{ width:1, height:24, background:"rgba(255,255,255,0.1)" }} />
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:"1.4rem", color:"#F9A825", lineHeight:1 }}>
                    {avgRating}
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
                    letterSpacing:"0.12em", textTransform:"uppercase",
                    color:"rgba(255,255,255,0.3)" }}>
                    /5 moy.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="tp-layout">

        {/* LEFT: feed */}
        <div className="tp-feed-col">

          {/* page title */}
          <div style={{ marginBottom:"1.5rem" }}>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(2rem,6vw,3.5rem)",
              letterSpacing:"0.03em", color:INK, lineHeight:.88, margin:0 }}>
              Ce qu'ils{" "}
              <span style={{ color:B }}>disent</span>
            </h1>
            <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
              letterSpacing:"0.16em", textTransform:"uppercase",
              color:GRY, marginTop:"0.5rem" }}>
              Personnel & communauté — Université de Douala
            </p>
          </div>

          {/* mobile: toggle form button */}
          <button
            className="tp-mobile-form-toggle"
            onClick={() => setShowForm(v => !v)}
            style={{ width:"100%", marginBottom:"1.25rem",
              display:"flex", alignItems:"center", justifyContent:"center",
              gap:"0.5rem", padding:"0.875rem",
              background: showForm ? BLT : B,
              color: showForm ? B : "#fff",
              border:"none", borderRadius:10, cursor:"pointer",
              fontFamily:"'DM Mono',monospace", fontSize:"0.58rem",
              letterSpacing:"0.14em", textTransform:"uppercase",
              transition:"all .2s",
              boxShadow: showForm ? "none" : "0 4px 16px rgba(21,101,192,0.25)" }}>
            {showForm ? "Masquer le formulaire" : "Donner mon avis"}
            <ChevronDown size={15}
              style={{ transform: showForm ? "rotate(180deg)" : "rotate(0)",
                transition:"transform .25s" }} />
          </button>

          {/* feed */}
          {loading ? (
            <div style={{ padding:"3rem", textAlign:"center",
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"1.5rem", color:"rgba(10,10,10,0.15)" }}>
              Chargement...
            </div>
          ) : items.length === 0 ? (
            <div style={{ padding:"3rem", textAlign:"center",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:"0.75rem" }}>
              <div style={{ width:64, height:64, borderRadius:"50%",
                background:BLT, display:"flex", alignItems:"center",
                justifyContent:"center" }}>
                <MessageSquare size={28} color={B} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"1.5rem", color:"rgba(10,10,10,0.2)" }}>
                Soyez le premier
              </div>
              <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
                color:GRY, fontSize:"0.9rem", maxWidth:260, textAlign:"center" }}>
                Partagez votre expérience de la STUD 2026.
              </p>
            </div>
          ) : (
            <div className="tp-feed-grid">
              {items.map((t, i) => <TestiCard key={t.id} t={t} idx={i} />)}
            </div>
          )}
        </div>

        {/* RIGHT: form (desktop always visible, mobile toggle) */}
        <div className={"tp-form-col" + (showForm ? " visible" : "")}>
          <SubmitForm onSuccess={fetchAll} />
        </div>

      </div>
    </div>
  );
}