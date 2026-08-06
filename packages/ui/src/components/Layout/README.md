# LayoutContainer Component

The **LayoutContainer** component provides the top-level operating companion layout structure.

## Purpose
Wraps application windows in the ULTRON dark background environment (`#05070A`) with subtle grid styling and top/bottom header/footer bar slots.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headerSlot` | `React.ReactNode` | `undefined` | Top system header bar slot |
| `footerSlot` | `React.ReactNode` | `undefined` | Bottom system footer bar slot |
| `className` | `string` | `undefined` | Custom CSS class overrides |

## Example Usage
```tsx
import { LayoutContainer } from '@ultron/ui';

export function WindowWrapper() {
  return (
    <LayoutContainer headerSlot={<div>ULTRON System</div>}>
      <div className="p-8">Content Area</div>
    </LayoutContainer>
  );
}
```

## Accessibility Notes
- Uses semantic `<header>`, `<main>`, and `<footer>` HTML tags.
