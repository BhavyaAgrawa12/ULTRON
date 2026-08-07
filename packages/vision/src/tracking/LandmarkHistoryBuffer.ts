/**
 * @file LandmarkHistoryBuffer.ts
 * @package @ultron/vision
 * @description 10-frame sliding window landmark history buffer for spatial velocity, trajectory, and swipe gesture prediction.
 */

import { HandLandmarksResult, Landmark3D } from '../types';

export interface FrameHistoryEntry {
  timestamp: number;
  results: HandLandmarksResult[];
}

export class LandmarkHistoryBuffer {
  private buffer: FrameHistoryEntry[] = [];
  private maxFrames = 10;

  constructor(maxFrames = 10) {
    this.maxFrames = maxFrames;
  }

  public push(results: HandLandmarksResult[], timestamp: number): void {
    this.buffer.push({ timestamp, results });
    if (this.buffer.length > this.maxFrames) {
      this.buffer.shift();
    }
  }

  public getHistory(): FrameHistoryEntry[] {
    return [...this.buffer];
  }

  public getLatestFrame(): FrameHistoryEntry | null {
    return this.buffer.length > 0 ? this.buffer[this.buffer.length - 1] : null;
  }

  /**
   * Calculates velocity of a specific joint landmark index (e.g. INDEX_FINGER_TIP: 8) in pixels/sec or normalized units/sec.
   */
  public getJointVelocity(jointIndex = 8, handIndex = 0): { vx: number; vy: number; vz: number } | null {
    if (this.buffer.length < 2) return null;

    const newest = this.buffer[this.buffer.length - 1];
    const oldest = this.buffer[0];

    const dt = (newest.timestamp - oldest.timestamp) / 1000;
    if (dt <= 0) return null;

    const newestHand = newest.results[handIndex];
    const oldestHand = oldest.results[handIndex];

    if (!newestHand || !oldestHand) return null;

    const p1: Landmark3D = newestHand.landmarks[jointIndex];
    const p0: Landmark3D = oldestHand.landmarks[jointIndex];

    if (!p1 || !p0) return null;

    return {
      vx: (p1.x - p0.x) / dt,
      vy: (p1.y - p0.y) / dt,
      vz: (p1.z - p0.z) / dt,
    };
  }

  public clear(): void {
    this.buffer = [];
  }
}
