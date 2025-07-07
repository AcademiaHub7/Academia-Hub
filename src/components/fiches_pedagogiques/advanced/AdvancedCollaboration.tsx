import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Star, 
  BookOpen,
  Link2,
  Clock 
} from 'lucide-react';

interface CollaborationItem {
  id: string;
  type: 'peer_review' | 'quality_circle' | 'mentorship' | 'community';
  title: string;
  participants: string[];
  status: 'active' | 'completed' | 'pending';
  lastActivity: string;
  rating: number;
}

interface AdvancedCollaborationProps {
  items: CollaborationItem[];
  onJoin: (item: CollaborationItem) => void;
  onRate: (item: CollaborationItem, rating: number) => void;
  onMessage: (item: CollaborationItem) => void;
}

const AdvancedCollaboration: React.FC<AdvancedCollaborationProps> = ({
  items,
  onJoin,
  onRate,
  onMessage
}) => {
  const [selectedItem, setSelectedItem] = useState<CollaborationItem | null>(null);

  // Types de collaboration
  const collaborationTypes = {
    peer_review: {
      icon: MessageSquare,
      label: 'Revue par les pairs'
    },
    quality_circle: {
      icon: Star,
      label: 'Cercle de qualité'
    },
    mentorship: {
      icon: Users,
      label: 'Mentorat'
    },
    community: {
      icon: BookOpen,
      label: 'Communauté'
    }
  };

  // Statuts visuels
  const statusColors = {
    active: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300',
    completed: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
  };

  return (
    <div className="space-y-6">
      {/* Collaboration avancée */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Users className="w-5 h-5 inline-block mr-2" />
          Collaboration avancée
        </h3>
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  {collaborationTypes[item.type].icon && (
                    React.createElement(collaborationTypes[item.type].icon, { className: "w-4 h-4 text-gray-400" })
                  )}
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h4>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs ${
                    statusColors[item.status]
                  }`}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {item.participants.length} participants
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onJoin(item)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Link2 className="w-4 h-4 text-blue-500" />
                  </button>
                  <button
                    onClick={() => onMessage(item)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MessageSquare className="w-4 h-4 text-green-500" />
                  </button>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dernière activité
                </h5>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(item.lastActivity).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedCollaboration;
