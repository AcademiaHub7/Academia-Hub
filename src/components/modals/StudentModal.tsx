import React, { useState } from 'react';
import FormModal from './FormModal';
import { Save, User, Calendar, Phone, Mail, MapPin, Upload, Heart, BookOpen } from 'lucide-react';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: any) => void;
  studentData?: any;
  isEdit?: boolean;
  classes?: any[];
}

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentData,
  isEdit = false,
  classes = []
}) => {
  const defaultClasses = [
    { id: 'CLS-001', name: '6ème A' },
    { id: 'CLS-002', name: '5ème B' },
    { id: 'CLS-003', name: '4ème A' },
    { id: 'CLS-004', name: '3ème A' },
    { id: 'CLS-005', name: '2nde B' },
    { id: 'CLS-006', name: '1ère C' },
    { id: 'CLS-007', name: 'Terminale S' }
  ];

  const allClasses = classes.length > 0 ? classes : defaultClasses;

  const [formData, setFormData] = useState({
    matricule: studentData?.matricule || generateMatricule(),
    firstName: studentData?.firstName || '',
    lastName: studentData?.lastName || '',
    gender: studentData?.gender || '',
    dateOfBirth: studentData?.dateOfBirth || '',
    placeOfBirth: studentData?.placeOfBirth || '',
    address: studentData?.address || '',
    phone: studentData?.phone || '',
    email: studentData?.email || '',
    classId: studentData?.classId || '',
    enrollmentDate: studentData?.enrollmentDate || new Date().toISOString().split('T')[0],
    status: studentData?.status || 'active',
    parentInfo: {
      firstName: studentData?.parentInfo?.firstName || '',
      lastName: studentData?.parentInfo?.lastName || '',
      relationship: studentData?.parentInfo?.relationship || '',
      phone: studentData?.parentInfo?.phone || '',
      email: studentData?.parentInfo?.email || '',
      address: studentData?.parentInfo?.address || '',
      profession: studentData?.parentInfo?.profession || ''
    },
    medicalInfo: {
      bloodType: studentData?.medicalInfo?.bloodType || '',
      allergies: studentData?.medicalInfo?.allergies || '',
      chronicConditions: studentData?.medicalInfo?.chronicConditions || '',
      medications: studentData?.medicalInfo?.medications || '',
      emergencyContact: studentData?.medicalInfo?.emergencyContact || ''
    },
    documents: studentData?.documents || [],
    notes: studentData?.notes || ''
  });

  function generateMatricule() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
    return `MAT-${year}-${random}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocuments = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        // Dans une implémentation réelle, vous téléchargeriez le fichier et stockeriez l'URL
        url: URL.createObjectURL(file)
      }));
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments]
      }));
    }
  };

  const handleRemoveDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Modifier un élève" : "Ajouter un nouvel élève"}
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="student-form"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {isEdit ? "Mettre à jour" : "Enregistrer"}
          </button>
        </div>
      }
    >
      <form id="student-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Informations de l'élève
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="matricule" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Matricule*
              </label>
              <input
                type="text"
                id="matricule"
                name="matricule"
                value={formData.matricule}
                onChange={handleChange}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prénom*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Genre*
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date de naissance*
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lieu de naissance
              </label>
              <input
                type="text"
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="md:col-span-3">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photo
              </label>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <label className="px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer">
                  <span>Choisir une photo</span>
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Informations scolaires */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
            Informations scolaires
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="classId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Classe*
              </label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner une classe</option>
                {allClasses.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="enrollmentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date d'inscription*
              </label>
              <input
                type="date"
                id="enrollmentDate"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Statut*
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="transferred">Transféré</option>
                <option value="graduated">Diplômé</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Informations des parents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-600 dark:text-purple-400" />
            Informations du parent/tuteur
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="parentInfo.firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prénom*
              </label>
              <input
                type="text"
                id="parentInfo.firstName"
                name="parentInfo.firstName"
                value={formData.parentInfo.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="parentInfo.lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom*
              </label>
              <input
                type="text"
                id="parentInfo.lastName"
                name="parentInfo.lastName"
                value={formData.parentInfo.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="parentInfo.relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Lien de parenté*
              </label>
              <select
                id="parentInfo.relationship"
                name="parentInfo.relationship"
                value={formData.parentInfo.relationship}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner</option>
                <option value="Père">Père</option>
                <option value="Mère">Mère</option>
                <option value="Tuteur">Tuteur</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="parentInfo.phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Téléphone*
              </label>
              <input
                type="tel"
                id="parentInfo.phone"
                name="parentInfo.phone"
                value={formData.parentInfo.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="parentInfo.email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="parentInfo.email"
                name="parentInfo.email"
                value={formData.parentInfo.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="parentInfo.profession" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profession
              </label>
              <input
                type="text"
                id="parentInfo.profession"
                name="parentInfo.profession"
                value={formData.parentInfo.profession}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="parentInfo.address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse
              </label>
              <textarea
                id="parentInfo.address"
                name="parentInfo.address"
                value={formData.parentInfo.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
        
        {/* Informations médicales */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2 text-red-600 dark:text-red-400" />
            Informations médicales
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="medicalInfo.bloodType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Groupe sanguin
              </label>
              <select
                id="medicalInfo.bloodType"
                name="medicalInfo.bloodType"
                value={formData.medicalInfo.bloodType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Sélectionner</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="medicalInfo.allergies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Allergies
              </label>
              <input
                type="text"
                id="medicalInfo.allergies"
                name="medicalInfo.allergies"
                value={formData.medicalInfo.allergies}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Séparées par des virgules"
              />
            </div>
            
            <div>
              <label htmlFor="medicalInfo.chronicConditions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Conditions chroniques
              </label>
              <input
                type="text"
                id="medicalInfo.chronicConditions"
                name="medicalInfo.chronicConditions"
                value={formData.medicalInfo.chronicConditions}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Asthme, diabète, etc."
              />
            </div>
            
            <div>
              <label htmlFor="medicalInfo.medications" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Médicaments
              </label>
              <input
                type="text"
                id="medicalInfo.medications"
                name="medicalInfo.medications"
                value={formData.medicalInfo.medications}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Médicaments réguliers"
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="medicalInfo.emergencyContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact d'urgence
              </label>
              <input
                type="text"
                id="medicalInfo.emergencyContact"
                name="medicalInfo.emergencyContact"
                value={formData.medicalInfo.emergencyContact}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Nom et téléphone"
              />
            </div>
          </div>
        </div>
        
        {/* Documents */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-orange-600 dark:text-orange-400" />
            Documents
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 cursor-pointer flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                <span>Ajouter des documents</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                Formats acceptés: PDF, JPG, PNG (max 5MB)
              </span>
            </div>
            
            {formData.documents.length > 0 ? (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Nom
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Taille
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.documents.map((doc, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {doc.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {doc.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {(doc.size / 1024).toFixed(2)} KB
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(index)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                Aucun document ajouté
              </div>
            )}
          </div>
        </div>
        
        {/* Notes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Notes et observations
          </h4>
          
          <div>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Notes supplémentaires sur l'élève..."
            />
          </div>
        </div>
      </form>
    </FormModal>
  );
};

export default StudentModal;