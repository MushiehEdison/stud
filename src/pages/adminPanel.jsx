// ============================================================
// adminPanel.jsx — STUD 2026
// Tabs: Galerie · Annonces · Témoignages · Évaluations · Trafic
// ============================================================

import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import {
  ImagePlus, Plus, Trash2, Pin, PinOff,
  Lock, LogOut, Upload, X, MessageSquare,
  ClipboardList, Star, ChevronDown, ChevronUp,
  Download, BarChart2,
} from "lucide-react";
import { fetchDailyStats } from "../lib/useVisitorTracker";

// ── constants ─────────────────────────────────────────────────
const ADMIN_PASSWORD = "stud2026admin";
const GALLERY_CATS   = ["Sports", "Culture", "Cérémonie", "Coulisses"];
const ANN_CATS       = ["Général", "Sport", "Culture", "Logistique"];
const CAT_COLORS     = { Général:"#1565C0", Sport:"#F57C00", Culture:"#F9A825", Logistique:"#6B7280" };

const EVAL_SECTIONS = [
  { key:"section_preparation",   label:"Préparation & Organisation",  emoji:"📋" },
  { key:"section_communication", label:"Communication & Visibilité",   emoji:"📣" },
  { key:"section_logistique",    label:"Logistique & Infrastructures", emoji:"🏗️" },
  { key:"section_sport",         label:"Activités Sportives",          emoji:"⚽" },
  { key:"section_culture",       label:"Activités Culturelles",        emoji:"🎭" },
  { key:"section_intellectuel",  label:"Activités Intellectuelles",    emoji:"🎓" },
  { key:"section_restauration",  label:"Restauration & Bien-être",     emoji:"🍽️" },
  { key:"section_sante",         label:"Santé & Sécurité",             emoji:"🏥" },
  { key:"section_ambiance",      label:"Ambiance & Cohésion",          emoji:"🤝" },
  { key:"section_satisfaction",  label:"Satisfaction Globale",         emoji:"🏆" },
];

const Q_LABELS = {
  q1:"Préparation générale satisfaisante", q2:"Calendrier communiqué à temps",
  q3:"Coordination sous-commissions (1-5)", q4:"Supports de communication (1-5)",
  q5:"Infos pratiques faciles à obtenir", q6:"Couverture médiatique (1-5)",
  q26:"Évaluation communication avant événement", q7:"Lieux bien aménagés (1-5)",
  q8:"Transport bien organisé", q9:"Décoration et identité visuelle (1-5)",
  ql1:"Accessibilité du lieu", q10:"Compétitions sportives (1-5)",
  q11:"Encadrement sportif satisfaisant", q12:"Activités culturelles (1-5)",
  q13:"Miss/Master STUD bien organisée", qc1:"Activités proposées",
  q14:"Conférences pertinentes (1-5)", q15:"Investissement humain impact positif",
  q16:"Visite guidée PAD utile", qi1:"Nombre de conférences satisfaisant",
  qi2:"Cycle adapté aux questions actuelles", qi3:"Intervenants légitimes",
  qi4:"Avez-vous appris des choses", q17:"Qualité repas et boissons (1-5)",
  q18:"Espaces restauration conformes", qr1:"Qualité restauration globale",
  q19:"Dispositifs médicaux suffisants", q20:"Mesures hygiène (1-5)",
  q21:"Ambiance conviviale (1-5)", q22:"Échanges favorisés",
  qa1:"Nouveaux échanges entre collègues", qa2:"Ambiance générale",
  qa3:"Qualité de l'accueil", q23:"Sentiment d'appartenance renforcé",
  q24:"Satisfaction globale (1-5)", q25:"Reviendriez participer",
  qs1:"Satisfaction globale détail", qs2:"Contenu instructif et intéressant",
};

// ── shared style objects ──────────────────────────────────────
const lbl = {
  display:"block", fontFamily:"'DM Mono',monospace",
  fontSize:"0.56rem", letterSpacing:"0.15em",
  textTransform:"uppercase", color:"#88887F", marginBottom:"0.4rem",
};
const inp = {
  width:"100%", padding:"0.65rem 0.9rem",
  border:"1.5px solid #EAEAE5", background:"#fff",
  fontFamily:"'Fraunces',serif", fontSize:"0.875rem",
  outline:"none", transition:"border-color .15s",
};

// ── tiny helpers ──────────────────────────────────────────────
function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 60) return "Il y a " + m + "min";
  const h = Math.floor(m / 60);
  if (h < 24) return "Il y a " + h + "h";
  return "Il y a " + Math.floor(h / 24) + "j";
}

function avgRating(row) {
  let sum = 0, count = 0;
  EVAL_SECTIONS.forEach(function(s) {
    var sec = row[s.key];
    if (!sec) return;
    Object.values(sec).forEach(function(v) {
      if (typeof v === "number" && v >= 1 && v <= 5) { sum += v; count++; }
    });
  });
  return count > 0 ? (sum / count).toFixed(1) : null;
}

function sectionAvg(secData) {
  if (!secData) return null;
  var nums = Object.values(secData).filter(function(v) {
    return typeof v === "number" && v >= 1 && v <= 5;
  });
  if (!nums.length) return null;
  return (nums.reduce(function(a, b) { return a + b; }, 0) / nums.length).toFixed(1);
}

// ── micro components ──────────────────────────────────────────
function Loader() {
  return (
    <p style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.7rem", color:"#88887F" }}>
      Chargement...
    </p>
  );
}

function Empty(props) {
  return (
    <div style={{ textAlign:"center", padding:"3rem", background:"#fff",
      border:"1.5px solid #EAEAE5" }}>
      {props.icon && (
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"0.75rem" }}>
          {props.icon}
        </div>
      )}
      <span style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
        color:"#88887F", fontSize:"0.9rem" }}>
        {props.text}
      </span>
    </div>
  );
}

function Tag(props) {
  var color = props.color || "#1565C0";
  return (
    <span style={{ background:color + "18", color:color,
      fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
      letterSpacing:"0.1em", textTransform:"uppercase",
      padding:"0.12rem 0.4rem" }}>
      {props.text}
    </span>
  );
}

function DelBtn(props) {
  return (
    <button onClick={props.onClick}
      style={{ background:"none", border:"none", cursor:"pointer",
        padding:"0.3rem", color:"#88887F", transition:"color .15s",
        display:"flex", alignItems:"center" }}
      onMouseEnter={function(e) { e.currentTarget.style.color = "#C62828"; }}
      onMouseLeave={function(e) { e.currentTarget.style.color = "#88887F"; }}>
      <Trash2 size={15} />
    </button>
  );
}

function StarDisplay(props) {
  var value = parseFloat(props.value || 0);
  var size  = props.size || 12;
  return (
    <span style={{ display:"inline-flex", gap:1, alignItems:"center" }}>
      {[1,2,3,4,5].map(function(i) {
        return (
          <Star key={i} size={size}
            fill={i <= Math.round(value) ? "#F9A825" : "none"}
            color={i <= Math.round(value) ? "#F9A825" : "#ddd"}
            strokeWidth={1.5}
          />
        );
      })}
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
        color:"#88887F", marginLeft:3 }}>
        {value}
      </span>
    </span>
  );
}

function AnswerPill(props) {
  var value = props.value;
  if (value === null || value === undefined) {
    return <span style={{ color:"#ccc", fontSize:"0.7rem" }}>—</span>;
  }
  if (typeof value === "number") {
    return <StarDisplay value={value} />;
  }
  var isYes = value === "Oui";
  var isNo  = value === "Non";
  var bg    = isYes ? "#E8F5E9" : isNo ? "#FFEBEE" : "#EEF4FF";
  var col   = isYes ? "#2E7D32" : isNo ? "#C62828" : "#1565C0";
  var bord  = isYes ? "#A5D6A7" : isNo ? "#FFCDD2" : "#BBDEFB";
  return (
    <span style={{ display:"inline-block", padding:"0.1rem 0.5rem",
      borderRadius:99, fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
      letterSpacing:"0.1em", textTransform:"uppercase",
      background:bg, color:col, border:"1px solid " + bord }}>
      {value}
    </span>
  );
}

// ── Evaluation row (expandable) ───────────────────────────────
function EvalRow(props) {
  var row      = props.row;
  var onDelete = props.onDelete;
  var [open, setOpen] = useState(false);
  var avg  = avgRating(row);
  var date = new Date(row.submitted_at || row.created_at);
  var dateStr = date.toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });
  var timeStr = date.toLocaleTimeString("fr-FR", { hour:"2-digit", minute:"2-digit" });

  return (
    <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
      borderRadius:2, overflow:"hidden" }}>

      <div style={{ display:"flex", alignItems:"center", gap:"1rem",
        padding:"0.875rem 1.25rem", cursor:"pointer" }}
        onClick={function() { setOpen(function(o) { return !o; }); }}>

        <div style={{ width:32, height:32, borderRadius:"50%", background:"#EEF4FF",
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
            color:"#1565C0", fontWeight:700 }}>
            {"#" + String(row._idx).padStart(3, "0")}
          </span>
        </div>

        <div style={{ flexShrink:0 }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.56rem",
            color:"#0A0A0A", letterSpacing:"0.08em" }}>{dateStr}</div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
            color:"#88887F" }}>{timeStr}</div>
        </div>

        <div style={{ display:"flex", gap:4, flex:1, flexWrap:"wrap" }}>
          {EVAL_SECTIONS.map(function(s) {
            var sec     = row[s.key];
            var hasData = sec && Object.values(sec).some(function(v) {
              return v !== null && v !== undefined;
            });
            return (
              <div key={s.key} title={s.label}
                style={{ width:8, height:8, borderRadius:"50%",
                  background:hasData ? "#1565C0" : "#E0E0E0", flexShrink:0 }} />
            );
          })}
        </div>

        <div style={{ flexShrink:0 }}>
          {avg
            ? <StarDisplay value={avg} />
            : <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem", color:"#ccc" }}>—</span>
          }
        </div>

        <div style={{ display:"flex", gap:"0.35rem", alignItems:"center", flexShrink:0 }}>
          <button
            onClick={function(e) { e.stopPropagation(); onDelete(row.id); }}
            style={{ background:"none", border:"none", cursor:"pointer",
              padding:"0.3rem", color:"#88887F", transition:"color .15s",
              display:"flex", alignItems:"center" }}
            onMouseEnter={function(e) { e.currentTarget.style.color = "#C62828"; }}
            onMouseLeave={function(e) { e.currentTarget.style.color = "#88887F"; }}>
            <Trash2 size={14} />
          </button>
          <div style={{ color:"#88887F" }}>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>

      {open && (
        <div style={{ borderTop:"1px solid #EAEAE5", padding:"1.25rem 1.5rem",
          display:"grid", gridTemplateColumns:"repeat(2,1fr)",
          gap:"1.25rem", background:"#FAFAF8" }}
          className="eval-detail-grid">
          {EVAL_SECTIONS.map(function(s) {
            var sec    = row[s.key];
            var secAvg = sectionAvg(sec);
            return (
              <div key={s.key} style={{ background:"#fff",
                border:"1px solid #EAEAE5", borderRadius:4,
                padding:"0.875rem 1rem" }}>
                <div style={{ display:"flex", alignItems:"center",
                  justifyContent:"space-between", marginBottom:"0.6rem" }}>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:"0.82rem", letterSpacing:"0.06em", color:"#0A0A0A" }}>
                    {s.emoji + " " + s.label}
                  </span>
                  {secAvg && <StarDisplay value={secAvg} size={11} />}
                </div>
                {sec ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                    {Object.entries(sec).map(function(entry) {
                      var qid = entry[0];
                      var val = entry[1];
                      return (
                        <div key={qid} style={{ display:"flex",
                          alignItems:"flex-start", justifyContent:"space-between",
                          gap:"0.5rem" }}>
                          <span style={{ fontFamily:"'Fraunces',serif",
                            fontSize:"0.75rem", color:"#3D3D38",
                            lineHeight:1.4, flex:1 }}>
                            {Q_LABELS[qid] || qid}
                          </span>
                          <AnswerPill value={val} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <span style={{ fontFamily:"'DM Mono',monospace",
                    fontSize:"0.5rem", color:"#ccc" }}>
                    Non renseigné
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Traffic tab component ─────────────────────────────────────
function TrafficTab(props) {
  var traffic    = props.traffic;
  var trafTotal  = props.trafTotal;
  var trafToday  = props.trafToday;
  var trafLoading= props.trafLoading;
  var trafDays   = props.trafDays;
  var onChangeDays = props.onChangeDays;

  var today   = new Date().toISOString().split("T")[0];
  var counts  = traffic.map(function(d) { return d.count; });
  var maxVal  = counts.length ? Math.max.apply(null, counts.concat([1])) : 1;
  var withVisits = traffic.filter(function(d) { return d.count > 0; }).length;
  var totalV  = traffic.reduce(function(a, d) { return a + d.count; }, 0);
  var avgDay  = withVisits > 0 ? Math.round(totalV / withVisits) : 0;
  var todayLabel = new Date().toLocaleDateString("fr-FR",
    { weekday:"long", day:"numeric", month:"long" });

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

      {/* stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1rem" }}
        className="eval-stats-grid">

        <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
          padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.4rem" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
            letterSpacing:"0.16em", textTransform:"uppercase", color:"#88887F" }}>
            Visiteurs uniques total
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"2.8rem", color:"#1565C0", lineHeight:1 }}>
            {trafLoading ? "..." : (trafTotal || 0).toLocaleString("fr-FR")}
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
            color:"#aaa", letterSpacing:"0.1em" }}>
            depuis le lancement
          </div>
        </div>

        <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
          padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.4rem" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
            letterSpacing:"0.16em", textTransform:"uppercase", color:"#88887F" }}>
            Aujourd'hui
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"2.8rem", color:"#2E7D32", lineHeight:1 }}>
            {trafLoading ? "..." : (trafToday || 0).toLocaleString("fr-FR")}
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
            color:"#aaa", letterSpacing:"0.1em" }}>
            {todayLabel}
          </div>
        </div>

        <div style={{ background:"#0A0A0A", border:"1.5px solid #0A0A0A",
          padding:"1.5rem", display:"flex", flexDirection:"column", gap:"0.4rem" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
            letterSpacing:"0.16em", textTransform:"uppercase",
            color:"rgba(255,255,255,0.4)" }}>
            Moyenne par jour
          </div>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif",
            fontSize:"2.8rem", color:"#F57C00", lineHeight:1 }}>
            {trafLoading ? "..." : avgDay.toLocaleString("fr-FR")}
          </div>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
            color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em" }}>
            {"sur les " + trafDays + " derniers jours"}
          </div>
        </div>
      </div>

      {/* period selector */}
      <div style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between", flexWrap:"wrap", gap:"0.5rem" }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"1.1rem", letterSpacing:"0.06em" }}>
          Visiteurs par jour
        </span>
        <div style={{ display:"flex", gap:"0.4rem" }}>
          {[7, 14, 30].map(function(d) {
            return (
              <button key={d} onClick={function() { onChangeDays(d); }}
                style={{ padding:"0.3rem 0.75rem",
                  background: trafDays === d ? "#1565C0" : "#fff",
                  color: trafDays === d ? "#fff" : "#88887F",
                  border: trafDays === d
                    ? "1px solid #1565C0"
                    : "1px solid #EAEAE5",
                  fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                  letterSpacing:"0.1em", textTransform:"uppercase",
                  cursor:"pointer", borderRadius:3, transition:"all .15s" }}>
                {d + "j"}
              </button>
            );
          })}
        </div>
      </div>

      {/* bar chart */}
      {trafLoading ? <Loader /> : (
        <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
          padding:"1.5rem", borderRadius:2 }}>
          {traffic.length === 0 ? (
            <div style={{ textAlign:"center", padding:"3rem",
              fontFamily:"'Fraunces',serif", fontStyle:"italic", color:"#aaa" }}>
              Aucune donnée pour cette période.
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"flex-end", gap:4, height:140 }}>
                {traffic.map(function(d, i) {
                  var pct     = d.count / maxVal;
                  var isToday = d.date === today;
                  var barH    = d.count > 0 ? Math.max(pct * 120, 4) : 2;
                  var barBg   = isToday ? "#F57C00" : d.count > 0 ? "#1565C0" : "#F0F4F8";
                  var ttip    = d.label + ": " + d.count + " visiteur" + (d.count !== 1 ? "s" : "");
                  return (
                    <div key={i} title={ttip}
                      style={{ flex:1, display:"flex", flexDirection:"column",
                        alignItems:"center", gap:2, cursor:"default" }}>
                      {d.count > 0 && (
                        <div style={{ fontFamily:"'DM Mono',monospace",
                          fontSize:"0.38rem", color:"#88887F",
                          letterSpacing:"0.06em" }}>
                          {d.count}
                        </div>
                      )}
                      <div style={{ width:"100%", height:barH,
                        background:barBg,
                        borderRadius:"2px 2px 0 0",
                        transition:"height .4s ease",
                        opacity: d.count === 0 ? 0.4 : 1 }} />
                    </div>
                  );
                })}
              </div>

              <div style={{ display:"flex", gap:4 }}>
                {traffic.map(function(d, i) {
                  var isToday = d.date === today;
                  var visible = (i % 3 === 0 || isToday) ? "visible" : "hidden";
                  return (
                    <div key={i} style={{ flex:1, textAlign:"center",
                      fontFamily:"'DM Mono',monospace", fontSize:"0.36rem",
                      color: isToday ? "#F57C00" : "#bbb",
                      letterSpacing:"0.04em",
                      overflow:"hidden", whiteSpace:"nowrap",
                      visibility:visible }}>
                      {d.label}
                    </div>
                  );
                })}
              </div>

              <div style={{ display:"flex", gap:"1.5rem", paddingTop:"0.5rem",
                borderTop:"1px solid #EAEAE5" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                  <div style={{ width:10, height:10, background:"#1565C0", borderRadius:2 }} />
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
                    color:"#88887F", letterSpacing:"0.1em" }}>
                    Jour passé
                  </span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:"0.4rem" }}>
                  <div style={{ width:10, height:10, background:"#F57C00", borderRadius:2 }} />
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
                    color:"#88887F", letterSpacing:"0.1em" }}>
                    Aujourd'hui
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* raw data table */}
      <div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"1.1rem", letterSpacing:"0.06em", marginBottom:"0.75rem" }}>
          Détail — 7 derniers jours
        </div>
        <div style={{ background:"#fff", border:"1.5px solid #EAEAE5" }}>
          {[...traffic].reverse().slice(0, 7).map(function(d, i) {
            var isToday2 = d.date === today;
            var pct2     = maxVal > 0 ? (d.count / maxVal) * 100 : 0;
            var barCol2  = isToday2 ? "#F57C00" : "#1565C0";
            var suffix   = d.count !== 1 ? "s" : "";
            return (
              <div key={i} style={{ display:"flex", alignItems:"center",
                padding:"0.75rem 1.25rem", gap:"1rem",
                borderBottom: i < 6 ? "1px solid #EAEAE5" : "none" }}>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.56rem",
                  color:"#0A0A0A", letterSpacing:"0.08em", width:90, flexShrink:0 }}>
                  {d.label}
                </span>
                <div style={{ flex:1, height:6, background:"#F0F4F8",
                  borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:pct2 + "%",
                    background:barCol2, borderRadius:3,
                    transition:"width .4s ease" }} />
                </div>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"1.1rem", letterSpacing:"0.04em",
                  color:"#1565C0", width:40, textAlign:"right", flexShrink:0 }}>
                  {d.count}
                </span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
                  color:"#aaa", letterSpacing:"0.1em", flexShrink:0 }}>
                  {"visiteur" + suffix}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// ── Main AdminPanel ───────────────────────────────────────────
export default function AdminPanel() {

  // auth
  const [authed, setAuthed] = useState(function() {
    return sessionStorage.getItem("stud_admin") === "1";
  });
  const [pw,    setPw]    = useState("");
  const [pwErr, setPwErr] = useState(false);

  // tab
  const [tab, setTab] = useState("gallery");

  // gallery
  const [gallery,    setGallery]    = useState([]);
  const [gLoading,   setGLoading]   = useState(false);
  const [gForm,      setGForm]      = useState({ url:"", caption:"", category:"Cérémonie", type:"image" });
  const [gUploading, setGUploading] = useState(false);
  const [gFile,      setGFile]      = useState(null);
  const [gSuccess,   setGSuccess]   = useState(false);

  // announcements
  const [anns,     setAnns]     = useState([]);
  const [aLoading, setALoading] = useState(false);
  const [aForm,    setAForm]    = useState({
    title:"", body:"", author:"Comité Organisateur", category:"Général", pinned:false
  });
  const [aSuccess, setASuccess] = useState(false);

  // testimonials
  const [testis,   setTestis]   = useState([]);
  const [tLoading, setTLoading] = useState(false);

  // evaluations
  const [evals,    setEvals]    = useState([]);
  const [eLoading, setELoading] = useState(false);
  const [eSort,    setESort]    = useState("newest");

  // traffic
  const [traffic,     setTraffic]     = useState([]);
  const [trafTotal,   setTrafTotal]   = useState(null);
  const [trafToday,   setTrafToday]   = useState(null);
  const [trafLoading, setTrafLoading] = useState(false);
  const [trafDays,    setTrafDays]    = useState(14);

  useEffect(function() {
    if (authed) {
      fetchGallery();
      fetchAnns();
      fetchTestis();
      fetchEvals();
      fetchTraffic(14);
    }
  }, [authed]);

  function handleLogin() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("stud_admin", "1");
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("stud_admin");
    setAuthed(false);
    setPw("");
  }

  // ── gallery ──
  async function fetchGallery() {
    setGLoading(true);
    var res = await supabase.from("gallery").select("*").order("created_at", { ascending:false });
    setGallery(res.data || []);
    setGLoading(false);
  }

  async function handleGallerySubmit() {
    var finalUrl = gForm.url.trim();
    if (gFile) {
      setGUploading(true);
      var ext  = gFile.name.split(".").pop();
      var path = Date.now() + "." + ext;
      var up   = await supabase.storage.from("gallery-media").upload(path, gFile, { cacheControl:"3600", upsert:false });
      if (up.error) { alert("Erreur upload: " + up.error.message); setGUploading(false); return; }
      var pub  = supabase.storage.from("gallery-media").getPublicUrl(path);
      finalUrl = pub.data.publicUrl;
      setGUploading(false);
    }
    if (!finalUrl) return;
    var fileType = gFile
      ? (gFile.type.startsWith("video") ? "video" : "image")
      : gForm.type;
    var ins = await supabase.from("gallery").insert({
      url:finalUrl, caption:gForm.caption.trim() || null,
      category:gForm.category, type:fileType,
    });
    if (!ins.error) {
      setGForm({ url:"", caption:"", category:"Cérémonie", type:"image" });
      setGFile(null);
      setGSuccess(true);
      setTimeout(function() { setGSuccess(false); }, 2500);
      fetchGallery();
    } else { alert("Erreur: " + ins.error.message); }
  }

  async function handleGalleryDelete(id) {
    if (!confirm("Supprimer ce média ?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    fetchGallery();
  }

  // ── announcements ──
  async function fetchAnns() {
    setALoading(true);
    var res = await supabase.from("announcements").select("*").order("created_at", { ascending:false });
    setAnns(res.data || []);
    setALoading(false);
  }

  async function handleAnnSubmit() {
    if (!aForm.title.trim() || !aForm.body.trim()) return;
    var ins = await supabase.from("announcements").insert({
      title:aForm.title.trim(), body:aForm.body.trim(),
      author:aForm.author.trim() || "Comité Organisateur",
      category:aForm.category, pinned:aForm.pinned,
    });
    if (!ins.error) {
      setAForm({ title:"", body:"", author:"Comité Organisateur", category:"Général", pinned:false });
      setASuccess(true);
      setTimeout(function() { setASuccess(false); }, 2500);
      fetchAnns();
    } else { alert("Erreur: " + ins.error.message); }
  }

  async function handleAnnDelete(id) {
    if (!confirm("Supprimer cette annonce ?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnns();
  }

  async function handleAnnPin(id, pinned) {
    await supabase.from("announcements").update({ pinned:!pinned }).eq("id", id);
    fetchAnns();
  }

  // ── testimonials ──
  async function fetchTestis() {
    setTLoading(true);
    var res = await supabase.from("testimonials").select("*").order("created_at", { ascending:false });
    setTestis(res.data || []);
    setTLoading(false);
  }

  async function handleTestiDelete(id) {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    fetchTestis();
  }

  // ── evaluations ──
  async function fetchEvals() {
    setELoading(true);
    var res = await supabase
      .from("stud_evaluations")
      .select("*")
      .order("created_at", { ascending:false });
    setEvals(res.data || []);
    setELoading(false);
  }

  async function handleEvalDelete(id) {
    if (!confirm("Supprimer cette évaluation ?")) return;
    await supabase.from("stud_evaluations").delete().eq("id", id);
    fetchEvals();
  }

  function exportCSV() {
    if (!evals.length) return;
    var allQids = Object.keys(Q_LABELS);
    var header  = ["id", "submitted_at"].concat(allQids).join(",");
    var rows = evals.map(function(row) {
      var cells = [row.id, row.submitted_at || row.created_at];
      allQids.forEach(function(qid) {
        var val = "";
        EVAL_SECTIONS.forEach(function(s) {
          var sec = row[s.key];
          if (sec && sec[qid] !== undefined) val = sec[qid];
        });
        cells.push(JSON.stringify(val !== undefined ? val : ""));
      });
      return cells.join(",");
    });
    var csv  = [header].concat(rows).join("\n");
    var blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement("a");
    a.href = url;
    a.download = "stud2026_evaluations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // eval stats
  var evalStats = (function() {
    if (!evals.length) return null;
    var sectionAvgs = EVAL_SECTIONS.map(function(s) {
      var sum = 0, count = 0;
      evals.forEach(function(row) {
        var sec = row[s.key];
        if (!sec) return;
        Object.values(sec).forEach(function(v) {
          if (typeof v === "number" && v >= 1 && v <= 5) { sum += v; count++; }
        });
      });
      return Object.assign({}, s, { avg: count > 0 ? (sum / count).toFixed(1) : null });
    });
    var withAvg    = sectionAvgs.filter(function(s) { return s.avg; });
    var overallSum = withAvg.reduce(function(a, s) { return a + parseFloat(s.avg); }, 0);
    var overallAvg = withAvg.length ? (overallSum / withAvg.length).toFixed(1) : null;
    return { sectionAvgs:sectionAvgs, overallAvg:overallAvg };
  })();

  var sortedEvals = [...evals]
    .sort(function(a, b) {
      var da = new Date(a.submitted_at || a.created_at);
      var db = new Date(b.submitted_at || b.created_at);
      return eSort === "newest" ? db - da : da - db;
    })
    .map(function(row, i) {
      return Object.assign({}, row, { _idx: eSort === "newest" ? evals.length - i : i + 1 });
    });

  // ── traffic ──
  async function fetchTraffic(days) {
    var d = days || trafDays;
    setTrafLoading(true);
    try {
      var stats = await fetchDailyStats(d);
      setTraffic(stats);
      var totRes = await supabase
        .from("site_visits")
        .select("*", { count:"exact", head:true });
      setTrafTotal(totRes.count || 0);
      var todayStr = new Date().toISOString().split("T")[0];
      var todRes   = await supabase
        .from("site_visits")
        .select("*", { count:"exact", head:true })
        .eq("visit_date", todayStr);
      setTrafToday(todRes.count || 0);
    } catch(e) {
      console.error("[TRAFFIC]", e);
    } finally {
      setTrafLoading(false);
    }
  }

  // ── LOGIN ──────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ background:"#0D1B2A", minHeight:"100vh", display:"flex",
        alignItems:"center", justifyContent:"center", padding:"2rem" }}>
        <div style={{ background:"#FAFAF8", width:"100%", maxWidth:380,
          border:"3px solid #1565C0" }}>
          <div style={{ background:"#1565C0", padding:"2rem 2rem 1.5rem" }}>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
              letterSpacing:"0.2em", color:"rgba(255,255,255,0.6)",
              textTransform:"uppercase", marginBottom:"0.4rem" }}>
              Espace réservé
            </div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
              letterSpacing:"0.04em", color:"#fff", lineHeight:1 }}>
              ADMIN STUD 2026
            </div>
          </div>
          <div style={{ padding:"2rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem",
              marginBottom:"1.25rem", fontFamily:"'DM Mono',monospace",
              fontSize:"0.6rem", color:"#88887F", letterSpacing:"0.1em" }}>
              <Lock size={13} /> Accès restreint — administrateurs uniquement
            </div>
            <input type="password" placeholder="Mot de passe"
              value={pw}
              onChange={function(e) { setPw(e.target.value); }}
              onKeyDown={function(e) { if (e.key === "Enter") handleLogin(); }}
              autoFocus
              style={{ width:"100%", padding:"0.85rem 1rem", marginBottom:"0.65rem",
                border:pwErr ? "2px solid #F57C00" : "1.5px solid #0F0F0F",
                background:"#fff", fontFamily:"'DM Mono',monospace",
                fontSize:"0.9rem", outline:"none" }}
            />
            {pwErr && (
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
                color:"#F57C00", marginBottom:"0.75rem" }}>
                Mot de passe incorrect.
              </div>
            )}
            <button onClick={handleLogin}
              style={{ width:"100%", padding:"0.9rem", background:"#1565C0",
                color:"#fff", border:"none", cursor:"pointer",
                fontFamily:"'DM Mono',monospace", fontSize:"0.7rem",
                letterSpacing:"0.12em", textTransform:"uppercase",
                transition:"background .2s" }}
              onMouseEnter={function(e) { e.currentTarget.style.background = "#0D47A1"; }}
              onMouseLeave={function(e) { e.currentTarget.style.background = "#1565C0"; }}>
              Accéder →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────
  return (
    <div style={{ background:"#F0F4F8", minHeight:"100vh" }}>

      <style>{`
        @media (max-width: 768px) {
          .admin-layout { grid-template-columns: 1fr !important; }
          .eval-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .eval-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .eval-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* topbar */}
      <div style={{ background:"#0D1B2A", borderBottom:"3px solid #1565C0",
        padding:"0 2rem", display:"flex", alignItems:"center",
        height:56, gap:"1.5rem" }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"1.4rem",
          letterSpacing:"0.06em", color:"#fff" }}>
          ADMIN STUD 2026
        </div>
        <div style={{ height:20, width:1, background:"rgba(255,255,255,0.15)" }} />
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.56rem",
          letterSpacing:"0.14em", color:"rgba(255,255,255,0.4)",
          textTransform:"uppercase" }}>
          Tableau de bord
        </div>
        <button onClick={handleLogout}
          style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"0.4rem",
            background:"none", border:"1px solid rgba(255,255,255,0.2)",
            color:"rgba(255,255,255,0.6)", cursor:"pointer", padding:"0.35rem 0.9rem",
            fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
            letterSpacing:"0.1em", textTransform:"uppercase", transition:"all .2s" }}
          onMouseEnter={function(e) { e.currentTarget.style.borderColor="#fff"; e.currentTarget.style.color="#fff"; }}
          onMouseLeave={function(e) { e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; e.currentTarget.style.color="rgba(255,255,255,0.6)"; }}>
          <LogOut size={12} /> Déconnexion
        </button>
      </div>

      {/* tabs */}
      <div style={{ background:"#fff", borderBottom:"1.5px solid #EAEAE5",
        display:"flex", overflowX:"auto" }}>
        {[
          { key:"gallery",       label:"Galerie",      icon:"🖼",  count:gallery.length },
          { key:"announcements", label:"Annonces",     icon:"📢",  count:anns.length },
          { key:"testimonials",  label:"Témoignages",  icon:"💬",  count:testis.length },
          { key:"evaluations",   label:"Évaluations",  icon:"📋",  count:evals.length },
          { key:"traffic",       label:"Trafic",       icon:"📈",  count:trafTotal },
        ].map(function(t) {
          var active = tab === t.key;
          return (
            <button key={t.key} onClick={function() { setTab(t.key); }}
              style={{ padding:"1rem 1.75rem", border:"none", cursor:"pointer",
                background:"transparent",
                fontFamily:"'DM Mono',monospace", fontSize:"0.65rem",
                letterSpacing:"0.1em", textTransform:"uppercase",
                color: active ? "#1565C0" : "#88887F",
                borderBottom: active ? "3px solid #1565C0" : "3px solid transparent",
                transition:"all .2s", display:"flex", alignItems:"center",
                gap:"0.5rem", whiteSpace:"nowrap", flexShrink:0 }}>
              {t.icon + " " + t.label}
              <span style={{ background:active ? "#EEF4FF" : "#EAEAE5",
                color:active ? "#1565C0" : "#88887F",
                padding:"0.1rem 0.4rem", borderRadius:99, fontSize:"0.52rem" }}>
                {t.count !== null ? t.count : "—"}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"2rem" }}>

        {/* ══ GALLERY ══ */}
        {tab === "gallery" && (
          <div style={{ display:"grid", gridTemplateColumns:"380px 1fr",
            gap:"1.5rem", alignItems:"start" }} className="admin-layout">

            <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
              position:"sticky", top:"1rem" }}>
              <div style={{ padding:"1.1rem 1.5rem", borderBottom:"1.5px solid #EAEAE5",
                display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <ImagePlus size={15} color="#1565C0" />
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"1.2rem", letterSpacing:"0.04em" }}>
                  Ajouter un Média
                </span>
              </div>
              <div style={{ padding:"1.5rem", display:"flex",
                flexDirection:"column", gap:"1rem" }}>

                <div style={{ display:"flex", gap:0, border:"1.5px solid #EAEAE5" }}>
                  {["image","video"].map(function(t) {
                    return (
                      <button key={t}
                        onClick={function() { setGForm(function(f) { return Object.assign({}, f, { type:t }); }); }}
                        style={{ flex:1, padding:"0.6rem", border:"none", cursor:"pointer",
                          background: gForm.type === t ? "#1565C0" : "transparent",
                          color: gForm.type === t ? "#fff" : "#0F0F0F",
                          fontFamily:"'DM Mono',monospace", fontSize:"0.62rem",
                          letterSpacing:"0.1em", textTransform:"uppercase",
                          transition:"all .15s" }}>
                        {t === "image" ? "Image" : "Vidéo"}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label style={lbl}>Uploader un fichier</label>
                  <label style={{ display:"flex", alignItems:"center", gap:"0.75rem",
                    padding:"0.75rem 1rem", border:"1.5px dashed #EAEAE5",
                    cursor:"pointer", background:gFile ? "#F0FFF4" : "#FAFAF8",
                    transition:"border-color .2s" }}
                    onMouseEnter={function(e) { e.currentTarget.style.borderColor="#1565C0"; }}
                    onMouseLeave={function(e) { e.currentTarget.style.borderColor="#EAEAE5"; }}>
                    <Upload size={16} color="#88887F" />
                    <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.6rem",
                      color:gFile ? "#1565C0" : "#88887F" }}>
                      {gFile ? gFile.name : "Cliquez ou glissez un fichier"}
                    </span>
                    <input type="file"
                      accept={gForm.type === "image" ? "image/*" : "video/*"}
                      onChange={function(e) {
                        setGFile(e.target.files[0]);
                        setGForm(function(f) { return Object.assign({}, f, { url:"" }); });
                      }}
                      style={{ display:"none" }} />
                    {gFile && (
                      <button onClick={function(e) { e.preventDefault(); setGFile(null); }}
                        style={{ marginLeft:"auto", background:"none", border:"none",
                          cursor:"pointer", padding:0 }}>
                        <X size={14} color="#88887F" />
                      </button>
                    )}
                  </label>
                </div>

                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                  <div style={{ flex:1, height:1, background:"#EAEAE5" }} />
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.54rem",
                    color:"#88887F", letterSpacing:"0.1em" }}>OU</span>
                  <div style={{ flex:1, height:1, background:"#EAEAE5" }} />
                </div>

                <div>
                  <label style={lbl}>URL publique</label>
                  <input value={gForm.url}
                    onChange={function(e) {
                      setGForm(function(f) { return Object.assign({}, f, { url:e.target.value }); });
                      setGFile(null);
                    }}
                    placeholder="https://..."
                    disabled={!!gFile}
                    style={Object.assign({}, inp, { opacity:gFile ? 0.5 : 1 })} />
                </div>

                <div>
                  <label style={lbl}>Légende</label>
                  <input value={gForm.caption}
                    onChange={function(e) { setGForm(function(f) { return Object.assign({}, f, { caption:e.target.value }); }); }}
                    placeholder="Décrivez ce moment..." style={inp} />
                </div>

                <div>
                  <label style={lbl}>Catégorie</label>
                  <select value={gForm.category}
                    onChange={function(e) { setGForm(function(f) { return Object.assign({}, f, { category:e.target.value }); }); }}
                    style={Object.assign({}, inp, { cursor:"pointer" })}>
                    {GALLERY_CATS.map(function(c) { return <option key={c}>{c}</option>; })}
                  </select>
                </div>

                <button onClick={handleGallerySubmit}
                  disabled={!gFile && !gForm.url.trim()}
                  style={{ padding:"0.9rem",
                    background:(gFile || gForm.url.trim()) ? "#1565C0" : "#EAEAE5",
                    color:(gFile || gForm.url.trim()) ? "#fff" : "#88887F",
                    border:"none",
                    cursor:(gFile || gForm.url.trim()) ? "pointer" : "not-allowed",
                    fontFamily:"'DM Mono',monospace", fontSize:"0.68rem",
                    letterSpacing:"0.1em", textTransform:"uppercase",
                    transition:"all .2s" }}>
                  {gUploading ? "Upload en cours..." : gSuccess ? "Publié !" : "Publier →"}
                </button>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {gLoading ? <Loader /> : gallery.length === 0
                ? <Empty text="Aucun média publié." />
                : gallery.map(function(item) {
                  return (
                    <div key={item.id} style={{ background:"#fff",
                      border:"1.5px solid #EAEAE5", display:"flex",
                      gap:"1rem", padding:"0.75rem 1rem", alignItems:"flex-start" }}>
                      <div style={{ width:72, height:56, flexShrink:0,
                        overflow:"hidden", background:"#EAEAE5" }}>
                        {item.type === "video"
                          ? <div style={{ width:"100%", height:"100%", display:"flex",
                              alignItems:"center", justifyContent:"center",
                              background:"#0D1B2A", color:"#fff",
                              fontFamily:"'DM Mono',monospace", fontSize:"0.5rem" }}>VIDEO</div>
                          : <img src={item.url} alt=""
                              style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:"'Fraunces',serif", fontSize:"0.85rem",
                          color:"#333", marginBottom:"0.25rem",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {item.caption || (
                            <span style={{ color:"#88887F", fontStyle:"italic" }}>Sans légende</span>
                          )}
                        </div>
                        <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
                          <Tag text={item.category} />
                          <span style={{ fontFamily:"'DM Mono',monospace",
                            fontSize:"0.5rem", color:"#88887F" }}>
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                      </div>
                      <DelBtn onClick={function() { handleGalleryDelete(item.id); }} />
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {/* ══ ANNOUNCEMENTS ══ */}
        {tab === "announcements" && (
          <div style={{ display:"grid", gridTemplateColumns:"380px 1fr",
            gap:"1.5rem", alignItems:"start" }} className="admin-layout">

            <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
              position:"sticky", top:"1rem" }}>
              <div style={{ padding:"1.1rem 1.5rem", borderBottom:"1.5px solid #EAEAE5",
                display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <Plus size={15} color="#1565C0" />
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"1.2rem", letterSpacing:"0.04em" }}>
                  Publier une Annonce
                </span>
              </div>
              <div style={{ padding:"1.5rem", display:"flex",
                flexDirection:"column", gap:"1rem" }}>
                <div>
                  <label style={lbl}>Titre *</label>
                  <input value={aForm.title}
                    onChange={function(e) { setAForm(function(f) { return Object.assign({}, f, { title:e.target.value }); }); }}
                    placeholder="Titre de l'annonce" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Message *</label>
                  <textarea value={aForm.body}
                    onChange={function(e) { setAForm(function(f) { return Object.assign({}, f, { body:e.target.value }); }); }}
                    placeholder="Écrivez votre annonce..."
                    rows={6} style={Object.assign({}, inp, { resize:"vertical" })} />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                  <div>
                    <label style={lbl}>Auteur</label>
                    <input value={aForm.author}
                      onChange={function(e) { setAForm(function(f) { return Object.assign({}, f, { author:e.target.value }); }); }}
                      placeholder="Comité Organisateur" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Catégorie</label>
                    <select value={aForm.category}
                      onChange={function(e) { setAForm(function(f) { return Object.assign({}, f, { category:e.target.value }); }); }}
                      style={Object.assign({}, inp, { cursor:"pointer" })}>
                      {ANN_CATS.map(function(c) { return <option key={c}>{c}</option>; })}
                    </select>
                  </div>
                </div>
                <label style={{ display:"flex", alignItems:"center", gap:"0.6rem",
                  cursor:"pointer", fontFamily:"'DM Mono',monospace",
                  fontSize:"0.6rem", letterSpacing:"0.1em",
                  textTransform:"uppercase", color:"#88887F" }}>
                  <input type="checkbox" checked={aForm.pinned}
                    onChange={function(e) { setAForm(function(f) { return Object.assign({}, f, { pinned:e.target.checked }); }); }} />
                  Épingler cette annonce
                </label>
                <button onClick={handleAnnSubmit}
                  disabled={!aForm.title.trim() || !aForm.body.trim()}
                  style={{ padding:"0.9rem",
                    background:(aForm.title.trim() && aForm.body.trim()) ? "#1565C0" : "#EAEAE5",
                    color:(aForm.title.trim() && aForm.body.trim()) ? "#fff" : "#88887F",
                    border:"none",
                    cursor:(aForm.title.trim() && aForm.body.trim()) ? "pointer" : "not-allowed",
                    fontFamily:"'DM Mono',monospace", fontSize:"0.68rem",
                    letterSpacing:"0.1em", textTransform:"uppercase" }}>
                  {aSuccess ? "Publié !" : "Publier →"}
                </button>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {aLoading ? <Loader /> : anns.length === 0
                ? <Empty text="Aucune annonce publiée." />
                : anns.map(function(item) {
                  var cc = CAT_COLORS[item.category] || "#1565C0";
                  return (
                    <div key={item.id} style={{ background:"#fff",
                      border:item.pinned ? "1.5px solid " + cc : "1.5px solid #EAEAE5",
                      padding:"1rem 1.25rem" }}>
                      <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", gap:"0.5rem", alignItems:"center",
                            marginBottom:"0.4rem", flexWrap:"wrap" }}>
                            {item.pinned && <Pin size={11} color={cc} />}
                            <Tag text={item.category} color={cc} />
                            <span style={{ fontFamily:"'DM Mono',monospace",
                              fontSize:"0.52rem", color:"#88887F" }}>
                              {timeAgo(item.created_at) + " · " + item.author}
                            </span>
                          </div>
                          <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700,
                            fontSize:"0.95rem", color:"#0F0F0F", marginBottom:"0.3rem" }}>
                            {item.title}
                          </div>
                          <div style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
                            fontSize:"0.82rem", color:"#666660", lineHeight:1.6 }}>
                            {item.body.length > 120 ? item.body.slice(0, 120) + "..." : item.body}
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:"0.35rem", flexShrink:0 }}>
                          <button
                            onClick={function() { handleAnnPin(item.id, item.pinned); }}
                            style={{ background:"none", border:"none", cursor:"pointer",
                              padding:"0.3rem",
                              color:item.pinned ? cc : "#88887F",
                              transition:"color .15s" }}>
                            {item.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                          </button>
                          <DelBtn onClick={function() { handleAnnDelete(item.id); }} />
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        )}

        {/* ══ TESTIMONIALS ══ */}
        {tab === "testimonials" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            {tLoading ? <Loader /> : testis.length === 0
              ? <Empty icon={<MessageSquare size={32} color="#DDDDD5" />} text="Aucun témoignage." />
              : testis.map(function(t) {
                var initials = t.name === "Anonyme"
                  ? "?"
                  : t.name.split(" ").slice(0, 2).map(function(w) { return w[0]; }).join("").toUpperCase();
                return (
                  <div key={t.id} style={{ background:"#fff",
                    border:"1.5px solid #EAEAE5", padding:"1.25rem 1.5rem",
                    display:"flex", gap:"1.25rem", alignItems:"flex-start" }}>
                    <div style={{ width:40, height:40, borderRadius:"50%",
                      background:"#1565C0", display:"flex", alignItems:"center",
                      justifyContent:"center", fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:"0.9rem", color:"#fff", flexShrink:0 }}>
                      {initials}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", gap:"0.5rem", alignItems:"center",
                        marginBottom:"0.35rem", flexWrap:"wrap" }}>
                        <span style={{ fontFamily:"'Fraunces',serif", fontWeight:700,
                          fontSize:"0.88rem", color:"#0F0F0F" }}>{t.name}</span>
                        {t.role && (
                          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                            letterSpacing:"0.1em", textTransform:"uppercase", color:"#88887F" }}>
                            {"— " + t.role}
                          </span>
                        )}
                        <span style={{ marginLeft:"auto", display:"flex", gap:2 }}>
                          {[1,2,3,4,5].map(function(s) {
                            return (
                              <span key={s} style={{ fontSize:"0.65rem",
                                color:s <= t.rating ? "#F9A825" : "#DDDDD5" }}>★</span>
                            );
                          })}
                        </span>
                      </div>
                      <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
                        fontSize:"0.85rem", color:"#3D3D38", lineHeight:1.65,
                        margin:0, marginBottom:"0.5rem" }}>
                        {'"' + t.body + '"'}
                      </p>
                      <span style={{ fontFamily:"'DM Mono',monospace",
                        fontSize:"0.48rem", color:"#88887F" }}>
                        {timeAgo(t.created_at)}
                      </span>
                    </div>
                    <DelBtn onClick={function() { handleTestiDelete(t.id); }} />
                  </div>
                );
              })
            }
          </div>
        )}

        {/* ══ EVALUATIONS ══ */}
        {tab === "evaluations" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"1.5rem" }}>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"1rem" }}
              className="eval-stats-grid">

              <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
                padding:"1.25rem 1.5rem" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                  letterSpacing:"0.16em", textTransform:"uppercase", color:"#88887F",
                  marginBottom:"0.35rem" }}>
                  Total soumissions
                </div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.4rem",
                  color:"#1565C0", lineHeight:1 }}>
                  {evals.length}
                </div>
              </div>

              <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
                padding:"1.25rem 1.5rem" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                  letterSpacing:"0.16em", textTransform:"uppercase", color:"#88887F",
                  marginBottom:"0.35rem" }}>
                  Note moyenne
                </div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.4rem",
                  color:"#F9A825", lineHeight:1 }}>
                  {evalStats ? evalStats.overallAvg : "—"}
                </div>
              </div>

              <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
                padding:"1.25rem 1.5rem" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                  letterSpacing:"0.16em", textTransform:"uppercase", color:"#88887F",
                  marginBottom:"0.35rem" }}>
                  Aujourd'hui
                </div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2.4rem",
                  color:"#2E7D32", lineHeight:1 }}>
                  {evals.filter(function(e) {
                    var d = new Date(e.submitted_at || e.created_at);
                    return d.toDateString() === new Date().toDateString();
                  }).length}
                </div>
              </div>

              <div style={{ background:"#0A0A0A", border:"1.5px solid #0A0A0A",
                padding:"1.25rem 1.5rem", display:"flex",
                flexDirection:"column", justifyContent:"space-between" }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                  letterSpacing:"0.16em", textTransform:"uppercase",
                  color:"rgba(255,255,255,0.4)" }}>
                  Exporter
                </div>
                <button onClick={exportCSV} disabled={!evals.length}
                  style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem",
                    background:evals.length ? "#1565C0" : "rgba(255,255,255,0.1)",
                    color:"#fff", border:"none", padding:"0.6rem 1rem",
                    fontFamily:"'DM Mono',monospace", fontSize:"0.54rem",
                    letterSpacing:"0.12em", textTransform:"uppercase",
                    cursor:evals.length ? "pointer" : "not-allowed",
                    borderRadius:3, marginTop:"0.75rem" }}>
                  <Download size={13} /> Export CSV
                </button>
              </div>
            </div>

            {/* section bar chart */}
            {evalStats && (
              <div style={{ background:"#fff", border:"1.5px solid #EAEAE5",
                padding:"1.5rem" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.5rem",
                  marginBottom:"1.25rem" }}>
                  <BarChart2 size={16} color="#1565C0" />
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:"1.1rem", letterSpacing:"0.06em" }}>
                    Moyennes par section
                  </span>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
                  {evalStats.sectionAvgs.map(function(s) {
                    var pct = s.avg ? (parseFloat(s.avg) / 5) * 100 : 0;
                    var bc  = pct >= 80 ? "#2E7D32" : pct >= 60 ? "#1565C0" : pct >= 40 ? "#F57C00" : "#C62828";
                    return (
                      <div key={s.key} style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.46rem",
                          letterSpacing:"0.1em", textTransform:"uppercase", color:"#88887F",
                          width:200, flexShrink:0, whiteSpace:"nowrap",
                          overflow:"hidden", textOverflow:"ellipsis" }}>
                          {s.emoji + " " + s.label}
                        </span>
                        <div style={{ flex:1, height:10, background:"#F0F4F8",
                          borderRadius:5, overflow:"hidden" }}>
                          <div style={{ height:"100%", width:pct + "%",
                            background:bc, borderRadius:5,
                            transition:"width .6s ease" }} />
                        </div>
                        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                          color:s.avg ? bc : "#ccc", width:30, textAlign:"right",
                          flexShrink:0 }}>
                          {s.avg || "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* submissions list */}
            <div>
              <div style={{ display:"flex", alignItems:"center",
                justifyContent:"space-between", marginBottom:"0.875rem",
                flexWrap:"wrap", gap:"0.5rem" }}>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:"1.1rem", letterSpacing:"0.06em" }}>
                  Toutes les soumissions
                </span>
                <div style={{ display:"flex", gap:"0.5rem" }}>
                  {["newest","oldest"].map(function(o) {
                    return (
                      <button key={o} onClick={function() { setESort(o); }}
                        style={{ padding:"0.35rem 0.75rem",
                          background:eSort === o ? "#1565C0" : "#fff",
                          color:eSort === o ? "#fff" : "#88887F",
                          border:eSort === o ? "1px solid #1565C0" : "1px solid #EAEAE5",
                          fontFamily:"'DM Mono',monospace", fontSize:"0.5rem",
                          letterSpacing:"0.1em", textTransform:"uppercase",
                          cursor:"pointer", borderRadius:3, transition:"all .15s" }}>
                        {o === "newest" ? "Plus récent" : "Plus ancien"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {eLoading ? <Loader /> : evals.length === 0
                ? <Empty icon={<ClipboardList size={32} color="#DDDDD5" />}
                    text="Aucune évaluation soumise." />
                : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
                    {sortedEvals.map(function(row) {
                      return (
                        <EvalRow key={row.id} row={row}
                          onDelete={handleEvalDelete} />
                      );
                    })}
                  </div>
                )
              }
            </div>
          </div>
        )}

        {/* ══ TRAFFIC ══ */}
        {tab === "traffic" && (
          <TrafficTab
            traffic={traffic}
            trafTotal={trafTotal}
            trafToday={trafToday}
            trafLoading={trafLoading}
            trafDays={trafDays}
            onChangeDays={function(d) { setTrafDays(d); fetchTraffic(d); }}
          />
        )}

      </div>
    </div>
  );
}