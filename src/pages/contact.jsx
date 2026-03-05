import { useState } from "react";
import { Phone, Mail, MapPin, Copy, Check, ArrowRight } from "lucide-react";
import { CONTACT, META } from "../data";

export default function Contact() {
  const [copied, setCopied] = useState(null);
  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ background: "#FAFAF7", paddingTop: 62 }}>

      {/* Page title */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
          NOS<br /><span style={{ color: "#C8102E" }}>CONTACTS</span>
        </h1>
        <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1rem", color: "#666660", maxWidth: 340, textAlign: "right" }}>
          Notre équipe répond à toutes vos questions sur la STUD 2026 et les opportunités de partenariat.
        </p>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Phones */}
        <div style={{ borderBottom: "1.5px solid #0F0F0F" }}>
          <div style={{ padding: "0.9rem 2rem", borderBottom: "1px solid #E8E8E3", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Phone size={14} color="#C8102E" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase" }}>Téléphones — {CONTACT.phones.length} numéros</span>
          </div>
          {CONTACT.phones.map((phone, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.4rem 2rem",
              borderBottom: i < CONTACT.phones.length - 1 ? "1px solid #E8E8E3" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F5F5F2"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#C8102E", letterSpacing: "0.1em", width: 22 }}>0{i + 1}</span>
                <a href={`tel:${phone.replace(/\s/g, "")}`} style={{
                  textDecoration: "none",
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.3rem, 3vw, 2rem)",
                  letterSpacing: "0.04em", color: "#0F0F0F", transition: "color 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C8102E"}
                  onMouseLeave={e => e.currentTarget.style.color = "#0F0F0F"}
                >{phone}</a>
              </div>
              <button onClick={() => copy(phone, `p${i}`)} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: copied === `p${i}` ? "#0F0F0F" : "transparent",
                border: "1.5px solid #0F0F0F", cursor: "pointer",
                padding: "0.4rem 0.9rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: copied === `p${i}` ? "#FAFAF7" : "#0F0F0F",
                transition: "all 0.2s",
              }}>
                {copied === `p${i}` ? <Check size={12} /> : <Copy size={12} />}
                {copied === `p${i}` ? "Copié" : "Copier"}
              </button>
            </div>
          ))}
        </div>

        {/* Emails */}
        <div style={{ borderBottom: "1.5px solid #0F0F0F" }}>
          <div style={{ padding: "0.9rem 2rem", borderBottom: "1px solid #E8E8E3", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Mail size={14} color="#C8102E" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase" }}>Adresses Email</span>
          </div>
          {CONTACT.emails.map((email, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.4rem 2rem", flexWrap: "wrap", gap: "1rem",
              borderBottom: i < CONTACT.emails.length - 1 ? "1px solid #E8E8E3" : "none",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#F5F5F2"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#C8102E", letterSpacing: "0.1em", width: 22 }}>0{i + 1}</span>
                <a href={`mailto:${email}`} style={{
                  textDecoration: "none",
                  fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem",
                  color: "#0F0F0F", transition: "color 0.15s", wordBreak: "break-all",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = "#C8102E"}
                  onMouseLeave={e => e.currentTarget.style.color = "#0F0F0F"}
                >{email}</a>
              </div>
              <button onClick={() => copy(email, `e${i}`)} style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                background: copied === `e${i}` ? "#0F0F0F" : "transparent",
                border: "1.5px solid #0F0F0F", cursor: "pointer",
                padding: "0.4rem 0.9rem",
                fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: copied === `e${i}` ? "#FAFAF7" : "#0F0F0F",
                transition: "all 0.2s",
              }}>
                {copied === `e${i}` ? <Check size={12} /> : <Copy size={12} />}
                {copied === `e${i}` ? "Copié" : "Copier"}
              </button>
            </div>
          ))}
        </div>

        {/* Address */}
        <div style={{ borderBottom: "1.5px solid #0F0F0F" }}>
          <div style={{ padding: "0.9rem 2rem", borderBottom: "1px solid #E8E8E3", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <MapPin size={14} color="#C8102E" />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#999990", textTransform: "uppercase" }}>Adresse</span>
          </div>
          <div style={{ padding: "1.75rem 2rem" }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Université de Douala</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "#666660", lineHeight: 1.8 }}>
              Campus 1 — Ange Raphaël<br />
              Campus 2 — Ndogbong<br />
              Campus 3 — Logbessou<br />
              Douala, Cameroun
            </div>
          </div>
        </div>

        {/* CTA blocks */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 260 }} className="contact-cta">
          <a href={`tel:${CONTACT.phones[0].replace(/\s/g, "")}`} style={{
            textDecoration: "none", display: "flex", flexDirection: "column",
            justifyContent: "space-between", padding: "3rem 2.5rem",
            borderRight: "1.5px solid #0F0F0F",
            background: "#0F0F0F", color: "#FAFAF7",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#C8102E"}
            onMouseLeave={e => e.currentTarget.style.background = "#0F0F0F"}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>Action rapide</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "0.75rem" }}>
                APPELER<br />MAINTENANT
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.5)" }}>
                <Phone size={13} /> {CONTACT.phones[0]}
              </div>
            </div>
            <ArrowRight size={20} style={{ alignSelf: "flex-end" }} />
          </a>

          <a href={`mailto:${CONTACT.emails[0]}?subject=STUD 2026 — Partenariat`} style={{
            textDecoration: "none", display: "flex", flexDirection: "column",
            justifyContent: "space-between", padding: "3rem 2.5rem",
            background: "#C8102E", color: "#FAFAF7",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#0F0F0F"}
            onMouseLeave={e => e.currentTarget.style.background = "#C8102E"}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>Email</div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "0.75rem" }}>
                NOUS<br />ÉCRIRE
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", wordBreak: "break-all" }}>
                <Mail size={13} style={{ flexShrink: 0 }} /> {CONTACT.emails[0]}
              </div>
            </div>
            <ArrowRight size={20} style={{ alignSelf: "flex-end" }} />
          </a>
        </div>

        {/* Event info footer */}
        <div style={{ padding: "2.5rem 2rem", borderTop: "1.5px solid #0F0F0F", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }} className="info-grid">
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#999990", textTransform: "uppercase", marginBottom: "0.65rem" }}>Événement</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem" }}>STUD 2026 — {META.dates}</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#999990", textTransform: "uppercase", marginBottom: "0.65rem" }}>Thème</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#555550" }}>«{META.theme}»</div>
          </div>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: "#999990", textTransform: "uppercase", marginBottom: "0.65rem" }}>Haut Patronage</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.9rem" }}>{META.patron}</div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          .contact-cta { grid-template-columns: 1fr !important; }
          .contact-cta > a:first-child { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .info-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}