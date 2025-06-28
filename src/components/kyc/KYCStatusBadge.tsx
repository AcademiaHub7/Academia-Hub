/**
 * Badge de statut KYC
 * @module components/kyc/KYCStatusBadge
 */

import React from 'react';
import { KYCStatus } from './KYCVerificationForm';

interface KYCStatusBadgeProps {
  status: KYCStatus;
}

/**
 * Composant pour afficher le statut de vérification KYC
 */
const KYCStatusBadge: React.FC<KYCStatusBadgeProps> = ({ status }) => {
  // Déterminer la classe et l'icône en fonction du statut
  const getStatusConfig = () => {
    switch (status) {
      case KYCStatus.PENDING:
        return {
          className: 'badge-warning',
          icon: 'fas fa-clock',
          text: 'En attente'
        };
      case KYCStatus.SUBMITTED:
        return {
          className: 'badge-info',
          icon: 'fas fa-paper-plane',
          text: 'Soumis'
        };
      case KYCStatus.UNDER_REVIEW:
        return {
          className: 'badge-primary',
          icon: 'fas fa-search',
          text: 'En cours de vérification'
        };
      case KYCStatus.APPROVED:
        return {
          className: 'badge-success',
          icon: 'fas fa-check-circle',
          text: 'Approuvé'
        };
      case KYCStatus.REJECTED:
        return {
          className: 'badge-danger',
          icon: 'fas fa-times-circle',
          text: 'Rejeté'
        };
      default:
        return {
          className: 'badge-secondary',
          icon: 'fas fa-question-circle',
          text: 'Inconnu'
        };
    }
  };

  const { className, icon, text } = getStatusConfig();

  return (
    <div className={`kyc-status-badge ${className}`}>
      <i className={icon}></i>
      <span>{text}</span>
    </div>
  );
};

export default KYCStatusBadge;
