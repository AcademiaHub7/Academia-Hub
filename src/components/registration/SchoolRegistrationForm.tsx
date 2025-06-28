/**
 * Formulaire d'inscription multi-étapes pour les écoles
 * @module components/registration/SchoolRegistrationForm
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import ReCAPTCHA from 'react-google-recaptcha';

// Étapes du formulaire
import PromoteurInfoStep from './steps/PromoteurInfoStep';
import SchoolInfoStep from './steps/SchoolInfoStep';
import PasswordStep from './steps/PasswordStep';

// Services
import registrationService from '../../services/registration/registrationService';

// Types
interface RegistrationFormValues {
  // Informations du promoteur
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  
  // Informations de l'école
  schoolName: string;
  schoolType: string;
  schoolAddress: string;
  subdomain: string;
  
  // Mot de passe
  password: string;
  confirmPassword: string;
  
  // Propriétés pour la compatibilité avec FormValues
  [key: string]: string | number | boolean | undefined;
}

// Validation schemas pour chaque étape
const promoteurValidationSchema = Yup.object({
  firstName: Yup.string().required('Le prénom est requis'),
  lastName: Yup.string().required('Le nom est requis'),
  email: Yup.string().email('Email invalide').required('L\'email est requis'),
  phone: Yup.string().required('Le numéro de téléphone est requis'),
  address: Yup.string().required('L\'adresse est requise')
});

const schoolValidationSchema = Yup.object({
  schoolName: Yup.string().required('Le nom de l\'école est requis'),
  schoolType: Yup.string().required('Le type d\'établissement est requis'),
  schoolAddress: Yup.string().required('L\'adresse de l\'école est requise'),
  subdomain: Yup.string()
    .required('Le sous-domaine est requis')
    .min(3, 'Le sous-domaine doit contenir au moins 3 caractères')
    .max(30, 'Le sous-domaine ne peut pas dépasser 30 caractères')
    .matches(/^[a-z0-9-]+$/, 'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets')
});

const passwordValidationSchema = Yup.object({
  password: Yup.string()
    .required('Le mot de passe est requis')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[a-z]/, 'Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[A-Z]/, 'Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
    .matches(/[^a-zA-Z0-9]/, 'Le mot de passe doit contenir au moins un caractère spécial'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est requise')
});

/**
 * Composant de formulaire d'inscription pour les écoles
 */
const SchoolRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [isSubdomainAvailable, setIsSubdomainAvailable] = useState<boolean | null>(null);
  const [isSubdomainChecking, setIsSubdomainChecking] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Valeurs initiales du formulaire
  const initialValues: RegistrationFormValues = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    schoolName: '',
    schoolType: '',
    schoolAddress: '',
    subdomain: '',
    password: '',
    confirmPassword: ''
  };

  // Validation schema pour l'étape courante
  const getValidationSchemaForCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return promoteurValidationSchema;
      case 1:
        return schoolValidationSchema;
      case 2:
        return passwordValidationSchema;
      default:
        return Yup.object({});
    }
  };

  // Vérification de la disponibilité du sous-domaine
  const checkSubdomain = async (subdomain: string): Promise<void> => {
    if (subdomain.length < 3) return;
    
    setIsSubdomainChecking(true);
    setIsSubdomainAvailable(null);
    
    try {
      const isAvailable = await registrationService.checkSubdomainAvailability(subdomain);
      setIsSubdomainAvailable(isAvailable);
    } catch (error) {
      console.error('Erreur lors de la vérification du sous-domaine:', error);
      setIsSubdomainAvailable(false);
    } finally {
      setIsSubdomainChecking(false);
    }
  };

  // Gestion du changement d'étape
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Soumission du formulaire
  const handleSubmit = async (values: RegistrationFormValues): Promise<void> => {
    if (!recaptchaValue) {
      setFormError('Veuillez confirmer que vous n\'êtes pas un robot');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      // Enregistrement des données du formulaire
      const response = await fetch('/api/register/school', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          recaptchaToken: recaptchaValue
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de l\'inscription');
      }

      // Redirection vers la page de choix de plan
      navigate('/register/school/plan', { 
        state: { 
          registrationId: data.registrationId,
          email: values.email
        } 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription';
      setFormError(errorMessage);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Rendu des étapes du formulaire
  const renderStep = (
    values: RegistrationFormValues,
    errors: { [key: string]: string | undefined },
    touched: { [key: string]: boolean | undefined },
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void,
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  ) => {
    switch (currentStep) {
      case 0:
        return (
          <PromoteurInfoStep
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
        );
      case 1:
        return (
          <SchoolInfoStep
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
            isSubdomainAvailable={isSubdomainAvailable}
            isSubdomainChecking={isSubdomainChecking}
            checkSubdomain={checkSubdomain}
          />
        );
      case 2:
        return (
          <PasswordStep
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="school-registration-container">
      <div className="registration-progress">
        <div className={`progress-step ${currentStep >= 0 ? 'active' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Informations personnelles</div>
        </div>
        <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Informations de l'école</div>
        </div>
        <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Sécurité</div>
        </div>
      </div>

      <div className="registration-form-container">
        <h2>Inscription d'une nouvelle école</h2>
        
        <Formik
          initialValues={initialValues}
          validationSchema={getValidationSchemaForCurrentStep()}
          onSubmit={handleSubmit}
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, validateForm }) => (
            <Form onSubmit={handleSubmit}>
              {renderStep(values, errors, touched, handleChange, handleBlur)}
              
              {formError && (
                <div className="form-error-message">
                  {formError}
                </div>
              )}
              
              <div className="form-navigation">
                {currentStep > 0 && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handlePrevStep}
                    disabled={formSubmitting}
                  >
                    Précédent
                  </button>
                )}
                
                {currentStep < 2 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      validateForm().then(errors => {
                        if (Object.keys(errors).length === 0) {
                          handleNextStep();
                        }
                      });
                    }}
                  >
                    Suivant
                  </button>
                ) : (
                  <>
                    <div className="recaptcha-container">
                      <ReCAPTCHA
                        sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || ''}
                        onChange={(value) => setRecaptchaValue(value)}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={formSubmitting || !isValid || !recaptchaValue || (currentStep === 1 && isSubdomainAvailable === false)}
                    >
                      {formSubmitting ? 'Inscription en cours...' : 'Terminer l\'inscription'}
                    </button>
                  </>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SchoolRegistrationForm;
