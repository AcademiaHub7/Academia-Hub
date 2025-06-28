/**
 * Utilitaire de journalisation pour l'application
 * @module utils/logger
 */

/**
 * Niveaux de log disponibles
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Configuration du logger
 */
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteUrl?: string;
}

/**
 * Configuration par défaut
 */
const defaultConfig: LoggerConfig = {
  level: LogLevel.INFO,
  enableConsole: true,
  enableRemote: false,
};

/**
 * Classe Logger pour gérer les logs de l'application
 */
class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Configure le logger
   * @param config - Configuration partielle à appliquer
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Log de niveau debug
   * @param message - Message à logger
   * @param data - Données additionnelles
   */
  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Log de niveau info
   * @param message - Message à logger
   * @param data - Données additionnelles
   */
  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Log de niveau warn
   * @param message - Message à logger
   * @param data - Données additionnelles
   */
  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Log de niveau error
   * @param message - Message à logger
   * @param data - Données additionnelles
   */
  error(message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, message, data);
  }

  /**
   * Méthode générique de log
   * @param level - Niveau de log
   * @param message - Message à logger
   * @param data - Données additionnelles
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    // Ne pas logger si le niveau est inférieur à celui configuré
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      const logEntry = {
        timestamp,
        level,
        message,
        data,
      };

      // Log dans la console si activé
      if (this.config.enableConsole) {
        this.logToConsole(level, logEntry);
      }

      // Log vers un service distant si activé
      if (this.config.enableRemote && this.config.remoteUrl) {
        this.logToRemote(logEntry);
      }
    }
  }

  /**
   * Détermine si un niveau de log doit être traité
   * @param level - Niveau de log à vérifier
   * @returns boolean
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const configLevelIndex = levels.indexOf(this.config.level);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= configLevelIndex;
  }

  /**
   * Log dans la console
   * @param level - Niveau de log
   * @param logEntry - Entrée de log
   */
  private logToConsole(level: LogLevel, logEntry: any): void {
    const { timestamp, message, data } = logEntry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, data !== undefined ? data : '');
        break;
      case LogLevel.INFO:
        console.info(prefix, message, data !== undefined ? data : '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, data !== undefined ? data : '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, data !== undefined ? data : '');
        break;
    }
  }

  /**
   * Log vers un service distant
   * @param logEntry - Entrée de log
   */
  private logToRemote(logEntry: any): void {
    // Implémentation pour envoyer les logs à un service distant
    // Cette méthode pourrait utiliser fetch ou axios pour envoyer les logs
    try {
      fetch(this.config.remoteUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      }).catch((error) => {
        console.error('Erreur lors de l\'envoi du log au service distant:', error);
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du log au service distant:', error);
    }
  }
}

// Exporter une instance singleton du logger
export const logger = new Logger();

export default logger;
