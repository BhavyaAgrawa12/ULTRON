/**
 * @file TrackingLoop.ts
 * @package @ultron/vision
 * @description Frame processing tracking loop orchestrator for vision frame capture cycles.
 */

export type FrameCallback = () => void;

export class TrackingLoop {
  private isRunning = false;
  private targetFps = 30;

  constructor(targetFps?: number) {
    if (targetFps) {
      this.targetFps = targetFps;
    }
  }

  public start(callback: FrameCallback): void {
    void callback;
    this.isRunning = true;
  }

  public stop(): void {
    this.isRunning = false;
  }

  public isActive(): boolean {
    return this.isRunning;
  }

  public getTargetFps(): number {
    return this.targetFps;
  }
}
