import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';

// Définition du type pour les données de matière
export interface Subject {
  id: string;
  name: string;
  abbreviation: string;
  level: string;
  department: string;
  hoursPerWeek: {
    Maternelle?: number;
    Primaire?: number;
    Secondaire?: number;
    [key: string]: number | undefined;
  };
  coefficient: number;
  teachers: string[];
}

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subjectData: Subject) => void;
  subjectData?: Subject;
  isEdit?: boolean;
}

// Listes de matières par défaut par niveau
const defaultSubjects = {
  'Maternelle': [
    'Education pour la santé',
    'Education à des réflexions de santé',
    'Education du mouvement',
    'Gestuelle',
    'Rythmique',
    'Observation',
    'Education sensorielle',
    'Pré-lecture',
    'Pré-écriture',
    'Pré-mathématique',
    'Expression plastique',
    'Expression émotionnelle',
    'Langage',
    'Conte',
    'Comptine',
    'Poésie',
    'Chant'
  ],
  'Primaire': [
    'Communication orale',
    'Expression écrite',
    'Lecture',
    'Dictée',
    'Mathématiques',
    'Education Scientifique et Technologique',
    'Education Sociale',
    'EA (Dessin/Couture)',
    'EA (Poésie/Chant/Conte)',
    'Anglais',
    'Entrepreneuriat',
    'Education Physique et Sportive'
  ],
  'Secondaire': [
    'Anglais',
    'Communication Ecrite',
    'Lecture',
    'Français',
    'Histoire & Géographie',
    'Mathématiques',
    'Physique Chimie et Technologie',
    'Science de la Vie et de la Terre',
    'Entrepreneuriat',
    'Education Physique et Sportive',
    'Philosophie',
    'Allemand',
    'Espagnol'
  ]
};

// Départements disponibles
const departments = [
  'Langues',
  'Sciences',
  'Arts',
  'Éducation Physique',
  'Santé & Environnement',
  'Développement Physique & Moteur',
  'Développement Cognitif',
  'Développement Emotionnel',
  'Développement Social',
  'Autre'
];

const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  subjectData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<Subject>({
    id: '',
    name: '',
    abbreviation: '',
    level: 'Tous niveaux',
    department: 'Langues',
    hoursPerWeek: {
      'Maternelle': 0,
      'Primaire': 0,
      'Secondaire': 0
    },
    coefficient: 1,
    teachers: []
  });

  const [selectedLevel, setSelectedLevel] = useState('Maternelle');
  const [customSubject, setCustomSubject] = useState('');
  const [showDefaultList, setShowDefaultList] = useState(true);

  useEffect(() => {
    if (isEdit && subjectData) {
      setFormData({
        ...subjectData
      });
    } else {
      setFormData({
        id: `SUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        name: '',
        abbreviation: '',
        level: 'Tous niveaux',
        department: 'Langues',
        hoursPerWeek: {
          'Maternelle': 0,
          'Primaire': 0,
          'Secondaire': 0
        },
        coefficient: 1,
        teachers: []
      });
    }
  }, [isEdit, subjectData]);

  // Fonction pour générer automatiquement l'abréviation à partir du nom
  const generateAbbreviation = (name: string): string => {
    if (!name) return '';
    
    // Fonction pour normaliser les caractères accentués
    const normalizeChar = (char: string): string => {
      // Table de correspondance des caractères accentués vers non accentués
      const accentMap: {[key: string]: string} = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ý': 'y', 'ÿ': 'y',
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
        'Ý': 'Y',
        'ç': 'c', 'Ç': 'C'
      };
      
      return accentMap[char] || char;
    };
    
    // Normaliser le nom complet (retirer les accents)
    const normalizedName = name.split('').map(normalizeChar).join('');
    
    // Logique de génération d'abréviation
    // 1. Si c'est un seul mot, prendre les 3 premières lettres en majuscules
    // 2. Si c'est plusieurs mots, prendre la première lettre de chaque mot significatif (max 4)
    // 3. Ignorer les mots de liaison comme "et", "&", "de", "du", "la", "le", etc.
    
    // Liste des mots à ignorer dans l'abréviation
    const wordsToIgnore = ['et', '&', 'de', 'du', 'la', 'le', 'les', 'des', 'un', 'une', 'a', 'au', 'aux', 'en', 'par', 'pour'];
    
    const words = normalizedName.split(/\s+|-|\(|\)|\//);
    
    if (words.length === 1) {
      // Un seul mot - prendre les 3 premières lettres
      return normalizedName.substring(0, Math.min(3, normalizedName.length)).toUpperCase();
    } else {
      // Plusieurs mots - prendre la première lettre de chaque mot significatif (max 4)
      const abbr = words
        .filter(word => word.length > 0)
        .filter(word => !wordsToIgnore.includes(word.toLowerCase()))
        .slice(0, 4)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      
      // Si l'abréviation est vide (tous les mots étaient à ignorer), prendre les 3 premières lettres du nom complet
      return abbr || normalizedName.substring(0, Math.min(3, normalizedName.length)).toUpperCase();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'name') {
      // Si le nom change, mettre à jour l'abréviation automatiquement
      setFormData(prev => ({
        ...prev,
        name: value,
        abbreviation: generateAbbreviation(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleHoursChange = (level: string, value: string) => {
    const hours = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      hoursPerWeek: {
        ...prev.hoursPerWeek,
        [level]: hours
      }
    }));
  };

  const handleSelectDefaultSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      name: subject,
      abbreviation: generateAbbreviation(subject)
    }));
    setCustomSubject('');
  };

  const handleCustomSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSubject(e.target.value);
  };

  const handleAddCustomSubject = () => {
    if (customSubject.trim()) {
      setFormData(prev => ({
        ...prev,
        name: customSubject.trim(),
        abbreviation: generateAbbreviation(customSubject.trim())
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isEdit ? 'Modifier une matière' : 'Ajouter une nouvelle matière'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Fermer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Niveau d'éducation pour la liste prédéfinie
                </label>
                <select 
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  aria-label="Niveau d'éducation"
                  title="Sélectionner un niveau d'éducation"
                >
                  <option value="Maternelle">Maternelle</option>
                  <option value="Primaire">Primaire</option>
                  <option value="Secondaire">Secondaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Afficher
                </label>
                <div className="flex space-x-4 mt-2">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg ${showDefaultList ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    onClick={() => setShowDefaultList(true)}
                  >
                    Liste prédéfinie
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg ${!showDefaultList ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}
                    onClick={() => setShowDefaultList(false)}
                  >
                    Matière personnalisée
                  </button>
                </div>
              </div>
            </div>

            {showDefaultList ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sélectionnez une matière prédéfinie
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {defaultSubjects[selectedLevel as keyof typeof defaultSubjects].map((subject, index) => (
                    <div 
                      key={index}
                      className={`p-2 rounded-lg cursor-pointer ${formData.name === subject ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                      onClick={() => handleSelectDefaultSubject(subject)}
                    >
                      <div className="flex items-center">
                        {formData.name === subject && <Check className="w-4 h-4 mr-1" />}
                        <span>{subject}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de la matière personnalisée
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={customSubject}
                    onChange={handleCustomSubjectChange}
                    className="flex-grow rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                    placeholder="Entrez le nom de la matière"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSubject}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg"
                    aria-label="Ajouter la matière personnalisée"
                    title="Ajouter la matière personnalisée"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom de la matière sélectionnée
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                placeholder="Nom de la matière"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Niveau d'application
                </label>
                <select 
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                  aria-label="Niveau d'application"
                  title="Sélectionner le niveau d'application"
                >
                  <option value="Tous niveaux">Tous niveaux</option>
                  <option value="Maternelle">Maternelle uniquement</option>
                  <option value="Primaire">Primaire uniquement</option>
                  <option value="Secondaire">Secondaire uniquement</option>
                  <option value="Maternelle et Primaire">Maternelle et Primaire</option>
                  <option value="Primaire et Secondaire">Primaire et Secondaire</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="abbreviation">
                  Abréviation <span className="text-xs text-gray-500">(générée automatiquement)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="abbreviation"
                    name="abbreviation"
                    value={formData.abbreviation}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 uppercase font-semibold"
                    placeholder="ABREV"
                    aria-label="Abréviation de la matière"
                    maxLength={5}
                  />
                  <div className="text-xs text-gray-500 mt-1 italic">Utilisée pour l'affichage compact dans les emplois du temps</div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" htmlFor="department">
                  Département
                </label>
                <select 
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                  aria-label="Sélectionner le département"
                  title="Sélectionner le département"
                >
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {(formData.level === 'Secondaire' || formData.level === 'Tous niveaux' || formData.level === 'Primaire et Secondaire') && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Coefficient (Secondaire)
                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                      Niveau Secondaire uniquement
                    </span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      name="coefficient"
                      value={formData.coefficient}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                      aria-label="Coefficient de la matière pour le niveau Secondaire"
                      title="Coefficient de la matière pour le niveau Secondaire"
                    />
                    <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Importance</span> de la matière dans le calcul des moyennes
                    </div>
                  </div>
                </div>
              )}
              
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Heures hebdomadaires par niveau
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Maternelle
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.hoursPerWeek['Maternelle']}
                    onChange={(e) => handleHoursChange('Maternelle', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                    aria-label="Heures hebdomadaires pour le niveau Maternelle"
                    title="Heures hebdomadaires pour le niveau Maternelle"
                    placeholder="Heures Maternelle"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Primaire
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.hoursPerWeek['Primaire']}
                    onChange={(e) => handleHoursChange('Primaire', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                    aria-label="Heures hebdomadaires pour le niveau Primaire"
                    title="Heures hebdomadaires pour le niveau Primaire"
                    placeholder="Heures Primaire"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Secondaire
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.hoursPerWeek['Secondaire']}
                    onChange={(e) => handleHoursChange('Secondaire', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2"
                    aria-label="Heures hebdomadaires pour le niveau Secondaire"
                    title="Heures hebdomadaires pour le niveau Secondaire"
                    placeholder="Heures Secondaire"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEdit ? 'Mettre à jour' : 'Ajouter la matière'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectModal;