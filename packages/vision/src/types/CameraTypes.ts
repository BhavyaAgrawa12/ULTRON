/**
 * @file CameraTypes.ts
 * @package @ultron/vision
 * @description Production camera device metadata, status types, resolution presets, and frame metrics.
 */

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
  groupId?: string;
  facingMode?: 'user' | 'environment' | string;
  isDefault?: boolean;
}

export interface CameraResolution {
  width: number;
  height: number;
}

export type ResolutionPreset = '720p' | '1080p' | '480p' | 'custom';

export const RESOLUTION_PRESETS: Record<Exclude<ResolutionPreset, 'custom'>, CameraResolution> = {
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '480p': { width: 640, height: 480 },
};

export interface CameraConfig {
  deviceId?: string;
  resolution: CameraResolution;
  preset?: ResolutionPreset;
  targetFps: number;
  facingMode?: 'user' | 'environment';
}

export type CameraPermissionState = 'prompt' | 'granted' | 'denied';

export type CameraStatus =
  | 'uninitialized'
  | 'requesting_permission'
  | 'permission_denied'
  | 'ready'
  | 'initializing'
  | 'active'
  | 'paused'
  | 'stopped'
  | 'reconnecting'
  | 'disconnected'
  | 'error';

export interface FrameMetaData {
  frameId: number;
  timestamp: number;
  width: number;
  height: number;
  cameraFps: number;
  rendererFps: number;
  latencyMs: number;
}

export interface DeviceDiff {
  added: CameraDeviceInfo[];
  removed: CameraDeviceInfo[];
  changed: boolean;
}
