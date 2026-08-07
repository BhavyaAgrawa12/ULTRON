/**
 * @file VisionRuntime.ts
 * @package @ultron/vision
 * @description Internal lifecycle orchestrator coordinating CameraManager, TrackingRuntime, FrameLoop, and VisionEventBus.
 */

import {
  CameraConfig,
  CameraDeviceInfo,
  CameraPermissionState,
  CameraStatus,
  HandLandmarksResult,
  TrackingMode,
  VisionEngineStatus,
} from '../types';
import { CameraManager } from '../camera/CameraManager';
import { FrameLoop, OnFrameCallback, FrameSource } from './FrameLoop';
import { TrackingRuntime } from '../tracking/TrackingRuntime';
import { VisionEventBus } from '../events';
import { ModelLoaderOptions } from '../tracking/ModelLoader';

export class VisionRuntime {
  private status: VisionEngineStatus = 'idle';
  private cameraManager: CameraManager;
  private trackingRuntime: TrackingRuntime;
  private frameLoop: FrameLoop;
  private eventBus: VisionEventBus;
  private latestLandmarks: HandLandmarksResult[] = [];

  constructor(eventBus?: VisionEventBus) {
    this.eventBus = eventBus || new VisionEventBus();
    this.cameraManager = new CameraManager(this.eventBus);
    this.trackingRuntime = new TrackingRuntime(this.eventBus);
    this.frameLoop = new FrameLoop();

    // Connect FrameLoop to TrackingRuntime
    this.frameLoop.setOnFrameCallback((source, metadata) => {
      if (this.trackingRuntime.isMediaPipeLoaded()) {
        const results = this.trackingRuntime.processFrame(source, metadata.timestamp);
        this.latestLandmarks = results;
      }
    });
  }

  public async initialize(options?: ModelLoaderOptions): Promise<void> {
    void options;
    this.status = 'starting';
    await this.cameraManager.getDevices();
    this.status = 'idle';
  }

  public async initializeHandTracking(options?: ModelLoaderOptions): Promise<void> {
    await this.trackingRuntime.initialize(options);
  }

  public async requestCameraPermission(): Promise<CameraPermissionState> {
    return this.cameraManager.requestPermission();
  }

  public async getAvailableCameras(): Promise<CameraDeviceInfo[]> {
    return this.cameraManager.getDevices();
  }

  public async startCamera(config?: Partial<CameraConfig>): Promise<MediaStream> {
    const stream = await this.cameraManager.start(config);
    this.status = 'running';
    return stream;
  }

  public async stopCamera(): Promise<void> {
    await this.cameraManager.stop();
    this.trackingRuntime.stop();
    this.frameLoop.reset();
    this.latestLandmarks = [];
    this.status = 'idle';
  }

  public async pauseCamera(): Promise<void> {
    await this.cameraManager.pause();
    this.status = 'paused';
  }

  public async resumeCamera(): Promise<void> {
    await this.cameraManager.resume();
    this.status = 'running';
  }

  public async switchCamera(deviceId: string): Promise<MediaStream> {
    return this.cameraManager.switchCamera(deviceId);
  }

  public getPreviewStream(): MediaStream | null {
    return this.cameraManager.getActiveStream();
  }

  public getCameraStatus(): CameraStatus {
    return this.cameraManager.getStatus();
  }

  public getCameraPermissionState(): CameraPermissionState {
    return this.cameraManager.getPermissionState();
  }

  public processVideoFrame(source: FrameSource): void {
    this.frameLoop.processVideoFrame(source);
  }

  public updateRendererFps(fps: number): void {
    this.frameLoop.updateRendererFps(fps);
  }

  public setOnFrameCallback(callback: OnFrameCallback | null): void {
    this.frameLoop.setOnFrameCallback((source, metadata) => {
      if (this.trackingRuntime.isMediaPipeLoaded()) {
        const results = this.trackingRuntime.processFrame(source, metadata.timestamp);
        this.latestLandmarks = results;
      }
      if (callback) {
        callback(source, metadata);
      }
    });
  }

  public getLatestLandmarks(): HandLandmarksResult[] {
    return this.latestLandmarks;
  }

  public setTrackingMode(mode: TrackingMode): void {
    this.trackingRuntime.setTrackingMode(mode);
  }

  public getTrackingRuntime(): TrackingRuntime {
    return this.trackingRuntime;
  }

  public getFrameMetrics() {
    return this.frameLoop.getFrameMetrics();
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

  public getFrameLoop(): FrameLoop {
    return this.frameLoop;
  }

  public async dispose(): Promise<void> {
    await this.stopCamera();
    await this.cameraManager.dispose();
    this.eventBus.removeAllListeners();
    this.status = 'destroyed';
  }
}
