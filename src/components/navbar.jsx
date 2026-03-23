import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data";
import logo from "../assets/logo.png";
import { Star } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => setOpen(false), [location]);

  const isEval = location.pathname === "/evaluation";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "#FAFAF8",
      borderBottom: scrolled ? "1.5px solid #0F0F0F" : "1.5px solid transparent",
      boxShadow: scrolled ? "0 2px 24px rgba(21,101,192,0.08)" : "none",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "stretch", justifyContent: "space-between" }}>

        <Link to="/" style={{ display: "flex", alignItems: "center", padding: "0 1.75rem", minHeight: 64, borderRight: "1.5px solid #EAEAE5", textDecoration: "none" }}>
          <img src={logo} alt="STUD 2026" style={{ height: 44, width: "auto" }} />
        </Link>

        {/* Desktop */}
        <div style={{ display: "flex", alignItems: "stretch" }} className="nav-desktop">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{
                textDecoration: "none", display: "flex", alignItems: "center",
                padding: "0 1.1rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: active ? "#1565C0" : "#0F0F0F",
                borderLeft: "1.5px solid #EAEAE5",
                borderBottom: active ? "3px solid #1565C0" : "3px solid transparent",
                transition: "color 0.15s",
                whiteSpace: "nowrap",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#1565C0"}
                onMouseLeave={e => e.currentTarget.style.color = active ? "#1565C0" : "#0F0F0F"}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Évaluer — orange accent, always visible */}
          <Link to="/evaluation" style={{
            textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem",
            padding: "0 1.1rem",
            fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: isEval ? "#F57C00" : "#0F0F0F",
            borderLeft: "1.5px solid #EAEAE5",
            borderBottom: isEval ? "3px solid #F57C00" : "3px solid transparent",
            transition: "color 0.15s",
            whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#F57C00"; }}
            onMouseLeave={e => { e.currentTarget.style.color = isEval ? "#F57C00" : "#0F0F0F"; }}
          >
            <Star size={11} style={{ flexShrink: 0 }} />
            Évaluer
          </Link>

          <Link to="/contact" style={{
            textDecoration: "none", display: "flex", alignItems: "center",
            padding: "0 1.4rem",
            background: "#1565C0", color: "#FAFAF8",
            fontFamily: "'DM Mono', monospace", fontSize: "0.65rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
            borderLeft: "1.5px solid #0F0F0F", transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"}
            onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}
          >
            Contact
          </Link>
        </div>

        {/* Burger */}
        <button onClick={() => setOpen(!open)} className="nav-burger" style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "0 1.5rem", display: "none", flexDirection: "column",
          gap: 5, alignItems: "center", justifyContent: "center",
          borderLeft: "1.5px solid #EAEAE5",
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: 22, height: 2, background: "#0F0F0F", borderRadius: 1,
              transition: "all 0.25s",
              transform: open && i === 0 ? "rotate(45deg) translate(5px,5px)" : open && i === 1 ? "scaleX(0)" : open && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
            }} />
          ))}
        </button>
      </div>

      {/* Mobile */}
      <div style={{ maxHeight: open ? 600 : 0, overflow: "hidden", transition: "max-height 0.35s ease", borderTop: open ? "1.5px solid #0F0F0F" : "none", background: "#FAFAF8" }}>
        {NAV_LINKS.map(link => (
          <Link key={link.path} to={link.path} style={{
            display: "block", padding: "0.9rem 2rem", textDecoration: "none",
            fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
            letterSpacing: "0.08em", textTransform: "uppercase",
            color: location.pathname === link.path ? "#1565C0" : "#0F0F0F",
            borderBottom: "1px solid #EAEAE5",
          }}>{link.label}</Link>
        ))}

        {/* Évaluer in mobile menu */}
        <Link to="/evaluation" style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.9rem 2rem", textDecoration: "none",
          fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
          letterSpacing: "0.08em", textTransform: "uppercase",
          color: isEval ? "#F57C00" : "#0F0F0F",
          borderBottom: "1px solid #EAEAE5",
        }}>
          <Star size={13} />
          Évaluer
        </Link>

        <Link to="/contact" style={{
          display: "block", padding: "0.9rem 2rem",
          background: "#1565C0", color: "#FAFAF8", textDecoration: "none",
          fontFamily: "'DM Mono', monospace", fontSize: "0.78rem",
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Contact →</Link>
      </div>

      <style>{`
        @media (max-width: 960px) { .nav-desktop { display: none !important; } .nav-burger { display: flex !important; } }
      `}</style>
    </nav>
  );
}