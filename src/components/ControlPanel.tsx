import { useState } from 'react';
import { AppState } from '../types';

interface ControlPanelProps {
  state: AppState;
  onToggleMode: () => void;
}

export const ControlPanel = ({ state, onToggleMode }: ControlPanelProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelVisibility = mobileOpen ? 'flex' : 'hidden';

  return (
    <div className="absolute inset-0 pointer-events-none p-4 sm:p-5 md:p-6 text-[#00FF00] font-mono tracking-wider z-10">
      <button
        onClick={() => setMobileOpen(v => !v)}
        className="fixed bottom-4 left-4 pointer-events-auto md:hidden bg-black/70 border border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00] hover:text-black transition-colors px-3 py-2 text-xs tracking-widest uppercase rounded"
      >
        {mobileOpen ? 'Hide HUD' : 'Show HUD'}
      </button>

      <div
        className={`${mobilePanelVisibility} md:flex flex-col gap-4 md:flex-row md:justify-between md:items-start pointer-events-none`}
      >
        {/* Left Panel */}
        <div className="flex flex-col gap-4 bg-black/50 p-4 border border-[#00FF00]/30 rounded backdrop-blur-sm pointer-events-auto w-full max-w-md md:max-w-none md:w-64 max-h-[70vh] overflow-y-auto">
          <div>
            <h1 className="text-xl font-bold text-gold mb-1 text-[#FFD700]">XMAS ARCHITECT</h1>
            <div className="h-px w-full bg-[#00FF00]/50 mb-2"></div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>MODE</span>
              <span className={state.mode === 'FORMED' ? 'text-[#00FF00]' : 'text-red-500'}>
                {state.mode}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>CAM FEED</span>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span>HAND TRACK</span>
              <div className={`w-2 h-2 rounded-full ${state.handDetected ? 'bg-[#00FF00]' : 'bg-yellow-500'}`}></div>
            </div>

            <div className="flex justify-between items-center">
              <span>GESTURE</span>
              <span className="text-[#FFD700]">{state.gesture}</span>
            </div>
          </div>

          <div className="mt-4 space-y-1 text-xs opacity-80">
            <div className="flex justify-between">
              <span>PARTICLES</span>
              <span>2500</span>
            </div>
            <div className="flex justify-between">
              <span>FPS</span>
              <span>{state.stats.fps}</span>
            </div>
            <div className="flex justify-between">
              <span>STREAM</span>
              <span>29.4 MB/s</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4 bg-black/50 p-4 border border-[#00FF00]/30 rounded backdrop-blur-sm pointer-events-auto w-full max-w-md md:max-w-none md:w-64 text-left md:text-right md:self-start max-h-[70vh] overflow-y-auto">
          <div className="text-sm mb-2">CONTROLS</div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>SPIN</span>
                <span>0.200</span>
              </div>
              <input type="range" className="w-full accent-[#FFD700] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>SCALE</span>
                <span>1.100</span>
              </div>
              <input type="range" className="w-full accent-[#FFD700] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span>DENSITY</span>
                <span>4.298</span>
              </div>
              <input type="range" className="w-full accent-[#FFD700] h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span>Hand Tracking</span>
              <div className="w-8 h-4 bg-[#00FF00]/20 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-[#00FF00] rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>HUD Skeleton</span>
              <div className="w-8 h-4 bg-[#00FF00]/20 rounded-full relative">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-[#00FF00] rounded-full"></div>
              </div>
            </div>
          </div>

          <button 
            onClick={onToggleMode}
            className="mt-4 border border-[#00FF00] text-[#00FF00] hover:bg-[#00FF00] hover:text-black transition-colors py-2 px-4 text-xs tracking-widest uppercase w-full md:w-auto text-center"
          >
            &gt;&gt; NEXT FORM ⚡
          </button>
        </div>
      </div>
    </div>
  );
};
