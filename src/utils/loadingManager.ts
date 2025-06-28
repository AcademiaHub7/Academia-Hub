/**
 * Loading Manager Utility
 * 
 * This utility helps manage the application loading state and provides
 * functions to simulate loading progress for the Academia Hub loading page.
 */

type LoadingCallback = (progress: number) => void;
type LoadingCompleteCallback = () => void;

interface LoadingManagerOptions {
  minLoadTime?: number;
  maxLoadTime?: number;
  onProgress?: LoadingCallback;
  onComplete?: LoadingCompleteCallback;
}

class LoadingManager {
  private progress: number = 0;
  private isLoading: boolean = true;
  private progressCallback: LoadingCallback | null = null;
  private completeCallback: LoadingCompleteCallback | null = null;
  private minLoadTime: number;
  private maxLoadTime: number;
  private loadStartTime: number;
  private progressInterval: NodeJS.Timeout | null = null;

  constructor(options: LoadingManagerOptions = {}) {
    this.minLoadTime = options.minLoadTime || 2000; // Minimum 2 seconds
    this.maxLoadTime = options.maxLoadTime || 6000; // Maximum 6 seconds
    this.progressCallback = options.onProgress || null;
    this.completeCallback = options.onComplete || null;
    this.loadStartTime = Date.now();
  }

  /**
   * Start the loading simulation
   */
  public startLoading(): void {
    this.isLoading = true;
    this.progress = 0;
    this.loadStartTime = Date.now();
    
    // Clear any existing interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    // Create a new interval to update progress
    this.progressInterval = setInterval(() => {
      const elapsed = Date.now() - this.loadStartTime;
      const targetProgress = Math.min(elapsed / this.maxLoadTime * 100, 99);
      
      // Gradually approach the target progress
      if (this.progress < targetProgress) {
        this.progress = Math.min(this.progress + 1, targetProgress);
        
        if (this.progressCallback) {
          this.progressCallback(this.progress);
        }
      }
      
      // Check if we should complete loading
      if (elapsed >= this.minLoadTime && this.progress >= 99) {
        this.completeLoading();
      }
    }, 30);
  }

  /**
   * Manually set the loading progress
   */
  public setProgress(progress: number): void {
    this.progress = Math.max(0, Math.min(99, progress));
    
    if (this.progressCallback) {
      this.progressCallback(this.progress);
    }
  }

  /**
   * Complete the loading process
   */
  public completeLoading(): void {
    if (!this.isLoading) return;
    
    this.isLoading = false;
    this.progress = 100;
    
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    
    if (this.progressCallback) {
      this.progressCallback(100);
    }
    
    if (this.completeCallback) {
      this.completeCallback();
    }
  }

  /**
   * Check if the application is still loading
   */
  public getIsLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Get the current loading progress
   */
  public getProgress(): number {
    return this.progress;
  }

  /**
   * Set a callback to be called on progress updates
   */
  public onProgress(callback: LoadingCallback): void {
    this.progressCallback = callback;
  }

  /**
   * Set a callback to be called when loading completes
   */
  public onComplete(callback: LoadingCompleteCallback): void {
    this.completeCallback = callback;
  }
}

// Export a singleton instance
export const loadingManager = new LoadingManager();

// Export the class for custom instances
export default LoadingManager;
