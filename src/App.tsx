import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroViewport } from './components/HeroViewport';
import { AboutSection } from './components/AboutSection';
import { Dashboard } from './components/Dashboard';
import { FooterGlow } from './components/FooterGlow';
import { DashboardTab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('risk');

  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const handleScrollToDashboard = (tab?: DashboardTab) => {
    if (tab) setActiveTab(tab);
    if (dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToAbout = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF2E4D] selection:text-black">
      {/* Sticky Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => handleScrollToDashboard(tab)}
        onLogoClick={handleLogoClick}
      />

      {/* SECTION 1: HERO VIEWPORT (CURSOR GRID, SOLID HEART & ECG SIGNALS) */}
      <HeroViewport onExploreClick={handleScrollToAbout} />

      {/* SECTION 2: ABOUT CHORDAE */}
      <div ref={aboutRef}>
        <AboutSection onGoToDashboard={() => handleScrollToDashboard('risk')} />
      </div>

      {/* SECTION 3: FUNCTIONAL DASHBOARD & 5 CORE TABS */}
      <div ref={dashboardRef} className="scroll-mt-16">
        <Dashboard activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      {/* FOOTER & Crimson Bottom Ambient Glow */}
      <FooterGlow />
    </div>
  );
}
