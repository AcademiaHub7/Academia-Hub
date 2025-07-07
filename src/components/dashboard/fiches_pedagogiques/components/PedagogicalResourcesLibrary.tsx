import React, { useState, useEffect } from 'react';
import {
  ResourceType,
  SubjectArea,
  EducationalLevel,
  PedagogicalResource,
  ResourceSearchFilter,
  ActivityResource,
  MultimediaResource,
  CollaborativeResource
} from '../types/PedagogicalResourcesTypes';
import { PedagogicalResourcesService } from '../services/PedagogicalResourcesService';

interface ResourceCardProps {
  resource: PedagogicalResource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const service = PedagogicalResourcesService.getInstance();
  const isCollaborative = resource.type === ResourceType.COLLABORATIVE;

  const handleFavorite = () => {
    if (isCollaborative) {
      service.addFavorite('user-id', resource.id);
    }
  };

  return (
    <div className="resource-card">
      <div className="resource-header">
        <h3>{resource.title}</h3>
        <span className="resource-type">{resource.type}</span>
      </div>
      <div className="resource-content">
        <p>{resource.description}</p>
        {resource.type === ResourceType.ACTIVITY && (
          <div className="activity-details">
            <p>Duration: {(resource as ActivityResource).duration} min</p>
            <p>Difficulty: {(resource as ActivityResource).difficulty}/5</p>
          </div>
        )}
        {resource.type === ResourceType.MULTIMEDIA && (
          <div className="multimedia-preview">
            <img 
              src={(resource as MultimediaResource).thumbnailUrl} 
              alt={resource.title} 
            />
          </div>
        )}
      </div>
      <div className="resource-footer">
        <button onClick={handleFavorite}>
          {isCollaborative && (resource as CollaborativeResource).favorites?.includes('user-id') ? '⭐️' : '☆'}
        </button>
        <span>Rating: {resource.rating}</span>
        <span>Views: {resource.views}</span>
      </div>
    </div>
  );
};

const ResourceFilter: React.FC = () => {
  const [filters, setFilters] = useState<ResourceSearchFilter>({});
  const [resources, setResources] = useState<PedagogicalResource[]>([]);
  const service = PedagogicalResourcesService.getInstance();

  useEffect(() => {
    const filteredResources = service.searchResources(filters);
    setResources(filteredResources);
  }, [filters]);

  const handleFilterChange = (field: keyof ResourceSearchFilter, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="resource-filter">
      <div className="filter-group">
        <select
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value as ResourceType)}
        >
          <option value="">All Types</option>
          <option value={ResourceType.ACTIVITY}>Activities</option>
          <option value={ResourceType.MULTIMEDIA}>Multimedia</option>
          <option value={ResourceType.MATERIAL}>Materials</option>
          <option value={ResourceType.COLLABORATIVE}>Collaborative</option>
        </select>

        <select
          value={filters.subject || ''}
          onChange={(e) => handleFilterChange('subject', e.target.value as SubjectArea)}
        >
          <option value="">All Subjects</option>
          <option value={SubjectArea.MATH}>Math</option>
          <option value={SubjectArea.SCIENCES}>Sciences</option>
          <option value={SubjectArea.LANGUAGES}>Languages</option>
          <option value={SubjectArea.SOCIAL}>Social</option>
          <option value={SubjectArea.ARTS}>Arts</option>
          <option value={SubjectArea.TECHNOLOGY}>Technology</option>
          <option value={SubjectArea.PHYSICAL}>Physical</option>
        </select>

        <select
          value={filters.level || ''}
          onChange={(e) => handleFilterChange('level', e.target.value as EducationalLevel)}
        >
          <option value="">All Levels</option>
          <option value={EducationalLevel.PRIMARY}>Primary</option>
          <option value={EducationalLevel.MIDDLE}>Middle</option>
          <option value={EducationalLevel.HIGH}>High</option>
          <option value={EducationalLevel.SPECIAL}>Special</option>
        </select>
      </div>

      <div className="search-input">
        <input
          type="text"
          placeholder="Search resources..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        />
      </div>

      <div className="resource-list">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourceFilter;
