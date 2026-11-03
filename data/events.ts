// Les événements du jour. {ADEPTE} est remplacé par un nom tiré au sort.
// Ton : comédie noire, phrases courtes, jamais gore.

import type { JeuEvenement } from "@/lib/types";

export const EVENEMENTS: JeuEvenement[] = [
  {
    id: "don-total",
    titre: "Le grand don",
    texte:
      "{ADEPTE} veut donner tous ses biens à la secte. Maison, voiture, collection de fèves des rois. Tout.",
    cibleAdepte: true,
    choix: [
      {
        label: "Accepter. L'univers pourvoit.",
        effets: { ressources: 40, ferveur: 5, reputation: -10, derive: 8 },
        reaction: "Le notaire a eu un rire nerveux. Les fèves sont exposées sur l'autel.",
      },
      {
        label: "Refuser. Trop voyant.",
        effets: { ferveur: -5, reputation: 8, derive: -3 },
        reaction: "{ADEPTE} est vexé. « Même ma générosité, on la refuse. »",
      },
    ],
  },
  {
    id: "journaliste-interview",
    titre: "L'interview",
    visiteur: "le journaliste",
    texte:
      "Un journaliste local demande une interview, « juste pour comprendre votre mouvement ». Il sourit trop.",
    choix: [
      {
        label: "Accepter, tout en transparence.",
        effets: { reputation: 12, ferveur: -4 },
        reaction: "L'article s'intitule « Chez les doux dingues du coin ». C'est presque flatteur.",
      },
      {
        label: "Refuser poliment.",
        effets: { paranoia: 5, reputation: -3 },
        reaction: "Il repart en notant quelque chose. Vous détestez quand ils notent.",
      },
      {
        label: "L'inviter à « rester quelques jours ».",
        effets: { ferveur: 4, derive: 8, reputation: -6 },
        reaction: "Il a accepté. Personne ne sait plus très bien qui observe qui.",
      },
    ],
  },
  {
    id: "dispute-second",
    titre: "Le trône vide",
    texte:
      "Deux adeptes se disputent le titre de « vrai second du Gourou ». Il y a eu des mots. Et un coup de louche.",
    choix: [
      {
        label: "Organiser une épreuve mystique.",
        effets: { ferveur: 8, paranoia: 6 },
        reaction: "L'épreuve : tenir un regard de chèvre. La chèvre a gagné. Le poste reste vacant.",
      },
      {
        label: "Abolir le titre de second.",
        effets: { paranoia: -6, ferveur: -3 },
        reaction: "« Nous sommes tous seconds », déclarez-vous. Douze personnes se sentent rétrogradées.",
      },
      {
        label: "Les nommer seconds tous les deux.",
        effets: { ferveur: 3, paranoia: 8, derive: 3 },
        reaction: "Ils se surveillent désormais en souriant. C'est pire qu'avant, mais plus calme.",
      },
    ],
  },
  {
    id: "famille-debarque",
    titre: "La famille",
    visiteur: "la famille",
    texte:
      "La famille de {ADEPTE} débarque au camp pour le récupérer. La mère a apporté un avocat et un cake.",
    cibleAdepte: true,
    choix: [
      {
        label: "Laisser {ADEPTE} choisir librement.",
        effets: { reputation: 10, ferveur: -6, derive: -5 },
        reaction: "{ADEPTE} reste, mais promet d'appeler le dimanche. L'avocat mange le cake, dépité.",
      },
      {
        label: "Cacher {ADEPTE} dans la réserve.",
        effets: { derive: 12, paranoia: 8, reputation: -8 },
        reaction: "« Il est en retraite silencieuse », dites-vous. La mère laisse le cake. Il a un goût de reproche.",
      },
      {
        label: "Organiser un goûter de médiation.",
        effets: { reputation: 6, ressources: -8, ferveur: 2 },
        reaction: "Deux heures de crêpes plus tard, la mère demande s'il reste une chambre pour elle.",
      },
    ],
  },
  {
    id: "rituel-absurde",
    titre: "L'innovation liturgique",
    texte:
      "{ADEPTE} propose un nouveau rituel : saluer le micro-ondes chaque matin, « parce qu'il donne sans compter ».",
    cibleAdepte: true,
    choix: [
      {
        label: "L'adopter officiellement.",
        effets: { ferveur: 10, reputation: -5 },
        reaction: "Le camp entier s'incline devant le micro-ondes à 7h30. Il fait « bip ». La foule frissonne.",
      },
      {
        label: "Refuser. La liturgie n'est pas un buffet.",
        effets: { ferveur: -4, paranoia: 2 },
        reaction: "{ADEPTE} salue quand même le micro-ondes, mais discrètement. Vous faites semblant de ne pas voir.",
      },
    ],
  },
  {
    id: "inspection-hygiene",
    titre: "L'inspection sanitaire",
    visiteur: "l'inspectrice",
    texte:
      "Une inspectrice de l'hygiène se présente au portail. Elle veut voir « la cuisine, et le reste ».",
    choix: [
      {
        label: "Tout montrer, sourire aux lèvres.",
        effets: { reputation: 8, ressources: -12 },
        reaction: "Deux frigos aux normes plus tard, elle repart. Elle a même goûté la soupe. Elle a dit « correct ».",
      },
      {
        label: "Cacher la moitié du camp en urgence.",
        effets: { paranoia: 10, derive: 5, reputation: -5 },
        reaction: "Elle n'a rien vu. Mais quatorze adeptes ont passé deux heures dans la grange, et ça jase.",
      },
    ],
  },
  {
    id: "voisin-chants",
    titre: "Le voisin",
    visiteur: "le voisin",
    texte:
      "Le voisin agriculteur se plaint des chants de 5h du matin. Il menace d'appeler « les autorités, et son cousin ».",
    choix: [
      {
        label: "S'excuser avec un panier de confitures.",
        effets: { reputation: 8, ressources: -5 },
        reaction: "Il repart avec six pots. « Vos cinglés font de la bonne mirabelle », concède-t-il.",
      },
      {
        label: "Le déclarer « Émissaire du Doute ».",
        effets: { ferveur: 6, paranoia: 8, reputation: -10 },
        reaction: "Le camp le hue à distance réglementaire. Son tracteur a désormais un statut théologique.",
      },
      {
        label: "Déplacer les chants à 6h30.",
        effets: { ferveur: -3, reputation: 4 },
        reaction: "Le compromis. Cette chose dont les prophètes ne parlent jamais.",
      },
    ],
  },
  {
    id: "crise-foi",
    titre: "La panne de foi",
    texte:
      "Trois adeptes doutent en même temps. Ils sont assis sur le banc, là-bas, avec des têtes d'enterrement.",
    choix: [
      {
        label: "Grand feu de la Réassurance ce soir.",
        effets: { ferveur: 12, ressources: -10 },
        reaction: "Guimauves, chants, larmes. À minuit, tout le monde y croit à nouveau. Surtout aux guimauves.",
      },
      {
        label: "Les laisser douter. Ça passera.",
        effets: { ferveur: -8, paranoia: -3 },
        reaction: "Le doute, ça s'attrape. Le banc est complet, maintenant.",
      },
      {
        label: "Leur confier une mission « cruciale ».",
        effets: { ferveur: 6, derive: 4 },
        reaction: "Ils repeignent le portail en « blanc sacré ». Le doute déteste avoir les mains occupées.",
      },
    ],
  },
  {
    id: "don-anonyme",
    titre: "L'enveloppe",
    visiteur: "le facteur",
    texte:
      "Un don anonyme énorme arrive par la poste. Pas de nom. Juste un mot : « Continuez. »",
    choix: [
      {
        label: "Accepter sans poser de questions.",
        effets: { ressources: 50, reputation: -8, derive: 5 },
        reaction: "L'argent n'a pas d'odeur. Celui-ci a quand même un léger parfum d'ennuis.",
      },
      {
        label: "Brûler l'enveloppe en public.",
        effets: { ferveur: 8, ressources: 0, derive: 3 },
        reaction: "« Nous ne devons rien à personne ! » Le geste est superbe. Le trésorier, lui, s'est assis.",
      },
      {
        label: "Le déclarer aux impôts.",
        effets: { reputation: 10, ressources: 25 },
        reaction: "L'inspecteur des impôts n'avait jamais vu ça. Il vous a dit « bon courage ». Sincèrement, semble-t-il.",
      },
    ],
  },
  {
    id: "gourou-rhume",
    titre: "Le rhume du prophète",
    texte:
      "Vous avez un rhume. Un être de lumière avec le nez qui coule, c'est théologiquement délicat.",
    choix: [
      {
        label: "Admettre humblement être enrhumé.",
        effets: { derive: -8, ferveur: -5 },
        reaction: "« Même le soleil a des nuages », improvisez-vous entre deux mouchoirs. Ça passe. De justesse.",
      },
      {
        label: "Parler de « mue vibratoire ».",
        effets: { ferveur: 8, derive: 8 },
        reaction: "Le camp est en émoi : le Gourou change de fréquence. Deux adeptes tentent d'attraper un rhume aussi.",
      },
    ],
  },
  {
    id: "tiktok",
    titre: "La tentation du réseau",
    texte:
      "{ADEPTE} veut créer un compte TikTok pour la secte. « Les autres cultes en ont tous un, c'est gênant. »",
    cibleAdepte: true,
    choix: [
      {
        label: "Autoriser. Il faut vivre avec son temps.",
        effets: { recrues: 2, reputation: -8, ferveur: 3 },
        reaction: "La vidéo « GRWM pour le rituel de l'aube » fait 40 000 vues. Dont, probablement, la gendarmerie.",
      },
      {
        label: "Interdire les écrans, tous les écrans.",
        effets: { ferveur: -4, paranoia: 4 },
        reaction: "Le sevrage est rude. On surprend des adeptes à scroller du pouce sur des ardoises.",
      },
    ],
  },
  {
    id: "prophetie-ratee",
    titre: "Le mardi de la honte",
    texte:
      "Votre prophétie de mardi ne s'est pas réalisée. Le ciel ne s'est pas « ouvert comme un yaourt ». Les adeptes attendent.",
    choix: [
      {
        label: "Reporter la date. Erreur de calcul.",
        effets: { ferveur: -5, derive: 5 },
        reaction: "« Le calendrier grégorien est notre ennemi », expliquez-vous. Nouveau rendez-vous : un mardi, plus tard.",
      },
      {
        label: "« C'était spirituellement accompli. »",
        effets: { ferveur: 5, derive: 10 },
        reaction: "Le ciel s'est ouvert à l'intérieur de nous. Quelques fronts se plissent, puis se déplissent. Ouf.",
      },
      {
        label: "Admettre l'erreur, simplement.",
        effets: { ferveur: -8, derive: -10, reputation: 5 },
        reaction: "Silence. Puis la grand-mère lance : « Au moins il est honnête. » Applaudissements timides.",
      },
    ],
  },
  {
    id: "mariage-rite",
    titre: "Le mariage",
    texte:
      "Deux adeptes veulent se marier « selon le rite ». Le rite n'existe pas. Vous avez jusqu'à ce soir pour l'inventer.",
    choix: [
      {
        label: "Grande cérémonie improvisée.",
        effets: { ferveur: 12, ressources: -15 },
        reaction: "Échange de cuillères en bois, envol de graines de tournesol. Tout le monde pleure. Vous aussi, bizarrement.",
      },
      {
        label: "Exiger qu'ils demandent votre permission d'abord.",
        effets: { derive: 10, paranoia: 5, ferveur: -3 },
        reaction: "Ils la demandent, à genoux. Quelque chose en vous trouve ça normal. C'est ça qui devrait inquiéter.",
      },
    ],
  },
  {
    id: "fuite-tresorier",
    titre: "La caisse s'est envolée",
    texte:
      "Le trésorier autoproclamé est parti dans la nuit avec la caisse commune et le gaufrier.",
    choix: [
      {
        label: "Le maudire publiquement.",
        effets: { ferveur: 6, paranoia: 10, ressources: -20 },
        reaction: "La Malédiction du Gaufrier est prononcée. L'assemblée frissonne. Quelqu'un demande s'il y aura quand même des gaufres.",
      },
      {
        label: "Étouffer l'affaire.",
        effets: { derive: 8, ressources: -20 },
        reaction: "« Il est en mission lointaine. » Les comptes sont refaits de mémoire. La mémoire est optimiste.",
      },
      {
        label: "Porter plainte, comme tout le monde.",
        effets: { reputation: 6, ressources: -10, paranoia: 3 },
        reaction: "Le gendarme note « vol de gaufrier » sans sourciller. Il en a vu d'autres. Il vous regarde longtemps quand même.",
      },
    ],
  },
  {
    id: "secte-concurrente",
    titre: "La concurrence",
    visiteur: "un émissaire du Rond-Point",
    texte:
      "Une secte concurrente s'installe au village : le Culte du Rond-Point. Ils tournent. C'est toute leur doctrine, mais ça marche.",
    choix: [
      {
        label: "Débaucher leurs membres.",
        effets: { recrues: 2, paranoia: 5, reputation: -4 },
        reaction: "Deux transfuges arrivent, un peu étourdis. Ils tournent encore un peu sur eux-mêmes le soir.",
      },
      {
        label: "Proposer un tournoi de pétanque interconfessionnel.",
        effets: { ferveur: 8, reputation: 6, ressources: -5 },
        reaction: "Défaite 13 à 7, mais le village a adoré. « Ils sont fous mais ils tirent bien », titre la gazette.",
      },
    ],
  },
  {
    id: "celebrite",
    titre: "La recrue célèbre",
    visiteur: "l'ex-candidat de télé-réalité",
    texte:
      "Un ex-candidat de télé-réalité veut rejoindre le mouvement. Il propose de « ramener sa commu ».",
    choix: [
      {
        label: "Accepter, avec sa commu.",
        effets: { recrues: 3, reputation: -10, ferveur: 4 },
        reaction: "Trois nouveaux arrivent en vlogguant leur « journey ». La gendarmerie suit désormais votre hashtag.",
      },
      {
        label: "Refuser. Le culte n'est pas un placement de produit.",
        effets: { reputation: 5, ferveur: -2 },
        reaction: "Il repart en story : « Déçu mais grandi. » Vous êtes cité. Avec trois fautes.",
      },
    ],
  },
  {
    id: "courgette",
    titre: "La courgette",
    texte:
      "Une courgette de quatre kilos a poussé dans le potager. Le camp y voit un signe. Le camp veut un miracle.",
    choix: [
      {
        label: "Miracle officiel. Procession incluse.",
        effets: { ferveur: 10, derive: 5, reputation: -3 },
        reaction: "La Courgette Première est portée en triomphe. Elle trône près de l'autel. Elle impose le respect.",
      },
      {
        label: "« C'est du fumier, pas un miracle. »",
        effets: { ferveur: -4, derive: -4, reputation: 2 },
        reaction: "La déception est réelle. La ratatouille du soir aussi. Elle était, il faut le dire, miraculeuse.",
      },
    ],
  },
  {
    id: "lettre-anonyme",
    titre: "La lettre",
    texte:
      "Une lettre anonyme est clouée au portail : « Je sais ce que vous faites. » Rien d'autre. Pas de signature.",
    minJour: 4,
    choix: [
      {
        label: "Réunion de crise immédiate.",
        effets: { paranoia: 15, ferveur: 3 },
        reaction: "Deux heures d'hypothèses. Le principal suspect reste le voisin, ou le facteur, ou un adepte, ou tout le monde.",
      },
      {
        label: "L'ignorer avec panache.",
        effets: { derive: 3, paranoia: 3 },
        reaction: "Vous l'avez jetée au feu. Vous y pensez encore. Le feu aussi, probablement.",
      },
      {
        label: "L'encadrer et l'exposer.",
        effets: { ferveur: 6, reputation: -2 },
        reaction: "« Même nos ennemis reconnaissent que nous faisons quelque chose. » L'assemblée applaudit. La logique tousse.",
      },
    ],
  },
];
