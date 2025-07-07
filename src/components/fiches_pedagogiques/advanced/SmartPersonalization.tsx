import React, { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  Clock, 
  TrendingUp,
  Star 
} from 'lucide-react';

interface PersonalizationProfile {
  id: string;
  userId: string;
  pedagogicalStyle: string[];
  preferredActivities: string[];
  competencyLevel: {
    pedagogical: number;
    technical: number;
    relational: number;
  };
  learningHistory: {
    date: string;
    activity: string;
    success: boolean;
  }[];
}

interface SmartPersonalizationProps {
  profiles: PersonalizationProfile[];
  onApplyPreferences: (profile: PersonalizationProfile) => void;
  onRecommend: (profile: PersonalizationProfile) => void;
}

const SmartPersonalization: React.FC<SmartPersonalizationProps> = ({
  profiles,
  onApplyPreferences,
  onRecommend
}) => {
  const [selectedProfile, setSelectedProfile] = useState<PersonalizationProfile | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Styles pédagogiques
  const pedagogicalStyles = {
    active: {
      icon: User,
      label: 'Actif'
    },
    collaborative: {
      icon: Users,
      label: 'Collaboratif'
    },
    reflective: {
      icon: Clock,
      label: 'Réflexif'
    },
    experimental: {
      icon: TrendingUp,
      label: 'Expérimental'
    }
  };

  // Analyse des préférences
  const analyzePreferences = (profile: PersonalizationProfile) => {
    const preferences = [];
    
    // Analyse du style pédagogique
    if (profile.pedagogicalStyle.includes('active')) {
      preferences.push('Préfère les approches actives');
    }
    
    // Analyse des compétences
    if (profile.competencyLevel.pedagogical > 80) {
      preferences.push('Expert pédagogique');
    }
    
    return preferences;
  };

  return (
    <div className="space-y-6">
      {/* Personnalisation intelligente */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <User className="w-5 h-5 inline-block mr-2" />
          Personnalisation intelligente
        </h3>
        <div className="mt-4 space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  Profil pédagogique
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onApplyPreferences(profile)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <BookOpen className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => onRecommend(profile)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Star className="w-4 h-4 text-yellow-500" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Style pédagogique */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style pédagogique
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {profile.pedagogicalStyle.map((style) => (
                      <div
                        key={style}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        {pedagogicalStyles[style].label}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Compétences */}
                <div>
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Compétences
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Pédagogique:</span>
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            profile.competencyLevel.pedagogical >= 80 ? 'bg-green-600 dark:bg-green-400' :
                            profile.competencyLevel.pedagogical >= 60 ? 'bg-yellow-600 dark:bg-yellow-400' :
                            'bg-red-600 dark:bg-red-400'
                          }`}
                          style={{ width: `${profile.competencyLevel.pedagogical}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Technique:</span>
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            profile.competencyLevel.technical >= 80 ? 'bg-green-600 dark:bg-green-400' :
                            profile.competencyLevel.technical >= 60 ? 'bg-yellow-600 dark:bg-yellow-400' :
                            'bg-red-600 dark:bg-red-400'
                          }`}
                          style={{ width: `${profile.competencyLevel.technical}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Relationnel:</span>
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            profile.competencyLevel.relational >= 80 ? 'bg-green-600 dark:bg-green-400' :
                            profile.competencyLevel.relational >= 60 ? 'bg-yellow-600 dark:bg-yellow-400' :
                            'bg-red-600 dark:bg-red-400'
                          }`}
                          style={{ width: `${profile.competencyLevel.relational}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 mb-4"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {showHistory ? 'Masquer' : 'Afficher'} l'historique
                </button>
                {showHistory && (
                  <div className="space-y-4">
                    {profile.learningHistory.slice(0, 5).map((history, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(history.date).toLocaleDateString('fr-FR')}
                          </span>
                          <div
                            className={`px-2 py-1 rounded-full text-xs ${
                              history.success ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' :
                              'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                            }`}
                          >
                            {history.success ? 'Succès' : 'Échec'}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {history.activity}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartPersonalization;
