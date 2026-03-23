// ============================================================
// TestimonialsPage.jsx — STUD 2026
// Route: /temoignages
// Layout: form always visible at top, horizontal card carousel below
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Star, Send, CheckCircle, MessageSquare, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
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
function TestiCard({ t }) {
  const ac = avatarColor(t.name);
  return (
    <div style={{
      background: WHT,
      borderRadius: 16,
      border: "1px solid " + BDR,
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      position: "relative",
      overflow: "hidden",
      height: "100%",
      boxSizing: "border-box",
    }}>
      {/* accent top line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background:"linear-gradient(90deg," + ac + ", transparent)",
      }} />

      {/* stars + time */}
      <div style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between", gap:"0.5rem" }}>
        <Stars rating={t.rating} />
        {t.created_at && (
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
            color:"rgba(10,10,10,0.25)", flexShrink:0 }}>
            {timeAgo(t.created_at)}
          </span>
        )}
      </div>

      {/* quote */}
      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:"0.92rem", lineHeight:1.72, color:"#3D3D38",
        margin:0, flex:1 }}>
        {"\u00ab\u00a0" + t.body + "\u00a0\u00bb"}
      </p>

      {/* author */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem",
        paddingTop:"0.875rem", borderTop:"1px solid " + BDR }}>
        <div style={{ width:38, height:38, borderRadius:"50%",
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

// ── Carousel ──────────────────────────────────────────────────
function Carousel({ items }) {
  const [idx,     setIdx]     = useState(0);
  const [perPage, setPerPage] = useState(3);
  const trackRef = useRef(null);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 600)       setPerPage(1);
      else if (w < 900)  setPerPage(2);
      else               setPerPage(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIdx   = Math.max(0, items.length - perPage);
  const prev     = () => setIdx(i => Math.max(0, i - 1));
  const next     = () => setIdx(i => Math.min(maxIdx, i + 1));
  const cardW    = 100 / perPage;
  const gap      = 16;
  const offset   = idx * (cardW + (gap / (window.innerWidth / 100))) ;

  if (!items.length) return (
    <div style={{ textAlign:"center", padding:"3rem",
      display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem" }}>
      <div style={{ width:56, height:56, borderRadius:"50%", background:BLT,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <MessageSquare size={24} color={B} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif",
        fontSize:"1.4rem", color:"rgba(10,10,10,0.2)" }}>
        Soyez le premier
      </div>
      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
        color:GRY, fontSize:"0.9rem" }}>
        Les témoignages apparaîtront ici.
      </p>
    </div>
  );

  return (
    <div>
      {/* track */}
      <div style={{ overflow:"hidden" }}>
        <div
          ref={trackRef}
          style={{
            display:"flex",
            gap:gap + "px",
            transition:"transform .5s cubic-bezier(.4,0,.2,1)",
            transform:"translateX(calc(-" + idx + " * (100% / " + perPage + " + " + (gap / perPage) + "px)))",
          }}>
          {items.map(t => (
            <div key={t.id}
              style={{
                flex:"0 0 calc(" + (100/perPage) + "% - " + (gap * (perPage-1) / perPage) + "px)",
                minWidth:0,
              }}>
              <TestiCard t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      <div style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between", marginTop:"1.25rem" }}>

        {/* dot indicators */}
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {Array.from({ length: maxIdx + 1 }).map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              style={{ width: i === idx ? 20 : 7, height:7,
                borderRadius:4, border:"none", cursor:"pointer",
                background: i === idx ? B : BDR,
                transition:"width .3s ease, background .3s ease",
                padding:0 }} />
          ))}
        </div>

        {/* arrows */}
        <div style={{ display:"flex", gap:"0.5rem" }}>
          <button onClick={prev} disabled={idx === 0}
            style={{ width:40, height:40, borderRadius:10,
              border:"1.5px solid " + (idx === 0 ? BDR : B),
              background: idx === 0 ? "transparent" : BLT,
              color: idx === 0 ? BDR : B,
              cursor: idx === 0 ? "default" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s" }}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} disabled={idx >= maxIdx}
            style={{ width:40, height:40, borderRadius:10,
              border:"1.5px solid " + (idx >= maxIdx ? BDR : B),
              background: idx >= maxIdx ? "transparent" : B,
              color: idx >= maxIdx ? BDR : "#fff",
              cursor: idx >= maxIdx ? "default" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .2s" }}>
            <ChevronRight size={18} />
          </button>
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
    if (!form.body.trim()) { setError("Écrivez votre avis avant d'envoyer."); return; }
    if (form.body.length > MAX_CHARS) { setError("Trop long — max " + MAX_CHARS + " caractères."); return; }
    setLoading(true); setError("");
    const { error:dbErr } = await supabase.from("testimonials").insert([{
      name:     anon ? "Anonyme" : form.name.trim(),
      role:     anon ? null : (form.role.trim() || null),
      body:     form.body.trim(),
      rating:   form.rating,
      approved: true,
    }]);
    setLoading(false);
    if (dbErr) setError("Erreur: " + dbErr.message);
    else { setDone(true); onSuccess && onSuccess(); }
  }

  const field = {
    width:"100%", padding:"0.75rem 1rem",
    border:"1.5px solid " + BDR, borderRadius:10,
    background:WHT, fontFamily:"'Fraunces',serif",
    fontSize:"0.9rem", color:INK, outline:"none",
    transition:"border-color .2s", boxSizing:"border-box",
  };
  const lbl = {
    display:"block", fontFamily:"'DM Mono',monospace",
    fontSize:"0.5rem", letterSpacing:"0.14em",
    textTransform:"uppercase", color:GRY, marginBottom:"0.35rem",
  };

  if (done) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", gap:"1rem", padding:"2.5rem 1rem",
      textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:BLT,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <CheckCircle size={30} color={B} strokeWidth={1.5} />
      </div>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
        letterSpacing:"0.04em", color:INK }}>
        Merci !
      </div>
      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:"0.9rem", color:"#3D3D38", lineHeight:1.7,
        maxWidth:300, margin:0 }}>
        Votre témoignage est publié et visible par tous.
      </p>
      <button
        onClick={() => { setDone(false); setForm({name:"",role:"",body:"",rating:5}); setAnon(false); }}
        style={{ background:"none", border:"1.5px solid " + BDR,
          borderRadius:8, padding:"0.6rem 1.25rem", cursor:"pointer",
          fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
          letterSpacing:"0.12em", textTransform:"uppercase", color:GRY,
          transition:"all .2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor=B; e.currentTarget.style.color=B; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor=BDR; e.currentTarget.style.color=GRY; }}>
        Écrire un autre avis
      </button>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>

      {/* star rating */}
      <div>
        <label style={lbl}>Note globale</label>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} type="button"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setForm(f => ({ ...f, rating:s }))}
              style={{ background:"transparent", border:"none", cursor:"pointer",
                padding:"2px", transition:"transform .15s",
                transform: s <= (hover || form.rating) ? "scale(1.2)" : "scale(1)" }}>
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

      {/* name */}
      {!anon && (
        <div>
          <label style={lbl}>Nom complet *</label>
          <input type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name:e.target.value }))}
            placeholder="Pr. Jean Dupont" maxLength={80}
            style={field}
            onFocus={e => e.target.style.borderColor=B}
            onBlur={e => e.target.style.borderColor=BDR} />
        </div>
      )}

      {/* role */}
      {!anon && (
        <div>
          <label style={lbl}>Rôle / Établissement</label>
          <input type="text" value={form.role}
            onChange={e => setForm(f => ({ ...f, role:e.target.value }))}
            placeholder="Enseignant — ESSEC" maxLength={80}
            style={field}
            onFocus={e => e.target.style.borderColor=B}
            onBlur={e => e.target.style.borderColor=BDR} />
        </div>
      )}

      {/* body */}
      <div>
        <label style={lbl}>Votre avis *</label>
        <textarea value={form.body}
          onChange={e => setForm(f => ({ ...f, body:e.target.value }))}
          placeholder="Partagez votre expérience de la STUD 2026…"
          maxLength={MAX_CHARS + 20} rows={4}
          style={{ ...field, resize:"vertical", minHeight:100 }}
          onFocus={e => e.target.style.borderColor=B}
          onBlur={e => e.target.style.borderColor=BDR} />
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
          color: charsLeft < 30 ? "#E65100" : "rgba(10,10,10,0.3)",
          textAlign:"right", marginTop:"0.25rem" }}>
          {charsLeft} caractère{charsLeft !== 1 ? "s" : ""} restant{charsLeft !== 1 ? "s" : ""}
        </div>
      </div>

      {/* error */}
      {error && (
        <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
          color:"#C62828", letterSpacing:"0.08em", margin:0 }}>
          ⚠ {error}
        </p>
      )}

      {/* submit */}
      <button type="button" onClick={handleSubmit} disabled={loading}
        style={{ width:"100%", padding:"0.95rem",
          background: loading ? BDR : B, border:"none", borderRadius:10,
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
          letterSpacing:"0.16em", textTransform:"uppercase",
          color: loading ? GRY : "#fff",
          display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
          transition:"background .2s",
          boxShadow: loading ? "none" : "0 4px 16px rgba(21,101,192,0.28)" }}
        onMouseEnter={e => { if(!loading) e.currentTarget.style.background=BDK; }}
        onMouseLeave={e => { if(!loading) e.currentTarget.style.background=B; }}>
        {loading ? "Envoi..." : <><Send size={14} /> Soumettre mon avis</>}
      </button>

      <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
        letterSpacing:"0.08em", color:"rgba(10,10,10,0.25)",
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
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);

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
    const ch = supabase
      .channel("testi-page-v3")
      .on("postgres_changes",
        { event:"INSERT", schema:"public", table:"testimonials" },
        () => fetchAll())
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const avgRating = items.length
    ? (items.reduce((a, t) => a + t.rating, 0) / items.length).toFixed(1)
    : null;

  return (
    <div style={{ background:BG, minHeight:"100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ background:INK, borderBottom:"3px solid " + B,
        height:60, display:"flex", alignItems:"center",
        padding:"0 1.5rem", gap:"1rem",
        position:"sticky", top:0, zIndex:50 }}>

        <Link to="/" style={{ display:"flex", alignItems:"center", gap:"0.4rem",
          color:"rgba(255,255,255,0.45)", textDecoration:"none",
          fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
          letterSpacing:"0.12em", textTransform:"uppercase",
          transition:"color .2s", flexShrink:0 }}
          onMouseEnter={e => e.currentTarget.style.color="#fff"}
          onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
          <ArrowLeft size={13} /> Accueil
        </Link>

        <div style={{ width:1, height:20, background:"rgba(255,255,255,0.1)" }} />

        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.2rem",
          letterSpacing:"0.06em", color:"#fff" }}>
          TÉMOIGNAGES
          <span style={{ color:B, marginLeft:"0.35rem" }}>STUD 2026</span>
        </div>

        {items.length > 0 && (
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"1rem" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"1.3rem", color:B, lineHeight:1 }}>
                {items.length}
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
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
                    fontSize:"1.3rem", color:"#F9A825", lineHeight:1 }}>
                    {avgRating}
                  </div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
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

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth:860, margin:"0 auto", padding:"2rem 1.5rem 4rem" }}>

        {/* ── FORM SECTION — always visible ── */}
        <div style={{ background:WHT, borderRadius:16,
          border:"1px solid " + BDR,
          boxShadow:"0 4px 24px rgba(21,101,192,0.08)",
          overflow:"hidden", marginBottom:"2.5rem" }}>

          {/* form header */}
          <div style={{ background:B, padding:"1.5rem 1.75rem" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
              letterSpacing:"0.18em", textTransform:"uppercase",
              color:"rgba(255,255,255,0.55)", marginBottom:"0.35rem" }}>
              Partagez votre expérience
            </div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.8rem",
              letterSpacing:"0.04em", color:"#fff",
              lineHeight:0.95, margin:0 }}>
              VOTRE AVIS COMPTE
            </h2>
          </div>

          {/* form body */}
          <div style={{ padding:"1.75rem" }}>
            <SubmitForm onSuccess={fetchAll} />
          </div>
        </div>

        {/* ── CAROUSEL SECTION ── */}
        <div>
          {/* section header */}
          <div style={{ display:"flex", alignItems:"baseline",
            gap:"0.75rem", marginBottom:"1.25rem" }}>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"1.5rem", letterSpacing:"0.06em",
              color:INK, margin:0 }}>
              Ce qu'ils{" "}
              <span style={{ color:B }}>disent</span>
            </h2>
            {items.length > 0 && (
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
                letterSpacing:"0.12em", textTransform:"uppercase", color:GRY }}>
                {items.length} témoignage{items.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding:"2rem", textAlign:"center",
              fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", color:GRY }}>
              Chargement...
            </div>
          ) : (
            <Carousel items={items} />
          )}
        </div>

      </div>
    </div>
  );
}