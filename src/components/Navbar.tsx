import React from 'react';
import { Heart, User } from 'lucide-react';
import { DashboardTab } from '../types';

interface NavbarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onLogoClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onSelectTab, onLogoClick }) => {
  const navItems: { id: DashboardTab; label: string }[] = [
    { id: 'risk', label: 'Risk Explainer' },
    { id: 'family', label: 'Family History' },
    { id: 'symptom', label: 'Symptom Log' },
    { id: 'simulator', label: 'Habit Simulator' },
    { id: 'recovery', label: 'Recovery Guide' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-xl border-b border-[#1F1F24] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Glowing Wordmark + Minimal Heart Pulse */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-black border border-[#FF2E4D]/40 flex items-center justify-center text-[#FF2E4D] shadow-[0_0_12px_rgba(255,46,77,0.3)] group-hover:border-[#FF2E4D] group-hover:shadow-[0_0_20px_rgba(255,46,77,0.6)] transition-all">
            <Heart className="w-4 h-4 fill-[#FF2E4D] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-[0.2em] text-white uppercase font-sans group-hover:text-[#FF2E4D] transition-colors">
              CHORDAE
            </span>
            <span className="text-[9px] font-mono text-[#9CA3AF] -mt-1 tracking-wider uppercase">
              HEART AI COMPANION
            </span>
          </div>
        </button>

        {/* Center: Horizontal Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0A0A0C] p-1 rounded-xl border border-[#1F1F24]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  isActive
                    ? 'text-white font-semibold bg-black/80 shadow-[0_0_15px_rgba(255,46,77,0.15)] border border-[#FF2E4D]/30'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>

                {/* Glowing Crimson Underline for Active Tab */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#FF2E4D] shadow-[0_0_8px_#FF2E4D] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Active Pill Badge & User Avatar */}
        <div className="flex items-center gap-3">
          {/* AI Active Pill Badge */}
          <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-black border border-[#1F1F24] text-[11px] font-mono text-[#9CA3AF]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF2E4D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF2E4D]"></span>
            </span>
            <span className="text-white font-medium">AI Active</span>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#1F1F24] border border-[#2F2F36] flex items-center justify-center text-[#9CA3AF] hover:border-[#FF2E4D]/50 hover:text-white transition-colors cursor-pointer">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs Bar */}
      <div className="md:hidden flex items-center justify-around bg-black border-t border-[#1F1F24] px-2 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium transition-colors ${
                isActive
                  ? 'text-[#FF2E4D] bg-[#1F1F24] font-bold border-b-2 border-[#FF2E4D]'
                  : 'text-[#9CA3AF] hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
