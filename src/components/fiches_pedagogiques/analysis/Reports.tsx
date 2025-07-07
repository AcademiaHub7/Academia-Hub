import React, { useState } from 'react';
import { FileText, Calendar, TrendingUp, TrendingDown, Download, Printer } from 'lucide-react';

interface Report {
  id: string;
  type: 'annual' | 'titularization' | 'portfolio' | 'endOfYear' | 'inspection';
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'completed';
  lastUpdated: string;
  size: number;
}

interface ReportFilter {
  type: string[];
  status: string[];
  dateRange: [string, string];
}

interface ReportsProps {
  reports: Report[];
  onExport: (report: Report) => void;
  onPrint: (report: Report) => void;
}

const Reports: React.FC<ReportsProps> = ({ reports, onExport, onPrint }) => {
  const [filters, setFilters] = useState<ReportFilter>({
    type: [],
    status: [],
    dateRange: ['', '']
  });

  // Types de rapports
  const reportTypes = {
    annual: {
      icon: Calendar,
      label: 'Rapport annuel'
    },
    titularization: {
      icon: FileText,
      label: 'Dossier de titularisation'
    },
    portfolio: {
      icon: FileText,
      label: 'Portfolio pédagogique'
    },
    endOfYear: {
      icon: Calendar,
      label: 'Bilan de fin d\'année'
    },
    inspection: {
      icon: FileText,
      label: 'Rapport d\'inspection'
    }
  };

  // Statuts
  const reportStatus = {
    draft: {
      color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300',
      label: 'Brouillon'
    },
    pending: {
      color: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300',
      label: 'En attente'
    },
    completed: {
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
      label: 'Terminé'
    }
  };

  // Filtrer les rapports
  const filteredReports = reports.filter(report =>
    (!filters.type.length || filters.type.includes(report.type)) &&
    (!filters.status.length || filters.status.includes(report.status)) &&
    (!filters.dateRange[0] || new Date(report.lastUpdated) >= new Date(filters.dateRange[0])) &&
    (!filters.dateRange[1] || new Date(report.lastUpdated) <= new Date(filters.dateRange[1]))
  );

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <Filter className="w-5 h-5 inline-block mr-2" />
          Filtres
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Types de rapports */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type de rapport
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reportTypes).map(([type, { icon: Icon, label }]) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      type: prev.type.includes(type)
                        ? prev.type.filter(t => t !== type)
                        : [...prev.type, type]
                    }));
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.type.includes(type)
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4 inline-block mr-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Statuts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Statut
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reportStatus).map(([status, { label }]) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      status: prev.status.includes(status)
                        ? prev.status.filter(s => s !== status)
                        : [...prev.status, status]
                    }));
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.status.includes(status)
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Période
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={filters.dateRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: [e.target.value, prev.dateRange[1]]
                }))}
                className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              />
              <input
                type="date"
                value={filters.dateRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: [prev.dateRange[0], e.target.value]
                }))}
                className="rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des rapports */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {report.title}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onExport(report)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Download className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => onPrint(report)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Printer className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
              <reportTypes[report.type].icon className="w-4 h-4 inline-block mr-1" />
              {reportTypes[report.type].label}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {report.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Dernière mise à jour:</span>
                <span className="font-medium">
                  {new Date(report.lastUpdated).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  reportStatus[report.status].color
                }`}
              >
                {reportStatus[report.status].label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
