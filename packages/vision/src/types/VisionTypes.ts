/**
 * @file VisionTypes.ts
 * @package @ultron/vision
 * @description Engine status, tracking mode configurations, and overall vision engine settings.
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

export interface VisionConfig {
  camera: CameraConfig;
  trackingMode: TrackingMode;
  maxHands?: number;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}
