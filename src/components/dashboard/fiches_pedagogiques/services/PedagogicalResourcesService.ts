import { 
  ResourceType, 
  SubjectArea, 
  EducationalLevel, 
  PedagogicalResource, 
  ResourceCollection, 
  ResourceSearchFilter 
} from '../types/PedagogicalResourcesTypes';

export class PedagogicalResourcesService {
  private static instance: PedagogicalResourcesService;
  private resources: PedagogicalResource[] = [];
  private collections: ResourceCollection[] = [];

  private constructor() {}

  public static getInstance(): PedagogicalResourcesService {
    if (!PedagogicalResourcesService.instance) {
      PedagogicalResourcesService.instance = new PedagogicalResourcesService();
    }
    return PedagogicalResourcesService.instance;
  }

  // Gestion des ressources
  public addResource(resource: PedagogicalResource): PedagogicalResource {
    resource.id = this.generateId();
    resource.createdAt = new Date();
    resource.updatedAt = new Date();
    this.resources.push(resource);
    return resource;
  }

  public getResource(id: string): PedagogicalResource | null {
    return this.resources.find(r => r.id === id) || null;
  }

  public updateResource(resource: PedagogicalResource): PedagogicalResource {
    const index = this.resources.findIndex(r => r.id === resource.id);
    if (index !== -1) {
      this.resources[index] = {
        ...this.resources[index],
        ...resource,
        updatedAt: new Date()
      };
    }
    return this.resources[index];
  }

  public deleteResource(id: string): boolean {
    const index = this.resources.findIndex(r => r.id === id);
    if (index !== -1) {
      this.resources.splice(index, 1);
      return true;
    }
    return false;
  }

  // Recherche et filtrage
  public searchResources(filter: ResourceSearchFilter): PedagogicalResource[] {
    let filtered = this.resources;

    if (filter.type) {
      filtered = filtered.filter(r => r.type === filter.type);
    }

    if (filter.subject) {
      filtered = filtered.filter(r => r.subject === filter.subject);
    }

    if (filter.level) {
      filtered = filtered.filter(r => r.level === filter.level);
    }

    if (filter.tags?.length) {
      filtered = filtered.filter(r => 
        filter.tags.some(tag => r.tags?.includes(tag))
      );
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) || 
        r.description.toLowerCase().includes(query)
      );
    }

    if (filter.minRating) {
      filtered = filtered.filter(r => r.rating >= filter.minRating);
    }

    if (filter.minDuration && filter.maxDuration) {
      filtered = filtered.filter(r => 
        r.duration >= filter.minDuration && r.duration <= filter.maxDuration
      );
    }

    // Tri
    switch (filter.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'date':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'relevance':
        if (filter.searchQuery) {
          filtered.sort((a, b) => {
            const aMatch = (a.title + a.description).toLowerCase().includes(filter.searchQuery.toLowerCase());
            const bMatch = (b.title + b.description).toLowerCase().includes(filter.searchQuery.toLowerCase());
            return bMatch - aMatch;
          });
        }
        break;
    }

    return filtered;
  }

  // Gestion des collections
  public addCollection(collection: ResourceCollection): ResourceCollection {
    collection.id = this.generateId();
    collection.createdAt = new Date();
    collection.updatedAt = new Date();
    this.collections.push(collection);
    return collection;
  }

  public addToCollection(collectionId: string, resourceId: string): boolean {
    const collection = this.collections.find(c => c.id === collectionId);
    if (collection && !collection.resources.includes(resourceId)) {
      collection.resources.push(resourceId);
      collection.updatedAt = new Date();
      return true;
    }
    return false;
  }

  // Collaboratif
  public addComment(resourceId: string, comment: any): boolean {
    const resource = this.resources.find(r => r.id === resourceId) as CollaborativeResource;
    if (resource) {
      resource.comments.push(comment);
      resource.updatedAt = new Date();
      return true;
    }
    return false;
  }

  public addFavorite(userId: string, resourceId: string): boolean {
    const resource = this.resources.find(r => r.id === resourceId) as CollaborativeResource;
    if (resource && !resource.favorites.includes(userId)) {
      resource.favorites.push(userId);
      resource.updatedAt = new Date();
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
