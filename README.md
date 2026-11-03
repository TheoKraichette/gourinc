# Gourou Inc.

Jeu de gestion de secte en comédie noire. Vous êtes le gourou. Faites grandir
le mouvement sans qu'il s'effondre — et sans finir par croire vos propres
mensonges.

## Lancer le jeu

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Le camp EST l'interface

Pas de panneaux de stats ni de menus latéraux : tout se lit et tout se joue
dans la scène, en plein écran.

**Les stats sont dans le décor :**

- Le **feu de camp** grossit avec la Ferveur (braise mourante = les gens partent).
- Des **yeux s'ouvrent dans les buissons** quand la Paranoïa monte.
- La **voiture de gendarmerie** garée sur la route se rapproche du portail à
  mesure que la Réputation chute. Gyrophare allumé = le raid n'est plus loin.
- Les **caisses de la réserve** matérialisent les Ressources.
- La **Dérive** (cachée) teinte tout du sépia vers le rouge/violet, allonge
  l'ombre du gourou, et glisse des pensées dans le carnet de nuit.
- Les chiffres exacts existent quand même : bouton « 📖 Carnet » (en bas à
  gauche), qui abrite aussi la dissolution volontaire (fin Rédemption).

**Les verbes sont des gestes** (2 par jour) :

- **Cliquer** un fidèle → lui parler (bulle de dialogue ancrée sur lui).
- **Le glisser sur l'autel** → le promouvoir Disciple de confiance.
- **Le glisser au confessionnal** → l'interroger sous pression (l'infiltré
  s'y trahit plus souvent), avec possibilité de l'accuser formellement.
- **Le glisser au potager** → corvée (ressources).
- **Le glisser au portail** → l'exclure.
- **Le glisser à l'arrêt de bus « PERPIGNAN »** → le faire disparaître.
  Le bus de nuit ne repasse pas.

**Le sermon se compose** : chaque matin, 5 Mots Sacrés sont tirés (Famille,
Peur, Argent, Fin du Monde, Soupe...). On en combine deux — certaines paires
révèlent un combo caché avec un prêche dédié et des bonus.

**Les événements arrivent à pied** : le journaliste, l'inspectrice ou le
facteur franchissent le portail et traversent le camp avant de parler.

## Les prophéties : le crédit spirituel

Cliquez **la caisse du prophète** (près du feu) pour annoncer une prophétie :
« Le ciel s'ouvrira comme un yaourt », échéance dans 3, 5 ou 8 jours. Boost de
ferveur immédiat — proportionnel à l'audace. Au jour J (compte à rebours en
haut de l'écran) :

- Si le hasard a fourni un **signe plausible**, attribuez-vous le miracle.
- Sinon : **doubler la mise** (reporter de 4 jours, la Dérive monte, le camp
  compte les reports), **admettre l'erreur** (la ferveur morfle, votre tête
  reste à vous), ou — si la Dérive a assez avancé — **« C'est accompli, je le
  VOIS »**.

## Les miracles : la Dérive comme pouvoir

Le Micro-Ondes Sacré (l'autel, cliquable) débloque des **miracles** par
paliers de Dérive — définitivement acquis, un par jour : la Quête Miraculeuse
(ressources), le Signe (ferveur), le Dédoublement (+2 gestes), le Grand Oubli
(efface paranoïa et soupçons). Chaque usage enfonce le gourou un peu plus.
L'autel rougeoie quand quelque chose est disponible : c'est aussi comme ça
qu'on découvre que sa propre Dérive monte.

## L'interface qui ment (Dérive ≥ 70)

Passé un seuil, le jeu devient narrateur non fiable : le carnet de comptes
affiche des chiffres **faussés** (le décor, lui, dit toujours vrai — comparez
le feu au chiffre), de fausses entrées apparaissent dans la chronique
(« Personne n'est jamais parti. »), des yeux s'ouvrent dans les buissons sans
paranoïa réelle, et à Dérive ≥ 85 un mot qui n'existe pas — **LA VÉRITÉ** —
s'invite dans le tirage du sermon.

## La journée

1. **Sermon** — les fidèles font cercle autour du feu, vous composez le prêche.
2. **Gestion** — 2 gestes, puis « 🔔 Sonner le soir ».
3. **Événement** — un dilemme, des conséquences.
4. **Nuit** — le carnet du gourou : départs, recrues, rumeurs (⚿) et pensées.

## Systèmes

- **Infiltrés** : dès le jour 5-7, un flic ou un journaliste se glisse parmi
  les recrues. La paranoïa fabrique de faux indices ; une fausse accusation
  coûte très cher ; non démasqué sous 8 jours → raid ou article.
- **5 fins** : Effondrement, Raid, Culte Éternel (60 jours, Ferveur > 50),
  Rédemption (dissolution volontaire, Dérive basse), La Légende (Dérive 100).
- **Sauvegarde** : automatique chaque nuit, un slot, localStorage.

## Architecture

```
app/                    Shell Next.js (App Router)
components/
  Game.tsx              Racine : écrans + palette pilotée par la Dérive
  screens/              Titre, fin de partie
  game/
    GameScreen.tsx      Plein écran : bandeau, carnet, cloche, bulle d'événement
    CampView.tsx        La scène Konva : décor-stats, drag & drop, bulles ancrées
    SermonComposer.tsx  Mini-jeu des Mots Sacrés
    CarnetNuit.tsx      Rapport nocturne
lib/
  store/gameStore.ts    Store Zustand : tout l'état + toutes les actions
  engine/               Logique pure : résolution de nuit, fins, adeptes
  palette.ts            Interpolation sépia → corrompu selon la Dérive
  save.ts               Sauvegarde localStorage
data/                   Contenu éditable : mots sacrés + combos, archétypes,
                        événements, indices, pensées, fins, noms
```

Stack : Next.js 14, TypeScript, Zustand, react-konva, Tailwind CSS.
Tout le contenu (textes, événements, équilibrage) vit dans `data/` — c'est
fait pour être édité sans toucher au moteur.
