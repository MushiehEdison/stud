// ============================================================
// FacultyStrip.jsx — Ils Prennent Part
// Établissements de l'Université de Douala
//
// Logo strategy:
//   - Real <img> where a verified URL exists
//   - Text-only badge (abbr + full name) for the rest
//
// Place in home.jsx: AFTER Gallery Preview, BEFORE Announcements
// ============================================================

import { useState } from "react";

const FACULTIES = [
  {
    abbr: "ENSET",
    name: "École Normale Sup. d'Enseignement Technique",
    color: "#33691E",
    logoUrl: "https://enset-douala.cm/wp-content/uploads/2025/07/LOGO-ENSET-UNIVERSITE-DOUALA-400x89.png",
  },
  {
    abbr: "FMSP",
    name: "Médecine & Sciences Pharmaceutiques",
    color: "#880E4F",
    logoUrl: "https://www.fmsp-udo.cm/upload/images/compagny/Logo%20FMSP.png",
  },
  {
    abbr: "FLSH",
    name: "Lettres & Sciences Humaines",
    color: "#7B3F99",
    logoUrl: null,
  },
  {
    abbr: "FS",
    name: "Faculté des Sciences",
    color: "#1565C0",
    logoUrl: null,
  },
  {
    abbr: "FSJP",
    name: "Sciences Juridiques & Politiques",
    color: "#B71C1C",
    logoUrl: null,
  },
  {
    abbr: "FSEGA",
    name: "Sciences Éco. & de Gestion Appliquée",
    color: "#E65100",
    logoUrl: null,
  },
  {
    abbr: "ENSPD",
    name: "École Nationale Sup. Polytechnique",
    color: "#004D40",
    logoUrl: null,
  },
  {
    abbr: "IUT",
    name: "Institut Univ. de Technologie",
    color: "#01579B",
    logoUrl: null,
  },
  {
    abbr: "ESSEC",
    name: "Sciences Éco. & Commerciales",
    color: "#F57C00",
    logoUrl: null,
  },
  {
    abbr: "IBA",
    name: "Institut des Beaux-Arts",
    color: "#6A1B9A",
    logoUrl: null,
  },
  {
    abbr: "ISH",
    name: "Institut des Sciences Halieutiques",
    color: "#00695C",
    logoUrl: null,
  },
];

// 4× repeat for seamless loop
const TRACK = [...FACULTIES, ...FACULTIES, ...FACULTIES, ...FACULTIES];

const CSS = `
  .fac-section {
    border-bottom: 1px solid rgba(10,10,10,0.12);
    background: #FAFAF8;
    overflow: hidden;
  }
  .fac-hdr {
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
  .fac-hdr-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.75rem;
    letter-spacing: 0.06em;
    color: #0A0A0A;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .fac-hdr-title span { color: #1565C0; }
  .fac-hdr-sub {
    font-family: 'DM Mono', monospace;
    font-size: 0.54rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #88887F;
  }

  .fac-strip {
    position: relative;
    padding: 2rem 0;
    overflow: hidden;
  }
  .fac-strip::before,
  .fac-strip::after {
    content: '';
    position: absolute; top: 0; bottom: 0;
    width: 100px; z-index: 2; pointer-events: none;
  }
  .fac-strip::before { left: 0;  background: linear-gradient(to right, #FAFAF8, transparent); }
  .fac-strip::after  { right: 0; background: linear-gradient(to left,  #FAFAF8, transparent); }

  .fac-track {
    display: flex;
    align-items: center;
    width: max-content;
    animation: fac-scroll 70s linear infinite;
  }
  .fac-track:hover { animation-play-state: paused; }
  @keyframes fac-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .fac-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0 2.25rem;
    position: relative;
    cursor: default;
    transition: transform 0.3s ease;
  }
  .fac-card::after {
    content: '';
    position: absolute; right: 0; top: 10%; bottom: 10%;
    width: 1px; background: rgba(10,10,10,0.07);
  }
  .fac-card:hover { transform: translateY(-4px); }

  /* real logo */
  .fac-img-wrap {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: grayscale(55%) opacity(0.65);
    transition: filter 0.35s ease, transform 0.35s ease;
  }
  .fac-img-wrap img {
    max-height: 80px;
    max-width: 200px;
    width: auto;
    object-fit: contain;
    display: block;
  }
  .fac-card:hover .fac-img-wrap {
    filter: grayscale(0%) opacity(1);
    transform: scale(1.06);
  }

  /* text badge */
  .fac-text-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.7rem 1.25rem;
    border: 1.5px solid currentColor;
    min-width: 110px;
    min-height: 80px;
    opacity: 0.45;
    transition: opacity 0.35s ease, transform 0.35s ease;
  }
  .fac-card:hover .fac-text-badge {
    opacity: 1;
    transform: scale(1.05);
  }
  .fac-text-badge-abbr {
    font-family: 'Bebas Neue', 'Arial Black', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 0.06em;
    line-height: 1;
  }
  .fac-text-badge-name {
    font-family: 'DM Mono', monospace;
    font-size: 0.42rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    margin-top: 5px;
    line-height: 1.5;
    max-width: 110px;
  }

  .fac-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.46rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(10,10,10,0.3);
    text-align: center;
    transition: color 0.3s;
    white-space: nowrap;
  }
  .fac-card:hover .fac-label { color: #0A0A0A; }

  @media (max-width: 768px) {
    .fac-hdr { padding: 1.25rem 1.5rem; }
    .fac-card { padding: 0 1.5rem; }
    .fac-strip::before,
    .fac-strip::after { width: 50px; }
  }
`;

function FacultyCard({ fac }) {
  const [imgError, setImgError] = useState(false);
  const showImg = fac.logoUrl && !imgError;

  return (
    <div className="fac-card">
      {showImg ? (
        <div className="fac-img-wrap">
          <img
            src={fac.logoUrl}
            alt={fac.abbr}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className="fac-text-badge"
          style={{ color: fac.color, borderColor: fac.color }}
        >
          <span className="fac-text-badge-abbr">{fac.abbr}</span>
          <span className="fac-text-badge-name">{fac.name}</span>
        </div>
      )}
      <span className="fac-label">{fac.abbr}</span>
    </div>
  );
}

export default function FacultyStrip() {
  return (
    <section className="fac-section">
      <style>{CSS}</style>

      <div className="fac-hdr">
        <h2 className="fac-hdr-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#1565C0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12,2 22,8.5 12,15 2,8.5"/>
            <polyline points="6,11.5 6,17 12,20 18,17 18,11.5"/>
          </svg>
          Ils Prennent <span>&nbsp;Part</span>
        </h2>
        <span className="fac-hdr-sub">Établissements — Université de Douala</span>
      </div>

      <div className="fac-strip">
        <div className="fac-track">
          {TRACK.map((fac, i) => (
            <FacultyCard key={`${fac.abbr}-${i}`} fac={fac} />
          ))}
        </div>
      </div>
    </section>
  );
}