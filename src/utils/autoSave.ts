import { JournalEntry } from '../types/journal';

const AUTO_SAVE_INTERVAL = 30000; // 30 secondes
const AUTO_SAVE_KEY = 'academia_hub_autosave';

/**
 * Sauvegarde automatiquement une entrée de journal dans le localStorage
 * @param entry L'entrée de journal à sauvegarder
 */
export const autoSaveEntry = (entry: Partial<JournalEntry>) => {
  const now = new Date().toISOString();
  const entryWithTimestamp = {
    ...entry,
    lastAutoSave: now
  };
  
  localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(entryWithTimestamp));
  return now;
};

/**
 * Récupère la dernière entrée sauvegardée automatiquement
 * @returns L'entrée sauvegardée ou null si aucune sauvegarde n'existe
 */
export const getAutoSavedEntry = (): Partial<JournalEntry> | null => {
  const savedEntry = localStorage.getItem(AUTO_SAVE_KEY);
  if (!savedEntry) return null;
  
  try {
    return JSON.parse(savedEntry);
  } catch (error) {
    console.error('Erreur lors de la récupération de la sauvegarde automatique:', error);
    return null;
  }
};

/**
 * Supprime la sauvegarde automatique
 */
export const clearAutoSave = () => {
  localStorage.removeItem(AUTO_SAVE_KEY);
};

/**
 * Configure un intervalle de sauvegarde automatique
 * @param callback Fonction à appeler pour obtenir l'entrée à sauvegarder
 * @returns Fonction pour arrêter la sauvegarde automatique
 */
export const setupAutoSave = (callback: () => Partial<JournalEntry>) => {
  const intervalId = setInterval(() => {
    const entry = callback();
    autoSaveEntry(entry);
  }, AUTO_SAVE_INTERVAL);
  
  return () => clearInterval(intervalId);
};
