# Card Component

The **Card** component presents content containers with a matte surface (`#121821`), thin border (`#1E293B`), and soft shadow without glassmorphism.

## Purpose
Provides structured content grouping for status cards, metric containers, and panel blocks.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `React.ReactNode` | `undefined` | Optional top header bar slot |
| `footer` | `React.ReactNode` | `undefined` | Optional bottom footer bar slot |
| `hoverable` | `boolean` | `false` | Enables subtle border accent glow on hover |
| `className` | `string` | `undefined` | Custom CSS class overrides |

## Example Usage
```tsx
import { Card } from '@ultron/ui';

export function SystemCard() {
  return (
    <Card header="Engine Status" hoverable>
      <p className="text-sm text-[#F8FAFC]">ULTRON Core active on port 8000.</p>
    </Card>
  );
}
```

## Accessibility Notes
- Renders standard semantic HTML structure.
- High contrast borders (`#1E293B`) ensure clear container boundaries.
