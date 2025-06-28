# Documentation des Migrations de Base de Données - Academia Hub

## Introduction

Ce document décrit les migrations de base de données pour la Phase 2 du projet Academia Hub, qui ajoute le support pour la gestion des écoles (tenants), des utilisateurs avec rôles, et des abonnements.

## Structure des Migrations

Les migrations sont organisées dans le dossier `src/database/migrations` et suivent un ordre numérique pour assurer leur exécution séquentielle. Chaque fichier de migration contient deux parties :
- **Up Migration** : Instructions SQL pour appliquer les changements
- **Down Migration** : Instructions SQL pour annuler les changements (rollback)

## Migrations Disponibles

### 1. Création de la Table Schools (`001_create_schools_table.sql`)

Cette migration crée la table `schools` qui représente les tenants (écoles) dans l'application :

```sql
CREATE TABLE IF NOT EXISTS schools (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    status ENUM('pending_payment', 'pending_kyc', 'active', 'suspended', 'expired') DEFAULT 'pending_payment',
    subscription_plan_id BIGINT,
    payment_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    kyc_status ENUM('pending', 'under_review', 'verified', 'rejected') DEFAULT 'pending',
    fedapay_transaction_id VARCHAR(255),
    promoter_user_id BIGINT,
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Modification de la Table Users (`002_modify_users_table.sql`)

Cette migration modifie la table `users` existante (ou la crée si elle n'existe pas) pour ajouter les champs nécessaires à la gestion multi-tenant et aux rôles utilisateurs :

```sql
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS tenant_id BIGINT COMMENT 'Reference to the school this user belongs to',
    ADD COLUMN IF NOT EXISTS role ENUM('promoter', 'admin', 'teacher', 'student', 'parent', 'staff') DEFAULT 'student',
    ADD COLUMN IF NOT EXISTS status ENUM('pending', 'active', 'suspended', 'deleted') DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS kyc_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP;
```

### 3. Création des Tables d'Abonnement (`003_create_subscription_tables.sql`)

Cette migration crée trois tables pour gérer les abonnements :

1. `subscription_plans` : Définit les différents plans d'abonnement disponibles
2. `subscriptions` : Enregistre les abonnements actifs pour chaque école
3. `payment_history` : Conserve l'historique des paiements

## Utilisation des Scripts de Migration

### Installation des Dépendances

Avant d'utiliser les scripts de migration, assurez-vous d'installer les dépendances nécessaires :

```bash
npm install mysql2 dotenv
```

### Configuration de l'Environnement

Créez ou modifiez le fichier `.env` à la racine du projet avec les informations de connexion à la base de données :

```
DB_HOST=localhost
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=academia_hub
DB_PORT=3306
```

### Exécution des Migrations

Pour appliquer toutes les migrations :

```bash
node src/database/migrate.js
```

### Rollback des Migrations

Pour annuler la dernière migration :

```bash
node src/database/rollback.js
```

Pour annuler plusieurs migrations (par exemple, les 3 dernières) :

```bash
node src/database/rollback.js 3
```

## Plan de Rollback

En cas de problème après le déploiement des migrations en production, suivez ces étapes :

1. Exécutez le script de rollback pour annuler les migrations problématiques :
   ```bash
   node src/database/rollback.js [nombre_de_migrations]
   ```

2. Si le script de rollback échoue, vous pouvez exécuter manuellement les commandes SQL de rollback présentes dans chaque fichier de migration (section "Down Migration").

3. En dernier recours, restaurez une sauvegarde de la base de données prise avant l'application des migrations.

## Compatibilité avec les Données Existantes

Ces migrations ont été conçues pour maintenir la compatibilité avec les données existantes :

- Les tables existantes ne sont pas supprimées
- Les nouvelles colonnes ont des valeurs par défaut appropriées
- Les contraintes de clé étrangère sont ajoutées avec `ON DELETE CASCADE` pour maintenir l'intégrité référentielle

## Tests

Des tests unitaires pour les modèles de données mis à jour sont disponibles dans le dossier `src/__tests__/types/`. Exécutez-les avec la commande :

```bash
npm test
```

## Bonnes Pratiques

- Prenez toujours une sauvegarde de la base de données avant d'appliquer des migrations en production
- Testez les migrations dans un environnement de développement ou de staging avant la production
- Ne modifiez jamais une migration déjà appliquée en production ; créez plutôt une nouvelle migration corrective
