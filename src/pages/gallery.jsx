import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import { Play, Heart, ZoomIn, X } from "lucide-react";

const CATEGORIES = ["Tous", "Sports", "Culture", "Cérémonie", "Coulisses"];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");
  const [lightbox, setLightbox] = useState(null);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    fetchGallery();

    // Real-time subscription — new media appears instantly for all visitors
    const channel = supabase
      .channel("gallery-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "gallery" }, () => fetchGallery())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  const filtered = filter === "Tous" ? items : items.filter(i => i.category === filter);

  const handleLike = (id) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "À l'instant";
    if (m < 60) return `Il y a ${m}min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `Il y a ${h}h`;
    return `Il y a ${Math.floor(h / 24)}j`;
  };

  return (
    <div style={{ background: "#FAFAF8", paddingTop: 64, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase", marginBottom: "0.5rem" }}>STUD 2026</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            GA<span style={{ color: "#1565C0" }}>LE</span>RIE
          </h1>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#88887F", letterSpacing: "0.1em" }}>
          {items.length} média{items.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Category filter */}
      <div style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F", display: "flex", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: "0.85rem 1.5rem", border: "none", cursor: "pointer", borderRight: "1.5px solid #EAEAE5", background: filter === cat ? "#1565C0" : "transparent", color: filter === cat ? "#fff" : "#0F0F0F", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", transition: "all 0.2s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#EAEAE5", letterSpacing: "0.04em", animation: "pulse 1.5s ease infinite" }}>Chargement…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4rem", color: "#EAEAE5", letterSpacing: "0.04em", marginBottom: "1rem" }}>AUCUN MÉDIA</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#88887F" }}>
              Les photos et vidéos de l'événement apparaîtront ici.
            </p>
          </div>
        ) : (
          <div style={{ columns: "3 280px", columnGap: "1rem" }}>
            {filtered.map((item, idx) => (
              <div key={item.id} style={{ breakInside: "avoid", marginBottom: "1rem", animation: `fadeUp 0.5s ease ${Math.min(idx, 8) * 0.06}s both`, background: "#fff", border: "1.5px solid #EAEAE5", overflow: "hidden" }}>
                {/* Media */}
                <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setLightbox(item)}>
                  {item.type === "video" ? (
                    <div style={{ position: "relative", background: "#0D1B2A", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <video src={item.url} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Play size={22} color="#1565C0" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ overflow: "hidden" }}>
                      <img src={item.url} alt={item.caption} style={{ width: "100%", display: "block", transition: "transform 0.4s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <ZoomIn size={16} color="rgba(255,255,255,0.8)" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }} />
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                    <div style={{ flex: 1 }}>
                      {item.caption && <p style={{ fontFamily: "'Fraunces', serif", fontSize: "0.82rem", color: "#333", lineHeight: 1.5, marginBottom: "0.35rem" }}>{item.caption}</p>}
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "#EEF4FF", color: "#1565C0", padding: "0.15rem 0.4rem" }}>{item.category}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#88887F" }}>{timeAgo(item.created_at)}</span>
                      </div>
                    </div>
                    <button onClick={() => handleLike(item.id)} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: likes[item.id] ? "#F57C00" : "#88887F", transition: "color 0.2s", flexShrink: 0 }}>
                      <Heart size={14} fill={likes[item.id] ? "#F57C00" : "none"} />
                      {likes[item.id] > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem" }}>{likes[item.id]}</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", color: "#fff" }}>
            <X size={28} />
          </button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh" }}>
            {lightbox.type === "video"
              ? <video src={lightbox.url} controls autoPlay style={{ maxWidth: "100%", maxHeight: "80vh" }} />
              : <img src={lightbox.url} alt={lightbox.caption} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain" }} />
            }
            {lightbox.caption && <div style={{ marginTop: "1rem", fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "rgba(255,255,255,0.7)", textAlign: "center", fontSize: "0.95rem" }}>{lightbox.caption}</div>}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}