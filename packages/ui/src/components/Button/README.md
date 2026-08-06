# Button Component

The **Button** component provides interactive triggers styled according to the ULTRON dark operating system theme.

## Purpose
Renders accessible, token-styled button actions across five variants (`primary`, `secondary`, `danger`, `ghost`, `outline`) and three sizes (`sm`, `md`, `lg`).

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost' \| 'outline'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Scale size of the button |
| `isLoading` | `boolean` | `false` | Displays loading spinner indicator |
| `leftIcon` | `React.ReactNode` | `undefined` | Icon rendered before text |
| `rightIcon` | `React.ReactNode` | `undefined` | Icon rendered after text |

## Example Usage
```tsx
import { Button } from '@ultron/ui';

export function ActionView() {
  return (
    <Button variant="primary" size="md">
      Execute Command
    </Button>
  );
}
```

## Accessibility Notes
- Built using native `<button>` element with focus ring indicators (`focus:ring-[#00D9FF]`).
- Supports standard `disabled` and `aria-*` attributes.
- Keyboard accessible via Space and Enter keys.
