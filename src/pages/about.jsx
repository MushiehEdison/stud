import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { ABOUT, META } from "../data";
import ondoa from "../assets/ondoa.png";
import uniImg from "../assets/uni.JPG";
import uniLogo from "../assets/University_of_Douala_Logo.jpg";
import { FeedbackFAB } from "../components/TestimonialsWidget";

// ── Faculty logo imports ──────────────────────────────────────
import logoFSEGA from "../assets/eco.png";
import logoENSET from "../assets/enset.png";
import logoESSEC from "../assets/essec.png";
import logoFDS   from "../assets/fds.png";
import logoIBA   from "../assets/iba.png";
import logoISH   from "../assets/ish.png";
import logoIUT   from "../assets/iut.png";
import logoFLSH  from "../assets/letter.png";

const FACULTIES_VISUAL = [
  { short:"FSEGA", full:"Faculté des Sciences Économiques et de Gestion Appliquée",  logo:logoFSEGA, accent:"#1565C0" },
  { short:"ENSET", full:"École Normale Supérieure de l'Enseignement Technique",      logo:logoENSET, accent:"#1565C0" },
  { short:"ESSEC", full:"École Supérieure des Sciences Économiques et Commerciales", logo:logoESSEC, accent:"#F57C00" },
  { short:"FDS",   full:"Faculté de Droit et de Science Politique",                  logo:logoFDS,   accent:"#1565C0" },
  { short:"IBA",   full:"Institut de la Baie de Bonanjo en Administration",          logo:logoIBA,   accent:"#F57C00" },
  { short:"ISH",   full:"Institut des Sciences de l'Homme",                          logo:logoISH,   accent:"#1565C0" },
  { short:"IUT",   full:"Institut Universitaire de Technologie",                     logo:logoIUT,   accent:"#1565C0" },
  { short:"FLSH",  full:"Faculté des Lettres et Sciences Humaines",                  logo:logoFLSH,  accent:"#F57C00" },
];

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

const IllustrationHistory = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect width="320" height="200" fill="#EEF4FF" />
    <path d="M60 48 Q160 38 160 52 Q160 38 260 48 L268 148 Q160 136 160 152 Q160 136 52 148 Z"
      fill="#fff" stroke="#1565C0" strokeWidth="1.5" />
    <line x1="160" y1="52" x2="160" y2="152" stroke="#1565C0" strokeWidth="1" strokeDasharray="3 3" />
    <line x1="80" y1="78" x2="148" y2="74" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="80" y1="90" x2="148" y2="86" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="80" y1="102" x2="148" y2="98" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="80" y1="114" x2="140" y2="110" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="185" cy="78" r="5" fill="#1565C0" />
    <circle cx="185" cy="102" r="5" fill="#F57C00" />
    <circle cx="185" cy="126" r="5" fill="#1565C0" />
    <line x1="185" y1="83" x2="185" y2="97" stroke="#1565C0" strokeWidth="1.5" />
    <line x1="185" y1="107" x2="185" y2="121" stroke="#1565C0" strokeWidth="1.5" />
    <line x1="190" y1="78" x2="240" y2="78" stroke="#BFCFE8" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="190" y1="102" x2="240" y2="102" stroke="#BFCFE8" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="190" y1="126" x2="230" y2="126" stroke="#BFCFE8" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M52 148 Q160 136 160 152 Q160 136 268 148 L272 156 Q160 145 160 160 Q160 145 48 156 Z"
      fill="rgba(21,101,192,0.08)" />
    <text x="104" y="68" fontFamily="serif" fontSize="11" fill="#1565C0" opacity="0.6">1977</text>
    <text x="192" y="73" fontFamily="monospace" fontSize="8" fill="#1565C0">—</text>
    <text x="192" y="97" fontFamily="monospace" fontSize="8" fill="#F57C00">—</text>
    <text x="192" y="121" fontFamily="monospace" fontSize="8" fill="#1565C0">—</text>
  </svg>
);

export default function About() {
  const [hRef, hV] = useInView();
  const [rRef, rV] = useInView();
  const [fRef, fV] = useInView();
  const [aRef, aV] = useInView();

  return (
    <div style={{ background: "#FAFAF8", paddingTop: 64 }}>

      {/* ── PAGE TITLE ── */}
      <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", maxWidth: 1280, margin: "0 auto", padding: "3rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          À PROPOS<br /><span style={{ color: "#1565C0" }}>DE NOUS</span>
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={uniLogo} alt="UDo" style={{ height: 48, width: "auto", opacity: 0.8 }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", color: "#88887F", textTransform: "uppercase" }}>Depuis 1977</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", color: "#333", marginTop: "0.2rem" }}>Douala, Cameroun</div>
          </div>
        </div>
      </div>

      {/* ── HERO IMAGE ── */}
      <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", position: "relative", height: 300, overflow: "hidden" }}>
        <img src={uniImg} alt="Université de Douala" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,27,42,0.8) 0%, rgba(13,27,42,0.3) 55%, transparent 100%)" }} />
        <div style={{ position: "absolute", left: "2.5rem", top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", marginBottom: 10 }}>Campus principal</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>Université de Douala</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.63rem", color: "#F57C00", marginTop: 8, letterSpacing: "0.1em" }}>Ange Raphaël · Ndogbong · Logbessou</div>
        </div>
      </div>

      {/* ── HISTORY ── */}
      <section ref={hRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1px solid rgba(10,10,10,0.12)" }}>
        <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div style={{ padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Historique</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 01</span>
          </div>
          <div style={{ width: 180, borderLeft: "1px solid rgba(10,10,10,0.12)", overflow: "hidden" }}>
            <IllustrationHistory />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="hist-grid">
          {ABOUT.history.map((item, i) => (
            <div key={i} style={{
              padding: "3rem 2.5rem",
              borderRight: i < 2 ? "1px solid rgba(10,10,10,0.12)" : "none",
              opacity: hV ? 1 : 0,
              transform: hV ? "none" : "translateY(20px)",
              transition: `opacity 0.65s ease ${i * 0.15}s, transform 0.65s ease ${i * 0.15}s`
            }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5.5rem", lineHeight: 1, color: i === 1 ? "#1565C0" : "#E0E0D8", marginBottom: "1rem", letterSpacing: "0.01em" }}>{item.year}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem", lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "#666660", lineHeight: 1.85 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PATRON ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1px solid rgba(10,10,10,0.12)" }}>
        <div style={{ padding: "1.5rem 2.5rem", borderBottom: "1px solid rgba(10,10,10,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Haut Patronage</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 02</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="patron-grid">
          <div style={{ padding: "4rem 3rem", borderRight: "1px solid rgba(10,10,10,0.12)" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase", marginBottom: "2rem" }}>Sous le Haut Patronage de</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "0.5rem" }}>{META.patron}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#1565C0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>{META.patronTitle}</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#555550", lineHeight: 1.9, maxWidth: 400 }}>
              Depuis 2019, sous son impulsion, l'Université de Douala accélère son développement académique, renforce ses partenariats stratégiques et consolide le bien-être de ses personnels.
            </p>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: 380, background: "#0D1B2A" }}>
            <img src={ondoa} alt={META.patron} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", opacity: 0.9 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem", background: "linear-gradient(transparent, rgba(0,0,0,0.88))" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: "#FAFAF8" }}>{META.patron}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#F57C00", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>Recteur · En poste depuis 2019</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RECTORS ── */}
      <section ref={rRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1px solid rgba(10,10,10,0.12)" }}>
        <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div style={{ padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Recteurs Successifs</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 03</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="rector-grid">
          {ABOUT.rectors.map((r, i) => (
            <div key={i} style={{
              padding: "1.75rem 2rem",
              borderRight: (i + 1) % 4 !== 0 ? "1px solid rgba(10,10,10,0.12)" : "none",
              borderBottom: i < 4 ? "1px solid rgba(10,10,10,0.12)" : "none",
              background: r.current ? "#0D1B2A" : "transparent",
              opacity: rV ? 1 : 0,
              transform: rV ? "none" : "translateY(15px)",
              transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`
            }}>
              {r.current && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F57C00", marginBottom: "0.75rem", animation: "pulse 2s infinite" }} />
              )}
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem", color: r.current ? "#FAFAF8" : "#0F0F0F", marginBottom: "0.4rem", lineHeight: 1.3 }}>{r.name}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: r.current ? "#F57C00" : "#88887F", letterSpacing: "0.08em" }}>{r.period}</div>
              {r.current && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "#F57C00", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 8 }}>En poste</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── FACULTIES — image cards ── */}
      <section ref={fRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1px solid rgba(10,10,10,0.12)" }}>
        <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div style={{ padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Facultés & Grandes Écoles</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 04</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="fac-grid">
          {FACULTIES_VISUAL.map((fac, i) => (
            <FacultyCard key={i} fac={fac} i={i} visible={fV} total={FACULTIES_VISUAL.length} />
          ))}
        </div>
      </section>

      {/* ── ADMIN STRUCTURE ── */}
      <section ref={aRef} style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ padding: "1.5rem 2.5rem", borderBottom: "1px solid rgba(10,10,10,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Organisation Administrative</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 05</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }} className="admin-grid">
          {[
            { title: "Top Management",        items: ABOUT.admin.topManagement   },
            { title: "Services Centraux",     items: ABOUT.admin.centralServices },
            { title: "Structures Rattachées", items: ABOUT.admin.attached        },
            { title: "Centres Spécialisés",   items: ABOUT.admin.specialized     },
          ].map((group, gi) => (
            <div key={gi} style={{
              padding: "2.75rem 2.5rem",
              borderRight: gi % 2 === 0 ? "1px solid rgba(10,10,10,0.12)" : "none",
              borderBottom: gi < 2 ? "1px solid rgba(10,10,10,0.12)" : "none",
              opacity: aV ? 1 : 0,
              transform: aV ? "none" : "translateY(16px)",
              transition: `opacity 0.55s ease ${gi * 0.1}s, transform 0.55s ease ${gi * 0.1}s`
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#1565C0", textTransform: "uppercase", marginBottom: "1.5rem" }}>{group.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {group.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontFamily: "'Fraunces', serif", fontSize: "0.875rem", color: "#333", lineHeight: 1.65 }}>
                    <ChevronRight size={14} style={{ flexShrink: 0, marginTop: 4, color: "#1565C0" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }

        .fac-card { transition: opacity .3s ease; }
        .fac-card:hover .fac-logo  { opacity: 0.9 !important; }
        .fac-card:hover .fac-info  { opacity: 1  !important; }
        .fac-logo { transition: opacity .3s ease; }
        .fac-info { transition: opacity .3s ease; }

        @media (max-width: 900px) {
          .hist-grid   { grid-template-columns: 1fr !important; }
          .hist-grid > div { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.12); }
          .patron-grid { grid-template-columns: 1fr !important; }
          .patron-grid > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.12); }
          .rector-grid { grid-template-columns: 1fr 1fr !important; }
          .fac-grid    { grid-template-columns: repeat(2, 1fr) !important; }
          .admin-grid  { grid-template-columns: 1fr !important; }
          .admin-grid > div { border-right: none !important; }
        }
        @media (max-width: 600px) {
          .rector-grid { grid-template-columns: 1fr !important; }
          .rector-grid > div { border-right: none !important; }
          .fac-grid    { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 400px) {
          .fac-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          [style*="width: 180"] { display: none; }
        }
      `}</style>

      <FeedbackFAB />
    </div>
  );
}

// ── Faculty card ──────────────────────────────────────────────
function FacultyCard({ fac, i, visible, total }) {
  const cols   = 4;
  const col    = i % cols;
  const rows   = Math.ceil(total / cols);
  const row    = Math.floor(i / cols);

  return (
    <div
      className="fac-card"
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        background: "#ffffff",
        borderRight:  col < cols - 1 ? "1px solid rgb(255, 255, 255)" : "none",
        borderBottom: row < rows - 1  ? "1px solid rgb(255, 255, 255)" : "none",
        opacity:   visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`,
      }}>

      {/* accent top bar — matches section header style */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
        background: fac.accent, zIndex:2 }} />

      {/* logo centered */}
      <img
        className="fac-logo"
        src={fac.logo}
        alt={fac.short}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -58%)",
          width: "58%", height: "58%",
          objectFit: "contain",
        }}
        onError={e => { e.target.style.display = "none"; }}
      />

      {/* bottom name overlay — always slightly visible, brighter on hover */}
      <div
        className="fac-info"
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "1.1rem 1rem",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 65%, transparent 100%)",
          opacity: 0.8,
        }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "1rem", letterSpacing: "0.2em", fontWeight : "bolder",
          textTransform: "uppercase", color: fac.accent,
          marginBottom: 3,
        }}>{fac.short}</div>
        <div style={{
          fontFamily: "'Fraunces', serif", fontWeight: 700,
          fontSize: "0.9rem", color: "#cacaca", lineHeight: 1.35,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{fac.full}</div>
      </div>
    </div>
  );
}