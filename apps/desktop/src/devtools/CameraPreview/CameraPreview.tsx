import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  getVisionEngine,
  CameraDeviceInfo,
  CameraStatus,
  CameraPermissionState,
  ResolutionPreset,
  RESOLUTION_PRESETS,
  CameraStateChangeEvent,
  HandLandmarksResult,
  TrackingMode,
} from '@ultron/vision';
import { SkeletonRenderer } from './SkeletonRenderer';

interface CameraPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [devices, setDevices] = useState<CameraDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<ResolutionPreset>('720p');
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>('uninitialized');
  const [permissionState, setPermissionState] = useState<CameraPermissionState>('prompt');
  const [cameraFps, setCameraFps] = useState<number>(0);
  const [rendererFps, setRendererFps] = useState<number>(60);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [frameCount, setFrameCount] = useState<number>(0);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 1280, height: 720 });
  const [activeDeviceLabel, setActiveDeviceLabel] = useState<string>('None');

  // Tracking State Metrics
  const [trackingMode, setTrackingMode] = useState<TrackingMode>('hands');
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState<boolean>(false);
  const [trackingFps, setTrackingFps] = useState<number>(0);
  const [inferenceTimeMs, setInferenceTimeMs] = useState<number>(0);
  const [detectedHandsCount, setDetectedHandsCount] = useState<number>(0);
  const [isInitializingTracking, setIsInitializingTracking] = useState<boolean>(false);

  const visionEngine = getVisionEngine();

  // Renderer FPS calculation loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let count = 0;

    const calcLoop = () => {
      const now = performance.now();
      count++;
      if (now - lastTime >= 1000) {
        const currentRendererFps = Math.round((count * 1000) / (now - lastTime));
        setRendererFps(currentRendererFps);
        visionEngine.updateRendererFps(currentRendererFps);
        count = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcLoop);
    };

    animId = requestAnimationFrame(calcLoop);
    return () => cancelAnimationFrame(animId);
  }, [visionEngine]);

  // Video frame process & canvas skeleton render loop
  useEffect(() => {
    let animId: number;
    const frameLoop = () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        visionEngine.processVideoFrame(videoRef.current);

        const landmarks: HandLandmarksResult[] = visionEngine.getLatestLandmarks();
        setDetectedHandsCount(landmarks.length);

        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = videoRef.current.videoWidth || resolution.width;
            canvas.height = videoRef.current.videoHeight || resolution.height;
            SkeletonRenderer.renderSkeleton(ctx, landmarks, canvas.width, canvas.height);
          }
        }

        const trackingRuntime = visionEngine.getTrackingRuntime();
        setTrackingFps(trackingRuntime.getTrackingFps());
        setInferenceTimeMs(trackingRuntime.getInferenceTimeMs());
        setIsMediaPipeLoaded(trackingRuntime.isMediaPipeLoaded());
      }
      animId = requestAnimationFrame(frameLoop);
    };
    animId = requestAnimationFrame(frameLoop);
    return () => cancelAnimationFrame(animId);
  }, [visionEngine, resolution]);

  // Subscribe to VisionEventBus events
  useEffect(() => {
    const bus = visionEngine.getEventBus();

    const unsubStatus = bus.on('camera:statusChange', (evt: CameraStateChangeEvent) => {
      setCameraStatus(evt.currentStatus);
      setPermissionState(visionEngine.getCameraPermissionState());
    });

    const unsubGranted = bus.on('camera:permissionGranted', () => {
      setPermissionState('granted');
    });

    const unsubDenied = bus.on('camera:permissionDenied', () => {
      setPermissionState('denied');
    });

    const unsubReady = bus.on('camera:ready', (evt: { devices: CameraDeviceInfo[] }) => {
      setDevices(evt.devices);
      if (evt.devices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(evt.devices[0].deviceId);
      }
    });

    const unsubStarted = bus.on('camera:started', (evt: { stream: MediaStream; deviceId?: string }) => {
      if (videoRef.current && evt.stream) {
        videoRef.current.srcObject = evt.stream;
        videoRef.current.play().catch(() => {});
      }
      const activeDev = devices.find((d) => d.deviceId === evt.deviceId);
      if (activeDev) {
        setActiveDeviceLabel(activeDev.label);
      } else if (evt.deviceId) {
        setActiveDeviceLabel(evt.deviceId.slice(0, 16));
      }
    });

    const unsubStopped = bus.on('camera:stopped', () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setActiveDeviceLabel('None');
      setCameraFps(0);
      setDetectedHandsCount(0);
    });

    const unsubSwitched = bus.on('camera:switched', (evt: { deviceId: string; stream: MediaStream }) => {
      if (videoRef.current && evt.stream) {
        videoRef.current.srcObject = evt.stream;
      }
      const activeDev = devices.find((d) => d.deviceId === evt.deviceId);
      if (activeDev) {
        setActiveDeviceLabel(activeDev.label);
      }
    });

    // Frame callback subscription for metrics
    visionEngine.setOnFrameCallback((_source, metadata) => {
      setCameraFps(metadata.cameraFps);
      setLatencyMs(metadata.latencyMs);
      setResolution({ width: metadata.width, height: metadata.height });
      setFrameCount(metadata.frameId);
    });

    // Initialize device list
    visionEngine.getAvailableCameras().then((devList: CameraDeviceInfo[]) => {
      setDevices(devList);
      if (devList.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(devList[0].deviceId);
      }
    });

    setCameraStatus(visionEngine.getCameraStatus());
    setPermissionState(visionEngine.getCameraPermissionState());
    setIsMediaPipeLoaded(visionEngine.getTrackingRuntime().isMediaPipeLoaded());

    return () => {
      unsubStatus();
      unsubGranted();
      unsubDenied();
      unsubReady();
      unsubStarted();
      unsubStopped();
      unsubSwitched();
      visionEngine.setOnFrameCallback(null);
    };
  }, [visionEngine, devices, selectedDeviceId]);

  const handleInitializeTracking = useCallback(async () => {
    setIsInitializingTracking(true);
    try {
      await visionEngine.initializeHandTracking();
      setIsMediaPipeLoaded(true);
      setTrackingMode('hands');
    } catch (err) {
      console.error('[CameraPreview] Failed to initialize MediaPipe tracking:', err);
    } finally {
      setIsInitializingTracking(false);
    }
  }, [visionEngine]);

  const handleToggleTracking = useCallback(() => {
    const newMode: TrackingMode = trackingMode === 'hands' ? 'disabled' : 'hands';
    setTrackingMode(newMode);
    visionEngine.setTrackingMode(newMode);
  }, [visionEngine, trackingMode]);

  const handleRequestPermission = useCallback(async () => {
    const res = await visionEngine.requestCameraPermission();
    if (res === 'granted') {
      const devs = await visionEngine.getAvailableCameras();
      setDevices(devs);
      if (devs.length > 0) {
        setSelectedDeviceId(devs[0].deviceId);
      }
    }
  }, [visionEngine]);

  const handleStartCamera = useCallback(async () => {
    try {
      const targetPreset = selectedPreset === 'custom' ? '720p' : selectedPreset;
      const resConfig = RESOLUTION_PRESETS[targetPreset] || RESOLUTION_PRESETS['720p'];
      const stream = await visionEngine.startCamera({
        deviceId: selectedDeviceId || undefined,
        resolution: resConfig,
        preset: selectedPreset,
        targetFps: 30,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!isMediaPipeLoaded && !isInitializingTracking) {
        handleInitializeTracking();
      }
    } catch (err) {
      console.error('[CameraPreview] Failed to start camera:', err);
    }
  }, [visionEngine, selectedDeviceId, selectedPreset, isMediaPipeLoaded, isInitializingTracking, handleInitializeTracking]);

  const handleStopCamera = useCallback(async () => {
    await visionEngine.stopCamera();
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [visionEngine]);

  const handleTogglePause = useCallback(async () => {
    if (cameraStatus === 'active') {
      await visionEngine.pauseCamera();
    } else if (cameraStatus === 'paused') {
      await visionEngine.resumeCamera();
    }
  }, [visionEngine, cameraStatus]);

  const handleDeviceChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newDeviceId = e.target.value;
      setSelectedDeviceId(newDeviceId);
      if (cameraStatus === 'active' || cameraStatus === 'paused') {
        const stream = await visionEngine.switchCamera(newDeviceId);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    },
    [visionEngine, cameraStatus]
  );

  const handlePresetChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newPreset = e.target.value as ResolutionPreset;
      setSelectedPreset(newPreset);
      if (cameraStatus === 'active') {
        const targetKey = newPreset === 'custom' ? '720p' : newPreset;
        const resConfig = RESOLUTION_PRESETS[targetKey] || RESOLUTION_PRESETS['720p'];
        const stream = await visionEngine.startCamera({
          deviceId: selectedDeviceId || undefined,
          resolution: resConfig,
          preset: newPreset,
          targetFps: 30,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    },
    [visionEngine, cameraStatus, selectedDeviceId]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-6 w-96 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-xl z-50 overflow-hidden font-mono text-xs text-slate-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-cyan-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-bold tracking-wider text-cyan-300">VISION DIAGNOSTICS</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-slate-400">Ctrl+Shift+V</span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors px-1.5 py-0.5 rounded hover:bg-slate-700"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video Viewport Area with Canvas Skeleton Overlay */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-slate-800">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />

        {/* 21 Spatial Landmark Canvas Skeleton Overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {cameraStatus !== 'active' && cameraStatus !== 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/80 text-center space-y-2 z-10">
            {cameraStatus === 'permission_denied' ? (
              <>
                <span className="text-red-400 font-semibold">Camera Permission Denied</span>
                <span className="text-[10px] text-slate-400">Grant browser permission to enable vision preview</span>
                <button
                  onClick={handleRequestPermission}
                  className="mt-2 px-3 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded hover:bg-red-500/30 transition-colors"
                >
                  Grant Permission
                </button>
              </>
            ) : cameraStatus === 'requesting_permission' ? (
              <span className="text-amber-300 animate-pulse">Requesting Camera Permission...</span>
            ) : (
              <>
                <span className="text-slate-400">Camera Feed Inactive</span>
                <button
                  onClick={handleStartCamera}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded hover:bg-cyan-500/30 transition-colors"
                >
                  Start Camera Stream
                </button>
              </>
            )}
          </div>
        )}

        {/* Live Overlay Badges */}
        {(cameraStatus === 'active' || cameraStatus === 'paused') && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-cyan-500/40 text-[10px] flex space-x-2 z-10">
            <span className="text-cyan-300">Cam: {cameraFps} FPS</span>
            <span className="text-purple-300">Ren: {rendererFps} FPS</span>
            <span className="text-emerald-300">Trk: {trackingFps} FPS</span>
          </div>
        )}
      </div>

      {/* Diagnostics Panel Details */}
      <div className="p-3 space-y-2 text-[11px]">
        {/* Status Rows */}
        <div className="space-y-1 border-b border-slate-800 pb-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Status</span>
            <span
              className={`font-semibold ${
                cameraStatus === 'active'
                  ? 'text-emerald-400'
                  : cameraStatus === 'paused'
                  ? 'text-amber-400'
                  : cameraStatus === 'permission_denied'
                  ? 'text-red-400'
                  : 'text-slate-300'
              }`}
            >
              ● {cameraStatus.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Permission</span>
            <span
              className={`font-semibold ${
                permissionState === 'granted'
                  ? 'text-emerald-400'
                  : permissionState === 'denied'
                  ? 'text-red-400'
                  : 'text-amber-400'
              }`}
            >
              {permissionState.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Active Camera</span>
            <span className="text-cyan-300 font-medium truncate max-w-[200px]">{activeDeviceLabel}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Resolution</span>
            <span className="text-slate-200 font-bold">{`${resolution.width}×${resolution.height}`}</span>
          </div>
        </div>

        {/* MediaPipe & Tracking Diagnostics Rows */}
        <div className="space-y-1 border-b border-slate-800 pb-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">MediaPipe</span>
            <span
              className={`font-semibold ${
                isMediaPipeLoaded
                  ? 'text-emerald-400'
                  : isInitializingTracking
                  ? 'text-amber-300 animate-pulse'
                  : 'text-slate-500'
              }`}
            >
              {isMediaPipeLoaded ? 'Loaded' : isInitializingTracking ? 'Loading...' : 'Not Loaded'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Tracking Mode</span>
            <span className={`font-semibold ${trackingMode === 'hands' ? 'text-cyan-400' : 'text-slate-500'}`}>
              {trackingMode.toUpperCase()}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Hands Detected</span>
            <span className={`font-bold ${detectedHandsCount > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
              {detectedHandsCount} Hand{detectedHandsCount !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Inference Time</span>
            <span className="text-purple-300 font-bold">{`${inferenceTimeMs} ms`}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Startup Latency</span>
            <span className="text-emerald-300 font-bold">{`${latencyMs} ms`}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Landmark Smoother</span>
            <span className="text-emerald-300 font-bold">Enabled (1-Euro)</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Frame Count</span>
            <span className="text-amber-300 font-mono font-bold">{frameCount}</span>
          </div>
        </div>

        {/* Device & Preset Selectors */}
        <div className="space-y-1.5">
          <div>
            <label className="text-slate-400 block text-[10px] mb-0.5">Active Camera Device ({devices.length} found)</label>
            <select
              value={selectedDeviceId}
              onChange={handleDeviceChange}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded p-1 focus:border-cyan-500 focus:outline-none"
            >
              {devices.length === 0 && <option value="">No camera devices detected</option>}
              {devices.map((dev) => (
                <option key={dev.deviceId} value={dev.deviceId}>
                  {dev.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[10px] mb-0.5">Resolution Preset</label>
            <select
              value={selectedPreset}
              onChange={handlePresetChange}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded p-1 focus:border-cyan-500 focus:outline-none"
            >
              <option value="720p">720p (1280 × 720 @ 30 FPS)</option>
              <option value="1080p">1080p (1920 × 1080 @ 30 FPS)</option>
              <option value="480p">480p (640 × 480 @ 30 FPS)</option>
            </select>
          </div>
        </div>

        {/* Action Button Controls */}
        <div className="flex space-x-2 pt-1">
          {cameraStatus === 'active' || cameraStatus === 'paused' ? (
            <>
              <button
                onClick={handleStopCamera}
                className="flex-1 py-1 bg-red-500/20 text-red-300 border border-red-500/40 rounded hover:bg-red-500/30 transition-colors font-semibold text-[10px]"
              >
                Stop Camera
              </button>
              <button
                onClick={handleTogglePause}
                className="flex-1 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30 transition-colors font-semibold text-[10px]"
              >
                {cameraStatus === 'paused' ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleToggleTracking}
                className="flex-1 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded hover:bg-purple-500/30 transition-colors font-semibold text-[10px]"
              >
                {trackingMode === 'hands' ? 'Disable Trk' : 'Enable Trk'}
              </button>
            </>
          ) : (
            <button
              onClick={handleStartCamera}
              className="w-full py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded hover:bg-cyan-500/30 transition-colors font-semibold"
            >
              Start Camera
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
