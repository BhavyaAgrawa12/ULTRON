export type OrbState =
  | 'idle'
  | 'thinking'
  | 'speaking'
  | 'executing'
  | 'listening'
  | 'offline'
  | 'error';

export type OrbSize = 'sm' | 'md' | 'lg' | 'xl';

export interface OrbProps {
  state?: OrbState;
  size?: OrbSize;
  className?: string;
}
