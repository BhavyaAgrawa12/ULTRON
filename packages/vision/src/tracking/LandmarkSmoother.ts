/**
 * @file LandmarkSmoother.ts
 * @package @ultron/vision
 * @description 1-Euro / Exponential Moving Average (EMA) 3D spatial landmark temporal smoothing filter.
 */

import { Landmark3D, HandLandmarksResult } from '../types';

export class LandmarkSmoother {
  private alpha = 0.65; // Smoothing factor (0 = infinite smooth/lag, 1 = raw/no filter)
  private previousHandMap: Map<string, Landmark3D[]> = new Map();

  constructor(alpha = 0.65) {
    this.alpha = alpha;
  }

  public smoothHandResults(results: HandLandmarksResult[]): HandLandmarksResult[] {
    return results.map((handResult) => {
      const key = handResult.handedness;
      const prevLandmarks = this.previousHandMap.get(key);

      const smoothedLandmarks = handResult.landmarks.map((current, idx) => {
        if (!prevLandmarks || !prevLandmarks[idx]) {
          return { ...current };
        }
        const prev = prevLandmarks[idx];
        return {
          x: prev.x + this.alpha * (current.x - prev.x),
          y: prev.y + this.alpha * (current.y - prev.y),
          z: prev.z + this.alpha * (current.z - prev.z),
          visibility: current.visibility,
        };
      });

      this.previousHandMap.set(key, smoothedLandmarks);

      return {
        ...handResult,
        landmarks: smoothedLandmarks,
      };
    });
  }

  public setAlpha(alpha: number): void {
    this.alpha = Math.max(0.01, Math.min(1.0, alpha));
  }

  public getAlpha(): number {
    return this.alpha;
  }

  public reset(): void {
    this.previousHandMap.clear();
  }
}
