import { useState, useRef, useEffect } from "react";
import { PROGRAM } from "../data";
import {
  Dumbbell, Music, BookOpen, Calendar, Clock,
  Users, Star, ArrowRight, ChevronDown
} from "lucide-react";

import iconSport     from "../assets/icon-sport.svg";
import iconCulture   from "../assets/icon-culture.svg";
import iconIntellect from "../assets/icon-intellect.svg";
import { FeedbackFAB } from "../components/TestimonialsWidget";
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
  { key: "sports",       label: "Sportives",    full: "Activités Sportives",                  abbr: "SPORT",     color: "#1565C0", bg: "#EEF4FF", icon: iconSport,     lucide: <Dumbbell size={18} strokeWidth={1.75} /> },
  { key: "cultural",     label: "Culturelles",  full: "Activités Culturelles",                abbr: "CULTURE",   color: "#F57C00", bg: "#FFF3E0", icon: iconCulture,   lucide: <Music    size={18} strokeWidth={1.75} /> },
  { key: "intellectual", label: "Intellectuelles", full: "Activités Intellectuelles & Sociales", abbr: "INTELLECT", color: "#374151", bg: "#F3F4F6", icon: iconIntellect, lucide: <BookOpen size={18} strokeWidth={1.75} /> },
];

const rule      = "1px solid rgba(10,10,10,0.12)";
const ruleLight = "1px solid rgba(10,10,10,0.07)";

const CSS = `
  .prog-root { background: #FAFAF8; padding-top: 64px; }

  /* ── TITLE ── */
  .prog-title {
    border-bottom: ${rule};
    max-width: 1280px; margin: 0 auto;
    padding: 3rem 2.5rem;
    display: flex; justify-content: space-between; align-items: flex-end;
    flex-wrap: wrap; gap: 1rem;
  }

  /* ── TAB NAV ── */
  .tab-nav {
    max-width: 1280px; margin: 0 auto;
    border-bottom: ${rule};
    display: grid; grid-template-columns: repeat(3, 1fr);
  }
  .tab-btn {
    position: relative;
    padding: 0;
    border: none; border-right: ${rule};
    cursor: pointer; background: transparent;
    transition: background 0.2s;
    text-align: left;
    display: flex; flex-direction: column;
  }
  .tab-btn:last-child { border-right: none; }

  /* Active indicator bar on top */
  .tab-indicator {
    height: 3px; width: 100%;
    transition: opacity 0.2s;
  }

  /* Tab inner content */
  .tab-inner {
    padding: 1.25rem 1.75rem 1.5rem;
    display: flex; flex-direction: column; gap: 0.5rem;
    flex: 1;
  }

  /* "Click to explore" hint */
  .tab-hint {
    display: flex; align-items: center; gap: 0.35rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-top: auto;
    padding-top: 0.75rem;
    opacity: 0;
    transition: opacity 0.2s;
  }
  .tab-btn:not(.tab-btn--active):hover .tab-hint { opacity: 1; }
  .tab-btn--active .tab-hint { opacity: 0 !important; }

  /* Count pill */
  .tab-count {
    display: inline-flex; align-items: center;
    font-family: 'DM Mono', monospace;
    font-size: 0.54rem; letter-spacing: 0.1em;
    padding: 0.2rem 0.55rem;
    border-radius: 2px;
    width: fit-content;
    transition: all 0.2s;
  }

  /* Section header below tabs */
  .sec-hdr {
    max-width: 1280px; margin: 0 auto;
    border-bottom: ${rule};
    display: grid; grid-template-columns: 1fr 120px;
  }
  .sec-hdr-label {
    padding: 1.25rem 2.5rem;
    display: flex; align-items: center; gap: 0.875rem;
  }
  .sec-hdr-illus {
    border-left: ${rule};
    display: flex; align-items: center; justify-content: center;
    padding: 0.875rem;
    transition: background 0.3s;
  }

  /* ── EVENT LIST ── */
  .event-list { max-width: 1280px; margin: 0 auto; }

  .event-row {
    display: grid;
    grid-template-columns: 152px 1fr 1fr;
    border-bottom: ${rule};
  }
  .event-date {
    padding: 1.75rem 1.75rem;
    border-right: ${rule};
    display: flex; flex-direction: column;
    justify-content: center; gap: 0.6rem;
  }
  .event-name {
    padding: 1.75rem 2rem;
    border-right: ${rule};
    display: flex; flex-direction: column;
    justify-content: center; gap: 0.65rem;
  }
  .event-desc {
    padding: 1.75rem 2rem;
    display: flex; flex-direction: column;
    justify-content: center; gap: 0.5rem;
  }

  .cat-badge {
    display: inline-flex; align-items: center; gap: 0.35rem;
    width: fit-content;
    font-family: 'DM Mono', monospace;
    font-size: 0.5rem; letter-spacing: 0.15em; text-transform: uppercase;
    padding: 0.15rem 0.6rem; border: 1px solid;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .prog-title { padding: 2.5rem 1.75rem; }
    .sec-hdr-label { padding: 1rem 1.75rem; }
    .event-row { grid-template-columns: 130px 1fr; }
    .event-desc { display: none; }
    .event-date { padding: 1.5rem 1.25rem; }
    .event-name { padding: 1.5rem 1.5rem; }
  }

  @media (max-width: 640px) {
    .prog-title { padding: 2rem 1.25rem; }

    /* Stack tabs vertically on mobile */
    .tab-nav { grid-template-columns: 1fr; }
    .tab-btn { border-right: none !important; border-bottom: ${rule}; flex-direction: row; align-items: center; }
    .tab-btn:last-child { border-bottom: none; }
    .tab-indicator { width: 4px; height: auto; align-self: stretch; flex-shrink: 0; }
    .tab-inner { padding: 1rem 1.25rem; flex-direction: row; align-items: center; gap: 1rem; flex: 1; }
    .tab-hint { display: none; }
    .tab-count { margin-left: auto; }

    /* Collapse event rows to single col */
    .event-row { grid-template-columns: 1fr; }
    .event-date { border-right: none; border-bottom: ${ruleLight}; flex-direction: row; align-items: center; gap: 1rem; padding: 1rem 1.25rem; }
    .event-name { border-right: none; padding: 1rem 1.25rem; }

    .sec-hdr { grid-template-columns: 1fr 80px; }
    .sec-hdr-label { padding: 0.875rem 1.25rem; gap: 0.6rem; }
    .sec-hdr-illus { padding: 0.5rem; }
    .sec-hdr-illus img { width: 44px !important; height: 44px !important; }
  }

  @media (max-width: 400px) {
    .prog-title { padding: 1.75rem 1rem; }
    .event-date, .event-name { padding: 0.875rem 1rem; }
  }
`;

export default function Programme() {
  const [tab, setTab] = useState("sports");
  const [listRef, listV] = useInView();
  const events = PROGRAM[tab];
  const cur = TABS.find(t => t.key === tab);

  return (
    <div className="prog-root">
      <style>{CSS}</style>

      {/* ── TITLE ── */}
      <div className="prog-title">
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          PRO<span style={{ color: "#1565C0" }}>GRAMME</span>
        </h1>
        <div style={{ textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "flex-end", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: "#88887F", textTransform: "uppercase" }}>
            <Calendar size={12} strokeWidth={1.5} />
            24 – 30 Avril 2026
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#666660", marginTop: "0.2rem" }}>Université de Douala</div>
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div className="tab-nav">
        {TABS.map(t => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`tab-btn${active ? " tab-btn--active" : ""}`}
              style={{ background: active ? `${t.color}0D` : "transparent" }}
            >
              {/* Top color bar */}
              <div className="tab-indicator" style={{ background: t.color, opacity: active ? 1 : 0.15 }} />

              <div className="tab-inner">
                {/* Icon + label row */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                  <span style={{ color: t.color, opacity: active ? 1 : 0.5, flexShrink: 0 }}>
                    {t.lucide}
                  </span>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(1rem, 2vw, 1.3rem)",
                    letterSpacing: "0.04em", lineHeight: 1.1,
                    color: active ? "#0A0A0A" : "#6B6B65",
                    transition: "color 0.2s",
                  }}>
                    {t.label}
                  </span>
                </div>

                {/* Count pill */}
                <div
                  className="tab-count"
                  style={{
                    background: active ? t.color : "transparent",
                    color: active ? "#fff" : "#88887F",
                    border: `1px solid ${active ? t.color : "rgba(10,10,10,0.15)"}`,
                  }}
                >
                  {PROGRAM[t.key].length} activités
                </div>

                {/* Hover hint — only shown on inactive tabs */}
                <div className="tab-hint" style={{ color: t.color, borderTop: `1px solid ${t.color}20` }}>
                  <ArrowRight size={10} strokeWidth={2} />
                  Explorer
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── SECTION HEADER with illustration ── */}
      <div className="sec-hdr">
        <div className="sec-hdr-label">
          <span style={{ color: cur.color, flexShrink: 0 }}>{cur.lucide}</span>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem", letterSpacing: "0.06em", color: "#0A0A0A" }}>
              {cur.full}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.14em", color: "#88887F", textTransform: "uppercase", marginTop: 2 }}>
              {events.length} activités au programme
            </div>
          </div>
        </div>
        <div className="sec-hdr-illus" style={{ background: cur.bg }}>
          <img src={cur.icon} alt={cur.full} style={{ width: 64, height: 64, objectFit: "contain", transition: "opacity 0.3s" }} />
        </div>
      </div>

      {/* ── EVENT ROWS ── */}
      <div ref={listRef} className="event-list">
        {events.map((ev, i) => (
          <div
            key={`${tab}-${i}`}
            className="event-row"
            style={{
              opacity: listV ? 1 : 0,
              transform: listV ? "none" : "translateX(-12px)",
              transition: `opacity 0.5s ease ${Math.min(i, 6) * 0.06}s, transform 0.5s ease ${Math.min(i, 6) * 0.06}s`,
              background: i % 2 === 0 ? `${cur.color}05` : "transparent",
            }}
          >
            {/* Date col */}
            <div className="event-date">
              <span style={{ color: cur.color, opacity: 0.55, flexShrink: 0 }}>{cur.lucide}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: cur.color, textTransform: "uppercase" }}>
                  <Calendar size={10} strokeWidth={1.5} />
                  {ev.date}
                </span>
                {ev.time && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F" }}>
                    <Clock size={10} strokeWidth={1.5} />
                    {ev.time}
                  </span>
                )}
              </div>
            </div>

            {/* Name col */}
            <div className="event-name">
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.3, color: "#0A0A0A" }}>
                {ev.name}
              </h3>
              <div className="cat-badge" style={{ color: cur.color, borderColor: `${cur.color}40` }}>
                <Star size={8} strokeWidth={1.5} />
                {cur.abbr}
              </div>
            </div>

            {/* Description col — hidden on mobile */}
            <div className="event-desc">
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "#555550", lineHeight: 1.8 }}>
                {ev.description}
              </p>
              {ev.details && (
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", lineHeight: 1.65, display: "flex", alignItems: "flex-start", gap: "0.35rem" }}>
                  <Users size={10} strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }} />
                  {ev.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* ── FEEDBACK FAB (fixed, bottom-right) ──────────── NEW ── */}
      <FeedbackFAB />

    </div>
  );
}