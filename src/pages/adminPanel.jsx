// ============================================================
// adminPanel.jsx — STUD 2026
// Mobile-first redesign: bottom tabs, rounded cards, blue theme
// ============================================================

import { useState, useEffect } from "react";
import { supabase } from "../lib/superbase";
import {
  ImagePlus, Plus, Trash2, Pin, PinOff,
  Lock, LogOut, Upload, X, MessageSquare,
  ClipboardList, Star, ChevronDown, ChevronUp,
  Download, BarChart2, Image, Megaphone,
  MessageCircle, TrendingUp, CheckCircle,
} from "lucide-react";
import { fetchDailyStats } from "../lib/useVisitorTracker";

const ADMIN_PASSWORD = "stud2026admin";
const GALLERY_CATS   = ["Sports", "Culture", "Cérémonie", "Coulisses"];
const ANN_CATS       = ["Général", "Sport", "Culture", "Logistique"];
const CAT_COLORS     = { Général:"#1565C0", Sport:"#F57C00", Culture:"#F9A825", Logistique:"#6B7280" };

const EVAL_SECTIONS = [
  { key:"section_preparation",   label:"Préparation & Organisation",  emoji:"📋" },
  { key:"section_communication", label:"Communication & Visibilité",   emoji:"📣" },
  { key:"section_logistique",    label:"Logistique & Infrastructures", emoji:"🏗️" },
  { key:"section_sport",         label:"Activités Sportives",          emoji:"⚽" },
  { key:"section_culture",       label:"Activités Culturelles",        emoji:"🎭" },
  { key:"section_intellectuel",  label:"Activités Intellectuelles",    emoji:"🎓" },
  { key:"section_restauration",  label:"Restauration & Bien-être",     emoji:"🍽️" },
  { key:"section_sante",         label:"Santé & Sécurité",             emoji:"🏥" },
  { key:"section_ambiance",      label:"Ambiance & Cohésion",          emoji:"🤝" },
  { key:"section_satisfaction",  label:"Satisfaction Globale",         emoji:"🏆" },
];

const Q_LABELS = {
  q1:"Préparation générale satisfaisante", q2:"Calendrier communiqué à temps",
  q3:"Coordination sous-commissions (1-5)", q4:"Supports de communication (1-5)",
  q5:"Infos pratiques faciles à obtenir", q6:"Couverture médiatique (1-5)",
  q26:"Évaluation communication avant événement", q7:"Lieux bien aménagés (1-5)",
  q8:"Transport bien organisé", q9:"Décoration et identité visuelle (1-5)",
  ql1:"Accessibilité du lieu", q10:"Compétitions sportives (1-5)",
  q11:"Encadrement sportif satisfaisant", q12:"Activités culturelles (1-5)",
  q13:"Miss/Master STUD bien organisée", qc1:"Activités proposées",
  q14:"Conférences pertinentes (1-5)", q15:"Investissement humain impact positif",
  q16:"Visite guidée PAD utile", qi1:"Nombre de conférences satisfaisant",
  qi2:"Cycle adapté aux questions actuelles", qi3:"Intervenants légitimes",
  qi4:"Avez-vous appris des choses", q17:"Qualité repas et boissons (1-5)",
  q18:"Espaces restauration conformes", qr1:"Qualité restauration globale",
  q19:"Dispositifs médicaux suffisants", q20:"Mesures hygiène (1-5)",
  q21:"Ambiance conviviale (1-5)", q22:"Échanges favorisés",
  qa1:"Nouveaux échanges entre collègues", qa2:"Ambiance générale",
  qa3:"Qualité de l'accueil", q23:"Sentiment d'appartenance renforcé",
  q24:"Satisfaction globale (1-5)", q25:"Reviendriez participer",
  qs1:"Satisfaction globale détail", qs2:"Contenu instructif et intéressant",
};

const B = "#1565C0", BDK = "#0D47A1", BLT = "#EEF4FF",
      INK = "#0A0A0A", GRY = "#88887F",
      BDR = "#EAEAE5", BG = "#F4F6F9", WHT = "#FFFFFF";

const lbl = {
  display:"block", fontFamily:"'DM Mono',monospace",
  fontSize:"0.54rem", letterSpacing:"0.14em",
  textTransform:"uppercase", color:GRY, marginBottom:"0.35rem",
};
const inp = {
  width:"100%", padding:"0.75rem 1rem",
  border:"1.5px solid "+BDR, borderRadius:8, background:WHT,
  fontFamily:"'Fraunces',serif", fontSize:"0.9rem",
  color:INK, outline:"none", transition:"border-color .15s",
  boxSizing:"border-box",
};

function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime(), m = Math.floor(d/60000);
  if (m < 60) return "Il y a " + m + "min";
  const h = Math.floor(m/60);
  if (h < 24) return "Il y a " + h + "h";
  return "Il y a " + Math.floor(h/24) + "j";
}
function avgRating(row) {
  let sum=0, count=0;
  EVAL_SECTIONS.forEach(function(s){ var sec=row[s.key]; if(!sec) return;
    Object.values(sec).forEach(function(v){ if(typeof v==="number"&&v>=1&&v<=5){sum+=v;count++;} }); });
  return count>0?(sum/count).toFixed(1):null;
}
function sectionAvg(secData) {
  if(!secData) return null;
  var nums=Object.values(secData).filter(function(v){return typeof v==="number"&&v>=1&&v<=5;});
  if(!nums.length) return null;
  return (nums.reduce(function(a,b){return a+b;},0)/nums.length).toFixed(1);
}

function Loader() {
  return <div style={{padding:"2rem",textAlign:"center",fontFamily:"'DM Mono',monospace",fontSize:"0.7rem",color:GRY}}>Chargement...</div>;
}
function Empty(p) {
  return (
    <div style={{textAlign:"center",padding:"3rem 1.5rem",background:WHT,borderRadius:12,border:"1px solid "+BDR}}>
      {p.icon&&<div style={{display:"flex",justifyContent:"center",marginBottom:"0.75rem"}}>{p.icon}</div>}
      <span style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",color:GRY,fontSize:"0.9rem"}}>{p.text}</span>
    </div>
  );
}
function Tag(p) {
  var c=p.color||B;
  return <span style={{background:c+"18",color:c,fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 8px",borderRadius:4}}>{p.text}</span>;
}
function DelBtn(p) {
  return (
    <button onClick={p.onClick} style={{background:"none",border:"none",cursor:"pointer",padding:"6px",color:GRY,display:"flex",alignItems:"center",borderRadius:6,transition:"all .15s"}}
      onMouseEnter={function(e){e.currentTarget.style.color="#C62828";e.currentTarget.style.background="#FFF0F0";}}
      onMouseLeave={function(e){e.currentTarget.style.color=GRY;e.currentTarget.style.background="none";}}>
      <Trash2 size={15}/>
    </button>
  );
}
function StarDisplay(p) {
  var v=parseFloat(p.value||0), sz=p.size||12;
  return (
    <span style={{display:"inline-flex",gap:1,alignItems:"center"}}>
      {[1,2,3,4,5].map(function(i){return <Star key={i} size={sz} fill={i<=Math.round(v)?"#F9A825":"none"} color={i<=Math.round(v)?"#F9A825":"#ddd"} strokeWidth={1.5}/>;}) }
      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.48rem",color:GRY,marginLeft:3}}>{v}</span>
    </span>
  );
}
function AnswerPill(p) {
  var v=p.value;
  if(v===null||v===undefined) return <span style={{color:"#ccc"}}>—</span>;
  if(typeof v==="number") return <StarDisplay value={v}/>;
  var isY=v==="Oui", isN=v==="Non";
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:99,fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",letterSpacing:"0.08em",textTransform:"uppercase",background:isY?"#E8F5E9":isN?"#FFEBEE":BLT,color:isY?"#2E7D32":isN?"#C62828":B,border:"1px solid "+(isY?"#A5D6A7":isN?"#FFCDD2":"#BBDEFB")}}>{v}</span>;
}
function StatCard(p) {
  return (
    <div style={{background:p.dark?INK:WHT,borderRadius:12,padding:"1.1rem",border:"1px solid "+(p.dark?INK:BDR),display:"flex",flexDirection:"column",gap:"0.25rem"}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",letterSpacing:"0.12em",textTransform:"uppercase",color:p.dark?"rgba(255,255,255,0.4)":GRY}}>{p.label}</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",lineHeight:1,color:p.dark?(p.color||B):(p.color||B)}}>{p.value}</div>
      {p.sub&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.42rem",color:p.dark?"rgba(255,255,255,0.25)":"#aaa",letterSpacing:"0.06em"}}>{p.sub}</div>}
    </div>
  );
}

function EvalRow(p) {
  var row=p.row, [open,setOpen]=useState(false);
  var avg=avgRating(row);
  var date=new Date(row.submitted_at||row.created_at);
  return (
    <div style={{background:WHT,borderRadius:12,border:"1px solid "+BDR,overflow:"hidden",marginBottom:"0.5rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",cursor:"pointer"}}
        onClick={function(){setOpen(function(o){return !o;});}}>
        <div style={{width:36,height:36,borderRadius:8,background:BLT,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",color:B,fontWeight:700}}>{"#"+String(row._idx).padStart(3,"0")}</span>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.54rem",color:INK}}>{date.toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"})}</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY}}>{date.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}</div>
        </div>
        <div style={{display:"flex",gap:3,flexShrink:0}}>
          {EVAL_SECTIONS.map(function(s){var sec=row[s.key],has=sec&&Object.values(sec).some(function(v){return v!==null&&v!==undefined;});
            return <div key={s.key} style={{width:6,height:6,borderRadius:"50%",background:has?B:"#E0E0E0"}}/>;}) }
        </div>
        <div style={{display:"flex",gap:"0.25rem",alignItems:"center",flexShrink:0}}>
          {avg?<StarDisplay value={avg}/>:<span style={{color:"#ccc",fontSize:"0.7rem"}}>—</span>}
          <button onClick={function(e){e.stopPropagation();p.onDelete(row.id);}} style={{background:"none",border:"none",cursor:"pointer",padding:"4px",color:GRY,display:"flex",alignItems:"center",borderRadius:4,marginLeft:2}} onMouseEnter={function(e){e.currentTarget.style.color="#C62828";}} onMouseLeave={function(e){e.currentTarget.style.color=GRY;}}><Trash2 size={13}/></button>
          <div style={{color:GRY}}>{open?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</div>
        </div>
      </div>
      {open&&(
        <div style={{borderTop:"1px solid "+BDR,padding:"1rem",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:"0.75rem",background:"#FAFAFA"}} className="eval-detail-grid">
          {EVAL_SECTIONS.map(function(s){var sec=row[s.key],sa=sectionAvg(sec);return(
            <div key={s.key} style={{background:WHT,border:"1px solid "+BDR,borderRadius:8,padding:"0.75rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.5rem"}}>
                <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",letterSpacing:"0.06em",textTransform:"uppercase",color:INK}}>{s.emoji+" "+s.label}</span>
                {sa&&<StarDisplay value={sa} size={10}/>}
              </div>
              {sec?(
                <div style={{display:"flex",flexDirection:"column",gap:"0.3rem"}}>
                  {Object.entries(sec).map(function(e){return(
                    <div key={e[0]} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.5rem"}}>
                      <span style={{fontFamily:"'Fraunces',serif",fontSize:"0.7rem",color:"#3D3D38",lineHeight:1.4,flex:1}}>{Q_LABELS[e[0]]||e[0]}</span>
                      <AnswerPill value={e[1]}/>
                    </div>);}) }
                </div>
              ):<span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",color:"#ccc"}}>Non renseigné</span>}
            </div>);})}
        </div>
      )}
    </div>
  );
}

function TrafficTab(p) {
  var today=new Date().toISOString().split("T")[0];
  var maxVal=p.traffic.length?Math.max.apply(null,p.traffic.map(function(d){return d.count;}).concat([1])):1;
  var withV=p.traffic.filter(function(d){return d.count>0;}).length;
  var totalV=p.traffic.reduce(function(a,d){return a+d.count;},0);
  var avgDay=withV>0?Math.round(totalV/withV):0;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"0.75rem"}} className="eval-stats-grid">
        <StatCard label="Total visiteurs" value={p.trafLoading?"...":(p.trafTotal||0).toLocaleString("fr-FR")} sub="depuis le lancement" color={B}/>
        <StatCard label="Aujourd'hui" value={p.trafLoading?"...":(p.trafToday||0).toLocaleString("fr-FR")} sub={new Date().toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"})} color="#2E7D32"/>
        <StatCard label="Moy. / jour" value={p.trafLoading?"...":avgDay.toLocaleString("fr-FR")} sub={"sur "+p.trafDays+" jours"} color={B} dark/>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"0.5rem"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.1rem",letterSpacing:"0.06em"}}>Visiteurs par jour</span>
        <div style={{display:"flex",gap:"0.4rem"}}>
          {[7,14,30].map(function(d){var a=p.trafDays===d;return(
            <button key={d} onClick={function(){p.onChangeDays(d);}} style={{padding:"0.35rem 0.7rem",background:a?B:WHT,color:a?"#fff":GRY,border:"1.5px solid "+(a?B:BDR),fontFamily:"'DM Mono',monospace",fontSize:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:6,transition:"all .15s"}}>{d+"j"}</button>);})}
        </div>
      </div>
      {p.trafLoading?<Loader/>:(
        <div style={{background:WHT,borderRadius:12,border:"1px solid "+BDR,padding:"1.25rem"}}>
          {p.traffic.length===0?(
            <div style={{textAlign:"center",padding:"2rem",fontFamily:"'Fraunces',serif",fontStyle:"italic",color:"#aaa"}}>Aucune donnée.</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
              <div style={{display:"flex",alignItems:"flex-end",gap:3,height:110}}>
                {p.traffic.map(function(d,i){var pct=d.count/maxVal,isT=d.date===today,barH=d.count>0?Math.max(pct*90,4):2;return(
                  <div key={i} title={d.label+": "+d.count} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                    {d.count>0&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.34rem",color:GRY}}>{d.count}</span>}
                    <div style={{width:"100%",height:barH,background:isT?B:d.count>0?"#90CAF9":"#F0F4F8",borderRadius:"2px 2px 0 0",transition:"height .4s"}}/>
                  </div>);})}
              </div>
              <div style={{display:"flex",gap:3}}>
                {p.traffic.map(function(d,i){var isT=d.date===today;return(
                  <div key={i} style={{flex:1,textAlign:"center",fontFamily:"'DM Mono',monospace",fontSize:"0.33rem",color:isT?B:"#bbb",overflow:"hidden",whiteSpace:"nowrap",visibility:(i%3===0||isT)?"visible":"hidden"}}>{d.label}</div>);})}
              </div>
              <div style={{display:"flex",gap:"1rem",paddingTop:"0.75rem",borderTop:"1px solid "+BDR}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}><div style={{width:10,height:10,background:"#90CAF9",borderRadius:2}}/><span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY}}>Jours passés</span></div>
                <div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}><div style={{width:10,height:10,background:B,borderRadius:2}}/><span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY}}>Aujourd'hui</span></div>
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:"0.06em",marginBottom:"0.75rem"}}>Détail — 7 derniers jours</div>
        <div style={{background:WHT,borderRadius:12,border:"1px solid "+BDR,overflow:"hidden"}}>
          {[...p.traffic].reverse().slice(0,7).map(function(d,i){var isT=d.date===today,pct=maxVal>0?(d.count/maxVal)*100:0;return(
            <div key={i} style={{display:"flex",alignItems:"center",padding:"0.75rem 1rem",gap:"0.75rem",borderBottom:i<6?"1px solid "+BDR:"none",background:isT?BLT:"transparent"}}>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.52rem",color:isT?B:INK,width:80,flexShrink:0,fontWeight:isT?700:400}}>{d.label}</span>
              <div style={{flex:1,height:6,background:"#F0F4F8",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:isT?B:"#90CAF9",borderRadius:3,transition:"width .4s"}}/></div>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.1rem",color:B,width:36,textAlign:"right",flexShrink:0}}>{d.count}</span>
            </div>);})}
        </div>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [authed,setAuthed]=useState(function(){return sessionStorage.getItem("stud_admin")==="1";});
  const [pw,setPw]=useState(""), [pwErr,setPwErr]=useState(false);
  const [tab,setTab]=useState("gallery");
  const [gallery,setGallery]=useState([]), [gLoading,setGLoading]=useState(false);
  const [gForm,setGForm]=useState({url:"",caption:"",category:"Cérémonie",type:"image"});
  const [gUploading,setGUploading]=useState(false), [gFile,setGFile]=useState(null), [gSuccess,setGSuccess]=useState(false), [gShow,setGShow]=useState(false);
  const [anns,setAnns]=useState([]), [aLoading,setALoading]=useState(false);
  const [aForm,setAForm]=useState({title:"",body:"",author:"Comité Organisateur",category:"Général",pinned:false});
  const [aSuccess,setASuccess]=useState(false), [aShow,setAShow]=useState(false);
  const [testis,setTestis]=useState([]), [tLoading,setTLoading]=useState(false);
  const [evals,setEvals]=useState([]), [eLoading,setELoading]=useState(false), [eSort,setESort]=useState("newest");
  const [traffic,setTraffic]=useState([]), [trafTotal,setTrafTotal]=useState(null), [trafToday,setTrafToday]=useState(null), [trafLoading,setTrafLoading]=useState(false), [trafDays,setTrafDays]=useState(14);

  useEffect(function(){if(authed){fetchGallery();fetchAnns();fetchTestis();fetchEvals();fetchTraffic(14);}}, [authed]);

  function handleLogin(){if(pw===ADMIN_PASSWORD){sessionStorage.setItem("stud_admin","1");setAuthed(true);setPwErr(false);}else setPwErr(true);}
  function handleLogout(){sessionStorage.removeItem("stud_admin");setAuthed(false);setPw("");}

  async function fetchGallery(){setGLoading(true);var r=await supabase.from("gallery").select("*").order("created_at",{ascending:false});setGallery(r.data||[]);setGLoading(false);}
  async function handleGallerySubmit(){
    var url=gForm.url.trim();
    if(gFile){setGUploading(true);var ext=gFile.name.split(".").pop(),path=Date.now()+"."+ext,up=await supabase.storage.from("gallery-media").upload(path,gFile,{cacheControl:"3600",upsert:false});
      if(up.error){alert("Erreur: "+up.error.message);setGUploading(false);return;}url=supabase.storage.from("gallery-media").getPublicUrl(path).data.publicUrl;setGUploading(false);}
    if(!url) return;
    var ins=await supabase.from("gallery").insert({url,caption:gForm.caption.trim()||null,category:gForm.category,type:gFile?(gFile.type.startsWith("video")?"video":"image"):gForm.type});
    if(!ins.error){setGForm({url:"",caption:"",category:"Cérémonie",type:"image"});setGFile(null);setGSuccess(true);setGShow(false);setTimeout(function(){setGSuccess(false);},2500);fetchGallery();}
    else alert("Erreur: "+ins.error.message);
  }
  async function handleGalleryDelete(id){if(!confirm("Supprimer ?"))return;await supabase.from("gallery").delete().eq("id",id);fetchGallery();}

  async function fetchAnns(){setALoading(true);var r=await supabase.from("announcements").select("*").order("created_at",{ascending:false});setAnns(r.data||[]);setALoading(false);}
  async function handleAnnSubmit(){
    if(!aForm.title.trim()||!aForm.body.trim())return;
    var ins=await supabase.from("announcements").insert({title:aForm.title.trim(),body:aForm.body.trim(),author:aForm.author.trim()||"Comité Organisateur",category:aForm.category,pinned:aForm.pinned});
    if(!ins.error){setAForm({title:"",body:"",author:"Comité Organisateur",category:"Général",pinned:false});setASuccess(true);setAShow(false);setTimeout(function(){setASuccess(false);},2500);fetchAnns();}
    else alert("Erreur: "+ins.error.message);
  }
  async function handleAnnDelete(id){if(!confirm("Supprimer ?"))return;await supabase.from("announcements").delete().eq("id",id);fetchAnns();}
  async function handleAnnPin(id,pinned){await supabase.from("announcements").update({pinned:!pinned}).eq("id",id);fetchAnns();}

  async function fetchTestis(){setTLoading(true);var r=await supabase.from("testimonials").select("*").order("created_at",{ascending:false});setTestis(r.data||[]);setTLoading(false);}
  async function handleTestiDelete(id){if(!confirm("Supprimer ?"))return;await supabase.from("testimonials").delete().eq("id",id);fetchTestis();}

  async function fetchEvals(){setELoading(true);var r=await supabase.from("stud_evaluations").select("*").order("created_at",{ascending:false});setEvals(r.data||[]);setELoading(false);}
  async function handleEvalDelete(id){if(!confirm("Supprimer ?"))return;await supabase.from("stud_evaluations").delete().eq("id",id);fetchEvals();}
  function exportCSV(){
    if(!evals.length)return;var allQ=Object.keys(Q_LABELS);
    var csv=[['id','submitted_at'].concat(allQ).join(",")].concat(evals.map(function(row){
      var cells=[row.id,row.submitted_at||row.created_at];
      allQ.forEach(function(q){var v="";EVAL_SECTIONS.forEach(function(s){var sec=row[s.key];if(sec&&sec[q]!==undefined)v=sec[q];});cells.push(JSON.stringify(v!==undefined?v:""));});
      return cells.join(",");})).join("\n");
    var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8;"}));a.download="stud2026_evaluations.csv";a.click();
  }

  var evalStats=(function(){
    if(!evals.length)return null;
    var sa=EVAL_SECTIONS.map(function(s){var sum=0,cnt=0;evals.forEach(function(row){var sec=row[s.key];if(!sec)return;Object.values(sec).forEach(function(v){if(typeof v==="number"&&v>=1&&v<=5){sum+=v;cnt++;}});});return Object.assign({},s,{avg:cnt>0?(sum/cnt).toFixed(1):null});});
    var wa=sa.filter(function(s){return s.avg;});
    return {sectionAvgs:sa,overallAvg:wa.length?(wa.reduce(function(a,s){return a+parseFloat(s.avg);},0)/wa.length).toFixed(1):null};
  })();

  var sortedEvals=[...evals].sort(function(a,b){var da=new Date(a.submitted_at||a.created_at),db=new Date(b.submitted_at||b.created_at);return eSort==="newest"?db-da:da-db;})
    .map(function(r,i){return Object.assign({},r,{_idx:eSort==="newest"?evals.length-i:i+1});});

  async function fetchTraffic(days){
    var d=days||trafDays;setTrafLoading(true);
    try{var stats=await fetchDailyStats(d);setTraffic(stats);
      var tr=await supabase.from("site_visits").select("*",{count:"exact",head:true});setTrafTotal(tr.count||0);
      var ts=new Date().toISOString().split("T")[0];
      var td=await supabase.from("site_visits").select("*",{count:"exact",head:true}).eq("visit_date",ts);setTrafToday(td.count||0);
    }catch(e){console.error(e);}finally{setTrafLoading(false);}
  }

  const TABS=[
    {key:"gallery",label:"Galerie",Icon:Image,count:gallery.length},
    {key:"announcements",label:"Annonces",Icon:Megaphone,count:anns.length},
    {key:"testimonials",label:"Avis",Icon:MessageCircle,count:testis.length},
    {key:"evaluations",label:"Évals",Icon:ClipboardList,count:evals.length},
    {key:"traffic",label:"Trafic",Icon:TrendingUp,count:trafTotal},
  ];

  if(!authed) return (
    <div style={{background:BG,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"1.5rem"}}>
      <div style={{background:WHT,width:"100%",maxWidth:380,borderRadius:16,overflow:"hidden",boxShadow:"0 8px 40px rgba(10,10,10,0.12)"}}>
        <div style={{background:B,padding:"2rem"}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.52rem",letterSpacing:"0.2em",color:"rgba(255,255,255,0.6)",textTransform:"uppercase",marginBottom:"0.4rem"}}>Espace réservé</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"2rem",letterSpacing:"0.04em",color:"#fff",lineHeight:1}}>ADMIN STUD 2026</div>
        </div>
        <div style={{padding:"2rem"}}>
          <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1.25rem",fontFamily:"'DM Mono',monospace",fontSize:"0.54rem",color:GRY,letterSpacing:"0.1em"}}>
            <Lock size={13}/> Accès administrateurs uniquement
          </div>
          <input type="password" placeholder="Mot de passe" value={pw} onChange={function(e){setPw(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")handleLogin();}} autoFocus
            style={Object.assign({},inp,{marginBottom:"0.65rem",border:pwErr?"2px solid #C62828":"1.5px solid "+BDR})}/>
          {pwErr&&<div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.54rem",color:"#C62828",marginBottom:"0.75rem"}}>Mot de passe incorrect.</div>}
          <button onClick={handleLogin} style={{width:"100%",padding:"0.9rem",background:B,color:"#fff",border:"none",cursor:"pointer",borderRadius:8,fontFamily:"'DM Mono',monospace",fontSize:"0.68rem",letterSpacing:"0.12em",textTransform:"uppercase",transition:"background .2s"}}
            onMouseEnter={function(e){e.currentTarget.style.background=BDK;}} onMouseLeave={function(e){e.currentTarget.style.background=B;}}>
            Accéder
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{background:BG,minHeight:"100vh"}}>
      <style>{`
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px;}
        .adm-top-tabs{display:flex;overflow-x:auto;}
        .adm-btm-tabs{display:none;}
        @media(max-width:768px){
          .adm-top-tabs{display:none!important;}
          .adm-btm-tabs{display:flex!important;}
          .adm-layout{grid-template-columns:1fr!important;}
          .eval-stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .eval-detail-grid{grid-template-columns:1fr!important;}
          .adm-content{padding:1rem!important;padding-bottom:80px!important;}
          .adm-topbar{padding:0 1rem!important;height:52px!important;}
          .adm-sub{display:none!important;}
          .adm-logout-txt{display:none!important;}
        }
        @media(max-width:480px){.eval-stats-grid{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      {/* topbar */}
      <div className="adm-topbar" style={{background:"#0D1B2A",borderBottom:"3px solid "+B,padding:"0 2rem",display:"flex",alignItems:"center",height:56,gap:"1.25rem",position:"sticky",top:0,zIndex:50}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.35rem",letterSpacing:"0.06em",color:"#fff"}}>
          ADMIN<span style={{color:B,marginLeft:"0.3rem"}}>STUD 2026</span>
        </div>
        <div className="adm-sub" style={{fontFamily:"'DM Mono',monospace",fontSize:"0.5rem",letterSpacing:"0.14em",color:"rgba(255,255,255,0.3)",textTransform:"uppercase"}}>
          Tableau de bord
        </div>
        <button onClick={handleLogout} style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"0.4rem",background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.7)",cursor:"pointer",padding:"0.4rem 0.9rem",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all .2s"}}
          onMouseEnter={function(e){e.currentTarget.style.background="rgba(255,255,255,0.18)";}} onMouseLeave={function(e){e.currentTarget.style.background="rgba(255,255,255,0.08)";}}>
          <LogOut size={13}/><span className="adm-logout-txt">Déconnexion</span>
        </button>
      </div>

      {/* top tabs — desktop */}
      <div className="adm-top-tabs" style={{background:WHT,borderBottom:"1px solid "+BDR}}>
        {TABS.map(function(t){var a=tab===t.key;return(
          <button key={t.key} onClick={function(){setTab(t.key);}} style={{padding:"0.875rem 1.5rem",border:"none",cursor:"pointer",background:"transparent",fontFamily:"'DM Mono',monospace",fontSize:"0.6rem",letterSpacing:"0.1em",textTransform:"uppercase",color:a?B:GRY,borderBottom:a?"3px solid "+B:"3px solid transparent",transition:"all .2s",display:"flex",alignItems:"center",gap:"0.5rem",whiteSpace:"nowrap",flexShrink:0}}>
            {t.label}
            <span style={{background:a?BLT:"#EAEAE5",color:a?B:GRY,padding:"1px 7px",borderRadius:99,fontSize:"0.5rem"}}>{t.count!==null?t.count:"—"}</span>
          </button>);})}
      </div>

      {/* content */}
      <div className="adm-content" style={{maxWidth:1100,margin:"0 auto",padding:"1.5rem 2rem"}}>

        {/* GALLERY */}
        {tab==="gallery"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.15rem",letterSpacing:"0.06em"}}>{gallery.length} média{gallery.length!==1?"s":""}</span>
              <button onClick={function(){setGShow(function(v){return !v;});}} style={{display:"flex",alignItems:"center",gap:"0.4rem",background:gShow?BLT:B,color:gShow?B:"#fff",border:"none",borderRadius:8,padding:"0.6rem 1rem",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"0.54rem",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all .2s"}}>
                <ImagePlus size={14}/>{gShow?"Annuler":"Ajouter"}
              </button>
            </div>
            {gShow&&(
              <div style={{background:WHT,borderRadius:12,border:"1px solid "+BDR,padding:"1.25rem",marginBottom:"1rem"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:"0.06em",marginBottom:"1rem"}}>Nouveau média</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,background:"#F4F6F9",borderRadius:8,padding:4}}>
                    {["image","video"].map(function(t){var a=gForm.type===t;return(
                      <button key={t} onClick={function(){setGForm(function(f){return Object.assign({},f,{type:t});});}} style={{padding:"0.55rem",border:"none",cursor:"pointer",background:a?WHT:"transparent",color:a?B:GRY,borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all .15s",boxShadow:a?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
                        {t==="image"?"Image":"Vidéo"}
                      </button>);})}
                  </div>
                  <div>
                    <label style={lbl}>Uploader un fichier</label>
                    <label style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.875rem 1rem",border:"1.5px dashed "+BDR,borderRadius:8,cursor:"pointer",background:gFile?"#F0FFF4":"#FAFAFA"}}>
                      <Upload size={15} color={GRY}/>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.56rem",color:gFile?"#2E7D32":GRY}}>{gFile?gFile.name:"Cliquez pour choisir"}</span>
                      <input type="file" accept={gForm.type==="image"?"image/*":"video/*"} onChange={function(e){setGFile(e.target.files[0]);setGForm(function(f){return Object.assign({},f,{url:""});});}} style={{display:"none"}}/>
                      {gFile&&<button onClick={function(e){e.preventDefault();setGFile(null);}} style={{marginLeft:"auto",background:"none",border:"none",cursor:"pointer",padding:0}}><X size={14} color={GRY}/></button>}
                    </label>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}><div style={{flex:1,height:1,background:BDR}}/><span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.5rem",color:GRY}}>OU</span><div style={{flex:1,height:1,background:BDR}}/></div>
                  <div>
                    <label style={lbl}>URL (YouTube, Vimeo, directe)</label>
                    <input value={gForm.url} onChange={function(e){setGForm(function(f){return Object.assign({},f,{url:e.target.value});});setGFile(null);}} placeholder="https://..." disabled={!!gFile} style={Object.assign({},inp,{opacity:gFile?0.5:1})} onFocus={function(e){e.target.style.borderColor=B;}} onBlur={function(e){e.target.style.borderColor=BDR;}}/>
                    {(gForm.url.includes("youtube")||gForm.url.includes("youtu.be")||gForm.url.includes("vimeo"))&&!gFile&&(
                      <div style={{marginTop:"0.4rem",padding:"0.5rem 0.75rem",background:BLT,border:"1px solid #BBDEFB",borderRadius:6,display:"flex",alignItems:"center",gap:"0.5rem"}}>
                        <CheckCircle size={13} color={B}/><span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.5rem",color:B}}>Lien embed détecté</span>
                      </div>
                    )}
                  </div>
                  <div><label style={lbl}>Légende</label><input value={gForm.caption} onChange={function(e){setGForm(function(f){return Object.assign({},f,{caption:e.target.value});});}} placeholder="Décrivez ce moment..." style={inp} onFocus={function(e){e.target.style.borderColor=B;}} onBlur={function(e){e.target.style.borderColor=BDR;}}/></div>
                  <div><label style={lbl}>Catégorie</label><select value={gForm.category} onChange={function(e){setGForm(function(f){return Object.assign({},f,{category:e.target.value});});}} style={Object.assign({},inp,{cursor:"pointer"})}>{GALLERY_CATS.map(function(c){return <option key={c}>{c}</option>;})}</select></div>
                  <button onClick={handleGallerySubmit} disabled={!gFile&&!gForm.url.trim()} style={{padding:"0.875rem",borderRadius:8,border:"none",background:(!gFile&&!gForm.url.trim())?BDR:B,color:(!gFile&&!gForm.url.trim())?GRY:"#fff",cursor:(!gFile&&!gForm.url.trim())?"not-allowed":"pointer",fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all .2s"}}>
                    {gUploading?"Upload...":gSuccess?"Publié !":"Publier le média"}
                  </button>
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {gLoading?<Loader/>:gallery.length===0?<Empty text="Aucun média publié."/>:gallery.map(function(item){return(
                <div key={item.id} style={{background:WHT,borderRadius:10,border:"1px solid "+BDR,display:"flex",gap:"0.875rem",padding:"0.875rem",alignItems:"flex-start"}}>
                  <div style={{width:64,height:48,flexShrink:0,borderRadius:6,overflow:"hidden",background:BG}}>
                    {item.type==="video"?<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"#0D1B2A",color:"rgba(255,255,255,0.5)",fontFamily:"'DM Mono',monospace",fontSize:"0.42rem"}}>VIDEO</div>:<img src={item.url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"0.82rem",color:INK,marginBottom:"0.3rem",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.caption||<span style={{color:GRY,fontStyle:"italic"}}>Sans légende</span>}</div>
                    <div style={{display:"flex",gap:"0.4rem",alignItems:"center"}}><Tag text={item.category}/><span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY}}>{timeAgo(item.created_at)}</span></div>
                  </div>
                  <DelBtn onClick={function(){handleGalleryDelete(item.id);}}/>
                </div>);})}
            </div>
          </div>
        )}

        {/* ANNOUNCEMENTS */}
        {tab==="announcements"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem"}}>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.15rem",letterSpacing:"0.06em"}}>{anns.length} annonce{anns.length!==1?"s":""}</span>
              <button onClick={function(){setAShow(function(v){return !v;});}} style={{display:"flex",alignItems:"center",gap:"0.4rem",background:aShow?BLT:B,color:aShow?B:"#fff",border:"none",borderRadius:8,padding:"0.6rem 1rem",cursor:"pointer",fontFamily:"'DM Mono',monospace",fontSize:"0.54rem",letterSpacing:"0.1em",textTransform:"uppercase",transition:"all .2s"}}>
                <Plus size={14}/>{aShow?"Annuler":"Nouvelle"}
              </button>
            </div>
            {aShow&&(
              <div style={{background:WHT,borderRadius:12,border:"1px solid "+BDR,padding:"1.25rem",marginBottom:"1rem"}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:"0.06em",marginBottom:"1rem"}}>Nouvelle annonce</div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
                  <div><label style={lbl}>Titre *</label><input value={aForm.title} onChange={function(e){setAForm(function(f){return Object.assign({},f,{title:e.target.value});});}} placeholder="Titre de l'annonce" style={inp} onFocus={function(e){e.target.style.borderColor=B;}} onBlur={function(e){e.target.style.borderColor=BDR;}}/></div>
                  <div><label style={lbl}>Message *</label><textarea value={aForm.body} onChange={function(e){setAForm(function(f){return Object.assign({},f,{body:e.target.value});});}} placeholder="Votre annonce..." rows={4} style={Object.assign({},inp,{resize:"vertical"})} onFocus={function(e){e.target.style.borderColor=B;}} onBlur={function(e){e.target.style.borderColor=BDR;}}/></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
                    <div><label style={lbl}>Auteur</label><input value={aForm.author} onChange={function(e){setAForm(function(f){return Object.assign({},f,{author:e.target.value});});}} placeholder="Comité..." style={inp} onFocus={function(e){e.target.style.borderColor=B;}} onBlur={function(e){e.target.style.borderColor=BDR;}}/></div>
                    <div><label style={lbl}>Catégorie</label><select value={aForm.category} onChange={function(e){setAForm(function(f){return Object.assign({},f,{category:e.target.value});});}} style={Object.assign({},inp,{cursor:"pointer"})}>{ANN_CATS.map(function(c){return <option key={c}>{c}</option>;})}</select></div>
                  </div>
                  <label style={{display:"flex",alignItems:"center",gap:"0.6rem",cursor:"pointer",padding:"0.6rem 0.875rem",borderRadius:8,border:"1.5px solid "+BDR,fontFamily:"'DM Mono',monospace",fontSize:"0.54rem",letterSpacing:"0.1em",textTransform:"uppercase",color:GRY}}>
                    <input type="checkbox" checked={aForm.pinned} onChange={function(e){setAForm(function(f){return Object.assign({},f,{pinned:e.target.checked});});}}/> Épingler
                  </label>
                  <button onClick={handleAnnSubmit} disabled={!aForm.title.trim()||!aForm.body.trim()} style={{padding:"0.875rem",borderRadius:8,border:"none",background:(!aForm.title.trim()||!aForm.body.trim())?BDR:B,color:(!aForm.title.trim()||!aForm.body.trim())?GRY:"#fff",cursor:(!aForm.title.trim()||!aForm.body.trim())?"not-allowed":"pointer",fontFamily:"'DM Mono',monospace",fontSize:"0.62rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>
                    {aSuccess?"Publié !":"Publier l'annonce"}
                  </button>
                </div>
              </div>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              {aLoading?<Loader/>:anns.length===0?<Empty text="Aucune annonce publiée."/>:anns.map(function(item){var cc=CAT_COLORS[item.category]||B;return(
                <div key={item.id} style={{background:WHT,borderRadius:10,padding:"1rem",border:"1px solid "+(item.pinned?cc:BDR)}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:"0.75rem"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:"0.4rem",alignItems:"center",marginBottom:"0.4rem",flexWrap:"wrap"}}>
                        {item.pinned&&<Pin size={11} color={cc}/>}<Tag text={item.category} color={cc}/>
                        <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY}}>{timeAgo(item.created_at)}</span>
                      </div>
                      <div style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:"0.9rem",color:INK,marginBottom:"0.25rem"}}>{item.title}</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:"0.78rem",color:"#666",lineHeight:1.55}}>{item.body.length>100?item.body.slice(0,100)+"...":item.body}</div>
                    </div>
                    <div style={{display:"flex",gap:"0.1rem",flexShrink:0}}>
                      <button onClick={function(){handleAnnPin(item.id,item.pinned);}} style={{background:"none",border:"none",cursor:"pointer",padding:"6px",borderRadius:6,color:item.pinned?cc:GRY}}>{item.pinned?<PinOff size={14}/>:<Pin size={14}/>}</button>
                      <DelBtn onClick={function(){handleAnnDelete(item.id);}}/>
                    </div>
                  </div>
                </div>);})}
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {tab==="testimonials"&&(
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1.15rem",letterSpacing:"0.06em",marginBottom:"1rem"}}>{testis.length} témoignage{testis.length!==1?"s":""}</div>
            {tLoading?<Loader/>:testis.length===0?<Empty icon={<MessageSquare size={32} color="#ddd"/>} text="Aucun témoignage."/>:(
              <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                {testis.map(function(t){var ini=t.name==="Anonyme"?"?":t.name.split(" ").slice(0,2).map(function(w){return w[0];}).join("").toUpperCase();return(
                  <div key={t.id} style={{background:WHT,borderRadius:10,border:"1px solid "+BDR,padding:"1rem",display:"flex",gap:"0.875rem",alignItems:"flex-start"}}>
                    <div style={{width:40,height:40,borderRadius:10,background:B,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:"0.9rem",color:"#fff",flexShrink:0}}>{ini}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",gap:"0.4rem",alignItems:"center",marginBottom:"0.25rem",flexWrap:"wrap"}}>
                        <span style={{fontFamily:"'Fraunces',serif",fontWeight:700,fontSize:"0.85rem",color:INK}}>{t.name}</span>
                        {t.role&&<span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.role}</span>}
                        <span style={{marginLeft:"auto",display:"flex",gap:1}}>{[1,2,3,4,5].map(function(s){return <span key={s} style={{fontSize:"0.6rem",color:s<=t.rating?"#F9A825":"#ddd"}}>★</span>;})}</span>
                      </div>
                      <p style={{fontFamily:"'Fraunces',serif",fontStyle:"italic",fontSize:"0.82rem",color:"#3D3D38",lineHeight:1.6,margin:"0 0 0.3rem"}}>{"\u0022" + t.body + "\u0022"}</p>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",color:GRY}}>{timeAgo(t.created_at)}</span>
                    </div>
                    <DelBtn onClick={function(){handleTestiDelete(t.id);}}/>
                  </div>);})}
              </div>
            )}
          </div>
        )}

        {/* EVALUATIONS */}
        {tab==="evaluations"&&(
          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0.75rem"}} className="eval-stats-grid">
              <StatCard label="Soumissions" value={evals.length} color={B}/>
              <StatCard label="Note moy." value={evalStats?evalStats.overallAvg:"—"} color="#F9A825"/>
              <StatCard label="Aujourd'hui" value={evals.filter(function(e){return new Date(e.submitted_at||e.created_at).toDateString()===new Date().toDateString();}).length} color="#2E7D32"/>
              <div style={{background:INK,borderRadius:12,padding:"1.1rem",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:"0.5rem"}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:"0.46rem",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.4)"}}>Exporter</div>
                <button onClick={exportCSV} disabled={!evals.length} style={{display:"inline-flex",alignItems:"center",gap:"0.4rem",background:evals.length?B:"rgba(255,255,255,0.1)",color:"#fff",border:"none",padding:"0.5rem 0.75rem",borderRadius:6,fontFamily:"'DM Mono',monospace",fontSize:"0.5rem",letterSpacing:"0.1em",textTransform:"uppercase",cursor:evals.length?"pointer":"not-allowed"}}>
                  <Download size={12}/> CSV
                </button>
              </div>
            </div>
            {evalStats&&(
              <div style={{background:WHT,borderRadius:12,border:"1px solid "+BDR,padding:"1.25rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"0.5rem",marginBottom:"1rem"}}><BarChart2 size={15} color={B}/><span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:"0.06em"}}>Moyennes par section</span></div>
                <div style={{display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                  {evalStats.sectionAvgs.map(function(s){var pct=s.avg?(parseFloat(s.avg)/5)*100:0,bc=pct>=80?"#2E7D32":pct>=60?B:pct>=40?"#F57C00":"#C62828";return(
                    <div key={s.key} style={{display:"flex",alignItems:"center",gap:"0.6rem"}}>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.44rem",letterSpacing:"0.08em",textTransform:"uppercase",color:GRY,width:180,flexShrink:0,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.emoji+" "+s.label}</span>
                      <div style={{flex:1,height:8,background:"#F0F4F8",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:pct+"%",background:bc,borderRadius:4,transition:"width .6s"}}/></div>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.48rem",color:s.avg?bc:"#ccc",width:28,textAlign:"right",flexShrink:0}}>{s.avg||"—"}</span>
                    </div>);})}
                </div>
              </div>
            )}
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem",flexWrap:"wrap",gap:"0.5rem"}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"1rem",letterSpacing:"0.06em"}}>Soumissions</span>
                <div style={{display:"flex",gap:"0.4rem"}}>
                  {["newest","oldest"].map(function(o){var a=eSort===o;return(
                    <button key={o} onClick={function(){setESort(o);}} style={{padding:"0.35rem 0.75rem",background:a?B:WHT,color:a?"#fff":GRY,border:"1.5px solid "+(a?B:BDR),fontFamily:"'DM Mono',monospace",fontSize:"0.48rem",letterSpacing:"0.1em",textTransform:"uppercase",cursor:"pointer",borderRadius:6,transition:"all .15s"}}>
                      {o==="newest"?"Récent":"Ancien"}
                    </button>);})}
                </div>
              </div>
              {eLoading?<Loader/>:evals.length===0?<Empty icon={<ClipboardList size={32} color="#ddd"/>} text="Aucune évaluation."/>:sortedEvals.map(function(row){return <EvalRow key={row.id} row={row} onDelete={handleEvalDelete}/>;}) }
            </div>
          </div>
        )}

        {/* TRAFFIC */}
        {tab==="traffic"&&(
          <TrafficTab traffic={traffic} trafTotal={trafTotal} trafToday={trafToday} trafLoading={trafLoading} trafDays={trafDays} onChangeDays={function(d){setTrafDays(d);fetchTraffic(d);}}/>
        )}

      </div>

      {/* bottom tabs — mobile */}
      <div className="adm-btm-tabs" style={{position:"fixed",bottom:0,left:0,right:0,background:WHT,borderTop:"1px solid "+BDR,zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {TABS.map(function(t){var a=tab===t.key;return(
          <button key={t.key} onClick={function(){setTab(t.key);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"3px",padding:"10px 4px 8px",border:"none",background:a?BLT:"transparent",cursor:"pointer",color:a?B:GRY,borderTop:"2px solid "+(a?B:"transparent"),transition:"all .2s",position:"relative",minWidth:0}}>
            <t.Icon size={20} strokeWidth={a?2:1.5}/>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:"0.4rem",letterSpacing:"0.06em",textTransform:"uppercase",fontWeight:a?700:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100%"}}>{t.label}</span>
            {t.count!==null&&t.count>0&&<span style={{position:"absolute",top:5,right:"calc(50% - 18px)",background:a?B:"#E0E0E0",color:a?"#fff":"#888",fontSize:"0.36rem",fontFamily:"'DM Mono',monospace",borderRadius:99,padding:"1px 4px",lineHeight:1.4,minWidth:14,textAlign:"center"}}>{t.count>99?"99+":t.count}</span>}
          </button>);})}
      </div>

    </div>
  );
}