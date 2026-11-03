// Indices comportementaux sur l'infiltré. {NOM} est remplacé par le nom de l'adepte.
// Les vrais indices s'accumulent sur l'infiltré ; les faux (quand la paranoïa monte)
// visent des innocents. Au joueur de croiser les signalements.

export const INDICES_INFILTRE = [
  "{NOM} pose beaucoup de questions sur la comptabilité. Trop de questions. Des questions avec des sous-questions.",
  "{NOM} prend des notes pendant les sermons. Qui prend des notes pendant une extase collective ?",
  "{NOM} était encore absent au rituel de l'aube. « Migraine », paraît-il. Troisième migraine d'aube cette semaine.",
  "L'histoire de {NOM} a changé : hier ancien fleuriste, aujourd'hui ancien plombier. Les fleurs et les tuyaux, ce n'est pas pareil.",
  "{NOM} a été vu près de la route, parlant seul dans son col de veste. Le col n'a pas répondu, mais quand même.",
  "{NOM} ne connaît toujours pas les paroles de l'hymne. Il fait « la-la-la » avec une conviction suspecte.",
  "{NOM} a demandé où étaient rangés « les documents ». Quels documents ? Personne n'a jamais parlé de documents.",
  "Les chaussures de {NOM} sont trop propres pour quelqu'un qui vit dans un champ depuis des semaines.",
  "{NOM} a photographié le tableau des corvées. « Pour ne pas oublier », dit-il. Le tableau compte quatre lignes.",
  "{NOM} appelle « quelqu'un de sa famille » tous les soirs à 21h précises. Sa famille décroche à la première sonnerie.",
];

// Répliques que l'infiltré peut lâcher en dialogue direct — des « tells »
// qui remplacent parfois l'accroche normale de son archétype.
export const TELLS_INFILTRE = [
  "Alors, euh... la Flamme, là. Elle est éternelle depuis quand, précisément ? C'est pour... méditer dessus.",
  "Vous archivez les dons où, physiquement ? Simple curiosité spirituelle.",
  "J'étais fleuriste, avant. Enfin plombier. Fleuriste-plombier. C'était un cabinet mixte.",
  "Et le soir du 12, vous étiez où ? Pardon — c'est la méditation qui me fait poser des questions factuelles.",
  "Il est très bien, votre mouvement. Très... structuré. Vous notez tout quelque part, j'imagine ?",
];

// Faux indices générés par la paranoïa ambiante — mêmes phrases plausibles,
// mais visant des innocents. C'est ça, le poison.
export const FAUX_INDICES = [
  "{NOM} a regardé le portail deux fois pendant le dîner. Deux fois. On compte, maintenant.",
  "{NOM} a dit « votre secte » au lieu de « notre secte ». Un lapsus. Ou pas.",
  "{NOM} n'a pas fini sa soupe hier soir. Qui refuse la soupe ? Quelqu'un qui a mangé ailleurs.",
  "{NOM} sait étrangement bien lire une carte routière. Pourquoi cette compétence ?",
  "On a entendu {NOM} rire tout seul derrière la grange. De quoi ? De qui ?",
];
