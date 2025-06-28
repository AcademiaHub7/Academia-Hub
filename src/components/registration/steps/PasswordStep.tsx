/**
 * Étape du formulaire pour la création du mot de passe
 * @module components/registration/steps/PasswordStep
 */

import React, { useState } from 'react';
import { ErrorMessage } from 'formik';

interface FormValues {
  password: string;
  confirmPassword: string;
  [key: string]: string | number | boolean | undefined; // Types spécifiques pour les champs du formulaire
}

interface FormTouched {
  password?: boolean;
  confirmPassword?: boolean;
  [key: string]: boolean | undefined;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

interface PasswordStepProps {
  values: FormValues;
  errors: FormErrors;
  touched: FormTouched;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * Composant pour l'étape de création du mot de passe
 */
const PasswordStep: React.FC<PasswordStepProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calcul de la force du mot de passe
  const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexité
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    return Math.min(5, strength);
  };

  const passwordStrength = calculatePasswordStrength(values.password);
  
  // Rendu de l'indicateur de force du mot de passe
  const renderPasswordStrengthIndicator = () => {
    const strengthLabels = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const strengthClasses = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
    
    if (!values.password) return null;
    
    return (
      <div className="password-strength-container">
        <div className="password-strength-bars">
          {[1, 2, 3, 4, 5].map((level) => (
            <div 
              key={level} 
              className={`strength-bar ${level <= passwordStrength ? strengthClasses[passwordStrength - 1] : ''}`}
            />
          ))}
        </div>
        <div className="password-strength-label">
          {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Très faible'}
        </div>
      </div>
    );
  };

  return (
    <div className="form-step password-step">
      <h3>Création du mot de passe</h3>
      <p className="step-description">
        Veuillez créer un mot de passe sécurisé pour votre compte.
      </p>

      <div className="form-group">
        <label htmlFor="password">Mot de passe *</label>
        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Votre mot de passe"
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`} aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <ErrorMessage name="password" component="div" className="invalid-feedback d-block" />
        {renderPasswordStrengthIndicator()}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
        <div className="input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            className={`form-control ${errors.confirmPassword && touched.confirmPassword ? 'is-invalid' : ''}`}
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirmez votre mot de passe"
          />
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
              aria-label={showConfirmPassword ? 'Masquer la confirmation du mot de passe' : 'Afficher la confirmation du mot de passe'}
            >
              <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`} aria-hidden="true"></i>
            </button>
          </div>
        </div>
        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback d-block" />
      </div>

      <div className="password-requirements">
        <h4>Exigences de sécurité :</h4>
        <ul>
          <li className={values.password.length >= 8 ? 'met' : ''}>
            Au moins 8 caractères
          </li>
          <li className={/[a-z]/.test(values.password) ? 'met' : ''}>
            Au moins une lettre minuscule
          </li>
          <li className={/[A-Z]/.test(values.password) ? 'met' : ''}>
            Au moins une lettre majuscule
          </li>
          <li className={/[0-9]/.test(values.password) ? 'met' : ''}>
            Au moins un chiffre
          </li>
          <li className={/[^a-zA-Z0-9]/.test(values.password) ? 'met' : ''}>
            Au moins un caractère spécial
          </li>
        </ul>
      </div>

      <div className="form-info-box">
        <div className="info-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div className="info-content">
          <p>
            La sécurité de votre compte est importante. Choisissez un mot de passe fort
            que vous n'utilisez pas sur d'autres sites. Ne partagez jamais votre mot de passe
            avec d'autres personnes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordStep;
