/**
 * CameraInputProvider: Singleton service for camera access & MediaPipe ML models.
 * 
 * Responsibilities:
 * - Request camera permission ONCE per session (via ConsentModal in Stage 1)
 * - Lazily load MediaPipe models (HandLandmarker, FaceLandmarker) on first use
 * - Provide event-driven landmark data to stages/components
 * - Handle pause/resume on tab visibility change
 * - Clean up streams and models on unmount
 * 
 * HARD CONSTRAINT: Every camera-driven feature MUST have a non-camera fallback.
 * The game is always fully completable without camera.
 */

export interface HandLandmarks {
  x: number;
  y: number;
  z: number;
  presence: number;
}

export interface FaceLandmarks {
  x: number;
  y: number;
  z: number;
}

export type CameraEventListener = (data: any) => void;

type ModelType = 'hand' | 'face';

class CameraInputProvider {
  private static instance: CameraInputProvider;
  
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private isActive = false;
  private isMuted = false;
  
  // MediaPipe task instances (lazy-loaded)
  private handLandmarkerTask: any = null;
  private faceLandmarkerTask: any = null;
  
  private animationFrameId: number | null = null;
  private rafThrottleFrames = 2; // Process every Nth frame (reduce inference load)
  private rafCounter = 0;
  
  // Event listeners
  private handUpdateListeners: CameraEventListener[] = [];
  private faceUpdateListeners: CameraEventListener[] = [];
  private errorListeners: CameraEventListener[] = [];

  private constructor() {
    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isActive) {
        this.resume();
      }
    });
  }

  public static getInstance(): CameraInputProvider {
    if (!CameraInputProvider.instance) {
      CameraInputProvider.instance = new CameraInputProvider();
    }
    return CameraInputProvider.instance;
  }

  /**
   * Request camera access (if permission granted, start stream)
   * @returns true if permission granted and stream started, false otherwise
   */
  public async requestCamera(): Promise<boolean> {
    if (this.stream) {
      console.warn('[CameraInputProvider] Camera already active');
      return true;
    }

    try {
      // Check browser support
      if (!navigator.mediaDevices?.getUserMedia) {
        const err = new Error('getUserMedia not supported. Upgrade your browser or access via HTTPS/localhost.');
        this.notifyError(err);
        return false;
      }

      // Request camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      this.stream = stream;
      this.isActive = true;

      // Create hidden video element for inference
      if (!this.videoElement) {
        this.videoElement = document.createElement('video');
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;
        this.videoElement.muted = true;
        this.videoElement.style.display = 'none';
      }

      this.videoElement.srcObject = stream;

      // Wait for video to load before starting inference loop
      await new Promise((resolve) => {
        this.videoElement!.onloadedmetadata = () => resolve(null);
      });

      this.startInferenceLoop();
      return true;
    } catch (err: any) {
      const error = new Error(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. You can still play without camera.'
          : 'Camera access failed. Playing with camera disabled.'
      );
      this.notifyError(error);
      return false;
    }
  }

  /**
   * Stop camera and clean up resources
   */
  public async stopCamera(): Promise<void> {
    this.pause();

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }

    this.isActive = false;
  }

  /**
   * Pause camera inference (e.g., tab hidden, game paused)
   */
  public pause(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.isMuted = true;
  }

  /**
   * Resume camera inference
   */
  public resume(): void {
    if (this.isActive && this.animationFrameId === null) {
      this.isMuted = false;
      this.startInferenceLoop();
    }
  }

  /**
   * Lazily load and initialize HandLandmarker
   */
  private async ensureHandLandmarker(): Promise<any> {
    if (this.handLandmarkerTask) {
      return this.handLandmarkerTask;
    }

    try {
      console.log('[CameraInputProvider] Loading HandLandmarker model...');
      // TODO: Import and initialize @mediapipe/tasks-vision HandLandmarker
      // This will be implemented in Phase 2
      // const vision = await import('@mediapipe/tasks-vision');
      // this.handLandmarkerTask = await vision.HandLandmarker.createFromOptions(...);
      return null;
    } catch (err: any) {
      this.notifyError(new Error(`Failed to load HandLandmarker: ${err.message}`));
      return null;
    }
  }

  /**
   * Lazily load and initialize FaceLandmarker
   */
  private async ensureFaceLandmarker(): Promise<any> {
    if (this.faceLandmarkerTask) {
      return this.faceLandmarkerTask;
    }

    try {
      console.log('[CameraInputProvider] Loading FaceLandmarker model...');
      // TODO: Import and initialize @mediapipe/tasks-vision FaceLandmarker
      // This will be implemented in Phase 2
      // const vision = await import('@mediapipe/tasks-vision');
      // this.faceLandmarkerTask = await vision.FaceLandmarker.createFromOptions(...);
      return null;
    } catch (err: any) {
      this.notifyError(new Error(`Failed to load FaceLandmarker: ${err.message}`));
      return null;
    }
  }

  /**
   * Main inference loop (runs in RAF)
   */
  private startInferenceLoop(): void {
    if (!this.videoElement) return;

    const runInference = () => {
      if (this.isMuted || !this.isActive) {
        this.animationFrameId = null;
        return;
      }

      // Throttle inference every N frames
      this.rafCounter++;
      if (this.rafCounter % this.rafThrottleFrames === 0) {
        // TODO: Run detection and notify listeners (Phase 2+)
        // For now, just keep the loop alive
      }

      this.animationFrameId = requestAnimationFrame(runInference);
    };

    this.animationFrameId = requestAnimationFrame(runInference);
  }

  // ──────────────────────────────────────────────────────────────
  // Public API: Event Listeners
  // ──────────────────────────────────────────────────────────────

  public onHandUpdate(listener: CameraEventListener): () => void {
    this.handUpdateListeners.push(listener);
    return () => {
      this.handUpdateListeners = this.handUpdateListeners.filter((l) => l !== listener);
    };
  }

  public onFaceUpdate(listener: CameraEventListener): () => void {
    this.faceUpdateListeners.push(listener);
    return () => {
      this.faceUpdateListeners = this.faceUpdateListeners.filter((l) => l !== listener);
    };
  }

  public onError(listener: CameraEventListener): () => void {
    this.errorListeners.push(listener);
    return () => {
      this.errorListeners = this.errorListeners.filter((l) => l !== listener);
    };
  }

  private notifyHandUpdate(data: any): void {
    this.handUpdateListeners.forEach((listener) => listener(data));
  }

  private notifyFaceUpdate(data: any): void {
    this.faceUpdateListeners.forEach((listener) => listener(data));
  }

  private notifyError(error: Error): void {
    console.error('[CameraInputProvider]', error);
    this.errorListeners.forEach((listener) => listener({ error }));
  }

  // ──────────────────────────────────────────────────────────────
  // Public API: Gesture Detection Helpers (Phase 2+)
  // ──────────────────────────────────────────────────────────────

  /**
   * Get rolling average motion intensity (0-1)
   * Used for: Hygiene handwash scoring, general motion detection
   */
  public getMotionIntensity(): number {
    // TODO: Calculate from landmark displacement history
    return 0;
  }

  /**
   * Detect pinch gesture (thumb + index fingertip distance < threshold)
   * Used for: Mart add-to-cart gesture
   */
  public getPinchState(): boolean {
    // TODO: Measure thumb-index distance
    return false;
  }

  /**
   * Mouth open ratio (0-1)
   * Used for: Mouth chewing minigame
   */
  public getMouthOpenRatio(): number {
    // TODO: Calculate from vertical lip distance
    return 0;
  }

  /**
   * Detect shake/vibration gesture (rapid back-and-forth wrist displacement)
   * Used for: Stomach acid-balance mixing
   */
  public getShakeIntensity(): number {
    // TODO: Calculate wrist oscillation velocity
    return 0;
  }

  /**
   * Wrist tilt angle (-90 to +90 degrees)
   * Used for: Esophagus peristalsis steering
   */
  public getWristTiltAngle(): number {
    // TODO: Calculate from wrist and elbow landmarks
    return 0;
  }

  /**
   * Grip/squeeze detection (fingers curling toward palm)
   * Used for: Large intestine timing
   */
  public getGripIntensity(): number {
    // TODO: Calculate from fingertip-to-palm average distance
    return 0;
  }

  /**
   * Index fingertip position (normalized to video frame, 0-1 each axis)
   * Used for: Small intestine absorption paddle control
   */
  public getIndexFingerPosition(): { x: number; y: number } {
    // TODO: Return smoothed fingertip position
    return { x: 0, y: 0 };
  }

  public isReady(): boolean {
    return this.isActive && this.stream !== null;
  }
}

export const cameraInput = CameraInputProvider.getInstance();
