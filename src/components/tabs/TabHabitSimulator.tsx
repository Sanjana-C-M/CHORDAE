import React, { useState } from 'react';
import { Sliders, Gauge, Zap, CheckCircle } from 'lucide-react';
import { LifestyleParams } from '../../types';

export const TabHabitSimulator: React.FC = () => {
  const [params, setParams] = useState<LifestyleParams>({
    sodiumMg: 3400,
    exerciseMins: 45,
    cigarettesDaily: 5,
  });

  const calculateSimulatedRisk = (p: LifestyleParams) => {
    let baseRisk = 12.0;

    const sodiumExcess = Math.max(0, p.sodiumMg - 1500);
    const sodiumImpact = (sodiumExcess / 500) * 0.8;
    const exerciseBenefit = (p.exerciseMins / 30) * 0.9;
    const cigImpact = p.cigarettesDaily * 1.2;

    const simulatedScore = Math.max(1.8, Math.round((baseRisk + sodiumImpact + cigImpact - exerciseBenefit) * 10) / 10);

    let category: 'Optimal' | 'Low Risk' | 'Moderate Risk' | 'Elevated' | 'High Risk' = 'Moderate Risk';
    if (simulatedScore < 4.0) category = 'Optimal';
    else if (simulatedScore < 7.5) category = 'Low Risk';
    else if (simulatedScore < 14.0) category = 'Moderate Risk';
    else if (simulatedScore < 20.0) category = 'Elevated';
    else category = 'High Risk';

    const bpReduction = Math.round((p.exerciseMins / 150) * 5 + Math.max(0, (3400 - p.sodiumMg) / 500) * 2.5);

    return { simulatedScore, category, bpReduction };
  };

  const { simulatedScore, category, bpReduction } = calculateSimulatedRisk(params);

  const getGaugeColor = (cat: string) => {
    switch (cat) {
      case 'Optimal':
      case 'Low Risk':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
      case 'Moderate Risk':
        return 'text-amber-400 border-amber-500/40 bg-amber-950/20';
      case 'Elevated':
        return 'text-orange-400 border-orange-500/40 bg-orange-950/20';
      case 'High Risk':
      default:
        return 'text-[#FF2E4D] border-[#FF2E4D]/40 bg-[#FF2E4D]/10';
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header Info */}
      <div className="pb-6 border-b border-[#1F1F24]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-[11px] font-mono text-[#FF2E4D] mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>LIFESTYLE SIMULATOR</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Interactive Habit Simulator</h2>
        <p className="text-sm text-[#9CA3AF] mt-1 max-w-3xl">
          Move the sliders below to see how simple daily changes in salt intake, weekly walking, and smoking immediately improve your heart risk score.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sliders: 3 Glowing Controls (6 Cols) */}
        <div className="lg:col-span-6 space-y-8 bg-black/80 p-6 sm:p-8 rounded-2xl border border-[#1F1F24]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FF2E4D]" />
              <span>Adjust Your Daily Habits</span>
            </span>
            <span className="text-xs font-mono text-[#9CA3AF]">Live Simulator</span>
          </div>

          {/* 1. Sodium Intake */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[#9CA3AF] font-medium">Daily Salt / Sodium Intake</label>
              <span className="font-mono text-white font-bold text-sm bg-[#1F1F24] px-2.5 py-1 rounded-lg border border-[#2F2F36]">
                {params.sodiumMg} mg/day
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={4500}
              step={100}
              value={params.sodiumMg}
              onChange={(e) => setParams({ ...params, sodiumMg: Number(e.target.value) })}
              className="w-full h-2.5 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono">
              <span>1000 mg (Healthy Goal)</span>
              <span>2300 mg (Average)</span>
              <span>4500 mg (High Salt)</span>
            </div>
          </div>

          {/* 2. Weekly Exercise */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[#9CA3AF] font-medium">Weekly Exercise / Fast Walking</label>
              <span className="font-mono text-white font-bold text-sm bg-[#1F1F24] px-2.5 py-1 rounded-lg border border-[#2F2F36]">
                {params.exerciseMins} mins/week
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={300}
              step={15}
              value={params.exerciseMins}
              onChange={(e) => setParams({ ...params, exerciseMins: Number(e.target.value) })}
              className="w-full h-2.5 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono">
              <span>0 mins</span>
              <span>150 mins (Recommended Goal)</span>
              <span>300 mins</span>
            </div>
          </div>

          {/* 3. Daily Cigarettes */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[#9CA3AF] font-medium">Daily Smoking</label>
              <span className="font-mono text-white font-bold text-sm bg-[#1F1F24] px-2.5 py-1 rounded-lg border border-[#2F2F36]">
                {params.cigarettesDaily} cigarettes/day
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              step={1}
              value={params.cigarettesDaily}
              onChange={(e) => setParams({ ...params, cigarettesDaily: Number(e.target.value) })}
              className="w-full h-2.5 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono">
              <span>0 (Smoke Free)</span>
              <span>10 cigarettes</span>
              <span>20 cigarettes (1 pack)</span>
            </div>
          </div>

          {/* Quick Target Presets */}
          <div className="pt-4 border-t border-[#1F1F24] flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#9CA3AF]">Preset Goal:</span>
            <button
              onClick={() => setParams({ sodiumMg: 1500, exerciseMins: 180, cigarettesDaily: 0 })}
              className="px-3 py-1 rounded-lg bg-[#FF2E4D]/10 border border-[#FF2E4D]/40 text-xs text-[#FF2E4D] font-bold hover:bg-[#FF2E4D] hover:text-black transition-colors"
            >
              Set Heart Healthy Ideal Goal
            </button>
          </div>
        </div>

        {/* Right Output: Central Live Gauge & Benefits (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl bg-black border border-[#1F1F24] p-6 sm:p-8 space-y-6 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F24]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF]">
                Simulated Heart Risk Score
              </span>
              <Gauge className="w-5 h-5 text-[#FF2E4D]" />
            </div>

            {/* Central Score Meter */}
            <div className="flex flex-col items-center text-center space-y-3 py-4">
              <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
                <svg className="w-44 h-44 -mt-20 transform -rotate-90">
                  <circle cx="88" cy="88" r="70" stroke="#1F1F24" strokeWidth="12" fill="none" />
                  <circle
                    cx="88"
                    cy="88"
                    r="70"
                    stroke="#FF2E4D"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * Math.min(simulatedScore, 30)) / 60}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                <span className="absolute bottom-1 text-4xl font-black font-mono text-white tracking-tight">
                  {simulatedScore}%
                </span>
              </div>

              <span className={`px-4 py-1 rounded-full text-xs font-bold border ${getGaugeColor(category)}`}>
                {category}
              </span>
            </div>

            {/* Projected Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-[#0D0D10] border border-[#1F1F24] space-y-1">
                <span className="text-[10px] font-mono text-[#9CA3AF] uppercase block">Expected BP Benefit</span>
                <span className="text-xl font-bold text-emerald-400 font-mono">-{bpReduction} mmHg</span>
                <span className="text-[10px] text-[#9CA3AF] block">Estimated pressure reduction</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0D10] border border-[#1F1F24] space-y-1">
                <span className="text-[10px] font-mono text-[#9CA3AF] uppercase block">Smoking Impact</span>
                <span className="text-xl font-bold text-white font-mono">
                  {params.cigarettesDaily === 0 ? 'No Extra Risk' : `+${Math.round(params.cigarettesDaily * 1.2)}% Risk`}
                </span>
                <span className="text-[10px] text-[#9CA3AF] block">Artery stress factor</span>
              </div>
            </div>

            {/* Key Recommendation */}
            <div className="p-4 rounded-xl bg-black border border-[#1F1F24] flex items-start gap-3 text-xs text-[#9CA3AF]">
              <CheckCircle className="w-4 h-4 text-[#FF2E4D] shrink-0 mt-0.5" />
              <span>
                Walking briskly for <strong className="text-white">150+ minutes per week</strong> helps relax blood vessels and keeps your circulation strong.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
