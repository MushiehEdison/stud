// ============================================================
// STUD 2026 — Semaine du Travailleur, Université de Douala
// All data sourced directly from the official LIVRET document
// ============================================================

export const META = {
  title: "STUD 2026",
  subtitle: "Semaine du Travailleur",
  tagline: "Associez votre image à l'excellence et à la valorisation des travailleurs de l'Université de Douala.",
  theme: "Associez votre image à l'excellence et à la valorisation des travailleurs de l'Université de Douala.",
  dates: "24 – 30 Avril 2026",
  dateShort: "24.04 → 30.04",
  location: "Université de Douala",
  patron: "Pr. Magloire ONDOA",
  patronTitle: "Recteur de l'Université de Douala",
  edition: "Édition 2026",
};

export const STATS = [
  { value: 48871, label: "Étudiants" },
  { value: 2220, label: "Personnels" },
  { value: 7, label: "Jours" },
  { value: 3, label: "Campus" },
];

export const ABOUT = {
  history: [
    {
      year: "1977",
      title: "Création du Centre Universitaire de Douala",
      description:
        "Institué par décret n° 77/108 du 28 avril 1977. Vocation principale : formation des cadres dans les domaines des sciences économiques, commerciales et de l'enseignement technique. Écoles fondatrices : l'ESSEC et l'ENSET.",
    },
    {
      year: "1993",
      title: "Érection en Université d'État",
      description:
        "Dans le cadre de la réforme globale du système universitaire camerounais : Décret n° 93/026 du 19 janvier 1993 portant création des universités d'État ; Décret n° 93/030 du 19 janvier 1993 portant organisation de l'Université de Douala. Autonomie administrative et académique conférée.",
    },
    {
      year: "2019",
      title: "Direction du Pr. Magloire Ondoa",
      description:
        "Depuis 2019, sous son impulsion, l'Université de Douala accélère son développement académique, renforce ses partenariats stratégiques et consolide le bien-être de ses personnels.",
    },
  ],
  rectors: [
    { name: "Pr. Stanislas Melone", period: "01/1993 – 10/1993" },
    { name: "Pr. Théophile Ngando Mpondo", period: "1993 – 1998" },
    { name: "Pr. Joseph Noah Ngamveng", period: "1998 – 2000" },
    { name: "Pr. Maurice Tchuente", period: "2000 – 2002" },
    { name: "Pr. Bruno Bekolo Ebe", period: "2003 – 2012" },
    { name: "Pr. Dieudonné Oyono", period: "2012 – 2015" },
    { name: "Pr. François-Xavier Etoa", period: "2015 – 2019" },
    { name: "Pr. Magloire Ondoa", period: "Depuis 2019", current: true },
  ],
  faculties: [
    "Sciences",
    "Sciences Juridiques et Politiques",
    "Lettres et Sciences Humaines",
    "Sciences Économiques et de Gestion Appliquées",
    "Médecine et Sciences Pharmaceutiques",
    "ESSEC", "ENSET", "IUT", "ENSPD", "INSAHV", "IBA",
  ],
  admin: {
    topManagement: [
      "Le Président du Conseil d'Administration",
      "Le Recteur",
      "Les Vice-Recteurs",
      "Le Secrétaire Général",
      "Le Conseiller Technique",
    ],
    centralServices: [
      "Direction des Affaires Académiques et de la Coopération",
      "Direction du Centre des Œuvres Universitaires",
      "Direction des Infrastructures, de la Planification et du Développement",
      "Direction des Affaires Administratives et Financières",
    ],
    attached: [
      "Bibliothèque Universitaire",
      "Centre Médico-Social",
      "Agence Comptable",
      "Contrôle Financier Spécialisé",
      "Commission Interne de Passation des Marchés Financiers",
    ],
    specialized: [
      "Programme d'Appui à la Composante Technologique et Professionnelle (PRO-ACTP)",
      "Centre de Physique Atomique Moléculaire, Optique et Quantique (CEPAMOQ)",
      "École Doctorale des Sciences Fondamentales et Appliquées (EDOSFA)",
      "École Doctorale des Sciences Sociales et Humaines (EDOSSH)",
      "Centre de Développement du Numérique Universitaire (CDNU)",
      "Académie Internet",
      "Bibliothèque de Recherche des Écoles Doctorales (BRED)",
    ],
  },
};

export const OBJECTIVES = [
  { num: "01", title: "Valoriser le capital humain", desc: "Reconnaître et célébrer la contribution du personnel.", icon: "Award" },
  { num: "02", title: "Développer les compétences", desc: "Offrir des opportunités de formation et de perfectionnement.", icon: "BookOpen" },
  { num: "03", title: "Accroître la performance", desc: "Stimuler l'engagement et l'excellence au quotidien.", icon: "TrendingUp" },
  { num: "04", title: "Consolider le sentiment d'appartenance", desc: "Promouvoir l'intégration et la cohésion institutionnelle.", icon: "Users" },
];

export const PROGRAM = {
  sports: [
    {
      name: "Marche Sportive",
      date: "25 avril 2026",
      time: "Rassemblement 6h00 · Départ 6h30",
      description: "Itinéraire : Campus 1 – Palais de Justice – Chefferie Ndogbong – Carrefour Zachman – Campus 2 – Carrefour Pendaison – retour Campus 1. Modalité : libre (150 participants).",
      details: "Vestimentaire : Polo / T-shirt UDO",
      icon: "PersonStanding",
    },
    {
      name: "Mini Tournoi Football Masculin",
      date: "Mardi 28, Mercredi 29 & Jeudi 30 avril 2026",
      time: "3 jours de compétition",
      description: "Participants : 12 équipes réparties en 2 poules. Organisation : tirage au sort des play-offs prévu le 1er avril 2026. Composition : 5 personnes par équipe.",
      details: "Modalité : Élimination directe. Jury : 1 arbitre central, 2 juges, 1 commissaire du match",
      icon: "Trophy",
    },
    {
      name: "Tir à la Corde",
      date: "Jeudi 30 avril 2026",
      time: "Journée",
      description: "Composition des équipes : 5 personnes par équipe.",
      details: "Modalité : Élimination directe. Jury : M. TONYE PAMBE & Mme MAKALE",
      icon: "Dumbbell",
    },
    {
      name: "Course de Relais",
      date: "Jeudi 30 avril 2026",
      time: "Journée",
      description: "Composition des équipes : 4 personnes par équipe.",
      details: "Modalité : Élimination directe",
      icon: "Zap",
    },
  ],
  cultural: [
    {
      name: "Quizz",
      date: "Mardi 28 avril 2026",
      time: "Journée",
      description: "Composition : 12 groupes de 3 personnes. Contenu : 15 questions portant sur l'actualité et la connaissance de l'Université de Douala.",
      details: "Modalité : Élimination directe. Jury : Dr MAKONDO & Mme MEKOUI",
      icon: "HelpCircle",
    },
    {
      name: "Poésie UDO",
      date: "Mercredi 29 avril 2026",
      time: "Journée",
      description: "Thème : Fête du travail (1er mai) ou Université de Douala. Langues : Français ou anglais.",
      details: "Modalité : Inscription en ligne. Jury : M. ONANA David, Théodore KAYESSE, Mme AKOA EVINA",
      icon: "FileText",
    },
    {
      name: "Songho'o / Damier",
      date: "29 & 30 avril 2026",
      time: "Journée",
      description: "Participants : 08 équipes de 2. Modalité : croisement des vainqueurs jusqu'en finale.",
      details: "Inscription libre sur WhatsApp. Jury : SCO, M. BILOUNGA (DIPD), M. FOUMAN, Pr FOUDA, Pr MVE BELINGA, Pr BIBOUM",
      icon: "LayoutGrid",
    },
    {
      name: "Concours de la Meilleure Signature Institutionnelle",
      date: "30 avril 2026",
      time: "Journée",
      description: "12 participants (11 établissements + Services Centraux). Objectif : élaboration d'un message institutionnel bref et de haute qualité pour l'Université de Douala.",
      details: "Jury : Pr MEFOUTE, Pr Thomas ATENGA, Dr AMOUGOU",
      icon: "PenTool",
    },
    {
      name: "Concours de Danses Patrimoniales",
      date: "29 avril 2026",
      time: "Journée",
      description: "Participants : 1 équipe de 6 personnes par établissement + Services Centraux. Prestations sur rythmes locaux patrimoniaux (Essewé, Benskin, Assiko, Bitkutsi…).",
      details: "Jury : DCOU, DASA, Directeurs ISH",
      icon: "Music",
    },
    {
      name: "Concours d'Art Culinaire",
      date: "28 avril 2026",
      time: "Journée",
      description: "Thème : Mets traditionnels (Ndapche, Eru, Koki, Condré…). 12 participants (11 établissements + Services Centraux).",
      details: "Jury : Pr IKELLE Rose, Chef Division de la Restauration, Les SAGP, Mme MVENG, Mme NNOUCK Chantale",
      icon: "UtensilsCrossed",
    },
    {
      name: "Karaoké (The Voice UDO)",
      date: "28 avril 2026",
      time: "Soirée",
      description: "Modalité : Interprétation live des musiques du terroir.",
      details: "Jury : Pr BIBOUM, EPOUPA, ASSENE Osée, ETEME Didier",
      icon: "Mic",
    },
    {
      name: "Élection Miss STUD",
      date: "29 avril 2026",
      time: "Soirée",
      description: "Ouvert au public. Tenues : ville, traditionnelle, soirée, 1er mai. Déroulement : présentation en tenues professionnelle, sportive, culturelle, de soirée et de fête du travail.",
      details: "Jury : Pr MODI KOKO, Pr MOUSSA, Dr ETET BAHA, Pr NTAMACK, Mannequin POLO BALEP",
      icon: "Star",
    },
    {
      name: "Jeu Tombola",
      date: "01 Mai 2026",
      time: "Clôture",
      description: "Modalité : Tirage au sort et attribution de lots.",
      details: "Jury : Mme DAAPA, 02 Majorettes, 02 personnels DAAPA",
      icon: "Gift",
    },
  ],
  intellectual: [
    {
      name: "Conférences – Débats",
      date: "28 Avril & 30 avril 2026",
      time: "Journée",
      description: "Thèmes : gestions de carrières et préparation à la retraite · La fête du travail · La banque, un partenaire fiable (gestion des agios) · Cotisations sociales (CNPS) et assurances : quel impact réel ? · Bulletin de solde.",
      details: "Voir la sous-commission",
      icon: "MessageSquare",
    },
    {
      name: "Investissement Humain",
      date: "27 avril 2026",
      time: "Journée",
      description: "Action : Assainissement des différents campus de l'Université de Douala.",
      details: "",
      icon: "Leaf",
    },
    {
      name: "Visite Guidée et d'Apprentissage",
      date: "27 avril 2026",
      time: "Journée",
      description: "Lieu : Centre d'archivage et de documentation du PAD (70 places).",
      details: "Jury : C/DAAPA",
      icon: "Building2",
    },
  ],
};

export const SPONSORING = [
  {
    tier: "Diamant", rank: "01", price: "15 000 000", currency: "XAF", badge: "◆", color: "#0EA5E9",
    elements: [
      "1 podium pour la cérémonie + sonorisation et régie",
      "Parrainage des équipes de football",
      "10 ballons de football",
      "Offre de 50 lots de 50 000 FCFA aux gagnants — Total : 2 500 000",
      "1 week-end à Kribi pour la Miss STUD 2026",
      "500 t-shirts avec le logo de l'entreprise",
      "1 jeu de dames, 1 jeu de scrabble, 1 jeu de songho'o",
    ],
    visibility: [
      "Statut de sponsor officiel",
      "Activités scientifiques : 4 panelistes sur un thème au choix de l'entité",
      "01 espace pour vos deux (02) stands à l'entrée du Village des Travailleurs",
      "Intervention à l'ouverture et à la clôture",
      "Logo en position majeure sur tous les supports (affiches, banderoles, kakemonos, t-shirts, programme officiel)",
      "Présence sur le fond de scène officiel",
      "Possibilité d'installer des kakemonos, arches ou structures branding",
      "1 activité majeure porte le nom de l'entreprise",
      "Remise officielle d'un prix majeur au nom de l'entreprise",
      "Accès privilégié aux 3 campus : CAMPUS 1 (ANGE RAPHAEL), CAMPUS 2 (NDOGBONG), CAMPUS 3 (LOGBESSOU)",
      "Distribution des goodies officiels",
    ],
  },
  {
    tier: "Platine", rank: "02", price: "5 000 000", currency: "XAF", badge: "■", color: "#8B5CF6",
    elements: [
      "Parrainage la marche sportive",
      "Parrainage des ateliers de formation sur les thèmes fixés par l'entreprise",
      "Offre de 40 lots de 50 000 FCFA aux gagnants — Total : 2 000 000",
      "1 prix spécial au Master STUD 2026",
      "200 t-shirts avec le logo de l'entreprise",
    ],
    visibility: [
      "Activités scientifiques : 02 panelistes sur un thème au choix de l'entité",
      "01 espace à louer pour votre stand dans le Village des Travailleurs",
      "Intervention à l'ouverture et à la clôture",
      "Logo sur les supports (affiches, banderoles, kakemonos, t-shirts, programme officiel)",
      "Présence sur le fond de scène officiel",
      "Possibilité d'installer des kakemonos, arches ou structures branding",
      "1 activité culturelle porte le nom de l'entreprise",
      "Remise officielle d'un prix au nom de l'entreprise",
      "Accès privilégié aux 3 campus : CAMPUS 1 (ANGE RAPHAEL), CAMPUS 2 (NDOGBONG), CAMPUS 3 (LOGBESSOU)",
      "Distribution des Goodies",
    ],
  },
  {
    tier: "Or", rank: "03", price: "1 000 000", currency: "XAF", badge: "●", color: "#F59E0B",
    elements: [
      "Parrainage de la journée d'investissement humain",
      "Branding de tous les plants prévus pour l'activité de reforestation",
      "Offre de 10 lots de 50 000 FCFA aux gagnants — Total : 500 000",
      "1 prix spécial au gagnant du quiz",
      "1 prix spécial au gagnant de la meilleure signature institutionnelle",
      "100 t-shirts avec le logo de l'entreprise",
    ],
    visibility: [
      "Activités scientifiques : 2 panelistes sur un thème au choix de l'entité",
      "01 espace à louer pour votre stand dans le Village des Travailleurs",
      "Intervention à l'ouverture et à la clôture",
      "Logo sur les supports (affiches, banderoles, kakemonos, t-shirts, programme officiel)",
      "Présence sur le fond de scène officiel",
      "Possibilité d'installer des kakemonos, arches ou structures branding",
      "1 activité institutionnelle porte le nom de l'entreprise",
      "Remise officielle d'un prix au nom de l'entreprise",
      "Accès privilégié aux 3 campus : CAMPUS 1 (ANGE RAPHAEL), CAMPUS 2 (NDOGBONG), CAMPUS 3 (LOGBESSOU)",
      "Distribution des Goodies",
    ],
  },
];

export const CONTACT = {
  phones: ["+237 688 60 98 91", "+237 678 11 68 01", "+237 699 45 78 17", "+237 697 06 75 70"],
  emails: ["daapaudo2025@gmail.com", "vanessamezee29@gmail.com"],
  address: "Université de Douala, Cameroun",
};

export const NAV_LINKS = [
  { label: "Accueil", path: "/" },
  { label: "À Propos", path: "/about" },
  { label: "Programme", path: "/programme" },
  { label: "Sponsoring", path: "/sponsoring" },
  { label: "Contact", path: "/contact" },
];