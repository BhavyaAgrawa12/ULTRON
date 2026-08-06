import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HealthResponse {
  status: string;
  service?: string;
  error?: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function pollHealth() {
      try {
        let result: HealthResponse | null = null;
        if (window.ultronAPI) {
          result = await window.ultronAPI.checkHealth();
        } else {
          const res = await fetch('http://127.0.0.1:8000/health');
          if (res.ok) {
            result = await res.json();
          }
        }

        if (isMounted && result) {
          setHealth(result);
        }
      } catch (err) {
        if (isMounted) {
          setHealth({ status: 'offline', error: String(err) });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    pollHealth();
    const interval = setInterval(pollHealth, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const isOnline = health?.status === 'ok';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white selection:bg-cyan-500 selection:text-black overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid line overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full"
      >
        {/* Title */}
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
          ULTRON
        </h1>

        {/* Subtitle / Version */}
        <p className="mt-2 text-xs md:text-sm uppercase tracking-[0.3em] text-gray-400 font-mono">
          Version 0.0.1
        </p>

        {/* Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex items-center justify-center space-x-2 bg-gray-900/60 border border-gray-800 backdrop-blur-md px-4 py-2 rounded-full shadow-inner"
        >
          <span className="relative flex h-3 w-3">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span 
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isOnline ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : loading ? 'bg-amber-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="text-sm font-medium tracking-wide text-gray-200">
            {isOnline ? '● ULTRON Core Online' : loading ? '● Connecting...' : '● ULTRON Core Offline'}
          </span>
        </motion.div>

        {/* Placeholder Status Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 w-full bg-gradient-to-b from-gray-900/80 to-gray-950/80 border border-gray-800/80 rounded-xl p-5 shadow-2xl backdrop-blur-xl text-left"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-800/60 text-xs font-mono text-gray-400 uppercase tracking-wider">
            <span>System Status</span>
            <span>Sprint 1 Bootstrap</span>
          </div>

          <div className="mt-4 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">Service:</span>
              <span className="text-cyan-400 font-semibold">{health?.service || 'ultron-core'}</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">Status:</span>
              <span className={isOnline ? 'text-emerald-400' : 'text-rose-400'}>
                {health?.status || (loading ? 'checking...' : 'offline')}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">Host:</span>
              <span>127.0.0.1:8000</span>
            </div>
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-gray-500">Platform:</span>
              <span>Electron + FastAPI</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle Footer */}
      <footer className="absolute bottom-6 text-[10px] font-mono tracking-widest text-gray-600 uppercase">
        AI Operating Companion Platform — Foundation Layer
      </footer>
    </div>
  );
}
