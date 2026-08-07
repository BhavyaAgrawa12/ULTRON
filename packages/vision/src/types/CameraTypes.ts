/**
 * @file CameraTypes.ts
 * @package @ultron/vision
 * @description Type definitions for camera device metadata, configuration settings, and video frame streams.
 */

export interface CameraDeviceInfo {
  deviceId: string;
  label: string;
  groupId?: string;
  isDefault?: boolean;
}

export interface CameraResolution {
  width: number;
  height: number;
}

export interface CameraConfig {
  deviceId?: string;
  resolution: CameraResolution;
  targetFps: number;
  facingMode?: 'user' | 'environment';
}

export type CameraStatus =
  | 'uninitialized'
  | 'initializing'
  | 'active'
  | 'paused'
  | 'stopped'
  | 'error';

export interface FrameMetaData {
  frameId: number;
  timestamp: number;
  width: number;
  height: number;
}
