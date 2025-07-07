import React from 'react';
import { Fiche } from '../../../types';
import { FicheViewContext } from '../FicheViewTypes';

interface FichePresentationViewProps {
  fiche: Fiche;
}

const FichePresentationView: React.FC<FichePresentationViewProps> = ({ fiche }) => {
  const context = React.useContext(FicheViewContext);
  if (!context) {
    throw new Error('FichePresentationView must be used within a FicheViewProvider');
  }

  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      title: 'Titre et objectifs',
      content: (
        <div>
          <h1 className="text-4xl font-bold mb-4">{fiche.title}</h1>
          <h2 className="text-2xl font-semibold mb-4">Objectifs pédagogiques</h2>
          <ul className="list-disc pl-5 space-y-2">
            {fiche.objectives?.map((objective, index) => (
              <li key={index} className="text-xl">{objective}</li>
            ))}
          </ul>
        </div>
      )
    },
    {
      title: 'Contenu',
      content: (
        <div className="prose max-w-none text-xl">
          {fiche.content}
        </div>
      )
    },
    {
      title: 'Ressources',
      content: (
        <div className="space-y-6">
          {fiche.resources?.map((resource, index) => (
            <div key={index} className="p-6 border rounded-lg">
              <h3 className="text-2xl font-bold mb-2">{resource.title}</h3>
              <p className="text-xl">{resource.description}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Évaluation',
      content: (
        <div className="space-y-4">
          {fiche.evaluation?.map((item, index) => (
            <div key={index} className="p-6 border rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Évaluation {index + 1}</h3>
              <p className="text-xl">{item}</p>
            </div>
          ))}
        </div>
      )
    }
  ];

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-full">
      {/* Slide actuelle */}
      <div className="h-full overflow-y-auto p-8">
        <h1 className="text-4xl font-bold mb-8">{slides[currentSlide].title}</h1>
        {slides[currentSlide].content}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          onClick={handlePrev}
          className="p-4 text-gray-500 hover:text-gray-700"
        >
          ❮
        </button>
        <button
          onClick={handleNext}
          className="p-4 text-gray-500 hover:text-gray-700"
        >
          ❯
        </button>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-1 rounded-full ${
              currentSlide === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Contrôles */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => {
            // TODO: Exporter en PDF
          }}
          className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          title="Exporter en PDF"
        >
          📄
        </button>
      </div>
    </div>
  );
};

export default FichePresentationView;
