// ============================================================
// TestimonialsPage.jsx — STUD 2026
// Standalone page at /temoignages
// ─────────────────────────────────────────────────────────────
// • Shareable link — no navbar/footer, works standalone
// • Left: scrollable feed of all approved testimonials
// • Right: sticky inline submission form
// • Real-time: new testimonials appear instantly after submit
// ============================================================

import { useState, useEffect, useRef } from "react";
import { Star, Send, CheckCircle, MessageSquare, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/superbase";
import { Link } from "react-router-dom";

const MAX_CHARS = 280;

// ── helpers ──────────────────────────────────────────────────
function initials(name) {
  if (!name || name === "Anonyme") return "?";
  return name.split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "?";
}

function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1)  return "À l'instant";
  if (m < 60) return "Il y a " + m + "min";
  const h = Math.floor(m / 60);
  if (h < 24) return "Il y a " + h + "h";
  return "Il y a " + Math.floor(h / 24) + "j";
}

const AVATAR_COLORS = ["#1565C0", "#F57C00", "#2E7D32", "#6A1B9A", "#AD1457", "#00695C"];
function avatarColor(name) {
  if (!name || name === "Anonyme") return "#88887F";
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

// ── Star display ─────────────────────────────────────────────
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

// ── Single testimonial card ───────────────────────────────────
function TestiCard({ t, idx }) {
  return (
    <div style={{
      background:"#fff",
      border:"1px solid rgba(10,10,10,0.08)",
      borderRadius:12,
      padding:"1.5rem",
      display:"flex",
      flexDirection:"column",
      gap:"0.875rem",
      animation:`fadeUp .5s ease ${Math.min(idx,8)*.06}s both`,
      position:"relative",
      overflow:"hidden",
    }}>
      {/* accent line */}
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:3,
        background:`linear-gradient(90deg, ${avatarColor(t.name)}, transparent)`,
      }} />

      {/* stars */}
      <Stars rating={t.rating} />

      {/* body */}
      <p style={{
        fontFamily:"'Fraunces',serif", fontStyle:"italic",
        fontSize:"0.92rem", lineHeight:1.75, color:"#3D3D38",
        margin:0, flex:1,
      }}>
        «&nbsp;{t.body}&nbsp;»
      </p>

      {/* author */}
      <div style={{
        display:"flex", alignItems:"center", gap:"0.75rem",
        paddingTop:"0.875rem",
        borderTop:"1px solid rgba(10,10,10,0.07)",
      }}>
        <div style={{
          width:38, height:38, borderRadius:"50%",
          background:avatarColor(t.name),
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'Bebas Neue',sans-serif", fontSize:"0.9rem",
          color:"#fff", flexShrink:0,
          boxShadow:`0 2px 8px ${avatarColor(t.name)}40`,
        }}>
          {initials(t.name)}
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontFamily:"'Fraunces',serif", fontWeight:700,
            fontSize:"0.85rem", color:"#0A0A0A",
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
          }}>
            {t.name === "Anonyme"
              ? <span style={{ fontStyle:"italic", color:"#88887F" }}>Anonyme</span>
              : t.name}
          </div>
          {t.role && t.name !== "Anonyme" && (
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:"0.46rem",
              letterSpacing:"0.12em", textTransform:"uppercase", color:"#88887F",
              marginTop:2,
            }}>
              {t.role}
            </div>
          )}
        </div>
        {t.created_at && (
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
            color:"rgba(10,10,10,0.25)", flexShrink:0,
          }}>
            {timeAgo(t.created_at)}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Submission form ───────────────────────────────────────────
function SubmitForm({ onSuccess }) {
  const [form, setForm]       = useState({ name:"", role:"", body:"", rating:5 });
  const [anon, setAnon]       = useState(false);
  const [hover, setHover]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const charsLeft = MAX_CHARS - form.body.length;

  const handleSubmit = async () => {
    if (!anon && !form.name.trim()) {
      setError("Renseignez votre nom ou choisissez l'option anonyme.");
      return;
    }
    if (!form.body.trim()) {
      setError("Écrivez votre avis avant d'envoyer.");
      return;
    }
    if (form.body.length > MAX_CHARS) {
      setError("Votre avis dépasse " + MAX_CHARS + " caractères.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: dbErr } = await supabase.from("testimonials").insert([{
      name:     anon ? "Anonyme" : form.name.trim(),
      role:     anon ? null : (form.role.trim() || null),
      body:     form.body.trim(),
      rating:   form.rating,
      approved: true,
    }]);
    setLoading(false);
    if (dbErr) {
      setError("Erreur: " + dbErr.message);
    } else {
      setDone(true);
      onSuccess && onSuccess();
    }
  };

  if (done) {
    return (
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:"1rem", padding:"3rem 1.5rem",
        textAlign:"center",
      }}>
        <CheckCircle size={52} color="#2E7D32" strokeWidth={1.5} />
        <div style={{
          fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
          letterSpacing:"0.04em", color:"#0A0A0A",
        }}>
          Merci !
        </div>
        <p style={{
          fontFamily:"'Fraunces',serif", fontStyle:"italic",
          fontSize:"0.9rem", color:"#3D3D38", lineHeight:1.7,
          maxWidth:280, margin:0,
        }}>
          Votre témoignage a été publié et est maintenant visible par tous.
        </p>
        <button
          onClick={() => { setDone(false); setForm({ name:"", role:"", body:"", rating:5 }); setAnon(false); }}
          style={{
            marginTop:"0.5rem",
            background:"none", border:"1.5px solid rgba(10,10,10,0.15)",
            borderRadius:6, padding:"0.6rem 1.25rem", cursor:"pointer",
            fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
            letterSpacing:"0.14em", textTransform:"uppercase", color:"#88887F",
            transition:"all .2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor="#0A0A0A"; e.currentTarget.style.color="#0A0A0A"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(10,10,10,0.15)"; e.currentTarget.style.color="#88887F"; }}
        >
          Écrire un autre avis
        </button>
      </div>
    );
  }

  const lbl = {
    fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
    letterSpacing:"0.16em", textTransform:"uppercase", color:"#88887F",
    display:"block", marginBottom:"0.35rem",
  };
  const field = {
    width:"100%", padding:"0.75rem 1rem",
    border:"1.5px solid rgba(10,10,10,0.12)",
    borderRadius:6, background:"#fff",
    fontFamily:"'Fraunces',serif", fontSize:"0.9rem",
    color:"#0A0A0A", outline:"none",
    transition:"border-color .2s",
    boxSizing:"border-box",
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.1rem" }}>

      {/* ── Star rating ── */}
      <div>
        <label style={lbl}>Note globale</label>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} type="button"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setForm(f => ({ ...f, rating:s }))}
              style={{
                background:"transparent", border:"none", cursor:"pointer",
                padding:"2px", transition:"transform .15s",
                transform: s <= (hover || form.rating) ? "scale(1.2)" : "scale(1)",
              }}>
              <Star size={26}
                fill={s <= (hover || form.rating) ? "#F9A825" : "none"}
                color={s <= (hover || form.rating) ? "#F9A825" : "rgba(10,10,10,0.15)"}
                strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Anonymous toggle ── */}
      <div
        onClick={() => { setAnon(a => !a); setForm(f => ({ ...f, name:"", role:"" })); }}
        style={{
          display:"flex", alignItems:"flex-start", gap:"0.65rem",
          padding:"0.75rem 1rem", borderRadius:8, cursor:"pointer",
          border:"1.5px solid " + (anon ? "#F57C00" : "rgba(10,10,10,0.1)"),
          background: anon ? "#FFF8F0" : "rgba(10,10,10,0.02)",
          transition:"all .2s",
        }}>
        <div style={{
          width:16, height:16, flexShrink:0, marginTop:1,
          border:"1.5px solid " + (anon ? "#F57C00" : "rgba(10,10,10,0.2)"),
          borderRadius:3, background: anon ? "#F57C00" : "#fff",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all .15s",
        }}>
          {anon && <span style={{ color:"#fff", fontSize:"0.6rem", fontWeight:700 }}>✓</span>}
        </div>
        <div>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
            letterSpacing:"0.14em", textTransform:"uppercase",
            color: anon ? "#E65100" : "#88887F",
          }}>
            Rester anonyme
          </div>
          <div style={{
            fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:"0.72rem", color:"rgba(10,10,10,0.3)", marginTop:2,
          }}>
            Votre nom ne sera pas affiché
          </div>
        </div>
      </div>

      {/* ── Name ── */}
      {!anon && (
        <div>
          <label style={lbl}>Nom complet *</label>
          <input type="text" value={form.name}
            onChange={e => setForm(f => ({ ...f, name:e.target.value }))}
            placeholder="Pr. Jean Dupont"
            maxLength={80}
            style={field}
            onFocus={e => e.target.style.borderColor="#F57C00"}
            onBlur={e => e.target.style.borderColor="rgba(10,10,10,0.12)"}
          />
        </div>
      )}

      {/* ── Role ── */}
      {!anon && (
        <div>
          <label style={lbl}>Rôle / Établissement</label>
          <input type="text" value={form.role}
            onChange={e => setForm(f => ({ ...f, role:e.target.value }))}
            placeholder="Enseignant — ESSEC"
            maxLength={80}
            style={field}
            onFocus={e => e.target.style.borderColor="#F57C00"}
            onBlur={e => e.target.style.borderColor="rgba(10,10,10,0.12)"}
          />
        </div>
      )}

      {/* ── Body ── */}
      <div>
        <label style={lbl}>Votre avis *</label>
        <textarea
          value={form.body}
          onChange={e => setForm(f => ({ ...f, body:e.target.value }))}
          placeholder="Partagez votre expérience de la STUD…"
          maxLength={MAX_CHARS + 20}
          rows={5}
          style={{ ...field, resize:"vertical", minHeight:110 }}
          onFocus={e => e.target.style.borderColor="#F57C00"}
          onBlur={e => e.target.style.borderColor="rgba(10,10,10,0.12)"}
        />
        <div style={{
          fontFamily:"'DM Mono',monospace", fontSize:"0.46rem",
          color: charsLeft < 30 ? "#F57C00" : "rgba(10,10,10,0.3)",
          textAlign:"right", marginTop:"0.25rem",
        }}>
          {charsLeft} caractère{charsLeft !== 1 ? "s" : ""} restant{charsLeft !== 1 ? "s" : ""}
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <p style={{
          fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
          color:"#C62828", letterSpacing:"0.1em", margin:0,
        }}>
          ⚠ {error}
        </p>
      )}

      {/* ── Submit ── */}
      <button type="button" onClick={handleSubmit} disabled={loading}
        style={{
          width:"100%", padding:"0.9rem",
          background: loading ? "#ccc" : "#F57C00",
          border:"none", borderRadius:8, cursor: loading ? "not-allowed" : "pointer",
          fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
          letterSpacing:"0.18em", textTransform:"uppercase",
          color:"#fff", display:"flex", alignItems:"center",
          justifyContent:"center", gap:"0.5rem",
          transition:"background .2s, transform .15s",
          boxShadow: loading ? "none" : "0 4px 16px rgba(245,124,0,0.3)",
        }}
        onMouseEnter={e => { if (!loading) e.currentTarget.style.background="#E65100"; }}
        onMouseLeave={e => { if (!loading) e.currentTarget.style.background="#F57C00"; }}
      >
        {loading ? "Envoi..." : <><Send size={14} /> Soumettre mon avis</>}
      </button>

      <p style={{
        fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
        letterSpacing:"0.1em", color:"rgba(10,10,10,0.28)",
        textAlign:"center", lineHeight:1.6, margin:0,
      }}>
        Votre avis est publié immédiatement et visible par tous.
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

  const fetchAll = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("id,name,role,body,rating,created_at")
      .eq("approved", true)
      .order("created_at", { ascending:false })
      .limit(50);
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    // Real-time — new testimonials appear instantly
    const channel = supabase
      .channel("testi-page")
      .on("postgres_changes",
        { event:"INSERT", schema:"public", table:"testimonials" },
        () => fetchAll())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const totalRatings = items.length
    ? (items.reduce((a, t) => a + t.rating, 0) / items.length).toFixed(1)
    : null;

  return (
    <div style={{
      background:"#F5F0E8",
      minHeight:"100vh",
      fontFamily:"'Fraunces',serif",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:none; }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        .testi-page-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 0;
          max-width: 1200px;
          margin: 0 auto;
          min-height: calc(100vh - 72px);
        }
        @media (max-width: 860px) {
          .testi-page-layout {
            grid-template-columns: 1fr;
          }
          .testi-form-col {
            border-left: none !important;
            border-top: 2px solid rgba(10,10,10,0.1) !important;
          }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        background:"#0A0A0A",
        borderBottom:"3px solid #F57C00",
        padding:"0 2rem",
        height:72,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        animation:"fadeIn .4s ease",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"1.25rem" }}>
          <Link to="/" style={{
            display:"flex", alignItems:"center", gap:"0.5rem",
            color:"rgba(255,255,255,0.5)", textDecoration:"none",
            fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
            letterSpacing:"0.14em", textTransform:"uppercase",
            transition:"color .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color="#fff"}
            onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
          >
            <ArrowLeft size={13} /> Accueil
          </Link>
          <div style={{ width:1, height:20, background:"rgba(255,255,255,0.1)" }} />
          <div style={{
            fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.35rem",
            letterSpacing:"0.06em", color:"#fff",
          }}>
            TÉMOIGNAGES
            <span style={{ color:"#F57C00", marginLeft:"0.4rem" }}>STUD 2026</span>
          </div>
        </div>

        {/* stats */}
        {items.length > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:"1.5rem" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem",
                color:"#F57C00", lineHeight:1,
              }}>
                {items.length}
              </div>
              <div style={{
                fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
                letterSpacing:"0.14em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.3)",
              }}>
                Avis
              </div>
            </div>
            {totalRatings && (
              <>
                <div style={{ width:1, height:28, background:"rgba(255,255,255,0.1)" }} />
                <div style={{ textAlign:"right" }}>
                  <div style={{
                    fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.6rem",
                    color:"#F9A825", lineHeight:1,
                  }}>
                    {totalRatings}
                  </div>
                  <div style={{
                    fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
                    letterSpacing:"0.14em", textTransform:"uppercase",
                    color:"rgba(255,255,255,0.3)",
                  }}>
                    /5 moy.
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="testi-page-layout">

        {/* ── LEFT: testimonials feed ── */}
        <div style={{
          padding:"2rem 2.5rem",
          overflowY:"auto",
        }}>
          <div style={{ marginBottom:"1.75rem" }}>
            <h1 style={{
              fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(2rem,5vw,3.5rem)",
              letterSpacing:"0.03em", color:"#0A0A0A",
              lineHeight:.9, margin:0,
            }}>
              Ce qu'ils <span style={{ color:"#F57C00" }}>disent</span>
            </h1>
            <p style={{
              fontFamily:"'DM Mono',monospace", fontSize:"0.54rem",
              letterSpacing:"0.18em", textTransform:"uppercase",
              color:"#88887F", marginTop:"0.6rem",
            }}>
              Témoignages du personnel — Université de Douala
            </p>
          </div>

          {loading ? (
            <div style={{
              padding:"4rem 0", textAlign:"center",
              fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.5rem",
              color:"rgba(10,10,10,0.15)", letterSpacing:"0.06em",
            }}>
              Chargement...
            </div>
          ) : items.length === 0 ? (
            <div style={{
              padding:"4rem 0", textAlign:"center",
              display:"flex", flexDirection:"column",
              alignItems:"center", gap:"0.75rem",
            }}>
              <MessageSquare size={40} color="rgba(10,10,10,0.1)" strokeWidth={1} />
              <div style={{
                fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
                color:"rgba(10,10,10,0.15)", letterSpacing:"0.06em",
              }}>
                Soyez le premier
              </div>
              <p style={{
                fontFamily:"'Fraunces',serif", fontStyle:"italic",
                color:"#88887F", fontSize:"0.9rem",
              }}>
                Partagez votre expérience de la STUD 2026.
              </p>
            </div>
          ) : (
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))",
              gap:"1rem",
            }}>
              {items.map((t, i) => <TestiCard key={t.id} t={t} idx={i} />)}
            </div>
          )}
        </div>

        {/* ── RIGHT: sticky form ── */}
        <div
          className="testi-form-col"
          style={{
            borderLeft:"2px solid rgba(10,10,10,0.08)",
            background:"#FAFAF8",
            position:"sticky",
            top:0,
            height:"calc(100vh - 72px)",
            overflowY:"auto",
            padding:"2rem 1.75rem",
          }}>

          {/* form header */}
          <div style={{ marginBottom:"1.5rem" }}>
            <div style={{
              fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
              letterSpacing:"0.2em", textTransform:"uppercase",
              color:"#88887F", marginBottom:"0.4rem",
            }}>
              Partagez votre avis
            </div>
            <h2 style={{
              fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.75rem",
              letterSpacing:"0.04em", color:"#0A0A0A",
              lineHeight:.95, margin:0,
            }}>
              VOTRE EXPÉRIENCE<br />
              <span style={{ color:"#F57C00" }}>COMPTE</span>
            </h2>
            <p style={{
              fontFamily:"'Fraunces',serif", fontStyle:"italic",
              fontSize:"0.8rem", color:"#88887F", lineHeight:1.6,
              marginTop:"0.5rem",
            }}>
              Votre témoignage est publié immédiatement et partagé avec toute la communauté.
            </p>
          </div>

          <SubmitForm onSuccess={fetchAll} />
        </div>
      </div>
    </div>
  );
}