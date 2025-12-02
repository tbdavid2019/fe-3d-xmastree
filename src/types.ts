export type AppMode = 'CHAOS' | 'FORMED';

export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandResults {
  multiHandLandmarks: HandLandmark[][];
  multiHandedness: any[];
}

export interface AppState {
  mode: AppMode;
  handDetected: boolean;
  gesture: 'OPEN' | 'PINCH' | 'FIST' | 'NONE';
  handPosition: { x: number; y: number; z: number };
  stats: {
    fps: number;
    particles: number;
    uptime: number;
  };
  settings: {
    spin: number;
    scale: number;
    density: number;
    distortion: number;
    fieldRadius: number;
    showSkeleton: boolean;
    handTrackingEnabled: boolean;
  };
}
