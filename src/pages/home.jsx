// ============================================================
// home.jsx — v6
// ✓ Feed grid: AnnouncementsCard → ActualitésCard (rebranded)
// ✓ Feed grid: PartnersCarousel → ÉtablissementsCard (faculty images)
// ✓ FacultyStrip (scrolling logo marquee) removed
// ✓ "Dernières Annonces" full section removed
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Pin, ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { META, STATS, OBJECTIVES, SPONSORING, PROGRAM } from "../data";
import logo      from "../assets/logo.png";
import uniLogo   from "../assets/University_of_Douala_Logo.jpg";
import uniImg    from "../assets/uni.JPG";
import Countdown from "../components/countdown";
import { supabase } from "../lib/superbase";
import { useVisitorTracker, fetchTotalVisitors } from "../lib/useVisitorTracker";
import { TestimonialsCarousel, FeedbackFAB } from "../components/TestimonialsWidget";
import illuCohesion    from "../assets/icon-cohesion.svg";
import illuExcellence  from "../assets/icon-trophy.svg";
import illuCelebration from "../assets/icon-celebration.svg";
import illuSolidarity  from "../assets/icon-solidarity.svg";

import logoPad     from "../assets/pad.png";
import logoTradex  from "../assets/tradex.png";
import logoTotal   from "../assets/total.png";
import logoBossion from "../assets/bdc.webp";
import logoOrange  from "../assets/orange.webp";

// ── local logo imports ────────────────────────────────────
import logoFSEGA  from "../assets/eco.png";
import logoENSET  from "../assets/enset.png";
import logoESSEC  from "../assets/essec.png";
import logoFDS    from "../assets/fds.png";
import logoIBA    from "../assets/iba.png";
import logoISH    from "../assets/ish.png";
import logoIUT    from "../assets/iut.png";
import logoFLSH   from "../assets/letter.png";

const OBJ_ILLUSTRATIONS = [illuCohesion, illuExcellence, illuCelebration, illuSolidarity];

const PARTNERS = [
  { name: "Port Autonome de Douala", short: "PAD",    logo: logoPad     },
  { name: "Tradex",                  short: "TRADEX", logo: logoTradex  },
  { name: "Total Energies",          short: "TOTAL",  logo: logoTotal   },
  { name: "Brasseries du Cameroun",  short: "BDC",    logo: logoBossion },
  { name: "Orange Cameroun",         short: "ORANGE", logo: logoOrange  },
];

// Établissements de l'Université de Douala
const ETABLISSEMENTS = [
  { name: "FSEGA", full: "Faculté des Sciences Économiques et de Gestion Appliquée",  img: logoFSEGA },
  { name: "ENSET", full: "École Normale Supérieure de l'Enseignement Technique",      img: logoENSET },
  { name: "ESSEC", full: "École Supérieure des Sciences Économiques et Commerciales", img: logoESSEC },
  { name: "FDS",   full: "Faculté de Droit et de Science Politique",                  img: logoFDS   },
  { name: "IBA",   full: "Institut de la Baie de Bonanjo en Administration",          img: logoIBA   },
  { name: "ISH",   full: "Institut des Sciences de l'Homme",                          img: logoISH   },
  { name: "IUT",   full: "Institut Universitaire de Technologie",                     img: logoIUT   },
  { name: "FLSH",  full: "Faculté des Lettres et Sciences Humaines",                  img: logoFLSH  },
];

const CAT_COLORS = { Général:"#1565C0", Sport:"#F57C00", Culture:"#F9A825", Logistique:"#6B7280" };

const FEED_PLACEHOLDERS = [
  { _label:"Sports & Tournois",       _cat:"Sport",   _bg:"linear-gradient(150deg,#0f2447 0%,#1e4d8c 100%)" },
  { _label:"Culture & Arts",          _cat:"Culture", _bg:"linear-gradient(150deg,#3d1200 0%,#b84500 100%)" },
  { _label:"Cohésion d'Équipe",       _cat:"Général", _bg:"linear-gradient(150deg,#0a2e1a 0%,#1a7a40 100%)" },
  { _label:"Cérémonie de Clôture",    _cat:"Général", _bg:"linear-gradient(150deg,#1a0a2e 0%,#5a1f8c 100%)" },
];

// ─────────────────────────────────────────────────────────────
// useWindowWidth
// ─────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useStagger(threshold = 0.07) {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current; if (!container) return;
    const children = Array.from(container.children);
    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(22px)";
      child.style.transition = `opacity .55s ease ${i * 0.1}s, transform .55s ease ${i * 0.1}s`;
    });
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        children.forEach(child => {
          child.style.opacity = "1";
          child.style.transform = "none";
        });
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(container);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

function Reveal({ children, delay = 0, from = "bottom", style = {}, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const startTransform =
      from === "left"  ? "translateX(-28px)" :
      from === "right" ? "translateX(28px)"  :
      from === "scale" ? "scale(.96)"        :
      "translateY(22px)";
    el.style.opacity = "0";
    el.style.transform = startTransform;
    el.style.transition = `opacity .6s ease ${delay}s, transform .65s cubic-bezier(.22,1,.36,1) ${delay}s`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = from === "scale" ? "scale(1)" : "none";
        obs.disconnect();
      }
    }, { threshold: 0.07 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, from]);
  return <div ref={ref} style={style} className={className}>{children}</div>;
}

function Counter({ target }) {
  const [n, setN] = useState(0);
  const [ref, v] = useInView(0.3);
  useEffect(() => {
    if (!v) return;
    let cur = 0; const inc = target / (1800 / 16);
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [v, target]);
  return <span ref={ref}>{n.toLocaleString("fr-FR")}</span>;
}

// ─────────────────────────────────────────────────────────────
// ActualitésCard — rebranded announcements card (was AnnouncementsCard)
// Shows latest announcements under the label "Les Actualités"
// ─────────────────────────────────────────────────────────────
function ActualitesCard({ anns }) {
  const [idx, setIdx] = useState(0);
  const [sliding, setSliding] = useState(false);
  const CAT_C = { Général:"#1565C0", Sport:"#F57C00", Culture:"#F9A825", Logistique:"#6B7280" };

  useEffect(() => {
    if (!anns.length) return;
    const t = setInterval(() => {
      setSliding(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % anns.length);
        setSliding(false);
      }, 350);
    }, 3500);
    return () => clearInterval(t);
  }, [anns.length]);

  if (!anns.length) {
    return (
      <div style={{ background:"#0A0A0A", borderRadius:10, display:"flex",
        alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.44rem",
          color:"rgba(255,255,255,0.18)", letterSpacing:"0.18em",
          textTransform:"uppercase" }}>Actualités</span>
      </div>
    );
  }

  const ann = anns[idx];
  const cc  = CAT_C[ann.category] || "#1565C0";

  return (
    <Link to="/announcements" style={{ textDecoration:"none", display:"block",
      background:"#0A0A0A", borderRadius:10, overflow:"hidden",
      position:"relative", width:"100%", height:"100%" }}>
      {/* color bar */}
      <div style={{ height:3, background:cc, transition:"background .4s ease", flexShrink:0 }} />
      {/* dot grid bg */}
      <div style={{ position:"absolute", inset:0, opacity:0.04, pointerEvents:"none",
        backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
        backgroundSize:"18px 18px" }} />
      {/* content */}
      <div style={{ position:"relative", padding:"0.75rem 0.875rem",
        display:"flex", flexDirection:"column", height:"calc(100% - 3px)",
        justifyContent:"space-between" }}>
        {/* header */}
        <div style={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", marginBottom:"0.4rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"0.35rem" }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:cc,
              display:"inline-block", animation:"livepulse 2s infinite" }} />
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
              letterSpacing:"0.2em", textTransform:"uppercase",
              color:"rgba(255,255,255,0.38)" }}>Les Actualités</span>
          </div>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.36rem",
            color:"rgba(255,255,255,0.2)" }}>{idx + 1}/{anns.length}</span>
        </div>
        {/* body */}
        <div style={{ flex:1, overflow:"hidden",
          opacity: sliding ? 0 : 1,
          transform: sliding ? "translateY(8px)" : "translateY(0)",
          transition:"opacity .35s ease, transform .35s ease" }}>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
            letterSpacing:"0.14em", textTransform:"uppercase",
            color:cc, marginBottom:"0.3rem" }}>{ann.category}</div>
          <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700,
            fontSize:"0.74rem", color:"#fff", lineHeight:1.3,
            margin:"0 0 0.3rem 0",
            display:"-webkit-box", WebkitLineClamp:2,
            WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {ann.title}
          </p>
          <p style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic",
            fontSize:"0.64rem", color:"rgba(255,255,255,0.45)",
            lineHeight:1.4, margin:0,
            display:"-webkit-box", WebkitLineClamp:2,
            WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {ann.body.length > 80 ? ann.body.slice(0, 80) + "…" : ann.body}
          </p>
        </div>
        {/* dot progress */}
        <div style={{ display:"flex", gap:3, marginTop:"0.4rem", alignItems:"center" }}>
          {anns.slice(0, 5).map((_, i) => (
            <div key={i} style={{ height:3, borderRadius:2,
              width: i === idx ? 12 : 4,
              background: i === idx ? cc : "rgba(255,255,255,0.15)",
              transition:"width .3s ease, background .3s ease" }} />
          ))}
          {anns.length > 5 && (
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.34rem",
              color:"rgba(255,255,255,0.18)", marginLeft:2 }}>
              {"+" + (anns.length - 5)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// ÉtablissementsCard — replaces PartnersCarouselCard in the feed grid
// Cycles through faculty images with name overlay
// ─────────────────────────────────────────────────────────────
function EtablissementsCard() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next) => {
    setFading(true);
    setTimeout(() => { setIdx(next); setFading(false); }, 320);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo((idx + 1) % ETABLISSEMENTS.length), 3000);
    return () => clearInterval(t);
  }, [idx, goTo]);

  const etab = ETABLISSEMENTS[idx];

  return (
    <div style={{
      position:"relative", borderRadius:10, overflow:"hidden",
      background:"#ffffff",
      display:"flex", flexDirection:"column",
    }}>
      {/* sliding image */}
      {ETABLISSEMENTS.map((e, i) => (
        <img key={i} src={e.img} alt={e.full}
         style={{
            position:"absolute",
            top:"50%",
            left:"50%",
            transform:"translate(-50%, -50%)",
            width:"60%",        // adjust to taste — how large the logo appears
            height:"60%",
            objectFit:"contain", // "contain" so the full logo is visible, not cropped
            opacity: i === idx ? (fading ? 0 : 1) : 0,
            transition:"opacity .4s ease"
          }}
          onError={ev => { ev.target.style.display = "none"; }}
        />
      ))}

      {/* dark overlay */}
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.35) 100%)",
        pointerEvents:"none" }} />

      {/* top label */}
      <div style={{ position:"absolute", top:9, left:11, zIndex:3,
        display:"flex", alignItems:"center", gap:"0.35rem" }}>
        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
          letterSpacing:"0.2em", textTransform:"uppercase",
          color:"rgba(255,255,255,0.5)", background:"rgba(0,0,0,0.35)",
          padding:"2px 7px", borderRadius:2 }}>
          Établissements · UDo
        </span>
      </div>

      {/* bottom name */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0.65rem 0.875rem",
        zIndex:3,
        opacity: fading ? 0 : 1,
        transition:"opacity .35s ease" }}>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem",
          letterSpacing:"0.18em", textTransform:"uppercase",
          color:"#F57C00", marginBottom:2 }}>{etab.name}</div>
        <div style={{ fontFamily:"'Fraunces',serif", fontWeight:700,
          fontSize:"0.72rem", color:"#fff", lineHeight:1.25,
          display:"-webkit-box", WebkitLineClamp:2,
          WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {etab.full}
        </div>
      </div>

      {/* dot indicators */}
      <div style={{ position:"absolute", bottom:8, right:10, zIndex:4,
        display:"flex", gap:4, alignItems:"center" }}>
        {ETABLISSEMENTS.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i === idx ? 14 : 4, height:4, borderRadius:2,
              border:"none", cursor:"pointer", padding:0,
              background: i === idx ? "#fff" : "rgba(255,255,255,0.35)",
              transition:"width .3s ease, background .3s ease" }} />
        ))}
      </div>

      {/* arrows */}
      <button onClick={() => goTo((idx - 1 + ETABLISSEMENTS.length) % ETABLISSEMENTS.length)}
        style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)", zIndex:4,
          background:"rgba(0,0,0,0.4)", border:"none", borderRadius:4,
          padding:"3px 5px", cursor:"pointer", color:"rgba(255,255,255,0.7)",
          display:"flex", alignItems:"center", lineHeight:1 }}>
        <ChevronLeft size={13} />
      </button>
      <button onClick={() => goTo((idx + 1) % ETABLISSEMENTS.length)}
        style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", zIndex:4,
          background:"rgba(0,0,0,0.4)", border:"none", borderRadius:4,
          padding:"3px 5px", cursor:"pointer", color:"rgba(255,255,255,0.7)",
          display:"flex", alignItems:"center", lineHeight:1 }}>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// URL helpers
// ─────────────────────────────────────────────────────────────
function getYouTubeId(url) {
  if (!url) return null;
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
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}
function getVideoThumb(url) {
  const ytId = getYouTubeId(url);
  if (ytId) return "https://img.youtube.com/vi/" + ytId + "/hqdefault.jpg";
  return null;
}
function isEmbedVideo(url) {
  return !!(getYouTubeId(url) || getVimeoId(url));
}

// ─────────────────────────────────────────────────────────────
// ImgCard
// ─────────────────────────────────────────────────────────────
function ImgCard({ item, big = false, style = {} }) {
  const isBatch  = item?.urls && item.urls.length > 1;
  const isVideo  = item?.type === "video" && !isBatch;
  const label    = item?.caption || item?._label || "";
  const cat      = item?.category || item?._cat  || "";
  const bg       = item?._bg || "#111827";
  const catColor = CAT_COLORS[cat] || "#1565C0";
  const isEmbed  = isVideo && isEmbedVideo(item?.url);
  const thumbUrl = isVideo ? getVideoThumb(item?.url) : null;
  const videoRef = useRef(null);
  const [hovered,  setHovered]  = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  const timerRef = useRef(null);
  useEffect(() => {
    if (!isBatch) return;
    timerRef.current = setInterval(() => {
      setSlideIdx(i => (i + 1) % item.urls.length);
    }, 3000);
    return () => clearInterval(timerRef.current);
  }, [isBatch, item?.urls?.length]);

  const goSlide = (e, dir) => {
    e.preventDefault(); e.stopPropagation();
    clearInterval(timerRef.current);
    setSlideIdx(i => (i + dir + item.urls.length) % item.urls.length);
    timerRef.current = setInterval(() => {
      setSlideIdx(i => (i + 1) % item.urls.length);
    }, 3000);
  };

  const displayUrl = isBatch ? item.urls[slideIdx]?.url : item?.url;

  return (
    <Link to="/gallery"
      style={{ display:"block", position:"relative", overflow:"hidden",
        background:bg, textDecoration:"none", borderRadius:10, ...style }}
      onMouseEnter={() => {
        setHovered(true);
        if (videoRef.current) videoRef.current.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}>

      {isBatch && item.urls.map((u, i) => (
        <img key={i} src={u.url} alt={label}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover",
            opacity: i === slideIdx ? 1 : 0,
            transition:"opacity .55s ease, transform .55s ease",
            transform: hovered ? "scale(1.03)" : "scale(1)" }}
        />
      ))}

      {!isBatch && !isVideo && displayUrl && (
        <img src={displayUrl} alt={label}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover",
            transition:"transform .55s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
      )}

      {isVideo && isEmbed && (
        <img
          src={thumbUrl || ("https://img.youtube.com/vi/" + (getYouTubeId(item?.url) || "") + "/maxresdefault.jpg")}
          alt={label}
          onError={e => { e.currentTarget.src = "https://img.youtube.com/vi/" + (getYouTubeId(item?.url) || "") + "/hqdefault.jpg"; }}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover", transition:"transform .5s ease",
            transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
      )}

      {isVideo && !isEmbed && item?.url && (
        <video ref={videoRef} src={item.url} muted playsInline preload="metadata"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%",
            objectFit:"cover", transition:"opacity .3s", opacity: hovered ? 0.8 : 1 }}
        />
      )}

      {isVideo && (
        <div style={{ position:"absolute", inset:0, display:"flex",
          alignItems:"center", justifyContent:"center" }}>
          <div style={{ width: big ? 60 : 50, height: big ? 60 : 50,
            borderRadius:"50%",
            background: hovered ? "rgba(21,101,192,0.92)" : "rgba(0,0,0,0.55)",
            border:"2px solid rgba(255,255,255,0.4)",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background .25s, transform .25s",
            transform: hovered ? "scale(1.1)" : "scale(1)" }}>
            <Play size={big ? 24 : 19} color="#fff" fill="#fff" />
          </div>
        </div>
      )}

      {isBatch && (
        <>
          {hovered && slideIdx > 0 && (
            <button onClick={e => goSlide(e, -1)}
              style={{ position:"absolute", left:8, top:"50%",
                transform:"translateY(-50%)", zIndex:3,
                width:28, height:28, borderRadius:"50%",
                background:"rgba(255,255,255,0.85)", border:"none",
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", padding:0 }}>
              <ChevronLeft size={15} color="#0A0A0A" />
            </button>
          )}
          {hovered && slideIdx < item.urls.length - 1 && (
            <button onClick={e => goSlide(e, 1)}
              style={{ position:"absolute", right:8, top:"50%",
                transform:"translateY(-50%)", zIndex:3,
                width:28, height:28, borderRadius:"50%",
                background:"rgba(255,255,255,0.85)", border:"none",
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", padding:0 }}>
              <ChevronRight size={15} color="#0A0A0A" />
            </button>
          )}
          <div style={{ position:"absolute", top:8, left:"50%",
            transform:"translateX(-50%)", display:"flex", gap:4, zIndex:3 }}>
            {item.urls.map((_, i) => (
              <div key={i} style={{ width: i === slideIdx ? 16 : 5, height:5,
                borderRadius:3, background:"rgba(255,255,255,0.9)",
                opacity: i === slideIdx ? 1 : 0.5,
                transition:"width .3s ease",
                boxShadow:"0 1px 3px rgba(0,0,0,0.3)" }} />
            ))}
          </div>
          <div style={{ position:"absolute", top:8, right:10, zIndex:3,
            background:"rgba(0,0,0,0.55)", borderRadius:3,
            padding:"2px 7px", fontFamily:"'DM Mono',monospace",
            fontSize:"0.38rem", color:"#fff", letterSpacing:"0.06em" }}>
            {slideIdx + 1}/{item.urls.length}
          </div>
        </>
      )}

      {isVideo && (
        <div style={{ position:"absolute", top:9, left:9, zIndex:2,
          background:"rgba(0,0,0,0.72)", borderRadius:3,
          padding:"2px 7px", display:"flex", alignItems:"center", gap:3 }}>
          <Play size={8} color="#fff" fill="#fff" />
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.38rem",
            color:"#fff", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {getYouTubeId(item?.url) ? "YouTube" : getVimeoId(item?.url) ? "Vimeo" : "Vidéo"}
          </span>
        </div>
      )}

      <div style={{ position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)" }} />

      {cat && !isBatch && (
        <div style={{ position:"absolute", top:10, right:10 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.4rem",
            letterSpacing:"0.18em", textTransform:"uppercase",
            background:catColor, color:"#fff",
            padding:"2px 7px", borderRadius:2, display:"inline-block" }}>
            {cat}
          </span>
        </div>
      )}

      {label && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0,
          padding: big ? "1.25rem 1rem" : "0.75rem 0.875rem",
          background:"linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)" }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700,
            color:"#fff", lineHeight:1.4, margin:0,
            fontSize: big ? "1rem" : "0.78rem",
            textShadow:"0 1px 4px rgba(0,0,0,0.6)",
            display:"-webkit-box", WebkitLineClamp: big ? 3 : 2,
            WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {label.length > 120 ? label.slice(0, 120) + "…" : label}
          </p>
        </div>
      )}
    </Link>
  );
}


// ══════════════════════════════════════════════════════════════
export default function Home() {
  const windowWidth  = useWindowWidth();
  const isMobile     = windowWidth < 720;
  const [gallery,   setGallery]   = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);

  useVisitorTracker();

  useEffect(() => {
    fetchTotalVisitors().then(n => { if (n !== null) setVisitorCount(n); });

    const channel = supabase
      .channel("visitor-count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_visits" },
        () => {
          fetchTotalVisitors().then(n => { if (n !== null) setVisitorCount(n); });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const [anns, setAnns] = useState([]);

  const statsStagger  = useStagger(0.1);
  const objStagger    = useStagger(0.07);
  const spStagger     = useStagger(0.07);
  const pgStagger     = useStagger(0.07);
  const feedStagger   = useStagger(0.05);

  useEffect(() => {
    (async () => {
      const [{ data: g }, { data: a }] = await Promise.all([
        supabase.from("gallery").select("id,url,urls,caption,type,category").order("created_at",{ascending:false}).limit(4),
        supabase.from("announcements").select("id,title,body,author,category,pinned,created_at").order("pinned",{ascending:false}).order("created_at",{ascending:false}).limit(5),
      ]);
      if (g) setGallery(g);
      if (a) setAnns(a);
    })();
  }, []);

  const feed = [...gallery];
  while (feed.length < 4) feed.push(FEED_PLACEHOLDERS[feed.length % FEED_PLACEHOLDERS.length]);

const catEntries = Object.entries(PROGRAM);

const featuredEvents = [
  PROGRAM.sports?.items[0],
  PROGRAM.culturelles?.items[0],
  PROGRAM.festivals?.items[0],
  PROGRAM.scientifiques?.items[0],
  PROGRAM.sports?.items[1],
  PROGRAM.ceremonies?.items[0],
].filter(Boolean);

  const S = {
    page:     { background:"#f8f8f6", paddingTop:64, overflowX:"hidden" },
    maxW:     { maxWidth:1280, margin:"0 auto" },
    rule:     "1px solid rgba(10,10,10,.08)",
    ruleHeavy:"2px solid #ede9e0",
    secHdr:   { display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"1rem 2.5rem", borderBottom:"1px solid rgba(10,10,10,.08)",
                flexWrap:"wrap", gap:"0.5rem" },
  };

  return (
    <div style={S.page}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Fraunces:ital,wght@0,700;1,400&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        :root {
          --blue:#1565C0; --blue-dark:#0D47A1; --blue-light:#EEF4FF;
          --orange:#F57C00; --ink:#0A0A0A; --ink-soft:#3D3D38;
          --muted:#88887F; --rule:rgba(10,10,10,.08);
          --cream:#f8f8f6; --warm:#F5F0E8;
        }
        .ff-b { font-family:'Bebas Neue',sans-serif; }
        .ff-f { font-family:'Fraunces',serif; }
        .ff-m { font-family:'DM Mono',monospace; }

        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .ticker-run { animation: ticker 32s linear infinite; }

        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .ld0{opacity:0;animation:fadeUp .6s ease .05s forwards}
        .ld1{opacity:0;animation:fadeUp .6s ease .2s  forwards}
        .ld2{opacity:0;animation:fadeUp .6s ease .35s forwards}
        .ld3{opacity:0;animation:fadeUp .6s ease .5s  forwards}
        .ld4{opacity:0;animation:fadeUp .6s ease .65s forwards}

        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }
        .live { animation: livepulse 1.8s infinite; display:inline-block; }

        .stat-cell { position:relative; overflow:hidden; cursor:default; }
        .stat-cell::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,#1565C0,transparent);
          opacity:0; transition:opacity .3s;
        }
        .stat-cell:hover::after { opacity:1; }

        .obj-card { transition:background .25s; }
        .obj-card:hover { background:#F5F0E8 !important; }
        .obj-num  { transition:transform .3s; }
        .obj-card:hover .obj-num { transform:translateX(6px); }

        .prog-card { transition:background .22s; }
        .prog-card.light:hover { background:#F0ECE4 !important; }
        .prog-card.dark { background:#0A0A0A !important; }
        .prog-card.dark:hover { background:#111 !important; }

        .btn-blue  { transition:background .2s,transform .2s; }
        .btn-blue:hover  { background:#0D47A1 !important; transform:translateX(2px); }
        .btn-ink   { transition:background .2s,color .2s; }
        .btn-ink:hover   { background:#0A0A0A !important; color:#f8f8f6 !important; }
        .btn-ghost { transition:background .2s,border-color .2s,color .2s; }
        .btn-ghost:hover { background:rgba(255,255,255,.12) !important; border-color:#fff !important; color:#fff !important; }
        .lnk { transition:background .18s,color .18s; }
        .lnk:hover { background:#1565C0 !important; color:#fff !important; }

        .uni-reveal { transition:opacity 1.4s ease, transform 1.4s ease; }

        .p-logo { transition:transform .25s; }
        .p-logo:hover { transform:scale(1.06); }

        @media(max-width:900px){
          .g2{grid-template-columns:1fr !important;}
          .g3{grid-template-columns:repeat(2,1fr) !important;}
          .g4{grid-template-columns:repeat(2,1fr) !important;}
          .stats-g{grid-template-columns:repeat(2,1fr) !important;}
        }
        @media(max-width:640px){
          .g2{grid-template-columns:1fr !important;}
          .g3{grid-template-columns:1fr !important;}
          .g4{grid-template-columns:repeat(2,1fr) !important;}
          .hide-sm{display:none !important;}
          .ibar{flex-direction:column !important; align-items:flex-start !important; padding:1rem 1.25rem !important; gap:0.875rem !important;}
          .stats-g{grid-template-columns:repeat(2,1fr) !important;}
          .sec-pad{padding-left:1.25rem !important;padding-right:1.25rem !important;}
          .sec-hdr-mob{padding:0.875rem 1.25rem !important; flex-wrap:wrap !important;}
          .g4{grid-template-columns:repeat(2,1fr) !important;}
          .g3-mob{grid-template-columns:1fr !important;}
          .cta-mob{grid-template-columns:1fr !important; min-height:auto !important;}
          .visitor-strip{flex-direction:column !important; gap:0.5rem !important; text-align:center !important;}
          .visitor-divider{display:none !important;}
          .pad-mob{padding:1.5rem 1.25rem !important;}
          .partner-strip{height:48px !important;}
          .feed-side > *{min-height:140px !important;}
          .feed-strip{height:110px !important;}
          .sec-hdr-mob{padding:0.875rem 1.25rem !important;}
        }
        @media(max-width:400px){
          .g4{grid-template-columns:1fr !important;}
          .stats-g{grid-template-columns:1fr 1fr !important;}
        }
      `}</style>

      {/* ════════════════════════════
          1. TICKER
      ════════════════════════════ */}
      <div style={{ background:"#0a0a0a", padding:"0.45rem 0", overflow:"hidden" }}>
        <div className="ticker-run ff-m"
          style={{ display:"flex", gap:"4rem", whiteSpace:"nowrap",
            fontSize:"0.52rem", letterSpacing:"0.2em", textTransform:"uppercase",
            color:"rgba(255,255,255,.35)" }}>
          {Array(8).fill(null).map((_,i) => (
            <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:"1rem" }}>
              <span>STUD 2026</span><span style={{color:"#F57C00"}}>★</span>
              <span>24–30 AVRIL</span><span style={{color:"#F57C00"}}>★</span>
              <span>UNIVERSITÉ DE DOUALA</span><span style={{color:"#F57C00"}}>★</span>
              <span style={{marginRight:"3rem"}}>PERSONNEL ENGAGÉ, UNIVERSITÉ D'EXCELLENCE</span>
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════
          2. PARTNERS STRIP
      ════════════════════════════ */}
      <div style={{ background:"#fff", borderBottom:S.rule, overflow:"hidden" }}>
        <div style={{ ...S.maxW, display:"flex", alignItems:"stretch" }}>
          <div style={{ flexShrink:0, padding:"0 1.25rem", background:"#1565C0",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="ff-m" style={{ fontSize:"0.42rem", letterSpacing:"0.24em",
              textTransform:"uppercase", color:"rgba(255,255,255,.9)", whiteSpace:"nowrap" }}>
              Partenaires
            </span>
          </div>
          <div style={{ flex:1, overflow:"hidden", position:"relative", height:52 }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0, width:36,
              background:"linear-gradient(to right,#fff,transparent)", zIndex:2, pointerEvents:"none" }} />
            <div style={{ position:"absolute", right:0, top:0, bottom:0, width:36,
              background:"linear-gradient(to left,#fff,transparent)", zIndex:2, pointerEvents:"none" }} />
            <div className="ticker-run"
              style={{ display:"flex", alignItems:"center", gap:0, width:"max-content", height:"100%" }}>
              {[...PARTNERS,...PARTNERS,...PARTNERS,...PARTNERS].map((p,i) => (
                <div key={i} style={{ padding:"0 2.25rem", display:"flex", alignItems:"center",
                  justifyContent:"center", borderRight:S.rule, flexShrink:0, height:"100%" }}>
                  <img src={p.logo} alt={p.name} className="p-logo"
                    style={{ height:26, maxWidth:85, objectFit:"contain" }}
                    onError={e => { e.target.parentElement.style.display="none"; }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════
          3. IDENTITY BAR
      ════════════════════════════ */}
      <div style={{ background:"#fff", borderBottom:S.rule }}>
        <div className="ibar" style={{ ...S.maxW, display:"flex", alignItems:"center",
          gap:"1.5rem", padding:"1.5rem 2.5rem", flexWrap:"wrap" }}>

          <div className="ld0" style={{ display:"flex", alignItems:"center", gap:"1rem", flexShrink:0 }}>
            <img src={logo} alt="STUD 2026" style={{ height:48, width:"auto" }} />
            <div style={{ width:1, height:36, background:S.rule }} className="hide-sm" />
          </div>

          <div className="ld1" style={{ flex:1, minWidth:200 }}>
            <div className="ff-m" style={{ fontSize:"0.46rem", letterSpacing:"0.22em",
              textTransform:"uppercase", color:"#88887F", marginBottom:5 }}>
              Édition 2026 · 24–30 Avril · Université de Douala
            </div>
            <h1 className="ff-b" style={{ fontSize:"clamp(1.6rem,3.5vw,2.8rem)", lineHeight:.9,
              letterSpacing:"0.02em", color:"#0A0A0A", margin:0 }}>
              SEMAINE DU <span style={{color:"#1565C0"}}>TRAVAILLEUR</span>{" "}
              <span style={{color:"#F57C00"}}>2026</span>
            </h1>
          </div>

          <div className="ld2 hide-sm" style={{ flexShrink:0, paddingLeft:"1.75rem",
            borderLeft:S.rule }}>
            <div className="ff-m" style={{ fontSize:"0.42rem", letterSpacing:"0.2em",
              textTransform:"uppercase", color:"#88887F", marginBottom:3 }}>
              Compte à rebours
            </div>
            <Countdown compact />
          </div>
          {/* after the Countdown div, still inside the ibar flex container */}
{visitorCount !== null && (
  <div className="ld3 hide-sm" style={{
    flexShrink: 0, paddingLeft: "1.75rem", borderLeft: S.rule,
    display: "flex", flexDirection: "column", gap: 3,
  }}>
    <div className="ff-m" style={{ fontSize: "0.42rem", letterSpacing: "0.2em",
      textTransform: "uppercase", color: "#88887F" }}>
      Visiteurs
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4CAF50",
        display: "inline-block", flexShrink: 0,
        boxShadow: "0 0 0 2px rgba(76,175,80,.25)",
        animation: "livepulse 2s infinite" }} />
      <span className="ff-b" style={{ fontSize: "1.4rem", lineHeight: 1, color: "#0A0A0A" }}>
        {visitorCount.toLocaleString("fr-FR")}
      </span>
      <span className="ff-m" style={{ fontSize: "0.44rem", letterSpacing: "0.16em",
        textTransform: "uppercase", color: "#88887F" }}>
        STUD 2026
      </span>
    </div>
  </div>
)}
        </div>
      </div>

      {/* stats strip */}
      <div ref={statsStagger} className="stats-g"
        style={{ ...S.maxW, display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          background:"#fff", borderBottom:S.ruleHeavy }}>
        {STATS.map((s,i) => (
          <div key={i} className="stat-cell ld4"
            style={{ padding:"1rem 2rem", borderLeft: i>0?S.rule:"none" }}>
            <div className="ff-b" style={{ fontSize:"clamp(1.4rem,2.4vw,2.4rem)", lineHeight:1,
              color: i%2===0?"#0A0A0A":"#1565C0" }}>
              <Counter target={s.value} />
            </div>
            <div className="ff-m" style={{ fontSize:"0.44rem", textTransform:"uppercase",
              letterSpacing:"0.16em", color:"#88887F", marginTop:2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>



      {/* ════════════════════════════
          4. VISUAL FEED
          Big card left + right column:
            - image card top-right
            - ActualitésCard (announcements rebranded) + ÉtablissementsCard
      ════════════════════════════ */}
      <div className="pad-mob" style={{ ...S.maxW, padding:"2rem 2.5rem" }}>

        <Reveal delay={0.05}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            marginBottom:"1rem", flexWrap:"wrap", gap:"0.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
              <span className="live" style={{ width:8, height:8, borderRadius:"50%",
                background:"#F57C00", display:"inline-block" }} />
              <span className="ff-b" style={{ fontSize:"1.35rem", letterSpacing:"0.06em" }}>
                Moments en <span style={{color:"#1565C0"}}>Images</span>
              </span>
            </div>
            <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap" }}>
              <Link to="/announcements" className="lnk ff-m"
                style={{ border:"1px solid #F57C00", color:"#F57C00", padding:"0.28rem 0.7rem",
                  fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                  gap:"0.3rem", borderRadius:2 }}>
                Actualités <ArrowRight size={9} />
              </Link>
              <Link to="/gallery" className="lnk ff-m"
                style={{ border:"1px solid #1565C0", color:"#1565C0", padding:"0.28rem 0.7rem",
                  fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                  gap:"0.3rem", borderRadius:2 }}>
                Galerie <ArrowRight size={9} />
              </Link>
            </div>
          </div>
        </Reveal>

        {isMobile ? (
          <div ref={feedStagger} style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <ImgCard item={feed[0]} big style={{ height:240 }} />
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, height:155 }}>
              <ActualitesCard anns={anns} />
              <EtablissementsCard />
            </div>
            <ImgCard item={feed[1]} style={{ height:175 }} />
            <ImgCard item={feed[2]} style={{ height:155 }} />
          </div>
        ) : (
          <div ref={feedStagger}
            style={{ display:"grid",
              gridTemplateColumns:"1.5fr 1fr",
              gridTemplateRows:"260px 200px",
              gap:10 }}>

            {/* big card — left column, spans both rows */}
            <ImgCard item={feed[0]} big
              style={{ gridRow:"1 / 3", gridColumn:"1", height:"100%", borderRadius:10 }} />

            {/* top-right: image */}
            <ImgCard item={feed[1]}
              style={{ height:"100%", borderRadius:10 }} />

            {/* bottom-right: actualités + établissements */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, height:"100%" }}>
              <ActualitesCard anns={anns} />
              <EtablissementsCard />
            </div>
          </div>
        )}

      </div>

      {/* ════════════════════════════
          5. OBJECTIVES
      ════════════════════════════ */}
      <section style={{ borderBottom:S.ruleHeavy }}>
        <div style={{ ...S.maxW }}>
          <Reveal>
            <div className="sec-pad" style={{ ...S.secHdr }}>
              <span className="ff-b" style={{ fontSize:"1.35rem", letterSpacing:"0.06em" }}>
                Nos Objectifs
              </span>
              <span className="ff-m" style={{ fontSize:"0.46rem", textTransform:"uppercase",
                letterSpacing:"0.16em", color:"#88887F" }}>
                {"STUD 2026 — Section 01"}
              </span>
            </div>
          </Reveal>
          <div ref={objStagger} className="g4"
            style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {OBJECTIVES.map((o,i) => (
              <div key={i} className="obj-card"
                style={{ padding:"2.25rem 1.75rem", borderLeft: i>0?S.rule:"none" }}>
                <div className="obj-num ff-b"
                  style={{ fontSize:"4.5rem", lineHeight:1, marginBottom:"1.1rem",
                    color: i%2===0?"#1565C0":"#ddd" }}>
                  {o.num}
                </div>
                <div style={{ aspectRatio:"4/3", borderRadius:6, marginBottom:"1.1rem",
                  background: i%2===0?"#EEF4FF":"#FFF8EE",
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <img src={OBJ_ILLUSTRATIONS[i]} alt={o.title}
                    style={{ width:"72%", height:"72%", objectFit:"contain" }}
                    onError={e=>{ e.target.parentElement.style.display="none"; }} />
                </div>
                <h3 className="ff-f" style={{ fontWeight:700, fontSize:"0.95rem",
                  marginBottom:"0.45rem" }}>{o.title}</h3>
                <p className="ff-f" style={{ fontStyle:"italic", fontSize:"0.8rem",
                  color:"#3D3D38", lineHeight:1.75 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          6. UNIVERSITY
      ════════════════════════════ */}
      <section style={{ borderBottom:S.ruleHeavy }}>
        <div className="g2" style={{ ...S.maxW, display:"grid", gridTemplateColumns:"1fr 1fr" }}>
          <Reveal from="left">
            <div style={{ position:"relative", minHeight:440, overflow:"hidden" }}>
              <img src={uniImg} alt="Université de Douala" className="uni-reveal"
                style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                  objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0,
                background:"linear-gradient(160deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.05) 60%,transparent 100%)" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"2rem" }}>
                <div className="ff-m" style={{ fontSize:"0.48rem", letterSpacing:"0.2em",
                  textTransform:"uppercase", color:"rgba(255,255,255,.4)", marginBottom:6 }}>
                  Douala, Cameroun
                </div>
                <div className="ff-b" style={{ fontSize:"1.7rem", color:"#fff", letterSpacing:"0.04em" }}>
                  Université de Douala
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal from="right">
            <div style={{ padding:"3rem", background:"#fff", display:"flex",
              flexDirection:"column", justifyContent:"center", minHeight:440 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem",
                marginBottom:"1.75rem", flexWrap:"wrap" }}>
                <img src={uniLogo} alt="Logo UDo" style={{ height:44 }} />
                <div style={{ width:1, height:38, background:S.rule }} />
                <div className="ff-m" style={{ fontSize:"0.5rem", textTransform:"uppercase",
                  letterSpacing:"0.14em", color:"#88887F", lineHeight:1.8 }}>
                  Fondée en 1977<br/>48 871 Étudiants
                </div>
              </div>
              <h2 className="ff-b" style={{ fontSize:"clamp(1.8rem,3.5vw,3.4rem)",
                lineHeight:.95, letterSpacing:"0.02em", marginBottom:"1rem" }}>
                UN ÉVÉNEMENT<br/><span style={{color:"#1565C0"}}>INSTITUTIONNEL</span><br/>D'ENVERGURE
              </h2>
              <p className="ff-f" style={{ fontStyle:"italic", fontSize:"0.9rem",
                color:"#3D3D38", lineHeight:1.9, maxWidth:400, marginBottom:"1.75rem" }}>
                La STUD 2026 est organisée sous le haut patronage du {META.patron}, Recteur
                de l'Université de Douala. Elle réunit l'ensemble du personnel des 3 campus
                dans un esprit de célébration, de cohésion et d'excellence.
              </p>
              <Link to="/about" className="btn-blue ff-m"
                style={{ background:"#1565C0", color:"#fff", padding:"0.7rem 1.5rem",
                  fontSize:"0.54rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                  gap:"0.4rem", alignSelf:"flex-start", borderRadius:3 }}>
                Découvrir l'Université <ArrowRight size={12} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════
          7. FEATURED PROGRAMME
      ════════════════════════════ */}
      <section style={{ borderBottom:S.ruleHeavy }}>
        <div style={{ ...S.maxW }}>
          <Reveal>
            <div className="sec-pad" style={{ ...S.secHdr }}>
              <span className="ff-b" style={{ fontSize:"1.35rem", letterSpacing:"0.06em" }}>
                À l'Affiche
              </span>
              <Link to="/programme" className="lnk ff-m"
                style={{ border:"1px solid #1565C0", color:"#1565C0", padding:"0.28rem 0.7rem",
                  fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                  gap:"0.3rem", borderRadius:2 }}>
                Programme complet <ArrowRight size={9} />
              </Link>
            </div>
          </Reveal>
          <div ref={pgStagger} className="g3"
            style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }}>
            {featuredEvents.map((ev,i) => {
              const isDark = i===0;
              return (
                <div key={i} className={"prog-card " + (isDark ? "dark" : "light")}
                  style={{ padding:"2rem 2.25rem",
                    color: isDark?"rgba(255,255,255,.9)":"#0A0A0A",
                    borderLeft: i%3!==0?S.rule:"none",
                    borderBottom: i<3?S.rule:"none" }}>
                  <div className="ff-m" style={{ fontSize:"0.5rem", textTransform:"uppercase",
                    letterSpacing:"0.16em", color: isDark?"#F57C00":"#88887F",
                    marginBottom:"0.75rem" }}>{ev.date}</div>
                  <div style={{ height:56, display:"flex", alignItems:"center",
                    marginBottom:"0.75rem" }}>
                    <img src={`/assets/${ev.svg}`} alt={ev.name}
                      style={{ height:"100%", width:"auto", maxWidth:"50%", objectFit:"contain",
                        filter: isDark?"brightness(0) invert(1)":"none",
                        opacity: isDark ? .65 : 1 }}
                      onError={e=>{ e.target.style.display="none"; }} />
                  </div>
                  <h3 className="ff-f" style={{ fontWeight:700, fontSize:"0.95rem",
                    lineHeight:1.35, marginBottom:"0.5rem" }}>{ev.name}</h3>
                  <p className="ff-f" style={{ fontStyle:"italic", fontSize:"0.8rem",
                    lineHeight:1.7,
                    color: isDark?"rgba(255,255,255,.42)":"#3D3D38" }}>
                    {ev.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          8. SPONSORING
      ════════════════════════════ */}
      <section style={{ borderBottom:S.ruleHeavy, background:"#fff" }}>
        <div style={{ ...S.maxW }}>
          <Reveal>
            <div className="sec-pad" style={{ ...S.secHdr }}>
              <span className="ff-b" style={{ fontSize:"1.35rem", letterSpacing:"0.06em" }}>
                Packages Sponsoring
              </span>
              <Link to="/sponsoring" className="lnk ff-m"
                style={{ border:"1px solid #1565C0", color:"#1565C0", padding:"0.28rem 0.7rem",
                  fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                  gap:"0.3rem", borderRadius:2 }}>
                Voir les offres <ArrowRight size={9} />
              </Link>
            </div>
          </Reveal>
          <div ref={spStagger} className="g3"
            style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }}>
            {SPONSORING.map((offer,i) => (
              <div key={i} style={{ borderLeft: i>0?S.rule:"none" }}>
                <div style={{ height:4, background:offer.color }} />
                <div style={{ padding:"2.25rem 2rem" }}>
                  <div className="ff-m" style={{ fontSize:"0.5rem", textTransform:"uppercase",
                    letterSpacing:"0.2em", color:offer.color, marginBottom:"0.3rem" }}>
                    {offer.badge} Offre {offer.tier}
                  </div>
                  <div className="ff-b" style={{ fontSize:"clamp(1.8rem,3vw,3rem)",
                    lineHeight:1, marginBottom:"0.15rem" }}>{offer.price}</div>
                  <div className="ff-m" style={{ fontSize:"0.5rem", color:"#88887F",
                    marginBottom:"1.5rem" }}>{offer.currency}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:"0.45rem",
                    marginBottom:"1.5rem" }}>
                    {offer.visibility.slice(0,3).map((v,j) => (
                      <div key={j} className="ff-f"
                        style={{ display:"flex", gap:"0.55rem", fontSize:"0.8rem", color:"#3D3D38" }}>
                        <span style={{ color:offer.color, fontWeight:700 }}>—</span>{v}
                      </div>
                    ))}
                    {offer.visibility.length>3 && (
                      <div className="ff-m" style={{ fontSize:"0.48rem", color:"#88887F" }}>
                        {"+" + (offer.visibility.length - 3) + " avantages supplémentaires"}
                      </div>
                    )}
                  </div>
                  <Link to="/sponsoring"
                    style={{ display:"block", textAlign:"center",
                      border:`1.5px solid ${offer.color}`, color:offer.color,
                      padding:"0.75rem", fontSize:"0.55rem", textTransform:"uppercase",
                      letterSpacing:"0.14em", textDecoration:"none", borderRadius:2,
                      transition:"background .18s,color .18s" }}
                    onMouseEnter={e=>{ e.currentTarget.style.background=offer.color; e.currentTarget.style.color="#fff"; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=offer.color; }}>
                    En savoir plus <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <TestimonialsCarousel />

      {/* ════════════════════════════
          EVALUATION CTA STRIP
      ════════════════════════════ */}
      <Reveal>
        <section style={{ borderTop:"2px solid #ede9e0", borderBottom:"2px solid #ede9e0" }}>
          <div style={{ ...S.maxW, display:"flex", alignItems:"center",
            justifyContent:"space-between", flexWrap:"wrap", gap:"1.5rem",
            padding:"2.25rem 2.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1.25rem" }}>
              <div style={{ width:52, height:52, borderRadius:"50%", background:"#EEF4FF",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontSize:"1.4rem" }}>⭐</span>
              </div>
              <div>
                <div className="ff-m" style={{ fontSize:"0.46rem", textTransform:"uppercase",
                  letterSpacing:"0.2em", color:"#88887F", marginBottom:4 }}>
                  Votre avis compte
                </div>
                <h3 className="ff-b" style={{ fontSize:"clamp(1.1rem,2.5vw,1.7rem)",
                  letterSpacing:"0.04em", color:"#0A0A0A", margin:0, lineHeight:.95 }}>
                  ÉVALUEZ LA{" "}
                  <span style={{color:"#1565C0"}}>STUD 2026</span>
                </h3>
                <p className="ff-f" style={{ fontStyle:"italic", fontSize:"0.8rem",
                  color:"#88887F", margin:"0.35rem 0 0", lineHeight:1.5 }}>
                  Partagez votre expérience et aidez-nous à améliorer les prochaines éditions.
                </p>
              </div>
            </div>
            <Link to="/evaluation"
              style={{ flexShrink:0, background:"#1565C0", color:"#fff",
                padding:"0.85rem 2rem", fontFamily:"'DM Mono',monospace",
                fontSize:"0.58rem", letterSpacing:"0.16em", textTransform:"uppercase",
                textDecoration:"none", borderRadius:4,
                display:"inline-flex", alignItems:"center", gap:"0.5rem",
                transition:"background .2s, transform .2s",
                boxShadow:"0 2px 12px rgba(21,101,192,.2)" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="#0D47A1"; e.currentTarget.style.transform="translateX(2px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="#1565C0"; e.currentTarget.style.transform="none"; }}>
              Donner mon avis <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </Reveal>

      {/* ════════════════════════════
          9. BOTTOM CTA
      ════════════════════════════ */}
      <section>
        <div className="g2" style={{ ...S.maxW, display:"grid",
          gridTemplateColumns:"1fr 1fr", minHeight:250 }}>
          <Reveal from="left">
            <div style={{ padding:"3rem 2.5rem", display:"flex", flexDirection:"column",
              justifyContent:"space-between", borderRight:S.rule, background:"#fff",
              minHeight:250 }}>
              <div className="ff-m" style={{ fontSize:"0.46rem", textTransform:"uppercase",
                letterSpacing:"0.22em", color:"#88887F" }}>En savoir plus</div>
              <div>
                <h2 className="ff-b" style={{ fontSize:"clamp(2rem,4vw,4rem)", lineHeight:.92,
                  letterSpacing:"0.02em", marginBottom:"1.25rem" }}>
                  À PROPOS DE<br/><span style={{color:"#1565C0"}}>L'UNIVERSITÉ</span>
                </h2>
                <Link to="/about" className="btn-ink ff-m"
                  style={{ border:"1.5px solid #0A0A0A", color:"#0A0A0A",
                    padding:"0.7rem 1.5rem", fontSize:"0.54rem", letterSpacing:"0.14em",
                    textTransform:"uppercase", textDecoration:"none",
                    display:"inline-flex", alignItems:"center", gap:"0.4rem", borderRadius:3 }}>
                  Découvrir l'Histoire <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal from="right">
            <div style={{ padding:"3rem 2.5rem", background:"#0A0A0A",
              display:"flex", flexDirection:"column", justifyContent:"space-between",
              minHeight:250 }}>
              <div className="ff-m" style={{ fontSize:"0.46rem", textTransform:"uppercase",
                letterSpacing:"0.22em", color:"rgba(255,255,255,.25)" }}>Partenariat</div>
              <div>
                <h2 className="ff-b" style={{ fontSize:"clamp(2rem,4vw,4rem)", lineHeight:.92,
                  letterSpacing:"0.02em", color:"#FAFAF8", marginBottom:"1.25rem" }}>
                  DEVENEZ<br/>SPONSOR
                </h2>
                <Link to="/sponsoring" className="btn-ghost ff-m"
                  style={{ border:"1.5px solid rgba(255,255,255,.3)",
                    color:"rgba(255,255,255,.8)", padding:"0.7rem 1.5rem",
                    fontSize:"0.54rem", letterSpacing:"0.14em", textTransform:"uppercase",
                    textDecoration:"none", display:"inline-flex", alignItems:"center",
                    gap:"0.4rem", borderRadius:3 }}>
                  Voir les offres <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FeedbackFAB />
    </div>
  );
}