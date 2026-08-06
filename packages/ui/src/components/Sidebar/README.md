# SidebarShell Component

The **SidebarShell** component provides the structural layout container for sidebars.

## Purpose
Offers a token-styled, collapsable side container (`#0B0F14`) with header, item, and footer slots. Contains zero routing or business logic per ULTRON design system rules.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headerSlot` | `React.ReactNode` | `undefined` | Top header element slot |
| `footerSlot` | `React.ReactNode` | `undefined` | Bottom footer element slot |
| `isCollapsed` | `boolean` | `false` | Toggles collapsed (width: 16) vs expanded (width: 64) view |
| `className` | `string` | `undefined` | Custom CSS class overrides |

## Example Usage
```tsx
import { SidebarShell } from '@ultron/ui';

export function SidebarLayout() {
  return (
    <SidebarShell headerSlot={<span>Control Center</span>}>
      <div>Item 1</div>
      <div>Item 2</div>
    </SidebarShell>
  );
}
```

## Accessibility Notes
- Renders standard `<aside>` landmark element.
