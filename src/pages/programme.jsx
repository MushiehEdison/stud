import { useState, useRef, useEffect } from "react";
import {
  PersonStanding, Trophy, Dumbbell, Zap,
  HelpCircle, FileText, LayoutGrid, PenTool,
  Music, UtensilsCrossed, Mic, Star, Gift,
  MessageSquare, Leaf, Building2,
} from "lucide-react";
import { PROGRAM } from "../data";

const ICON_MAP = {
  PersonStanding, Trophy, Dumbbell, Zap,
  HelpCircle, FileText, LayoutGrid, PenTool,
  Music, UtensilsCrossed, Mic, Star, Gift,
  MessageSquare, Leaf, Building2,
};

function Icon({ name, size = 20, ...props }) {
  const C = ICON_MAP[name];
  return C ? <C size={size} {...props} /> : null;
}

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
  { key: "sports", label: "Activités Sportives", abbr: "SPORT", color: "#C8102E" },
  { key: "cultural", label: "Activités Culturelles", abbr: "CULTURE", color: "#0F0F0F" },
  { key: "intellectual", label: "Activités Intellectuelles & Sociales", abbr: "INTELLECT", color: "#6B7280" },
];

export default function Programme() {
  const [tab, setTab] = useState("sports");
  const [listRef, listV] = useInView();
  const events = PROGRAM[tab];
  const cur = TABS.find(t => t.key === tab);

  return (
    <div style={{ background: "#FAFAF7", paddingTop: 62 }}>

      {/* Page title */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          PRO<span style={{ color: "#C8102E" }}>GRAMME</span>
        </h1>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.18em", color: "#999990", textTransform: "uppercase" }}>24 – 30 Avril 2026</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#666660", marginTop: "0.2rem" }}>Université de Douala</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F", display: "flex" }} className="tabs-row">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "1.1rem 1rem",
            background: tab === t.key ? t.color : "transparent",
            border: "none",
            borderRight: "1.5px solid #0F0F0F",
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem",
            textAlign: "left",
          }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.04em", lineHeight: 1, color: tab === t.key ? "#FAFAF7" : "#0F0F0F" }}>
              {t.label}
            </span>
            <span style={{
              background: tab === t.key ? "rgba(255,255,255,0.2)" : "#E8E8E3",
              borderRadius: 2, padding: "0.1rem 0.4rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em",
              color: tab === t.key ? "#FAFAF7" : "#999990",
            }}>
              {PROGRAM[t.key].length} activités
            </span>
          </button>
        ))}
        {/* empty spacer fills right edge */}
        <div style={{ width: 1, background: "transparent" }} />
      </div>

      {/* Event rows */}
      <div ref={listRef} style={{ maxWidth: 1280, margin: "0 auto" }}>
        {events.map((ev, i) => (
          <div key={`${tab}-${i}`} style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr 1fr",
            borderBottom: "1.5px solid #0F0F0F",
            opacity: listV ? 1 : 0,
            transform: listV ? "none" : "translateX(-16px)",
            transition: `all 0.5s ease ${Math.min(i, 6) * 0.065}s`,
          }} className="event-row">

            {/* Date / icon col */}
            <div style={{
              padding: "1.75rem 1.5rem",
              borderRight: "1.5px solid #0F0F0F",
              background: i % 2 === 0 ? "#F5F5F2" : "transparent",
              display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.6rem",
            }}>
              <div style={{ color: cur.color }}>
                <Icon name={ev.icon} size={22} />
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.08em", color: cur.color, textTransform: "uppercase", lineHeight: 1.4 }}>{ev.date}</div>
              {ev.time && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#999990" }}>{ev.time}</div>}
            </div>

            {/* Name col */}
            <div style={{ padding: "1.75rem 2rem", borderRight: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.25, marginBottom: "0.5rem" }}>{ev.name}</h3>
              <div style={{
                display: "inline-block", width: "fit-content",
                fontFamily: "'DM Mono', monospace", fontSize: "0.56rem",
                letterSpacing: "0.15em", textTransform: "uppercase",
                color: cur.color, border: `1px solid ${cur.color}`,
                padding: "0.12rem 0.5rem",
              }}>{cur.abbr}</div>
            </div>

            {/* Description col */}
            <div style={{ padding: "1.75rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "#555550", lineHeight: 1.75, marginBottom: ev.details ? "0.6rem" : 0 }}>{ev.description}</p>
              {ev.details && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999990", lineHeight: 1.6 }}>{ev.details}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tabs-row { flex-wrap: wrap; }
          .tabs-row button { flex: 1 1 120px; }
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