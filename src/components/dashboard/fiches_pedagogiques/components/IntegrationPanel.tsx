import React, { useState, useEffect } from 'react';
import {
  IntegrationStatus,
  IntegrationAlert
} from '../types/IntegrationTypes';
import { IntegrationService } from '../services/IntegrationService';
import { Fiche } from '../types/Fiche';
import './IntegrationPanel.css';

interface IntegrationPanelProps {
  fiche: Fiche;
}

const IntegrationPanel: React.FC<IntegrationPanelProps> = ({ fiche }) => {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [alerts, setAlerts] = useState<IntegrationAlert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const service = IntegrationService.getInstance();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const status = service.getStatus();
        setStatus(status);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
      }
    };

    const getAlerts = async () => {
      try {
        const alerts = service.getAlerts();
        setAlerts(alerts);
      } catch (error) {
        console.error('Erreur lors de la récupération des alertes:', error);
      }
    };

    getStatus();
    getAlerts();

    // Mettre à jour périodiquement
    const interval = setInterval(() => {
      getStatus();
      getAlerts();
    }, 5000);

    return () => clearInterval(interval);
  }, [service]);

  const handleSync = async () => {
    try {
      await service.syncWithJournal(fiche);
      await service.syncWithTextbook(fiche);
      await service.syncWithSchedule(fiche);
      setStatus(service.getStatus());
      setAlerts(service.getAlerts());
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      // Ajouter une alerte pour l'erreur
      const errorAlert: IntegrationAlert = {
        type: 'modification',
        severity: 'error',
        message: 'Erreur lors de la synchronisation',
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        timestamp: new Date()
      };
      service.addAlert(errorAlert);
      setAlerts([...alerts, errorAlert]);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status) {
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="integration-panel">
      <div className="integration-header">
        <h2>Intégration des systèmes</h2>
        <button
          onClick={handleSync}
          className="sync-button"
          aria-label="Synchroniser les systèmes"
          disabled={status?.journal.status === 'pending' ||
                    status?.textbook.status === 'pending' ||
                    status?.schedule.status === 'pending'}
        >
          {status?.journal.status === 'pending' ||
           status?.textbook.status === 'pending' ||
           status?.schedule.status === 'pending'
            ? 'Synchronisation en cours...'
            : 'Synchroniser'}
        </button>
      </div>

      <div className="integration-status">
        <div className="status-section">
          <h3>Cahier journal</h3>
          <div
            className={`status-badge ${getStatusColor(status?.journal.status)}`}
          >
            {status?.journal.status || 'non connecté'}
          </div>
          <p>{status?.journal.lastSync ? 
            `Dernière synchro: ${new Date(status?.journal.lastSync).toLocaleString()}` :
            'Jamais synchronisé'}</p>
        </div>

        <div className="status-section">
          <h3>Cahier de texte</h3>
          <div
            className={`status-badge ${getStatusColor(status?.textbook.status)}`}
          >
            {status?.textbook.status || 'non connecté'}
          </div>
          <p>{status?.textbook.lastSync ? 
            `Dernière synchro: ${new Date(status?.textbook.lastSync).toLocaleString()}` :
            'Jamais synchronisé'}</p>
        </div>

        <div className="status-section">
          <h3>Emploi du temps</h3>
          <div
            className={`status-badge ${getStatusColor(status?.schedule.status)}`}
          >
            {status?.schedule.status || 'non connecté'}
          </div>
          <p>{status?.schedule.lastSync ? 
            `Dernière synchro: ${new Date(status?.schedule.lastSync).toLocaleString()}` :
            'Jamais synchronisé'}</p>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="alerts-section">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="alerts-toggle"
            aria-label="Afficher/Masquer les alertes"
          >
            {showAlerts ? 'Masquer les alertes' : `Afficher ${alerts.length} alertes`}
          </button>

          {showAlerts && (
            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`alert-item ${getAlertSeverityColor(alert.severity)}`}
                  role="alert"
                >
                  <div className="alert-header">
                    <span className="alert-type">{alert.type}</span>
                    <span className="alert-severity">{alert.severity}</span>
                  </div>
                  <div className="alert-content">
                    <p>{alert.message}</p>
                    <p className="alert-details">{JSON.stringify(alert.details)}</p>
                    <p className="alert-timestamp">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IntegrationPanel;
