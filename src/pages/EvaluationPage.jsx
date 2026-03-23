// ============================================================
// EvaluationPage.jsx — STUD 2026 · Mobile-fixed
// Desktop: dark left sidebar + scrollable right panel
// Mobile:  sticky top progress bar + full-width questions
// ============================================================

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, CheckCircle, Star, ChevronRight, Menu, X } from "lucide-react";
import { supabase } from "../lib/superbase";
import logo from "../assets/logo.png";

const BLUE   = "#1565C0";
const ORANGE = "#F57C00";
const INK    = "#0A0A0A";

const SECTION_COLORS = [
  "#1565C0","#F57C00","#2E7D32","#6A1B9A",
  "#D84315","#00695C","#AD1457","#0277BD",
  "#4E342E","#1565C0",
];

const SECTIONS = [
  {
    key:"section_preparation", title:"Préparation", subtitle:"et Organisation", emoji:"📋",
    questions:[
      { id:"q1",  type:"yesno", text:"La préparation générale de l'événement vous a semblé satisfaisante." },
      { id:"q2",  type:"yesno", text:"Le calendrier des activités a été communiqué à temps." },
      { id:"q3",  type:"scale", text:"La coordination entre les différentes sous-commissions a été efficace." },
    ],
  },
  {
    key:"section_communication", title:"Communication", subtitle:"et Visibilité", emoji:"📣",
    questions:[
      { id:"q4",  type:"scale",  text:"Les supports de communication (affiches, flyers, réseaux sociaux) étaient clairs et accessibles." },
      { id:"q5",  type:"yesno",  text:"Les informations pratiques (lieux, horaires, inscriptions) étaient faciles à obtenir." },
      { id:"q6",  type:"scale",  text:"La couverture médiatique (presse, radio, TV) a contribué à valoriser l'événement." },
      { id:"q26", type:"choice", text:"Comment évaluez-vous la communication avant l'événement ?",
        options:["Excellente","Bonne","Moyenne","Insuffisante"] },
    ],
  },
  {
    key:"section_logistique", title:"Logistique", subtitle:"et Infrastructures", emoji:"🏗️",
    questions:[
      { id:"q7",  type:"scale",  text:"Les lieux des activités étaient bien aménagés et accessibles." },
      { id:"q8",  type:"yesno",  text:"Le transport et la circulation des participants ont été bien organisés." },
      { id:"q9",  type:"scale",  text:"La décoration et l'identité visuelle reflétaient l'image institutionnelle." },
      { id:"ql1", type:"choice", text:"L'emplacement et l'accessibilité du lieu étaient-ils satisfaisants ?",
        options:["Oui","Non","Partiellement"] },
    ],
  },
  {
    key:"section_sport", title:"Activités", subtitle:"Sportives", emoji:"⚽",
    questions:[
      { id:"q10", type:"scale", text:"Les compétitions sportives (football, relais, tir à la corde, marche) étaient bien organisées." },
      { id:"q11", type:"yesno", text:"L'encadrement (arbitrage, animation) était satisfaisant." },
    ],
  },
  {
    key:"section_culture", title:"Activités", subtitle:"Culturelles", emoji:"🎭",
    questions:[
      { id:"q12", type:"scale",  text:"Les concours (poésie, danses patrimoniales, karaoké, art culinaire) ont valorisé la créativité et le patrimoine." },
      { id:"q13", type:"yesno",  text:"L'élection Miss/Master STUD a été bien organisée et représentative." },
      { id:"qc1", type:"choice", text:"Les activités proposées étaient :",
        options:["Très intéressantes","Intéressantes","Peu intéressantes","Pas intéressantes"] },
    ],
  },
  {
    key:"section_intellectuel", title:"Activités", subtitle:"Intellectuelles", emoji:"🎓",
    questions:[
      { id:"q14", type:"scale", text:"Les conférences-débats étaient pertinentes et enrichissantes." },
      { id:"q15", type:"yesno", text:"Les actions d'investissement humain (assainissement des campus) ont eu un impact positif." },
      { id:"q16", type:"yesno", text:"La visite guidée (PAD) a été utile et bien encadrée." },
      { id:"qi1", type:"yesno", text:"Avez-vous été satisfait du nombre de conférences proposé ?" },
      { id:"qi2", type:"yesno", text:"Ce cycle vous a-t-il semblé adapté aux questions actuelles ?" },
      { id:"qi3", type:"yesno", text:"Les intervenants étaient-ils légitimes ?" },
      { id:"qi4", type:"yesno", text:"Avez-vous appris des choses ?" },
    ],
  },
  {
    key:"section_restauration", title:"Restauration", subtitle:"et Bien-être", emoji:"🍽️",
    questions:[
      { id:"q17", type:"scale",  text:"La qualité des repas et boissons était satisfaisante." },
      { id:"q18", type:"yesno",  text:"Les espaces de restauration étaient bien organisés et conformes aux normes d'hygiène." },
      { id:"qr1", type:"choice", text:"Restauration — qualité des repas et boissons :",
        options:["Excellente","Bonne","Moyenne","Insuffisante"] },
    ],
  },
  {
    key:"section_sante", title:"Santé", subtitle:"et Sécurité", emoji:"🏥",
    questions:[
      { id:"q19", type:"yesno", text:"Les dispositifs médicaux et de premiers secours étaient suffisants." },
      { id:"q20", type:"scale", text:"Les mesures d'hygiène et de prévention étaient respectées." },
    ],
  },
  {
    key:"section_ambiance", title:"Ambiance", subtitle:"et Cohésion", emoji:"🤝",
    questions:[
      { id:"q21", type:"scale",  text:"L'ambiance générale de la STUD 2026 était conviviale et motivante." },
      { id:"q22", type:"yesno",  text:"L'événement a favorisé les échanges entre collègues et étudiants." },
      { id:"qa1", type:"yesno",  text:"Avez-vous eu l'occasion d'échanger avec des collègues que vous ne connaissiez pas ?" },
      { id:"qa2", type:"choice", text:"L'ambiance générale était :",
        options:["Excellente","Bonne","Moyenne","À améliorer"] },
      { id:"qa3", type:"choice", text:"Comment avez-vous trouvé l'accueil ?",
        options:["Très satisfaisant","Satisfaisant","Convenable","Inexistant","Désagréable"] },
    ],
  },
  {
    key:"section_satisfaction", title:"Satisfaction", subtitle:"Globale", emoji:"🏆",
    questions:[
      { id:"q23", type:"yesno",  text:"La STUD 2026 a contribué à renforcer le sentiment d'appartenance à l'Université de Douala." },
      { id:"q24", type:"scale",  text:"Globalement, êtes-vous satisfait(e) de l'événement ?" },
      { id:"q25", type:"yesno",  text:"Reviendriez-vous participer à une prochaine édition ?" },
      { id:"qs1", type:"choice", text:"Satisfaction globale — êtes-vous satisfait(e) de l'événement ?",
        options:["Très satisfait(e)","Satisfait(e)","Peu satisfait(e)","Pas du tout satisfait(e)"] },
      { id:"qs2", type:"yesno",  text:"Avez-vous trouvé le contenu de l'évènement instructif et intéressant ?" },
    ],
  },
];

const TOTAL = SECTIONS.length;
const SCALE_LABELS = ["","Très insuffisant","Insuffisant","Moyen","Bien","Excellent"];

// ── Input components ──────────────────────────────────────────

function YesNo({ value, onChange, color }) {
  return (
    <div style={{ display:"flex", gap:"0.6rem" }}>
      {["Oui","Non"].map(opt => {
        const active = value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            flex:1, padding:"0.75rem 0",
            border:`2px solid ${active ? color : "rgba(10,10,10,.1)"}`,
            borderRadius:10, background: active ? color : "#fff",
            color: active ? "#fff" : "#555",
            fontFamily:"'DM Mono',monospace", fontSize:"0.68rem",
            letterSpacing:"0.16em", textTransform:"uppercase",
            cursor:"pointer", transition:"all .18s",
            fontWeight: active ? 600 : 400,
            boxShadow: active ? `0 4px 14px ${color}35` : "none",
          }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function StarRating({ value, onChange, color }) {
  const [hover, setHover] = useState(0);
  const display = hover || value || 0;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"0.5rem" }}>
      <div style={{ display:"flex", gap:"0.25rem", flexWrap:"wrap" }}>
        {[1,2,3,4,5].map(n => (
          <button key={n}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            style={{ background:"none", border:"none", cursor:"pointer",
              padding:"3px", lineHeight:1, touchAction:"manipulation" }}>
            <Star size={36}
              fill={display >= n ? color : "none"}
              color={display >= n ? color : "rgba(10,10,10,.15)"}
              strokeWidth={1.5}
              style={{ transition:"all .12s",
                transform: display >= n ? "scale(1.12)" : "scale(1)" }}
            />
          </button>
        ))}
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
        letterSpacing:"0.14em", color: value ? color : "rgba(10,10,10,.28)",
        textTransform:"uppercase", minHeight:"1.2em" }}>
        {value ? SCALE_LABELS[value] : "Sélectionnez une note"}
      </div>
    </div>
  );
}

function PillChoice({ options, value, onChange, color }) {
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
      {options.map(opt => {
        const active = value === opt;
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding:"0.6rem 1.1rem",
            border:`1.5px solid ${active ? color : "rgba(10,10,10,.1)"}`,
            borderRadius:100,
            background: active ? color : "#fff",
            color: active ? "#fff" : "#444",
            fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:"0.88rem", cursor:"pointer",
            transition:"all .18s",
            boxShadow: active ? `0 3px 12px ${color}30` : "none",
            touchAction:"manipulation",
          }}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function QuestionCard({ q, answer, onAnswer, index, color }) {
  const answered = answer !== undefined && answer !== null && answer !== "";
  return (
    <div style={{
      background:"#fff", borderRadius:14,
      border:`1.5px solid ${answered ? color + "28" : "rgba(10,10,10,.07)"}`,
      padding:"1.4rem 1.5rem",
      boxShadow: answered
        ? `0 2px 18px ${color}12`
        : "0 1px 6px rgba(0,0,0,.04)",
      transition:"border-color .25s, box-shadow .25s",
    }}>
      <div style={{ display:"flex", gap:"0.7rem", marginBottom:"1rem",
        alignItems:"flex-start" }}>
        <span style={{
          flexShrink:0, width:26, height:26, borderRadius:"50%",
          background: answered ? color : "rgba(10,10,10,.06)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
          color: answered ? "#fff" : "#bbb", fontWeight:700,
          transition:"background .25s", marginTop:2,
        }}>
          {answered ? "✓" : index + 1}
        </span>
        <p style={{ fontFamily:"'Fraunces',serif", fontSize:"0.93rem",
          color:INK, lineHeight:1.65, margin:0 }}>
          {q.text}
        </p>
      </div>
      {q.type === "yesno"  && <YesNo      value={answer}        onChange={onAnswer} color={color} />}
      {q.type === "scale"  && <StarRating value={answer || 0}   onChange={onAnswer} color={color} />}
      {q.type === "choice" && <PillChoice options={q.options}   value={answer} onChange={onAnswer} color={color} />}
    </div>
  );
}

// ── Sidebar section list (shared between desktop + mobile drawer) ──
function SectionList({ step, answers, onSelect, color }) {
  return (
    <>
      {SECTIONS.map((s, i) => {
        const secAnswered = s.questions.filter(q => {
          const a = answers[q.id];
          return a !== undefined && a !== null && a !== "";
        }).length;
        const complete  = secAnswered === s.questions.length;
        const isCurrent = step === i + 1;
        const isPast    = step > i + 1;
        const c         = SECTION_COLORS[i];

        return (
          <button key={s.key}
            onClick={() => { if (isPast || isCurrent) onSelect(i + 1); }}
            style={{
              display:"flex", alignItems:"center", gap:"0.7rem",
              width:"100%", padding:"0.65rem 1.5rem",
              background: isCurrent ? "rgba(255,255,255,.07)" : "transparent",
              border:"none",
              cursor: isPast || isCurrent ? "pointer" : "default",
              borderLeft: isCurrent ? `3px solid ${c}` : "3px solid transparent",
              transition:"background .18s, border-color .18s",
              textAlign:"left",
            }}>
            {/* circle */}
            <div style={{ flexShrink:0, width:24, height:24, borderRadius:"50%",
              background: complete ? c : isCurrent ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.05)",
              border: complete ? "none" : isCurrent ? `1.5px solid ${c}` : "1.5px solid rgba(255,255,255,.1)",
              display:"flex", alignItems:"center", justifyContent:"center",
              transition:"all .25s" }}>
              {complete
                ? <span style={{color:"#fff",fontSize:"0.58rem",fontWeight:700}}>✓</span>
                : <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
                    color: isCurrent ? c : "rgba(255,255,255,.28)" }}>{i+1}</span>
              }
            </div>
            {/* label */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"0.85rem", letterSpacing:"0.06em",
                color: isCurrent ? "#fff" : complete ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.3)",
                lineHeight:1, transition:"color .18s",
                whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                {s.emoji} {s.title}
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color: isCurrent ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.18)",
                marginTop:2 }}>
                {s.questions.length} questions
              </div>
            </div>
            {isCurrent && <ChevronRight size={11} color={c} style={{flexShrink:0}} />}
          </button>
        );
      })}
    </>
  );
}

// ── Main export ───────────────────────────────────────────────
export default function EvaluationPage() {
  const [step,        setStep]        = useState(0);
  const [answers,     setAnswers]     = useState({});
  const [saving,      setSaving]      = useState(false);
  const [done,        setDone]        = useState(false);
  const [error,       setError]       = useState(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const rightRef = useRef(null);

  const isIntro  = step === 0;
  const secIdx   = step - 1;
  const section  = SECTIONS[secIdx];
  const color    = section ? SECTION_COLORS[secIdx] : BLUE;
  const progress = isIntro ? 0 : Math.round((step / TOTAL) * 100);

  const answered = section
    ? section.questions.filter(q => {
        const a = answers[q.id];
        return a !== undefined && a !== null && a !== "";
      }).length
    : 0;
  const total  = section ? section.questions.length : 0;
  const canNext = answered === total;

  useEffect(() => {
    if (rightRef.current) rightRef.current.scrollTo({ top:0, behavior:"smooth" });
    setDrawerOpen(false);
  }, [step]);

  // close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const h = (e) => {
      if (!e.target.closest(".eval-drawer") && !e.target.closest(".drawer-toggle"))
        setDrawerOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [drawerOpen]);

  // Test Supabase connection on mount
  useEffect(() => {
    supabase
      .from("stud_evaluations")
      .select("id", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error("[EVAL] Supabase connection test failed:", error.message, error.code);
          console.error("[EVAL] Hint: Make sure the stud_evaluations table exists in Supabase.");
        } else {
          console.log("[EVAL] Supabase connected. stud_evaluations has", count, "rows.");
        }
      });
  }, []);

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));

  const handleNext = async () => {
    if (step < TOTAL) { setStep(s => s + 1); return; }
    setSaving(true); setError(null);
    try {
      // Build payload — one jsonb object per section
      const payload = {};
      SECTIONS.forEach(s => {
        const d = {};
        s.questions.forEach(q => { d[q.id] = answers[q.id] ?? null; });
        payload[s.key] = d;
      });
      payload.submitted_at = new Date().toISOString();

      console.log("[EVAL] submitting:", JSON.stringify(payload, null, 2));

      const { data, error: err } = await supabase
        .from("stud_evaluations")
        .insert([payload])
        .select();

      if (err) {
        console.error("[EVAL] error:", err);
        setError(`Erreur: ${err.message} (code: ${err.code})`);
        return;
      }

      console.log("[EVAL] success:", data);
      setDone(true);
    } catch(e) {
      console.error("[EVAL] unexpected:", e);
      setError("Erreur inattendue. Vérifiez la console (F12).");
    } finally { setSaving(false); }
  };

  // ── DONE screen ───────────────────────────────────────────
  if (done) return (
    <div style={{ minHeight:"100vh", background:"#f8f8f6", display:"flex",
      alignItems:"center", justifyContent:"center", padding:"1.5rem" }}>
      <style>{CSS}</style>
      <div style={{ textAlign:"center", display:"flex", flexDirection:"column",
        alignItems:"center", gap:"1.75rem", maxWidth:460, width:"100%" }}>
        <div style={{ width:80, height:80, borderRadius:"50%",
          background:"linear-gradient(135deg,#EEF4FF,#DBEAFE)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 8px 32px rgba(21,101,192,.18)" }}>
          <CheckCircle size={40} color={BLUE} strokeWidth={1.5} />
        </div>
        <div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
            letterSpacing:"0.24em", textTransform:"uppercase", color:ORANGE, marginBottom:8 }}>
            STUD 2026 · Évaluation
          </div>
          <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"clamp(2.2rem,6vw,3.8rem)", lineHeight:.88,
            letterSpacing:"0.02em", color:INK, margin:0 }}>
            MERCI POUR<br/>
            <span style={{color:BLUE}}>VOTRE RETOUR !</span>
          </h1>
          <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:"0.9rem", color:"#3D3D38", lineHeight:1.85, marginTop:"1rem" }}>
            Vos réponses ont été enregistrées. Elles contribueront à améliorer
            les prochaines éditions de la Semaine du Travailleur.
          </p>
        </div>
        <Link to="/" style={{ background:BLUE, color:"#fff",
          padding:"0.8rem 2rem", fontFamily:"'DM Mono',monospace",
          fontSize:"0.58rem", letterSpacing:"0.14em", textTransform:"uppercase",
          textDecoration:"none", borderRadius:6,
          display:"inline-flex", alignItems:"center", gap:"0.4rem",
          boxShadow:"0 4px 16px rgba(21,101,192,.25)" }}>
          Retour à l'accueil <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );

  // ── MAIN LAYOUT ──────────────────────────────────────────
  return (
    <div className="eval-root">
      <style>{CSS}</style>

      {/* ════════════════
          MOBILE HEADER
          (hidden on desktop)
      ════════════════ */}
      <header className="eval-mobile-header">
        <Link to="/">
          <img src={logo} alt="STUD 2026" style={{ height:30 }} />
        </Link>

        {/* progress pill */}
        <div style={{ flex:1, margin:"0 1rem" }}>
          {!isIntro && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between",
                marginBottom:4 }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
                  letterSpacing:"0.14em", textTransform:"uppercase", color:"#88887F" }}>
                  {section?.emoji} {section?.title}
                </span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
                  color:"#aaa" }}>{step}/{TOTAL}</span>
              </div>
              <div style={{ height:4, background:"rgba(10,10,10,.08)",
                borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${progress}%`,
                  background:color, borderRadius:2,
                  transition:"width .4s ease" }} />
              </div>
            </>
          )}
        </div>

        {/* sections drawer toggle */}
        {!isIntro && (
          <button className="drawer-toggle"
            onClick={() => setDrawerOpen(o => !o)}
            style={{ background:INK, border:"none", borderRadius:8,
              width:38, height:38, display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
            {drawerOpen
              ? <X size={16} color="#fff" />
              : <Menu size={16} color="#fff" />
            }
          </button>
        )}
      </header>

      {/* ════════════════
          MOBILE SECTIONS DRAWER
          slides down from header
      ════════════════ */}
      <div className={`eval-drawer ${drawerOpen ? "open" : ""}`}>
        <div style={{ padding:"0.5rem 0 1rem" }}>
          <SectionList
            step={step} answers={answers}
            onSelect={s => { setStep(s); setDrawerOpen(false); }}
            color={color}
          />
        </div>
      </div>
      {/* backdrop */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)",
            zIndex:39, backdropFilter:"blur(2px)" }} />
      )}

      {/* ════════════════
          DESKTOP SIDEBAR
          (hidden on mobile)
      ════════════════ */}
      <aside className="eval-sidebar">
        <div style={{ padding:"1.75rem 1.5rem 1.25rem",
          borderBottom:"1px solid rgba(255,255,255,.07)" }}>
          <Link to="/">
            <img src={logo} alt="STUD 2026" style={{ height:34, opacity:.9 }} />
          </Link>
          <div style={{ marginTop:"1.25rem" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
              letterSpacing:"0.22em", textTransform:"uppercase",
              color:"rgba(255,255,255,.3)", marginBottom:4 }}>
              Questionnaire d'évaluation
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"1.3rem", letterSpacing:"0.04em", color:"#fff", lineHeight:.95 }}>
              STUD 2026
            </div>
          </div>
        </div>

        {/* progress */}
        <div style={{ padding:"0.875rem 1.5rem",
          borderBottom:"1px solid rgba(255,255,255,.06)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
              letterSpacing:"0.16em", textTransform:"uppercase",
              color:"rgba(255,255,255,.3)" }}>Progression</span>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
              color:"rgba(255,255,255,.45)" }}>{progress}%</span>
          </div>
          <div style={{ height:3, background:"rgba(255,255,255,.08)",
            borderRadius:2, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${progress}%`,
              background:`linear-gradient(90deg,${BLUE},#42A5F5)`,
              borderRadius:2, transition:"width .5s cubic-bezier(.22,1,.36,1)" }} />
          </div>
        </div>

        <nav style={{ flex:1, padding:"0.75rem 0", overflowY:"auto" }}>
          <SectionList step={step} answers={answers} onSelect={setStep} color={color} />
        </nav>

        <div style={{ padding:"1rem 1.5rem", borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:"0.66rem", color:"rgba(255,255,255,.2)",
            lineHeight:1.7, margin:0 }}>
            «Valoriser l'humain,<br/>inspirer la performance»
          </p>
        </div>
      </aside>

      {/* ════════════════
          MAIN CONTENT PANEL
      ════════════════ */}
      <main ref={rightRef} className="eval-main">

        {/* ── INTRO ── */}
        {isIntro && (
          <div className="eval-anim eval-content-pad" style={{ maxWidth:640, margin:"0 auto", width:"100%" }}>
            <div style={{ marginBottom:"2rem" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
                letterSpacing:"0.24em", textTransform:"uppercase",
                color:ORANGE, marginBottom:"0.75rem" }}>
                Université de Douala · STUD 2026
              </div>
              <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
                fontSize:"clamp(2.6rem,7vw,4.8rem)", lineHeight:.86,
                letterSpacing:"0.02em", color:INK, margin:0 }}>
                QUESTIONNAIRE<br/>
                <span style={{color:BLUE}}>D'ÉVALUATION</span>
              </h1>
              <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
                fontSize:"0.92rem", color:"#3D3D38", lineHeight:1.85,
                marginTop:"1rem", borderLeft:`2px solid ${ORANGE}`,
                paddingLeft:"1rem", maxWidth:460 }}>
                Partagez votre expérience et aidez-nous à améliorer les prochaines éditions.
              </p>
            </div>

            {/* section overview grid */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)",
              gap:"0.5rem", marginBottom:"1.75rem" }}>
              {SECTIONS.map((s,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.6rem",
                  padding:"0.65rem 0.875rem", background:"#fff", borderRadius:10,
                  border:"1px solid rgba(10,10,10,.07)",
                  boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
                  <span style={{ fontSize:"1rem", flexShrink:0 }}>{s.emoji}</span>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:"0.78rem", letterSpacing:"0.06em", color:INK,
                      lineHeight:1, whiteSpace:"nowrap", overflow:"hidden",
                      textOverflow:"ellipsis" }}>{s.title} {s.subtitle}</div>
                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
                      color:"#aaa", letterSpacing:"0.1em", textTransform:"uppercase",
                      marginTop:1 }}>{s.questions.length} questions</div>
                  </div>
                </div>
              ))}
            </div>

            {/* info pill */}
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem",
              padding:"0.875rem 1rem", background:"#EEF4FF", borderRadius:10,
              border:"1px solid rgba(21,101,192,.12)", marginBottom:"2rem" }}>
              <span style={{fontSize:"1.1rem"}}>⏱️</span>
              <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
                fontSize:"0.82rem", color:BLUE, margin:0, lineHeight:1.6 }}>
                {SECTIONS.reduce((a,s)=>a+s.questions.length,0)} questions · {SECTIONS.length} sections · ~5 à 8 minutes
              </p>
            </div>

            <button onClick={() => setStep(1)}
              style={{ background:BLUE, color:"#fff", border:"none",
                padding:"0.9rem 2.25rem", fontFamily:"'DM Mono',monospace",
                fontSize:"0.6rem", letterSpacing:"0.16em", textTransform:"uppercase",
                borderRadius:8, cursor:"pointer", display:"inline-flex",
                alignItems:"center", gap:"0.5rem", alignSelf:"flex-start",
                boxShadow:"0 4px 18px rgba(21,101,192,.28)",
                transition:"background .2s,transform .2s",
                touchAction:"manipulation" }}
              onMouseOver={e=>{ e.currentTarget.style.background="#0D47A1"; e.currentTarget.style.transform="translateX(3px)"; }}
              onMouseOut={e=>{ e.currentTarget.style.background=BLUE; e.currentTarget.style.transform="none"; }}>
              Commencer <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* ── SECTION STEP ── */}
        {!isIntro && section && (
          <div key={step} className="eval-anim eval-content-pad"
            style={{ maxWidth:680, margin:"0 auto", width:"100%", paddingBottom:"6rem" }}>

            {/* section heading */}
            <div style={{ marginBottom:"1.75rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.75rem",
                marginBottom:"0.875rem" }}>
                <div style={{ width:46, height:46, borderRadius:12,
                  background:`${color}18`, display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:"1.35rem", flexShrink:0 }}>
                  {section.emoji}
                </div>
                <div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
                    letterSpacing:"0.2em", textTransform:"uppercase",
                    color:"#88887F", marginBottom:3 }}>
                    Section {step} / {TOTAL}
                  </div>
                  <h2 style={{ fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:"clamp(1.4rem,5vw,2.4rem)", letterSpacing:"0.04em",
                    color:INK, margin:0, lineHeight:.9 }}>
                    {section.title}{" "}
                    <span style={{color}}>{section.subtitle}</span>
                  </h2>
                </div>
              </div>
              {/* mini progress bar */}
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <div style={{ flex:1, height:3, background:"rgba(10,10,10,.07)",
                  borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%",
                    width:`${total > 0 ? (answered/total)*100 : 0}%`,
                    background:color, borderRadius:2, transition:"width .4s ease" }} />
                </div>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
                  color: answered===total ? color : "#bbb",
                  letterSpacing:"0.12em", flexShrink:0, transition:"color .3s" }}>
                  {answered}/{total}
                </span>
              </div>
            </div>

            {/* question cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
              {section.questions.map((q,qi) => (
                <div key={q.id}
                  style={{ animation:`slideQ .4s cubic-bezier(.22,1,.36,1) ${qi*.07}s both` }}>
                  <QuestionCard
                    q={q} index={qi}
                    answer={answers[q.id]}
                    onAnswer={val => setAnswer(q.id, val)}
                    color={color}
                  />
                </div>
              ))}
            </div>

            {!canNext && answered > 0 && (
              <div style={{ marginTop:"1rem", fontFamily:"'DM Mono',monospace",
                fontSize:"0.44rem", letterSpacing:"0.14em", color:"#bbb",
                textTransform:"uppercase" }}>
                {total - answered} réponse{total-answered>1?"s":""} restante{total-answered>1?"s":""}
              </div>
            )}

            {error && (
              <div style={{ marginTop:"1rem", padding:"0.875rem 1rem",
                background:"#FFF3F3", border:"1px solid #FFCCCC",
                borderRadius:8, fontFamily:"'DM Mono',monospace",
                fontSize:"0.54rem", color:"#C62828" }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── STICKY BOTTOM NAV ── */}
        {!isIntro && (
          <div className="eval-bottom-nav">
            <button onClick={() => setStep(s=>s-1)}
              style={{ display:"inline-flex", alignItems:"center", gap:"0.4rem",
                background:"transparent", border:"1.5px solid rgba(10,10,10,.12)",
                color:"#555", padding:"0.65rem 1.1rem",
                fontFamily:"'DM Mono',monospace", fontSize:"0.54rem",
                letterSpacing:"0.12em", textTransform:"uppercase",
                borderRadius:8, cursor:"pointer", transition:"all .18s",
                touchAction:"manipulation" }}
              onMouseOver={e=>{ e.currentTarget.style.background=INK; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor=INK; }}
              onMouseOut={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#555"; e.currentTarget.style.borderColor="rgba(10,10,10,.12)"; }}>
              <ArrowLeft size={12} /> Précédent
            </button>

            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
              color:"#bbb", letterSpacing:"0.16em" }}>
              {step} / {TOTAL}
            </span>

            <button onClick={handleNext} disabled={!canNext || saving}
              style={{
                display:"inline-flex", alignItems:"center", gap:"0.4rem",
                background: canNext ? color : "rgba(10,10,10,.08)",
                color: canNext ? "#fff" : "#bbb",
                border:"none", padding:"0.65rem 1.5rem",
                fontFamily:"'DM Mono',monospace", fontSize:"0.54rem",
                letterSpacing:"0.14em", textTransform:"uppercase",
                borderRadius:8, cursor: canNext && !saving ? "pointer" : "not-allowed",
                transition:"background .2s, opacity .2s",
                boxShadow: canNext ? `0 3px 14px ${color}40` : "none",
                opacity: saving ? .7 : 1,
                touchAction:"manipulation",
              }}
              onMouseOver={e=>{ if(canNext&&!saving) e.currentTarget.style.opacity=".85"; }}
              onMouseOut={e=>{ e.currentTarget.style.opacity="1"; }}>
              {saving ? "Envoi…"
                : step < TOTAL
                ? <>Suivant <ArrowRight size={12} /></>
                : <>Soumettre <CheckCircle size={12} /></>
              }
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ── EvalFAB ───────────────────────────────────────────────────
export function EvalFAB() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link to="/evaluation"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"fixed", bottom:"5rem", right:"1.5rem", zIndex:999,
        display:"flex", alignItems:"center", gap:"0.55rem",
        background: hovered ? "#0D47A1" : BLUE,
        color:"#fff", textDecoration:"none",
        padding: hovered ? "0.7rem 1.2rem 0.7rem 1rem" : "0.7rem",
        borderRadius: hovered ? 22 : "50%",
        boxShadow:"0 4px 20px rgba(21,101,192,.4)",
        transition:"all .3s cubic-bezier(.22,1,.36,1)",
        width: hovered ? "auto" : 44, height:44,
        whiteSpace:"nowrap", overflow:"hidden",
      }}>
      <Star size={17} fill="#fff" strokeWidth={0} />
      {hovered && (
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
          letterSpacing:"0.14em", textTransform:"uppercase" }}>
          Évaluer
        </span>
      )}
    </Link>
  );
}

// ── Styles ────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

  /* ── root layout ── */
  .eval-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f8f8f6;
    position: relative;
  }

  /* ── desktop sidebar ── */
  .eval-sidebar {
    width: 272px;
    flex-shrink: 0;
    background: #0A0A0A;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .eval-sidebar::-webkit-scrollbar { width: 3px; }
  .eval-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius:2px; }

  /* ── main content ── */
  .eval-main {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
  }
  .eval-main::-webkit-scrollbar { width: 4px; }
  .eval-main::-webkit-scrollbar-thumb { background: rgba(10,10,10,.1); border-radius:2px; }

  /* content padding — desktop */
  .eval-content-pad {
    padding: 3rem 3rem 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* ── sticky bottom nav ── */
  .eval-bottom-nav {
    position: sticky;
    bottom: 0;
    background: rgba(248,248,246,.96);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-top: 1px solid rgba(10,10,10,.08);
    padding: 0.875rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    z-index: 10;
  }

  /* ── mobile header — hidden on desktop ── */
  .eval-mobile-header {
    display: none;
  }

  /* ── mobile drawer — hidden on desktop ── */
  .eval-drawer {
    display: none;
  }

  /* ── animations ── */
  @keyframes evalIn {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:none; }
  }
  .eval-anim { animation: evalIn .45s cubic-bezier(.22,1,.36,1) both; }

  @keyframes slideQ {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:none; }
  }

  @keyframes drawerSlide {
    from { opacity:0; transform:translateY(-8px); }
    to   { opacity:1; transform:none; }
  }

  /* ════════════════════════════════════════
     MOBILE — max-width 768px
  ════════════════════════════════════════ */
  @media (max-width: 768px) {

    /* switch root to column */
    .eval-root {
      flex-direction: column;
      height: 100%;
      min-height: 100vh;
      overflow: auto;
    }

    /* hide desktop sidebar */
    .eval-sidebar {
      display: none !important;
    }

    /* show mobile header */
    .eval-mobile-header {
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 40;
      background: #0A0A0A;
      padding: 0.75rem 1.25rem;
      gap: 0.75rem;
      flex-shrink: 0;
      min-height: 56px;
    }

    /* drawer */
    .eval-drawer {
      display: block;
      position: fixed;
      top: 56px;
      left: 0;
      right: 0;
      z-index: 40;
      background: #0A0A0A;
      max-height: 0;
      overflow: hidden;
      transition: max-height .35s cubic-bezier(.22,1,.36,1);
      border-bottom: 1px solid rgba(255,255,255,.06);
    }
    .eval-drawer.open {
      max-height: 70vh;
      overflow-y: auto;
      animation: drawerSlide .3s ease;
    }

    /* main fills remaining space */
    .eval-main {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
    }

    /* tighter content padding on mobile */
    .eval-content-pad {
      padding: 1.5rem 1.25rem 1.5rem;
      justify-content: flex-start;
    }

    /* bottom nav */
    .eval-bottom-nav {
      padding: 0.75rem 1.25rem;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }

    /* touch targets — bigger buttons */
    .eval-bottom-nav button {
      min-height: 44px;
    }
  }
`;