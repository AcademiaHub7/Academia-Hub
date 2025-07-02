/**
 * Composant de vérification KYC pour le processus d'inscription
 * @module components/registration/steps/KycVerification
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Eye, CheckCircle, AlertTriangle, Loader, ArrowLeft } from 'lucide-react';
import { registrationService } from '../../../services/registration/registrationService';
import { KycVerificationProps } from './StepProps';
import { RegistrationSession } from '../../../types/registration';

/**
 * Types de documents requis pour la vérification KYC
 */
type DocumentType = 'idCard' | 'addressProof' | 'businessRegistration' | 'openingAuthorization';

/**
 * Structure d'un document KYC
 */
interface KycDocument {
  type: DocumentType;
  file: File | null;
  preview: string | null;
  uploaded: boolean;
  uploading: boolean;
  error: string | null;
  required: boolean;
  documentId?: string;
}

/**
 * Composant de vérification KYC guidée (5-10 minutes)
 */
const KycVerification: React.FC<KycVerificationProps> = ({
  sessionData,
  updateSessionData,
  goToNextStep, 
  goToPreviousStep,
  saveSession
}) => {
  // État des documents
  const [documents, setDocuments] = useState<Record<DocumentType, KycDocument>>(() => ({
    idCard: {
      type: 'idCard',
      file: null,
      preview: null,
      uploaded: false,
      uploading: false,
      error: null,
      required: true,
    },
    addressProof: {
      type: 'addressProof',
      file: null,
      preview: null,
      uploaded: false,
      uploading: false,
      error: null,
      required: true,
    },
    businessRegistration: {
      type: 'businessRegistration',
      file: null,
      preview: null,
      uploaded: false,
      uploading: false,
      error: null,
      required: true,
    },
    openingAuthorization: {
      type: 'openingAuthorization',
      file: null,
      preview: null,
      uploaded: false,
      uploading: false,
      error: null,
      required: true,
    },
  }));
  
  // État global du composant
  const [allDocumentsUploaded, setAllDocumentsUploaded] = useState<boolean>(false);
  const [currentPreview, setCurrentPreview] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const fileInputRefs = useRef<Record<DocumentType, HTMLInputElement | null>>({
    idCard: null,
    addressProof: null,
    businessRegistration: null,
    openingAuthorization: null,
  });
  
  // Charger les documents existants depuis la session
  useEffect(() => {
    if (sessionData?.kyc?.documents) {
      const updatedDocuments = { ...documents };
      let allUploaded = true;
      
      Object.entries(sessionData.kyc.documents).forEach(([type, docInfo]) => {
        if (type in updatedDocuments && docInfo.documentId) {
          updatedDocuments[type as DocumentType] = {
            ...updatedDocuments[type as DocumentType],
            uploaded: true,
            documentId: docInfo.documentId,
            preview: docInfo.previewUrl || null,
          };
        } else {
          allUploaded = false;
        }
      });
      
      setDocuments(updatedDocuments);
      setAllDocumentsUploaded(allUploaded);
    }
  }, [sessionData, documents]);
  
  // Vérifier si tous les documents requis sont téléchargés
  useEffect(() => {
    const requiredDocuments = Object.values(documents).filter(doc => doc.required);
    const allUploaded = requiredDocuments.every(doc => doc.uploaded);
    setAllDocumentsUploaded(allUploaded);
  }, [documents]);
  
  // Obtenir le libellé d'un type de document
  const getDocumentLabel = (type: DocumentType): string => {
    switch (type) {
      case 'idCard': return "Pièce d'identité";
      case 'addressProof': return "Justificatif d'adresse";
      case 'businessRegistration': return "Registre de commerce";
      case 'openingAuthorization': return "Autorisation d'ouverture";
      default: return "Document";
    }
  };
  
  // Gérer le changement de fichier
  const handleFileChange = (type: DocumentType, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setDocuments(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            error: "Le fichier est trop volumineux (max 5MB)",
          }
        }));
        return;
      }
      
      // Vérifier le type de fichier
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setDocuments(prev => ({
          ...prev,
          [type]: {
            ...prev[type],
            error: "Format de fichier non supporté (JPG, PNG ou PDF uniquement)",
          }
        }));
        return;
      }
      
      // Créer une URL de prévisualisation
      const previewUrl = URL.createObjectURL(file);
      
      // Mettre à jour l'état du document
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          file,
          preview: previewUrl,
          error: null,
        }
      }));
      
      // Télécharger le document
      uploadDocument(type, file);
    }
  };
  
  // Télécharger un document
  const uploadDocument = async (type: DocumentType, file: File) => {
    try {
      // Mettre à jour l'état pour indiquer le téléchargement en cours
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          uploading: true,
          error: null,
        }
      }));
      
      // Simuler un délai de téléchargement (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simuler une réponse de l'API (à remplacer par un appel API réel)
      const documentId = `doc-${type}-${Date.now()}`;
      
      // Mettre à jour l'état pour indiquer que le téléchargement est terminé
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          uploaded: true,
          uploading: false,
          documentId,
        }
      }));
      
      // Mettre à jour les données de session
      if (sessionData && updateSessionData) {
        const updatedSessionData = {
          ...sessionData,
          kyc: {
            ...sessionData.kyc,
            documents: {
              ...sessionData.kyc?.documents,
              [type]: {
                documentId,
                previewUrl: documents[type].preview,
              }
            }
          }
        };
        updateSessionData(updatedSessionData);
        
        // Sauvegarder la session
        if (saveSession) {
          saveSession(updatedSessionData);
        }
      }
    } catch (error) {
      console.error(`Erreur lors du téléchargement du document ${type}:`, error);
      
      // Mettre à jour l'état pour indiquer l'erreur
      setDocuments(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          uploading: false,
          error: "Erreur lors du téléchargement. Veuillez réessayer.",
        }
      }));
    }
  };
  
  // Supprimer un document
  const removeDocument = (type: DocumentType) => {
    // Libérer l'URL de prévisualisation si elle existe
    if (documents[type].preview) {
      URL.revokeObjectURL(documents[type].preview);
    }
    
    // Réinitialiser l'état du document
    setDocuments(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        file: null,
        preview: null,
        uploaded: false,
        uploading: false,
        error: null,
        documentId: undefined,
      }
    }));
    
    // Mettre à jour les données de session
    if (sessionData && updateSessionData) {
      const updatedKycDocuments = { ...sessionData.kyc?.documents };
      if (updatedKycDocuments && updatedKycDocuments[type]) {
        delete updatedKycDocuments[type];
      }
      
      const updatedSessionData = {
        ...sessionData,
        kyc: {
          ...sessionData.kyc,
          documents: updatedKycDocuments
        }
      };
      
      updateSessionData(updatedSessionData);
      
      // Sauvegarder la session
      if (saveSession) {
        saveSession(updatedSessionData);
      }
    }
  };
  
  // Afficher la prévisualisation d'un document
  const showPreview = (previewUrl: string | null) => {
    if (previewUrl) {
      setCurrentPreview(previewUrl);
    }
  };
  
  // Fermer la prévisualisation
  const closePreview = () => {
    setCurrentPreview(null);
  };
  
  // Soumettre tous les documents pour vérification
  const submitDocuments = async () => {
    try {
      // Vérifier si tous les documents requis sont téléchargés
      const requiredDocuments = Object.values(documents).filter(doc => doc.required);
      const allUploaded = requiredDocuments.every(doc => doc.uploaded);
      
      if (!allUploaded) {
        alert("Veuillez télécharger tous les documents requis avant de soumettre.");
        return;
      }
      
      // Mettre à jour l'état pour indiquer la soumission en cours
      setSubmissionStatus('submitting');
      
      // Simuler un délai de soumission (à remplacer par un appel API réel)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler une réponse de l'API (à remplacer par un appel API réel)
      const success = true;
      
      if (success) {
        // Mettre à jour l'état pour indiquer que la soumission est terminée avec succès
        setSubmissionStatus('success');
        
        // Mettre à jour les données de session
        if (sessionData && updateSessionData) {
          const updatedSessionData = {
            ...sessionData,
            kyc: {
              ...sessionData.kyc,
              submitted: true,
              submissionDate: new Date().toISOString(),
            }
          };
          
          updateSessionData(updatedSessionData);
          
          // Sauvegarder la session
          if (saveSession) {
            saveSession(updatedSessionData);
          }
          
          // Passer à l'étape suivante après un délai
          setTimeout(() => {
            goToNextStep();
          }, 3000);
        }
      } else {
        // Mettre à jour l'état pour indiquer une erreur de soumission
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error("Erreur lors de la soumission des documents:", error);
      
      // Mettre à jour l'état pour indiquer une erreur de soumission
      setSubmissionStatus('error');
    }
  };
  
  // Nettoyer les URL de prévisualisation à la démonter du composant
  useEffect(() => {
    return () => {
      // Libérer toutes les URL de prévisualisation
      Object.values(documents).forEach(doc => {
        if (doc.preview) {
          URL.revokeObjectURL(doc.preview);
        }
      });
    };
  }, [documents]);

  return (
    <motion.div 
      className="kyc-verification-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <style>
        {`
          .preview-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
          }
        `}
      </style>
      <h2 className="step-title">Vérification KYC</h2>
      <p className="step-description">
        Pour finaliser votre inscription, veuillez télécharger les documents requis pour la vérification KYC (Know Your Customer).
      </p>
      
      {submissionStatus === 'success' ? (
        <div className="submission-success">
          <CheckCircle size={48} className="success-icon" />
          <h3>Documents soumis avec succès!</h3>
          <p>Nous avons bien reçu vos documents. Ils seront vérifiés dans les plus brefs délais.</p>
        </div>
      ) : (
        <div className="kyc-form">
          {/* Document: Pièce d'identité */}
          <div className="document-card">
            <h3>{getDocumentLabel('idCard')}</h3>
            <p className="document-description">Carte d'identité nationale, passeport ou permis de conduire.</p>
            
            {documents.idCard.uploaded ? (
              <div className="document-preview-container">
                <div className="document-actions">
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => showPreview(documents.idCard.preview)}
                  >
                    <Eye size={16} className="mr-1" /> Voir
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeDocument('idCard')}
                  >
                    <Trash2 size={16} className="mr-1" /> Supprimer
                  </button>
                </div>
                <div className="document-status">
                  <CheckCircle size={16} className="text-success mr-1" /> Document téléchargé
                </div>
              </div>
            ) : (
              <div className="document-upload-container">
                <input
                  type="file"
                  id="idCard-upload"
                  className="document-input"
                  onChange={(e) => handleFileChange('idCard', e)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  ref={el => fileInputRefs.current.idCard = el}
                  disabled={documents.idCard.uploading}
                  title="Télécharger votre pièce d'identité"
                  placeholder="Télécharger votre pièce d'identité"
                  aria-label="Pièce d'identité"
                />
                <button
                  type="button"
                  className="btn btn-primary upload-btn"
                  onClick={() => fileInputRefs.current.idCard?.click()}
                  disabled={documents.idCard.uploading}
                >
                  {documents.idCard.uploading ? (
                    <>
                      <Loader size={16} className="mr-1 animate-spin" /> Téléchargement...
                    </>
                  ) : (
                    <>
                      <Upload size={16} className="mr-1" /> Télécharger
                    </>
                  )}
                </button>
                {documents.idCard.error && (
                  <div className="document-error">
                    <AlertTriangle size={16} className="mr-1" /> {documents.idCard.error}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal de prévisualisation */}
      {currentPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <button type="button" className="close-btn" onClick={closePreview}>
              &times;
            </button>
            {currentPreview.endsWith('.pdf') ? (
              <iframe 
                src={currentPreview} 
                title="Document Preview" 
                width="100%" 
                height="500px"
              />
            ) : (
              <img 
                src={currentPreview} 
                alt="Document Preview" 
                className="preview-image" 
              />
            )}
          </div>
        </div>
      )}
      
      {/* Boutons de navigation */}
      <div className="step-navigation">
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={goToPreviousStep}
          disabled={submissionStatus === 'submitting'}
        >
          <ArrowLeft size={16} className="mr-1" /> Retour
        </button>
        
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={submitDocuments}
          disabled={!allDocumentsUploaded || submissionStatus === 'submitting'}
        >
          {submissionStatus === 'submitting' ? (
            <>
              <Loader size={16} className="mr-1 animate-spin" /> Soumission en cours...
            </>
          ) : (
            'Soumettre pour vérification'
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default KycVerification;
