import React from 'react';
import { Layers, Venus, Stethoscope, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onGoToDashboard: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onGoToDashboard }) => {
  const cards = [
    {
      icon: Layers,
      title: 'Unified Profile',
      subtitle: 'Longitudinal Integration',
      description:
        'Combines lab numbers, family history, daily symptoms, lifestyle habits, and cardiac recovery in one continuous, updating view.',
      badge: 'Multi-Source Signal',
    },
    {
      icon: Venus,
      title: 'Gender-Aware Precision',
      subtitle: 'Atypical Symptom Recognition',
      description:
        'Trained to identify atypical ischemic presentation symptoms—like nausea, upper back pressure, and severe unexplainable fatigue—frequently missed in women.',
      badge: 'Women’s Health Priority',
    },
    {
      icon: Stethoscope,
      title: 'Clinically Grounded',
      subtitle: 'Physician Discussion Partner',
      description:
        'AI insights anchored in established cardiovascular risk frameworks (ASCVD & AHA risk factors), built to empower meaningful doctor discussions.',
      badge: 'Clinical Alignment',
    },
  ];

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-black border-t border-[#1F1F24]/80 text-white z-10">
      {/* Background Subtle Mesh */}
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1F24] border border-[#2F2F36] text-xs font-mono text-[#FF2E4D]">
            <span>ENGINEERED FOR LONGITUDINAL CARDIOVASCULAR CARE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-sans">
            Redefining How You Understand Your Heart
          </h2>
          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed">
            Cardiovascular health is not a single annual snapshot. Chordae weaves lab results, genomic predispositions, daily signals, and post-event milestones into a single, cohesive timeline.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-black/80 border border-[#1F1F24] p-8 transition-all duration-300 hover:border-[#FF2E4D]/60 hover:shadow-[0_0_30px_rgba(255,46,77,0.15)] flex flex-col justify-between"
              >
                {/* Subtle card glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF2E4D]/5 rounded-bl-full pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                <div className="space-y-6">
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[#1F1F24] border border-[#2F2F36] flex items-center justify-center text-[#FF2E4D] group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-[#9CA3AF] px-2.5 py-1 rounded-full bg-[#1F1F24]/60 border border-[#2F2F36]">
                      {card.badge}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF2E4D] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs font-mono text-[#9CA3AF] uppercase tracking-wider">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#9CA3AF] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Footer Link */}
                <div className="pt-6 mt-6 border-t border-[#1F1F24] flex items-center justify-between text-xs font-mono text-[#9CA3AF] group-hover:text-white transition-colors">
                  <span>Learn in Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#FF2E4D] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Banner */}
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-black via-[#110204] to-black border border-[#FF2E4D]/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h4 className="text-lg font-bold text-white">Ready to explore your personal heart health intelligence?</h4>
            <p className="text-sm text-[#9CA3AF]">
              Access the 5 interactive longitudinal tools: Risk Explainer, Genomic Mapper, Symptom Journal, Habit Simulator, and Recovery Companion.
            </p>
          </div>
          <button
            onClick={onGoToDashboard}
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#FF2E4D] text-black font-semibold text-sm hover:bg-[#FF4D66] transition-colors shadow-[0_0_20px_rgba(255,46,77,0.4)]"
          >
            Open Interactive Dashboard
          </button>
        </div>
      </div>
    </section>
  );
};
