import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Pin, Images, Megaphone, Star } from "lucide-react";
import { META, STATS, OBJECTIVES, SPONSORING, PROGRAM } from "../data";
import logo from "../assets/logo.png";
import uniLogo from "../assets/University_of_Douala_Logo.jpg";
import uniImg from "../assets/uni.JPG";
import Countdown from "../components/countdown";
import { supabase } from "../lib/superbase";

import illuCohesion    from "../assets/icon-cohesion.svg";
import illuExcellence  from "../assets/icon-trophy.svg";
import illuCelebration from "../assets/icon-celebration.svg";
import illuSolidarity  from "../assets/icon-solidarity.svg";

const OBJ_ILLUSTRATIONS = [illuCohesion, illuExcellence, illuCelebration, illuSolidarity];

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
    const dur = 1800, step = 16;
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

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --blue: #1565C0;
    --blue-dark: #0D47A1;
    --blue-light: #EEF4FF;
    --orange: #F57C00;
    --ink: #0A0A0A;
    --ink-soft: #3D3D38;
    --muted: #88887F;
    --rule: rgba(10,10,10,0.12);
    --cream: #FAFAF8;
    --warm: #F5F0E8;
  }

  .home-root {
    background: var(--cream);
    padding-top: 64px;
    overflow-x: hidden;
    width: 100%;
    font-size: 16px;
  }

  /* ── TICKER ── */
  .ticker-wrap {
    background: var(--ink);
    padding: 0.55rem 0;
    overflow: hidden;
    border-bottom: none;
  }
  .ticker-inner {
    display: flex;
    gap: 5rem;
    animation: ticker 28s linear infinite;
    white-space: nowrap;
    font-family: 'DM Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
  }
  .ticker-inner span { color: var(--orange); }
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* ── HERO ── */
  .hero-section {
    border-bottom: 1px solid var(--rule);
    position: relative;
    overflow: hidden;
  }
  .hero-section::before {
    content: '';
    position: absolute;
    top: -180px; right: -120px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(21,101,192,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1280px;
    margin: 0 auto;
  }
  .hero-l {
    padding: 5rem 3.5rem 4rem;
    border-right: 1px solid var(--rule);
    display: flex; flex-direction: column;
    justify-content: space-between; gap: 3rem;
  }
  .hero-r {
    display: flex; flex-direction: column;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 0.5rem;
    background: var(--ink); color: rgba(255,255,255,0.85);
    padding: 0.35rem 0.9rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase;
    margin-bottom: 2.5rem;
  }
  .hero-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--orange); display: inline-block; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .hero-h1 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(4.2rem, 9vw, 9.5rem);
    line-height: 0.87;
    letter-spacing: 0.015em;
    color: var(--ink);
  }
  .hero-h1 em { font-style: normal; color: var(--blue); }
  .hero-h1 strong { font-weight: inherit; color: var(--orange); }
  .hero-theme {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 0.95rem;
    color: var(--muted);
    line-height: 1.8;
    max-width: 380px;
    border-left: 2px solid var(--orange);
    padding-left: 1rem;
  }
  .hero-cta { display: flex; gap: 0.875rem; flex-wrap: wrap; }

  /* Hero right top */
  .hero-r-top {
    padding: 2.5rem 2.5rem 2rem;
    border-bottom: 1px solid var(--rule);
    display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap;
  }
  .hero-divider { width: 1px; height: 48px; background: var(--rule); }
  .cd-label {
    font-family: 'DM Mono', monospace;
    font-size: 0.52rem; letter-spacing: 0.2em;
    color: var(--muted); text-transform: uppercase; margin-bottom: 5px;
  }

  /* Stats grid */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; flex: 1; }
  .stat-cell {
    padding: 1.875rem 2.5rem;
    border-top: 1px solid var(--rule);
    position: relative; overflow: hidden;
  }
  .stat-cell:nth-child(odd) { border-right: 1px solid var(--rule); }
  .stat-cell::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .stat-cell:hover::after { opacity: 1; }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 3.2vw, 3.5rem);
    line-height: 1; letter-spacing: 0.02em;
  }
  .stat-lbl {
    font-family: 'DM Mono', monospace;
    font-size: 0.54rem; letter-spacing: 0.16em;
    color: var(--muted); text-transform: uppercase; margin-top: 4px;
  }
  .hero-patron {
    padding: 1.25rem 2.5rem;
    border-top: 1px solid var(--rule);
    display: flex; align-items: center; gap: 1rem;
    background: var(--warm);
  }
  .patron-name {
    font-family: 'Fraunces', serif;
    font-weight: 700; font-size: 0.8rem; color: var(--ink);
  }
  .patron-role {
    font-family: 'DM Mono', monospace;
    font-size: 0.52rem; letter-spacing: 0.12em;
    color: var(--muted); text-transform: uppercase; margin-top: 2px;
  }

  /* ── SECTION HEADER ── */
  .sec-hdr {
    max-width: 1280px; margin: 0 auto;
    padding: 1.5rem 2.5rem;
    border-bottom: 1px solid var(--rule);
    display: flex; justify-content: space-between; align-items: center;
    flex-wrap: wrap; gap: 0.75rem;
  }
  .sec-hdr-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.75rem; letter-spacing: 0.06em;
    display: flex; align-items: center; gap: 0.6rem;
  }
  .sec-link {
    text-decoration: none;
    font-family: 'DM Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--blue); display: flex; align-items: center; gap: 0.35rem;
    padding: 0.4rem 0.8rem; border: 1px solid var(--blue);
    transition: all 0.2s;
  }
  .sec-link:hover { background: var(--blue); color: #fff; }

  /* ── UNIVERSITY ── */
  .uni-section { border-bottom: 1px solid var(--rule); }
  .uni-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    max-width: 1280px; margin: 0 auto;
  }
  .uni-img-wrap {
    position: relative; overflow: hidden; min-height: 480px;
  }
  .uni-img-wrap img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 1.4s ease;
  }
  .uni-img-wrap:hover img { transform: scale(1.04); }
  .uni-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(160deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.1) 50%, transparent 100%);
  }
  .uni-img-caption {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem 2.5rem 2rem;
  }
  .uni-img-city {
    font-family: 'DM Mono', monospace; font-size: 0.54rem;
    letter-spacing: 0.2em; color: rgba(255,255,255,0.45);
    text-transform: uppercase; margin-bottom: 8px;
  }
  .uni-img-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 2.2rem;
    color: #fff; letter-spacing: 0.04em; line-height: 1;
  }
  .uni-r {
    padding: 4rem 3.5rem;
    display: flex; flex-direction: column; justify-content: center;
    background: var(--cream);
  }
  .uni-top {
    display: flex; align-items: center; gap: 1.25rem;
    margin-bottom: 2.5rem; flex-wrap: wrap;
  }
  .uni-meta {
    font-family: 'DM Mono', monospace; font-size: 0.56rem;
    letter-spacing: 0.14em; color: var(--muted); text-transform: uppercase;
    line-height: 1.8;
  }
  .uni-h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2rem, 4vw, 3.8rem);
    line-height: 0.95; letter-spacing: 0.02em; margin-bottom: 1.25rem;
  }
  .uni-desc {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 0.95rem; color: var(--ink-soft); line-height: 1.9;
    max-width: 420px; margin-bottom: 2.5rem;
  }

  /* ── GALLERY ── */
  .gallery-section { border-bottom: 1px solid var(--rule); }
  .gallery-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    max-width: 1280px; margin: 0 auto;
  }
  .gal-item {
    text-decoration: none; display: block;
    overflow: hidden; position: relative;
    aspect-ratio: 1;
  }
  .gal-item + .gal-item { border-left: 1px solid var(--rule); }
  .gal-item img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
    display: block;
  }
  .gal-item:hover img { transform: scale(1.08); }
  .gal-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(transparent 45%, rgba(0,0,0,0.7));
    opacity: 0; transition: opacity 0.35s;
  }
  .gal-item:hover .gal-overlay { opacity: 1; }
  .gal-cap {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 1rem 1.25rem;
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 0.78rem; color: #fff;
    transform: translateY(8px); opacity: 0;
    transition: all 0.35s;
  }
  .gal-item:hover .gal-cap { transform: translateY(0); opacity: 1; }
  .gallery-empty {
    grid-column: 1 / -1; padding: 6rem 2rem; text-align: center;
  }

  /* ── ANNOUNCEMENTS ── */
  .ann-section { border-bottom: 1px solid var(--rule); }
  .ann-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    max-width: 1280px; margin: 0 auto;
  }
  .ann-item {
    text-decoration: none; display: flex; flex-direction: column;
    transition: background 0.2s;
  }
  .ann-item + .ann-item { border-left: 1px solid var(--rule); }
  .ann-item:hover { background: var(--blue-light); }
  .ann-bar { height: 3px; }
  .ann-body { padding: 2rem 2.5rem; flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
  .ann-meta { display: flex; align-items: center; gap: 0.5rem; }
  .ann-cat {
    font-family: 'DM Mono', monospace; font-size: 0.52rem;
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .ann-time {
    font-family: 'DM Mono', monospace; font-size: 0.5rem;
    color: var(--muted); margin-left: auto;
  }
  .ann-title {
    font-family: 'Fraunces', serif; font-weight: 700;
    font-size: 1rem; line-height: 1.4; color: var(--ink);
  }
  .ann-excerpt {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 0.83rem; color: var(--ink-soft); line-height: 1.7;
    flex: 1;
  }
  .ann-author {
    font-family: 'DM Mono', monospace; font-size: 0.52rem;
    color: var(--muted); padding-top: 0.5rem;
    border-top: 1px solid var(--rule);
  }

  /* ── OBJECTIVES ── */
  .obj-section { border-bottom: 1px solid var(--rule); }
  .obj-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    max-width: 1280px; margin: 0 auto;
  }
  .obj-item {
    padding: 3rem 2.25rem;
    display: flex; flex-direction: column;
    transition: background 0.25s;
    position: relative; overflow: hidden;
  }
  .obj-item + .obj-item { border-left: 1px solid var(--rule); }
  .obj-item:hover { background: var(--warm); }
  .obj-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 5rem; line-height: 1;
    margin-bottom: 1.5rem; letter-spacing: 0.02em;
    transition: transform 0.3s;
  }
  .obj-item:hover .obj-num { transform: translateX(4px); }
  .obj-illus {
    width: 100%; aspect-ratio: 4/3; margin-bottom: 1.75rem;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; border-radius: 2px;
  }
  .obj-illus img { width: 82%; height: 82%; object-fit: contain; }
  .obj-title {
    font-family: 'Fraunces', serif; font-weight: 700;
    font-size: 1rem; line-height: 1.3; margin-bottom: 0.65rem;
  }
  .obj-desc {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 0.82rem; color: var(--ink-soft); line-height: 1.75;
  }

  /* ── PROGRAMME ── */
  .prog-section { border-bottom: 1px solid var(--rule); }
  .prog-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    max-width: 1280px; margin: 0 auto;
  }
  .prog-item {
    padding: 2.25rem 2.5rem;
    transition: background 0.2s;
  }
  .prog-item:hover { background: var(--warm); }
  .prog-item--dark { background: var(--ink) !important; }
  .prog-item--dark:hover { background: #1a1a16 !important; }
  .prog-item + .prog-item { border-left: 1px solid var(--rule); }
  .prog-row-b { border-bottom: 1px solid var(--rule); }
  .prog-date {
    font-family: 'DM Mono', monospace; font-size: 0.56rem;
    letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 1rem;
  }
  .prog-img { width: 100%; height: 72px; margin-bottom: 0.875rem; display: flex; align-items: center; }
  .prog-img img { height: 100%; width: auto; max-width: 55%; object-fit: contain; }
  .prog-name {
    font-family: 'Fraunces', serif; font-weight: 700;
    font-size: 1.05rem; line-height: 1.35; margin-bottom: 0.5rem;
  }
  .prog-desc {
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 0.82rem; line-height: 1.7;
  }

  /* ── SPONSORING ── */
  .sp-section { border-bottom: 1px solid var(--rule); }
  .sp-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    max-width: 1280px; margin: 0 auto;
  }
  .sp-item { }
  .sp-item + .sp-item { border-left: 1px solid var(--rule); }
  .sp-top-bar { height: 4px; }
  .sp-inner { padding: 2.75rem 2.5rem; }
  .sp-tier {
    font-family: 'DM Mono', monospace; font-size: 0.56rem;
    letter-spacing: 0.2em; margin-bottom: 0.4rem; text-transform: uppercase;
  }
  .sp-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.2rem, 3.5vw, 3.5rem);
    line-height: 1; letter-spacing: 0.02em; margin-bottom: 0.2rem;
  }
  .sp-currency {
    font-family: 'DM Mono', monospace; font-size: 0.58rem;
    color: var(--muted); letter-spacing: 0.1em; margin-bottom: 2rem;
  }
  .sp-features { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2rem; }
  .sp-feature {
    display: flex; gap: 0.65rem;
    font-family: 'Fraunces', serif; font-size: 0.84rem;
    color: var(--ink-soft); line-height: 1.4;
  }
  .sp-more {
    font-family: 'DM Mono', monospace; font-size: 0.56rem;
    color: var(--muted);
  }
  .sp-cta {
    display: block; text-align: center; text-decoration: none;
    padding: 0.85rem 1.5rem;
    font-family: 'DM Mono', monospace; font-size: 0.64rem;
    letter-spacing: 0.14em; text-transform: uppercase;
    border: 1.5px solid; transition: all 0.2s;
  }

  /* ── CTA ── */
  .cta-section { }
  .cta-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    max-width: 1280px; margin: 0 auto;
    min-height: 300px;
  }
  .cta-l, .cta-r {
    padding: 4.5rem 3.5rem;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .cta-l { border-right: 1px solid var(--rule); }
  .cta-r { background: var(--ink); }
  .cta-label {
    font-family: 'DM Mono', monospace; font-size: 0.54rem;
    letter-spacing: 0.22em; text-transform: uppercase;
  }
  .cta-h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 5vw, 5.5rem);
    line-height: 0.92; letter-spacing: 0.02em; margin-bottom: 2rem;
  }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 0.5rem;
    text-decoration: none; background: var(--blue); color: #FAFAF8;
    padding: 0.9rem 2.25rem;
    font-family: 'DM Mono', monospace; font-size: 0.64rem;
    letter-spacing: 0.14em; text-transform: uppercase;
    transition: background 0.2s, transform 0.2s;
    border: none; cursor: pointer;
  }
  .btn-primary:hover { background: var(--blue-dark); transform: translateX(2px); }
  .btn-outline {
    display: inline-flex; align-items: center; gap: 0.5rem;
    text-decoration: none; background: transparent; color: var(--ink);
    padding: 0.9rem 2.25rem;
    font-family: 'DM Mono', monospace; font-size: 0.64rem;
    letter-spacing: 0.14em; text-transform: uppercase;
    border: 1.5px solid var(--ink); transition: all 0.2s;
  }
  .btn-outline:hover { background: var(--ink); color: var(--cream); }
  .btn-outline--white {
    border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.85);
  }
  .btn-outline--white:hover { background: rgba(255,255,255,0.1); border-color: #fff; color: #fff; }

  /* Divider */
  .v-divider { width: 1px; height: 44px; background: var(--rule); }

  /* ─────── TABLET ≤ 1024px ─────── */
  @media (max-width: 1024px) {
    .hero-l { padding: 3.5rem 2.5rem 3rem; }
    .uni-r { padding: 3rem 2.5rem; }
    .uni-img-wrap { min-height: 380px; }
    .obj-grid { grid-template-columns: repeat(2, 1fr); }
    .obj-item + .obj-item { border-left: none; }
    .obj-item:nth-child(odd) { border-right: 1px solid var(--rule) !important; }
    .obj-item:nth-child(1), .obj-item:nth-child(2) { border-bottom: 1px solid var(--rule); }
    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    .gal-item + .gal-item { border-left: none; }
    .gal-item:nth-child(even) { border-left: 1px solid var(--rule); }
    .gal-item:nth-child(1), .gal-item:nth-child(2) { border-bottom: 1px solid var(--rule); }
    .prog-grid { grid-template-columns: repeat(2, 1fr); }
    .prog-item + .prog-item { border-left: 1px solid var(--rule); }
    .prog-item:nth-child(even) { border-left: 1px solid var(--rule); }
    .prog-item:nth-child(2n+1) { border-left: none; }
    .sp-inner { padding: 2.25rem 2rem; }
  }

  /* ─────── MOBILE ≤ 768px ─────── */
  @media (max-width: 768px) {
    .hero-grid { grid-template-columns: 1fr; }
    .hero-l { border-right: none; border-bottom: 1px solid var(--rule); padding: 2.75rem 1.5rem 2.5rem; gap: 2.25rem; }
    .hero-r-top { padding: 2rem 1.5rem; }
    .stat-cell { padding: 1.5rem 1.5rem; }
    .hero-patron { padding: 1rem 1.5rem; }

    .uni-grid { grid-template-columns: 1fr; }
    .uni-img-wrap { min-height: 280px; }
    .uni-r { padding: 2.5rem 1.5rem; }
    .uni-top .v-divider { display: none; }

    .ann-grid { grid-template-columns: 1fr; }
    .ann-item + .ann-item { border-left: none; border-top: 1px solid var(--rule); }
    .ann-body { padding: 1.75rem 1.5rem; }

    .obj-grid { grid-template-columns: 1fr; }
    .obj-item + .obj-item { border-left: none !important; border-right: none !important; border-top: 1px solid var(--rule); }
    .obj-item:nth-child(1), .obj-item:nth-child(2) { border-bottom: none; }
    .obj-item { padding: 2.25rem 1.5rem; }

    .prog-grid { grid-template-columns: 1fr; }
    .prog-item + .prog-item { border-left: none; border-top: 1px solid var(--rule); }
    .prog-item { padding: 2rem 1.5rem; }
    .prog-row-b { border-bottom: none; }

    .sp-grid { grid-template-columns: 1fr; }
    .sp-item + .sp-item { border-left: none; border-top: 1px solid var(--rule); }
    .sp-inner { padding: 2rem 1.5rem; }

    .gallery-grid { grid-template-columns: repeat(2, 1fr); }
    .gal-item + .gal-item { border-left: none; }
    .gal-item:nth-child(even) { border-left: 1px solid var(--rule) !important; }

    .cta-grid { grid-template-columns: 1fr; min-height: auto; }
    .cta-l { border-right: none; border-bottom: 1px solid var(--rule); padding: 3rem 1.5rem; }
    .cta-r { padding: 3rem 1.5rem; }

    .sec-hdr { padding: 1.25rem 1.5rem; flex-direction: column; align-items: flex-start; }
    .hide-mob { display: none !important; }

    .hero-h1 { font-size: clamp(3.5rem, 16vw, 6rem); }
  }

  /* ─────── SMALL ≤ 400px ─────── */
  @media (max-width: 400px) {
    .hero-l { padding: 2.25rem 1.125rem 2rem; }
    .gallery-grid { grid-template-columns: 1fr; }
    .gal-item + .gal-item { border-left: none !important; border-top: 1px solid var(--rule); }
    .stats-grid { grid-template-columns: 1fr; }
    .stat-cell:nth-child(odd) { border-right: none; border-bottom: 1px solid var(--rule); }
  }
`;

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [objRef, objV] = useInView();
  const [spRef, spV] = useInView();
  const [pgRef, pgV] = useInView();
  const [uniRef, uniV] = useInView();
  const [mediaRef, mediaV] = useInView();
  const [galleryItems, setGalleryItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchHome = async () => {
      const [{ data: gallery }, { data: anns }] = await Promise.all([
        supabase.from("gallery").select("id, url, caption, type, category").order("created_at", { ascending: false }).limit(4),
        supabase.from("announcements").select("id, title, body, author, category, pinned, created_at").order("pinned", { ascending: false }).order("created_at", { ascending: false }).limit(3),
      ]);
      if (gallery) setGalleryItems(gallery);
      if (anns) setAnnouncements(anns);
    };
    fetchHome();
  }, []);

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

  const fadeIn = (v, i = 0) => ({
    opacity: v ? 1 : 0,
    transform: v ? "none" : "translateY(18px)",
    transition: `opacity 0.65s ease ${i * 0.1}s, transform 0.65s ease ${i * 0.1}s`,
  });

  return (
    <div className="home-root">
      <style>{CSS}</style>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} style={{ display: "inline-flex", gap: "1rem", alignItems: "center" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>STUD 2026</span>
              <span style={{ color: "#F57C00" }}>★</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>24–30 AVRIL</span>
              <span style={{ color: "#F57C00" }}>★</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>UNIVERSITÉ DE DOUALA</span>
              <span style={{ color: "#F57C00" }}>★</span>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>PERSONNEL ENGAGÉ, UNIVERSITÉ D'EXCELLENCE</span>
              <span style={{ color: "#F57C00", marginRight: "4rem" }}>★</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left */}
          <div className="hero-l">
            <div>
              <div className="hero-badge" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(10px)", transition: "all 0.5s ease 0.1s" }}>
                <span className="hero-dot" />
                Édition 2026
              </div>
              <h1 className="hero-h1" style={{ opacity: loaded ? 1 : 0, transform: loaded ? "none" : "translateY(30px)", transition: "all 0.75s ease 0.2s" }}>
                SE<em>MA</em>INE<br />
                DU TRA<strong>VAI</strong>LLEUR
              </h1>
            </div>
            <div style={{ opacity: loaded ? 1 : 0, transition: "all 0.75s ease 0.45s" }}>
              <p className="hero-theme">«{META.theme}»</p>
              <div style={{ marginTop: "2.25rem" }} className="hero-cta">
                <Link to="/programme" className="btn-primary">
                  Voir le Programme <ArrowRight size={14} />
                </Link>
                <Link to="/sponsoring" className="btn-outline">
                  Devenir Sponsor
                </Link>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="hero-r" style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.75s ease 0.35s" }}>
            <div className="hero-r-top">
              <img src={logo} alt="STUD 2026" style={{ height: 60, width: "auto" }} />
              <div className="v-divider hide-mob" />
              <div>
                <div className="cd-label">Compte à rebours</div>
                <Countdown compact />
              </div>
            </div>

            <div className="stats-grid">
              {STATS.map((s, i) => (
                <div key={i} className="stat-cell">
                  <div className="stat-num" style={{ color: i % 2 === 0 ? "var(--ink)" : "var(--blue)" }}>
                    <Counter target={s.value} />
                  </div>
                  <div className="stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="hero-patron">
              <img src={uniLogo} alt="Université de Douala" style={{ height: 34, width: "auto", opacity: 0.8 }} />
              <div>
                <div className="patron-name">{META.patron}</div>
                <div className="patron-role">Haut Patronage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── UNIVERSITY ── */}
      <section ref={uniRef} className="uni-section">
        <div className="uni-grid">
          <div className="uni-img-wrap">
            <img src={uniImg} alt="Université de Douala"
              style={{ opacity: uniV ? 1 : 0.2, transform: uniV ? "scale(1)" : "scale(1.06)", transition: "all 1.4s ease" }} />
            <div className="uni-img-overlay" />
            <div className="uni-img-caption">
              <div className="uni-img-city">Douala, Cameroun</div>
              <div className="uni-img-name">Université de Douala</div>
            </div>
          </div>
          <div className="uni-r" style={fadeIn(uniV)}>
            <div className="uni-top">
              <img src={uniLogo} alt="Logo UDo" style={{ height: 50, width: "auto" }} />
              <div className="v-divider hide-mob" />
              <div className="uni-meta">Fondée en 1977<br />48 871 Étudiants</div>
            </div>
            <h2 className="uni-h2">
              UN ÉVÉNEMENT<br />
              <span style={{ color: "var(--blue)" }}>INSTITUTIONNEL</span><br />
              D'ENVERGURE
            </h2>
            <p className="uni-desc">
              La STUD 2026 est organisée sous le haut patronage du {META.patron}, Recteur de l'Université de Douala. Elle réunit l'ensemble du personnel des 3 campus dans un esprit de célébration, de cohésion et d'excellence.
            </p>
            <Link to="/about" className="btn-primary" style={{ alignSelf: "flex-start" }}>
              Découvrir l'Université <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section ref={mediaRef} className="gallery-section">
        <div className="sec-hdr">
          <span className="sec-hdr-title">
            <Images size={24} strokeWidth={1.5} color="var(--blue)" />
            Derniers&nbsp;<span style={{ color: "var(--blue)" }}>Moments</span>
          </span>
          <Link to="/gallery" className="sec-link">Voir la galerie <ArrowRight size={11} /></Link>
        </div>
        {galleryItems.length === 0 ? (
          <div className="gallery-empty" style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.5rem", color: "#EAEAE5", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>À VENIR</div>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "var(--muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>Les photos de l'événement seront publiées ici.</p>
            <Link to="/gallery" className="btn-primary" style={{ display: "inline-flex" }}>
              Accéder à la galerie <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="gallery-grid">
            {galleryItems.map((item, i) => (
              <Link key={item.id} to="/gallery" className="gal-item"
                style={fadeIn(mediaV, i)}>
                {item.type === "video" ? (
                  <div style={{ width: "100%", height: "100%", background: "#0D1B2A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
                      <Play size={18} color="#fff" />
                    </div>
                  </div>
                ) : (
                  <img src={item.url} alt={item.caption || ""} />
                )}
                {item.caption && (
                  <>
                    <div className="gal-overlay" />
                    <div className="gal-cap">{item.caption}</div>
                  </>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── ANNOUNCEMENTS PREVIEW ── */}
      <section className="ann-section">
        <div className="sec-hdr">
          <span className="sec-hdr-title">
            <Megaphone size={24} strokeWidth={1.5} color="var(--orange)" />
            Dernières&nbsp;<span style={{ color: "var(--orange)" }}>Annonces</span>
          </span>
          <Link to="/announcements" className="sec-link">Toutes les annonces <ArrowRight size={11} /></Link>
        </div>
        {announcements.length === 0 ? (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 2.5rem", textAlign: "center" }}>
            <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "var(--muted)" }}>Aucune annonce pour le moment.</p>
          </div>
        ) : (
          <div className="ann-grid">
            {announcements.map((ann) => {
              const catColor = CAT_COLORS[ann.category] || "var(--blue)";
              return (
                <Link key={ann.id} to="/announcements" className="ann-item">
                  <div className="ann-bar" style={{ background: catColor }} />
                  <div className="ann-body">
                    <div className="ann-meta">
                      {ann.pinned && <Pin size={10} color={catColor} />}
                      <span className="ann-cat" style={{ color: catColor }}>{ann.category}</span>
                      <span className="ann-time">{timeAgo(ann.created_at)}</span>
                    </div>
                    <h3 className="ann-title">{ann.title}</h3>
                    <p className="ann-excerpt">{ann.body.length > 120 ? ann.body.slice(0, 120) + "…" : ann.body}</p>
                    <div className="ann-author">{ann.author}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── OBJECTIVES ── */}
      <section ref={objRef} className="obj-section">
        <div className="sec-hdr">
          <span className="sec-hdr-title">Nos Objectifs</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "var(--muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>STUD 2026 — Section 01</span>
        </div>
        <div className="obj-grid">
          {OBJECTIVES.map((o, i) => (
            <div key={i} className="obj-item" style={fadeIn(objV, i)}>
              <div className="obj-num" style={{ color: i % 2 === 0 ? "var(--blue)" : "#DDDDD5" }}>{o.num}</div>
              <div className="obj-illus" style={{ background: i % 2 === 0 ? "var(--blue-light)" : "#FFF8EE" }}>
                <img src={OBJ_ILLUSTRATIONS[i]} alt={o.title}
                  onError={e => { e.target.parentElement.style.display = "none"; }} />
              </div>
              <h3 className="obj-title">{o.title}</h3>
              <p className="obj-desc">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROGRAMME ── */}
      <section ref={pgRef} className="prog-section">
        <div className="sec-hdr">
          <span className="sec-hdr-title">À l'Affiche</span>
          <Link to="/programme" className="sec-link">Programme complet <ArrowRight size={11} /></Link>
        </div>
        <div className="prog-grid">
          {featuredEvents.map((ev, i) => {
            const isDark = i === 0;
            return (
              <div key={i}
                className={`prog-item ${i % 3 !== 2 ? "" : ""} ${i < 3 ? "prog-row-b" : ""} ${isDark ? "prog-item--dark" : ""}`}
                style={{
                  color: isDark ? "rgba(255,255,255,0.9)" : "var(--ink)",
                  borderLeft: i % 3 !== 0 ? "1px solid var(--rule)" : "none",
                  ...fadeIn(pgV, i)
                }}>
                <div className="prog-date" style={{ color: isDark ? "var(--orange)" : "var(--muted)" }}>{ev.date}</div>
                <div className="prog-img">
                  <img src={`/assets/${ev.svg}`} alt={ev.name}
                    style={{ filter: isDark ? "brightness(0) invert(1)" : "none", opacity: isDark ? 0.65 : 1 }}
                    onError={e => { e.target.style.display = "none"; }} />
                </div>
                <h3 className="prog-name">{ev.name}</h3>
                <p className="prog-desc" style={{ color: isDark ? "rgba(255,255,255,0.45)" : "var(--ink-soft)" }}>{ev.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SPONSORING PREVIEW ── */}
      <section ref={spRef} className="sp-section">
        <div className="sec-hdr">
          <span className="sec-hdr-title">Packages Sponsoring</span>
          <Link to="/sponsoring" className="sec-link">Voir les offres <ArrowRight size={11} /></Link>
        </div>
        <div className="sp-grid">
          {SPONSORING.map((offer, i) => (
            <div key={i} className="sp-item" style={fadeIn(spV, i * 1.5)}>
              <div className="sp-top-bar" style={{ background: offer.color }} />
              <div className="sp-inner">
                <div className="sp-tier" style={{ color: offer.color }}>{offer.badge} Offre {offer.tier}</div>
                <div className="sp-price">{offer.price}</div>
                <div className="sp-currency">{offer.currency}</div>
                <div className="sp-features">
                  {offer.visibility.slice(0, 3).map((v, j) => (
                    <div key={j} className="sp-feature">
                      <span style={{ color: offer.color, fontWeight: 700, flexShrink: 0 }}>—</span>
                      {v}
                    </div>
                  ))}
                  {offer.visibility.length > 3 && (
                    <div className="sp-more">+{offer.visibility.length - 3} avantages supplémentaires</div>
                  )}
                </div>
                <Link to="/sponsoring" className="sp-cta"
                  style={{ borderColor: offer.color, color: offer.color }}
                  onMouseEnter={e => { e.currentTarget.style.background = offer.color; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = offer.color; }}>
                  En savoir plus →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="cta-section">
        <div className="cta-grid">
          <div className="cta-l">
            <div className="cta-label" style={{ color: "var(--muted)" }}>En savoir plus</div>
            <div>
              <h2 className="cta-h2">
                À PROPOS DE<br /><span style={{ color: "var(--blue)" }}>L'UNIVERSITÉ</span>
              </h2>
              <Link to="/about" className="btn-outline">Découvrir l'Histoire →</Link>
            </div>
          </div>
          <div className="cta-r">
            <div className="cta-label" style={{ color: "rgba(255,255,255,0.3)" }}>Partenariat</div>
            <div>
              <h2 className="cta-h2" style={{ color: "#FAFAF8" }}>
                DEVENEZ<br />SPONSOR
              </h2>
              <Link to="/sponsoring" className="btn-outline btn-outline--white">Voir les offres →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}