/**
 * @file VisionEngine.ts
 * @package @ultron/vision
 * @description Main public API facade for ULTRON Vision services delegating to internal VisionRuntime.
 */

import { CameraConfig, CameraDeviceInfo, CameraPermissionState, CameraStatus, HandLandmarksResult, TrackingMode, VisionEngineStatus } from './types';
import { VisionRuntime, OnFrameCallback, FrameSource } from './runtime';
import { VisionEventBus } from './events';
import { CameraManager } from './camera';
import { TrackingRuntime, ModelLoaderOptions } from './tracking';

export class VisionEngine {
  private runtime: VisionRuntime;

  constructor(config?: Partial<CameraConfig>) {
    void config;
    this.runtime = new VisionRuntime();
  }

  public async initialize(options?: ModelLoaderOptions): Promise<void> {
    return this.runtime.initialize(options);
  }

  public async initializeHandTracking(options?: ModelLoaderOptions): Promise<void> {
    return this.runtime.initializeHandTracking(options);
  }

  public async requestCameraPermission(): Promise<CameraPermissionState> {
    return this.runtime.requestCameraPermission();
  }

  public async getAvailableCameras(): Promise<CameraDeviceInfo[]> {
    return this.runtime.getAvailableCameras();
  }

  public async startCamera(config?: Partial<CameraConfig>): Promise<MediaStream> {
    return this.runtime.startCamera(config);
  }

  public async stopCamera(): Promise<void> {
    return this.runtime.stopCamera();
  }

  public async pauseCamera(): Promise<void> {
    return this.runtime.pauseCamera();
  }

  public async resumeCamera(): Promise<void> {
    return this.runtime.resumeCamera();
  }

  public async switchCamera(deviceId: string): Promise<MediaStream> {
    return this.runtime.switchCamera(deviceId);
  }

  public getPreviewStream(): MediaStream | null {
    return this.runtime.getPreviewStream();
  }

  public getCameraStatus(): CameraStatus {
    return this.runtime.getCameraStatus();
  }

  public getCameraPermissionState(): CameraPermissionState {
    return this.runtime.getCameraPermissionState();
  }

  public processVideoFrame(source: FrameSource): void {
    this.runtime.processVideoFrame(source);
  }

  public updateRendererFps(fps: number): void {
    this.runtime.updateRendererFps(fps);
  }

  public setOnFrameCallback(callback: OnFrameCallback | null): void {
    this.runtime.setOnFrameCallback(callback);
  }

  public getLatestLandmarks(): HandLandmarksResult[] {
    return this.runtime.getLatestLandmarks();
  }

  public setTrackingMode(mode: TrackingMode): void {
    this.runtime.setTrackingMode(mode);
  }

  public getFrameMetrics() {
    return this.runtime.getFrameMetrics();
  }

  public getStatus(): VisionEngineStatus {
    return this.runtime.getStatus();
  }

  public getEventBus(): VisionEventBus {
    return this.runtime.getEventBus();
  }

  public getCameraManager(): CameraManager {
    return this.runtime.getCameraManager();
  }

  public getTrackingRuntime(): TrackingRuntime {
    return this.runtime.getTrackingRuntime();
  }

  public getVisionRuntime(): VisionRuntime {
    return this.runtime;
  }

  public async destroy(): Promise<void> {
    await this.runtime.dispose();
  }
}

/**
 * Singleton VisionEngine instance factory.
 */
let visionEngineInstance: VisionEngine | null = null;

export function getVisionEngine(config?: Partial<CameraConfig>): VisionEngine {
  if (!visionEngineInstance) {
    visionEngineInstance = new VisionEngine(config);
  }
  return visionEngineInstance;
}

export function createVisionEngine(config?: Partial<CameraConfig>): VisionEngine {
  return new VisionEngine(config);
}
