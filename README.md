# Academia Hub

Application de gestion scolaire multi-tenant développée par YEHI OR Tech.

## À propos

Academia Hub est une plateforme SaaS (Software as a Service) permettant aux écoles de gérer l'ensemble de leurs opérations administratives et pédagogiques. Chaque école dispose de son propre espace isolé (tenant) avec ses utilisateurs, données et configurations.

## Architecture Multi-Tenant

Le système utilise une architecture multi-tenant avec les modèles de données suivants :

- **Schools (Tenants)** : Représente une école avec son sous-domaine, statut, abonnement et paramètres.
- **Users** : Utilisateurs du système avec différents rôles (promoteur, administrateur, enseignant, étudiant, parent, personnel).
- **Subscriptions** : Gestion des abonnements des écoles aux différents plans.
- **Plans** : Définition des plans d'abonnement avec leurs fonctionnalités et tarifs.

Pour plus de détails sur l'implémentation, consultez [la documentation de la Phase 1](./docs/PHASE_1_IMPLEMENTATION.md).

## Installation

```bash
# Installer les dépendances
npm install

# Installer les dépendances de développement pour les tests
npm install --save-dev jest ts-jest @types/jest @testing-library/react @testing-library/jest-dom identity-obj-proxy
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
VITE_API_URL=http://localhost:3000/api
```

## Exécution des tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests avec couverture
npm test -- --coverage
```

## Développement

```bash
# Démarrer le serveur de développement
npm run dev
```

## Documentation

Pour plus d'informations sur l'implémentation des modèles multi-tenant, consultez le dossier `docs/`.
