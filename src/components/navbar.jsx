import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../data";
import logo from "../assets/logo.png";

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

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: "#FAFAF7",
      borderBottom: scrolled ? "1.5px solid #0F0F0F" : "1.5px solid transparent",
      transition: "border-color 0.3s",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "stretch", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "0.75rem",
          textDecoration: "none",
          borderRight: "1.5px solid #E8E8E3",
          padding: "0 1.75rem",
          minHeight: 62,
        }}>
          <img src={logo} alt="STUD 2026" style={{ height: 38, width: "auto", display: "block" }} />
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.04em", color: "#0F0F0F", lineHeight: 1 }}>
              STUD 2026
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "#C8102E", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>
              Univ. de Douala
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "stretch" }} className="nav-desktop">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{
                textDecoration: "none",
                display: "flex", alignItems: "center",
                padding: "0 1.4rem",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem", letterSpacing: "0.1em",
                textTransform: "uppercase", fontWeight: 500,
                color: active ? "#C8102E" : "#0F0F0F",
                borderLeft: "1.5px solid #E8E8E3",
                borderBottom: active ? "3px solid #C8102E" : "3px solid transparent",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.color = "#C8102E"}
                onMouseLeave={e => e.currentTarget.style.color = active ? "#C8102E" : "#0F0F0F"}
              >
                {link.label}
              </Link>
            );
          })}
          <Link to="/contact" style={{
            textDecoration: "none", display: "flex", alignItems: "center",
            padding: "0 1.6rem",
            background: "#C8102E", color: "#FAFAF7",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem", letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderLeft: "1.5px solid #0F0F0F",
            transition: "background 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#0F0F0F"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}
          >
            Nous Contacter
          </Link>
        </div>

        {/* Burger */}
        <button onClick={() => setOpen(!open)} className="nav-burger" style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "0 1.5rem", display: "none", flexDirection: "column",
          gap: 5, alignItems: "center", justifyContent: "center",
          borderLeft: "1.5px solid #E8E8E3",
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

      {/* Mobile menu */}
      <div style={{
        maxHeight: open ? 400 : 0, overflow: "hidden",
        transition: "max-height 0.35s ease",
        borderTop: open ? "1.5px solid #0F0F0F" : "none",
        background: "#FAFAF7",
      }}>
        {NAV_LINKS.map(link => (
          <Link key={link.path} to={link.path} style={{
            display: "block", padding: "1rem 2rem",
            textDecoration: "none",
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.82rem", letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: location.pathname === link.path ? "#C8102E" : "#0F0F0F",
            borderBottom: "1px solid #E8E8E3",
          }}>{link.label}</Link>
        ))}
        <Link to="/contact" style={{
          display: "block", padding: "1rem 2rem",
          background: "#C8102E", color: "#FAFAF7",
          textDecoration: "none",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.82rem", letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>Nous Contacter →</Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-burger { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}