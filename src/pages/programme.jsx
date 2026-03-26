import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { PROGRAM } from "../data";
import { Calendar, X, Users, ChevronRight, MapPin } from "lucide-react";

const CATEGORY_IMAGES = {
  sports:        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=90",
  jeux:          "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=900&q=90",
  culturelles:   "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&q=90",
  festivals:     "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=900&q=90",
  scientifiques: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&q=90",
  social:        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=90",
  pointsforts:   "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=90",
  ceremonies:    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&q=90",
};

/* ══════════════════════════════════════════════════════════════
   MODAL — editorial magazine redesign
══════════════════════════════════════════════════════════════ */
function Modal({ cat, catKey, onClose }) {
  const imgSrc = CATEGORY_IMAGES[catKey];

  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes __backdropIn { from{opacity:0} to{opacity:1} }
        @keyframes __panelIn    { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:none} }
        @keyframes __rowIn      { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }
        .__row { animation: __rowIn 0.35s cubic-bezier(0.16,1,0.3,1) both; }
        .__row:nth-child(1){animation-delay:.08s}
        .__row:nth-child(2){animation-delay:.13s}
        .__row:nth-child(3){animation-delay:.18s}
        .__row:nth-child(4){animation-delay:.23s}
        .__row:nth-child(5){animation-delay:.28s}
        .__row:nth-child(6){animation-delay:.33s}
        .__row:nth-child(7){animation-delay:.38s}
        .__row:nth-child(8){animation-delay:.43s}
        .__row:hover .__row-inner { background: #f7f6f3 !important; }
        .__closebtn:hover { opacity: 0.7; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(10,10,10,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: "1.25rem",
          backdropFilter: "blur(10px)",
          animation: "__backdropIn 0.2s ease",
        }}
      >
        {/* ── Panel ── */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%", maxWidth: 560,
            maxHeight: "90vh",
            display: "flex", flexDirection: "column",
            borderRadius: 24,
            overflow: "hidden",
            background: "#fff",
            animation: "__panelIn 0.3s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >

          {/* ── HEADER: color strip + image ── */}
          <div style={{ position: "relative", flexShrink: 0 }}>

            {/* Thick color band at very top */}
            <div style={{ height: 6, background: cat.color, width: "100%" }} />

            {/* Image */}
            <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
              <img
                src={imgSrc}
                alt={cat.label}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  display: "block", filter: "brightness(0.72) saturate(1.1)",
                }}
              />
              {/* bottom fade to white */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.18) 60%, rgba(255,255,255,0.0) 100%)",
              }} />

              {/* Close */}
              <button
                className="__closebtn"
                onClick={onClose}
                style={{
                  position: "absolute", top: 14, right: 14,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.92)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "opacity 0.15s",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                }}
              >
                <X size={15} strokeWidth={2.5} color="#111" />
              </button>
            </div>

            {/* ── Title block sits below image, on white ── */}
            <div style={{
              padding: "20px 28px 18px",
              borderBottom: "1px solid #f0eeea",
            }}>
              {/* Label pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, fontWeight: 500,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  color: cat.color,
                  background: `${cat.color}14`,
                  borderRadius: 4, padding: "4px 10px",
                }}>
                  {cat.emoji} {cat.label}
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, color: "#bbb", letterSpacing: "0.05em",
                }}>
                  {cat.items.length} activité{cat.items.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Big editorial title */}
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 26, fontWeight: 700,
                color: "#0a0a0a", margin: "0 0 12px",
                lineHeight: 1.2, letterSpacing: "-0.01em",
              }}>
                Activités {cat.label}
              </h2>

              {/* Meta row */}
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, color: "#888",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <Calendar size={11} style={{ color: cat.color }} />
                  24 – 30 Avril 2026
                </span>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, color: "#888",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <MapPin size={11} style={{ color: cat.color }} />
                  Université de Douala
                </span>
              </div>
            </div>
          </div>

          {/* ── SCROLLABLE ACTIVITY LIST ── */}
          <div style={{ overflowY: "auto", flex: 1, padding: "16px 20px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {cat.items.map((item, i) => (
                <div key={i} className="__row">
                  <div
                    className="__row-inner"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr auto",
                      gap: "0 14px",
                      alignItems: "start",
                      padding: "14px 12px",
                      borderRadius: 12,
                      transition: "background 0.15s",
                      background: "transparent",
                    }}
                  >
                    {/* Index number */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: `${cat.color}12`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <span style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 16, fontWeight: 700, color: cat.color,
                        lineHeight: 1,
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ minWidth: 0 }}>
                      <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 14, fontWeight: 500,
                        color: "#111", margin: "0 0 3px",
                        lineHeight: 1.35,
                      }}>
                        {item.name}
                      </p>
                      {item.description && (
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 12, fontWeight: 300,
                          color: "#777", margin: "0 0 4px",
                          lineHeight: 1.6,
                        }}>
                          {item.description}
                        </p>
                      )}
                      {item.details && (
                        <p style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 11, color: "#aaa",
                          margin: 0, lineHeight: 1.5,
                          display: "flex", alignItems: "flex-start", gap: 4,
                        }}>
                          <Users size={9} style={{ flexShrink: 0, marginTop: 3, color: cat.color }} />
                          {item.details}
                        </p>
                      )}
                    </div>

                    {/* Date badge */}
                    {item.date && (
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10, fontWeight: 500,
                        color: cat.color,
                        background: `${cat.color}10`,
                        border: `1px solid ${cat.color}25`,
                        borderRadius: 6,
                        padding: "4px 8px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        textAlign: "center",
                        lineHeight: 1.4,
                        marginTop: 2,
                      }}>
                        {item.date}
                      </div>
                    )}
                  </div>

                  {/* Divider — not after last item */}
                  {i < cat.items.length - 1 && (
                    <div style={{ height: 1, background: "#f3f2ef", margin: "0 12px" }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── FOOTER ── */}
          <div style={{
            padding: "14px 24px",
            background: "#fafaf8",
            borderTop: "1px solid #f0eeea",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, color: "#ccc", margin: 0,
            }}>
              Horaires confirmés par voie officielle
            </p>
            <button
              onClick={onClose}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 500,
                color: "#fff", background: "#111",
                border: "none", borderRadius: 10,
                padding: "9px 22px", cursor: "pointer",
                transition: "background 0.15s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = cat.color)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#111")}
            >
              Fermer
            </button>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
}

/* ══════════════════════════════════════════════════════════════
   FILTER PILLS
══════════════════════════════════════════════════════════════ */
function FilterBar({ categories, activeFilter, onFilter }) {
  return (
    <div style={{ position: "relative", marginBottom: "1.75rem" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 28,
        background: "linear-gradient(to right, #fafaf8, transparent)",
        zIndex: 1, pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 28,
        background: "linear-gradient(to left, #fafaf8, transparent)",
        zIndex: 1, pointerEvents: "none",
      }} />
      <div style={{
        display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2,
        scrollbarWidth: "none",
      }}>
        <button
          onClick={() => onFilter(null)}
          style={{
            flexShrink: 0, fontSize: 12, fontWeight: 500,
            padding: "7px 16px", borderRadius: 99,
            border: activeFilter === null ? "1.5px solid #111" : "0.5px solid rgba(0,0,0,0.13)",
            background: activeFilter === null ? "#111" : "#fff",
            color: activeFilter === null ? "#fff" : "#555",
            cursor: "pointer", transition: "all 0.18s ease",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Tout voir
        </button>
        {categories.map(([key, cat]) => {
          const active = activeFilter === key;
          return (
            <button key={key} onClick={() => onFilter(active ? null : key)} style={{
              flexShrink: 0, fontSize: 12, fontWeight: 500,
              padding: "7px 14px", borderRadius: 99,
              border: active ? `1.5px solid ${cat.color}` : "0.5px solid rgba(0,0,0,0.12)",
              background: active ? cat.color : "#fff",
              color: active ? "#fff" : "#555",
              cursor: "pointer", transition: "all 0.18s ease",
              display: "flex", alignItems: "center", gap: 5,
              fontFamily: "system-ui, sans-serif",
            }}>
              <span style={{ fontSize: 13 }}>{cat.emoji}</span>
              {cat.label}
              {active && (
                <span style={{
                  fontSize: 10, background: "rgba(255,255,255,0.25)",
                  borderRadius: 99, padding: "1px 5px",
                }}>
                  {cat.items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CARD
══════════════════════════════════════════════════════════════ */
function CategoryCard({ catKey, cat, onOpen }) {
  const imgSrc = CATEGORY_IMAGES[catKey];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", border: "0.5px solid rgba(0,0,0,0.09)",
        borderRadius: 14, overflow: "hidden",
        display: "flex", flexDirection: "column", cursor: "pointer",
        transition: "transform 0.22s cubic-bezier(0.16,1,0.3,1), box-shadow 0.22s ease",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 14px 40px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ height: 4, background: cat.color }} />
        <img src={imgSrc} alt={cat.label} loading="lazy"
          style={{
            width: "100%", height: 140, objectFit: "cover", display: "block",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            filter: "brightness(0.82)",
          }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.52) 100%)",
        }} />
        <span style={{
          position: "absolute", bottom: 12, left: 12,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", color: "#fff",
          background: "rgba(0,0,0,0.38)", border: "0.5px solid rgba(255,255,255,0.15)",
          backdropFilter: "blur(4px)", borderRadius: 6, padding: "4px 10px",
        }}>
          {cat.emoji} {cat.label}
        </span>
      </div>

      <div style={{ padding: "12px 13px 13px", flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {cat.items.slice(0, 3).map((item, i) => (
            <span key={i} style={{
              fontSize: 11.5, color: "#666", background: "#f4f3f0",
              border: "0.5px solid rgba(0,0,0,0.07)", borderRadius: 5, padding: "3px 8px",
            }}>
              {item.name}
            </span>
          ))}
          {cat.items.length > 3 && (
            <span style={{
              fontSize: 11.5, color: "#bbb", background: "#f9f8f5",
              border: "0.5px solid rgba(0,0,0,0.06)", borderRadius: 5, padding: "3px 8px",
            }}>
              +{cat.items.length - 3}
            </span>
          )}
        </div>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 8, borderTop: "0.5px solid #f0eeea", marginTop: "auto",
        }}>
          <span style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cat.color, display: "inline-block" }} />
            {cat.items.length} activité{cat.items.length > 1 ? "s" : ""}
          </span>
          <span style={{
            fontSize: 12, color: hovered ? cat.color : "#ccc",
            display: "flex", alignItems: "center", gap: 3,
            fontWeight: 500, transition: "color 0.18s",
          }}>
            Voir <ChevronRight size={12} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function Programme() {
  const [activeKey, setActiveKey] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const catEntries = Object.entries(PROGRAM);
  const filtered = activeFilter ? catEntries.filter(([key]) => key === activeFilter) : catEntries;
  const totalActivities = catEntries.reduce((acc, [, cat]) => acc + cat.items.length, 0);
  const activeEntry = activeKey ? [activeKey, PROGRAM[activeKey]] : null;

  return (
    <>
      <style>{`
        ::-webkit-scrollbar { display: none; }
        @keyframes gridIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .grid-card { animation: gridIn 0.3s ease both; }
        ${filtered.map((_, i) => `.grid-card:nth-child(${i + 1}){animation-delay:${i * 0.045}s}`).join("\n")}
      `}</style>

      <div style={{ background: "#fafaf8", minHeight: "100vh", paddingTop: 64, fontFamily: "system-ui,-apple-system,sans-serif" }}>

        {/* Header */}
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "2.25rem 1.5rem 1.5rem",
          marginBottom: "1.75rem",
          borderBottom: "0.5px solid rgba(0,0,0,0.07)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 600, color: "#0a0a0a", margin: "0 0 5px", letterSpacing: "-0.03em" }}>
                Programme
              </h1>
              <p style={{ fontSize: 13, color: "#999", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={12} /> 24 – 30 Avril 2026 &nbsp;·&nbsp; Université de Douala
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[`${catEntries.length} catégories`, `${totalActivities} activités`].map((t, i) => (
                <span key={i} style={{
                  fontSize: 12, color: "#555", fontWeight: 500,
                  background: "#fff", border: "0.5px solid rgba(0,0,0,0.11)",
                  borderRadius: 99, padding: "6px 14px",
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
          <FilterBar categories={catEntries} activeFilter={activeFilter} onFilter={setActiveFilter} />
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 4rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(265px, 1fr))", gap: 18 }}>
            {filtered.map(([key, cat]) => (
              <div key={key} className="grid-card">
                <CategoryCard catKey={key} cat={cat} onOpen={() => setActiveKey(key)} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeEntry && (
        <Modal catKey={activeEntry[0]} cat={activeEntry[1]} onClose={() => setActiveKey(null)} />
      )}
    </>
  );
}