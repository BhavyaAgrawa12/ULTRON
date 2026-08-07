/**
 * @file CameraManager.ts
 * @package @ultron/vision
 * @description WebCam lifecycle manager wrapping navigator.mediaDevices with permission handling, stream control, and hotplug diffing.
 */

import {
  CameraConfig,
  CameraDeviceInfo,
  CameraPermissionState,
  CameraStatus,
  DEFAULT_CAMERA_CONFIG,
  DeviceDiff,
} from '../types';
import { VisionEventBus } from '../events';

export class CameraManager {
  private currentStatus: CameraStatus = 'uninitialized';
  private permissionState: CameraPermissionState = 'prompt';
  private activeStream: MediaStream | null = null;
  private availableDevices: CameraDeviceInfo[] = [];
  private currentConfig: CameraConfig = { ...DEFAULT_CAMERA_CONFIG };
  private deviceChangeListener: (() => void) | null = null;
  private startupTimestamp = 0;
  private startupLatencyMs = 0;

  constructor(private eventBus?: VisionEventBus) {}

  public setEventBus(eventBus: VisionEventBus): void {
    this.eventBus = eventBus;
  }

  public getStatus(): CameraStatus {
    return this.currentStatus;
  }

  public getPermissionState(): CameraPermissionState {
    return this.permissionState;
  }

  public getActiveStream(): MediaStream | null {
    return this.activeStream;
  }

  public getAvailableDevices(): CameraDeviceInfo[] {
    return [...this.availableDevices];
  }

  public getStartupLatencyMs(): number {
    return this.startupLatencyMs;
  }

  public getCurrentConfig(): CameraConfig {
    return { ...this.currentConfig };
  }

  private setStatus(newStatus: CameraStatus, error?: Error): void {
    const previousStatus = this.currentStatus;
    this.currentStatus = newStatus;

    if (this.eventBus) {
      this.eventBus.emit('camera:statusChange', {
        previousStatus,
        currentStatus: newStatus,
        deviceId: this.currentConfig.deviceId,
        error,
      });
    }
  }

  public async requestPermission(): Promise<CameraPermissionState> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      this.permissionState = 'denied';
      this.setStatus('permission_denied', new Error('MediaDevices API unsupported'));
      return 'denied';
    }

    this.setStatus('requesting_permission');

    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      tempStream.getTracks().forEach((track) => track.stop());

      this.permissionState = 'granted';
      if (this.eventBus) {
        this.eventBus.emit('camera:permissionGranted', undefined);
      }
      await this.getDevices();
      this.setStatus('ready');
      return 'granted';
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.permissionState = 'denied';
      this.setStatus('permission_denied', error);
      if (this.eventBus) {
        this.eventBus.emit('camera:permissionDenied', { error });
      }
      return 'denied';
    }
  }

  public async getDevices(): Promise<CameraDeviceInfo[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
      return [];
    }

    try {
      const mediaDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices: CameraDeviceInfo[] = mediaDevices
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${index + 1}`,
          groupId: device.groupId,
          facingMode: 'user',
        }));

      const diff = this.diffDevices(this.availableDevices, videoDevices);
      this.availableDevices = videoDevices;

      if (diff.added.length > 0 || diff.removed.length > 0 || diff.changed.length > 0) {
        if (this.eventBus) {
          this.eventBus.emit('camera:deviceDiff', diff);
          this.eventBus.emit('camera:ready', { devices: videoDevices });
        }
      }

      return videoDevices;
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
    const changed = newList.filter((d) => {
      const old = oldList.find((o) => o.deviceId === d.deviceId);
      return old && (old.label !== d.label || old.groupId !== d.groupId);
    });

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
    this.startupTimestamp = performance.now();

    try {
      if (this.activeStream) {
        this.stopStreamTracks();
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: this.currentConfig.deviceId ? { exact: this.currentConfig.deviceId } : undefined,
          width: { ideal: this.currentConfig.resolution.width },
          height: { ideal: this.currentConfig.resolution.height },
          frameRate: { ideal: this.currentConfig.targetFps },
          facingMode: this.currentConfig.facingMode || 'user',
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.activeStream = stream;
      this.startupLatencyMs = Math.round(performance.now() - this.startupTimestamp);
      this.permissionState = 'granted';

      this.setupDeviceChangeListener();
      this.setStatus('active');

      if (this.eventBus) {
        this.eventBus.emit('camera:started', { stream, deviceId: this.currentConfig.deviceId });
      }

      return stream;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.setStatus('error', error);
      if (this.eventBus) {
        this.eventBus.emit('camera:error', { error });
      }
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.activeStream) {
      this.stopStreamTracks();
      this.activeStream = null;
    }

    this.removeDeviceChangeListener();
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

  private stopStreamTracks(): void {
    if (this.activeStream) {
      this.activeStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  private setupDeviceChangeListener(): void {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices || this.deviceChangeListener) {
      return;
    }

    this.deviceChangeListener = () => {
      this.getDevices().catch((err) => {
        console.error('[CameraManager] Device change error:', err);
      });
    };

    navigator.mediaDevices.addEventListener('devicechange', this.deviceChangeListener);
  }

  private removeDeviceChangeListener(): void {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices && this.deviceChangeListener) {
      navigator.mediaDevices.removeEventListener('devicechange', this.deviceChangeListener);
      this.deviceChangeListener = null;
    }
  }

  public async dispose(): Promise<void> {
    await this.stop();
    this.availableDevices = [];
  }
}
