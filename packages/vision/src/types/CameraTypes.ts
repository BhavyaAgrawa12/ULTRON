/**
 * @file CameraTypes.ts
 * @package @ultron/vision
 * @description Camera metadata, resolution presets, status enums, and frame metric types.
 */

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

export type CameraPermissionState = 'prompt' | 'granted' | 'denied';

export type ResolutionPreset = '720p' | '1080p' | '480p' | 'custom';

export interface CameraResolution {
  width: number;
  height: number;
}

export const RESOLUTION_PRESETS: Record<Extract<ResolutionPreset, '720p' | '1080p' | '480p'>, CameraResolution> = {
  '480p': { width: 640, height: 480 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
};

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
  groupId: string;
  facingMode?: 'user' | 'environment';
}

export interface CameraConfig {
  deviceId?: string;
  resolution: CameraResolution;
  preset: ResolutionPreset;
  targetFps: number;
  facingMode?: 'user' | 'environment';
}

export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  resolution: RESOLUTION_PRESETS['480p'],
  preset: '480p',
  targetFps: 30,
  facingMode: 'user',
};

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
  changed: CameraDeviceInfo[];
}
