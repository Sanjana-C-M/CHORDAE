import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Heart, Activity, Sparkles } from 'lucide-react';
import { CursorGrid } from './CursorGrid';

interface HeroViewportProps {
  onExploreClick: () => void;
}

export const HeroViewport: React.FC<HeroViewportProps> = ({ onExploreClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartRef = useRef<HTMLDivElement | null>(null);
  const [isHeartHovered, setIsHeartHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ECG Waveform state - MOVING SLOWLY as requested (speed reduced to 0.8)
    let ecgX = 0;
    const ecgSpeed = 0.8;
    const ecgYBase = height * 0.52;

    const getECGHeight = (xRel: number) => {
      if (xRel > 0 && xRel < 15) return -Math.sin((xRel / 15) * Math.PI) * 12; // P wave
      if (xRel >= 20 && xRel < 28) return Math.sin(((xRel - 20) / 8) * Math.PI) * 8; // Q wave
      if (xRel >= 28 && xRel < 40) return -((xRel - 28) / 12) * 85; // R wave spike
      if (xRel >= 40 && xRel < 50) return ((xRel - 40) / 10) * 35; // S wave drop
      if (xRel >= 65 && xRel < 95) return -Math.sin(((xRel - 65) / 30) * Math.PI) * 22; // T wave
      return 0;
    };

    // Particles Aura Setup around Heart
    const PARTICLE_COUNT = 55;
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      baseAngle: number;
      speed: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        baseAngle: angle,
        speed: 0.015 + Math.random() * 0.02,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Get exact DOM position of the heart badge
      let heartCenterX = width / 2;
      let heartCenterY = height / 2 - 40;

      if (heartRef.current) {
        const rect = heartRef.current.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        heartCenterX = rect.left + rect.width / 2 - canvasRect.left;
        heartCenterY = rect.top + rect.height / 2 - canvasRect.top;
      }

      // --- 1. Draw Slow ECG Waveform Sweep ---
      ecgX = (ecgX + ecgSpeed) % width;
      ctx.beginPath();
      ctx.strokeStyle = '#FF2E4D';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#FF2E4D';
      ctx.shadowBlur = 10;

      for (let x = 0; x < width; x += 3) {
        let distFromLead = (x - ecgX + width) % width;
        let opacity = 0;

        if (distFromLead < 280) {
          opacity = (1 - distFromLead / 280) * 0.6;
        }

        const yOffset = getECGHeight(distFromLead % 180);
        const y = ecgYBase + yOffset;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // --- 2. Particles Aura around Heart ---
      particles.forEach((p) => {
        if (isHeartHovered) {
          // Circle around the exact center of the heart element
          p.baseAngle += p.speed;
          const orbitRadius = 68 + Math.sin(frame * 0.06 + p.baseAngle) * 8;
          const targetX = heartCenterX + Math.cos(p.baseAngle) * orbitRadius;
          const targetY = heartCenterY + Math.sin(p.baseAngle) * orbitRadius;

          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
          p.alpha = 0.85;
        } else {
          // Ambient gentle floating
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          p.alpha = 0.3;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 46, 77, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (isHeartHovered) {
        // Glowing ring directly framing the heart element
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 46, 77, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.arc(heartCenterX, heartCenterY, 68, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHeartHovered]);

  return (
    <section className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-black text-white select-none">
      {/* Integrated React Bits CursorGrid Component in Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
        <CursorGrid
          cellSize={60}
          color="#FF2E4D"
          radius={160}
          falloff="smooth"
          holdTime={400}
          fadeDuration={700}
          lineWidth={1.2}
          maxOpacity={0.9}
          fillOpacity={0.12}
          gridOpacity={0.06}
          cellRadius={4}
          clickPulse={true}
          pulseSpeed={550}
        />
      </div>

      {/* Slow ECG & Particles Overlay Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto pointer-events-none">
        
        {/* CENTERED SOLID RED 3D HEART WITH PARTICLES CIRCLING IT */}
        <div
          ref={heartRef}
          className="pointer-events-auto cursor-pointer relative group my-6 transition-transform duration-300 transform hover:scale-110"
          onMouseEnter={() => setIsHeartHovered(true)}
          onMouseLeave={() => setIsHeartHovered(false)}
        >
          {/* Pulsing Back Glow Ring */}
          <div
            className={`absolute -inset-4 rounded-full bg-[#FF2E4D] opacity-30 blur-xl transition-all duration-500 ${
              isHeartHovered ? 'opacity-90 scale-125 animate-pulse' : 'animate-ping'
            }`}
            style={{ animationDuration: isHeartHovered ? '0.8s' : '2.5s' }}
          />

          {/* Solid 3D Red Heart Badge */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#FF3B5C] via-[#FF2E4D] to-[#B3001B] p-[2px] shadow-[0_0_35px_rgba(255,46,77,0.6)] flex items-center justify-center border border-[#FF6B81]/40">
            <div className="w-full h-full bg-black/90 rounded-[14px] flex items-center justify-center backdrop-blur-md">
              <Heart
                className={`w-10 h-10 sm:w-12 sm:h-12 text-[#FF2E4D] fill-[#FF2E4D] transition-transform duration-300 ${
                  isHeartHovered ? 'scale-125 rotate-3' : 'animate-pulse'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-3 mt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F24]/80 border border-[#2F2F36] text-xs font-mono text-[#9CA3AF] tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5 text-[#FF2E4D] animate-pulse" />
            <span>PERSONAL HEART HEALTH COMPANION</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[0.25em] text-white uppercase font-sans drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
            CHORDAE
          </h1>

          <p className="text-base sm:text-lg text-[#9CA3AF] max-w-xl font-normal leading-relaxed font-sans">
            Unifying your heart health profile, beat by beat.
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-8 pointer-events-auto">
          <button
            onClick={onExploreClick}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-black border border-[#FF2E4D]/60 text-white font-medium text-sm tracking-wide transition-all duration-300 hover:bg-[#FF2E4D] hover:text-black hover:border-[#FF2E4D] shadow-[0_0_20px_rgba(255,46,77,0.25)] hover:shadow-[0_0_35px_rgba(255,46,77,0.7)]"
          >
            <Sparkles className="w-4 h-4 text-[#FF2E4D] group-hover:text-black transition-colors" />
            <span>Open Heart Health Dashboard</span>
            <ChevronDown className="w-4 h-4 text-[#FF2E4D] group-hover:text-black transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={onExploreClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#FF2E4D] transition-colors group cursor-pointer"
        aria-label="Scroll to learn more"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase">Scroll To Explore</span>
        <div className="w-7 h-7 rounded-full bg-black/80 border border-[#1F1F24] flex items-center justify-center group-hover:border-[#FF2E4D]/50">
          <ChevronDown className="w-4 h-4 text-[#FF2E4D] animate-bounce" />
        </div>
      </button>
    </section>
  );
};
