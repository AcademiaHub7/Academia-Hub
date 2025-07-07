export enum ResourceType {
  ACTIVITY = 'activity',
  MULTIMEDIA = 'multimedia',
  MATERIAL = 'material',
  COLLABORATIVE = 'collaborative'
}

export enum SubjectArea {
  MATH = 'math',
  SCIENCES = 'sciences',
  LANGUAGES = 'languages',
  SOCIAL = 'social',
  ARTS = 'arts',
  TECHNOLOGY = 'technology',
  PHYSICAL = 'physical'
}

export enum EducationalLevel {
  PRIMARY = 'primary',
  MIDDLE = 'middle',
  HIGH = 'high',
  SPECIAL = 'special'
}

export interface BaseResource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  subject: SubjectArea;
  level: EducationalLevel;
  createdAt: Date;
  updatedAt: Date;
  author: string;
  rating: number;
  views: number;
}

export interface ActivityResource extends BaseResource {
  type: ResourceType.ACTIVITY;
  instructions: string[];
  expectedResults: string[];
  variants: string[];
  differentiatedVersions: string[];
  duration: number; // minutes
  difficulty: number; // 1-5
}

export interface MultimediaResource extends BaseResource {
  type: ResourceType.MULTIMEDIA;
  mediaType: 'image' | 'audio' | 'video' | 'animation';
  url: string;
  thumbnailUrl: string;
  duration?: number; // seconds
  resolution?: string;
  format: string;
}

export interface MaterialResource extends BaseResource {
  type: ResourceType.MATERIAL;
  category: 'classroom' | 'lab' | 'outdoor' | 'art' | 'tech';
  technicalSheet: string;
  lowCostAlternatives: string[];
  recyclingOptions: string[];
  fabricationGuide: string;
  safetyInstructions: string[];
}

export interface CollaborativeResource extends BaseResource {
  type: ResourceType.COLLABORATIVE;
  comments: {
    author: string;
    content: string;
    createdAt: Date;
    rating: number;
  }[];
  favorites: string[];
  collections: string[];
  tags: string[];
  relatedResources: string[];
}

export type PedagogicalResource = ActivityResource | MultimediaResource | MaterialResource | CollaborativeResource;

export interface ResourceCollection {
  id: string;
  name: string;
  description: string;
  resources: string[];
  owner: string;
  sharedWith: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResourceSearchFilter {
  type?: ResourceType;
  subject?: SubjectArea;
  level?: EducationalLevel;
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'rating' | 'views' | 'date' | 'relevance';
  minRating?: number;
  minDuration?: number;
  maxDuration?: number;
}
