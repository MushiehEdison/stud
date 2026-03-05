import { Link } from "react-router-dom";
import { META, CONTACT, NAV_LINKS } from "../data";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer style={{ background: "#0F0F0F", color: "#FAFAF7", borderTop: "1.5px solid #0F0F0F" }}>
      {/* Marquee strip */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0.6rem 0", overflow: "hidden" }}>
        <div style={{
          display: "flex", gap: "3rem",
          animation: "ticker 22s linear infinite",
          whiteSpace: "nowrap",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.65rem", letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.25)", textTransform: "uppercase",
        }}>
          {Array(8).fill(null).map((_, i) => (
            <span key={i}>★ STUD 2026 · 24–30 AVRIL · UNIVERSITÉ DE DOUALA · PERSONNEL ENGAGÉ, UNIVERSITÉ D'EXCELLENCE ·&nbsp;</span>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }} className="footer-grid">
        {/* Brand */}
        <div style={{ padding: "3rem 2rem", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <img src={logo} alt="STUD 2026" style={{ height: 44, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.85 }} />
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.04em", lineHeight: 1 }}>STUD 2026</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#C8102E", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>Semaine du Travailleur</div>
            </div>
          </div>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.8, maxWidth: 320 }}>
            «{META.tagline}»
          </p>
          <div style={{ marginTop: "1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            Sous le haut patronage de {META.patron}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: "3rem 2rem", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "1.5rem" }}>Navigation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} style={{
                textDecoration: "none", fontFamily: "'Fraunces', serif",
                fontSize: "0.95rem", color: "rgba(255,255,255,0.55)",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#C8102E"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
              >{link.label}</Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: "3rem 2rem" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "1.5rem" }}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {CONTACT.phones.map(p => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} style={{
                textDecoration: "none", fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem", color: "rgba(255,255,255,0.45)",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >{p}</a>
            ))}
            <div style={{ height: 10 }} />
            {CONTACT.emails.map(em => (
              <a key={em} href={`mailto:${em}`} style={{
                textDecoration: "none", fontFamily: "'DM Mono', monospace",
                fontSize: "0.62rem", color: "rgba(255,255,255,0.45)",
                wordBreak: "break-all", transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}
              >{em}</a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em" }}>
          © 2026 Université de Douala — DAAPA. Tous droits réservés.
        </span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.06em" }}>
          {META.dates} · Douala, Cameroun
        </span>
      </div>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; }
          .footer-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
        }
      `}</style>
    </footer>
  );
}