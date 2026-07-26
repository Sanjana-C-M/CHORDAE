import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';

export const FooterGlow: React.FC = () => {
  return (
    <footer className="relative w-full bg-black text-white py-12 border-t border-[#1F1F24] overflow-hidden">
      {/* STRICT BOTTOM AMBIENT GLOW: Faint deep-crimson radial gradient anchored strictly along bottom edge */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[180px] bg-radial from-[#2B060B]/70 via-[#1A0407]/40 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1F1F24]/80">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black border border-[#FF2E4D]/40 flex items-center justify-center text-[#FF2E4D] shadow-[0_0_15px_rgba(255,46,77,0.3)]">
              <Heart className="w-4 h-4 fill-[#FF2E4D] animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-[0.2em] text-white uppercase font-sans block">
                CHORDAE
              </span>
              <span className="text-[10px] font-mono text-[#9CA3AF] tracking-wider uppercase block -mt-1">
                AI Longitudinal Heart Companion
              </span>
            </div>
          </div>

          {/* Nav quick links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#9CA3AF]">
            <span>Risk Explainer</span>
            <span>Family History</span>
            <span>Symptom Log</span>
            <span>Habit Simulator</span>
            <span>Recovery Guide</span>
          </div>

          {/* Privacy badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#9CA3AF] bg-[#1F1F24]/60 px-3 py-1.5 rounded-full border border-[#2F2F36]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>HIPAA Compliant Architecture</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF] font-sans">
          <p className="text-center sm:text-left leading-relaxed max-w-3xl">
            <strong>Clinical Disclaimer:</strong> Chordae is an AI-powered educational and tracking companion designed to support informed conversations between patients and qualified healthcare providers. Chordae does not render clinical diagnoses or emergency medical services.
          </p>
          <span className="font-mono text-[10px] text-[#9CA3AF] shrink-0">
            © {new Date().getFullYear()} Chordae AI. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
