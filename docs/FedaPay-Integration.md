# Documentation d'intégration FedaPay - Academia Hub

## Introduction

Cette documentation détaille l'intégration du système de paiement FedaPay dans l'application Academia Hub. Cette intégration permet de gérer les paiements et abonnements des écoles utilisatrices de la plateforme.

## Table des matières

1. [Architecture](#architecture)
2. [Services implémentés](#services-implémentés)
3. [Flux de paiement](#flux-de-paiement)
4. [Webhooks](#webhooks)
5. [Composants React](#composants-react)
6. [Configuration](#configuration)
7. [Tests](#tests)
8. [Plan de rollback](#plan-de-rollback)

## Architecture

L'intégration FedaPay dans Academia Hub suit une architecture en couches :

```
┌─────────────────┐     ┌───────────────────┐     ┌───────────────┐
│  Composants UI  │────▶│    Contrôleurs    │────▶│   Services    │
└─────────────────┘     └───────────────────┘     └───────┬───────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌───────────────────┐     ┌───────────────┐
│  Base de données│◀────│      Modèles      │◀────│  API FedaPay  │
└─────────────────┘     └───────────────────┘     └───────────────┘
```

## Services implémentés

### FedaPayService

Service principal d'interaction avec l'API FedaPay.

**Fonctionnalités :**
- Création de transactions
- Génération d'URLs de paiement
- Vérification du statut des transactions
- Vérification des signatures de webhooks
- Gestion des abonnements récurrents

### SubscriptionService

Service de gestion des abonnements utilisant FedaPay.

**Fonctionnalités :**
- Création d'abonnements (standards et périodes d'essai)
- Renouvellement d'abonnements
- Traitement des paiements réussis et échoués
- Vérification des abonnements expirants
- Calcul des prix avec remises
- Envoi d'emails de notification

## Flux de paiement

### Création d'un nouvel abonnement

1. L'utilisateur sélectionne un plan d'abonnement
2. Le système crée une transaction via `fedapayService.createTransaction()`
3. Le système génère une URL de paiement via `fedapayService.generatePaymentUrl()`
4. L'utilisateur est redirigé vers la page de paiement FedaPay
5. Après paiement, FedaPay envoie un webhook à notre serveur
6. Le webhook est traité par `WebhookController.handleFedaPayWebhook()`
7. Le service d'abonnement met à jour le statut via `subscriptionService.processSuccessfulPayment()`
8. Un email de confirmation est envoyé à l'école

### Renouvellement d'abonnement

1. Le système détecte un abonnement expirant via `subscriptionService.checkExpiringSubscriptions()`
2. Une notification est envoyée à l'école
3. Si le renouvellement automatique est activé, le système crée une transaction
4. Le paiement est traité comme pour un nouvel abonnement

## Webhooks

Les webhooks FedaPay sont gérés par le `WebhookController` qui :

1. Vérifie l'authenticité de la signature avec `fedapayService.verifyWebhookSignature()`
2. Traite les événements selon leur type
3. Met à jour les statuts des transactions et abonnements
4. Déclenche les notifications appropriées

**Points d'entrée webhook :**
- `/api/webhooks/fedapay` - Endpoint principal pour les webhooks FedaPay

## Composants React

### FedaPayButton

Bouton de paiement FedaPay pour les interfaces utilisateur.

**Exemple d'utilisation :**
```jsx
<FedaPayButton
  amount={50000}
  description="Abonnement Premium - École XYZ"
  customerEmail="ecole@example.com"
  onSuccess={handlePaymentSuccess}
  onFailure={handlePaymentFailure}
/>
```

### FedaPayCheckout

Widget de paiement FedaPay intégré pour les interfaces utilisateur.

**Exemple d'utilisation :**
```jsx
<FedaPayCheckout
  amount={50000}
  description="Abonnement Premium - École XYZ"
  customerEmail="ecole@example.com"
  width="100%"
  height={600}
  onSuccess={handlePaymentSuccess}
/>
```

## Configuration

### Variables d'environnement

```
# FedaPay API Configuration
FEDAPAY_PUBLIC_KEY=pk_sandbox_XXXXXXX
FEDAPAY_SECRET_KEY=sk_sandbox_XXXXXXX
FEDAPAY_ENVIRONMENT=sandbox  # ou 'production'
FEDAPAY_WEBHOOK_SECRET=whsec_XXXXXXX

# Configuration React
REACT_APP_FEDAPAY_PUBLIC_KEY=pk_sandbox_XXXXXXX
```

### Installation des dépendances

```bash
# Backend
npm install axios crypto-js

# Frontend
npm install fedapay-reactjs --save
```

## Tests

Des tests unitaires complets ont été implémentés pour :

- `FedaPayService` - Tests des appels API, gestion des erreurs, vérification des signatures
- `SubscriptionService` - Tests de création, renouvellement et gestion des abonnements
- `WebhookController` - Tests de traitement des webhooks

Pour exécuter les tests :

```bash
npm test -- --testPathPattern=services/fedapayService
npm test -- --testPathPattern=services/subscriptionService
```

## Plan de rollback

En cas de problème avec l'intégration FedaPay, suivez ces étapes pour revenir à l'état précédent :

1. **Désactivation des webhooks :**
   - Désactivez temporairement le point d'entrée webhook dans le routeur Express

2. **Retour au système précédent :**
   - Modifiez les contrôleurs pour utiliser l'ancien système de paiement
   - Mettez à jour les routes pour contourner les nouveaux services

3. **Notification des utilisateurs :**
   - Envoyez un email aux écoles concernées pour les informer du changement temporaire
   - Proposez une solution alternative pour les paiements en cours

4. **Diagnostic et correction :**
   - Analysez les logs pour identifier les problèmes
   - Corrigez les problèmes identifiés dans un environnement de test
   - Déployez progressivement les corrections

Pour un rollback complet, utilisez la commande Git :

```bash
git revert HEAD~n..HEAD  # où n est le nombre de commits à annuler
```

---

## Annexe : Diagramme de séquence pour le processus de paiement

```
┌─────────┐          ┌─────────────┐          ┌───────────┐          ┌─────────┐
│ Client  │          │ Academia Hub │          │  FedaPay  │          │  Email  │
└────┬────┘          └──────┬──────┘          └─────┬─────┘          └────┬────┘
     │                      │                       │                      │
     │ Sélectionne plan     │                       │                      │
     │─────────────────────>│                       │                      │
     │                      │                       │                      │
     │                      │ Crée transaction      │                      │
     │                      │──────────────────────>│                      │
     │                      │                       │                      │
     │                      │ URL de paiement       │                      │
     │                      │<──────────────────────│                      │
     │                      │                       │                      │
     │ Redirection          │                       │                      │
     │<─────────────────────│                       │                      │
     │                      │                       │                      │
     │ Effectue paiement    │                       │                      │
     │──────────────────────────────────────────────>                      │
     │                      │                       │                      │
     │                      │    Webhook (paiement) │                      │
     │                      │<──────────────────────│                      │
     │                      │                       │                      │
     │                      │ Met à jour abonnement │                      │
     │                      │───────────────────────┐                      │
     │                      │                       │                      │
     │                      │ Envoie confirmation   │                      │
     │                      │───────────────────────────────────────────────>
     │                      │                       │                      │
     │ Redirection succès   │                       │                      │
     │<─────────────────────│                       │                      │
     │                      │                       │                      │
```
