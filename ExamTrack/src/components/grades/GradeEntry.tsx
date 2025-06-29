import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useExamStore } from '../../stores/examStore';
import { useGradeStore } from '../../stores/gradeStore';
import { 
  Save, 
  Send, 
  FileText, 
  Calculator,
  Users,
  AlertCircle,
  CheckCircle,
  Download,
  Printer
} from 'lucide-react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface GradeEntryData {
  studentId: string;
  studentNumber: number;
  matricule: string;
  lastName: string;
  firstName: string;
  grade: number | null;
  appreciation: string;
  observation: string;
  isAbsent: boolean;
  isExcused: boolean;
}

const appreciations = [
  { value: 'Excellent', label: 'Excellent', min: 18, max: 20, color: 'text-green-700' },
  { value: 'Très Bien', label: 'Très Bien', min: 16, max: 17.99, color: 'text-green-600' },
  { value: 'Bien', label: 'Bien', min: 14, max: 15.99, color: 'text-blue-600' },
  { value: 'Assez Bien', label: 'Assez Bien', min: 12, max: 13.99, color: 'text-yellow-600' },
  { value: 'Passable', label: 'Passable', min: 10, max: 11.99, color: 'text-orange-600' },
  { value: 'Insuffisant', label: 'Insuffisant', min: 0, max: 9.99, color: 'text-red-600' }
];

export const GradeEntry: React.FC = () => {
  const { user, tenant } = useAuthStore();
  const { exams } = useExamStore();
  const { grades, saveGrades, validateGrades, isLoading } = useGradeStore();
  
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [gradeData, setGradeData] = useState<GradeEntryData[]>([]);
  const [isDraft, setIsDraft] = useState(true);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    gradesEntered: 0,
    averageGrade: 0,
    distribution: {} as { [key: string]: number }
  });

  // Mock students data
  const mockStudents = [
    { id: '1', number: 1, matricule: 'MAT001', lastName: 'ADJOVI', firstName: 'Paul' },
    { id: '2', number: 2, matricule: 'MAT002', lastName: 'AGBODJAN', firstName: 'Marie' },
    { id: '3', number: 3, matricule: 'MAT003', lastName: 'AKPOVI', firstName: 'Jean' },
    { id: '4', number: 4, matricule: 'MAT004', lastName: 'ASSOGBA', firstName: 'Sylvie' },
    { id: '5', number: 5, matricule: 'MAT005', lastName: 'DOSSOU', firstName: 'Michel' },
    { id: '6', number: 6, matricule: 'MAT006', lastName: 'GBAGUIDI', firstName: 'Fatou' },
    { id: '7', number: 7, matricule: 'MAT007', lastName: 'HOUNKPATIN', firstName: 'André' },
    { id: '8', number: 8, matricule: 'MAT008', lastName: 'KOUDOGBO', firstName: 'Aïcha' },
    { id: '9', number: 9, matricule: 'MAT009', lastName: 'SOGLO', firstName: 'Didier' },
    { id: '10', number: 10, matricule: 'MAT010', lastName: 'TOSSOU', firstName: 'Nadège' }
  ];

  useEffect(() => {
    if (selectedExam && selectedSubject && selectedClass) {
      const initialData = mockStudents.map(student => ({
        studentId: student.id,
        studentNumber: student.number,
        matricule: student.matricule,
        lastName: student.lastName,
        firstName: student.firstName,
        grade: null,
        appreciation: '',
        observation: '',
        isAbsent: false,
        isExcused: false
      }));
      setGradeData(initialData);
    }
  }, [selectedExam, selectedSubject, selectedClass]);

  useEffect(() => {
    calculateStatistics();
  }, [gradeData]);

  const calculateStatistics = () => {
    const validGrades = gradeData.filter(g => g.grade !== null && !g.isAbsent);
    const total = gradeData.length;
    const entered = validGrades.length;
    const average = entered > 0 ? validGrades.reduce((sum, g) => sum + (g.grade || 0), 0) / entered : 0;
    
    const distribution = appreciations.reduce((acc, app) => {
      acc[app.value] = validGrades.filter(g => 
        g.grade !== null && g.grade >= app.min && g.grade <= app.max
      ).length;
      return acc;
    }, {} as { [key: string]: number });

    setStatistics({
      totalStudents: total,
      gradesEntered: entered,
      averageGrade: Math.round(average * 100) / 100,
      distribution
    });
  };

  const getAppreciation = (grade: number | null): string => {
    if (grade === null) return '';
    const app = appreciations.find(a => grade >= a.min && grade <= a.max);
    return app ? app.value : '';
  };

  const handleGradeChange = (index: number, field: string, value: any) => {
    const newData = [...gradeData];
    newData[index] = { ...newData[index], [field]: value };
    
    if (field === 'grade' && value !== null) {
      newData[index].appreciation = getAppreciation(parseFloat(value));
      newData[index].isAbsent = false;
    }
    
    if (field === 'isAbsent' && value) {
      newData[index].grade = null;
      newData[index].appreciation = '';
    }
    
    setGradeData(newData);
  };

  const handleSaveDraft = async () => {
    await saveGrades(selectedExam, selectedSubject, gradeData, true);
    setIsDraft(true);
  };

  const handleValidateAndSubmit = async () => {
    await saveGrades(selectedExam, selectedSubject, gradeData, false);
    await validateGrades(selectedExam, selectedSubject);
    setIsDraft(false);
  };

  const selectedExamData = exams.find(e => e.id === selectedExam);
  const selectedSubjectData = selectedExamData?.subjects.find(s => s.code === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Saisie des Notes</h1>
            <p className="text-gray-600 mt-1">
              Interface de saisie conforme EducMaster.bj
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-color" />
            <span className="text-sm font-medium text-primary-color">
              Année Scolaire {tenant?.settings.academicYear}
            </span>
          </div>
        </div>

        {/* Selection Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Examen *
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="">Sélectionner un examen</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} - {exam.type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Matière *
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedExam}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Sélectionner une matière</option>
              {selectedExamData?.subjects.map(subject => (
                <option key={subject.code} value={subject.code}>
                  {subject.name} (Coef. {subject.coefficient})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              disabled={!selectedExam}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Sélectionner une classe</option>
              {selectedExamData?.targetClasses.map(className => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grade Entry Grid */}
      {selectedExam && selectedSubject && selectedClass && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Grid Header */}
          <div className="bg-primary-color text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">
                  {selectedSubjectData?.name} - {selectedClass}
                </h3>
                <p className="text-sm opacity-90">
                  {selectedExamData?.name} • Coefficient: {selectedSubjectData?.coefficient}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">Enseignant: {user?.firstName} {user?.lastName}</p>
                <p className="text-xs opacity-75">
                  {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>

          {/* Grade Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">N°</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matricule</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénoms</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note/20</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Appréciation</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {gradeData.map((student, index) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {student.studentNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {student.matricule}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {student.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {student.firstName}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={student.grade || ''}
                        onChange={(e) => handleGradeChange(index, 'grade', e.target.value ? parseFloat(e.target.value) : null)}
                        disabled={student.isAbsent}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-color focus:border-transparent disabled:bg-gray-100"
                        placeholder="--"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        appreciations.find(a => a.value === student.appreciation)?.color || 'text-gray-500'
                      }`}>
                        {student.appreciation}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={student.isAbsent}
                        onChange={(e) => handleGradeChange(index, 'isAbsent', e.target.checked)}
                        className="w-4 h-4 text-primary-color border-gray-300 rounded focus:ring-primary-color"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={student.observation}
                        onChange={(e) => handleGradeChange(index, 'observation', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-color focus:border-transparent"
                        placeholder="Observation..."
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistics Footer */}
          <div className="bg-gray-50 p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-color">{statistics.totalStudents}</div>
                <div className="text-sm text-gray-600">Total Élèves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.gradesEntered}</div>
                <div className="text-sm text-gray-600">Notes Saisies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.averageGrade}</div>
                <div className="text-sm text-gray-600">Moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.round((statistics.gradesEntered / statistics.totalStudents) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Progression</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white p-4 border-t flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder Brouillon</span>
              </button>
              
              <button
                onClick={handleValidateAndSubmit}
                disabled={isLoading || statistics.gradesEntered === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Valider et Soumettre</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Download className="w-4 h-4" />
                <span>Exporter Excel</span>
              </button>
              
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Printer className="w-4 h-4" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Instructions de Saisie</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Les notes doivent être comprises entre 0 et 20</li>
              <li>• Cochez "Absent" pour les élèves non présents</li>
              <li>• L'appréciation est calculée automatiquement</li>
              <li>• Sauvegardez régulièrement votre travail</li>
              <li>• Une fois validées, les notes ne peuvent plus être modifiées</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};