import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Award, BookOpen, TrendingUp, Users,
  PersonStanding, Trophy, Dumbbell, Zap,
  HelpCircle, FileText, LayoutGrid, PenTool,
  Music, UtensilsCrossed, Mic, Star, Gift,
  MessageSquare, Leaf, Building2,
} from "lucide-react";
import { META, STATS, OBJECTIVES, SPONSORING, PROGRAM } from "../data";
import logo from "../assets/logo.png";

const ICON_MAP = {
  Award, BookOpen, TrendingUp, Users,
  PersonStanding, Trophy, Dumbbell, Zap,
  HelpCircle, FileText, LayoutGrid, PenTool,
  Music, UtensilsCrossed, Mic, Star, Gift,
  MessageSquare, Leaf, Building2,
};

function Icon({ name, size = 20, ...props }) {
  const C = ICON_MAP[name];
  return C ? <C size={size} {...props} /> : null;
}

function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function Counter({ target }) {
  const [n, setN] = useState(0);
  const [ref, v] = useInView(0.3);
  useEffect(() => {
    if (!v) return;
    let cur = 0;
    const dur = 1600, step = 16;
    const inc = target / (dur / step);
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(cur));
    }, step);
    return () => clearInterval(t);
  }, [v, target]);
  return <span ref={ref}>{n.toLocaleString("fr-FR")}</span>;
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [objRef, objV] = useInView();
  const [spRef, spV] = useInView();
  const [pgRef, pgV] = useInView();

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const featured = [
    PROGRAM.sports[0], PROGRAM.cultural[7], PROGRAM.cultural[5],
    PROGRAM.intellectual[0], PROGRAM.sports[1], PROGRAM.cultural[4],
  ];

  return (
    <div style={{ background: "#FAFAF7", paddingTop: 62 }}>

      {/* ── TICKER ── */}
      <div style={{ background: "#C8102E", padding: "0.45rem 0", overflow: "hidden", borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{
          display: "flex", gap: "4rem",
          animation: "ticker 20s linear infinite",
          whiteSpace: "nowrap",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem", letterSpacing: "0.14em",
          color: "#FAFAF7", textTransform: "uppercase",
        }}>
          {Array(6).fill(null).map((_, i) => (
            <span key={i}>★ STUD 2026 · 24–30 AVRIL · UNIVERSITÉ DE DOUALA · PERSONNEL ENGAGÉ, UNIVERSITÉ D'EXCELLENCE ·&nbsp;</span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="hero-grid">

          {/* Left */}
          <div style={{ padding: "4rem 3rem 3.5rem", borderRight: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "3rem" }}>
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                border: "1.5px solid #0F0F0F", padding: "0.3rem 0.8rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.62rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                marginBottom: "2.5rem",
                opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)",
                transition: "all 0.5s ease 0.1s",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8102E", display: "inline-block", flexShrink: 0 }} />
                Édition 2026
              </div>

              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4.5rem, 10vw, 10rem)",
                lineHeight: 0.88, letterSpacing: "0.02em", color: "#0F0F0F",
                opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)",
                transition: "all 0.7s ease 0.2s",
              }}>
                SE<span style={{ color: "#C8102E" }}>MA</span><br />
                INE<br />
                DU<br />
                TRA<span style={{ color: "#C8102E" }}>VAI</span><br />
                LLEUR
              </h1>
            </div>

            <div style={{ opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.5s" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1rem", color: "#666660", lineHeight: 1.75, maxWidth: 380, marginBottom: "2rem" }}>
                «{META.theme}»
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link to="/programme" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.6rem",
                  textDecoration: "none", background: "#0F0F0F", color: "#FAFAF7",
                  padding: "0.85rem 2rem", fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
                  transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#C8102E"}
                  onMouseLeave={e => e.currentTarget.style.background = "#0F0F0F"}
                >
                  Voir le Programme →
                </Link>
                <Link to="/sponsoring" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.6rem",
                  textDecoration: "none", background: "transparent", color: "#0F0F0F",
                  padding: "0.85rem 2rem", fontFamily: "'DM Mono', monospace",
                  fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase",
                  border: "1.5px solid #0F0F0F", transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#0F0F0F"; e.currentTarget.style.color = "#FAFAF7"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0F"; }}
                >
                  Devenir Sponsor
                </Link>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}>
            {/* Date block */}
            <div style={{ flex: 1, padding: "3rem 2.5rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <img src={logo} alt="STUD 2026" style={{ height: 56, width: "auto" }} />
                <div style={{ width: "1.5px", height: 48, background: "#E8E8E3" }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase", marginBottom: 4 }}>Date de l'événement</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", lineHeight: 1, letterSpacing: "0.02em", color: "#0F0F0F" }}>
                    24.04 <span style={{ color: "#C8102E" }}>—</span> 30.04
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#999990", marginTop: 4 }}>2026 · Douala, Cameroun</div>
                </div>
              </div>
            </div>

            {/* Stats 2×2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  padding: "1.75rem 2rem",
                  borderTop: "1.5px solid #0F0F0F",
                  borderRight: i % 2 === 0 ? "1.5px solid #0F0F0F" : "none",
                }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", lineHeight: 1, color: i % 2 === 0 ? "#0F0F0F" : "#C8102E", letterSpacing: "0.02em" }}>
                    <Counter target={s.value} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.14em", color: "#999990", textTransform: "uppercase", marginTop: "0.3rem" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Patron strip */}
            <div style={{ padding: "1.25rem 2rem", borderTop: "1.5px solid #0F0F0F", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0F0F0F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Award size={16} color="#FAFAF7" />
              </div>
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.85rem" }}>{META.patron}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#999990", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Haut Patronage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OBJECTIVES ── */}
      <section ref={objRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>Nos Objectifs</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#999990", letterSpacing: "0.15em", textTransform: "uppercase" }}>STUD 2026 — Section 01</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="obj-grid">
            {OBJECTIVES.map((o, i) => (
              <div key={i} style={{
                padding: "2.5rem 2rem",
                borderRight: i < 3 ? "1.5px solid #0F0F0F" : "none",
                opacity: objV ? 1 : 0,
                transform: objV ? "none" : "translateY(20px)",
                transition: `all 0.6s ease ${i * 0.1}s`,
              }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.5rem", lineHeight: 1, color: i % 2 === 0 ? "#C8102E" : "#E8E8E3", marginBottom: "1.25rem", letterSpacing: "0.02em" }}>{o.num}</div>
                <div style={{ marginBottom: "1rem", color: i % 2 === 0 ? "#C8102E" : "#0F0F0F" }}>
                  <Icon name={o.icon} size={22} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.65rem", lineHeight: 1.3 }}>{o.title}</h3>
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.83rem", color: "#666660", lineHeight: 1.7 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROGRAMME ── */}
      <section ref={pgRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>À l'Affiche</span>
            <Link to="/programme" style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8102E" }}>
              Voir tout le programme →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="prog-grid">
            {featured.map((ev, i) => (
              <div key={i} style={{
                padding: "2rem",
                borderRight: (i + 1) % 3 !== 0 ? "1.5px solid #0F0F0F" : "none",
                borderBottom: i < 3 ? "1.5px solid #0F0F0F" : "none",
                background: i === 0 ? "#0F0F0F" : "transparent",
                color: i === 0 ? "#FAFAF7" : "#0F0F0F",
                opacity: pgV ? 1 : 0,
                transform: pgV ? "none" : "translateY(16px)",
                transition: `all 0.55s ease ${i * 0.07}s`,
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: i === 0 ? "#C8102E" : "#999990", marginBottom: "0.75rem" }}>{ev.date}</div>
                <div style={{ marginBottom: "0.75rem", color: i === 0 ? "#C8102E" : "#0F0F0F" }}>
                  <Icon name={ev.icon} size={22} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.3, marginBottom: "0.5rem" }}>{ev.name}</h3>
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.82rem", lineHeight: 1.65, color: i === 0 ? "rgba(255,255,255,0.5)" : "#666660" }}>{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORING PREVIEW ── */}
      <section ref={spRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>Packages Sponsoring</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#999990", letterSpacing: "0.15em", textTransform: "uppercase" }}>STUD 2026 — Section 03</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="sp-grid">
            {SPONSORING.map((offer, i) => (
              <div key={i} style={{
                borderRight: i < 2 ? "1.5px solid #0F0F0F" : "none",
                opacity: spV ? 1 : 0,
                transform: spV ? "none" : "translateY(20px)",
                transition: `all 0.6s ease ${i * 0.15}s`,
              }}>
                <div style={{ height: 5, background: offer.color }} />
                <div style={{ padding: "2.5rem 2rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: offer.color, marginBottom: "0.4rem" }}>
                    {offer.badge} OFFRE {offer.tier.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", lineHeight: 1, marginBottom: "0.2rem", letterSpacing: "0.02em" }}>{offer.price}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#999990", letterSpacing: "0.1em", marginBottom: "2rem" }}>{offer.currency}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                    {offer.visibility.slice(0, 4).map((v, j) => (
                      <div key={j} style={{ display: "flex", gap: "0.6rem", fontFamily: "'Fraunces', serif", fontSize: "0.82rem", color: "#333", lineHeight: 1.4 }}>
                        <span style={{ color: offer.color, flexShrink: 0, fontWeight: 700 }}>—</span>{v}
                      </div>
                    ))}
                    {offer.visibility.length > 4 && (
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#999990" }}>+{offer.visibility.length - 4} avantages…</div>
                    )}
                  </div>
                  <Link to="/sponsoring" style={{
                    display: "block", textAlign: "center", textDecoration: "none",
                    border: `1.5px solid ${offer.color}`, color: offer.color,
                    padding: "0.75rem 1.5rem",
                    fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = offer.color; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = offer.color; }}
                  >
                    En savoir plus →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280 }} className="cta-grid">
          <div style={{ padding: "4rem 3rem", borderRight: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase" }}>En savoir plus</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "1.5rem" }}>
                À PROPOS DE<br /><span style={{ color: "#C8102E" }}>L'UNIVERSITÉ</span>
              </h2>
              <Link to="/about" style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                textDecoration: "none", border: "1.5px solid #0F0F0F",
                color: "#0F0F0F", padding: "0.8rem 1.75rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0F0F0F"; e.currentTarget.style.color = "#FAFAF7"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0F"; }}
              >
                Découvrir l'Histoire →
              </Link>
            </div>
          </div>
          <div style={{ padding: "4rem 3rem", background: "#C8102E", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Partenariat</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em", color: "#FAFAF7", marginBottom: "1.5rem" }}>
                DEVENEZ<br />SPONSOR
              </h2>
              <Link to="/sponsoring" style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                textDecoration: "none", border: "1.5px solid #FAFAF7",
                color: "#FAFAF7", padding: "0.8rem 1.75rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FAFAF7"; e.currentTarget.style.color = "#C8102E"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FAFAF7"; }}
              >
                Voir les offres →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:first-child { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .obj-grid { grid-template-columns: 1fr 1fr !important; }
          .obj-grid > div { border-bottom: 1.5px solid #0F0F0F; }
          .obj-grid > div:nth-child(even) { border-right: none !important; }
          .sp-grid { grid-template-columns: 1fr !important; }
          .sp-grid > div { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .prog-grid { grid-template-columns: 1fr 1fr !important; }
          .cta-grid { grid-template-columns: 1fr !important; }
          .cta-grid > div:first-child { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
        }
        @media (max-width: 600px) {
          .obj-grid { grid-template-columns: 1fr !important; }
          .prog-grid { grid-template-columns: 1fr !important; }
          .prog-grid > div { border-right: none !important; }
        }
      `}</style>
    </div>
  );
}