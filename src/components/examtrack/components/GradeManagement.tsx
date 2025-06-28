import React, { useState, useEffect } from 'react';
import { Save, UploadCloud, DownloadCloud, Check, X, AlertTriangle } from 'lucide-react';
import { GradeService } from '../services/gradeService';
import { ExamService } from '../services/examService';
import { Grade, GradeStatus, Exam } from '../types';

const GradeManagement: React.FC = () => {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Récupérer les examens lors du chargement initial
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const examsData = await ExamService.getExams();
        setExams(examsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setError('Impossible de charger les examens');
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  // Récupérer les notes lorsqu'un examen est sélectionné
  useEffect(() => {
    if (!selectedExam) return;

    const fetchGrades = async () => {
      try {
        setLoading(true);
        const gradesData = await GradeService.getGradesByExam(selectedExam);
        setGrades(gradesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError('Impossible de charger les notes');
        setLoading(false);
      }
    };

    fetchGrades();
  }, [selectedExam]);

  const handleExamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (isDirty) {
      if (window.confirm('Vous avez des modifications non sauvegardées. Voulez-vous continuer ?')) {
        setSelectedExam(e.target.value);
        setIsDirty(false);
      }
    } else {
      setSelectedExam(e.target.value);
    }
  };

  const handleGradeChange = (studentId: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const updatedGrades = grades.map(grade => 
      grade.studentId === studentId ? { ...grade, score: numValue } : grade
    );

    setGrades(updatedGrades);
    setIsDirty(true);
  };

  const handleSaveGrades = async () => {
    try {
      setLoading(true);

      // Dans une application réelle, ceci devrait être remplacé par un appel API
      // qui met à jour toutes les notes en une seule requête
      for (const grade of grades) {
        await GradeService.updateGrade(grade.id, { score: grade.score });
      }

      setIsDirty(false);
      setSuccessMessage('Notes sauvegardées avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
      setLoading(false);
    } catch (err) {
      console.error('Error saving grades:', err);
      setError('Impossible de sauvegarder les notes');
      setLoading(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleImportGrades = async () => {
    if (!importFile || !selectedExam) return;

    try {
      setLoading(true);
      await GradeService.importGrades(selectedExam, importFile);
      
      // Recharger les notes après l'importation
      const gradesData = await GradeService.getGradesByExam(selectedExam);
      setGrades(gradesData);
      
      setSuccessMessage('Notes importées avec succès');
      setTimeout(() => setSuccessMessage(null), 3000);
      setImportFile(null);
      setLoading(false);
    } catch (err) {
      console.error('Error importing grades:', err);
      setError('Impossible d\'importer les notes');
      setLoading(false);
    }
  };

  const handleExportGrades = async () => {
    if (!selectedExam) return;

    try {
      setLoading(true);
      const blob = await GradeService.exportGrades(selectedExam, 'excel');
      
      // Créer un URL pour le téléchargement
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `notes_examen_${selectedExam}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setLoading(false);
    } catch (err) {
      console.error('Error exporting grades:', err);
      setError('Impossible d\'exporter les notes');
      setLoading(false);
    }
  };

  const getStatusLabel = (status: GradeStatus) => {
    switch (status) {
      case GradeStatus.DRAFT: return 'Brouillon';
      case GradeStatus.SUBMITTED: return 'Soumis';
      case GradeStatus.VALIDATED: return 'Validé';
      case GradeStatus.PUBLISHED: return 'Publié';
      case GradeStatus.CONTESTED: return 'Contesté';
      default: return status;
    }
  };

  const getStatusColor = (status: GradeStatus) => {
    switch (status) {
      case GradeStatus.DRAFT:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case GradeStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case GradeStatus.VALIDATED:
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case GradeStatus.PUBLISHED:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case GradeStatus.CONTESTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading && !grades.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Gestion des Notes</h1>
        
        <div className="flex items-center space-x-2">
          {isDirty && (
            <div className="text-amber-500 dark:text-amber-400 flex items-center text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Modifications non sauvegardées
            </div>
          )}
          
          <button 
            onClick={handleSaveGrades}
            disabled={!isDirty}
            className={`inline-flex items-center px-4 py-2 ${
              isDirty 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } text-white rounded-md shadow-sm transition-colors`}
          >
            <Save className="h-5 w-5 mr-2" />
            Enregistrer
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <X className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>
            <p>{error}</p>
            <button 
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              onClick={() => setError(null)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-start">
          <Check className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with exam selector and import/export */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:items-center sm:justify-between">
          <div className="w-full sm:w-64">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-300"
              value={selectedExam}
              onChange={handleExamChange}
              aria-label="Sélectionner un examen"
            >
              <option value="">Sélectionner un examen</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="file"
                id="import-file"
                className="sr-only"
                accept=".csv,.xlsx"
                onChange={handleImportFile}
              />
              <label 
                htmlFor="import-file"
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                Importer
              </label>
              {importFile && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {importFile.name}
                  <button 
                    onClick={handleImportGrades}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Valider
                  </button>
                </span>
              )}
            </div>
            
            <button
              onClick={handleExportGrades}
              disabled={!selectedExam}
              className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md ${
                selectedExam 
                  ? 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-650' 
                  : 'text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              <DownloadCloud className="h-4 w-4 mr-2" />
              Exporter
            </button>
          </div>
        </div>
        
        {/* Grades table */}
        <div className="overflow-x-auto">
          {selectedExam ? (
            grades.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Élève
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Note
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Commentaire
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{grade.studentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={grade.score}
                          onChange={(e) => handleGradeChange(grade.studentId, e.target.value)}
                          aria-label={`Note pour l'étudiant ${grade.studentId}`}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <span className="ml-1 text-gray-500 dark:text-gray-400">/20</span>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          value={grade.comment || ''}
                          onChange={(e) => {
                            const updatedGrades = grades.map(g => 
                              g.studentId === grade.studentId ? { ...g, comment: e.target.value } : g
                            );
                            setGrades(updatedGrades);
                            setIsDirty(true);
                          }}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          placeholder="Ajouter un commentaire..."
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(grade.status)}`}>
                          {getStatusLabel(grade.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>Aucune note trouvée pour cet examen</p>
              </div>
            )
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <p>Veuillez sélectionner un examen pour voir ou saisir les notes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeManagement;
