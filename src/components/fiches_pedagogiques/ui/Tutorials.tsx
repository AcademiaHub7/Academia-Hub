import React, { useState } from 'react';
import { Video, Play, Pause, Rewind, FastForward, X } from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number;
  videoUrl: string;
  transcript: string;
  tags: string[];
}

interface TutorialProps {
  onClose: () => void;
  onSearch?: (query: string) => void;
}

const Tutorials: React.FC<TutorialProps> = ({ onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);

  // Données des tutoriels (exemples)
  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Création d\'une fiche pédagogique',
      description: 'Apprenez à créer une fiche pédagogique complète.',
      category: 'Base',
      duration: 120,
      videoUrl: '#',
      transcript: 'Introduction à la création d\'une fiche pédagogique...',
      tags: ['création', 'fiche', 'base']
    },
    {
      id: '2',
      title: 'Utilisation du glossaire',
      description: 'Découvrez comment utiliser le glossaire pédagogique.',
      category: 'Outils',
      duration: 90,
      videoUrl: '#',
      transcript: 'Introduction au glossaire pédagogique...',
      tags: ['glossaire', 'outil']
    },
    {
      id: '3',
      title: 'Validation par compétences',
      description: 'Apprenez à valider une fiche selon les compétences.',
      category: 'Avancé',
      duration: 150,
      videoUrl: '#',
      transcript: 'Introduction à la validation par compétences...',
      tags: ['validation', 'compétences']
    },
    {
      id: '4',
      title: 'Personnalisation de l\'interface',
      description: 'Personnalisez votre interface selon vos besoins.',
      category: 'Personnalisation',
      duration: 60,
      videoUrl: '#',
      transcript: 'Introduction à la personnalisation...',
      tags: ['interface', 'personnalisation']
    }
  ];

  // Filtrer les tutoriels selon la recherche
  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutorial.tags.some(tag => tag.includes(searchQuery.toLowerCase()))
  );

  // Gestion de la vidéo
  const handleVideo = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            <Video className="w-5 h-5 inline-block mr-2" />
            Tutoriels vidéo
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Barre de recherche */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un tutoriel..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>

          {/* Liste des tutoriels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTutorials.map((tutorial) => (
              <button
                key={tutorial.id}
                onClick={() => handleVideo(tutorial)}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <video
                    className="w-full h-full object-cover"
                    src={tutorial.videoUrl}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>{tutorial.duration} min</span>
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                      {tutorial.category}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Lecteur vidéo */}
          {selectedTutorial && (
            <div className="mt-8">
              <div className="relative aspect-w-16 aspect-h-9">
                <video
                  className="w-full h-full object-cover"
                  src={selectedTutorial.videoUrl}
                  controls
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handlePlayPause}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6" />
                          ) : (
                            <Play className="w-6 h-6" />
                          )}
                        </button>
                        <button
                          onClick={() => handleSeek(currentTime - 10)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Rewind className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleSeek(currentTime + 10)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <FastForward className="w-6 h-6" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <span className="text-sm">Transcription</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {showTranscript && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTutorial.transcript}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tutorials;
