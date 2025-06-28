# Documentation de déploiement - Intégration FedaPay et KYC

## Table des matières
1. [Prérequis](#prérequis)
2. [Configuration de l'environnement](#configuration-de-lenvironnement)
3. [Procédure de déploiement](#procédure-de-déploiement)
4. [Tests post-déploiement](#tests-post-déploiement)
5. [Plan de rollback](#plan-de-rollback)
6. [Monitoring et alertes](#monitoring-et-alertes)
7. [Maintenance](#maintenance)

## Prérequis

### Accès et comptes
- Accès SSH au serveur de production
- Accès au tableau de bord FedaPay (compte production)
- Accès à la base de données MongoDB de production
- Accès au système de CI/CD (GitHub Actions, Jenkins, etc.)
- Certificats SSL valides pour le domaine principal et les sous-domaines

### Environnement technique
- Node.js v16.x ou supérieur
- MongoDB v5.x ou supérieur
- Serveur Nginx configuré comme proxy inverse
- Système de stockage pour les documents KYC (S3, Google Cloud Storage, etc.)
- PM2 ou équivalent pour la gestion des processus Node.js

## Configuration de l'environnement

### Variables d'environnement
Créer un fichier `.env.production` avec les variables suivantes :

```
# Configuration générale
NODE_ENV=production
PORT=3000
API_URL=https://api.academiahub.com
FRONTEND_URL=https://academiahub.com

# MongoDB
MONGODB_URI=mongodb://username:password@hostname:port/academiahub_prod
MONGODB_URI_TEST=mongodb://username:password@hostname:port/academiahub_test

# JWT
JWT_SECRET=votre_secret_jwt_securise
JWT_EXPIRATION=24h

# FedaPay
FEDAPAY_PUBLIC_KEY=pk_live_votre_cle_publique
FEDAPAY_SECRET_KEY=sk_live_votre_cle_secrete
FEDAPAY_ENVIRONMENT=live
FEDAPAY_WEBHOOK_SECRET=wh_live_votre_secret_webhook
FEDAPAY_CALLBACK_URL=https://api.academiahub.com/api/payment/callback

# Stockage documents KYC
STORAGE_TYPE=s3 # ou gcs, local
S3_ACCESS_KEY=votre_cle_acces_s3
S3_SECRET_KEY=votre_cle_secrete_s3
S3_BUCKET=academiahub-kyc-documents
S3_REGION=eu-west-1

# Email
EMAIL_SERVICE=sendgrid # ou mailgun, ses, etc.
EMAIL_API_KEY=votre_cle_api_email
EMAIL_FROM=noreply@academiahub.com
EMAIL_ADMIN=admin@academiahub.com
```

### Configuration de FedaPay

1. Dans le tableau de bord FedaPay :
   - Configurer l'URL de callback : `https://api.academiahub.com/api/payment/callback`
   - Configurer le webhook pour les événements de transaction : `https://api.academiahub.com/api/payment/webhook`
   - Activer les notifications par email pour les transactions

2. Récupérer les clés API :
   - Clé publique (pk_live_xxx)
   - Clé secrète (sk_live_xxx)
   - Secret de webhook (wh_live_xxx)

### Configuration du stockage pour les documents KYC

#### Pour AWS S3 :
1. Créer un bucket S3 dédié : `academiahub-kyc-documents`
2. Configurer les politiques CORS pour permettre les uploads depuis le domaine de l'application
3. Configurer une politique de cycle de vie pour les documents (conservation, archivage)
4. Activer le chiffrement côté serveur pour les documents

#### Pour Google Cloud Storage :
1. Créer un bucket GCS dédié : `academiahub-kyc-documents`
2. Configurer les autorisations CORS
3. Configurer le chiffrement des données

## Procédure de déploiement

### 1. Préparation de la base de données

Exécuter les scripts de migration pour ajouter les nouvelles collections et champs :

```bash
# Connexion à la base de données
mongo mongodb://username:password@hostname:port/academiahub_prod

# Exécution des migrations
load("scripts/migrations/add_kyc_fields.js")
load("scripts/migrations/add_payment_fields.js")
```

### 2. Sauvegarde préalable

```bash
# Sauvegarde de la base de données
mongodump --uri="mongodb://username:password@hostname:port/academiahub_prod" --out=/backups/pre_deploy_$(date +%Y%m%d_%H%M%S)

# Sauvegarde du code actuel
cd /var/www/academiahub
tar -czf /backups/academiahub_code_$(date +%Y%m%d_%H%M%S).tar.gz .
```

### 3. Déploiement du code

#### Via CI/CD (recommandé) :
1. Fusionner la branche de développement dans la branche principale
2. Déclencher le pipeline de déploiement
3. Vérifier les logs du pipeline pour s'assurer que tous les tests passent

#### Déploiement manuel :
```bash
# Accéder au répertoire du projet
cd /var/www/academiahub

# Récupérer les dernières modifications
git pull origin main

# Installer les dépendances
npm ci --production

# Construire l'application frontend
npm run build

# Redémarrer l'application avec PM2
pm2 reload ecosystem.config.js --env production
```

### 4. Configuration du serveur web (Nginx)

Mettre à jour la configuration Nginx pour les nouvelles routes :

```nginx
# /etc/nginx/sites-available/academiahub.conf

server {
    listen 443 ssl http2;
    server_name api.academiahub.com;

    ssl_certificate /etc/letsencrypt/live/api.academiahub.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.academiahub.com/privkey.pem;

    # Configuration SSL sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    # Augmenter la taille maximale des uploads pour les documents KYC
    client_max_body_size 20M;

    location /api/payment/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/kyc/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }

    # Configuration existante...
}
```

Recharger la configuration Nginx :
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Tests post-déploiement

### 1. Tests de santé de base
- Vérifier que l'API est accessible : `curl -I https://api.academiahub.com/api/health`
- Vérifier que le frontend est accessible : `curl -I https://academiahub.com`

### 2. Tests fonctionnels
Exécuter les tests automatisés en environnement de production (mode lecture seule) :

```bash
# Tests d'intégration
NODE_ENV=production npm run test:integration -- --tags "payment,kyc"

# Tests end-to-end
NODE_ENV=production npm run test:e2e -- --spec "cypress/e2e/registration-flow.cy.ts,cypress/e2e/kyc-flow.cy.ts"
```

### 3. Tests manuels critiques
- Créer une transaction de test avec le mode sandbox de FedaPay
- Vérifier la réception des webhooks
- Tester le processus d'inscription complet avec un compte de test
- Tester le téléchargement et la vérification des documents KYC

## Plan de rollback

### Critères de décision pour un rollback
- Taux d'erreur supérieur à 5% sur les routes de paiement
- Échec des transactions de test
- Problèmes d'accès aux documents KYC
- Problèmes de sécurité identifiés

### Procédure de rollback

#### 1. Rollback du code
```bash
# Arrêter l'application
pm2 stop academiahub

# Restaurer la version précédente du code
cd /var/www/academiahub
git reset --hard HEAD~1  # ou spécifier le commit précis

# Réinstaller les dépendances
npm ci --production

# Reconstruire l'application
npm run build

# Redémarrer l'application
pm2 start ecosystem.config.js --env production
```

#### 2. Rollback de la base de données
```bash
# Restaurer la sauvegarde de la base de données
mongorestore --uri="mongodb://username:password@hostname:port/academiahub_prod" --drop /backups/pre_deploy_XXXXXXXX_XXXXXX/academiahub_prod
```

#### 3. Communication
- Informer l'équipe technique du rollback
- Envoyer une notification aux utilisateurs concernés
- Mettre à jour le statut du système sur la page de statut

## Monitoring et alertes

### Métriques à surveiller
- Taux de réussite des transactions FedaPay
- Temps de réponse des API de paiement
- Taux de conversion du processus d'inscription
- Utilisation de l'espace de stockage pour les documents KYC
- Erreurs lors des uploads de documents

### Configuration des alertes
1. Configurer des alertes dans le système de monitoring (Prometheus, Grafana, etc.) :
   - Alerte si le taux d'erreur des transactions dépasse 5% sur 5 minutes
   - Alerte si le temps de réponse moyen dépasse 2 secondes sur 5 minutes
   - Alerte si l'espace de stockage KYC dépasse 80% de capacité

2. Configurer des tests de disponibilité (heartbeat) :
   - Vérification toutes les 5 minutes de l'API de paiement
   - Vérification toutes les 5 minutes de l'API KYC

### Tableau de bord de monitoring
Créer un tableau de bord Grafana avec les visualisations suivantes :
- Nombre de transactions par heure/jour
- Taux de réussite des transactions
- Temps de traitement des webhooks
- Nombre de documents KYC téléchargés par jour
- Taux d'approbation/rejet des vérifications KYC

## Maintenance

### Tâches régulières
- Vérifier les logs d'erreur quotidiennement
- Surveiller l'espace de stockage des documents KYC
- Effectuer des sauvegardes quotidiennes de la base de données
- Vérifier les certificats SSL mensuellement

### Mises à jour de sécurité
- Mettre à jour les dépendances Node.js mensuellement
- Appliquer les correctifs de sécurité dès leur disponibilité
- Effectuer des audits de sécurité trimestriels

### Documentation des incidents
En cas d'incident :
1. Documenter la nature de l'incident
2. Enregistrer les actions entreprises pour résoudre le problème
3. Effectuer une analyse post-mortem
4. Mettre en place des mesures pour éviter que l'incident ne se reproduise

---

## Annexes

### A. Scripts utiles

#### Vérification de l'état des webhooks FedaPay
```bash
curl -X GET "https://api.fedapay.com/v1/webhooks" \
  -H "Authorization: Bearer $FEDAPAY_SECRET_KEY" \
  -H "Content-Type: application/json"
```

#### Nettoyage des transactions de test
```bash
# Script à exécuter uniquement en environnement de test
node scripts/cleanup-test-transactions.js
```

### B. Contacts d'urgence

- Support FedaPay : support@fedapay.com / +229 XX XX XX XX
- Administrateur système : admin@academiahub.com / +229 XX XX XX XX
- Responsable technique : tech@academiahub.com / +229 XX XX XX XX

### C. Checklist de déploiement

- [ ] Sauvegardes effectuées
- [ ] Tests unitaires et d'intégration passés
- [ ] Variables d'environnement configurées
- [ ] Webhook FedaPay configuré
- [ ] Stockage KYC configuré
- [ ] Configuration Nginx mise à jour
- [ ] Tests post-déploiement effectués
- [ ] Monitoring configuré
- [ ] Documentation mise à jour
