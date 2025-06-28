/**
 * Étape du formulaire pour les informations du promoteur
 * @module components/registration/steps/PromoteurInfoStep
 */

import React from 'react';
import { ErrorMessage } from 'formik';

interface PromoteurInfoStepProps {
  values: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  };
  errors: any;
  touched: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
}

/**
 * Composant pour l'étape des informations personnelles du promoteur
 */
const PromoteurInfoStep: React.FC<PromoteurInfoStepProps> = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur
}) => {
  return (
    <div className="form-step promoteur-info-step">
      <h3>Informations personnelles du promoteur</h3>
      <p className="step-description">
        Veuillez fournir vos informations personnelles en tant que promoteur de l'école.
      </p>

      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="firstName">Prénom *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-control ${errors.firstName && touched.firstName ? 'is-invalid' : ''}`}
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Votre prénom"
          />
          <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="lastName">Nom *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-control ${errors.lastName && touched.lastName ? 'is-invalid' : ''}`}
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Votre nom"
          />
          <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Adresse email *</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="votre.email@exemple.com"
        />
        <small className="form-text text-muted">
          Nous utiliserons cette adresse pour toutes les communications importantes.
        </small>
        <ErrorMessage name="email" component="div" className="invalid-feedback" />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Numéro de téléphone *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="+XXX XXXXXXXXX"
        />
        <ErrorMessage name="phone" component="div" className="invalid-feedback" />
      </div>

      <div className="form-group">
        <label htmlFor="address">Adresse *</label>
        <textarea
          id="address"
          name="address"
          className={`form-control ${errors.address && touched.address ? 'is-invalid' : ''}`}
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Votre adresse complète"
          rows={3}
        />
        <ErrorMessage name="address" component="div" className="invalid-feedback" />
      </div>

      <div className="form-info-box">
        <div className="info-icon">
          <i className="fas fa-info-circle"></i>
        </div>
        <div className="info-content">
          <p>
            En tant que promoteur, vous serez le propriétaire principal de cette école dans notre système.
            Vous aurez accès à toutes les fonctionnalités et pourrez gérer les autres utilisateurs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoteurInfoStep;
