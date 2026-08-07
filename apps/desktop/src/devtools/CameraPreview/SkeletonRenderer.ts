/**
 * @file SkeletonRenderer.ts
 * @package @ultron/desktop/devtools
 * @description HTML5 Canvas renderer for 21 3D spatial hand joint nodes and 20 connecting bone vectors.
 */

import { HandLandmarksResult, HAND_CONNECTIONS } from '@ultron/vision';

export class SkeletonRenderer {
  public static renderSkeleton(
    ctx: CanvasRenderingContext2D,
    results: HandLandmarksResult[],
    width: number,
    height: number
  ): void {
    ctx.clearRect(0, 0, width, height);

    if (!results || results.length === 0) return;

    for (const handResult of results) {
      const { landmarks, handedness } = handResult;
      if (!landmarks || landmarks.length < 21) continue;

      const nodeColor = handedness === 'Left' ? '#00D9FF' : '#10B981';
      const strokeColor = handedness === 'Left' ? 'rgba(0, 217, 255, 0.65)' : 'rgba(16, 185, 129, 0.65)';
      const nodeFill = '#FFFFFF';

      // 1. Draw 20 Connecting Bone Vectors
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = strokeColor;

      for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
        const p1 = landmarks[startIdx];
        const p2 = landmarks[endIdx];

        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x * width, p1.y * height);
          ctx.lineTo(p2.x * width, p2.y * height);
          ctx.stroke();
        }
      }

      // 2. Draw 21 Joint Landmark Nodes
      for (let i = 0; i < landmarks.length; i++) {
        const lm = landmarks[i];
        const x = lm.x * width;
        const y = lm.y * height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = nodeFill;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Draw Handedness Badge at Wrist Node
      const wrist = landmarks[0];
      if (wrist) {
        const wx = wrist.x * width;
        const wy = wrist.y * height + 16;
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = nodeColor;
        ctx.fillText(`${handedness.toUpperCase()} (${Math.round(handResult.score * 100)}%)`, wx - 20, wy);
      }
    }
  }
}
