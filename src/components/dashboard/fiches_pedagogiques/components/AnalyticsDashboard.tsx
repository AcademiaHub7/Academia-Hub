import React, { useState, useEffect } from 'react';
import { Fiche } from '../types/Fiche';
import {
  FicheStats,
  PedagogicalAnalysis,
  AdministrativeReport,
  ExportOptions,
  ReportProgress,
  ReportStatus
} from '../types/AnalyticsTypes';
import { AnalyticsService } from '../services/AnalyticsService';
import './AnalyticsDashboard.css';

interface AnalyticsDashboardProps {
  fiches: Fiche[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ fiches }) => {
  const [stats, setStats] = useState<FicheStats | null>(null);
  const [analysis, setAnalysis] = useState<PedagogicalAnalysis | null>(null);
  const [report, setReport] = useState<AdministrativeReport | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    type: 'annual',
    includeDetails: true,
    format: 'pdf'
  });
  const [exportProgress, setExportProgress] = useState<ReportProgress | null>(null);

  const service = AnalyticsService.getInstance();

  useEffect(() => {
    if (fiches.length > 0) {
      const calculateAnalytics = async () => {
        const stats = service.calculateFicheStats(fiches);
        const analysis = service.analyzePedagogy(fiches);
        const report = service.generateAdministrativeReport(fiches);

        setStats(stats);
        setAnalysis(analysis);
        setReport(report);
      };

      calculateAnalytics();
    }
  }, [fiches, service]);

  const handleExport = async () => {
    if (!exportProgress?.status || exportProgress.status !== ReportStatus.GENERATING) {
      const progress = await service.generateReport(exportOptions);
      setExportProgress(progress);
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="analytics-section">
        <h2>Tableau de bord</h2>
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total des fiches</h3>
              <p>{stats.total}</p>
            </div>
            <div className="stat-card">
              <h3>Moyenne de validation</h3>
              <p>{(stats.averageScore * 100).toFixed(1)}%</p>
            </div>
            <div className="stat-card">
              <h3>Temps moyen de validation</h3>
              <p>{(stats.averageValidationTime / (1000 * 60)).toFixed(1)} min</p>
            </div>
          </div>
        )}
      </div>

      <div className="analytics-section">
        <h2>Analyse pédagogique</h2>
        {analysis && (
          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>Distribution des compétences</h3>
              <div className="distribution-chart">
                <div className="chart-section" style={{ width: `${(analysis.competenceDistribution.cognitive / fiches.length) * 100}%` }}>
                  <span>Cognitive</span>
                </div>
                <div className="chart-section" style={{ width: `${(analysis.competenceDistribution.procedural / fiches.length) * 100}%` }}>
                  <span>Procédurale</span>
                </div>
                <div className="chart-section" style={{ width: `${(analysis.competenceDistribution.attitudinal / fiches.length) * 100}%` }}>
                  <span>Attitudinale</span>
                </div>
              </div>
            </div>
            <div className="analysis-card">
              <h3>Stratégies d'enseignement</h3>
              <div className="strategies-list">
                <div>
                  <span>Direct</span>
                  <span>{analysis.teachingStrategies.direct}</span>
                </div>
                <div>
                  <span>Collaboratif</span>
                  <span>{analysis.teachingStrategies.collaborative}</span>
                </div>
                <div>
                  <span>Enquête</span>
                  <span>{analysis.teachingStrategies.inquiry}</span>
                </div>
                <div>
                  <span>Projet</span>
                  <span>{analysis.teachingStrategies.project}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="analytics-section">
        <h2>Administration</h2>
        {report && (
          <div className="report-grid">
            <div className="report-card">
              <h3>Taux de préparation</h3>
              <p>{report.preparationRate.toFixed(1)}%</p>
            </div>
            <div className="report-card">
              <h3>Conformité aux programmes</h3>
              <p>{report.programCompliance.toFixed(1)}%</p>
            </div>
            <div className="report-card">
              <h3>Qualité pédagogique</h3>
              <p>{(report.averagePedagogicalQuality * 100).toFixed(1)}%</p>
            </div>
          </div>
        )}
      </div>

      <div className="analytics-section">
        <h2>Export</h2>
        <div className="export-form">
          <label htmlFor="reportType" className="sr-only">Type de rapport</label>
          <select
            id="reportType"
            value={exportOptions.type}
            onChange={(e) => setExportOptions(prev => ({ ...prev, type: e.target.value as ExportOptions['type'] }))}
            aria-label="Type de rapport à exporter"
          >
            <option value="annual">Rapport annuel</option>
            <option value="titularization">Dossier de titularisation</option>
            <option value="portfolio">Portfolio pédagogique</option>
            <option value="yearly">Bilan de fin d'année</option>
            <option value="inspection">Rapport d'inspection</option>
          </select>

          <label htmlFor="reportFormat" className="sr-only">Format</label>
          <select
            id="reportFormat"
            value={exportOptions.format}
            onChange={(e) => setExportOptions(prev => ({ ...prev, format: e.target.value as ExportOptions['format'] }))}
            aria-label="Format du rapport"
          >
            <option value="pdf">PDF</option>
            <option value="docx">Word</option>
            <option value="html">HTML</option>
          </select>

          <button
            onClick={handleExport}
            disabled={exportProgress?.status === ReportStatus.GENERATING}
            aria-label="Générer le rapport"
          >
            {exportProgress?.status === ReportStatus.GENERATING ? 'Génération...' : 'Générer'}
          </button>
          {exportProgress?.status === ReportStatus.ERROR && (
            <div className="error-message" role="alert">{exportProgress.message}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
