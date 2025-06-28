const Onboarding = () => {
  return (
    <div className="onboarding-step">
      <h2>Bienvenue sur Academia Hub</h2>
      <p>Découvrez les fonctionnalités clés pour tirer le meilleur parti de votre plateforme.</p>
      
      <div className="onboarding-content">
        <div className="onboarding-section">
          <h3>Tableau de bord</h3>
          <p>Votre centre de contrôle pour gérer toutes les activités de votre établissement.</p>
          <div className="feature-preview">
            <img src="/assets/images/onboarding/dashboard-preview.png" alt="Aperçu du tableau de bord" />
          </div>
        </div>
        
        <div className="onboarding-section">
          <h3>Gestion des élèves</h3>
          <p>Inscrivez, suivez et gérez efficacement tous vos élèves.</p>
          <div className="feature-preview">
            <img src="/assets/images/onboarding/students-preview.png" alt="Aperçu de la gestion des élèves" />
          </div>
        </div>
        
        <div className="onboarding-section">
          <h3>Finances</h3>
          <p>Suivez les paiements, générez des factures et gérez votre comptabilité.</p>
          <div className="feature-preview">
            <img src="/assets/images/onboarding/finance-preview.png" alt="Aperçu des finances" />
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="btn btn-primary"
        >
          Accéder à mon espace
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
