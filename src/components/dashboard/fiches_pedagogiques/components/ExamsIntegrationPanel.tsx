import React, { useState, useEffect } from 'react';
import {
  ExamIntegrationStatus,
  AssessmentAnalysis,
  CompetencyProgress,
  ProgressTrend,
  Fiche
} from '../types/ExamsIntegrationTypes';
import { ExamsIntegrationService } from '../services/ExamsIntegrationService';
import '../components/IntegrationPanel.css';

interface ExamsIntegrationPanelProps {
  fiche: Fiche;
}

const ExamsIntegrationPanel: React.FC<ExamsIntegrationPanelProps> = ({ fiche }) => {
  const [status, setStatus] = useState<ExamIntegrationStatus | null>(null);
  const [analysis, setAnalysis] = useState<AssessmentAnalysis | null>(null);
  const [progress, setProgress] = useState<Record<string, CompetencyProgress>>({});
  const [showAnalysis, setShowAnalysis] = useState(false);
  const service = ExamsIntegrationService.getInstance();

  useEffect(() => {
    const updateStatus = async () => {
      try {
        const status = service.getStatus();
        setStatus(status);
      } catch (error) {
        console.error('Erreur lors de la récupération du statut:', error);
      }
    };

    const updateAnalysis = async () => {
      try {
        const analysis = await service.analyzeAssessments();
        setAnalysis(analysis);
      } catch (error) {
        console.error('Erreur lors de l'analyse:', error);
      }
    };

    const updateProgress = async () => {
      try {
        const progress = await service.trackCompetencyProgress();
        setProgress(progress);
      } catch (error) {
        console.error('Erreur lors du suivi de la progression:', error);
      }
    };

    // Initialisation
    updateStatus();
    updateAnalysis();
    updateProgress();

    // Mise à jour périodique
    const interval = setInterval(() => {
      updateStatus();
      updateAnalysis();
      updateProgress();
    }, 5000);

    return () => clearInterval(interval);
  }, [service]);

  const handleSync = async () => {
    try {
      await service.syncWithAssessments(fiche);
      await service.trackCompetencyProgress();
      await service.analyzeAssessments();
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      // Ajouter une alerte pour l'erreur
      if (status) {
        status.warnings = [...(status.warnings || []), `Erreur de synchronisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`];
        setStatus({ ...status });
      }
    }
  };

  const getStatusColor = (value: number, total: number): string => {
    if (total === 0) return 'bg-gray-100 text-gray-800';
    const ratio = value / total;
    if (ratio >= 0.8) return 'bg-green-100 text-green-800';
    if (ratio >= 0.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getTrendIcon = (direction: ProgressTrend['direction']): string => {
    switch (direction) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="integration-panel">
      <div className="integration-header">
        <h2>Gestion des Notes</h2>
        <button
          onClick={handleSync}
          className="sync-button"
          aria-label="Synchroniser les notes"
          disabled={
            status?.assessments?.pending > 0 ||
            status?.grades?.pending > 0
          }
        >
          {status?.assessments?.pending > 0 ||
           status?.grades?.pending > 0
            ? 'Synchronisation en cours...'
            : 'Synchroniser'}
        </button>
      </div>

      <div className="exams-status">
        <div className="status-section">
          <h3>Évaluations</h3>
          <div className="status-grid">
            <div className="status-item">
              <span>Planifiées</span>
              <span className={getStatusColor(
                status?.assessments?.planned || 0,
                (status?.assessments?.planned || 0) +
                (status?.assessments?.completed || 0) +
                (status?.assessments?.pending || 0)
              )}>
                {status?.assessments?.planned || 0}
              </span>
            </div>
            <div className="status-item">
              <span>En cours</span>
              <span className={getStatusColor(
                status?.assessments?.pending || 0,
                (status?.assessments?.planned || 0) +
                (status?.assessments?.completed || 0) +
                (status?.assessments?.pending || 0)
              )}>
                {status?.assessments?.pending || 0}
              </span>
            </div>
            <div className="status-item">
              <span>Terminées</span>
              <span className={getStatusColor(
                status?.assessments?.completed || 0,
                (status?.assessments?.planned || 0) +
                (status?.assessments?.completed || 0) +
                (status?.assessments?.pending || 0)
              )}>
                {status?.assessments?.completed || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="status-section">
          <h3>Notes</h3>
          <div className="status-grid">
            <div className="status-item">
              <span>Total</span>
              <span>{status?.grades?.total || 0}</span>
            </div>
            <div className="status-item">
              <span>Validées</span>
              <span className={getStatusColor(
                status?.grades?.validated || 0,
                status?.grades?.total || 1
              )}>
                {status?.grades?.validated || 0}
              </span>
            </div>
            <div className="status-item">
              <span>En attente</span>
              <span className={getStatusColor(
                status?.grades?.pending || 0,
                status?.grades?.total || 1
              )}>
                {status?.grades?.pending || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="exams-analysis">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="analysis-toggle"
          aria-label="Afficher/Masquer l'analyse"
        >
          {showAnalysis ? 'Masquer l'analyse' : 'Afficher l'analyse'}
        </button>

        {showAnalysis && (
          <div className="analysis-content">
            <div className="coverage-section">
              <h3>Couverture</h3>
              <div className="coverage-grid">
                <div className="coverage-item">
                  <span>Compétences</span>
                  <span>{status?.coverage?.competencies || 0}</span>
                </div>
                <div className="coverage-item">
                  <span>Critères</span>
                  <span>{status?.coverage?.criteria || 0}</span>
                </div>
                <div className="coverage-item">
                  <span>Rubriques</span>
                  <span>{status?.coverage?.rubrics || 0}</span>
                </div>
              </div>
            </div>

            {Object.entries(progress).length > 0 && (
              <div className="progress-section">
                <h3>Progression des compétences</h3>
                <div className="progress-grid">
                  {Object.entries(progress).map(([competency, data]) => (
                    <div key={competency} className="progress-item">
                      <h4>{competency}</h4>
                      <div className="trends">
                        {data.trends.map((trend, index) => (
                          <div key={index} className="trend-item">
                            <span className="period">{trend.period}</span>
                            <span className="value">{trend.value.toFixed(2)}</span>
                            <span className="direction">{getTrendIcon(trend.direction)}</span>
                            <span className="comments">{trend.comments}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis && (
              <div className="correlation-section">
                <h3>Corrélations</h3>
                <div className="correlation-grid">
                  {analysis.correlation.map((correlation, index) => (
                    <div key={index} className="correlation-item">
                      <span className="competency">{correlation.competency}</span>
                      <span className="criteria">{correlation.criteria}</span>
                      <span className="correlation-value">
                        {correlation.correlation.toFixed(2)}
                      </span>
                      <span className="significance">
                        {correlation.significance.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {status?.warnings?.length > 0 && (
        <div className="warnings-section">
          <h3>Alertes</h3>
          <ul className="warnings-list">
            {status.warnings.map((warning, index) => (
              <li key={index} className="warning-item">
                <span className="warning-icon">⚠️</span>
                <span className="warning-message">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExamsIntegrationPanel;
