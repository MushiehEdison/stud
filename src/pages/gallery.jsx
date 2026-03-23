// ============================================================
// gallery.jsx — STUD 2026
// ✓ Images AND videos from Supabase
// ✓ Masonry grid layout
// ✓ Full-screen lightbox with video playback
// ✓ Category filter with count badges
// ✓ Real-time updates (new media appears instantly)
// ✓ Smooth animations
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/superbase";
import { Play, Heart, X, ChevronLeft, ChevronRight, Images, Volume2, VolumeX } from "lucide-react";
import { FeedbackFAB } from "../components/TestimonialsWidget";

const CATEGORIES = ["Tous", "Sports", "Culture", "Cérémonie", "Coulisses"];
const CAT_COLORS = { Sports:"#F57C00", Culture:"#F9A825", Cérémonie:"#1565C0", Coulisses:"#6B7280" };

// ── URL type detection ────────────────────────────────────────
function getYouTubeId(url) {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getVimeoId(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function getEmbedUrl(url) {
  const ytId = getYouTubeId(url);
  if (ytId) return { type:"youtube", src:"https://www.youtube.com/embed/" + ytId + "?autoplay=1&rel=0" };
  const vmId = getVimeoId(url);
  if (vmId) return { type:"vimeo",   src:"https://player.vimeo.com/video/" + vmId + "?autoplay=1" };
  return null;
}

function getThumbnailUrl(url) {
  const ytId = getYouTubeId(url);
  if (ytId) return "https://img.youtube.com/vi/" + ytId + "/hqdefault.jpg";
  return null;
}

function isEmbedLink(url) {
  return !!(getYouTubeId(url) || getVimeoId(url));
}

// ── Time helper ───────────────────────────────────────────────
function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1)  return "À l'instant";
  if (m < 60) return "Il y a " + m + "min";
  const h = Math.floor(m / 60);
  if (h < 24) return "Il y a " + h + "h";
  return "Il y a " + Math.floor(h / 24) + "j";
}

// ── Video thumbnail card ──────────────────────────────────────
function VideoCard({ item, onClick }) {
  const videoRef          = useRef(null);
  const [hovering, setHovering] = useState(false);
  const embed             = isEmbedLink(item.url);
  const thumbUrl          = getThumbnailUrl(item.url);

  // For YouTube/Vimeo — show thumbnail, no hover preview
  if (embed) {
    return (
      <div
        style={{ position:"relative", cursor:"pointer", overflow:"hidden",
          background:"#0D1B2A", aspectRatio:"16/9" }}
        onClick={onClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {thumbUrl && (
          <img src={thumbUrl} alt=""
            style={{ width:"100%", height:"100%", objectFit:"cover",
              opacity: hovering ? 0.6 : 0.5,
              transition:"opacity .3s ease, transform .4s ease",
              transform: hovering ? "scale(1.04)" : "scale(1)" }} />
        )}
        <div style={{ position:"absolute", inset:0, display:"flex",
          alignItems:"center", justifyContent:"center" }}>
          <div style={{ width:56, height:56, borderRadius:"50%",
            background: hovering ? "rgba(245,124,0,0.92)" : "rgba(0,0,0,0.6)",
            border:"2px solid rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background .25s, transform .25s",
            transform: hovering ? "scale(1.12)" : "scale(1)" }}>
            <Play size={22} color="#fff" fill="#fff" />
          </div>
        </div>
        <div style={{ position:"absolute", top:8, left:8,
          background:"rgba(0,0,0,0.7)", borderRadius:3,
          padding:"2px 7px", display:"flex", alignItems:"center", gap:4 }}>
          <Play size={9} color="#fff" fill="#fff" />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
            color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {getYouTubeId(item.url) ? "YouTube" : "Vimeo"}
          </span>
        </div>
      </div>
    );
  }

  // Direct video file — hover preview
  return (
    <div
      style={{ position:"relative", cursor:"pointer", overflow:"hidden",
        background:"#0D1B2A", aspectRatio:"16/9" }}
      onClick={onClick}
      onMouseEnter={() => { setHovering(true); if (videoRef.current) { videoRef.current.play().catch(() => {}); }}}
      onMouseLeave={() => { setHovering(false); if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }}}
    >
      <video
        ref={videoRef}
        src={item.url}
        muted
        playsInline
        preload="metadata"
        style={{ width:"100%", height:"100%", objectFit:"cover",
          opacity: hovering ? 0.6 : 0.45,
          transition:"opacity .3s ease" }}
      />
      <div style={{ position:"absolute", inset:0, display:"flex",
        alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:52, height:52, borderRadius:"50%",
          background: hovering ? "rgba(245,124,0,0.9)" : "rgba(255,255,255,0.18)",
          border:"2px solid rgba(255,255,255,0.4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"background .25s, transform .25s",
          transform: hovering ? "scale(1.1)" : "scale(1)" }}>
          <Play size={20} color="#fff" fill="#fff" />
        </div>
      </div>
      <div style={{ position:"absolute", top:8, left:8,
        background:"rgba(0,0,0,0.65)", borderRadius:3,
        padding:"2px 6px", display:"flex", alignItems:"center", gap:4 }}>
        <Play size={9} color="#fff" fill="#fff" />
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
          color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          Vidéo
        </span>
      </div>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────
function Lightbox({ items, startIdx, onClose }) {
  const [idx, setIdx]     = useState(startIdx);
  const [muted, setMuted] = useState(true);
  const videoRef          = useRef(null);

  const item = items[idx];

  const prev = useCallback(() => setIdx(i => (i - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setIdx(i => (i + 1) % items.length), [items.length]);

  // keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  // reset video mute when changing item
  useEffect(() => { setMuted(true); }, [idx]);

  return (
    <div
      onClick={onClose}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.96)",
        zIndex:2000, display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center" }}>

      {/* top bar */}
      <div style={{ position:"absolute", top:0, left:0, right:0,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"1rem 1.5rem", zIndex:10,
        background:"linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
          {item.category && (
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
              letterSpacing:"0.18em", textTransform:"uppercase",
              background:CAT_COLORS[item.category] || "#1565C0",
              color:"#fff", padding:"3px 8px", borderRadius:2 }}>
              {item.category}
            </span>
          )}
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.48rem",
            color:"rgba(255,255,255,0.4)", letterSpacing:"0.1em" }}>
            {idx + 1} / {items.length}
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
          {item.type === "video" && !isEmbedLink(item.url) && (
            <button
              onClick={e => { e.stopPropagation(); setMuted(m => !m);
                if (videoRef.current) videoRef.current.muted = !muted; }}
              style={{ background:"rgba(255,255,255,0.1)", border:"none",
                borderRadius:6, padding:"6px 8px", cursor:"pointer",
                color:"#fff", display:"flex", alignItems:"center" }}>
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          )}
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.1)", border:"none",
              borderRadius:6, padding:"6px 8px", cursor:"pointer",
              color:"#fff", display:"flex", alignItems:"center" }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* media */}
      <div onClick={e => e.stopPropagation()}
        style={{ maxWidth:"92vw", maxHeight:"80vh", display:"flex",
          alignItems:"center", justifyContent:"center" }}>
        {item.type === "video" && isEmbedLink(item.url) ? (
          // YouTube / Vimeo — iframe embed
          <iframe
            src={getEmbedUrl(item.url)?.src}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            style={{ width:"min(860px, 90vw)", height:"min(484px, 52vw)",
              border:"none", borderRadius:4 }}
          />
        ) : item.type === "video" ? (
          // Direct video file
          <video
            ref={videoRef}
            src={item.url}
            controls
            autoPlay
            muted={muted}
            playsInline
            style={{ maxWidth:"100%", maxHeight:"80vh",
              borderRadius:4, outline:"none" }}
          />
        ) : (
          // Image
          <img
            src={item.url}
            alt={item.caption || ""}
            style={{ maxWidth:"100%", maxHeight:"80vh",
              objectFit:"contain", borderRadius:4,
              animation:"lbIn .3s ease" }}
          />
        )}
      </div>

      {/* caption */}
      {item.caption && (
        <div onClick={e => e.stopPropagation()}
          style={{ marginTop:"1rem", textAlign:"center", maxWidth:600,
            padding:"0 1.5rem" }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
            color:"rgba(255,255,255,0.7)", fontSize:"0.92rem",
            lineHeight:1.6, margin:0 }}>
            {item.caption}
          </p>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.46rem",
            color:"rgba(255,255,255,0.3)", letterSpacing:"0.1em",
            marginTop:"0.4rem" }}>
            {timeAgo(item.created_at)}
          </div>
        </div>
      )}

      {/* prev / next arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); prev(); }}
            style={{ position:"absolute", left:16, top:"50%",
              transform:"translateY(-50%)", background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
              padding:"12px 10px", cursor:"pointer", color:"#fff",
              display:"flex", alignItems:"center",
              transition:"background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); next(); }}
            style={{ position:"absolute", right:16, top:"50%",
              transform:"translateY(-50%)", background:"rgba(255,255,255,0.1)",
              border:"1px solid rgba(255,255,255,0.15)", borderRadius:8,
              padding:"12px 10px", cursor:"pointer", color:"#fff",
              display:"flex", alignItems:"center",
              transition:"background .2s" }}
            onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}>
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* thumbnail strip */}
      {items.length > 1 && (
        <div onClick={e => e.stopPropagation()}
          style={{ position:"absolute", bottom:0, left:0, right:0,
            display:"flex", gap:4, padding:"1rem 1.5rem",
            overflowX:"auto", justifyContent:"center",
            background:"linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
          {items.map((it, i) => (
            <button key={it.id} onClick={() => setIdx(i)}
              style={{ width:48, height:36, flexShrink:0, padding:0, border:"none",
                cursor:"pointer", borderRadius:3, overflow:"hidden",
                outline: i === idx ? "2px solid #F57C00" : "2px solid transparent",
                transition:"outline .2s", opacity: i === idx ? 1 : 0.5 }}>
              {it.type === "video"
                ? <div style={{ width:"100%", height:"100%", background:"#0D1B2A",
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Play size={10} color="#fff" fill="#fff" />
                  </div>
                : <img src={it.url} alt=""
                    style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              }
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Gallery page ─────────────────────────────────────────
export default function Gallery() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("Tous");
  const [lightbox, setLightbox] = useState(null); // index
  const [likes,    setLikes]    = useState({});

  useEffect(() => {
    fetchGallery();
    const channel = supabase
      .channel("gallery-changes")
      .on("postgres_changes",
        { event:"*", schema:"public", table:"gallery" },
        () => fetchGallery())
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchGallery() {
    const { data } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending:false });
    setItems(data || []);
    setLoading(false);
  }

  const filtered = filter === "Tous"
    ? items
    : items.filter(i => i.category === filter);

  // count per category
  const counts = {};
  items.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });

  const handleLike = (id, e) => {
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const openLightbox = (item) => {
    const idx = filtered.findIndex(i => i.id === item.id);
    setLightbox(idx >= 0 ? idx : 0);
  };

  const imageCount = items.filter(i => i.type !== "video").length;
  const videoCount = items.filter(i => i.type === "video").length;

  return (
    <div style={{ background:"#f8f8f6", paddingTop:64, minHeight:"100vh" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        /* masonry */
        .gallery-masonry { columns: 3 280px; column-gap: 12px; }
        .gallery-item    { break-inside: avoid; margin-bottom: 12px;
          background: #fff; border-radius: 8px; overflow: hidden;
          border: 1px solid rgba(10,10,10,0.08);
          transition: transform .25s ease, box-shadow .25s ease; }
        .gallery-item:hover { transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12); }

        /* lightbox */
        @keyframes lbIn { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }

        /* item entrance */
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        .gal-enter { animation: fadeUp .45s ease both; }

        /* filter button */
        .cat-btn { transition: background .18s, color .18s, border-color .18s; }
        .cat-btn:hover { background: #EEF4FF !important; color: #1565C0 !important; }

        /* like button */
        .like-btn { transition: color .18s, transform .18s; }
        .like-btn:hover { transform: scale(1.2); }

        @media(max-width: 640px) {
          .gallery-masonry { columns: 2 160px; column-gap: 8px; }
          .gallery-item    { margin-bottom: 8px; }
          .gal-header      { padding: 1.5rem 1.25rem 1rem !important; }
          .gal-filters     { padding: 0 1.25rem !important; }
          .gal-body        { padding: 1rem 1.25rem !important; }
        }
        @media(max-width: 400px) {
          .gallery-masonry { columns: 1; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ borderBottom:"2px solid #ede9e0", background:"#fff" }}>
        <div className="gal-header"
          style={{ maxWidth:1280, margin:"0 auto",
            padding:"2.5rem 2.5rem 1.75rem",
            display:"flex", justifyContent:"space-between",
            alignItems:"flex-end", flexWrap:"wrap", gap:"1rem" }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
              letterSpacing:"0.22em", color:"#88887F",
              textTransform:"uppercase", marginBottom:"0.5rem" }}>
              STUD 2026 · Galerie
            </div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif",
              fontSize:"clamp(3rem,8vw,6.5rem)", lineHeight:.88,
              letterSpacing:"0.02em", margin:0, color:"#0A0A0A" }}>
              GA<span style={{color:"#1565C0"}}>LE</span>RIE
            </h1>
          </div>
          {/* counts */}
          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
                color:"#1565C0", lineHeight:1 }}>{imageCount}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.46rem",
                color:"#88887F", letterSpacing:"0.14em",
                textTransform:"uppercase" }}>Photos</div>
            </div>
            <div style={{ width:1, background:"rgba(10,10,10,0.1)" }} />
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
                color:"#F57C00", lineHeight:1 }}>{videoCount}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.46rem",
                color:"#88887F", letterSpacing:"0.14em",
                textTransform:"uppercase" }}>Vidéos</div>
            </div>
          </div>
        </div>

        {/* ── FILTERS ── */}
        <div className="gal-filters"
          style={{ maxWidth:1280, margin:"0 auto",
            display:"flex", overflowX:"auto", gap:6,
            padding:"0 2.5rem 1rem", flexWrap:"wrap" }}>
          {CATEGORIES.map(cat => {
            const active = filter === cat;
            const count  = cat === "Tous" ? items.length : (counts[cat] || 0);
            return (
              <button key={cat} onClick={() => setFilter(cat)}
                className="cat-btn"
                style={{ padding:"0.45rem 1rem", border:"1.5px solid",
                  borderColor: active ? "#1565C0" : "rgba(10,10,10,0.12)",
                  borderRadius:20, background: active ? "#1565C0" : "#fff",
                  color: active ? "#fff" : "#3D3D38",
                  fontFamily:"'DM Mono',monospace", fontSize:"0.52rem",
                  letterSpacing:"0.12em", textTransform:"uppercase",
                  cursor:"pointer", whiteSpace:"nowrap",
                  display:"inline-flex", alignItems:"center", gap:"0.4rem" }}>
                {cat}
                <span style={{ background: active ? "rgba(255,255,255,0.25)" : "#EEF4FF",
                  color: active ? "#fff" : "#1565C0",
                  borderRadius:99, padding:"0 5px",
                  fontSize:"0.44rem", fontWeight:700 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="gal-body"
        style={{ maxWidth:1280, margin:"0 auto", padding:"1.5rem 2.5rem 4rem" }}>

        {loading ? (
          <div style={{ textAlign:"center", padding:"6rem 2rem" }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"2rem",
              color:"#E0E0E0", letterSpacing:"0.04em" }}>
              Chargement...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"6rem 2rem",
            display:"flex", flexDirection:"column",
            alignItems:"center", gap:"1rem" }}>
            <Images size={48} color="#E0E0E0" strokeWidth={1} />
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"3rem",
              color:"#E0E0E0", letterSpacing:"0.04em" }}>
              {filter === "Tous" ? "AUCUN MÉDIA" : "AUCUN RÉSULTAT"}
            </div>
            <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
              color:"#88887F", fontSize:"0.9rem" }}>
              {filter === "Tous"
                ? "Les photos et vidéos de l'événement apparaîtront ici."
                : "Aucun média dans la catégorie " + filter + "."}
            </p>
            {filter !== "Tous" && (
              <button onClick={() => setFilter("Tous")}
                style={{ background:"#1565C0", color:"#fff", border:"none",
                  padding:"0.65rem 1.5rem", cursor:"pointer", borderRadius:4,
                  fontFamily:"'DM Mono',monospace", fontSize:"0.54rem",
                  letterSpacing:"0.14em", textTransform:"uppercase" }}>
                Voir tout
              </button>
            )}
          </div>
        ) : (
          <div className="gallery-masonry">
            {filtered.map((item, i) => {
              const isVideo   = item.type === "video";
              const catColor  = CAT_COLORS[item.category] || "#1565C0";
              const likeCount = likes[item.id] || 0;
              return (
                <div key={item.id} className="gallery-item gal-enter"
                  style={{ animationDelay: Math.min(i, 12) * 0.05 + "s" }}>

                  {/* media */}
                  <div style={{ cursor:"pointer" }}
                    onClick={() => openLightbox(item)}>
                    {isVideo
                      ? <VideoCard item={item} onClick={() => openLightbox(item)} />
                      : (
                        <div style={{ overflow:"hidden", position:"relative" }}>
                          <img
                            src={item.url}
                            alt={item.caption || ""}
                            loading="lazy"
                            style={{ width:"100%", display:"block",
                              transition:"transform .45s ease" }}
                            onMouseEnter={e => e.currentTarget.style.transform="scale(1.04)"}
                            onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                          />
                        </div>
                      )
                    }
                  </div>

                  {/* card footer */}
                  <div style={{ padding:"0.75rem 0.875rem" }}>
                    <div style={{ display:"flex", alignItems:"flex-start",
                      justifyContent:"space-between", gap:"0.5rem" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        {item.caption && (
                          <p style={{ fontFamily:"'Fraunces',serif",
                            fontSize:"0.82rem", color:"#0A0A0A",
                            lineHeight:1.5, marginBottom:"0.4rem", margin:"0 0 0.4rem" }}>
                            {item.caption}
                          </p>
                        )}
                        <div style={{ display:"flex", alignItems:"center",
                          gap:"0.5rem", flexWrap:"wrap" }}>
                          <span style={{ fontFamily:"'DM Mono',monospace",
                            fontSize:"0.44rem", letterSpacing:"0.12em",
                            textTransform:"uppercase",
                            background:catColor + "15", color:catColor,
                            padding:"2px 7px", borderRadius:2 }}>
                            {item.category}
                          </span>
                          <span style={{ fontFamily:"'DM Mono',monospace",
                            fontSize:"0.44rem", color:"#aaa" }}>
                            {timeAgo(item.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* like button */}
                      <button
                        className="like-btn"
                        onClick={e => handleLike(item.id, e)}
                        style={{ display:"flex", flexDirection:"column",
                          alignItems:"center", gap:1, background:"none",
                          border:"none", cursor:"pointer", padding:"4px",
                          color: likeCount > 0 ? "#F57C00" : "#ccc",
                          flexShrink:0 }}>
                        <Heart size={15}
                          fill={likeCount > 0 ? "#F57C00" : "none"}
                          strokeWidth={1.5} />
                        {likeCount > 0 && (
                          <span style={{ fontFamily:"'DM Mono',monospace",
                            fontSize:"0.38rem", color:"#F57C00" }}>
                            {likeCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <Lightbox
          items={filtered}
          startIdx={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}

      <FeedbackFAB />
    </div>
  );
}