import { useState, useEffect } from "react";
import { META } from "../data";

export default function Countdown({ compact = false }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    const target = new Date(META.eventStart).getTime();
    const calc = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setTime({ over: true });
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime({ d, h, m, s, over: false });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, []);

  if (!time) return null;

  if (time.over) {
    return (
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: compact ? "1.2rem" : "1.8rem", color: "#F57C00", letterSpacing: "0.06em" }}>
        L'ÉVÉNEMENT EST EN COURS !
      </div>
    );
  }

  const units = [
    { val: time.d, label: "Jours" },
    { val: time.h, label: "Heures" },
    { val: time.m, label: "Minutes" },
    { val: time.s, label: "Secondes" },
  ];

  if (compact) {
    return (
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {units.map((u, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", lineHeight: 1,
              color: "#1565C0", letterSpacing: "0.04em",
              background: "#EEF4FF", padding: "0.2rem 0.5rem", minWidth: 48, textAlign: "center",
            }}>
              {String(u.val).padStart(2, "0")}
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.48rem", color: "#88887F", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>{u.label}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "#0F0F0F", border: "1.5px solid #0F0F0F" }}>
      {units.map((u, i) => (
        <div key={i} style={{ background: i % 2 === 0 ? "#FAFAF8" : "#EEF4FF", padding: "2rem 1.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(3rem, 5vw, 5rem)", lineHeight: 1, color: i % 2 === 0 ? "#0F0F0F" : "#1565C0", letterSpacing: "0.02em" }}>
            {String(u.val).padStart(2, "0")}
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#88887F", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "0.5rem" }}>{u.label}</div>
        </div>
      ))}
    </div>
  );
}