# Input Component

The **Input** component provides textual input fields with subtle cyan focus glows and dark surface styling.

## Purpose
Renders accessible text input controls. Uses default placeholder *"Awaiting your objective..."* per ULTRON design philosophy.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `undefined` | Uppercase text label rendered above input |
| `placeholder` | `string` | `"Awaiting your objective..."` | Input placeholder string |
| `error` | `string` | `undefined` | Error message displayed below input |
| `leftIcon` | `React.ReactNode` | `undefined` | Prefix icon slot |
| `rightIcon` | `React.ReactNode` | `undefined` | Suffix icon slot |

## Example Usage
```tsx
import { Input } from '@ultron/ui';

export function ObjectiveForm() {
  return (
    <Input
      label="Command Objective"
      placeholder="Awaiting your objective..."
    />
  );
}
```

## Accessibility Notes
- Renders standard native `<input>` element.
- Connects labels and error messages for screen readers.
