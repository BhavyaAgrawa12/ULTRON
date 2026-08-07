/**
 * @file FrameLoop.ts
 * @package @ultron/vision
 * @description Frame loop manager responsible for Camera/Renderer FPS tracking, latency calculation, and onFrame callback dispatches.
 */

import { FrameMetaData } from '../types';

export type FrameSource = HTMLVideoElement | ImageBitmap;

export type OnFrameCallback = (source: FrameSource, metadata: FrameMetaData) => void;

export class FrameLoop {
  private frameIdCounter = 0;
  private lastFrameTimestamp = 0;
  private cameraFps = 0;
  private rendererFps = 60;
  private latencyMs = 0;
  private onFrameCallback: OnFrameCallback | null = null;

  public setOnFrameCallback(callback: OnFrameCallback | null): void {
    this.onFrameCallback = callback;
  }

  public updateRendererFps(fps: number): void {
    this.rendererFps = fps;
  }

  public setStartupLatency(latency: number): void {
    this.latencyMs = latency;
  }

  public processVideoFrame(source: FrameSource): void {
    const now = performance.now();
    this.frameIdCounter++;

    if (this.lastFrameTimestamp > 0) {
      const delta = now - this.lastFrameTimestamp;
      if (delta > 0) {
        const instantFps = 1000 / delta;
        this.cameraFps = Math.round(this.cameraFps * 0.85 + instantFps * 0.15);
      }
    }
    this.lastFrameTimestamp = now;

    let width = 1280;
    let height = 720;

    if (source instanceof HTMLVideoElement) {
      width = source.videoWidth || 1280;
      height = source.videoHeight || 720;
    } else if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
      width = source.width;
      height = source.height;
    }

    const metadata: FrameMetaData = {
      frameId: this.frameIdCounter,
      timestamp: now,
      width,
      height,
      cameraFps: this.cameraFps || 30,
      rendererFps: this.rendererFps,
      latencyMs: this.latencyMs,
    };

    if (this.onFrameCallback) {
      try {
        this.onFrameCallback(source, metadata);
      } catch (err) {
        console.error('[FrameLoop] Error inside onFrame callback:', err);
      }
    }
  }

  public getFrameMetrics(): { cameraFps: number; rendererFps: number; latencyMs: number; frameId: number } {
    return {
      cameraFps: this.cameraFps,
      rendererFps: this.rendererFps,
      latencyMs: this.latencyMs,
      frameId: this.frameIdCounter,
    };
  }

  public reset(): void {
    this.frameIdCounter = 0;
    this.lastFrameTimestamp = 0;
    this.cameraFps = 0;
  }
}
