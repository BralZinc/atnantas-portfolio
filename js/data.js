/* =========================================================
   CONTENU DU SITE — c'est le seul fichier à modifier
   pour changer tes infos, tes albums et tes photos.
   ========================================================= */

const SITE = {
  nom: "Atnan Tas",
  metier: "Photographe football",
  ville: "Strasbourg",
  accroche: "Je photographie ceux qui font le match.",
  intro:
    "Matchs, séances joueurs, contenus matchday. Des images prêtes pour tes réseaux, ton agent et ta communication.",

  email: "atnan.tas.pro@gmail.com",   // reçoit les messages du formulaire de contact
  formulaire: "",           // facultatif : alias FormSubmit (voir GUIDE.md) pour cacher ton email
  web3formsCle: "",         // si rempli, le formulaire passe par Web3Forms (voir GUIDE.md)
  telephone: "",            // ex : "+33 6 12 34 56 78" (laisser vide pour masquer)
  whatsapp: "",             // ex : "33612345678" (sans + ni espaces)
  instagram: "https://www.instagram.com/atnan.xmp/",
  tiktok: "https://www.tiktok.com/@atnandesign",
  linkedin: "https://www.linkedin.com/in/atnan-tas-pro/",

  apropos: [
    "Basé à Strasbourg, je photographie le football lors de matchs officiels et d'événements sous accréditation, de la Ligue 1 aux équipes de jeunes.",
    "Chargé de communication et community manager à côté, je sais ce qui marche sur les réseaux : je te livre vite des photos qui te mettent en valeur, prêtes à publier ou à envoyer à ton agent.",
  ],

  // photo de la section « À propos »
  photoApropos: "photos/site/apropos.jpg",
  // photo à côté du bloc « Un match à couvrir ? »
  photoContact: "photos/site/contact.jpg",

  // bandeau défilant sous le carrousel : uniquement les logos (un élément sans logo n'apparaît pas)
  // long: true = logo horizontal · blanc: true = logo foncé affiché en blanc · fondNoir: true = efface un fond noir
  equipes: [
    { nom: "FCSM", logo: "photos/logos/clubs/fcsm.png" },
    { nom: "RCSA", logo: "photos/logos/clubs/rcsa.png" },
    { nom: "OL", logo: "photos/logos/clubs/ol.png" },
    { nom: "DFCO", logo: "photos/logos/clubs/dfco.png" },
    { nom: "FC Nantes", logo: "photos/logos/clubs/nantes.png" },
    { nom: "Toulouse FC", logo: "photos/logos/clubs/tfc.png" },
    { nom: "FC Rouen", logo: "photos/logos/clubs/rouen.png" },
    { nom: "Valence FC", logo: "" },
    { nom: "Paris 13 Atletico", logo: "photos/logos/clubs/paris13.png" },
  ],
  competitions: [
    { nom: "Ligue 1", logo: "photos/logos/clubs/ligue1-long-blanc.png", long: true },
    { nom: "Ligue 2", logo: "photos/logos/clubs/ligue2-long.png", long: true },
    { nom: "National (Ligue 3)", logo: "photos/logos/clubs/ligue3-long.png", long: true },
    { nom: "U19", logo: "" },
  ],

  // mots qui défilent dans le bandeau jaune
  bandeau: ["Matchs", "Séances joueurs", "Agents", "Clubs", "Matchday", "Livraison sous 48h"],

  chiffres: [
    { valeur: "20+", label: "matchs couverts" },
    { valeur: "48h", label: "délai de livraison" },
    { valeur: "100%", label: "images retouchées" },
  ],
};

/* =========================================================
   PAGE « À PROPOS » (apropos.html)
   Une section vide ([]) est masquée automatiquement.
   Les lignes marquées « À compléter » apparaissent avec une étiquette
   orange : remplace-les par tes vraies infos avant la mise en ligne.
   ========================================================= */
const APROPOS = {
  sousTitre: "Photographe football · Strasbourg & Grand Est",
  bio: [
    "Passionné de football depuis toujours, je réalise des reportages photo lors de matchs officiels et d'événements sous accréditation : Ligue 1, Ligue 2, National, jeunes. Basé à Strasbourg, je me déplace partout dans le Grand Est et au-delà.",
    "Équipé d'un Sony A7 III et de deux objectifs Tamron, je maîtrise toute la chaîne : la prise de vue au bord du terrain, le tri, la retouche et la livraison. Mon but, transformer un match en images qui ont de l'impact.",
    "En parallèle, je suis chargé de communication et community manager, en Master Direction Artistique chez YNOV. Je sais donc ce qui fonctionne sur les réseaux : des photos pensées pour être publiées, et des visuels prêts à poster pour les joueurs, les agents et les clubs.",
  ],
  cv: "docs/cv-atnan-tas.pdf",   // laisser "" pour masquer le bouton « Télécharger mon CV »

  // clubs et équipes déjà photographiés (affichés en bandeau)
  clubs: ["RC Strasbourg Alsace", "Toulouse FC", "FC Sochaux-Montbéliard", "Dijon FCO", "FC Nantes", "Olympique Lyonnais U19", "Valence", "Paris 13 Atletico", "FC Rouen"],

  // logo : chemin d'une image (ex : "photos/logos/wurth.png"). Si vide, un badge avec les initiales s'affiche.
  parcours: [
    { periode: "En parallèle", titre: "Photographe football — sous accréditation", lieu: "Ligue 1 · Ligue 2 · National · Jeunes", icone: "appareil", points: [
      "Reportages lors de matchs officiels et d'événements accrédités",
      "Toulouse FC - RC Strasbourg, la montée du FCSM en Ligue 2, RC Strasbourg - OL (U19)…",
      "De la captation à l'editing : tri, retouche, livraison rapide",
    ] },
    { periode: "Sept. 2025 – auj.", titre: "Chargé de communication interne & relations presse", lieu: "Würth · Erstein · Alternance", logo: "photos/logos/wurth-carre.jpg", points: [
      "Communication interne : rédaction web et print, intranet, emailing, animation de communauté",
      "Relations presse : communiqués, diffusion aux magazines, mise à jour du site",
      "Organisation et communication d'événements",
    ] },
    { periode: "Févr. – Juil. 2025", titre: "Chargé de communication & community manager", lieu: "B-HIVE Engineering · Mulhouse", logo: "photos/logos/b-hive.jpeg", points: [
      "Captation photo et vidéo, montage, motion design",
      "Visuels : affiches, banderoles, flyers, posts réseaux sociaux",
      "Gestion des réseaux sociaux, newsletters, événements",
    ] },
    { periode: "Sept. 2024 – Janv. 2025", titre: "Chargé de communication & community manager", lieu: "Teradelis · Montbéliard", logo: "photos/logos/teradelis.png", logoPlein: true, points: [
      "Contenus visuels et posts pour les réseaux sociaux",
      "Plannings et stratégies de communication pour une trentaine de clients",
    ] },
    { periode: "Avr. – Juil. 2024", titre: "Chargé de communication", lieu: "Conservatoire Henri Dutilleux · Belfort", logo: "photos/logos/chd.png", points: [
      "Tournage et réalisation d'interviews et de vidéos pour YouTube",
      "Affiches, supports print et animation du logo",
    ] },
  ],

  formation: [
    { periode: "2025 – 2027", titre: "Master Direction Artistique", logo: "photos/logos/ynov.png", lieu: "YNOV · Bac+5 · Communication, marketing & branding · Alternance" },
    { periode: "2023 – 2025", titre: "BUT MMI — Métiers du Multimédia et de l'Internet", logo: "photos/logos/iut-nfc.png", lieu: "IUT Nord Franche-Comté · Bac+3 · Design graphique, UX/UI, communication 360°" },
  ],

  competences: ["Photo de match bord terrain", "Portrait et séance joueur", "Photo d'ambiance et de supporters", "Retouche et étalonnage", "Visuels réseaux sociaux", "Montage vidéo", "Motion design", "Community management", "Direction artistique"],

  outils: ["Sony A7 III", "2 objectifs Tamron", "Photoshop", "Premiere Pro", "After Effects", "Illustrator", "InDesign", "Blender"],
};

const SERVICES = [
  {
    titre: "Couverture de match",
    texte: "Présence bord terrain, actions, célébrations, avant et après match. Une sélection retouchée livrée sous 48h.",
  },
  {
    titre: "Séance joueur",
    texte: "Portraits et photos en situation pour ton profil, tes réseaux ou ton dossier agent. En club, au stade ou en extérieur.",
  },
  {
    titre: "Suivi saison",
    texte: "Je te suis sur plusieurs matchs pour construire une banque d'images complète sur ta saison.",
  },
  {
    titre: "Visuels matchday",
    texte: "Annonces de match, scores, signatures : des visuels prêts à publier pour les clubs et les agences.",
  },
];

/*  ALBUMS
    Tu n'as plus rien à écrire ici : mets tes photos dans le dossier
    « a-importer » puis double-clique sur « Mettre a jour le site.command ».
    Les albums ci-dessous ne sont que des exemples, affichés tant
    qu'aucune vraie photo n'a été importée.
*/
const ALBUMS_DEMO = [
  { titre: "FC Exemple – AS Voisin", competition: "National 2", date: "2026-10-12", score: "2 – 1", categorie: "Match", une: true, demo: 14 },
  { titre: "Séance — Joueur n°10", competition: "Séance joueur", date: "2026-10-04", categorie: "Joueur", une: true, demo: 10 },
  { titre: "Derby régional", competition: "Coupe de France", date: "2026-09-21", score: "1 – 1 (4-3 tab)", categorie: "Match", une: true, demo: 16 },
  { titre: "Séance — Gardien U19", competition: "Séance joueur", date: "2026-09-14", categorie: "Joueur", demo: 8 },
  { titre: "Tournoi jeunes", competition: "Tournoi U17", date: "2026-08-30", categorie: "Match", demo: 12 },
  { titre: "Match de préparation", competition: "Match amical", date: "2026-08-02", score: "3 – 0", categorie: "Match", demo: 10 },
];
