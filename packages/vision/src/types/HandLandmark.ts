/**
 * @file HandLandmark.ts
 * @package @ultron/vision
 * @description 3D spatial hand landmark structures and handedness representations.
 */

export interface Landmark3D {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type Handedness = 'Left' | 'Right';

export interface HandLandmarksResult {
  landmarks: Landmark3D[];
  worldLandmarks: Landmark3D[];
  handedness: Handedness;
  score: number;
}
