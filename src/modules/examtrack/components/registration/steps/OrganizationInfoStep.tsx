import React from 'react';
import { useForm } from 'react-hook-form';
import { useRegistrationStore } from '../../../stores/registrationStore';
import { Building, MapPin, FileText, Hash, Globe } from 'lucide-react';

interface OrganizationInfoForm {
  name: string;
  region: string;
  address: string;
  registrationNumber: string;
  taxNumber: string;
  website?: string;
}

const beninRegions = [
  'Alibori', 'Atacora', 'Atlantique', 'Borgou', 'Collines',
  'Couffo', 'Donga', 'Littoral', 'Mono', 'Ouémé', 'Plateau', 'Zou'
];

export const OrganizationInfoStep: React.FC = () => {
  const { updateOrganizationInfo, isLoading, currentRegistration } = useRegistrationStore();
  const { register, handleSubmit, formState: { errors } } = useForm<OrganizationInfoForm>({
    defaultValues: currentRegistration?.organizationInfo
  });

  const onSubmit = async (data: OrganizationInfoForm) => {
    await updateOrganizationInfo(data);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informations de l'Organisation
        </h2>
        <p className="text-gray-600">
          Renseignez les détails officiels de votre patronat régional.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Nom de l'organisation */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nom du Patronat *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('name', { required: 'Le nom du patronat est obligatoire' })}
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Ex: Patronat des Écoles Privées de l'Atlantique"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Région */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
            Région de Compétence *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              {...register('region', { required: 'La région est obligatoire' })}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
            >
              <option value="">Sélectionnez une région</option>
              {beninRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
          {errors.region && (
            <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>
          )}
        </div>

        {/* Adresse */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Adresse Complète *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              {...register('address', { required: 'L\'adresse est obligatoire' })}
              rows={3}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="Adresse complète du siège du patronat"
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Numéro d'enregistrement */}
          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
              N° d'Enregistrement *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('registrationNumber', { required: 'Le numéro d\'enregistrement est obligatoire' })}
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                placeholder="Ex: REG/2024/001"
              />
            </div>
            {errors.registrationNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
            )}
          </div>

          {/* Numéro fiscal */}
          <div>
            <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Numéro Fiscal *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('taxNumber', { required: 'Le numéro fiscal est obligatoire' })}
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
                placeholder="Ex: 123456789"
              />
            </div>
            {errors.taxNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.taxNumber.message}</p>
            )}
          </div>
        </div>

        {/* Site web (optionnel) */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Site Web (Optionnel)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('website')}
              type="url"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-color focus:border-transparent"
              placeholder="https://www.votre-patronat.com"
            />
          </div>
        </div>

        {/* Boutons de navigation */}
        <div className="flex justify-between">
          <button
            type="button"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color transition-colors"
          >
            Retour
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-primary-color text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Traitement...' : 'Continuer'}
          </button>
        </div>
      </form>
    </div>
  );
};