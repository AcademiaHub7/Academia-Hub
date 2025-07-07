import { v4 as uuidv4 } from 'uuid';
import { 
  Template, 
  TemplateWithStats, 
  TemplateVersion, 
  TEMPLATE_SUBJECTS,
  TemplateSubject,
  DEFAULT_TEMPLATES
} from '../types/template';

// Simulated database
let templatesDb: Record<string, TemplateWithStats> = {};

// Initialize with default templates
Object.entries(DEFAULT_TEMPLATES).forEach(([subject, template]) => {
  const templateId = uuidv4();
  const now = new Date().toISOString();
  
  templatesDb[templateId] = {
    ...template,
    id: templateId,
    subject: subject as TemplateSubject,
    createdAt: now,
    updatedAt: now,
    createdBy: 'system',
    versions: [{
      version: '1.0.0',
      createdAt: now,
      createdBy: 'system',
      changes: 'Version initiale',
      template: { ...template, id: templateId }
    }],
    sharing: {
      sharedWith: [],
      sharedBy: 'system',
      sharedAt: now,
      canEdit: false
    },
    comments: [],
    stats: {
      timesUsed: 0,
      userRatings: {},
      feedback: []
    }
  };
});

export const templateService = {
  // Get all templates for a user
  async getUserTemplates(userId: string, filter?: {
    subject?: TemplateSubject;
    search?: string;
    shared?: boolean;
    isDefault?: boolean;
  }) {
    let templates = Object.values(templatesDb);
    
    // Filter by user access
    templates = templates.filter(t => 
      t.createdBy === userId || 
      t.isDefault || 
      t.sharing.sharedWith.includes(userId)
    );

    // Apply filters
    if (filter) {
      if (filter.subject) {
        templates = templates.filter(t => t.subject === filter.subject);
      }
      if (filter.search) {
        const search = filter.search.toLowerCase();
        templates = templates.filter(t => 
          t.name.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.tags.some(tag => tag.toLowerCase().includes(search))
        );
      }
      if (filter.shared !== undefined) {
        templates = templates.filter(t => t.sharing.sharedWith.length > 0 === filter.shared);
      }
      if (filter.isDefault !== undefined) {
        templates = templates.filter(t => t.isDefault === filter.isDefault);
      }
    }

    return templates;
  },

  // Get a template by ID
  async getTemplateById(templateId: string, userId: string): Promise<TemplateWithStats | null> {
    const template = templatesDb[templateId];
    
    if (!template) return null;
    
    // Check access
    if (template.createdBy !== userId && 
        !template.isDefault && 
        !template.sharing.sharedWith.includes(userId)) {
      throw new Error('Accès non autorisé à ce template');
    }

    return template;
  },

  // Create a new template
  async createTemplate(templateData: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'versions'>, userId: string): Promise<TemplateWithStats> {
    const templateId = uuidv4();
    const now = new Date().toISOString();
    
    const newTemplate: TemplateWithStats = {
      ...templateData,
      id: templateId,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      isDefault: false,
      versions: [{
        version: '1.0.0',
        createdAt: now,
        createdBy: userId,
        changes: 'Version initiale',
        template: { ...templateData, id: templateId }
      }],
      sharing: {
        sharedWith: [],
        sharedBy: userId,
        sharedAt: now,
        canEdit: false
      },
      comments: [],
      stats: {
        timesUsed: 0,
        userRatings: {},
        feedback: []
      }
    };

    templatesDb[templateId] = newTemplate;
    return newTemplate;
  },

  // Update a template
  async updateTemplate(
    templateId: string, 
    updates: Partial<Omit<Template, 'id' | 'createdAt' | 'createdBy' | 'isDefault'>>,
    userId: string,
    changes: string = 'Mise à jour du template'
  ): Promise<TemplateWithStats> {
    const existing = await this.getTemplateById(templateId, userId);
    
    if (!existing) {
      throw new Error('Template non trouvé');
    }

    // Check edit permissions
    if (existing.createdBy !== userId && 
        !(existing.sharing.sharedWith.includes(userId) && existing.sharing.canEdit)) {
      throw new Error('Vous n\'avez pas les droits pour modifier ce template');
    }

    const now = new Date().toISOString();
    const updatedTemplate: TemplateWithStats = {
      ...existing,
      ...updates,
      updatedAt: now,
      versions: [
        ...existing.versions,
        {
          version: this.incrementVersion(existing.versions[0].version),
          createdAt: now,
          createdBy: userId,
          changes,
          template: { ...existing, ...updates, versions: [] }
        }
      ]
    };

    templatesDb[templateId] = updatedTemplate;
    return updatedTemplate;
  },

  // Delete a template
  async deleteTemplate(templateId: string, userId: string): Promise<boolean> {
    const template = await this.getTemplateById(templateId, userId);
    
    if (!template) return false;
    
    // Only the creator can delete
    if (template.createdBy !== userId) {
      throw new Error('Vous n\'avez pas les droits pour supprimer ce template');
    }

    if (template.isDefault) {
      throw new Error('Impossible de supprimer un template par défaut');
    }

    delete templatesDb[templateId];
    return true;
  },

  // Share a template
  async shareTemplate(
    templateId: string, 
    userId: string, 
    userIds: string[], 
    canEdit: boolean = false
  ): Promise<TemplateWithStats> {
    const template = await this.getTemplateById(templateId, userId);
    
    if (!template) {
      throw new Error('Template non trouvé');
    }

    // Only the creator can share
    if (template.createdBy !== userId) {
      throw new Error('Vous n\'avez pas les droits pour partager ce template');
    }

    const updatedTemplate: TemplateWithStats = {
      ...template,
      sharing: {
        ...template.sharing,
        sharedWith: [...new Set([...template.sharing.sharedWith, ...userIds])],
        canEdit: template.sharing.canEdit || canEdit
      }
    };

    templatesDb[templateId] = updatedTemplate;
    return updatedTemplate;
  },

  // Add a comment to a template
  async addComment(
    templateId: string, 
    userId: string, 
    userName: string, 
    content: string, 
    parentCommentId?: string
  ): Promise<TemplateWithStats> {
    const template = await this.getTemplateById(templateId, userId);
    
    if (!template) {
      throw new Error('Template non trouvé');
    }

    const comment = {
      id: uuidv4(),
      userId,
      userName,
      content,
      createdAt: new Date().toISOString(),
      replies: []
    };

    const updatedTemplate = { ...template };
    
    if (parentCommentId) {
      // Add as a reply
      const addReply = (comments: any[]): boolean => {
        for (const c of comments) {
          if (c.id === parentCommentId) {
            c.replies.push(comment);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (addReply(c.replies)) return true;
          }
        }
        return false;
      };
      
      if (!addReply(updatedTemplate.comments)) {
        throw new Error('Commentaire parent non trouvé');
      }
    } else {
      // Add as a top-level comment
      updatedTemplate.comments = [comment, ...updatedTemplate.comments];
    }

    templatesDb[templateId] = updatedTemplate;
    return updatedTemplate;
  },

  // Rate a template
  async rateTemplate(
    templateId: string, 
    userId: string, 
    rating: number, 
    feedback?: string
  ): Promise<TemplateWithStats> {
    const template = await this.getTemplateById(templateId, userId);
    
    if (!template) {
      throw new Error('Template non trouvé');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('La note doit être comprise entre 1 et 5');
    }

    const updatedTemplate: TemplateWithStats = {
      ...template,
      stats: {
        ...template.stats,
        userRatings: {
          ...template.stats.userRatings,
          [userId]: rating
        },
        averageRating: this.calculateAverageRating({
          ...template.stats.userRatings,
          [userId]: rating
        }),
        feedback: feedback 
          ? [...template.stats.feedback, feedback] 
          : template.stats.feedback
      }
    };

    templatesDb[templateId] = updatedTemplate;
    return updatedTemplate;
  },

  // Helper to increment version number
  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  },

  // Helper to calculate average rating
  private calculateAverageRating(ratings: Record<string, number>): number {
    const values = Object.values(ratings);
    if (values.length === 0) return 0;
    return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
  },

  // Create a new template based on an existing one
  async createTemplateFromExisting(
    templateId: string, 
    userId: string, 
    name: string,
    description: string = ''
  ): Promise<TemplateWithStats> {
    const existing = await this.getTemplateById(templateId, userId);
    
    if (!existing) {
      throw new Error('Template source non trouvé');
    }

    // Create a deep copy
    const templateCopy = JSON.parse(JSON.stringify(existing));
    
    // Update metadata for the new template
    return this.createTemplate({
      ...templateCopy,
      name,
      description: description || existing.description,
      isDefault: false,
      createdBy: userId,
      versions: [],
      sharing: {
        sharedWith: [],
        sharedBy: userId,
        sharedAt: new Date().toISOString(),
        canEdit: false
      },
      stats: {
        timesUsed: 0,
        userRatings: {},
        feedback: []
      },
      comments: []
    }, userId);
  },

  // Get default templates for a subject
  async getDefaultTemplates(subject?: TemplateSubject): Promise<TemplateWithStats[]> {
    let templates = Object.values(templatesDb).filter(t => t.isDefault);
    
    if (subject) {
      templates = templates.filter(t => t.subject === subject);
    }
    
    return templates;
  },

  // Validate template against APC standards
  validateTemplate(template: Template): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check required fields
    if (!template.name) errors.push('Le nom du template est requis');
    if (!template.subject) errors.push('La matière est requise');
    
    // Check planning sections
    const requiredSections = template.planningSections.filter(s => s.required);
    if (requiredSections.length === 0) {
      errors.push('Au moins une section de planification est requise');
    }
    
    // Check procedure table
    if (!template.procedureTable.columns.some(c => c.id === 'instruction')) {
      errors.push('La colonne "Consigne" est requise dans le tableau de procédure');
    }
    
    // Check steps
    if (template.steps.length === 0) {
      errors.push('Au moins une étape est requise');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};
