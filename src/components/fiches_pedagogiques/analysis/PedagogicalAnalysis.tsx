import React from 'react';
import { 
  BarChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  BookOpen,
  Users,
  Clock 
} from 'lucide-react';

interface AnalysisData {
  competences: {
    savoir: number;
    savoirFaire: number;
    savoirEtre: number;
    transversale: number;
  };
  teachingMethods: {
    active: number;
    passive: number;
    collaborative: number;
    individual: number;
  };
  evaluationMethods: {
    written: number;
    oral: number;
    practical: number;
    continuous: number;
  };
  progression: {
    coherence: number;
    difficulty: number;
    duration: number;
  };
  gaps: {
    competences: string[];
    methods: string[];
    evaluation: string[];
  };
}

interface PedagogicalAnalysisProps {
  data: AnalysisData;
  onFilterChange: (filters: any) => void;
}

const PedagogicalAnalysis: React.FC<PedagogicalAnalysisProps> = ({ data, onFilterChange }) => {
  // Calcul des pourcentages
  const totalCompetences = data.competences.savoir + 
    data.competences.savoirFaire + 
    data.competences.savoirEtre + 
    data.competences.transversale;

  const totalTeachingMethods = data.teachingMethods.active + 
    data.teachingMethods.passive + 
    data.teachingMethods.collaborative + 
    data.teachingMethods.individual;

  const totalEvaluationMethods = data.evaluationMethods.written + 
    data.evaluationMethods.oral + 
    data.evaluationMethods.practical + 
    data.evaluationMethods.continuous;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Répartition des compétences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <BookOpen className="w-5 h-5 inline-block mr-2" />
          Répartition des compétences
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Savoir</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-4 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${(data.competences.savoir / totalCompetences) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {(data.competences.savoir / totalCompetences * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Savoir-faire</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-4 bg-green-600 dark:bg-green-400 rounded-full transition-all duration-300"
                style={{ width: `${(data.competences.savoirFaire / totalCompetences) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {(data.competences.savoirFaire / totalCompetences * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Savoir-être</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-4 bg-yellow-600 dark:bg-yellow-400 rounded-full transition-all duration-300"
                style={{ width: `${(data.competences.savoirEtre / totalCompetences) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {(data.competences.savoirEtre / totalCompetences * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Transversale</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-4 bg-purple-600 dark:bg-purple-400 rounded-full transition-all duration-300"
                style={{ width: `${(data.competences.transversale / totalCompetences) * 100}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {(data.competences.transversale / totalCompetences * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Équilibre des méthodes d'enseignement */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <Users className="w-5 h-5 inline-block mr-2" />
          Équilibre des méthodes d'enseignement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.teachingMethods.active}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Actif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.teachingMethods.collaborative}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Collaboratif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.teachingMethods.passive}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Passif</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data.teachingMethods.individual}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Individuel</div>
          </div>
        </div>
      </div>

      {/* Méthodes d'évaluation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <TrendingUp className="w-5 h-5 inline-block mr-2" />
          Diversité des méthodes d'évaluation
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Écrit</span>
            </div>
            <div className="text-2xl font-bold">
              {data.evaluationMethods.written}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-600 dark:bg-green-400 rounded-full" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Oral</span>
            </div>
            <div className="text-2xl font-bold">
              {data.evaluationMethods.oral}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-600 dark:bg-yellow-400 rounded-full" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Pratique</span>
            </div>
            <div className="text-2xl font-bold">
              {data.evaluationMethods.practical}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-600 dark:bg-purple-400 rounded-full" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Continue</span>
            </div>
            <div className="text-2xl font-bold">
              {data.evaluationMethods.continuous}
            </div>
          </div>
        </div>
      </div>

      {/* Cohérence des progressions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <Clock className="w-5 h-5 inline-block mr-2" />
          Cohérence des progressions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Progression</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  data.progression.coherence >= 80
                    ? 'bg-green-600 dark:bg-green-400'
                    : data.progression.coherence >= 60
                      ? 'bg-yellow-600 dark:bg-yellow-400'
                      : 'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${data.progression.coherence}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {data.progression.coherence}%
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Difficulté</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  data.progression.difficulty >= 80
                    ? 'bg-green-600 dark:bg-green-400'
                    : data.progression.difficulty >= 60
                      ? 'bg-yellow-600 dark:bg-yellow-400'
                      : 'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${data.progression.difficulty}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {data.progression.difficulty}%
            </div>
          </div>
          <div>
            <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Durée</h4>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className={`h-4 rounded-full transition-all duration-300 ${
                  data.progression.duration >= 80
                    ? 'bg-green-600 dark:bg-green-400'
                    : data.progression.duration >= 60
                      ? 'bg-yellow-600 dark:bg-yellow-400'
                      : 'bg-red-600 dark:bg-red-400'
                }`}
                style={{ width: `${data.progression.duration}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {data.progression.duration}%
            </div>
          </div>
        </div>
      </div>

      {/* Lacunes */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          <TrendingDown className="w-5 h-5 inline-block mr-2" />
          Lacunes détectées
        </h3>
        <div className="space-y-4">
          {data.gaps.competences.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Compétences</h4>
              <ul className="space-y-1">
                {data.gaps.competences.map((gap, index) => (
                  <li key={index} className="text-sm text-red-600 dark:text-red-400">
                    <ArrowDownRight className="w-4 h-4 inline-block mr-1" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.gaps.methods.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Méthodes</h4>
              <ul className="space-y-1">
                {data.gaps.methods.map((gap, index) => (
                  <li key={index} className="text-sm text-red-600 dark:text-red-400">
                    <ArrowDownRight className="w-4 h-4 inline-block mr-1" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.gaps.evaluation.length > 0 && (
            <div>
              <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-2">Évaluation</h4>
              <ul className="space-y-1">
                {data.gaps.evaluation.map((gap, index) => (
                  <li key={index} className="text-sm text-red-600 dark:text-red-400">
                    <ArrowDownRight className="w-4 h-4 inline-block mr-1" />
                    {gap}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PedagogicalAnalysis;
