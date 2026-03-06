import { useState, useEffect } from "react";

export const ADMIN_PASSWORD = "stud2026admin";

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  const set = (v) => {
    const next = typeof v === "function" ? v(value) : v;
    setValue(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };

  // Sync across tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === key) {
        try { setValue(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key]);

  return [value, set];
}

export function checkAdmin(pw) {
  return pw === ADMIN_PASSWORD;
}

// Seed demo announcements if none exist
export function seedAnnouncements() {
  try {
    const existing = localStorage.getItem("stud_announcements");
    if (!existing) {
      const demo = [
        {
          id: "a1",
          title: "Bienvenue à la STUD 2026 !",
          body: "La Semaine du Travailleur de l'Université de Douala ouvre ses portes le 24 avril 2026. Rejoignez-nous pour une semaine de célébration, de sport, de culture et d'excellence.",
          author: "Comité Organisateur",
          category: "Général",
          pinned: true,
          createdAt: new Date("2026-04-01T09:00:00").toISOString(),
        },
        {
          id: "a2",
          title: "Inscriptions ouvertes — Miss STUD 2026",
          body: "Les inscriptions pour l'élection Miss STUD 2026 sont officiellement ouvertes. Tenues : ville, traditionnelle, soirée, 1er mai. Contactez-nous via WhatsApp pour vous inscrire.",
          author: "Sous-commission culturelle",
          category: "Culture",
          pinned: false,
          createdAt: new Date("2026-04-05T14:30:00").toISOString(),
        },
        {
          id: "a3",
          title: "Tirage au sort — Tournoi Football",
          body: "Le tirage au sort des 12 équipes pour le mini-tournoi de football masculin aura lieu le 1er avril 2026. Les équipes sont invitées à se faire enregistrer avant le 28 mars.",
          author: "Sous-commission sportive",
          category: "Sport",
          pinned: false,
          createdAt: new Date("2026-03-20T10:00:00").toISOString(),
        },
      ];
      localStorage.setItem("stud_announcements", JSON.stringify(demo));
    }
  } catch {}
}