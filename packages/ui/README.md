# @ultron/ui — Design System Foundation

Official ULTRON Design System library providing tokens, theme provider, and reusable UI components for the ULTRON AI Operating Companion Platform.

## 🎨 Design System Philosophy
The ULTRON design language is built to feel like an **intelligent operating system control center**:
- **Palette**: Dark, high contrast (#05070A primary background, #121821 surface, #00D9FF cyan accent).
- **Typography**: Space Grotesk (headings), Inter (body), JetBrains Mono (code).
- **Motion**: Calm, crisp Framer Motion visual feedback capped at 250ms animation / 500ms transition.

## 📦 Exported Modules
- **Tokens**: `colors`, `spacing`, `radius`, `shadows`, `typography`, `animation`, `zIndex`.
- **Theme**: `ThemeProvider`, `useTheme`, `darkTheme`.
- **Components**: `Orb`, `Button`, `Card`, `Input`, `StatusBadge`, `LayoutContainer`, `SidebarShell`.
- **Utilities**: `cn`.

## 🚀 Quick Usage
```tsx
import { ThemeProvider, LayoutContainer, Orb, StatusBadge, Button, Card, Input } from '@ultron/ui';

export function Dashboard() {
  return (
    <ThemeProvider>
      <LayoutContainer headerSlot={<StatusBadge status="online" />}>
        <div className="flex flex-col items-center justify-center p-8 space-y-6">
          <Orb state="idle" size="lg" />
          <Card header="Control System">
            <Input label="Objective" placeholder="Awaiting your objective..." />
            <Button variant="primary" className="mt-4">Execute</Button>
          </Card>
        </div>
      </LayoutContainer>
    </ThemeProvider>
  );
}
```
