/**
 * Étape du formulaire pour les informations de l'école
 * @module components/registration/steps/SchoolInfoStep
 */

import React, { useEffect } from 'react';
import { ErrorMessage } from 'formik';
import { debounce } from 'lodash';

interface SchoolInfoStepProps {
  values: {
    schoolName: string;
    schoolType: string;
    schoolAddress: string;
    subdomain: string;
  };
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  isSubdomainAvailable: boolean | null;
  isSubdomainChecking: boolean;
  checkSubdomain: (subdomain: string) => void;
}

/**
 * Composant pour l'étape des informations de l'école
 */
const SchoolInfoStep: React.FC<SchoolInfoStepProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  isSubdomainAvailable,
  isSubdomainChecking,
  checkSubdomain
}) => {
  // Vérification du sous-domaine avec debounce
  const debouncedCheckSubdomain = React.useCallback(
    debounce((subdomain: string) => {
      checkSubdomain(subdomain);
    }, 500),
    [checkSubdomain]
  );

  // Vérifier le sous-domaine lorsqu'il change
  useEffect(() => {
    if (values.subdomain && values.subdomain.length >= 3) {
      debouncedCheckSubdomain(values.subdomain);
    }
  }, [values.subdomain, debouncedCheckSubdomain]);

  // Rendu du statut de disponibilité du sous-domaine
  const renderSubdomainStatus = () => {
    if (!values.subdomain || values.subdomain.length < 3) {
      return null;
    }

    if (isSubdomainChecking) {
      return <div className="subdomain-status checking">Vérification en cours...</div>;
    }

    if (isSubdomainAvailable === true) {
      return <div className="subdomain-status available">✓ Ce sous-domaine est disponible</div>;
    }

    if (isSubdomainAvailable === false) {
      return <div className="subdomain-status unavailable">✗ Ce sous-domaine est déjà utilisé</div>;
    }

    return null;
  };

  return (
    <div className="form-step school-info-step">
      <h3>Informations de l'école</h3>
      <p className="step-description">
        Veuillez fournir les informations concernant votre établissement scolaire.
      </p>

      <div className="form-group">
        <label htmlFor="schoolName">Nom de l'école *</label>
        <input
          type="text"
          id="schoolName"
          name="schoolName"
          className={`form-control ${errors.schoolName && touched.schoolName ? 'is-invalid' : ''}`}
          value={values.schoolName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Nom complet de votre établissement"
        />
        <ErrorMessage name="schoolName" component="div" className="invalid-feedback" />
      </div>

      <div className="form-group">
        <label htmlFor="schoolType">Type d'établissement *</label>
        <select
          id="schoolType"
          name="schoolType"
          className={`form-control ${errors.schoolType && touched.schoolType ? 'is-invalid' : ''}`}
          value={values.schoolType}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="">Sélectionnez un type</option>
          <option value="primary">École primaire</option>
          <option value="middle">Collège</option>
          <option value="high">Lycée</option>
          <option value="university">Université</option>
          <option value="professional">École professionnelle</option>
          <option value="language">École de langues</option>
          <option value="other">Autre</option>
        </select>
        <ErrorMessage name="schoolType" component="div" className="invalid-feedback" />
      </div>

      <div className="form-group">
        <label htmlFor="schoolAddress">Adresse de l'école *</label>
        <textarea
          id="schoolAddress"
          name="schoolAddress"
          className={`form-control ${errors.schoolAddress && touched.schoolAddress ? 'is-invalid' : ''}`}
          value={values.schoolAddress}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Adresse complète de l'établissement"
          rows={3}
        />
        <ErrorMessage name="schoolAddress" component="div" className="invalid-feedback" />
      </div>

      <div className="form-group">
        <label htmlFor="subdomain">Sous-domaine souhaité *</label>
        <div className="input-group">
          <input
            type="text"
            id="subdomain"
            name="subdomain"
            className={`form-control ${errors.subdomain && touched.subdomain ? 'is-invalid' : ''}`}
            value={values.subdomain}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="votre-ecole"
          />
          <div className="input-group-append">
            <span className="input-group-text">.academiahub.com</span>
          </div>
        </div>
        <small className="form-text text-muted">
          Le sous-domaine sera utilisé comme URL d'accès à votre espace école.
          Il doit contenir uniquement des lettres minuscules, des chiffres et des tirets.
        </small>
        {renderSubdomainStatus()}
        <ErrorMessage name="subdomain" component="div" className="invalid-feedback" />
      </div>

      <div className="form-info-box">
        <div className="info-icon">
          <i className="fas fa-info-circle"></i>
        </div>
        <div className="info-content">
          <p>
            Ces informations seront utilisées pour configurer votre espace école dans notre système.
            Le sous-domaine choisi sera l'adresse web à laquelle vos utilisateurs accéderont à la plateforme.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolInfoStep;
