import React, { useState } from 'react';
import { Tools, Book, ChartBar, Star, Plus, X, Edit, Trash } from 'lucide-react';

interface Material {
  id: string;
  name: string;
  description: string;
  type: 'standard' | 'low-cost' | 'recycled' | 'digital';
  category: string;
  subject: string;
  quantity: number;
  location: string;
  condition: 'new' | 'good' | 'used' | 'damaged';
  availability: boolean;
  instructions: string;
  cost: number;
  alternatives: string[];
  diyGuide: string | null;
}

interface MaterialManagerProps {
  materials: Material[];
  onSearch: (query: string) => void;
  onAddMaterial: (material: Material) => void;
  onUpdateMaterial: (material: Material) => void;
  onDeleteMaterial: (id: string) => void;
}

const MaterialManager: React.FC<MaterialManagerProps> = ({
  materials,
  onSearch,
  onAddMaterial,
  onUpdateMaterial,
  onDeleteMaterial
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les matériaux
  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Catégories disponibles
  const categories = [
    'Mathématiques',
    'Français',
    'Sciences',
    'Histoire-Géographie',
    'EPS',
    'Arts plastiques',
    'Musique'
  ];

  // Types de matériel
  const materialTypes = {
    standard: {
      icon: Tools,
      label: 'Standard'
    },
    lowCost: {
      icon: ChartBar,
      label: 'Low-cost'
    },
    recycled: {
      icon: Recycle,
      label: 'Recyclé'
    },
    digital: {
      icon: Computer,
      label: 'Numérique'
    }
  };

  // États de disponibilité
  const availabilityStatus = {
    available: {
      color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
      label: 'Disponible'
    },
    unavailable: {
      color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300',
      label: 'Indisponible'
    }
  };

  // Formulaire de création/modification
  const [newMaterial, setNewMaterial] = useState<Material>({
    id: '',
    name: '',
    description: '',
    type: 'standard',
    category: '',
    subject: '',
    quantity: 1,
    location: '',
    condition: 'new',
    availability: true,
    instructions: '',
    cost: 0,
    alternatives: [],
    diyGuide: null
  });

  const handleAddMaterial = () => {
    if (newMaterial.name.trim()) {
      onAddMaterial(newMaterial);
      setShowAddForm(false);
      setNewMaterial({
        id: '',
        name: '',
        description: '',
        type: 'standard',
        category: '',
        subject: '',
        quantity: 1,
        location: '',
        condition: 'new',
        availability: true,
        instructions: '',
        cost: 0,
        alternatives: [],
        diyGuide: null
      });
    }
  };

  const handleUpdateMaterial = () => {
    if (selectedMaterial && newMaterial.name.trim()) {
      onUpdateMaterial(newMaterial);
      setSelectedMaterial(null);
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher du matériel..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300"
        />
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedMaterial(null);
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter du matériel
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Masquer' : 'Afficher'} les filtres
        </button>
      </div>

      {/* Panneau de filtres */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="space-y-4">
            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégories
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      // Appliquer le filtre
                    }}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Types de matériel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Types de matériel
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(materialTypes).map(([type, { icon: Icon, label }]) => (
                  <button
                    key={type}
                    onClick={() => {
                      // Appliquer le filtre
                    }}
                    className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de création/modification */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {selectedMaterial ? 'Modifier le matériel' : 'Ajouter du matériel'}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setSelectedMaterial(null);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newMaterial.description}
                onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={newMaterial.category}
                  onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                >
                  {Object.entries(materialTypes).map(([type, { label }]) => (
                    <option key={type} value={type}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantité
                </label>
                <input
                  type="number"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({ ...newMaterial, quantity: parseInt(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Coût
                </label>
                <input
                  type="number"
                  value={newMaterial.cost}
                  onChange={(e) => setNewMaterial({ ...newMaterial, cost: parseFloat(e.target.value) })}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructions d'utilisation
              </label>
              <textarea
                value={newMaterial.instructions}
                onChange={(e) => setNewMaterial({ ...newMaterial, instructions: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Guide de fabrication (optionnel)
              </label>
              <textarea
                value={newMaterial.diyGuide || ''}
                onChange={(e) => setNewMaterial({ ...newMaterial, diyGuide: e.target.value })}
                className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300 p-2"
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={selectedMaterial ? handleUpdateMaterial : handleAddMaterial}
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                {selectedMaterial ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des matériaux */}
      <div className="space-y-4">
        {filteredMaterials.map((material) => (
          <div
            key={material.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {material.name}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedMaterial(material);
                    setNewMaterial(material);
                    setShowAddForm(true);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Edit className="w-4 h-4 text-blue-500" />
                </button>
                <button
                  onClick={() => onDeleteMaterial(material.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Trash className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {material.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {material.category}
              </span>
              <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {materialTypes[material.type].label}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Quantité:</span>
                <span className="font-medium">{material.quantity}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Coût:</span>
                <span className="font-medium">{material.cost} €</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">État:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    material.condition === 'new'
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                      : material.condition === 'good'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                        : material.condition === 'used'
                          ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                  }`}
                >
                  {material.condition.charAt(0).toUpperCase() + material.condition.slice(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Disponibilité:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    availabilityStatus[material.availability ? 'available' : 'unavailable'].color
                  }`}
                >
                  {availabilityStatus[material.availability ? 'available' : 'unavailable'].label}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alternatives
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {material.alternatives.map((alternative, index) => (
                  <li key={index} className="list-disc ml-4">
                    {alternative}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialManager;
