/**
 * @file VisionRuntime.ts
 * @package @ultron/vision
 * @description Internal lifecycle orchestrator coordinating CameraManager, FrameLoop, and VisionEventBus.
 */

import {
  CameraConfig,
  CameraDeviceInfo,
  CameraPermissionState,
  CameraStatus,
  VisionEngineStatus,
} from '../types';
import { CameraManager } from '../camera/CameraManager';
import { FrameLoop, OnFrameCallback, FrameSource } from './FrameLoop';
import { VisionEventBus } from '../events';

export class VisionRuntime {
  private status: VisionEngineStatus = 'idle';
  private cameraManager: CameraManager;
  private frameLoop: FrameLoop;
  private eventBus: VisionEventBus;

  constructor(eventBus?: VisionEventBus) {
    this.eventBus = eventBus || new VisionEventBus();
    this.cameraManager = new CameraManager(this.eventBus);
    this.frameLoop = new FrameLoop();
  }

  public async initialize(): Promise<void> {
    this.status = 'starting';
    await this.cameraManager.getDevices();
    this.status = 'idle';
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
    this.frameLoop.reset();
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
    this.frameLoop.setOnFrameCallback(callback);
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
