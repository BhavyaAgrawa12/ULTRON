/**
 * @file VisionTypes.ts
 * @package @ultron/vision
 * @description Engine status, tracking mode configurations, and tracking configuration interfaces.
 */

import { CameraConfig } from './CameraTypes';

export type VisionEngineStatus =
  | 'idle'
  | 'starting'
  | 'running'
  | 'paused'
  | 'error'
  | 'destroyed';

export type TrackingMode = 'hands' | 'face' | 'holistic' | 'disabled';

export interface TrackingConfig {
  numHands: number;
  minHandDetectionConfidence: number;
  minTrackingConfidence: number;
  minPresenceConfidence: number;
  runningMode: 'VIDEO';
}

export interface VisionConfig {
  camera: CameraConfig;
  tracking: TrackingConfig;
  trackingMode: TrackingMode;
}
