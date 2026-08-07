/**
 * @file CameraDevice.ts
 * @package @ultron/vision
 * @description Contract interface for interacting with individual camera capture devices.
 */

import { CameraDeviceInfo, CameraConfig, CameraStatus } from '../types';

export interface ICameraDevice {
  getInfo(): CameraDeviceInfo;
  getStatus(): CameraStatus;
  configure(config: CameraConfig): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
}

/**
 * Placeholder CameraDevice class contract.
 * No hardware calls or media stream access implemented in Phase 1.
 */
export class CameraDevice implements ICameraDevice {
  private status: CameraStatus = 'uninitialized';

  constructor(private info: CameraDeviceInfo) {}

  public getInfo(): CameraDeviceInfo {
    return { ...this.info };
  }

  public getStatus(): CameraStatus {
    return this.status;
  }

  public async configure(config: CameraConfig): Promise<void> {
    void config;
  }

  public async start(): Promise<void> {
    this.status = 'active';
  }

  public async stop(): Promise<void> {
    this.status = 'stopped';
  }
}
