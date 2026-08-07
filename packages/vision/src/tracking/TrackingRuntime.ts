/**
 * @file TrackingRuntime.ts
 * @package @ultron/vision
 * @description Sub-system tracking runtime orchestrator coordinating HandTracker, LandmarkSmoother, LandmarkHistoryBuffer, and VisionEventBus.
 */

import { HandLandmarksResult, TrackingConfig, TrackingMode } from '../types';
import { HandTracker } from './HandTracker';
import { LandmarkSmoother } from './LandmarkSmoother';
import { LandmarkHistoryBuffer } from './LandmarkHistoryBuffer';
import { VisionEventBus } from '../events';
import { FrameSource } from '../runtime/FrameLoop';
import { ModelLoaderOptions } from './ModelLoader';

export class TrackingRuntime {
  private handTracker: HandTracker;
  private landmarkSmoother: LandmarkSmoother;
  private historyBuffer: LandmarkHistoryBuffer;
  private trackingMode: TrackingMode = 'hands';
  private isTrackingActive = false;
  private wasHandDetected = false;
  private trackingFps = 0;
  private lastTrackingTimestamp = 0;
  private trackingFrameCounter = 0;

  constructor(private eventBus?: VisionEventBus) {
    this.handTracker = new HandTracker();
    this.landmarkSmoother = new LandmarkSmoother(0.65);
    this.historyBuffer = new LandmarkHistoryBuffer(10);
  }

  public setEventBus(eventBus: VisionEventBus): void {
    this.eventBus = eventBus;
  }

  public async initialize(options?: ModelLoaderOptions & Partial<TrackingConfig>): Promise<void> {
    try {
      await this.handTracker.initialize(options);
      this.isTrackingActive = true;
      if (this.eventBus) {
        this.eventBus.emit('tracking:started', undefined);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (this.eventBus) {
        this.eventBus.emit('tracking:error', error);
      }
      throw error;
    }
  }

  public processFrame(source: FrameSource, timestamp: number): HandLandmarksResult[] {
    if (!this.isTrackingActive || this.trackingMode === 'disabled') {
      return [];
    }

    // Tracking FPS calculation
    const now = performance.now();
    this.trackingFrameCounter++;
    if (this.lastTrackingTimestamp > 0) {
      const delta = now - this.lastTrackingTimestamp;
      if (delta > 0) {
        const instantFps = 1000 / delta;
        this.trackingFps = Math.round(this.trackingFps * 0.85 + instantFps * 0.15);
      }
    }
    this.lastTrackingTimestamp = now;

    // Detect raw 21 3D joint landmarks
    const rawResults = this.handTracker.processFrame(source, timestamp);

    // Apply 1-Euro EMA temporal smoothing filter
    const smoothedResults = this.landmarkSmoother.smoothHandResults(rawResults);

    // Store in 10-frame sliding window history buffer
    this.historyBuffer.push(smoothedResults, timestamp);

    const isHandDetectedNow = smoothedResults.length > 0;

    // Fire tracking state events
    if (isHandDetectedNow && !this.wasHandDetected) {
      if (this.eventBus) {
        this.eventBus.emit('tracking:recovered', { count: smoothedResults.length });
      }
    } else if (!isHandDetectedNow && this.wasHandDetected) {
      if (this.eventBus) {
        this.eventBus.emit('tracking:lost', undefined);
      }
    }
    this.wasHandDetected = isHandDetectedNow;

    // Emit updated landmarks event
    if (this.eventBus && isHandDetectedNow) {
      this.eventBus.emit('tracking:landmarksUpdated', {
        results: smoothedResults,
        timestamp,
        frameId: this.trackingFrameCounter,
      });
    }

    return smoothedResults;
  }

  public setTrackingMode(mode: TrackingMode): void {
    this.trackingMode = mode;
    if (mode === 'disabled') {
      this.isTrackingActive = false;
      if (this.eventBus) {
        this.eventBus.emit('tracking:stopped', undefined);
      }
    } else {
      this.isTrackingActive = true;
      if (this.eventBus) {
        this.eventBus.emit('tracking:started', undefined);
      }
    }
  }

  public getTrackingMode(): TrackingMode {
    return this.trackingMode;
  }

  public getTrackingFps(): number {
    return this.trackingFps;
  }

  public getInferenceTimeMs(): number {
    return this.handTracker.getInferenceTimeMs();
  }

  public isMediaPipeLoaded(): boolean {
    return this.handTracker.isLoaded();
  }

  public getHistoryBuffer(): LandmarkHistoryBuffer {
    return this.historyBuffer;
  }

  public getHandTracker(): HandTracker {
    return this.handTracker;
  }

  public getLandmarkSmoother(): LandmarkSmoother {
    return this.landmarkSmoother;
  }

  public stop(): void {
    this.isTrackingActive = false;
    this.wasHandDetected = false;
    this.historyBuffer.clear();
    this.landmarkSmoother.reset();
    if (this.eventBus) {
      this.eventBus.emit('tracking:stopped', undefined);
    }
  }
}
