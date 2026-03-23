// ============================================================
// home.jsx — v5
// ✓ Partner logos full color (no grayscale)
// ✓ Announcements moved below FacultyStrip ("Ils Prendront Part")
// ✓ Rich scroll animations — staggered fade-up, slide-in, scale
// ✓ Partners carousel full color
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
import FacultyStrip from "../components/FacultyStrip";
import illuCohesion    from "../assets/icon-cohesion.svg";
import illuExcellence  from "../assets/icon-trophy.svg";
import illuCelebration from "../assets/icon-celebration.svg";
import illuSolidarity  from "../assets/icon-solidarity.svg";

import logoPad     from "../assets/pad.png";
import logoTradex  from "../assets/tradex.png";
import logoTotal   from "../assets/total.png";
import logoBossion from "../assets/bdc.webp";
import logoOrange  from "../assets/orange.webp";

const OBJ_ILLUSTRATIONS = [illuCohesion, illuExcellence, illuCelebration, illuSolidarity];

const PARTNERS = [
  { name: "Port Autonome de Douala", short: "PAD",    logo: logoPad     },
  { name: "Tradex",                  short: "TRADEX", logo: logoTradex  },
  { name: "Total Energies",          short: "TOTAL",  logo: logoTotal   },
  { name: "Brasseries du Cameroun",  short: "BDC",    logo: logoBossion },
  { name: "Orange Cameroun",         short: "ORANGE", logo: logoOrange  },
];

const CAT_COLORS = { Général:"#1565C0", Sport:"#F57C00", Culture:"#F9A825", Logistique:"#6B7280" };

const FEED_PLACEHOLDERS = [
  { _label:"Sports & Tournois",       _cat:"Sport",   _bg:"linear-gradient(150deg,#0f2447 0%,#1e4d8c 100%)" },
  { _label:"Culture & Arts",          _cat:"Culture", _bg:"linear-gradient(150deg,#3d1200 0%,#b84500 100%)" },
  { _label:"Cohésion d'Équipe",       _cat:"Général", _bg:"linear-gradient(150deg,#0a2e1a 0%,#1a7a40 100%)" },
  { _label:"Cérémonie de Clôture",    _cat:"Général", _bg:"linear-gradient(150deg,#1a0a2e 0%,#5a1f8c 100%)" },
];

// ─────────────────────────────────────────────────────────────
// useInView — fires once when element enters viewport
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// useStagger — animate children one by one on scroll
// Returns a ref to attach to the parent container
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Reveal — wraps any block with a scroll-triggered fade-up
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Counter
// ─────────────────────────────────────────────────────────────
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
// PartnersCarouselCard — full color logos, auto-cycle
// ─────────────────────────────────────────────────────────────
function PartnersCarouselCard() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const goTo = useCallback((next) => {
    setFading(true);
    setTimeout(() => { setIdx(next); setFading(false); }, 300);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo((idx + 1) % PARTNERS.length), 2600);
    return () => clearInterval(t);
  }, [idx, goTo]);

  const p = PARTNERS[idx];

  return (
    <div style={{
      position:"relative", background:"#fff",
      borderRadius:10, overflow:"hidden",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:"1.5rem 1rem", gap:"0.9rem",
      border:"1px solid rgba(10,10,10,.07)",
      boxShadow:"0 1px 6px rgba(0,0,0,.04)",
    }}>
      {/* top label */}
      <div style={{ position:"absolute", top:10, left:12, fontFamily:"'DM Mono',monospace",
        fontSize:"0.4rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#aaa" }}>
        Partenaires Officiels
      </div>

      {/* logo — full color */}
      <div style={{ transition:"opacity .3s ease", opacity: fading ? 0 : 1,
        display:"flex", alignItems:"center", justifyContent:"center", height:64 }}>
        <img src={p.logo} alt={p.name}
          style={{ maxHeight:64, maxWidth:140, objectFit:"contain" }}
          onError={e => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div style={{ display:"none", fontFamily:"'Bebas Neue',sans-serif",
          fontSize:"1.6rem", color:"#1565C0", letterSpacing:"0.06em" }}>
          {p.short}
        </div>
      </div>

      {/* name */}
      <div style={{ transition:"opacity .3s ease", opacity: fading ? 0 : 1,
        fontFamily:"'DM Mono',monospace", fontSize:"0.46rem", letterSpacing:"0.12em",
        color:"#88887F", textAlign:"center", textTransform:"uppercase" }}>
        {p.name}
      </div>

      {/* dots */}
      <div style={{ display:"flex", gap:5, alignItems:"center" }}>
        {PARTNERS.map((_,i) => (
          <button key={i} onClick={() => goTo(i)}
            style={{ width: i===idx?16:5, height:5, borderRadius:3, border:"none", cursor:"pointer", padding:0,
              background: i===idx?"#1565C0":"#e0e0e0",
              transition:"width .3s ease, background .3s ease" }} />
        ))}
      </div>

      {/* arrows */}
      <button onClick={() => goTo((idx-1+PARTNERS.length)%PARTNERS.length)}
        style={{ position:"absolute", left:6, top:"50%", transform:"translateY(-50%)",
          background:"rgba(0,0,0,.04)", border:"none", borderRadius:4, padding:"3px 5px",
          cursor:"pointer", color:"#aaa", display:"flex", alignItems:"center", lineHeight:1 }}>
        <ChevronLeft size={13} />
      </button>
      <button onClick={() => goTo((idx+1)%PARTNERS.length)}
        style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)",
          background:"rgba(0,0,0,.04)", border:"none", borderRadius:4, padding:"3px 5px",
          cursor:"pointer", color:"#aaa", display:"flex", alignItems:"center", lineHeight:1 }}>
        <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AnnouncementsCard — auto-cycling ticker card for the image grid
// ─────────────────────────────────────────────────────────────
function AnnouncementsCard({ anns }) {
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
          textTransform:"uppercase" }}>Annonces</span>
      </div>
    );
  }

  const ann = anns[idx];
  const cc  = CAT_C[ann.category] || "#1565C0";

  return (
    <Link to="/announcements" style={{ textDecoration:"none", display:"block",
      background:"#0A0A0A", borderRadius:10, overflow:"hidden",
      position:"relative", height:"100%" }}>
      {/* color bar */}
      <div style={{ height:3, background:cc, transition:"background .4s ease",
        flexShrink:0 }} />
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
              color:"rgba(255,255,255,0.38)" }}>Annonces</span>
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
            fontSize:"0.76rem", color:"#fff", lineHeight:1.35, margin:0,
            display:"-webkit-box", WebkitLineClamp:3,
            WebkitBoxOrient:"vertical", overflow:"hidden" }}>
            {ann.title}
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
              +{anns.length - 5}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
// ImgCard — full-bleed image, title overlay
// ─────────────────────────────────────────────────────────────
function ImgCard({ item, big = false, style = {} }) {
  const isVideo = item?.type === "video";
  const label   = item?.caption || item?._label || "";
  const cat     = item?.category || item?._cat   || "";
  const bg      = item?._bg || "#1a2744";
  const catColor = CAT_COLORS[cat] || "#1565C0";

  return (
    <Link to="/gallery" style={{ display:"block", position:"relative", overflow:"hidden",
      background:bg, textDecoration:"none", borderRadius:10, ...style }}>
      {item?.url && !isVideo && (
        <img src={item.url} alt={label}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
            transition:"transform .65s ease" }}
          onMouseOver={e => e.currentTarget.style.transform = "scale(1.04)"}
          onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
        />
      )}
      {isVideo && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,.35)" }}>
          <div style={{ width:50, height:50, borderRadius:"50%", background:"rgba(255,255,255,.18)",
            border:"1.5px solid rgba(255,255,255,.4)", display:"flex", alignItems:"center", justifyContent:"center",
            transition:"background .25s" }}>
            <Play size={18} color="#fff" fill="#fff" />
          </div>
        </div>
      )}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.18) 50%, transparent 100%)", pointerEvents:"none" }} />
      {cat && (
        <div style={{ position:"absolute", top:11, left:11 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:"0.42rem", letterSpacing:"0.2em",
            textTransform:"uppercase", background:catColor, color:"#fff",
            padding:"2px 8px", borderRadius:2 }}>
            {cat}
          </span>
        </div>
      )}
      {label && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding: big ? "1.5rem 1.25rem" : "0.85rem 1rem" }}>
          <p style={{ fontFamily:"'Fraunces',serif", fontWeight:700, color:"#fff",
            lineHeight:1.3, fontSize: big ? "1.2rem" : "0.82rem", margin:0 }}>
            {label}
          </p>
        </div>
      )}
    </Link>
  );
}

// ══════════════════════════════════════════════════════════════
export default function Home() {
  const [gallery,   setGallery]   = useState([]);
  const [visitorCount, setVisitorCount] = useState(null);

  // Track this visit (deduped per day)
  useVisitorTracker();

  // Fetch total unique visitors for counter
  // Real-time visitor count — updates live without page refresh
  useEffect(() => {
    // Initial fetch
    fetchTotalVisitors().then(n => { if (n !== null) setVisitorCount(n); });

    // Subscribe to inserts on site_visits table
    const channel = supabase
      .channel("visitor-count")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "site_visits" },
        () => {
          // New visit inserted → refetch total
          fetchTotalVisitors().then(n => { if (n !== null) setVisitorCount(n); });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);
  const [anns,    setAnns]    = useState([]);

  // stagger refs for grid sections
  const statsStagger  = useStagger(0.1);
  const objStagger    = useStagger(0.07);
  const spStagger     = useStagger(0.07);
  const pgStagger     = useStagger(0.07);
  const feedStagger   = useStagger(0.05);
  const annStagger    = useStagger(0.07);

  useEffect(() => {
    (async () => {
      const [{ data: g }, { data: a }] = await Promise.all([
        supabase.from("gallery").select("id,url,caption,type,category").order("created_at",{ascending:false}).limit(4),
        supabase.from("announcements").select("id,title,body,author,category,pinned,created_at").order("pinned",{ascending:false}).order("created_at",{ascending:false}).limit(3),
      ]);
      if (g) setGallery(g);
      if (a) setAnns(a);
    })();
  }, []);

  const feed = [...gallery];
  while (feed.length < 4) feed.push(FEED_PLACEHOLDERS[feed.length % FEED_PLACEHOLDERS.length]);

  const timeAgo = (iso) => {
    const d = Date.now() - new Date(iso).getTime(), m = Math.floor(d/60000);
    if (m<1) return "À l'instant"; if (m<60) return `Il y a ${m}min`;
    const h = Math.floor(m/60); if (h<24) return `Il y a ${h}h`;
    return `Il y a ${Math.floor(h/24)}j`;
  };

  const featuredEvents = [
    PROGRAM.sports[0], PROGRAM.cultural[7], PROGRAM.cultural[4],
    PROGRAM.intellectual[0], PROGRAM.sports[1], PROGRAM.cultural[5],
  ];

  // ── inline style helpers ──
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

      {/* ══════════ GLOBAL STYLES ══════════ */}
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

        /* ticker */
        @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .ticker-run { animation: ticker 32s linear infinite; }

        /* page load animations */
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .ld0{opacity:0;animation:fadeUp .6s ease .05s forwards}
        .ld1{opacity:0;animation:fadeUp .6s ease .2s  forwards}
        .ld2{opacity:0;animation:fadeUp .6s ease .35s forwards}
        .ld3{opacity:0;animation:fadeUp .6s ease .5s  forwards}
        .ld4{opacity:0;animation:fadeUp .6s ease .65s forwards}

        /* live dot */
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.75)} }
        .live { animation: livepulse 1.8s infinite; display:inline-block; }

        /* stat hover */
        .stat-cell { position:relative; overflow:hidden; cursor:default; }
        .stat-cell::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
          background:linear-gradient(90deg,transparent,#1565C0,transparent);
          opacity:0; transition:opacity .3s;
        }
        .stat-cell:hover::after { opacity:1; }

        /* obj */
        .obj-card { transition:background .25s; }
        .obj-card:hover { background:#F5F0E8 !important; }
        .obj-num  { transition:transform .3s; }
        .obj-card:hover .obj-num { transform:translateX(6px); }

        /* prog */
        .prog-card { transition:background .22s; }
        .prog-card.light:hover { background:#F0ECE4 !important; }
        .prog-card.dark { background:#0A0A0A !important; }
        .prog-card.dark:hover { background:#111 !important; }

        /* btn */
        .btn-blue  { transition:background .2s,transform .2s; }
        .btn-blue:hover  { background:#0D47A1 !important; transform:translateX(2px); }
        .btn-ink   { transition:background .2s,color .2s; }
        .btn-ink:hover   { background:#0A0A0A !important; color:#f8f8f6 !important; }
        .btn-ghost { transition:background .2s,border-color .2s,color .2s; }
        .btn-ghost:hover { background:rgba(255,255,255,.12) !important; border-color:#fff !important; color:#fff !important; }
        .lnk { transition:background .18s,color .18s; }
        .lnk:hover { background:#1565C0 !important; color:#fff !important; }

        /* ann card */
        .ann-card { transition:box-shadow .22s,transform .22s; }
        .ann-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.09); transform:translateY(-2px); }

        /* uni image */
        .uni-reveal { transition:opacity 1.4s ease, transform 1.4s ease; }

        /* partner strip logo */
        .p-logo { transition:transform .25s; }
        .p-logo:hover { transform:scale(1.06); }

        /* ── RESPONSIVE ── */
        @media(max-width:900px){
          .g2{grid-template-columns:1fr !important;}
          .g3{grid-template-columns:repeat(2,1fr) !important;}
          .g4{grid-template-columns:repeat(2,1fr) !important;}
          .feed-grid{grid-template-columns:1fr !important;grid-template-rows:auto !important;}
          .feed-big{grid-row:auto !important; height:260px !important;}
          .feed-img-top{height:180px !important;}
          .feed-side{grid-template-columns:1fr 1fr !important; height:160px !important;}
          .stats-g{grid-template-columns:repeat(2,1fr) !important;}
        }
        @media(max-width:640px){
          .g2{grid-template-columns:1fr !important;}
          .g3{grid-template-columns:1fr !important;}
          .g4{grid-template-columns:repeat(2,1fr) !important;}
          .hide-sm{display:none !important;}

          /* identity bar — stack vertically */
          .ibar{flex-direction:column !important; align-items:flex-start !important; padding:1rem 1.25rem !important; gap:0.875rem !important;}

          /* stats — 2 columns */
          .stats-g{grid-template-columns:repeat(2,1fr) !important;}

          /* partner strip — tighter */
          .sec-pad{padding-left:1.25rem !important;padding-right:1.25rem !important;}

          /* feed grid — single column on mobile */
          .feed-grid{grid-template-columns:1fr !important;grid-template-rows:auto !important;}
          .feed-big{grid-row:auto !important; height:220px !important;}
          .feed-img-top{height:160px !important;}
          .feed-side{grid-template-columns:1fr 1fr !important; height:150px !important;}

          /* section headers */
          .sec-hdr-mob{padding:0.875rem 1.25rem !important; flex-wrap:wrap !important;}

          /* objectives — 2 col on mobile */
          .g4{grid-template-columns:repeat(2,1fr) !important;}

          /* prog/sp — 1 col */
          .g3-mob{grid-template-columns:1fr !important;}

          /* CTA */
          .cta-mob{grid-template-columns:1fr !important; min-height:auto !important;}

          /* visitor strip */
          .visitor-strip{flex-direction:column !important; gap:0.5rem !important; text-align:center !important;}
          .visitor-divider{display:none !important;}

          /* general padding */
          .pad-mob{padding:1.5rem 1.25rem !important;}

          /* fix partners strip height */
          .partner-strip{height:48px !important;}

          /* announcement card in grid — ensure not hidden */
          .feed-side > *{min-height:140px !important;}

          /* wide strip */
          .feed-strip{height:110px !important;}

          /* section spacers */
          .sec-hdr-mob{padding:0.875rem 1.25rem !important;}
        }
        @media(max-width:400px){
          .g4{grid-template-columns:1fr !important;}
          .stats-g{grid-template-columns:1fr 1fr !important;}
          .feed-big{height:190px !important;}
          .feed-side{height:130px !important;}
          .feed-img-top{height:130px !important;}
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
          2. PARTNERS STRIP — full color logos
      ════════════════════════════ */}
      <div style={{ background:"#fff", borderBottom:S.rule, overflow:"hidden" }}>
        <div style={{ ...S.maxW, display:"flex", alignItems:"stretch" }}>
          {/* blue label tab */}
          <div style={{ flexShrink:0, padding:"0 1.25rem", background:"#1565C0",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span className="ff-m" style={{ fontSize:"0.42rem", letterSpacing:"0.24em",
              textTransform:"uppercase", color:"rgba(255,255,255,.9)", whiteSpace:"nowrap" }}>
              Partenaires
            </span>
          </div>
          {/* scrolling logos */}
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

          <div className="ld2 hide-sm" style={{ flexShrink:0, display:"flex",
            alignItems:"center", gap:"0.65rem", paddingLeft:"1.75rem", borderLeft:S.rule }}>
            <img src={uniLogo} alt="UDo" style={{ height:28, opacity:.75 }} />
            <div>
              <div className="ff-f" style={{ fontWeight:700, fontSize:"0.72rem", color:"#0A0A0A" }}>
                {META.patron}
              </div>
              <div className="ff-m" style={{ fontSize:"0.4rem", textTransform:"uppercase",
                letterSpacing:"0.12em", color:"#88887F" }}>
                Haut Patronage
              </div>
            </div>
          </div>

          <div className="ld3" style={{ display:"flex", gap:"0.5rem", flexShrink:0, flexWrap:"wrap" }}>
            <Link to="/programme" className="btn-blue ff-m"
              style={{ background:"#1565C0", color:"#fff", padding:"0.6rem 1.25rem",
                fontSize:"0.54rem", letterSpacing:"0.14em", textTransform:"uppercase",
                textDecoration:"none", display:"inline-flex", alignItems:"center",
                gap:"0.4rem", borderRadius:3 }}>
              Programme <ArrowRight size={11} />
            </Link>
            <Link to="/sponsoring" className="btn-ink ff-m"
              style={{ border:"1.5px solid #0A0A0A", color:"#0A0A0A", padding:"0.6rem 1.25rem",
                fontSize:"0.54rem", letterSpacing:"0.14em", textTransform:"uppercase",
                textDecoration:"none", borderRadius:3 }}>
              Sponsor
            </Link>
          </div>
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

      {/* ── VISITOR COUNTER STRIP ── */}
      {visitorCount !== null && (
        <Reveal>
          <div style={{ background:"#0A0A0A", borderBottom:S.ruleHeavy }}>
            <div className="visitor-strip" style={{ ...S.maxW, display:"flex", alignItems:"center",
              justifyContent:"center", gap:"1rem", padding:"0.75rem 2.5rem",
              flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <span style={{ width:7, height:7, borderRadius:"50%",
                  background:"#4CAF50", display:"inline-block",
                  boxShadow:"0 0 0 2px rgba(76,175,80,.3)",
                  animation:"livepulse 2s infinite" }} />
                <span className="ff-m" style={{ fontSize:"0.48rem",
                  letterSpacing:"0.2em", textTransform:"uppercase",
                  color:"rgba(255,255,255,.4)" }}>
                  Site en ligne
                </span>
              </div>
              <div className="visitor-divider" style={{ width:1, height:16,
                background:"rgba(255,255,255,.1)" }} />
              <div style={{ display:"flex", alignItems:"baseline", gap:"0.5rem" }}>
                <span className="ff-b" style={{ fontSize:"1.4rem",
                  letterSpacing:"0.04em", color:"#fff", lineHeight:1 }}>
                  {visitorCount.toLocaleString("fr-FR")}
                </span>
                <span className="ff-m" style={{ fontSize:"0.46rem",
                  letterSpacing:"0.18em", textTransform:"uppercase",
                  color:"rgba(255,255,255,.4)" }}>
                  visiteurs uniques
                </span>
              </div>
              <div className="visitor-divider" style={{ width:1, height:16,
                background:"rgba(255,255,255,.1)" }} />
              <span className="ff-m" style={{ fontSize:"0.44rem",
                letterSpacing:"0.14em", textTransform:"uppercase",
                color:"rgba(255,255,255,.28)" }}>
                STUD 2026
              </span>
            </div>
          </div>
        </Reveal>
      )}

      {/* ════════════════════════════
          4. VISUAL FEED
          Big card left + right column:
            - small image
            - announcements card (cool ticker style)
            - partners carousel
          Bottom: wide image strip
      ════════════════════════════ */}
      <div className="pad-mob" style={{ ...S.maxW, padding:"2rem 2.5rem" }}>

        {/* section header */}
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
                Annonces <ArrowRight size={9} />
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

        {/* main 2-col grid */}
        {/* Desktop: 2-col grid. Mobile: stacked via CSS classes */}
        <div ref={feedStagger} className="feed-grid"
          style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr",
            gridTemplateRows:"240px 240px", gap:10, marginBottom:10 }}>

          {/* BIG card — spans 2 rows on desktop, auto height on mobile */}
          <ImgCard item={feed[0]} big
            style={{ gridRow:"1 / 3" }}
            className="feed-big" />

          {/* top-right: small image */}
          <ImgCard item={feed[1]}
            style={{ borderRadius:10 }}
            className="feed-img-top" />

          {/* bottom-right: announcements + partners side by side */}
          <div className="feed-side"
            style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <AnnouncementsCard anns={anns} />
            <PartnersCarouselCard />
          </div>
        </div>

        {/* wide strip — always visible */}
        <Reveal delay={0.1}>
          <ImgCard item={feed[2]}
            style={{ height:140, borderRadius:10, display:"block" }} />
        </Reveal>
      </div>

      {/* ════════════════════════════
          5. FACULTY STRIP — "Ils Prendront Part"
      ════════════════════════════ */}
      <FacultyStrip />

      {/* ════════════════════════════
          6. ANNOUNCEMENTS
          (moved here, below faculty strip)
      ════════════════════════════ */}
      <div style={{ background:"#fff", borderTop:S.ruleHeavy, borderBottom:S.ruleHeavy }}>
        <div style={{ ...S.maxW }}>
          <Reveal>
            <div className="sec-pad" style={{ ...S.secHdr }}>
              <span className="ff-b" style={{ fontSize:"1.35rem", letterSpacing:"0.06em",
                display:"flex", alignItems:"center", gap:"0.5rem" }}>
                <Megaphone size={18} strokeWidth={1.5} style={{color:"#F57C00"}} />
                Dernières <span style={{color:"#F57C00", marginLeft:5}}>Annonces</span>
              </span>
              <Link to="/announcements" className="lnk ff-m"
                style={{ border:"1px solid #1565C0", color:"#1565C0", padding:"0.28rem 0.7rem",
                  fontSize:"0.5rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  textDecoration:"none", display:"inline-flex", alignItems:"center",
                  gap:"0.3rem", borderRadius:2 }}>
                Toutes <ArrowRight size={9} />
              </Link>
            </div>
          </Reveal>

          {anns.length === 0 ? (
            <Reveal delay={0.1}>
              <div style={{ padding:"3rem 2.5rem", textAlign:"center" }}>
                <p className="ff-f" style={{ fontStyle:"italic", color:"#88887F", fontSize:"0.9rem" }}>
                  Aucune annonce pour le moment.
                </p>
              </div>
            </Reveal>
          ) : (
            <div ref={annStagger} className="g3"
              style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)" }}>
              {anns.map((ann, i) => {
                const cc = CAT_COLORS[ann.category] || "#1565C0";
                return (
                  <Link key={ann.id} to="/announcements" className="ann-card"
                    style={{ display:"flex", flexDirection:"column", textDecoration:"none",
                      height:"100%", borderLeft: i>0?S.rule:"none" }}>
                    {/* top color bar */}
                    <div style={{ height:4, background:cc, flexShrink:0 }} />
                    <div style={{ padding:"1.5rem 2rem", display:"flex", flexDirection:"column",
                      gap:"0.6rem", flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", flexWrap:"wrap" }}>
                        {ann.pinned && <Pin size={10} style={{color:cc}} />}
                        <span className="ff-m" style={{ fontSize:"0.46rem", textTransform:"uppercase",
                          letterSpacing:"0.16em", color:cc }}>{ann.category}</span>
                        <span className="ff-m" style={{ fontSize:"0.44rem", color:"#88887F",
                          marginLeft:"auto" }}>{timeAgo(ann.created_at)}</span>
                      </div>
                      <h3 className="ff-f" style={{ fontWeight:700, fontSize:"0.95rem",
                        color:"#0A0A0A", lineHeight:1.4, margin:0 }}>{ann.title}</h3>
                      <p className="ff-f" style={{ fontStyle:"italic", fontSize:"0.8rem",
                        color:"#3D3D38", lineHeight:1.7, margin:0, flex:1 }}>
                        {ann.body.length>110 ? ann.body.slice(0,110)+"…" : ann.body}
                      </p>
                      <div className="ff-m" style={{ fontSize:"0.44rem", color:"#88887F",
                        paddingTop:"0.5rem", borderTop:S.rule }}>{ann.author}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════
          7. OBJECTIVES
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
                STUD 2026 — Section 01
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
          8. UNIVERSITY
      ════════════════════════════ */}
      <section style={{ borderBottom:S.ruleHeavy }}>
        <div className="g2" style={{ ...S.maxW, display:"grid", gridTemplateColumns:"1fr 1fr" }}>
          {/* image side */}
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

          {/* text side */}
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
          9. FEATURED PROGRAMME
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
                <div key={i} className={`prog-card ${isDark?"dark":"light"}`}
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
          10. SPONSORING
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
                        +{offer.visibility.length-3} avantages supplémentaires
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
                    En savoir plus →
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
          Visible to all visitors
      ════════════════════════════ */}
      <Reveal>
        <section style={{ borderTop:"2px solid #ede9e0", borderBottom:"2px solid #ede9e0" }}>
          <div style={{ ...S.maxW, display:"flex", alignItems:"center",
            justifyContent:"space-between", flexWrap:"wrap", gap:"1.5rem",
            padding:"2.25rem 2.5rem" }}>

            {/* left: icon + text */}
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

            {/* right: CTA button */}
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
          11. BOTTOM CTA
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
                  Découvrir l'Histoire →
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
                  Voir les offres →
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