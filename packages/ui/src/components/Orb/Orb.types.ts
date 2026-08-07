export type OrbState =
  | 'idle'
  | 'wake'
  | 'thinking'
  | 'listening'
  | 'speaking'
  | 'executing'
  | 'researching'
  | 'memory'
  | 'offline'
  | 'error';

export type OrbSize = 'sm' | 'md' | 'lg' | 'xl';

export interface OrbTransitionOptions {
  state: OrbState;
  duration?: number;
  source?: string;
}

export type OrbListener = (currentOptions: OrbTransitionOptions, previousOptions: OrbTransitionOptions) => void;

export interface OrbEngineInstance {
  transition: (options: OrbTransitionOptions | OrbState) => void;
  getState: () => OrbState;
  getOptions: () => OrbTransitionOptions;
  subscribe: (listener: OrbListener) => () => void;
  destroy: () => void;
}

export interface OrbProps {
  engine?: OrbEngineInstance;
  state?: OrbState;
  size?: OrbSize;
  className?: string;
}

export interface ParallaxOffset {
  x: number;
  y: number;
  tiltX: number;
  tiltY: number;
}
