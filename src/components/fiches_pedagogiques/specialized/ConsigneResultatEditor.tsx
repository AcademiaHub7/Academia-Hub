import React, { useState } from 'react';
import { Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ConsigneResultatEditorProps {
  consignes: string[];
  resultats: string[];
  onChange: (data: { consignes: string[]; resultats: string[] }) => void;
}

const ConsigneResultatEditor: React.FC<ConsigneResultatEditorProps> = ({
  consignes,
  resultats,
  onChange
}) => {
  const [localConsignes, setLocalConsignes] = useState<string[]>(consignes);
  const [localResultats, setLocalResultats] = useState<string[]>(resultats);

  const handleAddRow = () => {
    setLocalConsignes([...localConsignes, '']);
    setLocalResultats([...localResultats, '']);
  };

  const handleRemoveRow = (index: number) => {
    setLocalConsignes(localConsignes.filter((_, i) => i !== index));
    setLocalResultats(localResultats.filter((_, i) => i !== index));
  };

  const handleConsigneChange = (index: number, value: string) => {
    setLocalConsignes(
      localConsignes.map((consigne, i) => (i === index ? value : consigne))
    );
  };

  const handleResultatChange = (index: number, value: string) => {
    setLocalResultats(
      localResultats.map((resultat, i) => (i === index ? value : resultat))
    );
  };

  const validateData = () => {
    const validConsignes = localConsignes.filter(consigne => consigne.trim() !== '');
    const validResultats = localResultats.filter(resultat => resultat.trim() !== '');
    onChange({ consignes: validConsignes, resultats: validResultats });
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Consignes
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Résultats attendus
              </th>
              <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {localConsignes.map((consigne, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={consigne}
                    onChange={(e) => handleConsigneChange(index, e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Consigne..."
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={localResultats[index] || ''}
                    onChange={(e) => handleResultatChange(index, e.target.value)}
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Résultat attendu..."
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleRemoveRow(index)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleAddRow}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une ligne
        </button>
        <button
          onClick={validateData}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Valider
        </button>
      </div>

      {localConsignes.some(consigne => consigne.trim() === '') ||
      localResultats.some(resultat => resultat.trim() === '') && (
        <p className="mt-2 text-sm text-red-500">
          <AlertCircle className="w-4 h-4 inline-block mr-1" />
          Certaines cases sont vides
        </p>
      )}
    </div>
  );
};

export default ConsigneResultatEditor;
