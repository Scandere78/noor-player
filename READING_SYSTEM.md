# Système de Suivi de Lecture du Coran - Noor Player

## 📖 Vue d'ensemble

Le système de suivi de lecture permet aux utilisateurs de **enregistrer leur progression** dans la lecture du Coran et de **visualiser leurs statistiques** dans le dashboard.

## 🚀 Fonctionnalités

### 1. Suivi automatique de la lecture
- **Enregistrement des versets lus** : Chaque verset lu est automatiquement enregistré
- **Temps de lecture** : Le temps passé à lire est calculé et sauvegardé
- **Position actuelle** : Le système garde en mémoire où l'utilisateur s'est arrêté

### 2. Objectifs quotidiens
- **Objectif personnalisable** : L'utilisateur peut définir combien de versets lire par jour (1-100)
- **Progression en temps réel** : Barre de progression qui se met à jour automatiquement
- **Notifications de réussite** : Animation de célébration quand l'objectif est atteint

### 3. Statistiques détaillées
- **Versets lus aujourd'hui** : Nombre de versets lus dans la journée
- **Versets de la semaine** : Progression hebdomadaire
- **Total des versets** : Nombre total de versets lus depuis l'inscription
- **Série de lecture** : Nombre de jours consécutifs de lecture
- **Position actuelle** : Sourate et verset où l'utilisateur s'est arrêté

### 4. Dashboard intégré
- **Onglets séparés** : Quiz et Lecture ont leurs propres sections
- **Graphiques de progression** : Visualisation des performances
- **Historique récent** : Liste des derniers versets lus

## 🛠️ Architecture technique

### Base de données (Prisma/MongoDB)

#### Modèle `ReadingProgress`
```prisma
model ReadingProgress {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  surahNumber Int      // Numéro de la sourate (1-114)
  verseNumber Int      // Numéro du verset dans la sourate
  surahName   String   // Nom de la sourate
  readAt      DateTime @default(now())
  readingTime Int?     // Temps passé en secondes
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([userId, surahNumber, verseNumber])
  @@map("reading_progress")
}
```

#### Modèle `UserStats` (étendu)
```prisma
model UserStats {
  // ... autres champs existants ...
  
  // Statistiques de lecture
  totalVersesRead Int    @default(0)
  currentSurah    Int?   // Numéro de la sourate actuelle
  currentVerse    Int?   // Numéro du verset actuel
  readingStreak   Int    @default(0) // Jours consécutifs de lecture
  lastReadDate    DateTime?
  dailyGoal       Int    @default(10) // Objectif de versets par jour
}
```

### API Routes

#### `/api/reading/progress`
- **POST** : Enregistrer un verset lu
- **GET** : Récupérer le progrès de lecture

#### `/api/reading/goal`
- **PUT** : Mettre à jour l'objectif quotidien

### Composants React

#### `ReadingTracker`
Bouton flottant qui apparaît sur les pages de lecture :
- **Bouton Play/Pause** : Démarre/arrête le suivi
- **Panel de contrôle** : Affiche le progrès et permet de marquer les versets
- **Notifications** : Célébrations quand l'objectif est atteint

#### `ReadingStats`
Section du dashboard qui affiche :
- **Cartes de statistiques** : Aujourd'hui, semaine, total, série
- **Objectif quotidien** : Barre de progression avec bouton pour modifier
- **Position actuelle** : Où l'utilisateur s'est arrêté
- **Activité récente** : Liste des derniers versets lus

#### Hook `useReadingTracker`
Logique réutilisable pour :
- **Démarrer/arrêter** le suivi
- **Calculer le temps** de lecture
- **Enregistrer les versets** automatiquement

## 📱 Interface utilisateur

### Dashboard
1. **Onglets** : Séparation claire entre Quiz et Lecture
2. **Responsive** : Adaptation mobile et desktop
3. **Animations** : Transitions fluides avec Framer Motion
4. **Thème cohérent** : Design dark avec accents verts

### Pages de lecture
1. **Bouton flottant** : Toujours accessible en bas à droite
2. **Panel extensible** : S'ouvre pour montrer plus d'options
3. **Feedback visuel** : Indications claires de progression

## 🎯 Motivation des utilisateurs

### Gamification
- **Objectifs quotidiens** : Encouragent une lecture régulière
- **Séries de lecture** : Incitent à lire chaque jour
- **Célébrations** : Récompenses visuelles pour les accomplissements
- **Statistiques détaillées** : Permettent de voir les progrès

### Personnalisation
- **Objectifs ajustables** : Chaque utilisateur peut définir son rythme
- **Suivi flexible** : Possibilité de lire n'importe quelle sourate
- **Historique personnel** : Chaque parcours est unique

## 🔄 Flux d'utilisation

1. **L'utilisateur visite une page de lecture**
2. **Clique sur le bouton de suivi** (Play)
3. **Lit des versets** et les marque comme lus
4. **Le système enregistre automatiquement** le progrès
5. **L'utilisateur voit sa progression** en temps réel
6. **Les statistiques se mettent à jour** dans le dashboard
7. **Célébration** si l'objectif quotidien est atteint

## 🚀 Prochaines étapes possibles

1. **Notifications push** : Rappels pour lire quotidiennement
2. **Partage social** : Partager ses accomplissements
3. **Défis communautaires** : Compétitions entre utilisateurs
4. **Audio synchronisé** : Suivre la récitation audio
5. **Notes personnelles** : Ajouter des notes sur les versets
6. **Traductions** : Support multilingue des versets
7. **Mode hors ligne** : Lecture sans connexion internet

Ce système transforme la lecture du Coran en une expérience engageante et personnalisée, encourageant une pratique régulière tout en respectant le caractère sacré du texte.
