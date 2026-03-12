// ============================================================
// PartnersMarquee.jsx — Corporate sponsors only
// Partners: PAD · TRADEX · BOSSION DU CAMEROUN · ORANGE
// ============================================================

// ── Import your logo files here (Vite requires static imports) ──
import logoPad     from "../assets/pad.png";
import logoTradex  from "../assets/tradex.png";
import logoBossion from "../assets/bdc.webp";
import logoOrange  from "../assets/orange.webp";

const PARTNERS = [
  { name: "Port Autonome de Douala", short: "PAD",    logo: logoPad     },
  { name: "Tradex",                  short: "TRADEX", logo: logoTradex  },
  { name: "Brasseries du Cameroun",  short: "BOSSION",logo: logoBossion },
  { name: "Orange Cameroun",         short: "ORANGE", logo: logoOrange  },
];

// Repeat 4× so the track looks full at any screen width
const TRACK_ITEMS = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

const CSS = `
  /* ── wrapper ── */
  .mq-section {
    border-bottom: 1px solid rgba(10,10,10,0.12);
    background: #FAFAF8;
    overflow: hidden;
  }

  /* ── header ── */
  .mq-hdr {
    max-width: 1280px;
    margin: 0 auto;
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid rgba(10,10,10,0.12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .mq-hdr-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.75rem;
    letter-spacing: 0.06em;
    color: #0A0A0A;
  }
  .mq-hdr-title span { color: #1565C0; }
  .mq-hdr-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.54rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #88887F;
  }

  /* ── scroll strip ── */
  .mq-strip {
    position: relative;
    padding: 2.5rem 0;
    overflow: hidden;
  }

  /* soft fade on both edges */
  .mq-strip::before,
  .mq-strip::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 140px;
    z-index: 2;
    pointer-events: none;
  }
  .mq-strip::before {
    left: 0;
    background: linear-gradient(to right, #FAFAF8 0%, transparent 100%);
  }
  .mq-strip::after {
    right: 0;
    background: linear-gradient(to left, #FAFAF8 0%, transparent 100%);
  }

  /* ── animated track ── */
  .mq-track {
    display: flex;
    align-items: center;
    width: max-content;
    animation: mq-scroll 30s linear infinite;
    gap: 0;
  }
  .mq-track:hover {
    animation-play-state: paused;
  }
  @keyframes mq-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* ── single partner card ── */
  .mq-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
    padding: 0 3.5rem;
    position: relative;
    cursor: default;
    transition: transform 0.3s ease;
    min-width: 180px;
  }

  /* vertical divider between cards */
  .mq-card::after {
    content: '';
    position: absolute;
    right: 0;
    top: 15%;
    bottom: 15%;
    width: 1px;
    background: rgba(10,10,10,0.08);
  }

  .mq-card:hover {
    transform: translateY(-4px);
  }

  /* ── logo image box ── */
  .mq-logo-box {
    width: 100px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .mq-logo-box img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
    filter: grayscale(100%) opacity(0.45);
    transition: filter 0.4s ease, transform 0.4s ease;
    display: block;
  }

  .mq-card:hover .mq-logo-box img {
    filter: grayscale(0%) opacity(1);
    transform: scale(1.07);
  }

  /* ── text fallback (shown when image fails to load) ── */
  .mq-fallback {
    display: none;
    width: 80px;
    height: 48px;
    border: 1.5px solid rgba(10,10,10,0.1);
    align-items: center;
    justify-content: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: rgba(10,10,10,0.25);
    background: rgba(10,10,10,0.02);
    transition: border-color 0.3s, color 0.3s, background 0.3s;
  }
  .mq-card:hover .mq-fallback {
    border-color: #1565C0;
    color: #1565C0;
    background: #EEF4FF;
  }

  /* ── partner name label ── */
  .mq-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.5rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(10,10,10,0.3);
    text-align: center;
    white-space: nowrap;
    transition: color 0.3s;
  }
  .mq-card:hover .mq-label {
    color: #0A0A0A;
  }

  /* ── responsive ── */
  @media (max-width: 768px) {
    .mq-hdr { padding: 1.25rem 1.5rem; }
    .mq-card { min-width: 140px; padding: 0 2.5rem; }
    .mq-logo-box { width: 80px; height: 44px; }
    .mq-strip::before,
    .mq-strip::after { width: 60px; }
  }
`;

function PartnerCard({ partner }) {
  const handleImgError = (e) => {
    e.target.style.display = "none";
    const fallback = e.target.nextElementSibling;
    if (fallback) fallback.style.display = "flex";
  };

  return (
    <div className="mq-card">
      <div className="mq-logo-box">
        <img
          src={partner.logo}
          alt={partner.name}
          onError={handleImgError}
        />
        <div className="mq-fallback">{partner.short}</div>
      </div>
      <span className="mq-label">{partner.name}</span>
    </div>
  );
}

export default function PartnersMarquee() {
  return (
    <section className="mq-section">
      <style>{CSS}</style>

      <div className="mq-hdr">
        <h2 className="mq-hdr-title">
          Nos <span>Partenaires</span>
        </h2>
        <span className="mq-hdr-sub">STUD 2026 — Partenaires Officiels</span>
      </div>

      <div className="mq-strip">
        <div className="mq-track">
          {TRACK_ITEMS.map((partner, i) => (
            <PartnerCard key={`${partner.short}-${i}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
}