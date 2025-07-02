import React, { useState, useEffect } from 'react';
import { X, User, Search, Check, Plus, Users } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  currentClass?: string;
  status?: string;
}

interface ClassStudentAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedStudents: string[]) => void;
  classInfo: {
    id: string;
    name: string;
    level: string;
    currentStudents: Student[];
  };
  allStudents: Student[];
}

const ClassStudentAssignmentModal: React.FC<ClassStudentAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  classInfo,
  allStudents
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<'current' | 'available'>('current');

  // Effet pour suivre l'état d'ouverture du modal
  useEffect(() => {
    console.log('ClassStudentAssignmentModal - isOpen:', isOpen);
    console.log('ClassStudentAssignmentModal - classInfo:', classInfo);
    console.log('ClassStudentAssignmentModal - allStudents:', allStudents);
    
    if (isOpen) {
      // Réinitialiser la recherche et la sélection quand le modal s'ouvre
      setSearchTerm('');
      setSelectedStudents(classInfo.currentStudents.map(s => s.id));
    }
  }, [isOpen, classInfo, allStudents]);

  // Initialiser les élèves sélectionnés avec les élèves actuels de la classe
  useEffect(() => {
    if (classInfo?.currentStudents) {
      setSelectedStudents(classInfo.currentStudents.map(s => s.id));
    }
  }, [classInfo]);

  // Filtrer les élèves en fonction de la recherche
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'current') {
      return matchesSearch && selectedStudents.includes(student.id);
    }
    return matchesSearch && !selectedStudents.includes(student.id);
  });

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSave = () => {
    onSave(selectedStudents);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Affectation des élèves - {classInfo?.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gérer les élèves de la classe {classInfo?.name} - {classInfo?.level}
              </p>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentTab('current')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentTab === 'current'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Users className="inline-block w-4 h-4 mr-2" />
                      Élèves actuels ({selectedStudents.length})
                    </button>
                    <button
                      onClick={() => setCurrentTab('available')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentTab === 'available'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Plus className="inline-block w-4 h-4 mr-2" />
                      Ajouter des élèves
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                      placeholder="Rechercher un élève..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
                  <div className="overflow-y-auto max-h-96">
                    {filteredStudents.length > 0 ? (
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredStudents.map((student) => (
                          <li key={student.id} className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {student.firstName} {student.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {student.id} • {student.currentClass || 'Non affecté'}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleStudent(student.id)}
                                className={`ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full ${
                                  selectedStudents.includes(student.id)
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                              >
                                {selectedStudents.includes(student.id) ? (
                                  <div className="flex items-center">
                                    <Check className="h-3 w-3 mr-1" />
                                    <span>Affecté</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Plus className="h-3 w-3 mr-1" />
                                    <span>Affecter</span>
                                  </div>
                                )}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-12">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun élève trouvé</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {searchTerm
                            ? 'Aucun élève ne correspond à votre recherche.'
                            : currentTab === 'current'
                            ? 'Aucun élève actuellement affecté à cette classe.'
                            : 'Tous les élèves sont déjà affectés à cette classe.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
              onClick={handleSave}
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassStudentAssignmentModal;
