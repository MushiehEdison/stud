import { Link } from "react-router-dom";
import { META, CONTACT, NAV_LINKS } from "../data";
import logo from "../assets/logo.png";
import uniLogo from "../assets/University_of_Douala_Logo.jpg";

export default function Footer() {
  return (
    <footer style={{ background: "#0D1B2A", color: "#FAFAF8", borderTop: "3px solid #1565C0" }}>
      {/* Ticker */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0.55rem 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: "4rem", animation: "ticker 24s linear infinite", whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>
          {Array(8).fill(null).map((_, i) => <span key={i}>★ STUD 2026 · 24–30 AVRIL · UNIVERSITÉ DE DOUALA · PERSONNEL ENGAGÉ, UNIVERSITÉ D'EXCELLENCE ·&nbsp;</span>)}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.07)" }} className="footer-grid">
        {/* Brand */}
        <div style={{ padding: "3rem 2.5rem 3rem 2rem", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "1.75rem" }}>
            <img src={logo} alt="STUD 2026" style={{ height: 52, width: "auto" }} />
            <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.1)" }} />
            <img src={uniLogo} alt="Université de Douala" style={{ height: 44, width: "auto", opacity: 0.75 }} />
          </div>
          <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.85, maxWidth: 320 }}>
            «{META.tagline}»
          </p>
          <div style={{ marginTop: "1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            Sous le haut patronage de {META.patron}
          </div>
        </div>

        {/* Nav */}
        <div style={{ padding: "3rem 2rem", borderRight: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "1.5rem" }}>Navigation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} style={{ textDecoration: "none", fontFamily: "'Fraunces', serif", fontSize: "0.92rem", color: "rgba(255,255,255,0.5)", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#F57C00"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
              >{link.label}</Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: "3rem 2rem" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: "1.5rem" }}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {CONTACT.phones.map(p => (
              <a key={p} href={`tel:${p.replace(/\s/g, "")}`} style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
              >{p}</a>
            ))}
            <div style={{ height: 8 }} />
            {CONTACT.emails.map(em => (
              <a key={em} href={`mailto:${em}`} style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", wordBreak: "break-all", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
              >{em}</a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.25rem 2rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em" }}>© 2026 Université de Douala — DAAPA. Tous droits réservés.</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.12)", letterSpacing: "0.06em" }}>{META.dates} · Douala, Cameroun</span>
      </div>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; } .footer-grid > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); } }
      `}</style>
    </footer>
  );
}