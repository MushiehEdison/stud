import { useState, useRef, useEffect } from "react";
import { PROGRAM } from "../data";

// ── SVG imports — save these 3 files in src/assets/ ─────────
import iconSport     from "../assets/icon-sport.svg";    // running figure / ball
import iconCulture   from "../assets/icon-culture.svg";  // masks / music note
import iconIntellect from "../assets/icon-intellect.svg"; // book / lightbulb
// ────────────────────────────────────────────────────────────

function useInView(t = 0.05) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

const TABS = [
  { key: "sports",       label: "Activités Sportives",                  abbr: "SPORT",     color: "#1565C0", icon: iconSport     },
  { key: "cultural",     label: "Activités Culturelles",                abbr: "CULTURE",   color: "#F57C00", icon: iconCulture   },
  { key: "intellectual", label: "Activités Intellectuelles & Sociales", abbr: "INTELLECT", color: "#6B7280", icon: iconIntellect },
];

function SvgIcon({ svg, color, size = 32 }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0 }}>
      <img
        src={`/assets/${svg}`}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
        onError={e => {
          e.target.style.display = "none";
          e.target.parentElement.style.background = color + "22";
          e.target.parentElement.style.borderRadius = "4px";
        }}
      />
    </div>
  );
}

export default function Programme() {
  const [tab, setTab] = useState("sports");
  const [listRef, listV] = useInView();
  const events = PROGRAM[tab];
  const cur = TABS.find(t => t.key === tab);

  return (
    <div style={{ background: "#FAFAF8", paddingTop: 64 }}>

      {/* Title */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          PRO<span style={{ color: "#1565C0" }}>GRAMME</span>
        </h1>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: "#88887F", textTransform: "uppercase" }}>24 – 30 Avril 2026</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#666660", marginTop: "0.2rem" }}>Université de Douala</div>
        </div>
      </div>

      {/* Tabs — icon beside the label, that's it */}
      <div style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F", display: "flex" }} className="tabs-row">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "1.1rem 1rem",
            background: tab === t.key ? t.color : "transparent",
            border: "none", borderRight: "1.5px solid #EAEAE5",
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem", textAlign: "left",
          }}>
            {/* ★ icon on each tab — only spot icons are used on this page */}
            <img
              src={t.icon}
              alt=""
              aria-hidden="true"
              style={{
                width: 22, height: 22,
                filter: tab === t.key ? "brightness(0) invert(1)" : "none",
                opacity: tab === t.key ? 0.9 : 0.45,
                transition: "all 0.2s",
                marginBottom: "0.15rem",
              }}
            />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.25rem", letterSpacing: "0.04em", lineHeight: 1, color: tab === t.key ? "#FAFAF8" : "#0F0F0F" }}>{t.label}</span>
            <span style={{ background: tab === t.key ? "rgba(255,255,255,0.2)" : "#EAEAE5", borderRadius: 2, padding: "0.1rem 0.4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.1em", color: tab === t.key ? "#FAFAF8" : "#88887F" }}>
              {PROGRAM[t.key].length} activités
            </span>
          </button>
        ))}
        <div style={{ width: 1 }} />
      </div>

      {/* Rows */}
      <div ref={listRef} style={{ maxWidth: 1280, margin: "0 auto" }}>
        {events.map((ev, i) => (
          <div key={`${tab}-${i}`} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", borderBottom: "1.5px solid #0F0F0F", opacity: listV ? 1 : 0, transform: listV ? "none" : "translateX(-16px)", transition: `all 0.5s ease ${Math.min(i, 6) * 0.065}s` }} className="event-row">

            {/* Date / event svg col */}
            <div style={{ padding: "1.75rem 1.5rem", borderRight: "1.5px solid #0F0F0F", background: i % 2 === 0 ? "#F5F8FF" : "transparent", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.75rem" }}>
              <SvgIcon svg={ev.svg} color={cur.color} size={36} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.08em", color: cur.color, textTransform: "uppercase", lineHeight: 1.4 }}>{ev.date}</div>
              {ev.time && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F" }}>{ev.time}</div>}
            </div>

            {/* Name */}
            <div style={{ padding: "1.75rem 2rem", borderRight: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.25, marginBottom: "0.5rem" }}>{ev.name}</h3>
              <div style={{ display: "inline-block", width: "fit-content", fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.15em", textTransform: "uppercase", color: cur.color, border: `1px solid ${cur.color}`, padding: "0.12rem 0.5rem" }}>
                {cur.abbr}
              </div>
            </div>

            {/* Description */}
            <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "#555550", lineHeight: 1.75, marginBottom: ev.details ? "0.6rem" : 0 }}>{ev.description}</p>
              {ev.details && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#88887F", lineHeight: 1.6 }}>{ev.details}</p>}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tabs-row { flex-wrap: wrap; }
          .tabs-row button { flex: 1 1 140px; }
          .event-row { grid-template-columns: 110px 1fr !important; }
          .event-row > div:last-child { display: none; }
        }
        @media (max-width: 500px) {
          .event-row { grid-template-columns: 1fr !important; }
          .event-row > div { border-right: none !important; }
        }
      `}</style>
    </div>
  );
}