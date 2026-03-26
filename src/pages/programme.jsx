import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PROGRAM } from "../data";
import { Calendar, X, Users } from "lucide-react";

const CATEGORY_IMAGES = {
  sports:        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  jeux:          "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=600&q=80",
  culturelles:   "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
  festivals:     "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
  scientifiques: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&q=80",
  social:        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80",
  pointsforts:   "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  ceremonies:    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&q=80",
};

/* ── Modal ─────────────────────────────────────────────────── */
function Modal({ cat, catKey, onClose }) {
  const imgSrc = CATEGORY_IMAGES[catKey];

  // close on Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        backdropFilter: "blur(2px)",
        animation: "fadeIn 0.18s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          overflow: "hidden",
          width: "100%",
          maxWidth: 520,
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          animation: "slideUp 0.22s ease",
          boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        }}
      >
        {/* hero image + close */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {imgSrc && (
            <img
              src={imgSrc}
              alt={cat.label}
              style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
            />
          )}
          {/* gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)",
          }} />
          {/* category label on image */}
          <div style={{
            position: "absolute", bottom: 14, left: 16,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{
              fontSize: 13, fontWeight: 500, color: "#fff",
              background: cat.color, borderRadius: 20,
              padding: "3px 10px",
            }}>
              {cat.emoji} {cat.label}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)" }}>
              {cat.items.length} activité{cat.items.length > 1 ? "s" : ""}
            </span>
          </div>
          {/* close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 12, right: 12,
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,0,0,0.4)", border: "none",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.65)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.4)")}
          >
            <X size={16} />
          </button>
        </div>

        {/* scrollable content */}
        <div style={{ overflowY: "auto", flex: 1, padding: "1.25rem 1.5rem" }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, color: "#0a0a0a", margin: "0 0 1rem" }}>
            Activités {cat.label}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {cat.items.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "#fafaf8",
                  border: "0.5px solid rgba(0,0,0,0.08)",
                  borderRadius: 10,
                  padding: "12px 14px",
                  borderLeft: `3px solid ${cat.color}`,
                }}
              >
                <div style={{
                  display: "flex", alignItems: "flex-start",
                  justifyContent: "space-between", gap: 8, marginBottom: 5,
                }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "#0a0a0a" }}>
                    {item.name}
                  </span>
                  <span style={{
                    fontSize: 11, color: cat.color,
                    background: `${cat.color}15`,
                    borderRadius: 20, padding: "2px 8px",
                    whiteSpace: "nowrap", flexShrink: 0,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Calendar size={10} />
                    {item.date}
                  </span>
                </div>
                {item.description && (
                  <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                )}
                {item.details && (
                  <p style={{
                    fontSize: 11, color: "#999", lineHeight: 1.5,
                    margin: "6px 0 0",
                    display: "flex", alignItems: "flex-start", gap: 4,
                  }}>
                    <Users size={10} style={{ flexShrink: 0, marginTop: 2 }} />
                    {item.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* sticky footer */}
        <div style={{
          padding: "0.875rem 1.5rem",
          borderTop: "0.5px solid rgba(0,0,0,0.08)",
          display: "flex", justifyContent: "flex-end",
          flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              fontSize: 13, fontWeight: 500,
              color: "#fff", background: cat.color,
              border: "none", borderRadius: 8,
              padding: "8px 20px", cursor: "pointer",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Card ───────────────────────────────────────────────────── */
function CategoryCard({ catKey, cat, onOpen }) {
  const imgSrc = CATEGORY_IMAGES[catKey];

  return (
    <div
      style={{
        background: "#fff",
        border: "0.5px solid rgba(0,0,0,0.1)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.2s",
      }}
      onClick={onOpen}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      {imgSrc && (
        <div style={{ position: "relative" }}>
          <img
            src={imgSrc}
            alt={cat.label}
            loading="lazy"
            style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
          }} />
          <span style={{
            position: "absolute", bottom: 10, left: 12,
            fontSize: 12, fontWeight: 500, color: "#fff",
            background: cat.color, borderRadius: 20, padding: "2px 9px",
          }}>
            {cat.emoji} {cat.label}
          </span>
        </div>
      )}

      <div style={{ padding: "0.875rem 1rem", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#0a0a0a" }}>
          Activités {cat.label}
        </div>

        {/* preview pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {cat.items.slice(0, 3).map((item, i) => (
            <span key={i} style={{
              fontSize: 11, color: "#666",
              background: "#f5f4f0",
              border: "0.5px solid rgba(0,0,0,0.07)",
              borderRadius: 4, padding: "2px 7px",
            }}>
              {item.name}
            </span>
          ))}
          {cat.items.length > 3 && (
            <span style={{ fontSize: 11, color: "#aaa", padding: "2px 4px" }}>
              +{cat.items.length - 3}
            </span>
          )}
        </div>

        {/* footer */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", marginTop: "auto",
        }}>
          <span style={{
            fontSize: 11, color: "#888",
            background: "#f5f4f0",
            border: "0.5px solid rgba(0,0,0,0.08)",
            borderRadius: 20, padding: "2px 8px",
          }}>
            {cat.items.length} activité{cat.items.length > 1 ? "s" : ""}
          </span>
          <span style={{
            fontSize: 12, color: cat.color, fontWeight: 500,
            display: "flex", alignItems: "center", gap: 3,
          }}>
            Voir tout
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function Programme() {
  const [activeKey, setActiveKey] = useState(null);
  const catEntries = Object.entries(PROGRAM);
  const totalActivities = catEntries.reduce((acc, [, cat]) => acc + cat.items.length, 0);
  const activeEntry = activeKey ? [activeKey, PROGRAM[activeKey]] : null;

  return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", paddingTop: 64, fontFamily: "system-ui, sans-serif" }}>

      {/* header */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "2rem 1.5rem 1.5rem",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        marginBottom: "1.5rem",
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 500, color: "#0a0a0a", margin: 0 }}>Programme</h1>
        <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>
          <Calendar size={12} style={{ verticalAlign: "middle", marginRight: 4 }} />
          24 – 30 Avril 2026 &nbsp;·&nbsp; Université de Douala &nbsp;·&nbsp;
          {catEntries.length} catégories · {totalActivities} activités
        </p>
      </div>

      {/* grid */}
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 1.5rem 3rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 16,
      }}>
        {catEntries.map(([key, cat]) => (
          <CategoryCard
            key={key}
            catKey={key}
            cat={cat}
            onOpen={() => setActiveKey(key)}
          />
        ))}
      </div>

      {/* footer note */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 2rem" }}>
        <p style={{
          fontSize: 12, color: "#999",
          background: "#f5f4f0",
          border: "0.5px solid rgba(0,0,0,0.07)",
          borderRadius: 8, padding: "0.75rem 1rem", lineHeight: 1.6,
        }}>
          Programme susceptible de modifications. Les horaires précis seront communiqués
          par voie officielle. Contactez l'organisation pour toute information complémentaire.
        </p>
      </div>

      {/* modal */}
      {activeEntry && (
        <Modal
          catKey={activeEntry[0]}
          cat={activeEntry[1]}
          onClose={() => setActiveKey(null)}
        />
      )}
    </div>
  );
}