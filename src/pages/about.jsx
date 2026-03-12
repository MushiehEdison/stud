import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { ABOUT, META } from "../data";
import ondoa from "../assets/ondoa.png";
import uniImg from "../assets/uni.JPG";
import uniLogo from "../assets/University_of_Douala_Logo.jpg";
import { FeedbackFAB } from "../components/TestimonialsWidget";

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

/* ─── ILLUSTRATION: History — an open book with timeline lines ─── */
const IllustrationHistory = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    {/* Background wash */}
    <rect width="320" height="200" fill="#EEF4FF" />

    {/* Open book body */}
    <path d="M60 48 Q160 38 160 52 Q160 38 260 48 L268 148 Q160 136 160 152 Q160 136 52 148 Z"
      fill="#fff" stroke="#1565C0" strokeWidth="1.5" />
    {/* Spine crease */}
    <line x1="160" y1="52" x2="160" y2="152" stroke="#1565C0" strokeWidth="1" strokeDasharray="3 3" />

    {/* Left page lines */}
    <line x1="80" y1="78" x2="148" y2="74" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="80" y1="90" x2="148" y2="86" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="80" y1="102" x2="148" y2="98" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="80" y1="114" x2="140" y2="110" stroke="#BFCFE8" strokeWidth="1.5" strokeLinecap="round" />

    {/* Right page: timeline dots */}
    <circle cx="185" cy="78" r="5" fill="#1565C0" />
    <circle cx="185" cy="102" r="5" fill="#F57C00" />
    <circle cx="185" cy="126" r="5" fill="#1565C0" />
    <line x1="185" y1="83" x2="185" y2="97" stroke="#1565C0" strokeWidth="1.5" />
    <line x1="185" y1="107" x2="185" y2="121" stroke="#1565C0" strokeWidth="1.5" />
    {/* Year labels */}
    <line x1="190" y1="78" x2="240" y2="78" stroke="#BFCFE8" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="190" y1="102" x2="240" y2="102" stroke="#BFCFE8" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="190" y1="126" x2="230" y2="126" stroke="#BFCFE8" strokeWidth="1.2" strokeLinecap="round" />

    {/* Book shadow */}
    <path d="M52 148 Q160 136 160 152 Q160 136 268 148 L272 156 Q160 145 160 160 Q160 145 48 156 Z"
      fill="rgba(21,101,192,0.08)" />

    {/* Small star / quill accent */}
    <text x="104" y="68" fontFamily="serif" fontSize="11" fill="#1565C0" opacity="0.6">1977</text>
    <text x="192" y="73" fontFamily="monospace" fontSize="8" fill="#1565C0">—</text>
    <text x="192" y="97" fontFamily="monospace" fontSize="8" fill="#F57C00">—</text>
    <text x="192" y="121" fontFamily="monospace" fontSize="8" fill="#1565C0">—</text>
  </svg>
);

/* ─── ILLUSTRATION: Rector — a formal podium / gavel scene ─── */
const IllustrationRector = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect width="320" height="200" fill="#0D1B2A" />

    {/* Subtle grid lines */}
    {[40, 80, 120, 160, 200, 240, 280].map(x => (
      <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    ))}
    {[50, 100, 150].map(y => (
      <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
    ))}

    {/* Podium shape */}
    <rect x="110" y="110" width="100" height="58" rx="2" fill="#1565C0" opacity="0.9" />
    <rect x="96"  y="130" width="128" height="38" rx="2" fill="#0D47A1" />
    <rect x="82"  y="152" width="156" height="16" rx="2" fill="#0A3880" />

    {/* Podium front text line */}
    <rect x="122" y="122" width="76" height="2.5" rx="1" fill="rgba(255,255,255,0.18)" />
    <rect x="130" y="128" width="60" height="2" rx="1" fill="rgba(255,255,255,0.1)" />

    {/* Figure silhouette behind podium */}
    {/* Head */}
    <circle cx="160" cy="68" r="18" fill="#FAFAF8" opacity="0.12" />
    {/* Body */}
    <path d="M140 86 Q160 98 180 86 L188 110 H132 Z" fill="#FAFAF8" opacity="0.1" />

    {/* Robe / collar accent */}
    <path d="M150 90 L160 98 L170 90" stroke="rgba(245,124,0,0.5)" strokeWidth="1.5" fill="none" />

    {/* Gavel */}
    <rect x="206" y="85" width="42" height="12" rx="3" fill="#F57C00" opacity="0.85" transform="rotate(-35 206 85)" />
    <line x1="218" y1="96" x2="246" y2="124" stroke="#F57C00" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

    {/* Light rays from figure */}
    <line x1="160" y1="50" x2="160" y2="20" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
    <line x1="160" y1="50" x2="120" y2="22" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
    <line x1="160" y1="50" x2="200" y2="22" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />

    {/* Name plate */}
    <rect x="122" y="138" width="76" height="14" rx="1" fill="rgba(245,124,0,0.15)" />
    <rect x="132" y="142" width="56" height="2" rx="1" fill="rgba(245,124,0,0.4)" />
    <rect x="140" y="147" width="40" height="1.5" rx="1" fill="rgba(245,124,0,0.2)" />
  </svg>
);

/* ─── ILLUSTRATION: Faculty — university building with dome ─── */
const IllustrationFaculty = () => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
    <rect width="320" height="200" fill="#FFF8EE" />

    {/* Sky gradient suggestion */}
    <rect width="320" height="110" fill="url(#skyGrad)" />
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EEF4FF" />
        <stop offset="100%" stopColor="#FFF8EE" />
      </linearGradient>
    </defs>

    {/* Ground line */}
    <line x1="0" y1="168" x2="320" y2="168" stroke="#0F0F0F" strokeWidth="1.5" />

    {/* Main building body */}
    <rect x="72" y="112" width="176" height="56" fill="#FAFAF8" stroke="#0F0F0F" strokeWidth="1.5" />

    {/* Columns */}
    {[98, 122, 146, 170, 194, 218].map(x => (
      <rect key={x} x={x} y="112" width="8" height="56" fill="#E8E8E2" stroke="#BFBFB8" strokeWidth="0.75" />
    ))}

    {/* Pediment / triangle top */}
    <path d="M66 112 L160 60 L254 112 Z" fill="#FAFAF8" stroke="#0F0F0F" strokeWidth="1.5" />

    {/* Dome on top */}
    <ellipse cx="160" cy="60" rx="28" ry="12" fill="#EEF4FF" stroke="#1565C0" strokeWidth="1.5" />
    <ellipse cx="160" cy="58" rx="22" ry="10" fill="#EEF4FF" />
    {/* Dome shine */}
    <path d="M145 55 Q160 46 175 55" stroke="#1565C0" strokeWidth="1" fill="none" opacity="0.5" />

    {/* Flag on dome */}
    <line x1="160" y1="48" x2="160" y2="30" stroke="#0F0F0F" strokeWidth="1.2" />
    <path d="M160 30 L174 35 L160 40 Z" fill="#F57C00" />

    {/* Pediment decorative lines */}
    <line x1="100" y1="98" x2="220" y2="98" stroke="#BFBFB8" strokeWidth="0.75" />
    <line x1="90" y1="104" x2="230" y2="104" stroke="#BFBFB8" strokeWidth="0.75" />

    {/* Central door */}
    <rect x="146" y="138" width="28" height="30" rx="14" fill="#0D1B2A" />
    <rect x="150" y="140" width="20" height="26" rx="10" fill="#1565C0" opacity="0.4" />

    {/* Side wings */}
    <rect x="20" y="130" width="52" height="38" fill="#F5F0E8" stroke="#0F0F0F" strokeWidth="1.2" />
    <rect x="248" y="130" width="52" height="38" fill="#F5F0E8" stroke="#0F0F0F" strokeWidth="1.2" />
    {/* Wing windows */}
    {[30, 48].map(x => (
      <rect key={x} x={x} y="140" width="12" height="14" rx="6" fill="#EEF4FF" stroke="#BFBFB8" strokeWidth="0.75" />
    ))}
    {[258, 276].map(x => (
      <rect key={x} x={x} y="140" width="12" height="14" rx="6" fill="#EEF4FF" stroke="#BFBFB8" strokeWidth="0.75" />
    ))}

    {/* Small trees */}
    <circle cx="40" cy="130" r="0" fill="transparent" />
    <ellipse cx="52" cy="168" rx="10" ry="14" fill="#D4EDDA" stroke="#2E7D32" strokeWidth="1" />
    <line x1="52" y1="168" x2="52" y2="180" stroke="#4E342E" strokeWidth="2" />
    <ellipse cx="268" cy="168" rx="10" ry="14" fill="#D4EDDA" stroke="#2E7D32" strokeWidth="1" />
    <line x1="268" y1="168" x2="268" y2="180" stroke="#4E342E" strokeWidth="2" />

    {/* Orange accent windows */}
    {[100, 122, 194, 216].map(x => (
      <rect key={x} x={x + 1} y="124" width="6" height="10" rx="3" fill="#FFF3E0" stroke="#F57C00" strokeWidth="0.75" />
    ))}
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
        {/* Section header with illustration */}
        <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div style={{ padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Historique</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 01</span>
          </div>
          {/* Illustration preview strip */}
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
          <div style={{ width: 180, borderLeft: "1px solid rgba(10,10,10,0.12)", overflow: "hidden" }}>
            <IllustrationRector />
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

      {/* ── FACULTIES ── */}
      <section ref={fRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1px solid rgba(10,10,10,0.12)" }}>
        <div style={{ borderBottom: "1px solid rgba(10,10,10,0.12)", display: "grid", gridTemplateColumns: "1fr auto" }}>
          <div style={{ padding: "1.5rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Facultés & Grandes Écoles</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 04</span>
          </div>
          <div style={{ width: 180, borderLeft: "1px solid rgba(10,10,10,0.12)", overflow: "hidden" }}>
            <IllustrationFaculty />
          </div>
        </div>

        <div style={{ padding: "3rem 2.5rem", display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          {ABOUT.faculties.map((f, i) => (
            <div key={i}
              style={{
                border: "1px solid rgba(10,10,10,0.15)", padding: "0.55rem 1.1rem",
                fontFamily: "'Fraunces', serif", fontSize: "0.85rem", cursor: "default",
                transition: "all 0.18s", opacity: fV ? 1 : 0,
                transform: fV ? "none" : "scale(0.9)",
                transitionDelay: `${i * 0.04}s`, background: "transparent", color: "#0F0F0F"
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1565C0"; e.currentTarget.style.color = "#FAFAF8"; e.currentTarget.style.borderColor = "#1565C0"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0F"; e.currentTarget.style.borderColor = "rgba(10,10,10,0.15)"; }}
            >{f}</div>
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
            { title: "Top Management", items: ABOUT.admin.topManagement },
            { title: "Services Centraux", items: ABOUT.admin.centralServices },
            { title: "Structures Rattachées", items: ABOUT.admin.attached },
            { title: "Centres Spécialisés", items: ABOUT.admin.specialized },
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

        @media (max-width: 900px) {
          .hist-grid { grid-template-columns: 1fr !important; }
          .hist-grid > div { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.12); }
          .patron-grid { grid-template-columns: 1fr !important; }
          .patron-grid > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.12); }
          .rector-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
          .admin-grid > div { border-right: none !important; }
        }
        @media (max-width: 600px) {
          .rector-grid { grid-template-columns: 1fr !important; }
          .rector-grid > div { border-right: none !important; }
        }
        @media (max-width: 480px) {
          [style*="width: 180"] { display: none; }
        }
      `}</style>
      {/* ── FEEDBACK FAB (fixed, bottom-right) ──────────── NEW ── */}
            <FeedbackFAB />
    </div>
  );
}