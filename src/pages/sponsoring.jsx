import { useState, useRef, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { SPONSORING, CONTACT } from "../data";

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

export default function Sponsoring() {
  const [active, setActive] = useState(0);
  const [cmpRef, cmpV] = useInView();
  const offer = SPONSORING[active];

  return (
    <div style={{ background: "#FAFAF7", paddingTop: 62 }}>

      {/* Page title */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          SPON<span style={{ color: "#C8102E" }}>SORING</span>
        </h1>
        <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1rem", color: "#666660", maxWidth: 360, textAlign: "right" }}>
          Associez votre image à l'excellence et à la valorisation du travailleur de l'Université de Douala.
        </p>
      </div>

      {/* Offer selector */}
      <div style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F", display: "flex" }} className="offer-tabs">
        {SPONSORING.map((o, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, padding: "1.5rem 1.5rem",
            borderRight: i < SPONSORING.length - 1 ? "1.5px solid #0F0F0F" : "none",
            border: "none", cursor: "pointer",
            background: active === i ? "#0F0F0F" : "transparent",
            transition: "background 0.2s", textAlign: "left",
          }}>
            <div style={{ height: 3, background: o.color, marginBottom: "0.9rem" }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: active === i ? o.color : "#999990", textTransform: "uppercase", marginBottom: "0.2rem" }}>
              {o.badge} Offre {o.rank}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.7rem", letterSpacing: "0.04em", lineHeight: 1, color: active === i ? "#FAFAF7" : "#0F0F0F" }}>
              {o.tier.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: active === i ? "rgba(255,255,255,0.45)" : "#999990", marginTop: "0.3rem" }}>
              {o.price} {o.currency}
            </div>
          </button>
        ))}
      </div>

      {/* Active detail */}
      <div key={active} style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F", animation: "fadeUp 0.35s ease" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="offer-detail">

          {/* Elements */}
          <div style={{ padding: "3rem 2.5rem", borderRight: "1.5px solid #0F0F0F" }}>
            <div style={{ marginBottom: "2.5rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase", marginBottom: "0.4rem" }}>Investissement</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.4rem" }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 5.5rem)", lineHeight: 1, letterSpacing: "0.02em", color: offer.color }}>{offer.price}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", color: "#999990", paddingBottom: "0.7rem" }}>{offer.currency}</span>
              </div>
            </div>

            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Éléments inclus
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {offer.elements.map((el, j) => (
                <div key={j} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: offer.color, flexShrink: 0, lineHeight: 1.6, letterSpacing: "0.06em" }}>{String(j + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", lineHeight: 1.65, color: "#333" }}>{el}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div style={{ padding: "3rem 2.5rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase", marginBottom: "1.25rem" }}>
              Visibilité maximale
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {offer.visibility.map((v, j) => (
                <div key={j} style={{ display: "flex", gap: "0.9rem", alignItems: "flex-start", padding: "0.85rem 0", borderBottom: "1px solid #E8E8E3" }}>
                  <Check size={14} style={{ flexShrink: 0, marginTop: 3, color: offer.color }} />
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.875rem", lineHeight: 1.55, color: "#333" }}>{v}</span>
                </div>
              ))}
            </div>

            <a href={`mailto:${CONTACT.emails[0]}?subject=Partenariat STUD 2026 — Offre ${offer.tier}`} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
              textDecoration: "none", background: offer.color, color: "#fff",
              padding: "1rem 2rem", marginTop: "2rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.82"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Soumettre ma candidature — Offre {offer.tier}
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Compare */}
      <section ref={cmpRef} style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ padding: "1.25rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", letterSpacing: "0.04em" }}>Comparer les Offres</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="compare-grid">
          {SPONSORING.map((o, i) => (
            <div key={i} onClick={() => setActive(i)} style={{
              padding: "2.5rem 2rem",
              borderRight: i < 2 ? "1.5px solid #0F0F0F" : "none",
              cursor: "pointer",
              background: active === i ? "#0F0F0F" : "transparent",
              transition: "background 0.2s",
              opacity: cmpV ? 1 : 0,
              transform: cmpV ? "none" : "translateY(20px)",
              transitionProperty: "opacity, transform, background",
              transitionDuration: `0.6s, 0.6s, 0.2s`,
              transitionDelay: `${i * 0.15}s, ${i * 0.15}s, 0s`,
            }}
              onMouseEnter={e => { if (active !== i) e.currentTarget.style.background = "#F5F5F2"; }}
              onMouseLeave={e => { if (active !== i) e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ height: 3, background: o.color, marginBottom: "1.5rem" }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.5rem", letterSpacing: "0.04em", color: active === i ? "#FAFAF7" : "#0F0F0F", lineHeight: 1, marginBottom: "0.25rem" }}>
                {o.tier.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.95rem", color: o.color, fontWeight: 500, marginBottom: "1.5rem" }}>
                {o.price} {o.currency}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem" }}>
                {o.visibility.slice(0, 4).map((vv, j) => (
                  <div key={j} style={{ display: "flex", gap: "0.5rem", fontFamily: "'Fraunces', serif", fontSize: "0.8rem", color: active === i ? "rgba(255,255,255,0.55)" : "#666660", lineHeight: 1.45 }}>
                    <span style={{ color: o.color, flexShrink: 0 }}>—</span>{vv}
                  </div>
                ))}
                {o.visibility.length > 4 && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: active === i ? "rgba(255,255,255,0.3)" : "#999990", marginTop: "0.2rem" }}>
                    +{o.visibility.length - 4} autres avantages
                  </div>
                )}
              </div>
              <button style={{
                width: "100%", background: "transparent",
                border: `1.5px solid ${active === i ? "rgba(255,255,255,0.2)" : o.color}`,
                color: active === i ? "rgba(255,255,255,0.6)" : o.color,
                padding: "0.65rem", cursor: "pointer",
                fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "all 0.2s",
              }}>
                Voir le détail →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ background: "#0F0F0F", borderTop: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", padding: "3rem 2rem", gap: "2rem", flexWrap: "wrap" }} className="cta-banner">
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "0.75rem" }}>Prêt à nous rejoindre ?</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.8rem, 3vw, 3rem)", lineHeight: 1, letterSpacing: "0.02em", color: "#FAFAF7" }}>
              Contactez-nous pour finaliser votre partenariat STUD 2026
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexShrink: 0 }}>
            <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`} style={{
              textDecoration: "none", background: "#C8102E", color: "#FAFAF7",
              padding: "0.85rem 2rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              Appeler maintenant <ArrowRight size={14} />
            </a>
            <a href={`mailto:${CONTACT.emails[0]}`} style={{
              textDecoration: "none", background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)",
              padding: "0.85rem 2rem",
              fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: "0.5rem",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              Envoyer un email <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @media (max-width: 768px) {
          .offer-detail { grid-template-columns: 1fr !important; }
          .offer-detail > div:first-child { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .compare-grid { grid-template-columns: 1fr !important; }
          .compare-grid > div { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .offer-tabs { flex-wrap: wrap; }
          .offer-tabs button { flex: 1 1 120px; }
          .cta-banner { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}