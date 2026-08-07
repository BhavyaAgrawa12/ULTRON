/**
 * @file LandmarkSmoother.ts
 * @package @ultron/vision
 * @description 3D spatial landmark temporal smoothing filter for noise reduction.
 */

import { Landmark3D, HandLandmarksResult } from '../types';

export class LandmarkSmoother {
  private smoothingFactor = 0.5;

  constructor(factor?: number) {
    if (factor !== undefined) {
      this.smoothingFactor = factor;
    }
  }

  public smoothLandmarks(landmarks: Landmark3D[]): Landmark3D[] {
    // Placeholder 1-Euro / Exponential Moving Average filter contract for Phase 1
    return landmarks.map((l) => ({ ...l }));
  }

  public smoothHandResults(results: HandLandmarksResult[]): HandLandmarksResult[] {
    return results.map((res) => ({
      ...res,
      landmarks: this.smoothLandmarks(res.landmarks),
      worldLandmarks: this.smoothLandmarks(res.worldLandmarks),
    }));
  }

  public setSmoothingFactor(factor: number): void {
    this.smoothingFactor = factor;
  }

  public getSmoothingFactor(): number {
    return this.smoothingFactor;
  }
}
