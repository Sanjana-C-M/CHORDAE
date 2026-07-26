import React, { useState } from 'react';
import { Activity, Sparkles, Info, RefreshCw, CheckCircle2, Sliders } from 'lucide-react';
import { RiskInputs, RiskAnalysisResult } from '../../types';

export const TabRiskExplainer: React.FC = () => {
  const [inputs, setInputs] = useState<RiskInputs>({
    systolicBp: 138,
    totalCholesterol: 215,
    age: 52,
    smokingStatus: 'Non-Smoker',
    gender: 'Female',
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RiskAnalysisResult>({
    score: 8.4,
    category: 'Borderline',
    summary:
      'Your top blood pressure number (138) and cholesterol (215) are slightly above ideal. Small daily changes like walking and eating less salt can help keep your heart strong and arteries clear.',
  });

  const calculateRiskScore = (i: RiskInputs): { score: number; category: 'Low' | 'Borderline' | 'Intermediate' | 'High' } => {
    let score = 2.0;
    if (i.age > 40) score += (i.age - 40) * 0.25;
    if (i.systolicBp > 120) score += (i.systolicBp - 120) * 0.12;
    if (i.totalCholesterol > 180) score += (i.totalCholesterol - 180) * 0.08;
    if (i.smokingStatus === 'Active Smoker') score *= 1.8;
    else if (i.smokingStatus === 'Former Smoker') score *= 1.25;

    score = Math.min(Math.max(Math.round(score * 10) / 10, 1.2), 38.5);

    let category: 'Low' | 'Borderline' | 'Intermediate' | 'High' = 'Low';
    if (score >= 20) category = 'High';
    else if (score >= 7.5) category = 'Intermediate';
    else if (score >= 5.0) category = 'Borderline';

    return { score, category };
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const { score, category } = calculateRiskScore(inputs);

    try {
      const response = await fetch('/api/gemini/risk-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs),
      });

      const data = await response.json();
      setResult({
        score,
        category,
        summary: data.summary || 'Your blood pressure and cholesterol numbers give a simple picture of your heart health. Sharing these with your doctor is a great first step.',
      });
    } catch (err) {
      console.error(err);
      setResult({
        score,
        category,
        summary: 'Your blood pressure and cholesterol levels affect your long-term heart strength. Bringing these numbers to your next doctor visit will help guide your personalized care.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadPreset = (preset: 'optimal' | 'moderate' | 'high') => {
    if (preset === 'optimal') {
      setInputs({ systolicBp: 115, totalCholesterol: 175, age: 38, smokingStatus: 'Non-Smoker', gender: 'Female' });
    } else if (preset === 'moderate') {
      setInputs({ systolicBp: 138, totalCholesterol: 215, age: 52, smokingStatus: 'Non-Smoker', gender: 'Female' });
    } else {
      setInputs({ systolicBp: 158, totalCholesterol: 260, age: 61, smokingStatus: 'Active Smoker', gender: 'Male' });
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Low':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
      case 'Borderline':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
      case 'Intermediate':
        return 'text-orange-400 border-orange-500/30 bg-orange-950/20';
      case 'High':
      default:
        return 'text-[#FF2E4D] border-[#FF2E4D]/40 bg-[#FF2E4D]/10';
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F24]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-[11px] font-mono text-[#FF2E4D] mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>HEART HEALTH CHECK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Understanding Your Heart Numbers</h2>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Adjust your numbers below to get a clear, easy-to-understand summary of your 10-year heart health outlook.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 bg-[#0A0A0C] p-1.5 rounded-xl border border-[#1F1F24] self-start">
          <span className="text-[10px] font-mono text-[#9CA3AF] px-2 uppercase">Quick Examples:</span>
          <button
            onClick={() => loadPreset('optimal')}
            className="px-2.5 py-1 text-xs rounded-lg bg-[#1F1F24] hover:bg-[#2F2F36] text-[#9CA3AF] hover:text-white transition-colors"
          >
            Healthy
          </button>
          <button
            onClick={() => loadPreset('moderate')}
            className="px-2.5 py-1 text-xs rounded-lg bg-[#1F1F24] hover:bg-[#2F2F36] text-[#9CA3AF] hover:text-white transition-colors"
          >
            Slightly High
          </button>
          <button
            onClick={() => loadPreset('high')}
            className="px-2.5 py-1 text-xs rounded-lg bg-[#1F1F24] hover:bg-[#2F2F36] text-[#9CA3AF] hover:text-white transition-colors"
          >
            High Risk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 bg-black/80 p-6 rounded-2xl border border-[#1F1F24]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white pb-3 border-b border-[#1F1F24]">
            <Sliders className="w-4 h-4 text-[#FF2E4D]" />
            <span>Your Key Measurements</span>
          </div>

          {/* 1. Systolic BP */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-[#9CA3AF] font-medium">Top Blood Pressure (Systolic)</label>
              <span className="font-mono text-white font-bold">{inputs.systolicBp} mmHg</span>
            </div>
            <input
              type="range"
              min={90}
              max={200}
              value={inputs.systolicBp}
              onChange={(e) => setInputs({ ...inputs, systolicBp: Number(e.target.value) })}
              className="w-full h-2 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono">
              <span>90 (Low)</span>
              <span>120 (Normal)</span>
              <span>140 (Elevated)</span>
              <span>200</span>
            </div>
          </div>

          {/* 2. Total Cholesterol */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-[#9CA3AF] font-medium">Total Cholesterol</label>
              <span className="font-mono text-white font-bold">{inputs.totalCholesterol} mg/dL</span>
            </div>
            <input
              type="range"
              min={120}
              max={350}
              value={inputs.totalCholesterol}
              onChange={(e) => setInputs({ ...inputs, totalCholesterol: Number(e.target.value) })}
              className="w-full h-2 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono">
              <span>120</span>
              <span>200 (Good)</span>
              <span>240 (High)</span>
              <span>350</span>
            </div>
          </div>

          {/* 3. Age */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="text-[#9CA3AF] font-medium">Age</label>
              <span className="font-mono text-white font-bold">{inputs.age} years</span>
            </div>
            <input
              type="range"
              min={20}
              max={90}
              value={inputs.age}
              onChange={(e) => setInputs({ ...inputs, age: Number(e.target.value) })}
              className="w-full h-2 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
            />
          </div>

          {/* 4. Smoking Status */}
          <div className="space-y-2">
            <label className="text-xs text-[#9CA3AF] font-medium block">Smoking Habit</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Non-Smoker', 'Former Smoker', 'Active Smoker'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setInputs({ ...inputs, smokingStatus: status })}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                    inputs.smokingStatus === status
                      ? 'bg-[#FF2E4D] text-black font-bold border-[#FF2E4D] shadow-[0_0_12px_rgba(255,46,77,0.4)]'
                      : 'bg-black text-[#9CA3AF] border-[#1F1F24] hover:border-[#2F2F36] hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3.5 rounded-xl bg-[#FF2E4D] text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#FF4D66] transition-all shadow-[0_0_20px_rgba(255,46,77,0.35)] disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Your Numbers...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain My Risk in Simple Terms</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl bg-black border border-[#1F1F24] p-6 sm:p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF2E4D]/5 rounded-bl-full pointer-events-none" />

            {/* Score & Gauge */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#1F1F24]">
              <div className="text-center sm:text-left space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#9CA3AF]">
                  Estimated 10-Year Chance of Heart Issues
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white font-mono tracking-tight">
                    {result.score}%
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                      result.category
                    )}`}
                  >
                    {result.category} Level
                  </span>
                </div>
              </div>

              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="#1F1F24" strokeWidth="8" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke="#FF2E4D"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={238}
                    strokeDashoffset={238 - (238 * Math.min(result.score, 30)) / 30}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <Activity className="w-6 h-6 text-[#FF2E4D] absolute" />
              </div>
            </div>

            {/* AI Simple Explanation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF2E4D] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simple AI Heart Guidance</span>
              </div>

              <div className="p-5 rounded-xl bg-[#0D0D10] border border-[#1F1F24] text-sm text-[#E2E8F0] leading-relaxed relative">
                <p className="font-normal italic">"{result.summary}"</p>
              </div>
            </div>

            {/* Simple References */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3.5 rounded-xl bg-black border border-[#1F1F24] flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Top Blood Pressure Goal</span>
                  <span className="text-[#9CA3AF]">
                    Below 120 mmHg is best. Your entry is {inputs.systolicBp} mmHg.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black border border-[#1F1F24] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Cholesterol Goal</span>
                  <span className="text-[#9CA3AF]">
                    Below 200 mg/dL is desirable. Your entry is {inputs.totalCholesterol} mg/dL.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
