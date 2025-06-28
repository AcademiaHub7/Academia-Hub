/**
 * Étape du formulaire de profil principal
 * @module components/registration/steps/ProfileForm
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RegistrationSession } from '../../../types';

interface ProfileFormProps {
  sessionData: RegistrationSession | null;
  updateSessionData: (updates: Partial<RegistrationSession>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  saveSession: () => Promise<void>;
}

/**
 * Composant du formulaire de profil principal (2-3 minutes)
 */
const ProfileForm: React.FC<ProfileFormProps> = ({
  sessionData,
  updateSessionData,
  goToNextStep,
  goToPreviousStep,
  validationErrors,
  setValidationErrors,
  saveSession
}) => {
  // État du promoteur
  const [promoterData, setPromoterData] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    position: string;
    address: string;
    password: string;
    confirmPassword: string;
  }>({
    email: sessionData?.promoter?.email || 'default@example.com', // Valeur par défaut temporaire
    firstName: sessionData?.promoter?.firstName || '',
    lastName: sessionData?.promoter?.lastName || '',
    phone: sessionData?.promoter?.phone || '',
    position: sessionData?.promoter?.position || '',
    address: sessionData?.promoter?.address || '',
    password: sessionData?.promoter?.password || '',
    confirmPassword: sessionData?.promoter?.confirmPassword || ''
  });
  
  // État de l'école
  const [schoolData, setSchoolData] = useState<{
    name: string;
    type: string;
    address: string;
    subdomain: string;
    country: string;
    city: string;
    postalCode: string;
    phone: string;
    website: string;
    foundedYear: number;
    numberOfStudents: number;
  }>({
    name: sessionData?.school?.name || '',
    type: sessionData?.school?.type || '',
    address: sessionData?.school?.address || 'Adresse par défaut',
    subdomain: sessionData?.school?.subdomain || `school-${Math.random().toString(36).substring(2, 8)}`,
    country: sessionData?.school?.country || '',
    city: sessionData?.school?.city || '',
    postalCode: sessionData?.school?.postalCode || '',
    phone: sessionData?.school?.phone || '',
    website: sessionData?.school?.website || '',
    foundedYear: sessionData?.school?.foundedYear || new Date().getFullYear(),
    numberOfStudents: sessionData?.school?.numberOfStudents || 0
  });
  
  // État de chargement
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('promoter');
  
  // Options pour les types d'écoles
  const schoolTypes = [
    { value: 'primary', label: 'École primaire' },
    { value: 'secondary', label: 'École secondaire' },
    { value: 'high_school', label: 'Lycée' },
    { value: 'university', label: 'Université' },
    { value: 'vocational', label: 'École professionnelle' },
    { value: 'language', label: 'École de langues' },
    { value: 'other', label: 'Autre' }
  ];
  
  // Options pour les pays (version simplifiée)
  const countries = [
    { value: 'benin', label: 'Bénin' },
    { value: 'togo', label: 'Togo' },
    { value: 'cote_ivoire', label: 'Côte d\'Ivoire' },
    { value: 'senegal', label: 'Sénégal' },
    { value: 'burkina_faso', label: 'Burkina Faso' },
    { value: 'mali', label: 'Mali' },
    { value: 'niger', label: 'Niger' },
    { value: 'ghana', label: 'Ghana' },
    { value: 'nigeria', label: 'Nigeria' }
  ];
  
  // Mettre à jour les données du promoteur
  const handlePromoterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPromoterData({
      ...promoterData,
      [name]: value
    });
    
    // Effacer les erreurs de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  // Mettre à jour les données de l'école
  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchoolData({
      ...schoolData,
      [name]: value
    });
    
    // Effacer les erreurs de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };
  
  // Sauvegarder automatiquement les données du formulaire
  useEffect(() => {
    if (!promoterData.firstName && !promoterData.lastName && !promoterData.phone && 
        !schoolData.name && !schoolData.type) {
      return;
    }
    
    const timer = setTimeout(() => {
      updateSessionData({
        promoter: {
          email: promoterData.email, // Champ obligatoire
          ...(promoterData.firstName && { firstName: promoterData.firstName }),
          ...(promoterData.lastName && { lastName: promoterData.lastName }),
          ...(promoterData.phone && { phone: promoterData.phone }),
          ...(promoterData.position && { position: promoterData.position }),
          ...(promoterData.address && { address: promoterData.address }),
          ...(promoterData.password && { password: promoterData.password }),
          ...(promoterData.confirmPassword && { confirmPassword: promoterData.confirmPassword })
        },
        school: {
          name: schoolData.name, // Champ obligatoire
          type: schoolData.type, // Champ obligatoire
          address: schoolData.address, // Champ obligatoire
          subdomain: schoolData.subdomain, // Champ obligatoire
          ...(schoolData.city && { city: schoolData.city }),
          ...(schoolData.postalCode && { postalCode: schoolData.postalCode }),
          ...(schoolData.country && { country: schoolData.country }),
          ...(schoolData.phone && { phone: schoolData.phone }),
          ...(schoolData.website && { website: schoolData.website }),
          ...(schoolData.foundedYear && { foundedYear: schoolData.foundedYear }),
          ...(schoolData.numberOfStudents && { numberOfStudents: schoolData.numberOfStudents })
        }
      });
      
      saveSession();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [promoterData, schoolData, saveSession, updateSessionData]);
  
  // Valider le formulaire
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validation du promoteur
    if (!promoterData.firstName) {
      errors.firstName = 'Le prénom est requis';
    }
    
    if (!promoterData.lastName) {
      errors.lastName = 'Le nom est requis';
    }
    
    if (!promoterData.phone) {
      errors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^\+?[0-9]{8,15}$/.test(promoterData.phone)) {
      errors.phone = 'Format de téléphone invalide';
    }
    
    if (!promoterData.position) {
      errors.position = 'Le poste est requis';
    }
    
    if (!promoterData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (promoterData.password.length < 8) {
      errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (promoterData.password !== promoterData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    // Validation de l'école
    if (!schoolData.name) {
      errors.name = 'Le nom de l\'école est requis';
    }
    
    if (!schoolData.type) {
      errors.type = 'Le type d\'école est requis';
    }
    
    if (!schoolData.country) {
      errors.country = 'Le pays est requis';
    }
    
    if (!schoolData.city) {
      errors.city = 'La ville est requise';
    }
    
    if (!schoolData.address) {
      errors.address = 'L\'adresse est requise';
    }
    
    return errors;
  };
  
  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valider le formulaire
    const errors = validateForm();
    setValidationErrors(errors);
    
    // Si pas d'erreurs, passer à l'étape suivante
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Mettre à jour les données de session
        updateSessionData({
          promoter: {
            ...(sessionData?.promoter || {}),
            firstName: promoterData.firstName,
            lastName: promoterData.lastName,
            phone: promoterData.phone,
            position: promoterData.position,
            password: promoterData.password
          },
          school: {
            ...(sessionData?.school || {}),
            name: schoolData.name,
            type: schoolData.type,
            country: schoolData.country,
            city: schoolData.city,
            address: schoolData.address,
            postalCode: schoolData.postalCode,
            phone: schoolData.phone,
            website: schoolData.website,
            foundedYear: schoolData.foundedYear,
            numberOfStudents: schoolData.numberOfStudents
          }
        });
        
        // Sauvegarder la session
        await saveSession();
        
        // Passer à l'étape suivante
        goToNextStep();
      } catch (error) {
        console.error('Erreur lors de la soumission du formulaire:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <motion.div 
      className="profile-form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Complétez votre profil</h2>
      <p className="step-description">
        Fournissez les informations détaillées sur vous et votre établissement.
        <br />
        <span className="time-estimate">Temps estimé: 2-3 minutes</span>
      </p>
      
      <div className="profile-tabs">
        <div 
          className={`profile-tab ${activeTab === 'promoter' ? 'active' : ''}`}
          onClick={() => setActiveTab('promoter')}
        >
          <i className="fas fa-user mr-2"></i> Informations personnelles
        </div>
        <div 
          className={`profile-tab ${activeTab === 'school' ? 'active' : ''}`}
          onClick={() => setActiveTab('school')}
        >
          <i className="fas fa-school mr-2"></i> Informations de l'établissement
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="profile-form">
        {/* Onglet Promoteur */}
        <div className={`tab-content ${activeTab === 'promoter' ? 'active' : ''}`}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-control ${validationErrors.firstName ? 'is-invalid' : ''}`}
                  value={promoterData.firstName}
                  onChange={handlePromoterChange}
                />
                {validationErrors.firstName && (
                  <div className="invalid-feedback">{validationErrors.firstName}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                  value={promoterData.lastName}
                  onChange={handlePromoterChange}
                />
                {validationErrors.lastName && (
                  <div className="invalid-feedback">{validationErrors.lastName}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="phone">Téléphone *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-control ${validationErrors.phone ? 'is-invalid' : ''}`}
                  value={promoterData.phone}
                  onChange={handlePromoterChange}
                  placeholder="+229XXXXXXXX"
                />
                {validationErrors.phone && (
                  <div className="invalid-feedback">{validationErrors.phone}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="position">Poste/Fonction *</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  className={`form-control ${validationErrors.position ? 'is-invalid' : ''}`}
                  value={promoterData.position}
                  onChange={handlePromoterChange}
                  placeholder="Directeur, Fondateur, etc."
                />
                {validationErrors.position && (
                  <div className="invalid-feedback">{validationErrors.position}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="password">Mot de passe *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                  value={promoterData.password}
                  onChange={handlePromoterChange}
                />
                {validationErrors.password && (
                  <div className="invalid-feedback">{validationErrors.password}</div>
                )}
                <small className="form-text text-muted">
                  Le mot de passe doit contenir au moins 8 caractères.
                </small>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                  value={promoterData.confirmPassword}
                  onChange={handlePromoterChange}
                />
                {validationErrors.confirmPassword && (
                  <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline-primary"
              onClick={() => setActiveTab('school')}
            >
              Suivant: Informations de l'établissement
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
        
        {/* Onglet École */}
        <div className={`tab-content ${activeTab === 'school' ? 'active' : ''}`}>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="name">Nom de l'établissement *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                  value={schoolData.name}
                  onChange={handleSchoolChange}
                />
                {validationErrors.name && (
                  <div className="invalid-feedback">{validationErrors.name}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="type">Type d'établissement *</label>
                <select
                  id="type"
                  name="type"
                  className={`form-control ${validationErrors.type ? 'is-invalid' : ''}`}
                  value={schoolData.type}
                  onChange={handleSchoolChange}
                >
                  <option value="">Sélectionnez un type</option>
                  {schoolTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {validationErrors.type && (
                  <div className="invalid-feedback">{validationErrors.type}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="country">Pays *</label>
                <select
                  id="country"
                  name="country"
                  className={`form-control ${validationErrors.country ? 'is-invalid' : ''}`}
                  value={schoolData.country}
                  onChange={handleSchoolChange}
                >
                  <option value="">Sélectionnez un pays</option>
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
                {validationErrors.country && (
                  <div className="invalid-feedback">{validationErrors.country}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="city">Ville *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                  value={schoolData.city}
                  onChange={handleSchoolChange}
                />
                {validationErrors.city && (
                  <div className="invalid-feedback">{validationErrors.city}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8">
              <div className="form-group">
                <label htmlFor="address">Adresse *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                  value={schoolData.address}
                  onChange={handleSchoolChange}
                />
                {validationErrors.address && (
                  <div className="invalid-feedback">{validationErrors.address}</div>
                )}
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="postalCode">Code postal</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  className="form-control"
                  value={schoolData.postalCode}
                  onChange={handleSchoolChange}
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="schoolPhone">Téléphone de l'établissement</label>
                <input
                  type="tel"
                  id="schoolPhone"
                  name="phone"
                  className="form-control"
                  value={schoolData.phone}
                  onChange={handleSchoolChange}
                  placeholder="+229XXXXXXXX"
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="website">Site web</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="form-control"
                  value={schoolData.website}
                  onChange={handleSchoolChange}
                  placeholder="https://www.votresite.com"
                />
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="foundedYear">Année de fondation</label>
                <input
                  type="number"
                  id="foundedYear"
                  name="foundedYear"
                  className="form-control"
                  value={schoolData.foundedYear}
                  onChange={handleSchoolChange}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="numberOfStudents">Nombre d'étudiants</label>
                <input
                  type="number"
                  id="numberOfStudents"
                  name="numberOfStudents"
                  className="form-control"
                  value={schoolData.numberOfStudents}
                  onChange={handleSchoolChange}
                  min="0"
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline-secondary mr-2"
              onClick={() => setActiveTab('promoter')}
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour: Informations personnelles
            </button>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Enregistrement...
                </>
              ) : (
                <>Continuer <i className="fas fa-arrow-right ml-2"></i></>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <div className="navigation-buttons">
        <button 
          className="btn btn-outline-secondary"
          onClick={goToPreviousStep}
          disabled={isSubmitting}
        >
          <i className="fas fa-arrow-left mr-2"></i> Étape précédente
        </button>
      </div>
    </motion.div>
  );
};

export default ProfileForm;
