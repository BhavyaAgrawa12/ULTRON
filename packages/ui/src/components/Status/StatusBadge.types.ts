export type StatusVariant = 'online' | 'offline' | 'working' | 'warning' | 'error';

export interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}
