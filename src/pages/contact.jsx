import { useState } from "react";
import { Phone, Mail, MapPin, Copy, Check, ArrowRight } from "lucide-react";
import { CONTACT, META } from "../data";

import iconPhone    from "../assets/icon-phone.svg";
import iconEmail    from "../assets/icon-email.svg";
import iconLocation from "../assets/icon-location.svg";

export default function Contact() {
  const [copied, setCopied] = useState(null);
  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const rule = "1px solid rgba(10,10,10,0.12)";
  const ruleLight = "1px solid rgba(10,10,10,0.07)";

  return (
    <div style={{ background: "#FAFAF8", paddingTop: 64 }}>

      {/* ── PAGE TITLE ── */}
      <div style={{
        borderBottom: rule, maxWidth: 1280, margin: "0 auto",
        padding: "3rem 2.5rem",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        flexWrap: "wrap", gap: "1rem"
      }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          NOS<br /><span style={{ color: "#1565C0" }}>CONTACTS</span>
        </h1>
        <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1rem", color: "#666660", maxWidth: 340, textAlign: "right" }}>
          Notre équipe répond à toutes vos questions sur la STUD 2026 et les opportunités de partenariat.
        </p>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── PHONES ── */}
        <div style={{ borderBottom: rule }}>
          {/* Header row: label left, illustration right */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", borderBottom: ruleLight }}>
            <div style={{ padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Phone size={14} strokeWidth={1.5} color="#1565C0" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase" }}>
                Téléphones — {CONTACT.phones.length} numéros
              </span>
            </div>
            <div style={{ width: 120, borderLeft: rule, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
              <img src={iconPhone} alt="Téléphone" style={{ width: 64, height: 64, objectFit: "contain" }} />
            </div>
          </div>

          {CONTACT.phones.map((phone, i) => (
            <div key={i}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1.5rem 2.5rem",
                borderBottom: i < CONTACT.phones.length - 1 ? ruleLight : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#F0F5FF"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#1565C0", letterSpacing: "0.1em", width: 22 }}>0{i + 1}</span>
                <Phone size={14} strokeWidth={1.5} color="#1565C0" style={{ opacity: 0.4 }} />
                <a href={`tel:${phone.replace(/\s/g, "")}`}
                  style={{ textDecoration: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.3rem, 3vw, 2rem)", letterSpacing: "0.04em", color: "#0A0A0A", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#1565C0"}
                  onMouseLeave={e => e.currentTarget.style.color = "#0A0A0A"}
                >{phone}</a>
              </div>
              <button onClick={() => copy(phone, `p${i}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  background: copied === `p${i}` ? "#0A0A0A" : "transparent",
                  border: `1px solid ${copied === `p${i}` ? "#0A0A0A" : "rgba(10,10,10,0.2)"}`,
                  cursor: "pointer", padding: "0.45rem 1rem",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.54rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: copied === `p${i}` ? "#FAFAF8" : "#555550",
                  transition: "all 0.2s",
                }}>
                {copied === `p${i}` ? <Check size={11} /> : <Copy size={11} />}
                {copied === `p${i}` ? "Copié" : "Copier"}
              </button>
            </div>
          ))}
        </div>

        {/* ── EMAILS ── */}
        <div style={{ borderBottom: rule }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", borderBottom: ruleLight }}>
            <div style={{ padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Mail size={14} strokeWidth={1.5} color="#F57C00" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase" }}>
                Adresses Email
              </span>
            </div>
            <div style={{ width: 120, borderLeft: rule, background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
              <img src={iconEmail} alt="Email" style={{ width: 64, height: 64, objectFit: "contain" }} />
            </div>
          </div>

          {CONTACT.emails.map((email, i) => (
            <div key={i}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "1.5rem 2.5rem", flexWrap: "wrap", gap: "1rem",
                borderBottom: i < CONTACT.emails.length - 1 ? ruleLight : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#FFF8F0"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", minWidth: 0 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#F57C00", letterSpacing: "0.1em", width: 22 }}>0{i + 1}</span>
                <Mail size={14} strokeWidth={1.5} color="#F57C00" style={{ opacity: 0.4, flexShrink: 0 }} />
                <a href={`mailto:${email}`}
                  style={{ textDecoration: "none", fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", color: "#0A0A0A", transition: "color 0.15s", wordBreak: "break-all" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#F57C00"}
                  onMouseLeave={e => e.currentTarget.style.color = "#0A0A0A"}
                >{email}</a>
              </div>
              <button onClick={() => copy(email, `e${i}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0,
                  background: copied === `e${i}` ? "#0A0A0A" : "transparent",
                  border: `1px solid ${copied === `e${i}` ? "#0A0A0A" : "rgba(10,10,10,0.2)"}`,
                  cursor: "pointer", padding: "0.45rem 1rem",
                  fontFamily: "'DM Mono', monospace", fontSize: "0.54rem",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: copied === `e${i}` ? "#FAFAF8" : "#555550",
                  transition: "all 0.2s",
                }}>
                {copied === `e${i}` ? <Check size={11} /> : <Copy size={11} />}
                {copied === `e${i}` ? "Copié" : "Copier"}
              </button>
            </div>
          ))}
        </div>

        {/* ── ADDRESS ── */}
        <div style={{ borderBottom: rule }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", borderBottom: ruleLight }}>
            <div style={{ padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <MapPin size={14} strokeWidth={1.5} color="#1565C0" />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase" }}>
                Adresse — 3 Campus
              </span>
            </div>
            <div style={{ width: 120, borderLeft: rule, background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
              <img src={iconLocation} alt="Localisation" style={{ width: 64, height: 64, objectFit: "contain" }} />
            </div>
          </div>

          {/* Two-col: large illustration panel + address details */}
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr" }} className="addr-grid">
            <div style={{
              borderRight: rule,
              background: "linear-gradient(160deg, #EEF4FF 0%, #FAFAF8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "3rem 2rem",
            }}>
              <img src={iconLocation} alt="" aria-hidden="true"
                style={{ width: "100%", maxWidth: 130, height: "auto", objectFit: "contain" }} />
            </div>
            <div style={{ padding: "2.5rem 2.5rem" }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                Université de Douala
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {[
                  { campus: "Campus 1", name: "Ange Raphaël" },
                  { campus: "Campus 2", name: "Ndogbong" },
                  { campus: "Campus 3", name: "Logbessou" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <MapPin size={13} strokeWidth={1.5} color="#1565C0" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#1565C0", letterSpacing: "0.08em" }}>{c.campus}</span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: "0.9rem", color: "#555550" }}>{c.name}</span>
                  </div>
                ))}
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.1em", marginTop: "0.25rem", paddingLeft: "1.6rem" }}>
                  Douala, Cameroun
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CTA CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280 }} className="contact-cta">
          <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`}
            style={{
              textDecoration: "none", display: "flex", flexDirection: "column",
              justifyContent: "space-between", padding: "3rem 2.5rem",
              borderRight: rule, background: "#0D1B2A", color: "#FAFAF8",
              transition: "background 0.25s", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#1565C0"}
            onMouseLeave={e => e.currentTarget.style.background = "#0D1B2A"}
          >
            {/* SVG as large faded watermark in corner */}
            <img src={iconPhone} alt="" aria-hidden="true"
              style={{
                position: "absolute", bottom: -24, right: -24,
                width: 180, height: 180, objectFit: "contain",
                opacity: 0.07, filter: "brightness(0) invert(1)",
                pointerEvents: "none",
              }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Action rapide</div>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "0.875rem" }}>
                APPELER<br />MAINTENANT
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.64rem", color: "rgba(255,255,255,0.5)" }}>
                <Phone size={12} strokeWidth={1.5} /> {CONTACT.phones[0]}
              </div>
            </div>
            <ArrowRight size={18} style={{ alignSelf: "flex-end", opacity: 0.5 }} />
          </a>

          <a href={`mailto:${CONTACT.emails[0]}?subject=STUD 2026 — Partenariat`}
            style={{
              textDecoration: "none", display: "flex", flexDirection: "column",
              justifyContent: "space-between", padding: "3rem 2.5rem",
              background: "#F57C00", color: "#FAFAF8",
              transition: "background 0.25s", position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#E65100"}
            onMouseLeave={e => e.currentTarget.style.background = "#F57C00"}
          >
            <img src={iconEmail} alt="" aria-hidden="true"
              style={{
                position: "absolute", bottom: -24, right: -24,
                width: 180, height: 180, objectFit: "contain",
                opacity: 0.1, filter: "brightness(0) invert(1)",
                pointerEvents: "none",
              }} />
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Email</div>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "0.875rem" }}>
                NOUS<br />ÉCRIRE
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.65)", wordBreak: "break-all" }}>
                <Mail size={12} strokeWidth={1.5} style={{ flexShrink: 0 }} /> {CONTACT.emails[0]}
              </div>
            </div>
            <ArrowRight size={18} style={{ alignSelf: "flex-end", opacity: 0.6 }} />
          </a>
        </div>

        {/* ── INFO STRIP ── */}
        <div style={{
          padding: "2.5rem 2.5rem", borderTop: rule,
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem"
        }} className="info-grid">
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.18em", color: "#88887F", textTransform: "uppercase", marginBottom: "0.65rem" }}>Événement</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem" }}>STUD 2026 — {META.dates}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.18em", color: "#88887F", textTransform: "uppercase", marginBottom: "0.65rem" }}>Thème</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#555550" }}>«{META.theme}»</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.18em", color: "#88887F", textTransform: "uppercase", marginBottom: "0.65rem" }}>Haut Patronage</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem" }}>{META.patron}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .contact-cta { grid-template-columns: 1fr !important; }
          .contact-cta > a:first-child { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.12); }
          .info-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .addr-grid { grid-template-columns: 1fr !important; }
          .addr-grid > div:first-child { border-right: none !important; border-bottom: 1px solid rgba(10,10,10,0.12); min-height: 160px; }
        }
        @media (max-width: 480px) {
          .contact-cta > a { padding: 2rem 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}