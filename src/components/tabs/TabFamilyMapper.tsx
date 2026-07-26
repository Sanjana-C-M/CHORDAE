import React, { useState } from 'react';
import { Dna, ShieldAlert, Users, Plus, Check } from 'lucide-react';

interface RelativeCondition {
  relation: string;
  condition: string;
  weight: number;
}

export const TabFamilyMapper: React.FC = () => {
  const relations = ['Mother', 'Father', 'Grandmother', 'Grandfather', 'Sister', 'Brother'];
  const conditions = [
    { name: 'Heart Attack (before age 55)', weight: 0.25 },
    { name: 'Early Heart Disease', weight: 0.2 },
    { name: 'High Blood Pressure', weight: 0.1 },
    { name: 'High Cholesterol', weight: 0.15 },
    { name: 'Stroke (before age 65)', weight: 0.18 },
    { name: 'Diabetes', weight: 0.12 },
  ];

  const [selectedEntries, setSelectedEntries] = useState<RelativeCondition[]>([
    { relation: 'Father', condition: 'Heart Attack (before age 55)', weight: 0.25 },
    { relation: 'Mother', condition: 'High Blood Pressure', weight: 0.1 },
  ]);

  const [activeRelation, setActiveRelation] = useState('Father');

  const isSelected = (rel: string, cond: string) =>
    selectedEntries.some((e) => e.relation === rel && e.condition === cond);

  const toggleCondition = (rel: string, cond: string, weight: number) => {
    if (isSelected(rel, cond)) {
      setSelectedEntries(selectedEntries.filter((e) => !(e.relation === rel && e.condition === cond)));
    } else {
      setSelectedEntries([...selectedEntries, { relation: rel, condition: cond, weight }]);
    }
  };

  const totalWeight = selectedEntries.reduce((acc, curr) => acc + curr.weight, 0);
  const riskMultiplier = Math.round((1.0 + totalWeight) * 100) / 100;

  return (
    <div className="space-y-8 text-white">
      {/* Header Info */}
      <div className="pb-6 border-b border-[#1F1F24]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-[11px] font-mono text-[#FF2E4D] mb-2">
          <Dna className="w-3.5 h-3.5" />
          <span>FAMILY HEART HISTORY</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Family History & Inherited Heart Risk</h2>
        <p className="text-sm text-[#9CA3AF] mt-1 max-w-3xl">
          Heart conditions often run in families. Pick your close family members below and tap any heart conditions they have had to see how family history affects your risk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs: Relatives & Conditions Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 bg-black/80 p-6 rounded-2xl border border-[#1F1F24]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Users className="w-4 h-4 text-[#FF2E4D]" />
              <span>Select Your Family Members</span>
            </div>
            <span className="text-xs font-mono text-[#9CA3AF]">{selectedEntries.length} Items Selected</span>
          </div>

          {/* Relation Selector Pills */}
          <div className="space-y-2">
            <span className="text-xs text-[#9CA3AF] font-medium block">Step 1: Choose a relative</span>
            <div className="flex flex-wrap gap-2">
              {relations.map((rel) => (
                <button
                  key={rel}
                  onClick={() => setActiveRelation(rel)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                    activeRelation === rel
                      ? 'bg-[#FF2E4D] text-black font-bold border-[#FF2E4D]'
                      : 'bg-[#1F1F24] text-[#9CA3AF] border-[#2F2F36] hover:text-white'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Selectors for Active Relative */}
          <div className="space-y-3 pt-3">
            <span className="text-xs text-[#9CA3AF] font-medium block">
              Step 2: Select health conditions for <strong className="text-white">{activeRelation}</strong>:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {conditions.map((cond) => {
                const active = isSelected(activeRelation, cond.name);
                return (
                  <button
                    key={cond.name}
                    onClick={() => toggleCondition(activeRelation, cond.name, cond.weight)}
                    className={`p-3 rounded-xl text-xs text-left transition-all border flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-black border-[#FF2E4D] text-white shadow-[0_0_12px_rgba(255,46,77,0.25)]'
                        : 'bg-black/60 border-[#1F1F24] text-[#9CA3AF] hover:border-[#2F2F36] hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{cond.name}</span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                        active ? 'bg-[#FF2E4D] text-black font-bold' : 'bg-[#1F1F24] text-[#9CA3AF]'
                      }`}
                    >
                      {active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Family Tree Summary Pills */}
          <div className="pt-4 border-t border-[#1F1F24] space-y-2">
            <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider block">Logged Family Conditions:</span>
            {selectedEntries.length === 0 ? (
              <p className="text-xs text-[#9CA3AF] italic">No family conditions selected. Standard baseline risk applies.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedEntries.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1F1F24] border border-[#FF2E4D]/30 text-xs text-white"
                  >
                    <span className="text-[#FF2E4D] font-bold">{item.relation}:</span>
                    <span className="text-[#9CA3AF]">{item.condition}</span>
                    <button
                      onClick={() => toggleCondition(item.relation, item.condition, item.weight)}
                      className="ml-1 text-[#9CA3AF] hover:text-[#FF2E4D]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Output: Family Multiplier Result Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-black border border-[#1F1F24] p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-[#1F1F24]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF]">
                Family History Impact Factor
              </span>
              <Dna className="w-5 h-5 text-[#FF2E4D]" />
            </div>

            {/* Multiplier Display */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-white font-mono">{riskMultiplier}x</span>
                <span className="text-xs font-mono text-[#FF2E4D] uppercase tracking-wider">
                  {riskMultiplier > 1.3 ? 'Increased Family Risk' : riskMultiplier > 1.0 ? 'Mild Family Influence' : 'Standard Family History'}
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Based on your family members, your family history increases your baseline heart risk by{' '}
                <strong className="text-white">+{Math.round((riskMultiplier - 1) * 100)}%</strong>.
              </p>
            </div>

            {/* Visual Risk Spectrum Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-[#9CA3AF]">
                <span>1.0x (Standard)</span>
                <span>1.5x</span>
                <span>2.0x (Strong Family History)</span>
              </div>
              <div className="w-full h-3 bg-[#1F1F24] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-[#FF2E4D] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((riskMultiplier - 1.0) / 1.2) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Simple Doctor Discussion Card */}
            <div className="p-4 rounded-xl bg-[#0D0D10] border border-[#1F1F24] space-y-2 text-xs text-[#E2E8F0]">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldAlert className="w-4 h-4 text-[#FF2E4D]" />
                <span>What to Ask Your Doctor</span>
              </div>
              <p className="text-[#9CA3AF] leading-relaxed">
                "Since my family has a history of heart issues, are there extra screening tests or cholesterol checks you recommend for me?"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
