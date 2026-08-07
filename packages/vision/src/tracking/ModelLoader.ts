/**
 * @file ModelLoader.ts
 * @package @ultron/vision
 * @description Configurable MediaPipe HandLandmarker Wasm asset and model binary loader.
 */

import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

export interface ModelLoaderOptions {
  wasmPath?: string;
  modelAssetPath?: string;
  delegate?: 'GPU' | 'CPU';
  numHands?: number;
  minHandDetectionConfidence?: number;
  minTrackingConfidence?: number;
  minPresenceConfidence?: number;
}

export const DEFAULT_MODEL_CONFIG: Required<ModelLoaderOptions> = {
  wasmPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
  delegate: 'GPU',
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
  minPresenceConfidence: 0.5,
};

export class ModelLoader {
  private static instance: HandLandmarker | null = null;
  private static isLoading = false;

  public static async loadHandLandmarker(options?: ModelLoaderOptions): Promise<HandLandmarker> {
    if (ModelLoader.instance) {
      return ModelLoader.instance;
    }

    if (ModelLoader.isLoading) {
      while (ModelLoader.isLoading) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (ModelLoader.instance) {
        return ModelLoader.instance;
      }
    }

    ModelLoader.isLoading = true;

    try {
      const config = { ...DEFAULT_MODEL_CONFIG, ...options };
      const vision = await FilesetResolver.forVisionTasks(config.wasmPath);

      const handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: config.modelAssetPath,
          delegate: config.delegate,
        },
        runningMode: 'VIDEO',
        numHands: config.numHands,
        minHandDetectionConfidence: config.minHandDetectionConfidence,
        minTrackingConfidence: config.minTrackingConfidence,
        minHandPresenceConfidence: config.minPresenceConfidence,
      });

      ModelLoader.instance = handLandmarker;
      ModelLoader.isLoading = false;
      return handLandmarker;
    } catch (err) {
      ModelLoader.isLoading = false;
      if (options?.delegate !== 'CPU') {
        console.warn('[ModelLoader] GPU delegate failed, retrying with CPU delegate...');
        return ModelLoader.loadHandLandmarker({ ...options, delegate: 'CPU' });
      }
      throw err;
    }
  }

  public static isLoaded(): boolean {
    return ModelLoader.instance !== null;
  }

  public static dispose(): void {
    if (ModelLoader.instance) {
      ModelLoader.instance.close();
      ModelLoader.instance = null;
    }
  }
}
