# Documentation d'intégration - Page de chargement Academia Hub

Cette documentation explique comment intégrer et personnaliser la page de chargement d'Academia Hub dans votre application.

## Vue d'ensemble

La page de chargement d'Academia Hub est une interface moderne et captivante qui s'affiche pendant le chargement initial de l'application. Elle présente :

- Un logo "Academia Hub" proéminent
- Une barre de progression animée
- Des messages d'état de chargement dynamiques
- Des animations d'objets éducatifs répartis sur l'écran

## Structure des fichiers

```
src/
├── components/
│   └── loading/
│       ├── LoadingPage.tsx       # Composant React principal
│       ├── LoadingPage.css       # Styles CSS pour le composant
│       └── standalone-loading-page.html  # Version HTML autonome
└── utils/
    └── loadingManager.ts         # Utilitaire de gestion du chargement
```

## Intégration dans une application React

La page de chargement est déjà intégrée dans `App.tsx`. Elle s'affiche automatiquement au démarrage de l'application et disparaît une fois le chargement terminé.

### Personnalisation du temps de chargement

Vous pouvez modifier la durée du chargement simulé en ajustant la valeur dans `App.tsx` :

```tsx
useEffect(() => {
  // Simulate application initialization
  const loadingTimer = setTimeout(() => {
    setIsLoading(false);
  }, 3500); // Modifier cette valeur (en millisecondes)
  
  return () => clearTimeout(loadingTimer);
}, []);
```

### Utilisation avec un chargement réel

Pour utiliser la page avec un chargement réel de données ou de ressources :

```tsx
function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Exemple de chargement réel
    Promise.all([
      fetchUserData(),
      loadApplicationResources(),
      initializeDatabase()
    ])
    .then(() => {
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Erreur de chargement:", error);
      setIsLoading(false); // Assurez-vous de désactiver le chargement même en cas d'erreur
    });
  }, []);
  
  if (isLoading) {
    return <LoadingPage onLoadingComplete={() => setIsLoading(false)} />;
  }
  
  // Reste de l'application...
}
```

## Personnalisation

### Messages de chargement

Vous pouvez personnaliser les messages de chargement en modifiant le tableau `loadingStates` dans `LoadingPage.tsx` :

```tsx
const loadingStates = [
  "Initialisation de Academia Hub...",
  "Chargement des modules...",
  "Préparation de l'interface...",
  "Finalisation..."
  // Ajoutez ou modifiez les messages ici
];
```

### Palette de couleurs

Les couleurs principales sont définies dans `LoadingPage.css`. Pour modifier la palette :

```css
.logo-text {
  color: #1a56db; /* Couleur principale */
}

.progress-bar {
  background: linear-gradient(90deg, #1a56db, #3b82f6); /* Dégradé de la barre de progression */
}

/* Autres éléments à personnaliser */
```

### Animations

Vous pouvez ajuster les animations des objets éducatifs en modifiant les keyframes dans `LoadingPage.css` :

```css
@keyframes floatBook {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-10px) rotate(2deg); opacity: 0.9; } /* Ajustez ces valeurs */
}
```

## Accessibilité

La page de chargement respecte les normes d'accessibilité :

- Elle détecte la préférence de réduction de mouvement (`prefers-reduced-motion`)
- La barre de progression utilise les attributs ARIA appropriés
- Les animations sont purement décoratives et marquées avec `aria-hidden="true"`

## Version autonome HTML

Une version HTML autonome est disponible dans `standalone-loading-page.html`. Cette version peut être utilisée indépendamment du framework React, par exemple pour une page de préchargement avant que l'application principale ne soit chargée.

### Intégration de la version HTML

1. Copiez le fichier `standalone-loading-page.html` à la racine de votre projet
2. Modifiez la redirection dans le script pour pointer vers votre page principale :

```javascript
setTimeout(() => {
  window.location.href = 'index.html'; // Modifiez cette URL
}, 500);
```

## Optimisations

- Les animations utilisent `will-change` et `transform` pour de meilleures performances
- Les SVG sont optimisés pour la taille et les performances
- Le code détecte automatiquement les préférences de réduction de mouvement

## Dépannage

### Les animations ne s'affichent pas

Vérifiez que les fichiers CSS sont correctement importés et que le navigateur prend en charge les animations CSS.

### La page de chargement reste affichée trop longtemps

Assurez-vous que `setIsLoading(false)` est bien appelé une fois le chargement terminé.

---

Pour toute question supplémentaire, contactez l'équipe de développement d'Academia Hub.
