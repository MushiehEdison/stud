import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Pin } from "lucide-react";
import { META, STATS, OBJECTIVES, SPONSORING, PROGRAM } from "../data";
import logo from "../assets/logo.png";
import uniLogo from "../assets/University_of_Douala_Logo.jpg";
import uniImg from "../assets/uni.jpg";
import Countdown from "../components/countdown";
import { supabase } from "../lib/superbase";

// ── SVG imports ──────────────────────────────────────────────
import iconSport   from "../assets/icon-sport.svg";
import iconCulture from "../assets/icon-culture.svg";
import iconTrophy  from "../assets/icon-trophy.svg";
// ────────────────────────────────────────────────────────────

const OBJ_ICONS = [iconTrophy, iconSport, iconCulture, iconTrophy];

function useInView(t = 0.1) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: t });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function Counter({ target }) {
  const [n, setN] = useState(0);
  const [ref, v] = useInView(0.3);
  useEffect(() => {
    if (!v) return;
    let cur = 0;
    const dur = 1600, step = 16;
    const inc = target / (dur / step);
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setN(target); clearInterval(t); }
      else setN(Math.floor(cur));
    }, step);
    return () => clearInterval(t);
  }, [v, target]);
  return <span ref={ref}>{n.toLocaleString("fr-FR")}</span>;
}

const CAT_COLORS = { Général: "#1565C0", Sport: "#F57C00", Culture: "#F9A825", Logistique: "#6B7280" };

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [objRef, objV] = useInView();
  const [spRef, spV] = useInView();
  const [pgRef, pgV] = useInView();
  const [uniRef, uniV] = useInView();
  const [mediaRef, mediaV] = useInView();

  // ── Supabase data ──────────────────────────────────────────
  const [galleryItems, setGalleryItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchHome = async () => {
      const [{ data: gallery }, { data: anns }] = await Promise.all([
        supabase
          .from("gallery")
          .select("id, url, caption, type, category")
          .order("created_at", { ascending: false })
          .limit(4),
        supabase
          .from("announcements")
          .select("id, title, body, author, category, pinned, created_at")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(3),
      ]);
      if (gallery) setGalleryItems(gallery);
      if (anns)    setAnnouncements(anns);
    };
    fetchHome();
  }, []);
  // ──────────────────────────────────────────────────────────

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const featuredEvents = [
    PROGRAM.sports[0], PROGRAM.cultural[7], PROGRAM.cultural[4],
    PROGRAM.intellectual[0], PROGRAM.sports[1], PROGRAM.cultural[5],
  ];

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
    <div style={{ background: "#FAFAF8", paddingTop: 64 }}>

      {/* ── TICKER ── */}
      <div style={{ background: "#1565C0", padding: "0.45rem 0", overflow: "hidden", borderBottom: "1.5px solid #0D47A1" }}>
        <div style={{ display: "flex", gap: "4rem", animation: "ticker 22s linear infinite", whiteSpace: "nowrap", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.8)", textTransform: "uppercase" }}>
          {Array(6).fill(null).map((_, i) => <span key={i}>★ STUD 2026 · 24–30 AVRIL · UNIVERSITÉ DE DOUALA · PERSONNEL ENGAGÉ, UNIVERSITÉ D'EXCELLENCE ·&nbsp;</span>)}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="hero-grid">
          <div style={{ padding: "4rem 3rem 3.5rem", borderRight: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "2.5rem" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "1.5px solid #0F0F0F", padding: "0.3rem 0.8rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "2rem", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)", transition: "all 0.5s ease 0.1s" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F57C00", display: "inline-block" }} />
                Édition 2026
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(4.5rem, 10vw, 10rem)", lineHeight: 0.88, letterSpacing: "0.02em", color: "#0F0F0F", opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)", transition: "all 0.7s ease 0.2s" }}>
                SE<span style={{ color: "#1565C0" }}>MA</span>
                INE
                DU<br />
                TRA<span style={{ color: "#F57C00" }}>VAI</span>
                LLEUR
              </h1>
            </div>
            <div style={{ opacity: loaded ? 1 : 0, transition: "all 0.7s ease 0.5s" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "1rem", color: "#666660", lineHeight: 1.75, maxWidth: 380, marginBottom: "2rem" }}>
                «{META.theme}»
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link to="/programme" style={btnPrimary} onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"} onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}>
                  Voir le Programme <ArrowRight size={14} />
                </Link>
                <Link to="/sponsoring" style={btnOutline} onMouseEnter={e => { e.currentTarget.style.background = "#0F0F0F"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0F"; }}>
                  Devenir Sponsor
                </Link>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}>
            <div style={{ flex: 1, padding: "2.5rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <img src={logo} alt="STUD 2026" style={{ height: 64, width: "auto" }} />
                <div style={{ width: "1.5px", height: 52, background: "#EAEAE5" }} />
                <div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase", marginBottom: 4 }}>Compte à rebours</div>
                  <Countdown compact />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              {STATS.map((s, i) => (
                <div key={i} style={{ padding: "1.75rem 2rem", borderTop: "1.5px solid #0F0F0F", borderRight: i % 2 === 0 ? "1.5px solid #0F0F0F" : "none" }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", lineHeight: 1, color: i % 2 === 0 ? "#0F0F0F" : "#1565C0", letterSpacing: "0.02em" }}>
                    <Counter target={s.value} />
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.14em", color: "#88887F", textTransform: "uppercase", marginTop: "0.3rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "1.25rem 2rem", borderTop: "1.5px solid #0F0F0F", display: "flex", alignItems: "center", gap: "1rem" }}>
              <img src={uniLogo} alt="Université de Douala" style={{ height: 36, width: "auto", opacity: 0.85 }} />
              <div>
                <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.82rem" }}>{META.patron}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>Haut Patronage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN BANNER ── */}
      <section style={{ borderBottom: "1.5px solid #0F0F0F", background: "#EEF4FF" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", alignItems: "center" }} className="cd-grid">
          <div style={{ padding: "2.5rem 2rem", borderRight: "1.5px solid #0F0F0F" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase", marginBottom: "0.5rem" }}>Décompte officiel</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.04em", lineHeight: 1.1 }}>
              AVANT L'OUVERTURE<br />
              <span style={{ color: "#1565C0" }}>STUD 2026</span>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#F57C00", letterSpacing: "0.1em", marginTop: "0.5rem" }}>{META.dates}</div>
          </div>
          <div style={{ padding: "2rem" }}>
            <Countdown />
          </div>
        </div>
      </section>

      {/* ── UNIVERSITY SECTION ── */}
      <section ref={uniRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="uni-grid">
          <div style={{ position: "relative", overflow: "hidden", minHeight: 420 }}>
            <img src={uniImg} alt="Université de Douala" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: uniV ? 1 : 0.3, transform: uniV ? "scale(1)" : "scale(1.05)", transition: "all 1.2s ease" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(13,27,42,0.7) 0%, transparent 60%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2rem" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: 6 }}>Douala, Cameroun</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>Université de Douala</div>
            </div>
          </div>
          <div style={{ padding: "3.5rem 3rem", display: "flex", flexDirection: "column", justifyContent: "center", opacity: uniV ? 1 : 0, transform: uniV ? "none" : "translateX(20px)", transition: "all 0.8s ease 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <img src={uniLogo} alt="Logo UDo" style={{ height: 52, width: "auto" }} />
              <div style={{ width: "1.5px", height: 40, background: "#EAEAE5" }} />
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.14em", color: "#88887F", textTransform: "uppercase", lineHeight: 1.6 }}>
                Fondée en 1977<br />48 871 Étudiants
              </div>
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "1rem" }}>
              UN ÉVÉNEMENT<br /><span style={{ color: "#1565C0" }}>INSTITUTIONNEL</span><br />D'ENVERGURE
            </h2>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.95rem", color: "#555550", lineHeight: 1.85, maxWidth: 420, marginBottom: "2rem" }}>
              La STUD 2026 est organisée sous le haut patronage du {META.patron}, Recteur de l'Université de Douala. Elle réunit l'ensemble du personnel des 3 campus dans un esprit de célébration, de cohésion et d'excellence.
            </p>
            <Link to="/about" style={btnPrimary} onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"} onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}>
              Découvrir l'Université <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── LATEST GALLERY PREVIEW ── */}
      <section ref={mediaRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>
              Derniers <span style={{ color: "#1565C0" }}>Moments</span>
            </span>
            <Link to="/gallery" style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1565C0", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Voir la galerie <ArrowRight size={12} />
            </Link>
          </div>

          {galleryItems.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", color: "#EAEAE5", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>À VENIR</div>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#88887F", fontSize: "0.9rem" }}>Les photos de l'événement seront publiées ici.</p>
              <Link to="/gallery" style={{ ...btnPrimary, display: "inline-flex", marginTop: "1.5rem" }} onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"} onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}>
                Accéder à la galerie <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="gallery-prev">
              {galleryItems.map((item, i) => (
                <Link key={item.id} to="/gallery" style={{
                  textDecoration: "none", display: "block",
                  borderRight: i < 3 ? "1.5px solid #0F0F0F" : "none",
                  overflow: "hidden", position: "relative",
                  aspectRatio: "1",
                  opacity: mediaV ? 1 : 0,
                  transform: mediaV ? "none" : "scale(0.97)",
                  transition: `all 0.5s ease ${i * 0.08}s`,
                }}>
                  {item.type === "video" ? (
                    <div style={{ width: "100%", height: "100%", background: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Play size={18} color="#fff" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption || ""}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                  )}
                  {/* Caption on hover */}
                  {item.caption && (
                    <>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 55%, rgba(0,0,0,0.65))", opacity: 0, transition: "opacity 0.3s", pointerEvents: "none" }}
                        className="gallery-overlay"
                      />
                      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.75rem", fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.75rem", color: "#fff", transform: "translateY(100%)", transition: "transform 0.3s", pointerEvents: "none" }}
                        className="gallery-caption"
                      >{item.caption}</div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LATEST ANNOUNCEMENTS PREVIEW ── */}
      <section style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>
              Dernières <span style={{ color: "#F57C00" }}>Annonces</span>
            </span>
            <Link to="/announcements" style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1565C0", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Toutes les annonces <ArrowRight size={12} />
            </Link>
          </div>

          {announcements.length === 0 ? (
            <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#88887F" }}>Aucune annonce pour le moment.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="ann-prev">
              {announcements.map((ann, i) => {
                const catColor = CAT_COLORS[ann.category] || "#1565C0";
                return (
                  <Link key={ann.id} to="/announcements" style={{
                    textDecoration: "none",
                    borderRight: i < 2 ? "1.5px solid #0F0F0F" : "none",
                    display: "flex", flexDirection: "column",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F5F8FF"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ height: 3, background: catColor }} />
                    <div style={{ padding: "1.75rem 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {ann.pinned && <Pin size={11} color={catColor} />}
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.12em", textTransform: "uppercase", color: catColor }}>{ann.category}</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#88887F", marginLeft: "auto" }}>{timeAgo(ann.created_at)}</span>
                      </div>
                      <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", lineHeight: 1.35, color: "#0F0F0F" }}>{ann.title}</h3>
                      <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.82rem", color: "#666660", lineHeight: 1.65 }}>
                        {ann.body.length > 120 ? ann.body.slice(0, 120) + "…" : ann.body}
                      </p>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", marginTop: "auto" }}>{ann.author}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── OBJECTIVES ── */}
      <section ref={objRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>Nos Objectifs</span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase" }}>STUD 2026 — Section 01</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="obj-grid">
            {OBJECTIVES.map((o, i) => (
              <div key={i} style={{ padding: "2.5rem 2rem", borderRight: i < 3 ? "1.5px solid #0F0F0F" : "none", opacity: objV ? 1 : 0, transform: objV ? "none" : "translateY(20px)", transition: `all 0.6s ease ${i * 0.1}s` }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "4.5rem", lineHeight: 1, color: i % 2 === 0 ? "#1565C0" : "#EAEAE5", marginBottom: "0.75rem", letterSpacing: "0.02em" }}>{o.num}</div>
                <img src={OBJ_ICONS[i]} alt="" aria-hidden="true" style={{ width: 28, height: 28, marginBottom: "1rem", opacity: 0.5 }} onError={e => { e.target.style.display = "none"; }} />
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1rem", marginBottom: "0.65rem", lineHeight: 1.3 }}>{o.title}</h3>
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.82rem", color: "#666660", lineHeight: 1.7 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROGRAMME ── */}
      <section ref={pgRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>À l'Affiche</span>
            <Link to="/programme" style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1565C0", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Programme complet <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="prog-grid">
            {featuredEvents.map((ev, i) => (
              <div key={i} style={{ padding: "2rem", borderRight: (i + 1) % 3 !== 0 ? "1.5px solid #0F0F0F" : "none", borderBottom: i < 3 ? "1.5px solid #0F0F0F" : "none", background: i === 0 ? "#0D1B2A" : "transparent", color: i === 0 ? "#FAFAF8" : "#0F0F0F", opacity: pgV ? 1 : 0, transform: pgV ? "none" : "translateY(16px)", transition: `all 0.55s ease ${i * 0.07}s` }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: i === 0 ? "#F57C00" : "#88887F", marginBottom: "0.75rem" }}>{ev.date}</div>
                <div style={{ width: 40, height: 40, marginBottom: "0.75rem" }}>
                  <img src={`/assets/${ev.svg}`} alt={ev.name} style={{ width: 40, height: 40, filter: i === 0 ? "brightness(0) invert(1)" : "none" }} onError={e => { e.target.style.display = "none"; }} />
                </div>
                <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.3, marginBottom: "0.5rem" }}>{ev.name}</h3>
                <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.82rem", lineHeight: 1.65, color: i === 0 ? "rgba(255,255,255,0.5)" : "#666660" }}>{ev.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPONSORING PREVIEW ── */}
      <section ref={spRef} style={{ borderBottom: "1.5px solid #0F0F0F" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ padding: "1.5rem 2rem", borderBottom: "1.5px solid #0F0F0F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.04em" }}>Packages Sponsoring</span>
            <Link to="/sponsoring" style={{ textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1565C0", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              Voir les offres <ArrowRight size={12} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="sp-grid">
            {SPONSORING.map((offer, i) => (
              <div key={i} style={{ borderRight: i < 2 ? "1.5px solid #0F0F0F" : "none", opacity: spV ? 1 : 0, transform: spV ? "none" : "translateY(20px)", transition: `all 0.6s ease ${i * 0.15}s` }}>
                <div style={{ height: 4, background: offer.color }} />
                <div style={{ padding: "2.5rem 2rem" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.18em", color: offer.color, marginBottom: "0.4rem" }}>{offer.badge} OFFRE {offer.tier.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3.2rem)", lineHeight: 1, marginBottom: "0.2rem", letterSpacing: "0.02em" }}>{offer.price}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#88887F", letterSpacing: "0.1em", marginBottom: "2rem" }}>{offer.currency}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                    {offer.visibility.slice(0, 3).map((v, j) => (
                      <div key={j} style={{ display: "flex", gap: "0.6rem", fontFamily: "'Fraunces', serif", fontSize: "0.82rem", color: "#333", lineHeight: 1.4 }}>
                        <span style={{ color: offer.color, flexShrink: 0, fontWeight: 700 }}>—</span>{v}
                      </div>
                    ))}
                    {offer.visibility.length > 3 && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "#88887F" }}>+{offer.visibility.length - 3} avantages…</div>}
                  </div>
                  <Link to="/sponsoring" style={{ display: "block", textAlign: "center", textDecoration: "none", border: `1.5px solid ${offer.color}`, color: offer.color, padding: "0.75rem 1.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.12em", textTransform: "uppercase", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = offer.color; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = offer.color; }}
                  >En savoir plus →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 280 }} className="cta-grid">
          <div style={{ padding: "4rem 3rem", borderRight: "1.5px solid #0F0F0F", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "#88887F", textTransform: "uppercase" }}>En savoir plus</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em", marginBottom: "1.5rem" }}>
                À PROPOS DE<br /><span style={{ color: "#1565C0" }}>L'UNIVERSITÉ</span>
              </h2>
              <Link to="/about" style={btnOutline} onMouseEnter={e => { e.currentTarget.style.background = "#0F0F0F"; e.currentTarget.style.color = "#FAFAF8"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0F0F0F"; }}>
                Découvrir l'Histoire →
              </Link>
            </div>
          </div>
          <div style={{ padding: "4rem 3rem", background: "#1565C0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Partenariat</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 1, letterSpacing: "0.02em", color: "#FAFAF8", marginBottom: "1.5rem" }}>
                DEVENEZ<br />SPONSOR
              </h2>
              <Link to="/sponsoring" style={{ ...btnOutline, borderColor: "#FAFAF8", color: "#FAFAF8" }} onMouseEnter={e => { e.currentTarget.style.background = "#FAFAF8"; e.currentTarget.style.color = "#1565C0"; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#FAFAF8"; }}>
                Voir les offres →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .gallery-prev a:hover .gallery-overlay { opacity: 1 !important; }
        .gallery-prev a:hover .gallery-caption { transform: translateY(0) !important; }
        @media (max-width: 900px) {
          .hero-grid, .uni-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:first-child, .uni-grid > div:first-child { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .obj-grid { grid-template-columns: 1fr 1fr !important; }
          .obj-grid > div { border-bottom: 1.5px solid #0F0F0F; }
          .obj-grid > div:nth-child(even) { border-right: none !important; }
          .sp-grid, .cta-grid, .cd-grid, .ann-prev { grid-template-columns: 1fr !important; }
          .sp-grid > div, .cta-grid > div:first-child, .ann-prev > a { border-right: none !important; border-bottom: 1.5px solid #0F0F0F; }
          .prog-grid { grid-template-columns: 1fr 1fr !important; }
          .gallery-prev { grid-template-columns: 1fr 1fr !important; }
          .gallery-prev > a:nth-child(even) { border-right: none !important; }
          .gallery-prev > a { border-bottom: 1.5px solid #0F0F0F; }
        }
        @media (max-width: 600px) {
          .obj-grid, .prog-grid, .gallery-prev { grid-template-columns: 1fr !important; }
          .prog-grid > div, .gallery-prev > a { border-right: none !important; }
        }
      `}</style>
    </div>
  );
}

const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: "0.5rem",
  textDecoration: "none", background: "#1565C0", color: "#FAFAF8",
  padding: "0.85rem 2rem", fontFamily: "'DM Mono', monospace",
  fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase",
  transition: "background 0.2s",
};

const btnOutline = {
  display: "inline-flex", alignItems: "center", gap: "0.5rem",
  textDecoration: "none", background: "transparent", color: "#0F0F0F",
  padding: "0.85rem 2rem", fontFamily: "'DM Mono', monospace",
  fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase",
  border: "1.5px solid #0F0F0F", transition: "all 0.2s",
};