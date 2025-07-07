import React, { useState } from 'react';
import { FicheViewContext } from '../FicheViewTypes';

interface NavigationTreeProps {
  path: string[];
}

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  type: 'SA' | 'sequence' | 'fiche';
  ficheId?: string;
}

const NavigationTree: React.FC<NavigationTreeProps> = ({ path }) => {
  const context = React.useContext(FicheViewContext);
  if (!context) {
    throw new Error('NavigationTree must be used within a FicheViewProvider');
  }

  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Structure de données d'exemple - à remplacer par les données réelles
  const treeData: TreeNode[] = [
    {
      id: 'SA1',
      label: 'SA 1',
      type: 'SA',
      children: [
        {
          id: 'seq1',
          label: 'Séquence 1',
          type: 'sequence',
          children: [
            {
              id: 'fiche1',
              label: 'Fiche 1',
              type: 'fiche',
              ficheId: 'fiche1'
            },
            {
              id: 'fiche2',
              label: 'Fiche 2',
              type: 'fiche',
              ficheId: 'fiche2'
            }
          ]
        },
        {
          id: 'seq2',
          label: 'Séquence 2',
          type: 'sequence'
        }
      ]
    },
    {
      id: 'SA2',
      label: 'SA 2',
      type: 'SA'
    }
  ];

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId) 
        : [...prev, nodeId]
    );
  };

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.id);
    const isSelected = path.includes(node.id);

    return (
      <li key={node.id} className="relative">
        <div
          className={`flex items-center p-2 cursor-pointer ${
            isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => {
            if (node.type === 'fiche') {
              context.updateNavigation({ currentPath: [...path, node.id] });
            } else {
              toggleNode(node.id);
            }
          }}
        >
          <div className={`mr-2 ${level > 0 ? 'pl-4' : ''}`}>
            {node.children && (
              <span
                className={`transform transition-transform duration-200 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              >
                ❯
              </span>
            )}
          </div>
          <span className={`font-medium ${isSelected ? 'text-blue-600' : ''}`}>
            {node.label}
          </span>
        </div>
        {node.children && isExpanded && (
          <ul className="pl-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher dans la navigation..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Arbre de navigation */}
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
        <ul>
          {treeData.map(node => renderNode(node))}
        </ul>
      </div>
    </div>
  );
};

export default NavigationTree;
