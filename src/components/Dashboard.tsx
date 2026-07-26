import React from 'react';
import { DashboardTab } from '../types';
import { TabRiskExplainer } from './tabs/TabRiskExplainer';
import { TabFamilyMapper } from './tabs/TabFamilyMapper';
import { TabSymptomJournal } from './tabs/TabSymptomJournal';
import { TabHabitSimulator } from './tabs/TabHabitSimulator';
import { TabRecoveryGuide } from './tabs/TabRecoveryGuide';
import { Activity, ShieldCheck, Heart, Sparkles, Sliders, Dna, HeartPulse, Bot } from 'lucide-react';

interface DashboardProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ activeTab, onSelectTab }) => {
  const tabsList: { id: DashboardTab; title: string; subtitle: string; icon: React.ElementType }[] = [
    { id: 'risk', title: 'Risk Explainer', subtitle: 'Heart Numbers', icon: Activity },
    { id: 'family', title: 'Family History', subtitle: 'Inherited Risk', icon: Dna },
    { id: 'symptom', title: 'Symptom Log', subtitle: 'Daily Journal', icon: HeartPulse },
    { id: 'simulator', title: 'Habit Simulator', subtitle: 'Lifestyle Goals', icon: Sliders },
    { id: 'recovery', title: 'Recovery Guide', subtitle: 'Rehab Care', icon: Bot },
  ];

  return (
    <section className="relative w-full min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Status Banner */}
        <div className="p-6 rounded-2xl bg-black/90 border border-[#1F1F24] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2E4D]/5 rounded-bl-full pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-black border border-[#FF2E4D]/40 flex items-center justify-center text-[#FF2E4D] shadow-[0_0_15px_rgba(255,46,77,0.3)] shrink-0">
              <Heart className="w-6 h-6 fill-[#FF2E4D] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Your Personal Heart Dashboard</h1>
                <span className="px-2 py-0.5 rounded-md bg-[#FF2E4D]/10 border border-[#FF2E4D]/40 text-[10px] font-mono text-[#FF2E4D] font-bold">
                  AI ACTIVE
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Simple heart health tracking • Gemini AI guidance • Clear insights for everyday life
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-[#1F1F24] pt-4 md:pt-0 md:pl-6">
            <div className="space-y-0.5">
              <span className="text-[#9CA3AF] text-[10px] uppercase block">Data Security</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Private & Secure
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[#9CA3AF] text-[10px] uppercase block">AI Assistant</span>
              <span className="text-white font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2E4D]" /> Gemini 3.6 Flash
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Grid Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {tabsList.map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTab(t.id)}
                className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col justify-between h-24 ${
                  isActive
                    ? 'bg-black border-[#FF2E4D] shadow-[0_0_20px_rgba(255,46,77,0.25)] relative'
                    : 'bg-black/60 border-[#1F1F24] hover:border-[#2F2F36] hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-4 right-4 h-[2px] bg-[#FF2E4D] rounded-full shadow-[0_0_8px_#FF2E4D]" />
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-mono font-bold ${isActive ? 'text-[#FF2E4D]' : 'text-[#9CA3AF]'}`}>
                    {t.subtitle}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF2E4D]' : 'text-[#9CA3AF]'}`} />
                </div>

                <span className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-[#9CA3AF]'}`}>
                  {t.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-black border border-[#1F1F24] min-h-[500px]">
          {activeTab === 'risk' && <TabRiskExplainer />}
          {activeTab === 'family' && <TabFamilyMapper />}
          {activeTab === 'symptom' && <TabSymptomJournal />}
          {activeTab === 'simulator' && <TabHabitSimulator />}
          {activeTab === 'recovery' && <TabRecoveryGuide />}
        </div>
      </div>
    </section>
  );
};
