/**
 * Formulaire de vérification KYC pour les promoteurs d'écoles
 * @module components/kyc/KYCVerificationForm
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { uploadKYCDocuments, getKYCStatus } from '../../services/kyc/kycService';
import FileUploader from './FileUploader';
import KYCStatusBadge from './KYCStatusBadge';

// Types
export enum KYCStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

interface KYCFormValues {
  idCard: File | null;
  schoolAuthorization: File | null;
  proofOfAddress: File | null;
  schoolPhotos: File[];
  additionalDocuments: File[];
}

/**
 * Composant de formulaire de vérification KYC
 */
const KYCVerificationForm: React.FC = () => {
  const navigate = useNavigate();
  const [kycStatus, setKycStatus] = useState<KYCStatus>(KYCStatus.PENDING);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Valeurs initiales du formulaire
  const initialValues: KYCFormValues = {
    idCard: null,
    schoolAuthorization: null,
    proofOfAddress: null,
    schoolPhotos: [],
    additionalDocuments: []
  };

  // Schéma de validation
  const validationSchema = Yup.object({
    idCard: Yup.mixed()
      .required('La pièce d\'identité est requise')
      .test('fileSize', 'Le fichier est trop volumineux (max 5MB)', 
        value => value && value.size <= 5 * 1024 * 1024)
      .test('fileType', 'Format non supporté (JPG, PNG ou PDF uniquement)', 
        value => value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type)),
    
    schoolAuthorization: Yup.mixed()
      .required('L\'autorisation d\'ouverture d\'école est requise')
      .test('fileSize', 'Le fichier est trop volumineux (max 5MB)', 
        value => value && value.size <= 5 * 1024 * 1024)
      .test('fileType', 'Format non supporté (JPG, PNG ou PDF uniquement)', 
        value => value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type)),
    
    proofOfAddress: Yup.mixed()
      .required('Le justificatif de domicile est requis')
      .test('fileSize', 'Le fichier est trop volumineux (max 5MB)', 
        value => value && value.size <= 5 * 1024 * 1024)
      .test('fileType', 'Format non supporté (JPG, PNG ou PDF uniquement)', 
        value => value && ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type)),
    
    schoolPhotos: Yup.array()
      .min(1, 'Au moins une photo de l\'établissement est requise')
      .max(5, 'Maximum 5 photos autorisées')
      .test('fileSize', 'Un ou plusieurs fichiers sont trop volumineux (max 5MB chacun)', 
        value => value && value.every(file => file.size <= 5 * 1024 * 1024))
      .test('fileType', 'Format non supporté (JPG ou PNG uniquement)', 
        value => value && value.every(file => ['image/jpeg', 'image/png'].includes(file.type)))
  });

  // Charger le statut KYC actuel
  useEffect(() => {
    const loadKYCStatus = async () => {
      try {
        setLoading(true);
        const { status, rejectionReason } = await getKYCStatus();
        setKycStatus(status);
        setRejectionReason(rejectionReason);
      } catch (error) {
        console.error('Erreur lors du chargement du statut KYC:', error);
        setError('Impossible de charger votre statut de vérification. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadKYCStatus();
  }, []);

  // Soumission du formulaire
  const handleSubmit = async (values: KYCFormValues) => {
    try {
      setSubmitting(true);
      setError(null);

      // Créer un FormData pour l'upload des fichiers
      const formData = new FormData();
      
      if (values.idCard) {
        formData.append('idCard', values.idCard);
      }
      
      if (values.schoolAuthorization) {
        formData.append('schoolAuthorization', values.schoolAuthorization);
      }
      
      if (values.proofOfAddress) {
        formData.append('proofOfAddress', values.proofOfAddress);
      }
      
      values.schoolPhotos.forEach((photo, index) => {
        formData.append(`schoolPhotos[${index}]`, photo);
      });
      
      values.additionalDocuments.forEach((doc, index) => {
        formData.append(`additionalDocuments[${index}]`, doc);
      });

      // Envoyer les documents
      await uploadKYCDocuments(formData);
      
      // Mettre à jour le statut
      setKycStatus(KYCStatus.SUBMITTED);
      setSuccess(true);
      
      // Rediriger après un court délai
      setTimeout(() => {
        navigate('/school/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi des documents KYC:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'envoi des documents. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Rendu en fonction du statut KYC
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
          <p>Chargement de votre statut de vérification...</p>
        </div>
      );
    }

    // Si le KYC est déjà soumis ou approuvé
    if ([KYCStatus.SUBMITTED, KYCStatus.UNDER_REVIEW, KYCStatus.APPROVED].includes(kycStatus)) {
      return (
        <div className="kyc-status-container">
          <KYCStatusBadge status={kycStatus} />
          
          <div className="kyc-message">
            {kycStatus === KYCStatus.SUBMITTED && (
              <>
                <h3>Documents soumis avec succès</h3>
                <p>
                  Nous avons bien reçu vos documents. Notre équipe va les examiner dans les plus brefs délais.
                  Vous recevrez une notification par email dès que la vérification sera terminée.
                </p>
              </>
            )}
            
            {kycStatus === KYCStatus.UNDER_REVIEW && (
              <>
                <h3>Vérification en cours</h3>
                <p>
                  Vos documents sont en cours d'examen par notre équipe. Ce processus peut prendre jusqu'à 48 heures ouvrables.
                  Vous recevrez une notification par email dès que la vérification sera terminée.
                </p>
              </>
            )}
            
            {kycStatus === KYCStatus.APPROVED && (
              <>
                <h3>Vérification approuvée</h3>
                <p>
                  Félicitations ! Votre école a été vérifiée avec succès.
                  Vous avez maintenant accès à toutes les fonctionnalités de la plateforme.
                </p>
                <button 
                  className="btn btn-primary mt-3"
                  onClick={() => navigate('/school/dashboard')}
                >
                  Accéder au tableau de bord
                </button>
              </>
            )}
          </div>
        </div>
      );
    }

    // Si le KYC a été rejeté
    if (kycStatus === KYCStatus.REJECTED) {
      return (
        <div className="kyc-status-container rejected">
          <KYCStatusBadge status={kycStatus} />
          
          <div className="kyc-message">
            <h3>Vérification rejetée</h3>
            <p>
              Malheureusement, votre vérification a été rejetée pour la raison suivante :
            </p>
            <div className="rejection-reason">
              {rejectionReason || "Raison non spécifiée. Veuillez contacter notre support."}
            </div>
            <p>
              Veuillez soumettre à nouveau vos documents en tenant compte des remarques ci-dessus.
            </p>
          </div>
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {renderForm}
          </Formik>
        </div>
      );
    }

    // Statut par défaut : PENDING (formulaire initial)
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {renderForm}
      </Formik>
    );
  };

  // Rendu du formulaire
  const renderForm = ({ values, errors, touched, setFieldValue, isValid }) => (
    <Form className="kyc-form">
      <div className="document-section">
        <h3>Documents obligatoires</h3>
        
        <div className="form-group">
          <label htmlFor="idCard">Pièce d'identité du promoteur *</label>
          <FileUploader
            id="idCard"
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5 * 1024 * 1024}
            file={values.idCard}
            error={errors.idCard && touched.idCard ? errors.idCard : null}
            onChange={(file) => setFieldValue('idCard', file)}
          />
          <small className="form-text text-muted">
            Carte d'identité, passeport ou permis de conduire (JPG, PNG ou PDF, max 5MB)
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="schoolAuthorization">Autorisation d'ouverture d'école *</label>
          <FileUploader
            id="schoolAuthorization"
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5 * 1024 * 1024}
            file={values.schoolAuthorization}
            error={errors.schoolAuthorization && touched.schoolAuthorization ? errors.schoolAuthorization : null}
            onChange={(file) => setFieldValue('schoolAuthorization', file)}
          />
          <small className="form-text text-muted">
            Document officiel d'autorisation délivré par les autorités compétentes (JPG, PNG ou PDF, max 5MB)
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="proofOfAddress">Justificatif de domicile *</label>
          <FileUploader
            id="proofOfAddress"
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5 * 1024 * 1024}
            file={values.proofOfAddress}
            error={errors.proofOfAddress && touched.proofOfAddress ? errors.proofOfAddress : null}
            onChange={(file) => setFieldValue('proofOfAddress', file)}
          />
          <small className="form-text text-muted">
            Facture d'électricité, d'eau ou contrat de bail (JPG, PNG ou PDF, max 5MB)
          </small>
        </div>
        
        <div className="form-group">
          <label htmlFor="schoolPhotos">Photos de l'établissement *</label>
          <FileUploader
            id="schoolPhotos"
            accept=".jpg,.jpeg,.png"
            maxSize={5 * 1024 * 1024}
            multiple={true}
            files={values.schoolPhotos}
            error={errors.schoolPhotos && touched.schoolPhotos ? errors.schoolPhotos : null}
            onChange={(files) => setFieldValue('schoolPhotos', files)}
            maxFiles={5}
          />
          <small className="form-text text-muted">
            Au moins une photo de l'établissement (façade, salles de classe, etc.) (JPG ou PNG, max 5MB chacune)
          </small>
        </div>
      </div>
      
      <div className="document-section">
        <h3>Documents supplémentaires (facultatifs)</h3>
        
        <div className="form-group">
          <label htmlFor="additionalDocuments">Documents supplémentaires</label>
          <FileUploader
            id="additionalDocuments"
            accept=".jpg,.jpeg,.png,.pdf"
            maxSize={5 * 1024 * 1024}
            multiple={true}
            files={values.additionalDocuments}
            onChange={(files) => setFieldValue('additionalDocuments', files)}
            maxFiles={3}
          />
          <small className="form-text text-muted">
            Tout autre document pertinent pour votre dossier (JPG, PNG ou PDF, max 5MB chacun)
          </small>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" role="alert">
          Documents soumis avec succès ! Vous allez être redirigé vers votre tableau de bord...
        </div>
      )}
      
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={submitting || !isValid}
        >
          {submitting ? 'Envoi en cours...' : 'Soumettre les documents'}
        </button>
      </div>
      
      <div className="kyc-info-box">
        <div className="info-icon">
          <i className="fas fa-shield-alt"></i>
        </div>
        <div className="info-content">
          <p>
            La vérification KYC (Know Your Customer) est une étape obligatoire pour garantir
            la sécurité et la conformité de notre plateforme. Vos documents seront traités
            de manière confidentielle et sécurisée.
          </p>
        </div>
      </div>
    </Form>
  );

  return (
    <div className="kyc-verification-container">
      <div className="kyc-header">
        <h2>Vérification KYC</h2>
        <p>
          Pour activer complètement votre compte, veuillez fournir les documents requis
          pour la vérification de votre identité et de votre établissement.
        </p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default KYCVerificationForm;
