# La Maison de l'Attiéké 🍽️

Site web full-stack de restauration ivoirienne.

## Démarrage rapide

```bash
# 1. Aller dans le dossier
cd maison-attieke

# 2. Installer les dépendances
npm install

# 3. Créer la base de données et les données de démo
set DATABASE_URL=file:./dev.db
npx prisma db push
npx tsx prisma/seed.ts

# 4. Lancer le serveur
npm run dev
```

Ouvrir → http://localhost:3000

## Compte démo
- Email : `demo@maison-attieke.ci`
- Mot de passe : `Demo1234!`

## Fonctionnalités
- Page d'accueil avec animations Framer Motion
- Menu complet avec filtres par catégorie + recherche
- Fiche produit avec négociation de prix
- Composition libre de commande (texte)
- Système budget intelligent
- Panier avec négociation globale
- Inscription / Connexion (NextAuth + bcrypt)
- Suivi de livraison en temps réel (simulé)
- Espace compte client avec fidélité
- Pages Boissons et Sucreries
- API REST complète
- Design responsive mobile-first
