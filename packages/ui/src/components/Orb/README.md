# Orb Component

The **Orb** is ULTRON's central visual identity component. It provides animated visual feedback representing the current state of the platform.

## Purpose
Visualizes system activity and visual states (`idle`, `thinking`, `speaking`, `executing`, `listening`, `offline`, `error`) without coupling to backend logic.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `'idle' \| 'thinking' \| 'speaking' \| 'executing' \| 'listening' \| 'offline' \| 'error'` | `'idle'` | Visual state animation |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Dimensional scale of the Orb |
| `className` | `string` | `undefined` | Custom CSS class overrides |

## Example Usage
```tsx
import { Orb } from '@ultron/ui';

export function SystemStatusView() {
  return (
    <div className="flex justify-center p-8">
      <Orb state="thinking" size="lg" />
    </div>
  );
}
```

## Accessibility Notes
- Includes `role="img"` and descriptive `aria-label` matching the current state.
- Purely declarative visual state presentation.
