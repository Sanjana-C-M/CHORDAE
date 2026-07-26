import React, { useState } from 'react';
import { HeartPulse, Send, Bot, User, ShieldAlert, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { RecoveryChatMessage } from '../../types';

export const TabRecoveryGuide: React.FC = () => {
  const [activePhase, setActivePhase] = useState<1 | 2 | 3>(2);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [chatHistory, setChatHistory] = useState<RecoveryChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Welcome to your Post-Event Heart Recovery Helper! You are currently looking at Phase 2: Light Recovery & Walking. What questions can I answer for you about your daily activity or recovery goals?',
      timestamp: '10:00 AM',
    },
  ]);

  const phases = [
    {
      phaseNum: 1,
      title: 'Phase 1: Early Rest & Healing',
      timeframe: 'Days 1 – 14',
      description: 'Focus on rest, healing after stent or procedure, taking medications on time, and short gentle indoor walks.',
      milestones: ['Resting heart rate under 90 bpm', 'Medication routine set up', 'Short indoor 5-min walks'],
    },
    {
      phaseNum: 2,
      title: 'Phase 2: Light Rehab & Walking',
      timeframe: 'Weeks 2 – 6',
      description: 'Gradual flat walking, cardiac rehab sessions, and monitoring your effort level so you do not over-exert.',
      milestones: ['Flat 20-min walking', 'Target heart rate under 115 bpm', 'Light effort tracking'],
    },
    {
      phaseNum: 3,
      title: 'Phase 3: Active Recovery',
      timeframe: 'Weeks 6+',
      description: 'Building aerobic stamina, light resistance bands, and long-term healthy lifestyle routines.',
      milestones: ['30+ min continuous cardio walking', 'Light resistance exercise', 'Stress management routines'],
    },
  ];

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const messageText = customText || inputMessage;
    if (!messageText.trim()) return;

    const userMsg: RecoveryChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsSending(true);

    const phaseTitle = phases.find((p) => p.phaseNum === activePhase)?.title;

    try {
      const response = await fetch('/api/gemini/recovery-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: chatHistory.map((m) => ({ role: m.sender, content: m.text })),
          currentPhase: phaseTitle,
        }),
      });

      const data = await response.json();

      const aiMsg: RecoveryChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'In heart recovery, gentle steady progress is safest. Stop immediately if you feel unusual chest pressure or shortness of breath.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const aiMsg: RecoveryChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: 'During heart recovery, slow and steady progress is key. Always listen to your body and check with your healthcare team if you feel dizzy or short of breath.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, aiMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const promptPills = [
    'Is light walking safe in Phase 2?',
    'What heart rate range is safe for me?',
    'How do I know if I am getting too tired?',
    'When can I try light exercise bands?',
  ];

  return (
    <div className="space-y-8 text-white">
      {/* Header Info */}
      <div className="pb-6 border-b border-[#1F1F24]">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F1F24] text-[11px] font-mono text-[#FF2E4D] mb-2">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>RECOVERY COMPANION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Heart Recovery Guide</h2>
        <p className="text-sm text-[#9CA3AF] mt-1 max-w-3xl">
          Follow your 3-phase heart recovery timeline and ask the AI Recovery Companion any questions about daily walking or exertion boundaries.
        </p>
      </div>

      {/* Visual Tracker: Horizontal 3-Stage Rehab Milestone Bar */}
      <div className="space-y-4">
        <span className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider block">
          3-Phase Heart Recovery Progress:
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phases.map((p) => {
            const isCurrent = activePhase === p.phaseNum;
            return (
              <div
                key={p.phaseNum}
                onClick={() => setActivePhase(p.phaseNum as 1 | 2 | 3)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-black border-[#FF2E4D] shadow-[0_0_20px_rgba(255,46,77,0.25)]'
                    : 'bg-black/60 border-[#1F1F24] hover:border-[#2F2F36]'
                }`}
              >
                {/* Active Indicator Top Bar */}
                {isCurrent && (
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-[#FF2E4D] rounded-full shadow-[0_0_8px_#FF2E4D]" />
                )}

                <div className="flex items-center justify-between pb-2 border-b border-[#1F1F24]">
                  <span className="text-xs font-mono font-bold text-[#FF2E4D]">{p.timeframe}</span>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FF2E4D] text-black font-extrabold uppercase">
                      Current Phase
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mt-2">{p.title}</h3>
                <p className="text-xs text-[#9CA3AF] mt-1 leading-relaxed">{p.description}</p>

                {/* Milestones list */}
                <ul className="mt-3 space-y-1 text-[11px] text-[#9CA3AF] font-mono">
                  {p.milestones.map((m, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#FF2E4D]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chatbot Interface: Recovery Companion */}
      <div className="rounded-2xl bg-black border border-[#1F1F24] p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF2E4D]/10 border border-[#FF2E4D]/40 flex items-center justify-center text-[#FF2E4D]">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Recovery Assistant</h3>
              <span className="text-[10px] font-mono text-[#9CA3AF]">Heart Rehab Guidance</span>
            </div>
          </div>

          <span className="text-xs font-mono text-[#FF2E4D] px-2.5 py-1 rounded-full bg-[#1F1F24]">
            Phase: {phases.find((p) => p.phaseNum === activePhase)?.title}
          </span>
        </div>

        {/* Prompt Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {promptPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(undefined, pill)}
              className="px-3 py-1.5 rounded-xl bg-[#1F1F24] hover:bg-[#2F2F36] text-xs text-[#9CA3AF] hover:text-white border border-[#2F2F36] transition-colors"
            >
              "{pill}"
            </button>
          ))}
        </div>

        {/* Chat History Messages */}
        <div className="space-y-3 max-h-[360px] overflow-y-auto p-4 rounded-xl bg-[#0A0A0C] border border-[#1F1F24]">
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-[#FF2E4D]/20 border border-[#FF2E4D]/40 flex items-center justify-center text-[#FF2E4D] shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[82%] space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-[#FF2E4D] text-black font-medium'
                    : 'bg-[#1F1F24] text-white border border-[#2F2F36]'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`text-[9px] font-mono block ${msg.sender === 'user' ? 'text-black/70' : 'text-[#9CA3AF]'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#1F1F24] border border-[#2F2F36] flex items-center justify-center text-[#9CA3AF] shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-[#9CA3AF] font-mono p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF2E4D]" />
              <span>AI Assistant is typing...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask a question about your recovery, walking limits, or symptoms..."
            className="flex-1 p-3.5 rounded-xl bg-[#0D0D10] border border-[#1F1F24] text-xs text-white focus:border-[#FF2E4D] focus:outline-none placeholder-[#4B5563]"
          />
          <button
            type="submit"
            disabled={isSending || !inputMessage.trim()}
            className="px-5 py-3.5 rounded-xl bg-[#FF2E4D] text-black font-bold text-xs flex items-center gap-1.5 hover:bg-[#FF4D66] transition-colors disabled:opacity-50"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Medical Disclaimer Footer */}
        <div className="pt-3 border-t border-[#1F1F24] flex items-center gap-2 text-[11px] font-mono text-[#9CA3AF]">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            Chordae is an educational assistant, not medical advice. Always talk to your cardiologist or call emergency services if you experience severe symptoms.
          </span>
        </div>
      </div>
    </div>
  );
};
