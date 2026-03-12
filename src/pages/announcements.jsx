import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import { Pin, Share2, ChevronDown } from "lucide-react";
import { FeedbackFAB } from "../components/TestimonialsWidget";

const CATEGORIES = ["Tous", "Général", "Sport", "Culture", "Logistique"];
const CAT_COLORS = { Général: "#1565C0", Sport: "#F57C00", Culture: "#F9A825", Logistique: "#6B7280" };

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Tous");
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    fetchAnnouncements();

    // Real-time — new announcements appear instantly
    const channel = supabase
      .channel("announcements-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "announcements" }, () => fetchAnnouncements())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (!error) setItems(data || []);
    setLoading(false);
  };

  const filtered = filter === "Tous" ? items : items.filter(i => i.category === filter);

  const handleShare = (id) => {
    navigator.clipboard?.writeText(window.location.href + "#" + id);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "À l'instant";
    if (m < 60) return `Il y a ${m} min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `Il y a ${h}h`;
    const d = Math.floor(h / 24);
    return `Il y a ${d} jour${d > 1 ? "s" : ""}`;
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div style={{ background: "#FAFAF8", paddingTop: 64, minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ borderBottom: "1.5px solid #0F0F0F", maxWidth: 1280, margin: "0 auto", padding: "3rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1.5rem" }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase", marginBottom: "0.5rem" }}>STUD 2026</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9, letterSpacing: "0.02em" }}>
            AN<span style={{ color: "#1565C0" }}>NON</span>CES
          </h1>
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#88887F" }}>
          {items.length} annonce{items.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Filters */}
      <div style={{ maxWidth: 1280, margin: "0 auto", borderBottom: "1.5px solid #0F0F0F", display: "flex", overflowX: "auto" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{ padding: "0.85rem 1.5rem", border: "none", cursor: "pointer", borderRight: "1.5px solid #EAEAE5", background: filter === cat ? "#1565C0" : "transparent", color: filter === cat ? "#fff" : "#0F0F0F", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap", transition: "all 0.2s" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#EAEAE5", letterSpacing: "0.04em", animation: "pulse 1.5s ease infinite" }}>Chargement…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#EAEAE5", letterSpacing: "0.04em", marginBottom: "1rem" }}>AUCUNE ANNONCE</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#88887F" }}>Les annonces apparaîtront ici dès leur publication.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {filtered.map((item, idx) => {
              const isOpen = expanded === item.id;
              const catColor = CAT_COLORS[item.category] || "#1565C0";
              return (
                <article key={item.id} id={item.id} style={{ background: "#fff", border: item.pinned ? `1.5px solid ${catColor}` : "1.5px solid #EAEAE5", animation: `feedIn 0.45s ease ${Math.min(idx, 6) * 0.06}s both`, transition: "box-shadow 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(21,101,192,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{ height: 3, background: catColor }} />
                  <div style={{ padding: "1.25rem 1.5rem" }}>
                    {/* Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: catColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: "#fff" }}>{item.author.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.82rem" }}>{item.author}</div>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#88887F", letterSpacing: "0.08em" }}>{timeAgo(item.created_at)}</div>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {item.pinned && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: catColor, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            <Pin size={11} /> Épinglé
                          </div>
                        )}
                        <span style={{ background: catColor + "18", color: catColor, fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.15rem 0.45rem" }}>{item.category}</span>
                      </div>
                    </div>

                    <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.3, marginBottom: "0.65rem", color: "#0F0F0F" }}>{item.title}</h2>

                    <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.9rem", color: "#555550", lineHeight: 1.8 }}>
                      {isOpen ? item.body : item.body.length > 200 ? item.body.slice(0, 200) + "…" : item.body}
                    </div>

                    {item.body.length > 200 && (
                      <button onClick={() => setExpanded(isOpen ? null : item.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#1565C0", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.5rem", padding: 0 }}>
                        {isOpen ? "Réduire" : "Lire la suite"}
                        <ChevronDown size={12} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                      </button>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #EAEAE5" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#88887F", letterSpacing: "0.06em" }}>{formatDate(item.created_at)}</div>
                      <button onClick={() => handleShare(item.id)} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.3rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: copied === item.id ? "#1565C0" : "#88887F", letterSpacing: "0.08em", padding: "0.25rem 0.5rem", transition: "color 0.2s" }}>
                        <Share2 size={12} /> {copied === item.id ? "Copié !" : "Partager"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes feedIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>

      {/* ── FEEDBACK FAB (fixed, bottom-right) ──────────── NEW ── */}
            <FeedbackFAB />
    </div>
  );
}