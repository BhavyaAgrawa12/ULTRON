import React, { useState, useEffect, useRef } from 'react';
import { OrbState, OrbEngineInstance } from '@ultron/ui';
import { Activity, Sliders } from 'lucide-react';

interface OrbPlaygroundProps {
  engine: OrbEngineInstance;
}

const ALL_STATES: OrbState[] = [
  'idle',
  'wake',
  'thinking',
  'listening',
  'speaking',
  'executing',
  'researching',
  'memory',
  'offline',
  'error',
];

export const OrbPlayground: React.FC<OrbPlaygroundProps> = ({ engine }) => {
  const [activeState, setActiveState] = useState<OrbState>(engine.getState());
  const [fps, setFps] = useState<number>(60);
  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // Subscribe to engine state shifts
  useEffect(() => {
    const unsubscribe = engine.subscribe((options) => {
      setActiveState(options.state);
    });
    return () => unsubscribe();
  }, [engine]);

  // FPS Monitor animation loop
  useEffect(() => {
    let animId: number;

    const measureFps = (now: number) => {
      frameCountRef.current++;
      const delta = now - lastTimeRef.current;

      if (delta >= 1000) {
        const currentFps = Math.round((frameCountRef.current * 1000) / delta);
        setFps(currentFps);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleStateSelect = (state: OrbState) => {
    engine.transition({
      state,
      source: 'devtools-playground',
      duration: 300,
    });
  };

  return (
    <div className="fixed bottom-12 right-6 z-50 w-80 bg-[#121821]/95 border border-[#1E293B] rounded-xl shadow-2xl backdrop-blur-xl p-4 text-xs font-mono text-[#F8FAFC]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
        <div className="flex items-center space-x-2 text-[#00D9FF]">
          <Sliders className="w-4 h-4" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            HELIOS Orb Playground
          </span>
        </div>
        {/* FPS Badge */}
        <div className="flex items-center space-x-1.5 bg-[#05070A] px-2 py-0.5 rounded border border-[#1E293B]">
          <Activity
            className={`w-3 h-3 ${
              fps >= 55 ? 'text-[#22C55E]' : fps >= 40 ? 'text-[#F59E0B]' : 'text-[#EF4444]'
            }`}
          />
          <span className={fps >= 55 ? 'text-[#22C55E]' : 'text-[#EF4444]'}>
            {fps} FPS
          </span>
        </div>
      </div>

      {/* State Selector Buttons Grid */}
      <div className="mt-3">
        <label className="text-[10px] uppercase text-[#64748B] tracking-wider mb-2 block">
          Select Visual Engine State
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ALL_STATES.map((state) => {
            const isActive = activeState === state;
            return (
              <button
                key={state}
                onClick={() => handleStateSelect(state)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-mono capitalize transition-all duration-150 border text-left flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#00D9FF]/15 border-[#00D9FF] text-[#00D9FF] font-semibold shadow-[0_0_10px_rgba(0,217,255,0.2)]'
                    : 'bg-[#0B0F14] border-[#1E293B] text-[#94A3B8] hover:border-[#94A3B8]/40 hover:text-[#F8FAFC]'
                }`}
              >
                <span>{state}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active State Info */}
      <div className="mt-3 pt-2.5 border-t border-[#1E293B] text-[10px] text-[#64748B] flex items-center justify-between">
        <span>Source: devtools-playground</span>
        <span className="text-[#00D9FF] font-mono">Project HELIOS</span>
      </div>
    </div>
  );
};
