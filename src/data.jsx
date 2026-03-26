// ============================================================
// STUD 2026 — Semaine du Travailleur, Université de Douala
// ============================================================

export const META = {
  title: "STUD 2026",
  subtitle: "Semaine du Travailleur",
  tagline: "Associez Votre image à l'excellence et à la valorisation du travailleur de l'université de Douala.",
  theme: "Associez votre image à l'excellence et à la valorisation des travailleurs de l'Université de Douala.",
  dates: "24 – 30 Avril 2026",
  dateShort: "24.04 → 30.04",
  eventStart: "2026-04-24T06:00:00",
  location: "Université de Douala",
  patron: "Pr. Magloire ONDOA",
  patronTitle: "Recteur de l'Université de Douala",
  edition: "Édition 2026",
};

export const STATS = [];

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
        "Décret n° 93/026 du 19 janvier 1993 portant création des universités d'État ; Décret n° 93/030 portant organisation de l'Université de Douala. Autonomie administrative et académique conférée.",
    },
    {
      year: "2019",
      title: "Direction du Pr. Magloire Ondoa",
      description:
        "Depuis 2019, sous son impulsion, l'Université de Douala accélère son développement académique, renforce ses partenariats stratégiques et consolide le bien-être de ses personnels.",
    },
  ],
  rectors: [
    { name: "Pr. Stanislas Melone",         period: "01/1993 – 10/1993" },
    { name: "Pr. Théophile Ngando Mpondo",  period: "1993 – 1998" },
    { name: "Pr. Joseph Noah Ngamveng",     period: "1998 – 2000" },
    { name: "Pr. Maurice Tchuente",         period: "2000 – 2002" },
    { name: "Pr. Bruno Bekolo Ebe",         period: "2003 – 2012" },
    { name: "Pr. Dieudonné Oyono",          period: "2012 – 2015" },
    { name: "Pr. François-Xavier Etoa",     period: "2015 – 2019" },
    { name: "Pr. Magloire Ondoa",           period: "Depuis 2019", current: true },
  ],
  faculties: [
    "Sciences","Sciences Juridiques et Politiques","Lettres et Sciences Humaines",
    "Sciences Économiques et de Gestion Appliquées","Médecine et Sciences Pharmaceutiques",
    "ESSEC","ENSET","IUT","ENSPD","INSAHV","IBA",
  ],
  admin: {
    topManagement: [
      "Le Président du Conseil d'Administration","Le Recteur","Les Vice-Recteurs",
      "Le Secrétaire Général","Le Conseiller Technique",
    ],
    centralServices: [
      "Direction des Affaires Académiques et de la Coopération",
      "Direction du Centre des Œuvres Universitaires",
      "Direction des Infrastructures, de la Planification et du Développement",
      "Direction des Affaires Administratives et Financières",
    ],
    attached: [
      "Bibliothèque Universitaire","Centre Médico-Social","Agence Comptable",
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
  { num:"01", title:"Valoriser le capital humain",          desc:"Reconnaître et célébrer la contribution du personnel.",             svg:"award.svg" },
  { num:"02", title:"Développer les compétences",          desc:"Offrir des opportunités de formation et de perfectionnement.",      svg:"book.svg"  },
  { num:"03", title:"Accroître la performance",            desc:"Stimuler l'engagement et l'excellence au quotidien.",               svg:"trending.svg" },
  { num:"04", title:"Consolider le sentiment d'appartenance", desc:"Promouvoir l'intégration et la cohésion institutionnelle.",      svg:"team.svg"  },
];

// ── PROGRAMME — 8 categories ──────────────────────────────────
export const PROGRAM = {
  sports: {
    label: "Sportives",
    color: "#1565C0",
    emoji: "🏃‍♂️",
    items: [
      { name:"Marche Sportive",     date:"25 Avr", description:"Itinéraire : Campus 1 → Palais de Justice → Ndogbong → Campus 2 → retour Campus 1. 150 participants.", details:"Vestimentaire : Polo / T-shirt UDO" },
      { name:"Football Masculin",   date:"28–30 Avr", description:"12 équipes, 2 poules, élimination directe. 5 joueurs par équipe.", details:"1 arbitre central, 2 juges, 1 commissaire" },
      { name:"Football Féminin",    date:"28–30 Avr", description:"Tournoi féminin inter-établissements. Tirage au sort le 1er avril.", details:"Composition : 5 personnes par équipe" },
      { name:"Tir à la Corde",      date:"30 Avr", description:"5 personnes par équipe. Élimination directe.", details:"Jury : M. TONYE PAMBE & Mme MAKALE" },
      { name:"Course de Relais",    date:"30 Avr", description:"4 personnes par équipe. Élimination directe.", details:"" },
    ],
  },
  jeux: {
    label: "Jeux de Société",
    color: "#7C3AED",
    emoji: "🎲",
    items: [
      { name:"Ludo",     date:"29–30 Avr", description:"Tournoi inter-équipes. 2 personnes par équipe.", details:"Inscription libre" },
      { name:"Damier",   date:"29–30 Avr", description:"8 équipes de 2. Croisement des vainqueurs jusqu'en finale.", details:"Jury : SCO, M. BILOUNGA, M. FOUMAN" },
      { name:"Scrabble", date:"29 Avr",    description:"Participants individuels ou en binôme. Dictionnaire officiel.", details:"Inscription sur WhatsApp" },
      { name:"Monopoly", date:"30 Avr",    description:"Plateaux officiels. Tournoi en poules puis finale.", details:"" },
    ],
  },
  culturelles: {
    label: "Culturelles",
    color: "#F57C00",
    emoji: "🎤",
    items: [
      { name:"The Voice UDO (Karaoké)",   date:"28 Avr soir",  description:"Interprétation live de musiques du terroir. Ouvert à tous.", details:"Jury : Pr BIBOUM, EPOUPA, ASSENE Osée, ETEME Didier" },
      { name:"Danses Patrimoniales",      date:"29 Avr",       description:"1 équipe de 6 par établissement. Essewé, Benskin, Assiko, Bitkutsi…", details:"Jury : DCOU, DASA, Directeurs ISH" },
      { name:"Élection Miss STUD",        date:"29 Avr soir",  description:"Tenues : ville, traditionnelle, soirée, 1er mai. Ouvert au public.", details:"Jury : Pr MODI KOKO, Pr MOUSSA, Dr ETET BAHA" },
      { name:"Concours d'Art Culinaire",  date:"28 Avr",       description:"Mets traditionnels : Ndapche, Eru, Koki, Condré… 12 participants.", details:"Jury : Pr IKELLE Rose, Chef Division Restauration" },
    ],
  },
  festivals: {
    label: "Festivals & Animations",
    color: "#D97706",
    emoji: "🎶",
    items: [
      { name:"Foire Exposition",              date:"24–30 Avr",    description:"Stands des établissements, expositions thématiques, artisanat local.", details:"" },
      { name:"Village du Travailleur",        date:"24–30 Avr",    description:"Espace de convivialité, restauration, animation continue sur les 3 campus.", details:"" },
      { name:"Concert Musical et Artistique", date:"30 Avr soir",  description:"Grande soirée de clôture en présence de M. le Recteur. Artistes invités.", details:"Scène principale — Campus 1" },
      { name:"Jeu Tombola",                   date:"1er Mai",      description:"Tirage au sort et attribution de lots lors de la clôture officielle.", details:"Jury : Mme DAAPA, Majorettes, personnels DAAPA" },
    ],
  },
  scientifiques: {
    label: "Scientifiques",
    color: "#374151",
    emoji: "📚",
    items: [
      { name:"Conférences-Débats",                        date:"28 & 30 Avr", description:"Gestion de carrières · Préparation retraite · La banque partenaire · Cotisations CNPS · Bulletin de solde.", details:"Voir la sous-commission" },
      { name:"Ateliers de Formation",                     date:"28 Avr",      description:"Ateliers pratiques sur des thèmes fixés par les entreprises partenaires.", details:"" },
      { name:"Quizz Universitaire",                       date:"28 Avr",      description:"12 groupes de 3 personnes. 15 questions sur l'actualité et l'UDo.", details:"Jury : Dr MAKONDO & Mme MEKOUI" },
      { name:"Concours Meilleure Signature Institutionnelle", date:"30 Avr",  description:"12 participants (11 établissements + Services Centraux). Message institutionnel.", details:"Jury : Pr MEFOUTE, Pr Thomas ATENGA, Dr AMOUGOU" },
      { name:"Poésie UDO",                                date:"29 Avr",      description:"Thème : Fête du Travail ou UDo. Français ou anglais.", details:"Jury : M. ONANA David, Théodore KAYESSE, Mme AKOA EVINA" },
    ],
  },
  social: {
    label: "Actions Sociales",
    color: "#059669",
    emoji: "🌍",
    items: [
      { name:"Campagnes de Santé",    date:"27 Avr", description:"Consultations médicales gratuites, dépistages, sensibilisations santé sur les campus.", details:"Centre Médico-Social" },
      { name:"Investissement Humain", date:"27 Avr", description:"Assainissement des 3 campus de l'Université de Douala.", details:"" },
      { name:"Visite Guidée PAD",     date:"27 Avr", description:"Visite d'apprentissage au Centre d'archivage et de documentation du PAD. 70 places.", details:"Jury : C/DAAPA" },
    ],
  },
  pointsforts: {
    label: "Points Forts",
    color: "#DB2777",
    emoji: "✨",
    items: [
      { name:"Journée Culturelle",               date:"29 Avr", description:"Toute la communauté universitaire en tenue traditionnelle. Journée festive.", details:"" },
      { name:"Concours Meilleure Signature",     date:"30 Avr", description:"Élaboration d'un message institutionnel fort pour l'Université de Douala.", details:"11 établissements + Services Centraux" },
      { name:"Dimanche Taro",                    date:"26 Avr", description:"Journée de détente et de cohésion. Programme spécial communauté.", details:"" },
    ],
  },
  ceremonies: {
    label: "Parade & Cérémonies",
    color: "#B45309",
    emoji: "🎉",
    items: [
      { name:"Défilé du 1er Mai",              date:"1er Mai",      description:"Défilé officiel de la Fête du Travail avec toute la communauté universitaire.", details:"" },
      { name:"Grande Soirée du Travailleur",   date:"30 Avr soir",  description:"Soirée de gala en présence de M. le Recteur. Remise des prix, spectacles.", details:"Campus 1 — Ange Raphaël" },
    ],
  },
};

export const SPONSORING = [
  {
    tier:"Diamant", rank:"01", price:"15 000 000", currency:"XAF", badge:"◆", color:"#1565C0",
    elements:[
      "1 podium pour la cérémonie + sonorisation et régie",
      "Parrainage des équipes de football",
      "10 ballons de football",
      "Offre de 50 lots de 50 000 FCFA aux gagnants — Total : 2 500 000",
      "1 week-end à Kribi pour la Miss STUD 2026",
      "500 t-shirts avec le logo de l'entreprise",
      "1 jeu de dames, 1 jeu de scrabble, 1 jeu de songho'o",
    ],
    visibility:[
      "Statut de sponsor officiel",
      "Activités scientifiques : 4 panelistes sur un thème au choix de l'entité",
      "01 espace pour vos deux (02) stands à l'entrée du Village des Travailleurs",
      "Intervention à l'ouverture et à la clôture",
      "Logo en position majeure sur tous les supports",
      "Présence sur le fond de scène officiel",
      "1 activité majeure porte le nom de l'entreprise",
      "Remise officielle d'un prix majeur au nom de l'entreprise",
      "Accès privilégié aux 3 campus",
      "Distribution des goodies officiels",
    ],
  },
  {
    tier:"Platine", rank:"02", price:"5 000 000", currency:"XAF", badge:"■", color:"#F57C00",
    elements:[
      "Parrainage la marche sportive",
      "Parrainage des ateliers de formation",
      "Offre de 40 lots de 50 000 FCFA aux gagnants — Total : 2 000 000",
      "1 prix spécial au Master STUD 2026",
      "200 t-shirts avec le logo de l'entreprise",
    ],
    visibility:[
      "Activités scientifiques : 02 panelistes sur un thème au choix de l'entité",
      "01 espace à louer pour votre stand dans le Village des Travailleurs",
      "Intervention à l'ouverture et à la clôture",
      "Logo sur les supports officiels",
      "1 activité culturelle porte le nom de l'entreprise",
      "Remise officielle d'un prix au nom de l'entreprise",
      "Accès privilégié aux 3 campus",
      "Distribution des Goodies",
    ],
  },
  {
    tier:"Or", rank:"03", price:"1 000 000", currency:"XAF", badge:"●", color:"#F9A825",
    elements:[
      "Parrainage de la journée d'investissement humain",
      "Branding de tous les plants prévus pour la reforestation",
      "Offre de 10 lots de 50 000 FCFA aux gagnants — Total : 500 000",
      "1 prix spécial au gagnant du quiz",
      "100 t-shirts avec le logo de l'entreprise",
    ],
    visibility:[
      "Activités scientifiques : 2 panelistes sur un thème au choix de l'entité",
      "01 espace à louer pour votre stand dans le Village des Travailleurs",
      "Intervention à l'ouverture et à la clôture",
      "Logo sur les supports officiels",
      "1 activité institutionnelle porte le nom de l'entreprise",
      "Remise officielle d'un prix au nom de l'entreprise",
      "Accès privilégié aux 3 campus",
      "Distribution des Goodies",
    ],
  },
];

export const CONTACT = {
  phones: ["+237 688 60 98 91","+237 678 11 68 01","+237 699 45 78 17","+237 697 06 75 70"],
  emails: ["daapaudo2025@gmail.com","vanessamezee29@gmail.com"],
  address: "Université de Douala, Cameroun",
};

export const NAV_LINKS = [
  { label:"Accueil",    path:"/" },
  { label:"À Propos",   path:"/a-propos" },
  { label:"Programme",  path:"/programme" },
  { label:"Galerie",    path:"/gallery" },
  { label:"Evaluation", path:"/evaluation" },
  { label:"Sponsoring", path:"/sponsoring" },
];