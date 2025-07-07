import { Fiche } from '../types';

export enum FicheViewMode {
  OFFICIAL = 'official',
  EDIT = 'edit',
  REVIEW = 'review',
  PRESENTATION = 'presentation'
}

export interface NavigationState {
  currentPath: string[];
  history: string[];
  bookmarks: Record<string, string>;
  lastVisited: Record<string, Date>;
}

export interface FicheViewContext {
  mode: FicheViewMode;
  setMode: (mode: FicheViewMode) => void;
  fiche: Fiche | null;
  updateFiche: (updates: Partial<Fiche>) => void;
  navigation: NavigationState;
  updateNavigation: (state: Partial<NavigationState>) => void;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export interface UserPreferences {
  theme: string;
  layout: string;
  shortcuts: Record<string, string>;
  panelPositions: Record<string, string>;
  inputPreferences: Record<string, string>;
}

export interface FicheViewProps {
  fiche: Fiche;
  mode: FicheViewMode;
  onModeChange: (mode: FicheViewMode) => void;
  onFicheUpdate: (updates: Partial<Fiche>) => void;
  navigation: NavigationState;
  onNavigationUpdate: (state: Partial<NavigationState>) => void;
  preferences: UserPreferences;
  onPreferencesUpdate: (prefs: Partial<UserPreferences>) => void;
}
