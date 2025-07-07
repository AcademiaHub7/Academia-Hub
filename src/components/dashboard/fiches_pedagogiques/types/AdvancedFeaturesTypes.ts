export interface AIAnalysis {
  generatedInstructions: string[];
  suggestedActivities: {
    title: string;
    description: string;
    duration: number;
    difficulty: number;
  }[];
  studentChallenges: {
    difficultyLevel: number;
    commonStruggles: string[];
    recommendedStrategies: string[];
  };
  timeOptimization: {
    estimatedDuration: number;
    optimizedDuration: number;
    recommendations: string[];
  };
  inconsistencies: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    suggestedFix: string;
  }[];
}

export interface CollaborationState {
  coEditing: {
    activeUsers: {
      userId: string;
      name: string;
      role: string;
      lastEdit: Date;
    }[];
    changes: {
      userId: string;
      timestamp: Date;
      changes: Record<string, any>;
    }[];
  };
  peerReview: {
    reviews: {
      reviewerId: string;
      comments: string;
      rating: number;
      timestamp: Date;
    }[];
    averageScore: number;
  };
  mentorship: {
    mentors: {
      userId: string;
      expertise: string[];
      availability: string[];
    }[];
    feedback: string[];
  };
}

export interface PersonalizationProfile {
  teacherProfile: {
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    teachingStyle: string[];
    preferredMethodologies: string[];
  };
  preferences: {
    activityTypes: string[];
    durationRanges: {
      min: number;
      max: number;
    };
    difficultyLevels: number[];
  };
  history: {
    previousFiches: {
      ficheId: string;
      successRate: number;
      feedback: string;
    }[];
  };
  recommendations: {
    activities: string[];
    methodologies: string[];
    improvements: string[];
  };
}

export interface ExternalIntegration {
  externalSystems: {
    lms: string[];
    nationalFrameworks: string[];
    thirdPartyTools: string[];
  };
  syncStatus: {
    lastSync: Date;
    status: 'success' | 'pending' | 'error';
    errors: string[];
  };
  apiEndpoints: {
    available: string[];
    active: string[];
  };
  resourceConnections: {
    connected: string[];
    available: string[];
  };
}
