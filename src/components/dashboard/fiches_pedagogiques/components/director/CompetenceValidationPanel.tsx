import React from 'react';
import { 
  CompetenceValidationResult,
  CompetenceAnalysis,
  ActivityAnalysis,
  PedagogicalAnalysis
} from '../../types/CompetenceValidationTypes';
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react';

interface CompetenceValidationPanelProps {
  validation: CompetenceValidationResult;
  onCommentAdd: (comment: string) => void;
  onCodeSelect: (code: string) => void;
}

const CompetenceValidationPanel: React.FC<CompetenceValidationPanelProps> = ({
  validation,
  onCommentAdd,
  onCodeSelect
}) => {
  const { competences, activities, pedagogicalAnalysis } = validation.validation;

  const renderCompetenceAnalysis = () => {
    return competences.map((comp, index) => (
      <div key={index} className="competence-analysis">
        <h3>{comp.type.charAt(0).toUpperCase() + comp.type.slice(1)}</h3>
        <div className="analysis-result">
          <span className={`status ${comp.present ? 'success' : 'error'}`}>
            {comp.present ? <CheckCircle2 /> : <XCircle />}
          </span>
          <span className="score">Score: {comp.score}</span>
          {comp.recommendations.length > 0 && (
            <div className="recommendations">
              {comp.recommendations.map((rec, i) => (
                <div key={i} className="recommendation">
                  <Info className="icon" />
                  {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderActivityAnalysis = () => {
    return activities.map((activity, index) => (
      <div key={index} className="activity-analysis">
        <h4>Activité {index + 1}</h4>
        <div className="activity-details">
          <div className="validation-status">
            <span className={`status ${activity.durationValid ? 'success' : 'error'}`}>
              Durée: {activity.durationValid ? <CheckCircle2 /> : <XCircle />}
            </span>
            <span className={`status ${activity.materialValid ? 'success' : 'error'}`}>
              Matériel: {activity.materialValid ? <CheckCircle2 /> : <XCircle />}
            </span>
            <span className={`status ${activity.phaseValid ? 'success' : 'error'}`}>
              Phase: {activity.phaseValid ? <CheckCircle2 /> : <XCircle />}
            </span>
          </div>
          {activity.recommendations.length > 0 && (
            <div className="recommendations">
              {activity.recommendations.map((rec, i) => (
                <div key={i} className="recommendation">
                  <Info className="icon" />
                  {rec}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const renderPedagogicalAnalysis = () => {
    const { coherenceScore, progressionScore, taxonomicLevel, evaluationScore } = pedagogicalAnalysis;
    return (
      <div className="pedagogical-analysis">
        <h3>Analyse Pédagogique</h3>
        <div className="analysis-metrics">
          <div className="metric">
            <span className="label">Cohérence</span>
            <span className="value">{Math.round(coherenceScore * 100)}%</span>
          </div>
          <div className="metric">
            <span className="label">Progression</span>
            <span className="value">{Math.round(progressionScore * 100)}%</span>
          </div>
          <div className="metric">
            <span className="label">Niveau Taxonomique</span>
            <span className="value">{taxonomicLevel}</span>
          </div>
          <div className="metric">
            <span className="label">Évaluation</span>
            <span className="value">{Math.round(evaluationScore * 100)}%</span>
          </div>
        </div>
        {pedagogicalAnalysis.recommendations.length > 0 && (
          <div className="recommendations">
            {pedagogicalAnalysis.recommendations.map((rec, i) => (
              <div key={i} className="recommendation">
                <Info className="icon" />
                {rec}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSuggestions = () => {
    const { improvements, alternatives, methodological, warnings } = validation.suggestions;
    return (
      <div className="suggestions">
        <h3>Suggestions et Recommandations</h3>
        {improvements.length > 0 && (
          <div className="section">
            <h4>Améliorations possibles</h4>
            <ul>
              {improvements.map((imp, i) => (
                <li key={i}>{imp}</li>
              ))}
            </ul>
          </div>
        )}
        {alternatives.length > 0 && (
          <div className="section">
            <h4>Alternatives proposées</h4>
            <ul>
              {alternatives.map((alt, i) => (
                <li key={i}>{alt}</li>
              ))}
            </ul>
          </div>
        )}
        {methodological.length > 0 && (
          <div className="section">
            <h4>Recommandations méthodologiques</h4>
            <ul>
              {methodological.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
        {warnings.length > 0 && (
          <div className="section">
            <h4>Alertes et avertissements</h4>
            <ul>
              {warnings.map((warn, i) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="competence-validation-panel">
      <h2>Validation par Compétences</h2>
      <div className="validation-content">
        <div className="competence-section">
          <h3>Analyse des Compétences</h3>
          {renderCompetenceAnalysis()}
        </div>
        <div className="activity-section">
          <h3>Analyse des Activités</h3>
          {renderActivityAnalysis()}
        </div>
        <div className="pedagogical-section">
          {renderPedagogicalAnalysis()}
        </div>
        <div className="suggestions-section">
          {renderSuggestions()}
        </div>
      </div>
    </div>
  );
};

export default CompetenceValidationPanel;
