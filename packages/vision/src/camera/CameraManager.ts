/**
 * @file CameraManager.ts
 * @package @ultron/vision
 * @description Camera lifecycle manager responsible for device enumeration and active camera streams.
 */

import { CameraDeviceInfo, CameraConfig, CameraStatus } from '../types';
import { CameraDevice } from './CameraDevice';

export class CameraManager {
  private activeDevice: CameraDevice | null = null;
  private status: CameraStatus = 'uninitialized';

  public async getAvailableDevices(): Promise<CameraDeviceInfo[]> {
    // Placeholder device enumeration contract for Phase 1
    return [];
  }

  public async selectDevice(deviceId: string): Promise<CameraDevice | null> {
    void deviceId;
    return null;
  }

  public async initialize(config: CameraConfig): Promise<void> {
    void config;
    this.status = 'initializing';
    // Placeholder initialization contract for Phase 1
    this.status = 'active';
  }

  public getStatus(): CameraStatus {
    return this.status;
  }

  public getActiveDevice(): CameraDevice | null {
    return this.activeDevice;
  }

  public async shutdown(): Promise<void> {
    if (this.activeDevice) {
      await this.activeDevice.stop();
      this.activeDevice = null;
    }
    this.status = 'stopped';
  }
}
