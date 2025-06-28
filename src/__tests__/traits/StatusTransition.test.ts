/**
 * Tests unitaires pour le trait StatusTransition
 * @module __tests__/traits/StatusTransition
 */

import { StatusTransition, StatusAwareModel } from '../../traits/StatusTransition';

type Status = 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';

// Classe de test qui implémente StatusAwareModel
class TestEntity implements StatusAwareModel<Status> {
  public status: Status;
  public updated_at: string;
  private statusTransition: StatusTransition<Status>;
  private transitions: Record<Status, Status[]>;

  constructor(initialStatus: Status) {
    this.status = initialStatus;
    this.updated_at = new Date().toISOString();
    
    // Définir les transitions valides
    this.transitions = {
      'draft': ['pending', 'published'],
      'pending': ['approved', 'rejected'],
      'approved': ['published', 'archived'],
      'rejected': ['draft', 'archived'],
      'published': ['archived'],
      'archived': []
    } as const;
    
    // Initialiser le gestionnaire de transitions
    this.statusTransition = new StatusTransition<Status>(this, this.transitions);
  }

  // Méthodes qui utilisent StatusTransition
  canTransitionTo(newStatus: Status): boolean {
    return this.statusTransition.isValidTransition(this.status, newStatus);
  }

  async transitionTo(newStatus: Status, options?: { before?: () => Promise<void> | void, after?: () => Promise<void> | void }): Promise<boolean> {
    if (!this.canTransitionTo(newStatus)) {
      return false;
    }
    
    // Exécuter le callback before si fourni
    if (options?.before) {
      await options.before();
    }
    
    // Mettre à jour le statut
    this.status = newStatus;
    this.updated_at = new Date().toISOString();
    
    // Exécuter le callback after si fourni
    if (options?.after) {
      await options.after();
    }
    
    return true;
  }

  getPossibleTransitions(): Status[] {
    return this.transitions[this.status] || [];
  }

  isInStatus(status: Status | Status[]): boolean {
    const statuses = Array.isArray(status) ? status : [status];
    return statuses.includes(this.status);
  }
}

describe('StatusTransition Trait', () => {
  describe('canTransitionTo', () => {
    it('should check if transition is valid', () => {
      const entity = new TestEntity('draft');
      
      expect(entity.canTransitionTo('pending')).toBe(true);
      expect(entity.canTransitionTo('published')).toBe(true);
      expect(entity.canTransitionTo('approved')).toBe(false);
    });

    it('should return false for invalid transition', () => {
      const entity = new TestEntity('published');
      
      expect(entity.canTransitionTo('draft')).toBe(false);
      expect(entity.canTransitionTo('pending')).toBe(false);
      expect(entity.canTransitionTo('rejected')).toBe(false);
    });

    it('should return false for same status', () => {
      const entity = new TestEntity('draft');
      
      expect(entity.canTransitionTo('draft')).toBe(false);
    });
  });

  describe('transitionTo', () => {
    it('should transition to valid status', () => {
      const entity = new TestEntity('draft');
      
      const result = entity.transitionTo('pending');
      
      expect(result).toBe(true);
      expect(entity.status).toBe('pending');
    });

    it('should not transition to invalid status', () => {
      const entity = new TestEntity('draft');
      
      const result = entity.transitionTo('approved');
      
      expect(result).toBe(false);
      expect(entity.status).toBe('draft'); // Status unchanged
    });

    it('should execute before and after callbacks', async () => {
      const entity = new TestEntity('pending');
      const beforeCallback = jest.fn();
      const afterCallback = jest.fn();
      
      const result = await entity.transitionTo('approved', {
        before: async () => beforeCallback(),
        after: async () => afterCallback()
      });
      
      expect(result).toBe(true);
      expect(entity.status).toBe('approved');
      expect(beforeCallback).toHaveBeenCalledTimes(1);
      expect(afterCallback).toHaveBeenCalledTimes(1);
    });

    it('should execute callbacks in correct order', async () => {
      const entity = new TestEntity('pending');
      const callOrder: string[] = [];
      
      const result = await entity.transitionTo('approved', {
        before: async () => { callOrder.push('before'); },
        after: async () => { callOrder.push('after'); }
      });
      
      expect(result).toBe(true);
      expect(callOrder).toEqual(['before', 'after']);
    });

    it('should not execute callbacks for invalid transition', async () => {
      const entity = new TestEntity('draft');
      const beforeCallback = jest.fn();
      const afterCallback = jest.fn();
      
      const result = await entity.transitionTo('approved', {
        before: async () => beforeCallback(),
        after: async () => afterCallback()
      });
      
      expect(result).toBe(false);
      expect(beforeCallback).not.toHaveBeenCalled();
      expect(afterCallback).not.toHaveBeenCalled();
    });
  });

  describe('getPossibleTransitions', () => {
    it('should get all possible transitions for current status', () => {
      const entity = new TestEntity('draft');
      
      const transitions = entity.getPossibleTransitions();
      
      expect(transitions).toEqual(['pending', 'published']);
    });

    it('should return empty array for terminal status', () => {
      const entity = new TestEntity('archived');
      
      const transitions = entity.getPossibleTransitions();
      
      expect(transitions).toEqual([]);
    });
  });

  describe('isInStatus', () => {
    it('should check if entity is in specific status', () => {
      const entity = new TestEntity('pending');
      
      expect(entity.isInStatus('pending')).toBe(true);
      expect(entity.isInStatus('draft')).toBe(false);
    });

    it('should check if entity is in one of multiple statuses', () => {
      const entity = new TestEntity('approved');
      
      expect(entity.isInStatus(['draft', 'approved', 'published'])).toBe(true);
      expect(entity.isInStatus(['draft', 'pending'])).toBe(false);
    });
  });

  describe('Complex transition paths', () => {
    it('should handle multi-step transitions correctly', () => {
      const entity = new TestEntity('draft');
      
      // Draft -> Pending -> Approved -> Published -> Archived
      expect(entity.transitionTo('pending')).toBe(true);
      expect(entity.status).toBe('pending');
      
      expect(entity.transitionTo('approved')).toBe(true);
      expect(entity.status).toBe('approved');
      
      expect(entity.transitionTo('published')).toBe(true);
      expect(entity.status).toBe('published');
      
      expect(entity.transitionTo('archived')).toBe(true);
      expect(entity.status).toBe('archived');
      
      // No further transitions possible from archived
      expect(entity.getPossibleTransitions()).toEqual([]);
      expect(entity.canTransitionTo('draft')).toBe(false);
    });

    it('should handle alternative paths correctly', () => {
      const entity = new TestEntity('draft');
      
      // Draft -> Pending -> Rejected -> Draft
      expect(entity.transitionTo('pending')).toBe(true);
      expect(entity.transitionTo('rejected')).toBe(true);
      expect(entity.transitionTo('draft')).toBe(true);
      expect(entity.status).toBe('draft');
      
      // Draft -> Published -> Archived
      expect(entity.transitionTo('published')).toBe(true);
      expect(entity.transitionTo('archived')).toBe(true);
      expect(entity.status).toBe('archived');
    });
  });
});
