/**
 * @file VisionEvents.ts
 * @package @ultron/vision
 * @description Strongly-typed vision event map definitions.
 */

import { CameraStatus, CameraDeviceInfo, DeviceDiff, HandLandmarksResult, VisionEngineStatus } from '../types';

export interface CameraStateChangeEvent {
  previousStatus: CameraStatus;
  currentStatus: CameraStatus;
  deviceId?: string;
  error?: Error;
}

export interface EngineStateChangeEvent {
  previousStatus: VisionEngineStatus;
  currentStatus: VisionEngineStatus;
}

export interface LandmarksUpdatedEvent {
  results: HandLandmarksResult[];
  timestamp: number;
  frameId: number;
}

export type VisionEventMap = {
  'camera:statusChange': CameraStateChangeEvent;
  'camera:permissionGranted': void;
  'camera:permissionDenied': { error: Error };
  'camera:ready': { devices: CameraDeviceInfo[] };
  'camera:initializing': { deviceId?: string };
  'camera:started': { stream: MediaStream; deviceId?: string };
  'camera:stopped': void;
  'camera:paused': void;
  'camera:resumed': void;
  'camera:switched': { deviceId: string; stream: MediaStream };
  'camera:reconnecting': { attempt: number };
  'camera:disconnected': { deviceId?: string };
  'camera:deviceDiff': DeviceDiff;
  'camera:error': { error: Error };
  'engine:statusChange': EngineStateChangeEvent;
  'tracking:landmarksUpdated': LandmarksUpdatedEvent;
  'tracking:error': Error;
};
