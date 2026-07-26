import React, { useState } from 'react';
import { AlertTriangle, Sparkles, HeartPulse, Clock, Plus, FileText, Venus } from 'lucide-react';
import { SymptomEntry } from '../../types';

export const TabSymptomJournal: React.FC = () => {
  const [symptomText, setSymptomText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isFemaleContext, setIsFemaleContext] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [entries, setEntries] = useState<SymptomEntry[]>([
    {
      id: 'e1',
      date: '2026-07-24',
      text: 'Tightness across my upper back between shoulder blades with sudden cold sweat after climbing stairs.',
      intensity: 7,
      isFemaleContext: true,
      flagLabel: 'Unusual Heart Symptom',
      isAtypicalOrRedFlag: true,
      reasoning: 'Upper back pressure and cold sweat without central chest pain are common non-traditional heart warning signs in women.',
      doctorDiscussionPoint: 'Tell your doctor about this back pressure episode when exercising or walking stairs.',
    },
    {
      id: 'e2',
      date: '2026-07-18',
      text: 'Unexplained extreme fatigue for 3 hours, with mild jaw aching and nausea.',
      intensity: 6,
      isFemaleContext: true,
      flagLabel: 'Important Signal for Women',
      isAtypicalOrRedFlag: true,
      reasoning: 'Unexplained deep exhaustion paired with jaw soreness is a common warning sign in women.',
      doctorDiscussionPoint: 'Ask your doctor if heart rhythm checking or a routine stress test is recommended.',
    },
    {
      id: 'e3',
      date: '2026-07-10',
      text: 'Mild fluttering in chest after an evening walk, went away within 2 minutes of sitting down.',
      intensity: 3,
      isFemaleContext: true,
      flagLabel: 'Short Flutter',
      isAtypicalOrRedFlag: false,
      reasoning: 'Brief flutter after walking that resolved quickly with rest.',
      doctorDiscussionPoint: 'Mention occasional post-walk flutters at your next checkup.',
    },
  ]);

  const handleLogSymptom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/gemini/symptom-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptomText, intensity, date, isFemaleContext }),
      });

      const data = await response.json();

      const newEntry: SymptomEntry = {
        id: `e-${Date.now()}`,
        date,
        text: symptomText,
        intensity,
        isFemaleContext,
        flagLabel: data.flagLabel || 'Logged Feeling',
        isAtypicalOrRedFlag: data.isAtypicalOrRedFlag ?? false,
        reasoning: data.reasoning || 'Saved to your health journal.',
        doctorDiscussionPoint: data.doctorDiscussionPoint || 'Share this pattern with your healthcare provider.',
      };

      setEntries([newEntry, ...entries]);
      setSymptomText('');
    } catch (err) {
      console.error(err);
      const newEntry: SymptomEntry = {
        id: `e-${Date.now()}`,
        date,
        text: symptomText,
        intensity,
        isFemaleContext,
        flagLabel: 'Symptom Saved',
        isAtypicalOrRedFlag: false,
        reasoning: 'Saved to your health journal.',
        doctorDiscussionPoint: 'Share this entry with your doctor during your next visit.',
      };
      setEntries([newEntry, ...entries]);
      setSymptomText('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleSymptom = (text: string, level: number) => {
    setSymptomText(text);
    setIntensity(level);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header Info */}
      <div className="pb-6 border-b border-[#1F1F24]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-[11px] font-mono text-[#FF2E4D] mb-2">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>DAILY HEALTH JOURNAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Symptom Log & Smart AI Helper</h2>
        <p className="text-sm text-[#9CA3AF] mt-1 max-w-3xl">
          Write down how you feel each day. AI checks your symptoms and highlights signs that deserve attention—especially non-traditional warning signs often experienced by women.
        </p>
      </div>

      {/* Women's Health Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-black via-[#1F070B] to-black border border-[#FF2E4D]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FF2E4D]/10 border border-[#FF2E4D]/40 flex items-center justify-center text-[#FF2E4D] shrink-0 mt-0.5">
            <Venus className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Special Focus on Women's Heart Health</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF2E4D] text-black font-extrabold uppercase">
                Active
              </span>
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Women often experience heart symptoms differently than men. Instead of chest pain, women frequently feel <strong className="text-white">jaw aching, upper back pressure, nausea, or unusual deep tiredness</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFemaleContext(!isFemaleContext)}
          className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
            isFemaleContext
              ? 'bg-[#FF2E4D] text-black font-bold border-[#FF2E4D]'
              : 'bg-[#1F1F24] text-[#9CA3AF] border-[#2F2F36]'
          }`}
        >
          {isFemaleContext ? 'Women’s Mode: ON' : 'Turn On Women’s Mode'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Log Symptom (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 bg-black/80 p-6 rounded-2xl border border-[#1F1F24]">
          <div className="flex items-center gap-2 text-sm font-semibold text-white pb-3 border-b border-[#1F1F24]">
            <Plus className="w-4 h-4 text-[#FF2E4D]" />
            <span>Record What You're Feeling</span>
          </div>

          {/* Quick Preset Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#9CA3AF] uppercase">Quick Examples:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => loadSampleSymptom('Jaw ache and unusual fatigue after short walk', 7)}
                className="px-2.5 py-1 rounded-lg bg-[#1F1F24] text-[11px] text-[#9CA3AF] hover:text-white hover:border-[#FF2E4D]/40 border border-[#2F2F36] transition-colors"
              >
                + Jaw Ache & Fatigue
              </button>
              <button
                type="button"
                onClick={() => loadSampleSymptom('Mild chest tightness after eating dinner', 4)}
                className="px-2.5 py-1 rounded-lg bg-[#1F1F24] text-[11px] text-[#9CA3AF] hover:text-white hover:border-[#FF2E4D]/40 border border-[#2F2F36] transition-colors"
              >
                + Mild Indigestion Tightness
              </button>
            </div>
          </div>

          <form onSubmit={handleLogSymptom} className="space-y-5">
            {/* Symptom Text */}
            <div className="space-y-2">
              <label className="text-xs text-[#9CA3AF] font-medium block">Describe your feeling or symptom:</label>
              <textarea
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                placeholder="e.g. Feeling tightness in upper back and mild dizziness after walking..."
                rows={3}
                required
                className="w-full p-3.5 rounded-xl bg-[#0D0D10] border border-[#1F1F24] text-sm text-white focus:border-[#FF2E4D] focus:outline-none placeholder-[#4B5563]"
              />
            </div>

            {/* Date & Intensity */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-[#9CA3AF] font-medium block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0D0D10] border border-[#1F1F24] text-xs text-white focus:border-[#FF2E4D] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label className="text-[#9CA3AF] font-medium">How strong was it?</label>
                  <span className="font-mono text-[#FF2E4D] font-bold">{intensity}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-[#1F1F24] rounded-lg appearance-none cursor-pointer accent-[#FF2E4D]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-3.5 rounded-xl bg-[#FF2E4D] text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#FF4D66] transition-all shadow-[0_0_20px_rgba(255,46,77,0.35)] disabled:opacity-50"
            >
              {isAnalyzing ? (
                <span>Checking Symptom...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Analyze Feeling</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Timeline Feed (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider">
              Your Health History ({entries.length} Logged)
            </span>
            <span className="text-[11px] font-mono text-[#FF2E4D] flex items-center gap-1">
              <Clock className="w-3 h-3" /> Recent First
            </span>
          </div>

          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-1">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`p-5 rounded-2xl bg-black border transition-all ${
                  entry.isAtypicalOrRedFlag
                    ? 'border-[#FF2E4D]/60 shadow-[0_0_15px_rgba(255,46,77,0.15)]'
                    : 'border-[#1F1F24]'
                }`}
              >
                {/* Entry Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#1F1F24]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#9CA3AF]">{entry.date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1F1F24] text-white">
                      Severity {entry.intensity}/10
                    </span>
                  </div>

                  {entry.isAtypicalOrRedFlag ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF2E4D]/10 border border-[#FF2E4D]/40 text-[11px] font-mono text-[#FF2E4D] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      {entry.flagLabel || 'Unusual Signal'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-[11px] font-mono text-[#9CA3AF]">
                      {entry.flagLabel || 'Routine Entry'}
                    </span>
                  )}
                </div>

                {/* Entry Description */}
                <p className="text-sm text-white font-medium my-3 leading-relaxed">"{entry.text}"</p>

                {/* AI Reasoning & Doctor Point */}
                <div className="space-y-2 pt-2 text-xs">
                  {entry.reasoning && (
                    <p className="text-[#9CA3AF] italic bg-[#0D0D10] p-3 rounded-xl border border-[#1F1F24]">
                      <strong className="text-white font-mono uppercase text-[10px] block not-italic mb-0.5">
                        AI Health Insight:
                      </strong>
                      {entry.reasoning}
                    </p>
                  )}

                  {entry.doctorDiscussionPoint && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-[#1A0407] border border-[#FF2E4D]/30 text-white font-mono text-[11px]">
                      <FileText className="w-3.5 h-3.5 text-[#FF2E4D] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[#FF2E4D] font-bold block">What to Tell Your Doctor:</span>
                        <span>{entry.doctorDiscussionPoint}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
