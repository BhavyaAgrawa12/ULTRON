import React, { useMemo } from 'react';
import {
  ThemeProvider,
  SidebarShell,
  Orb,
  createOrbEngine,
  colors,
  fontFamilies,
} from '@ultron/ui';
import { Cpu, Layers, Activity, Shield } from 'lucide-react';
import { TitleBar } from './components/TitleBar';
import { StatusBar } from './components/StatusBar';
import { OrbPlayground } from './devtools/OrbPlayground/OrbPlayground';

export default function App() {
  // Pure TypeScript OrbEngine Instance
  const orbEngine = useMemo(() => createOrbEngine('idle'), []);

  return (
    <ThemeProvider>
      <div className="relative h-screen w-screen flex flex-col bg-[#05070A] text-[#F8FAFC] overflow-hidden select-none">
        {/* Custom Title Bar (48px) */}
        <TitleBar />

        {/* Workspace Body: Left Sidebar (88px) + Main Workspace */}
        <div className="flex-1 flex w-full overflow-hidden">
          {/* Left Sidebar Shell (Width: 88px, Collapsed only) */}
          <SidebarShell className="!w-[88px] min-w-[88px] max-w-[88px] flex flex-col items-center py-4 space-y-6">
            <div className="p-2.5 rounded-lg bg-[#121821] text-[#00D9FF] border border-[#1E293B]">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="p-2.5 rounded-lg bg-[#121821] text-[#94A3B8] border border-[#1E293B]">
              <Layers className="w-5 h-5" />
            </div>
            <div className="p-2.5 rounded-lg bg-[#121821] text-[#94A3B8] border border-[#1E293B]">
              <Activity className="w-5 h-5" />
            </div>
            <div className="p-2.5 rounded-lg bg-[#121821] text-[#94A3B8] border border-[#1E293B]">
              <Shield className="w-5 h-5" />
            </div>
          </SidebarShell>

          {/* Main Workspace (Centered) */}
          <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[#05070A] relative overflow-hidden">
            {/* Background grid texture */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />

            {/* HELIOS Orb Engine Visual Centerpiece */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6">
              <Orb engine={orbEngine} size="lg" />

              <div className="space-y-2">
                <h1
                  className="text-5xl md:text-6xl font-extrabold tracking-widest text-[#F8FAFC]"
                  style={{ fontFamily: fontFamilies.heading }}
                >
                  ULTRON
                </h1>

                <p
                  className="text-xs uppercase tracking-[0.3em] text-[#94A3B8] font-mono"
                  style={{ fontFamily: fontFamilies.code }}
                >
                  Version 0.0.1
                </p>

                <p
                  className="text-sm tracking-widest text-[#64748B] font-medium pt-1"
                  style={{ fontFamily: fontFamilies.body, color: colors.text.muted }}
                >
                  Operating Companion Platform
                </p>
              </div>
            </div>
          </main>
        </div>

        {/* Bottom Status Bar (32px) */}
        <StatusBar />

        {/* Development-Only Orb Playground */}
        {process.env.NODE_ENV !== 'production' && (
          <OrbPlayground engine={orbEngine} />
        )}
      </div>
    </ThemeProvider>
  );
}
