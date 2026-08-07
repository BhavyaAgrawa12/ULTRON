/**
 * @file HandTracker.ts
 * @package @ultron/vision
 * @description Production MediaPipe HandLandmarker pipeline processing video frames and extracting 21 3D spatial landmarks per hand.
 */

import { HandLandmarker } from '@mediapipe/tasks-vision';
import { HandLandmarksResult, Handedness, Landmark3D, TrackingConfig } from '../types';
import { ModelLoader, ModelLoaderOptions } from './ModelLoader';
import { FrameSource } from '../runtime/FrameLoop';

export class HandTracker {
  private handLandmarker: HandLandmarker | null = null;
  private isInitialized = false;
  private inferenceTimeMs = 0;

  public async initialize(options?: ModelLoaderOptions & Partial<TrackingConfig>): Promise<void> {
    this.handLandmarker = await ModelLoader.loadHandLandmarker(options);
    this.isInitialized = true;
  }

  public processFrame(source: FrameSource, timestamp: number): HandLandmarksResult[] {
    if (!this.isInitialized || !this.handLandmarker) {
      return [];
    }

    if (source instanceof HTMLVideoElement && (source.readyState < 2 || source.videoWidth === 0)) {
      return [];
    }

    const t0 = performance.now();

    try {
      const results = this.handLandmarker.detectForVideo(source, timestamp);
      this.inferenceTimeMs = Math.round(performance.now() - t0);

      if (!results || !results.landmarks || results.landmarks.length === 0) {
        return [];
      }

      const parsedResults: HandLandmarksResult[] = [];

      for (let i = 0; i < results.landmarks.length; i++) {
        const rawLandmarks = results.landmarks[i];
        const rawWorldLandmarks = results.worldLandmarks ? results.worldLandmarks[i] : [];
        const rawHandedness = results.handedness ? results.handedness[i] : [];

        const landmarks: Landmark3D[] = rawLandmarks.map((lm) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
          visibility: lm.visibility ?? 1,
        }));

        const worldLandmarks: Landmark3D[] = rawWorldLandmarks.map((lm) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
          visibility: lm.visibility ?? 1,
        }));

        let handednessLabel: Handedness = 'Right';
        let score = 0.9;

        if (rawHandedness && rawHandedness.length > 0) {
          const category = rawHandedness[0];
          handednessLabel = category.categoryName === 'Left' ? 'Left' : 'Right';
          score = category.score ?? 0.9;
        }

        parsedResults.push({
          landmarks,
          worldLandmarks,
          handedness: handednessLabel,
          score,
        });
      }

      return parsedResults;
    } catch (err) {
      console.error('[HandTracker] Frame detection error:', err);
      return [];
    }
  }

  public getInferenceTimeMs(): number {
    return this.inferenceTimeMs;
  }

  public isLoaded(): boolean {
    return this.isInitialized && this.handLandmarker !== null;
  }

  public reset(): void {
    // HandLandmarker reset if needed
  }
}
