/**
 * @file VisionEvents.ts
 * @package @ultron/vision
 * @description Vision event payload type definitions.
 */

import { CameraStatus, HandLandmarksResult, VisionEngineStatus } from '../types';

export interface CameraStateChangeEvent {
  previousStatus: CameraStatus;
  currentStatus: CameraStatus;
  deviceId?: string;
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
  'engine:statusChange': EngineStateChangeEvent;
  'tracking:landmarksUpdated': LandmarksUpdatedEvent;
  'tracking:error': Error;
};
