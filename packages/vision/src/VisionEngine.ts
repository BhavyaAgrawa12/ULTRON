/**
 * @file VisionEngine.ts
 * @package @ultron/vision
 * @description Main orchestrator engine for ULTRON Vision services.
 */

import { VisionConfig, VisionEngineStatus } from './types';
import { CameraManager } from './camera';
import { HandTracker, LandmarkSmoother, TrackingLoop } from './tracking';
import { VisionEventBus } from './events';

export class VisionEngine {
  private status: VisionEngineStatus = 'idle';
  private cameraManager: CameraManager;
  private handTracker: HandTracker;
  private landmarkSmoother: LandmarkSmoother;
  private trackingLoop: TrackingLoop;
  private eventBus: VisionEventBus;

  constructor(private config?: Partial<VisionConfig>) {
    this.cameraManager = new CameraManager();
    this.handTracker = new HandTracker();
    this.landmarkSmoother = new LandmarkSmoother();
    this.trackingLoop = new TrackingLoop();
    this.eventBus = new VisionEventBus();
  }

  public async initialize(config?: Partial<VisionConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.status = 'starting';
    // Placeholder engine orchestration initialization contract for Phase 1
    this.status = 'idle';
  }

  public async start(): Promise<void> {
    this.status = 'running';
    // Placeholder engine start contract for Phase 1
  }

  public async pause(): Promise<void> {
    this.status = 'paused';
  }

  public async stop(): Promise<void> {
    this.trackingLoop.stop();
    await this.cameraManager.shutdown();
    this.status = 'idle';
  }

  public getStatus(): VisionEngineStatus {
    return this.status;
  }

  public getEventBus(): VisionEventBus {
    return this.eventBus;
  }

  public getCameraManager(): CameraManager {
    return this.cameraManager;
  }

  public getHandTracker(): HandTracker {
    return this.handTracker;
  }

  public getLandmarkSmoother(): LandmarkSmoother {
    return this.landmarkSmoother;
  }

  public async destroy(): Promise<void> {
    await this.stop();
    this.eventBus.removeAllListeners();
    this.status = 'destroyed';
  }
}

/**
 * Factory helper for creating VisionEngine instances.
 */
export function createVisionEngine(config?: Partial<VisionConfig>): VisionEngine {
  return new VisionEngine(config);
}
