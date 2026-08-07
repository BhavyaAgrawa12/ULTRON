/**
 * @file HandTracker.ts
 * @package @ultron/vision
 * @description Contract interface and placeholder implementation for hand detection pipeline.
 */

import { HandLandmarksResult, VisionConfig } from '../types';

export interface IHandTracker {
  initialize(config: VisionConfig): Promise<void>;
  processFrame(frameData: unknown): Promise<HandLandmarksResult[]>;
  reset(): void;
}

/**
 * Placeholder HandTracker class contract.
 * No MediaPipe models or tracking algorithms implemented in Phase 1.
 */
export class HandTracker implements IHandTracker {
  private isInitialized = false;

  public async initialize(config: VisionConfig): Promise<void> {
    void config;
    this.isInitialized = true;
  }

  public async processFrame(frameData: unknown): Promise<HandLandmarksResult[]> {
    void frameData;
    if (!this.isInitialized) {
      return [];
    }
    return [];
  }

  public reset(): void {
    // Placeholder reset contract for Phase 1
  }
}
