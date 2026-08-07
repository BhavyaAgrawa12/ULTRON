/**
 * @file CameraManager.ts
 * @package @ultron/vision
 * @description Production Camera Lifecycle Manager wrapping navigator.mediaDevices with device diffing and frame metrics.
 */

import {
  CameraDeviceInfo,
  CameraConfig,
  CameraStatus,
  CameraPermissionState,
  FrameMetaData,
  DeviceDiff,
  RESOLUTION_PRESETS,
} from '../types';
import { VisionEventBus } from '../events';

export type FrameHook = (frameData: FrameMetaData, videoElement: HTMLVideoElement) => void;

export class CameraManager {
  private activeStream: MediaStream | null = null;
  private activeDeviceId: string | null = null;
  private status: CameraStatus = 'uninitialized';
  private permissionState: CameraPermissionState = 'prompt';
  private knownDevices: CameraDeviceInfo[] = [];

  private currentConfig: CameraConfig = {
    resolution: RESOLUTION_PRESETS['720p'],
    preset: '720p',
    targetFps: 30,
    facingMode: 'user',
  };

  private frameIdCounter = 0;
  private lastFrameTimestamp = 0;
  private cameraFps = 0;
  private rendererFps = 60;
  private latencyMs = 0;
  private frameHook: FrameHook | null = null;
  private deviceChangeListener: (() => void) | null = null;

  constructor(private eventBus?: VisionEventBus) {
    this.setupDeviceChangeListener();
  }

  public setEventBus(eventBus: VisionEventBus): void {
    this.eventBus = eventBus;
  }

  public setFrameHook(hook: FrameHook | null): void {
    this.frameHook = hook;
  }

  public getStatus(): CameraStatus {
    return this.status;
  }

  public getPermissionState(): CameraPermissionState {
    return this.permissionState;
  }

  public getActiveStream(): MediaStream | null {
    return this.activeStream;
  }

  public getActiveDeviceId(): string | null {
    return this.activeDeviceId;
  }

  public getCurrentConfig(): CameraConfig {
    return { ...this.currentConfig };
  }

  private setStatus(newStatus: CameraStatus, error?: Error): void {
    const previousStatus = this.status;
    this.status = newStatus;
    if (this.eventBus) {
      this.eventBus.emit('camera:statusChange', {
        previousStatus,
        currentStatus: newStatus,
        deviceId: this.activeDeviceId ?? undefined,
        error,
      });
    }
  }

  public async requestPermission(): Promise<CameraPermissionState> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      this.permissionState = 'denied';
      this.setStatus('error', new Error('navigator.mediaDevices is not available in current environment.'));
      return 'denied';
    }

    this.setStatus('requesting_permission');
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      tempStream.getTracks().forEach((track) => track.stop());
      this.permissionState = 'granted';
      this.setStatus('ready');
      if (this.eventBus) {
        this.eventBus.emit('camera:permissionGranted', undefined);
      }
      await this.getDevices();
      return 'granted';
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.permissionState = 'denied';
      this.setStatus('permission_denied', error);
      if (this.eventBus) {
        this.eventBus.emit('camera:permissionDenied', { error });
        this.eventBus.emit('camera:error', { error });
      }
      return 'denied';
    }
  }

  public async getDevices(): Promise<CameraDeviceInfo[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');

      const parsedDevices: CameraDeviceInfo[] = videoDevices.map((d, idx) => ({
        deviceId: d.deviceId,
        label: d.label || `Camera ${idx + 1}`,
        groupId: d.groupId,
        isDefault: idx === 0,
      }));

      // Diff against known devices
      if (this.knownDevices.length > 0) {
        const diff = this.diffDevices(this.knownDevices, parsedDevices);
        if (diff.changed && this.eventBus) {
          this.eventBus.emit('camera:deviceDiff', diff);
        }
      }

      this.knownDevices = parsedDevices;
      if (this.eventBus) {
        this.eventBus.emit('camera:ready', { devices: parsedDevices });
      }
      return parsedDevices;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (this.eventBus) {
        this.eventBus.emit('camera:error', { error });
      }
      return [];
    }
  }

  private diffDevices(oldList: CameraDeviceInfo[], newList: CameraDeviceInfo[]): DeviceDiff {
    const oldIds = new Set(oldList.map((d) => d.deviceId));
    const newIds = new Set(newList.map((d) => d.deviceId));

    const added = newList.filter((d) => !oldIds.has(d.deviceId));
    const removed = oldList.filter((d) => !newIds.has(d.deviceId));
    const changed = added.length > 0 || removed.length > 0;

    return { added, removed, changed };
  }

  public async start(config?: Partial<CameraConfig>): Promise<MediaStream> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      throw new Error('navigator.mediaDevices is unavailable.');
    }

    if (config) {
      this.currentConfig = { ...this.currentConfig, ...config };
    }

    this.setStatus('initializing');
    if (this.eventBus) {
      this.eventBus.emit('camera:initializing', { deviceId: this.currentConfig.deviceId });
    }

    // Stop existing stream if running
    if (this.activeStream) {
      await this.stop();
    }

    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: this.currentConfig.resolution.width },
        height: { ideal: this.currentConfig.resolution.height },
        frameRate: { ideal: this.currentConfig.targetFps },
        ...(this.currentConfig.deviceId ? { deviceId: { exact: this.currentConfig.deviceId } } : {}),
        ...(this.currentConfig.facingMode ? { facingMode: this.currentConfig.facingMode } : {}),
      },
      audio: false,
    };

    try {
      const startTime = performance.now();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.activeStream = stream;
      this.permissionState = 'granted';

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        if (settings.deviceId) {
          this.activeDeviceId = settings.deviceId;
        }
      }

      this.latencyMs = Math.round(performance.now() - startTime);
      this.setStatus('active');

      if (this.eventBus) {
        this.eventBus.emit('camera:started', { stream, deviceId: this.activeDeviceId ?? undefined });
      }

      return stream;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.permissionState = 'denied';
        this.setStatus('permission_denied', error);
        if (this.eventBus) {
          this.eventBus.emit('camera:permissionDenied', { error });
        }
      } else {
        this.setStatus('error', error);
      }

      if (this.eventBus) {
        this.eventBus.emit('camera:error', { error });
      }
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => track.stop());
      this.activeStream = null;
      this.activeDeviceId = null;
    }
    this.setStatus('stopped');
    if (this.eventBus) {
      this.eventBus.emit('camera:stopped', undefined);
    }
  }

  public async pause(): Promise<void> {
    if (this.activeStream) {
      this.activeStream.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
      this.setStatus('paused');
      if (this.eventBus) {
        this.eventBus.emit('camera:paused', undefined);
      }
    }
  }

  public async resume(): Promise<void> {
    if (this.activeStream) {
      this.activeStream.getVideoTracks().forEach((track) => {
        track.enabled = true;
      });
      this.setStatus('active');
      if (this.eventBus) {
        this.eventBus.emit('camera:resumed', undefined);
      }
    }
  }

  public async switchCamera(deviceId: string): Promise<MediaStream> {
    this.currentConfig.deviceId = deviceId;
    const stream = await this.start();
    if (this.eventBus) {
      this.eventBus.emit('camera:switched', { deviceId, stream });
    }
    return stream;
  }

  /**
   * Called by video element frame callbacks to update real-time FPS and latency metrics.
   */
  public processVideoFrame(videoElement: HTMLVideoElement): void {
    const now = performance.now();
    this.frameIdCounter++;

    if (this.lastFrameTimestamp > 0) {
      const delta = now - this.lastFrameTimestamp;
      if (delta > 0) {
        const instantFps = 1000 / delta;
        this.cameraFps = Math.round(this.cameraFps * 0.9 + instantFps * 0.1);
      }
    }
    this.lastFrameTimestamp = now;

    const frameData: FrameMetaData = {
      frameId: this.frameIdCounter,
      timestamp: now,
      width: videoElement.videoWidth || this.currentConfig.resolution.width,
      height: videoElement.videoHeight || this.currentConfig.resolution.height,
      cameraFps: this.cameraFps || 30,
      rendererFps: this.rendererFps,
      latencyMs: this.latencyMs,
    };

    if (this.frameHook) {
      this.frameHook(frameData, videoElement);
    }
  }

  public updateRendererFps(fps: number): void {
    this.rendererFps = fps;
  }

  private setupDeviceChangeListener(): void {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      this.deviceChangeListener = () => {
        this.getDevices().then((devices) => {
          if (this.activeDeviceId && !devices.some((d) => d.deviceId === this.activeDeviceId)) {
            this.setStatus('disconnected');
            if (this.eventBus) {
              this.eventBus.emit('camera:disconnected', { deviceId: this.activeDeviceId });
            }
          }
        });
      };

      navigator.mediaDevices.addEventListener('devicechange', this.deviceChangeListener);
    }
  }

  public async dispose(): Promise<void> {
    if (this.deviceChangeListener && typeof navigator !== 'undefined' && navigator.mediaDevices) {
      navigator.mediaDevices.removeEventListener('devicechange', this.deviceChangeListener);
      this.deviceChangeListener = null;
    }
    await this.stop();
  }
}
