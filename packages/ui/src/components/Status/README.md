# StatusBadge Component

The **StatusBadge** component displays system connectivity and execution states.

## Purpose
Presents real-time visual status pills (`online`, `offline`, `working`, `warning`, `error`) with pulse indicators.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'online' \| 'offline' \| 'working' \| 'warning' \| 'error'` | Required | Visual status state |
| `label` | `string` | Status default string | Optional text label override |
| `className` | `string` | `undefined` | Custom CSS class overrides |

## Example Usage
```tsx
import { StatusBadge } from '@ultron/ui';

export function HeaderStatus() {
  return (
    <StatusBadge status="online" label="ULTRON Core Online" />
  );
}
```

## Accessibility Notes
- Status dots include high-contrast color indicators and text labels.
