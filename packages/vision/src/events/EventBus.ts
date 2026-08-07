/**
 * @file EventBus.ts
 * @package @ultron/vision
 * @description Strongly-typed event bus emitter for vision events.
 */

import { VisionEventMap } from './VisionEvents';

export type VisionEventListener<K extends keyof VisionEventMap> = (
  data: VisionEventMap[K]
) => void;

export class VisionEventBus {
  private listeners: Map<keyof VisionEventMap, Set<unknown>> = new Map();

  public on<K extends keyof VisionEventMap>(
    event: K,
    listener: VisionEventListener<K>
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(listener);

    return () => {
      set.delete(listener);
    };
  }

  public emit<K extends keyof VisionEventMap>(
    event: K,
    data: VisionEventMap[K]
  ): void {
    const set = this.listeners.get(event);
    if (!set) return;

    set.forEach((listener) => {
      try {
        (listener as VisionEventListener<K>)(data);
      } catch (err) {
        console.error(`[VisionEventBus] Error handling event '${String(event)}':`, err);
      }
    });
  }

  public removeAllListeners(): void {
    this.listeners.clear();
  }
}
