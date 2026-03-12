import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import { ImagePlus, Plus, Trash2, Pin, PinOff, Lock, LogOut, Check, Upload, X, MessageSquare, CheckCircle2, XCircle } from "lucide-react";

// ─── CHANGE THIS PASSWORD ───────────────────────────────────
const ADMIN_PASSWORD = "stud2026admin";
// ────────────────────────────────────────────────────────────

const GALLERY_CATS = ["Sports", "Culture", "Cérémonie", "Coulisses"];
const ANN_CATS = ["Général", "Sport", "Culture", "Logistique"];
const CAT_COLORS = { Général: "#1565C0", Sport: "#F57C00", Culture: "#F9A825", Logistique: "#6B7280" };

export default function AdminPanel() {
  // Auth
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("stud_admin") === "1");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);

  // Tab
  const [tab, setTab] = useState("gallery");

  // Gallery
  const [gallery, setGallery] = useState([]);
  const [gLoading, setGLoading] = useState(false);
  const [gForm, setGForm] = useState({ url: "", caption: "", category: "Cérémonie", type: "image" });
  const [gUploading, setGUploading] = useState(false);
  const [gFile, setGFile] = useState(null);
  const [gSuccess, setGSuccess] = useState(false);

  // Announcements
  const [anns, setAnns] = useState([]);
  const [aLoading, setALoading] = useState(false);
  const [aForm, setAForm] = useState({ title: "", body: "", author: "Comité Organisateur", category: "Général", pinned: false });
  const [aSuccess, setASuccess] = useState(false);

  // Testimonials
  const [testis, setTestis] = useState([]);
  const [tLoading, setTLoading] = useState(false);
  const [tFilter, setTFilter] = useState("all");

  useEffect(() => {
    if (authed) { fetchGallery(); fetchAnns(); fetchTestis(); }
  }, [authed]);

  const handleLogin = () => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem("stud_admin", "1"); setAuthed(true); setPwErr(false); }
    else { setPwErr(true); }
  };

  const handleLogout = () => { sessionStorage.removeItem("stud_admin"); setAuthed(false); setPw(""); };

  // ── GALLERY ──────────────────────────────────────────────

  const fetchGallery = async () => {
    setGLoading(true);
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    setGallery(data || []);
    setGLoading(false);
  };

  const handleGallerySubmit = async () => {
    let finalUrl = gForm.url.trim();
    if (gFile) {
      setGUploading(true);
      const ext = gFile.name.split(".").pop();
      const path = `${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from("gallery-media").upload(path, gFile, { cacheControl: "3600", upsert: false });
      if (error) { alert("Erreur upload: " + error.message); setGUploading(false); return; }
      const { data: pub } = supabase.storage.from("gallery-media").getPublicUrl(path);
      finalUrl = pub.publicUrl;
      setGUploading(false);
    }
    if (!finalUrl) return;
    const { error } = await supabase.from("gallery").insert({
      url: finalUrl,
      caption: gForm.caption.trim() || null,
      category: gForm.category,
      type: gFile ? (gFile.type.startsWith("video") ? "video" : "image") : gForm.type,
    });
    if (!error) {
      setGForm({ url: "", caption: "", category: "Cérémonie", type: "image" });
      setGFile(null);
      setGSuccess(true);
      setTimeout(() => setGSuccess(false), 2500);
      fetchGallery();
    } else {
      alert("Erreur: " + error.message);
    }
  };

  const handleGalleryDelete = async (id) => {
    if (!confirm("Supprimer ce média ?")) return;
    await supabase.from("gallery").delete().eq("id", id);
    fetchGallery();
  };

  // ── ANNOUNCEMENTS ─────────────────────────────────────────

  const fetchAnns = async () => {
    setALoading(true);
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setAnns(data || []);
    setALoading(false);
  };

  const handleAnnSubmit = async () => {
    if (!aForm.title.trim() || !aForm.body.trim()) return;
    const { error } = await supabase.from("announcements").insert({
      title: aForm.title.trim(),
      body: aForm.body.trim(),
      author: aForm.author.trim() || "Comité Organisateur",
      category: aForm.category,
      pinned: aForm.pinned,
    });
    if (!error) {
      setAForm({ title: "", body: "", author: "Comité Organisateur", category: "Général", pinned: false });
      setASuccess(true);
      setTimeout(() => setASuccess(false), 2500);
      fetchAnns();
    } else {
      alert("Erreur: " + error.message);
    }
  };

  const handleAnnDelete = async (id) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnns();
  };

  const handleAnnPin = async (id, pinned) => {
    await supabase.from("announcements").update({ pinned: !pinned }).eq("id", id);
    fetchAnns();
  };

  // ── TESTIMONIALS ──────────────────────────────────────────

  const fetchTestis = async () => {
    setTLoading(true);
    console.log("[ADMIN] fetching testimonials...");
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });
    console.log("[ADMIN] testimonials result:", { data, error });
    if (error) {
      console.error("[ADMIN] testimonials error:", error.message);
      alert("Erreur chargement témoignages: " + error.message);
    }
    setTestis(data || []);
    setTLoading(false);
  };

  const handleTestiApprove = async (id) => {
    await supabase.from("testimonials").update({ approved: true }).eq("id", id);
    fetchTestis();
  };

  const handleTestiReject = async (id) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    fetchTestis();
  };

  const handleTestiUnapprove = async (id) => {
    await supabase.from("testimonials").update({ approved: false }).eq("id", id);
    fetchTestis();
  };

  const filteredTestis = testis.filter(t => {
    if (tFilter === "pending")  return !t.approved;
    if (tFilter === "approved") return t.approved;
    return true;
  });

  const pendingCount  = testis.filter(t => !t.approved).length;
  const approvedCount = testis.filter(t => t.approved).length;

  // ── SHARED ────────────────────────────────────────────────

  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `Il y a ${m}min`;
    const h = Math.floor(m / 60);
    if (h < 24) return `Il y a ${h}h`;
    return `Il y a ${Math.floor(h / 24)}j`;
  };

  // ── LOGIN SCREEN ─────────────────────────────────────────

  if (!authed) {
    return (
      <div style={{ background: "#0D1B2A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: "#FAFAF8", width: "100%", maxWidth: 380, border: "3px solid #1565C0" }}>
          <div style={{ background: "#1565C0", padding: "2rem 2rem 1.5rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: "0.4rem" }}>Espace réservé</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.04em", color: "#fff", lineHeight: 1 }}>ADMIN STUD 2026</div>
          </div>
          <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#88887F", letterSpacing: "0.1em" }}>
              <Lock size={13} /> Accès restreint — administrateurs uniquement
            </div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
              style={{ width: "100%", padding: "0.85rem 1rem", border: pwErr ? "2px solid #F57C00" : "1.5px solid #0F0F0F", background: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.9rem", outline: "none", marginBottom: "0.65rem" }}
            />
            {pwErr && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#F57C00", marginBottom: "0.75rem" }}>Mot de passe incorrect.</div>}
            <button onClick={handleLogin} style={{ width: "100%", padding: "0.9rem", background: "#1565C0", color: "#fff", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#0D47A1"}
              onMouseLeave={e => e.currentTarget.style.background = "#1565C0"}
            >
              Accéder →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──────────────────────────────────────

  return (
    <div style={{ background: "#F0F4F8", minHeight: "100vh", paddingTop: 0 }}>

      {/* Admin topbar */}
      <div style={{ background: "#0D1B2A", borderBottom: "3px solid #1565C0", padding: "0 2rem", display: "flex", alignItems: "center", height: 56, gap: "1.5rem" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", letterSpacing: "0.06em", color: "#fff" }}>ADMIN STUD 2026</div>
        <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.15)" }} />
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Tableau de bord</div>
        <button onClick={handleLogout} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.4rem", background: "none", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)", cursor: "pointer", padding: "0.35rem 0.9rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#fff"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
        >
          <LogOut size={12} /> Déconnexion
        </button>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1.5px solid #EAEAE5", display: "flex", overflowX: "auto" }}>
        {[
          { key: "gallery",       label: "🖼 Galerie",      count: gallery.length,  badge: null },
          { key: "announcements", label: "📢 Annonces",     count: anns.length,     badge: null },
          { key: "testimonials",  label: "💬 Témoignages",  count: testis.length,   badge: pendingCount > 0 ? pendingCount : null },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "1rem 2rem", border: "none", cursor: "pointer", background: "transparent", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: tab === t.key ? "#1565C0" : "#88887F", borderBottom: tab === t.key ? "3px solid #1565C0" : "3px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", flexShrink: 0 }}>
            {t.label}
            <span style={{ background: tab === t.key ? "#EEF4FF" : "#EAEAE5", color: tab === t.key ? "#1565C0" : "#88887F", padding: "0.1rem 0.45rem", borderRadius: 99, fontSize: "0.56rem" }}>{t.count}</span>
            {/* Orange badge for pending testimonials */}
            {t.badge && (
              <span style={{ background: "#F57C00", color: "#fff", padding: "0.1rem 0.45rem", borderRadius: 99, fontSize: "0.56rem", fontWeight: 700 }}>
                {t.badge} en attente
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem" }}>

        {/* ── GALLERY TAB ── */}
        {tab === "gallery" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem", alignItems: "start" }} className="admin-layout">

            {/* Add form */}
            <div style={{ background: "#fff", border: "1.5px solid #EAEAE5", position: "sticky", top: "1rem" }}>
              <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1.5px solid #EAEAE5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ImagePlus size={15} color="#1565C0" />
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.04em" }}>Ajouter un Média</span>
              </div>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

                {/* Type toggle */}
                <div style={{ display: "flex", gap: 0, border: "1.5px solid #EAEAE5" }}>
                  {["image", "video"].map(t => (
                    <button key={t} onClick={() => setGForm(f => ({ ...f, type: t }))} style={{ flex: 1, padding: "0.6rem", border: "none", cursor: "pointer", background: gForm.type === t ? "#1565C0" : "transparent", color: gForm.type === t ? "#fff" : "#0F0F0F", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.15s" }}>
                      {t === "image" ? "Image" : "Vidéo"}
                    </button>
                  ))}
                </div>

                {/* File upload */}
                <div>
                  <label style={lbl}>Uploader un fichier</label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", border: "1.5px dashed #EAEAE5", cursor: "pointer", background: gFile ? "#F0FFF4" : "#FAFAF8", transition: "border-color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#1565C0"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#EAEAE5"}
                  >
                    <Upload size={16} color="#88887F" />
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: gFile ? "#1565C0" : "#88887F" }}>
                      {gFile ? gFile.name : "Cliquez ou glissez un fichier"}
                    </span>
                    <input type="file" accept={gForm.type === "image" ? "image/*" : "video/*"} onChange={e => { setGFile(e.target.files[0]); setGForm(f => ({ ...f, url: "" })); }} style={{ display: "none" }} />
                    {gFile && <button onClick={(e) => { e.preventDefault(); setGFile(null); }} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", padding: 0 }}><X size={14} color="#88887F" /></button>}
                  </label>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ flex: 1, height: 1, background: "#EAEAE5" }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "#88887F", letterSpacing: "0.1em" }}>OU</span>
                  <div style={{ flex: 1, height: 1, background: "#EAEAE5" }} />
                </div>

                {/* URL */}
                <div>
                  <label style={lbl}>URL publique</label>
                  <input value={gForm.url} onChange={e => { setGForm(f => ({ ...f, url: e.target.value })); setGFile(null); }} placeholder="https://…" disabled={!!gFile} style={{ ...inp, opacity: gFile ? 0.5 : 1 }} />
                </div>

                <div>
                  <label style={lbl}>Légende</label>
                  <input value={gForm.caption} onChange={e => setGForm(f => ({ ...f, caption: e.target.value }))} placeholder="Décrivez ce moment…" style={inp} />
                </div>

                <div>
                  <label style={lbl}>Catégorie</label>
                  <select value={gForm.category} onChange={e => setGForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                    {GALLERY_CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <button onClick={handleGallerySubmit} disabled={!gFile && !gForm.url.trim()} style={{ padding: "0.9rem", background: (gFile || gForm.url.trim()) ? "#1565C0" : "#EAEAE5", color: (gFile || gForm.url.trim()) ? "#fff" : "#88887F", border: "none", cursor: (gFile || gForm.url.trim()) ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", transition: "all 0.2s" }}>
                  {gUploading ? "Upload en cours…" : gSuccess ? "✓ Publié !" : "Publier →"}
                </button>
              </div>
            </div>

            {/* Gallery list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {gLoading ? <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#88887F" }}>Chargement…</p> : gallery.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#88887F", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>Aucun média publié.</div>
              ) : gallery.map(item => (
                <div key={item.id} style={{ background: "#fff", border: "1.5px solid #EAEAE5", display: "flex", gap: "1rem", padding: "0.75rem 1rem", alignItems: "flex-start" }}>
                  <div style={{ width: 72, height: 56, flexShrink: 0, overflow: "hidden", background: "#EAEAE5" }}>
                    {item.type === "video"
                      ? <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1B2A", color: "#fff", fontFamily: "'DM Mono', monospace", fontSize: "0.5rem" }}>VIDEO</div>
                      : <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "0.85rem", color: "#333", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.caption || <span style={{ color: "#88887F", fontStyle: "italic" }}>Sans légende</span>}</div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", background: "#EEF4FF", color: "#1565C0", padding: "0.1rem 0.4rem" }}>{item.category}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "#88887F" }}>{timeAgo(item.created_at)}</span>
                    </div>
                  </div>
                  <button onClick={() => handleGalleryDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", color: "#88887F", flexShrink: 0, transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#F57C00"}
                    onMouseLeave={e => e.currentTarget.style.color = "#88887F"}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANNOUNCEMENTS TAB ── */}
        {tab === "announcements" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "1.5rem", alignItems: "start" }} className="admin-layout">

            {/* Add form */}
            <div style={{ background: "#fff", border: "1.5px solid #EAEAE5", position: "sticky", top: "1rem" }}>
              <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1.5px solid #EAEAE5", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Plus size={15} color="#1565C0" />
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", letterSpacing: "0.04em" }}>Publier une Annonce</span>
              </div>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={lbl}>Titre *</label>
                  <input value={aForm.title} onChange={e => setAForm(f => ({ ...f, title: e.target.value }))} placeholder="Titre de l'annonce" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Message *</label>
                  <textarea value={aForm.body} onChange={e => setAForm(f => ({ ...f, body: e.target.value }))} placeholder="Écrivez votre annonce…" rows={6} style={{ ...inp, resize: "vertical" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={lbl}>Auteur</label>
                    <input value={aForm.author} onChange={e => setAForm(f => ({ ...f, author: e.target.value }))} placeholder="Comité Organisateur" style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Catégorie</label>
                    <select value={aForm.category} onChange={e => setAForm(f => ({ ...f, category: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                      {ANN_CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.6rem", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#88887F" }}>
                  <input type="checkbox" checked={aForm.pinned} onChange={e => setAForm(f => ({ ...f, pinned: e.target.checked }))} />
                  Épingler cette annonce
                </label>
                <button onClick={handleAnnSubmit} disabled={!aForm.title.trim() || !aForm.body.trim()} style={{ padding: "0.9rem", background: (aForm.title.trim() && aForm.body.trim()) ? "#1565C0" : "#EAEAE5", color: (aForm.title.trim() && aForm.body.trim()) ? "#fff" : "#88887F", border: "none", cursor: (aForm.title.trim() && aForm.body.trim()) ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  {aSuccess ? "✓ Publié !" : "Publier →"}
                </button>
              </div>
            </div>

            {/* Announcements list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {aLoading ? <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#88887F" }}>Chargement…</p> : anns.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#88887F", fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>Aucune annonce publiée.</div>
              ) : anns.map(item => {
                const catColor = CAT_COLORS[item.category] || "#1565C0";
                return (
                  <div key={item.id} style={{ background: "#fff", border: item.pinned ? `1.5px solid ${catColor}` : "1.5px solid #EAEAE5", padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                          {item.pinned && <Pin size={11} color={catColor} />}
                          <span style={{ background: catColor + "18", color: catColor, fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.12rem 0.4rem" }}>{item.category}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#88887F" }}>{timeAgo(item.created_at)}</span>
                          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: "#88887F" }}>· {item.author}</span>
                        </div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.95rem", color: "#0F0F0F", marginBottom: "0.3rem" }}>{item.title}</div>
                        <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.82rem", color: "#666660", lineHeight: 1.6 }}>{item.body.length > 120 ? item.body.slice(0, 120) + "…" : item.body}</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.35rem", flexShrink: 0 }}>
                        <button onClick={() => handleAnnPin(item.id, item.pinned)} title={item.pinned ? "Désépingler" : "Épingler"} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.3rem", color: item.pinned ? catColor : "#88887F", transition: "color 0.15s" }}>
                          {item.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                        </button>
                        <button onClick={() => handleAnnDelete(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "0.3rem", color: "#88887F", transition: "color 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.color = "#F57C00"}
                          onMouseLeave={e => e.currentTarget.style.color = "#88887F"}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TESTIMONIALS TAB ── */}
        {tab === "testimonials" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Stats bar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
              <div style={{ background: "#fff", border: "1.5px solid #EEF4FF", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#88887F" }}>Total témoignages publiés</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.02em", color: "#1565C0", lineHeight: 1 }}>{testis.length}</div>
              </div>
            </div>

            {/* Testimonials list */}
            {tLoading ? (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#88887F" }}>Chargement…</p>
            ) : filteredTestis.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 2rem", background: "#fff", border: "1.5px solid #EAEAE5" }}>
                <MessageSquare size={32} color="#DDDDD5" style={{ marginBottom: "0.75rem" }} />
                <div style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", color: "#88887F", fontSize: "0.9rem" }}>
                  Aucun témoignage pour le moment.
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filteredTestis.map(t => (
                  <div key={t.id} style={{ background: "#fff", border: "1.5px solid #EAEAE5", padding: "1.25rem 1.5rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>

                    {/* Avatar */}
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#1565C0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", color: "#fff", flexShrink: 0 }}>
                      {t.name === "Anonyme" ? "?" : t.name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: "0.88rem", color: "#0F0F0F" }}>{t.name}</span>
                        {t.role && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#88887F" }}>— {t.role}</span>}
                        {/* Stars */}
                        <span style={{ marginLeft: "auto", display: "flex", gap: 2 }}>
                          {[1,2,3,4,5].map(s => (
                            <span key={s} style={{ fontSize: "0.65rem", color: s <= t.rating ? "#F9A825" : "#DDDDD5" }}>★</span>
                          ))}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: "0.85rem", color: "#3D3D38", lineHeight: 1.65, margin: 0, marginBottom: "0.5rem" }}>
                        «&nbsp;{t.body}&nbsp;»
                      </p>
                      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.48rem", color: "#88887F" }}>{timeAgo(t.created_at)}</span>
                      </div>
                    </div>

                    {/* Actions — delete only */}
                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, alignItems: "center" }}>
                      <button
                        onClick={() => handleTestiReject(t.id)}
                        title="Supprimer"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem", color: "#88887F", transition: "color 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#C62828"}
                        onMouseLeave={e => e.currentTarget.style.color = "#88887F"}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const lbl = { display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#88887F", marginBottom: "0.4rem" };
const inp = { width: "100%", padding: "0.65rem 0.9rem", border: "1.5px solid #EAEAE5", background: "#fff", fontFamily: "'Fraunces', serif", fontSize: "0.875rem", outline: "none", transition: "border-color 0.15s" };