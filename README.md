# Pokédex Game

Un jeu de combat Pokémon interactif avec système de progression, boutique et gestion de collection.

## Description du Projet

Ce projet est une application web interactive qui permet aux utilisateurs de :
- Collectionner des Pokémon
- Combattre contre des Pokémon sauvages
- Gérer leur inventaire de potions et objets
- Acheter des boosters pour débloquer de nouveaux Pokémon
- Suivre leur progression avec des statistiques détaillées

### Fonctionnalités Principales

- **Système de Combat**
  - 3 niveaux de difficulté (Facile, Intermédiaire, Difficile)
  - Progression automatique basée sur le nombre de victoires
  - Système de types avec avantages/désavantages
  - Gestion des HP et des potions

- **Collection de Pokémon**
  - Débloquage progressif des Pokémon
  - Affichage des statistiques détaillées
  - Gestion des types et des évolutions
  - Mode Shiny disponible

- **Boutique**
  - Achat de potions
  - Achat de boosters
  - Gestion de l'inventaire
  - Système de monnaie in-game

- **Interface Utilisateur**
  - Design moderne et responsive
  - Animations fluides
  - Navigation intuitive
  - Mode sombre

## Instructions d'Installation

### Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- MongoDB

### Installation

1. Cloner le repository
```bash
git clone https://github.com/votre-username/pokedex-game.git
cd pokedex-game
```

2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

3. Configurer les variables d'environnement
```bash
cp .env.example .env
```
Modifier le fichier `.env` avec vos configurations :
```
MONGODB_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
PORT=3000
```

4. Lancer l'application
```bash
# Développement
npm run dev
# ou
yarn dev

# Production
npm run build
npm start
# ou
yarn build
yarn start
```

## Documentation de l'API

### Authentification

#### POST /api/auth/register
- Crée un nouveau compte utilisateur
- Body: `{ username, email, password }`
- Retourne: Token JWT et données utilisateur

#### POST /api/auth/login
- Authentifie un utilisateur
- Body: `{ email, password }`
- Retourne: Token JWT et données utilisateur

### Pokémon

#### GET /api/pokemon
- Récupère la liste des Pokémon
- Query params: `page`, `limit`, `type`, `search`
- Retourne: Liste paginée des Pokémon

#### GET /api/pokemon/:id
- Récupère les détails d'un Pokémon
- Retourne: Détails complets du Pokémon

### Combat

#### POST /api/game/battle/start
- Démarre un nouveau combat
- Body: `{ difficulty, pokemonId }`
- Retourne: Détails du combat

#### POST /api/game/battle/action
- Effectue une action de combat
- Body: `{ action, target }`
- Retourne: Résultat de l'action

#### POST /api/game/battle/end
- Termine un combat
- Body: `{ result, xpEarned, goldEarned }`
- Retourne: Statistiques mises à jour

### Boutique

#### GET /api/shop/items
- Récupère la liste des objets disponibles
- Retourne: Liste des objets et prix

#### POST /api/shop/buy
- Achète un objet
- Body: `{ itemId, quantity }`
- Retourne: Inventaire mis à jour

### Statistiques

#### GET /api/game/stats
- Récupère les statistiques du joueur
- Retourne: Statistiques détaillées

## Structure du Projet

```
src/
├── components/
│   ├── pages/
│   │   ├── Battle.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── PokemonDetail.jsx
│   │   ├── Register.jsx
│   │   ├── Shop.jsx
│   │   └── Tutorial.jsx
│   └── common/
│       ├── Navbar.jsx
│       └── ProtectedRoute.jsx
├── assets/
│   ├── pokemons/
│   ├── types/
│   └── img autre/
├── styles/
│   └── components/
└── utils/
    ├── api.js
    └── auth.js
```

## Technologies Utilisées

- Frontend:
  - React
  - React Router
  - Axios
  - CSS Modules

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT

## Commentaires personnels
Plutôt fier de ce projet dans l'ensemble, manque de temps vers la fin donc je n'ai pas vraiment pu pofiner les détails comme les css par exemple.
## Licence

Ce projet est sous licence de Léopold THIERRY donc faut pas toucher sinon pas content. Je ferais surement des amélioration dans le futur surtout au niveau du css...

Lien de la vidéo de présentation :
https://youtu.be/RFzNk6YvNrM 
Désolé la vidéo est vraiment longue, j'ai éssayé de faire au plus court comme tu avais demandé mais j'ai voulu parler de tout. Bonne corection à toi, n'hésite pas a me faire un retour sur discord je suis curieux de savoir ce que tu penses.
P.S. je viens de voir que sur la vidéo on ne voit pas les menus déroulant nottamment pour les types ou la langue pour le filtrage, si besoin je peux refaire cet exemple.
