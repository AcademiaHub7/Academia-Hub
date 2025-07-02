import React, { useState } from 'react';
import { X, Plus, Save, Trash2, Edit, MapPin, Monitor, Wrench } from 'lucide-react';

interface RoomManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roomData: any) => void;
  rooms: any[];
}

const RoomManagementModal: React.FC<RoomManagementModalProps> = ({
  isOpen,
  onClose,
  onSave,
  rooms = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    type: 'Salle de classe',
    capacity: 30,
    equipment: '',
    status: 'available'
  });

  const roomTypes = [
    'Salle de classe',
    'Laboratoire',
    'Salle informatique',
    'Salle de réunion',
    'Amphithéâtre',
    'Autre'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const equipmentList = formData.equipment.split(',').map(item => item.trim()).filter(Boolean);
    const roomData = {
      ...formData,
      id: formData.id || `ROOM-${Date.now()}`,
      equipment: equipmentList,
      nextReservation: 'Libre',
      status: 'available'
    };
    onSave(roomData);
    handleReset();
  };

  const handleEdit = (room: any) => {
    setCurrentRoom(room);
    setFormData({
      id: room.id,
      name: room.name,
      type: room.type,
      capacity: room.capacity,
      equipment: Array.isArray(room.equipment) ? room.equipment.join(', ') : room.equipment || '',
      status: room.status || 'available'
    });
    setIsEditing(true);
  };

  const handleReset = () => {
    setFormData({
      id: '',
      name: '',
      type: 'Salle de classe',
      capacity: 30,
      equipment: '',
      status: 'available'
    });
    setCurrentRoom(null);
    setIsEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
            </h2>
            <button
              onClick={() => {
                onClose();
                handleReset();
              }}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom de la salle *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Type de salle *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacité (nombre de places) *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Équipement (séparé par des virgules)
                </label>
                <input
                  type="text"
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  placeholder="Ex: Projecteur, Tableau blanc, Ordinateur"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  handleReset();
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer les modifications
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter la salle
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Liste des salles existantes */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Salles existantes</h3>
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Capacité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Équipement
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          <div className="flex items-center">
                            {room.type.includes('Laboratoire') ? (
                              <Monitor className="w-4 h-4 mr-2 text-blue-500" />
                            ) : room.type.includes('informatique') ? (
                              <Wrench className="w-4 h-4 mr-2 text-green-500" />
                            ) : (
                              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                            )}
                            {room.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {room.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {room.capacity} places
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                          {Array.isArray(room.equipment) ? room.equipment.join(', ') : room.equipment}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(room)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Implémenter la suppression si nécessaire
                              console.log('Delete room:', room.id);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Aucune salle n'a été enregistrée pour le moment.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagementModal;
