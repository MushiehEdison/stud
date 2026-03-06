import { useRef, useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { ABOUT, META } from "../data";
import ondoa from "../assets/ondoa.png";
import uniImg from "../assets/uni.jpg";
import uniLogo from "../assets/University_of_Douala_Logo.jpg";

// ── SVG ICON IMPORTS ─────────────────────────────────────────
import iconHistory  from "../assets/icon-history.svg";
import iconRector   from "../assets/icon-rector.svg";
import iconFaculty  from "../assets/icon-faculty.svg";
// ─────────────────────────────────────────────────────────────

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

export default function About() {
  const [hRef, hV] = useInView();
  const [rRef, rV] = useInView();
  const [fRef, fV] = useInView();
  const [aRef, aV] = useInView();

  return (
    <div style={{ background: "#FAFAF8", paddingTop: 64 }}>

      {/* Page title */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
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

      {/* Uni hero image */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", position: "relative", height: 280, overflow: "hidden" }}>
        <img src={uniImg} alt="Université de Douala" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(13,27,42,0.75) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", left: "2rem", top: "50%", transform: "translateY(-50%)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 8 }}>Campus principal</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>Université de Douala</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#F57C00", marginTop: 6, letterSpacing: "0.1em" }}>Ange Raphaël · Ndogbong · Logbessou</div>
        </div>
      </div>

      {/* History */}
      <section ref={hRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* ★ HISTORY ICON in section header */}
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <img src={iconHistory} alt="" aria-hidden="true" style={{ width: 28, height: 28, opacity: 0.75 }} />
            Historique
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 01</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="hist-grid">
          {ABOUT.history.map((item, i) => (
            <div key={i} style={{ padding: "3rem 2rem", borderRight: i < 2 ? "1.5px solid #0F0F0F" : "none", opacity: hV ? 1 : 0, transform: hV ? "none" : "translateY(20px)", transition: `all 0.6s ease ${i * 0.15}s` }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "6rem", lineHeight: 1, color: i === 1 ? "#1565C0" : "#EAEAE5", marginBottom: "1rem", letterSpacing: "0.01em" }}>{item.year}</div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.75rem", lineHeight: 1.3 }}>{item.title}</h3>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "#666660", lineHeight: 1.8 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Patron */}
      <section style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Haut Patronage</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 02</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="patron-grid">
          <div style={{ padding: "4rem 2.5rem", borderRight: "1.5px solid #0F0F0F" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase", marginBottom: "2rem" }}>Sous le Haut Patronage de</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 4rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "0.5rem" }}>{META.patron}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#1565C0", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2rem" }}>{META.patronTitle}</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#555550", lineHeight: 1.85, maxWidth: 400 }}>
              Depuis 2019, sous son impulsion, l'Université de Douala accélère son développement académique, renforce ses partenariats stratégiques et consolide le bien-être de ses personnels.
            </p>
          </div>
          <div style={{ position: "relative", overflow: "hidden", minHeight: 380, background: "#0D1B2A" }}>
            <img src={ondoa} alt={META.patron} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block", opacity: 0.9 }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem", background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", color: "#FAFAF8" }}>{META.patron}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#F57C00", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>Recteur · En poste depuis 2019</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rectors */}
      <section ref={rRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* ★ RECTOR ICON in section header */}
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <img src={iconRector} alt="" aria-hidden="true" style={{ width: 28, height: 28, opacity: 0.75 }} />
            Recteurs Successifs
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 03</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="rector-grid">
          {ABOUT.rectors.map((r, i) => (
            <div key={i} style={{ padding: "1.75rem 1.5rem", borderRight: (i + 1) % 4 !== 0 ? "1.5px solid #0F0F0F" : "none", borderBottom: i < 4 ? "1.5px solid #0F0F0F" : "none", background: r.current ? "#0D1B2A" : "transparent", opacity: rV ? 1 : 0, transform: rV ? "none" : "translateY(15px)", transition: `all 0.5s ease ${i * 0.06}s` }}>
              {/* ★ RECTOR ICON in each rector card (small, when current) */}
              {r.current && (
                <img src={iconRector} alt="" aria-hidden="true" style={{ width: 20, height: 20, marginBottom: "0.5rem", opacity: 0.5, filter: "brightness(0) invert(1)" }} />
              )}
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem", color: r.current ? "#FAFAF8" : "#0F0F0F", marginBottom: "0.4rem", lineHeight: 1.3 }}>{r.name}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: r.current ? "#F57C00" : "#88887F", letterSpacing: "0.08em" }}>{r.period}</div>
              {r.current && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#F57C00", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 6 }}>● En poste</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Faculties */}
      <section ref={fRef} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* ★ FACULTY ICON in section header */}
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <img src={iconFaculty} alt="" aria-hidden="true" style={{ width: 28, height: 28, opacity: 0.75 }} />
            Facultés & Grandes Écoles
          </span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 04</span>
        </div>
        <div style={{ padding: "3rem 2rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {ABOUT.faculties.map((f, i) => (
            <div key={i} style={{ border: "1.5px solid #0F0F0F", padding: "0.5rem 1rem", fontFamily: "'Fraunces', serif", fontSize: "0.85rem", cursor: "default", transition: "all 0.15s", opacity: fV ? 1 : 0, transform: fV ? "none" : "scale(0.9)", transitionDelay: `${i * 0.04}s` }}
              onMouseEnter={e => { e.currentTarget.style.background = "#1565C0"; e.currentTarget.style.color = "#FAFAF8"; e.currentTarget.style.borderColor = "#1565C0"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0F"; e.currentTarget.style.borderColor = "#0F0F0F"; }}
            >{f}</div>
          ))}
        </div>
      </section>

      {/* Admin structure */}
      <section ref={aRef} style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Organisation Administrative</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>Section 05</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }} className="admin-grid">
          {[
            { title: "Top Management", items: ABOUT.admin.topManagement },
            { title: "Services Centraux", items: ABOUT.admin.centralServices },
            { title: "Structures Rattachées", items: ABOUT.admin.attached },
            { title: "Centres Spécialisés", items: ABOUT.admin.specialized },
          ].map((group, gi) => (
            <div key={gi} style={{ padding: "2.5rem 2rem", borderRight: gi % 2 === 0 ? "1.5px solid #0F0F0F" : "none", borderBottom: gi < 2 ? "1.5px solid #0F0F0F" : "none", opacity: aV ? 1 : 0, transform: aV ? "none" : "translateY(16px)", transition: `all 0.55s ease ${gi * 0.1}s` }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#1565C0", textTransform: "uppercase", marginBottom: "1.25rem" }}>{group.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {group.items.map((item, ii) => (
                  <div key={ii} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", fontFamily: "'Fraunces', serif", fontSize: "0.875rem", color: "#333", lineHeight: 1.6 }}>
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
        @media (max-width: 900px) {
          .hist-grid { grid-template-columns: 1fr !important; }
          .hist-grid > div { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .patron-grid { grid-template-columns: 1fr !important; }
          .patron-grid > div:first-child { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .rector-grid { grid-template-columns: 1fr 1fr !important; }
          .admin-grid { grid-template-columns: 1fr !important; }
          .admin-grid > div { border-right: none !important; }
        }
        @media (max-width: 600px) {
          .rector-grid { grid-template-columns: 1fr !important; }
          .rector-grid > div { border-right: none !important; }
        }
      `}</style>
    </div>
  );
}