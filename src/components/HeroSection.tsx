import React from 'react';
import { ArrowRight, ShieldCheck, Dumbbell, Award, Flame } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreEquipment: () => void;
  onSelectMembership: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreEquipment,
  onSelectMembership,
}) => {
  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-6 pb-16">
      {/* Background Media with Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_mr_fit_gym_1791141178174.jpg"
          alt="Mr Fit Gym Elite Training Arena"
          className="w-full h-full object-cover object-center brightness-75 scale-105 transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // graceful fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Measured Scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-[#08090c]/80 to-[#08090c]/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090c]/60 to-[#08090c]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        {/* Subtle kicker without pills */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#c2f83d] mb-4">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>The Sovereign Sanctuary for Iron & Human Optimization</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>EST. 2021</span>
        </div>

        {/* Display Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 font-display max-w-4xl mx-auto [text-wrap:balance]">
          UNCOMPROMISING ATHLETIC STRENGTH & BIOMECHANICAL RIGOR
        </h1>

        {/* Value Proposition Body */}
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Mr Fit Gym is an elite private athletic sanctuary engineered for driven lifters, athletes, and executives.
          Equipped with calibrated Olympic drop platforms, custom biomechanical cable stations, and precision
          sports nutrition protocols supervised by ISSN certified coaches.
        </p>

        {/* Primary and Secondary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 bg-[#c2f83d] hover:bg-[#b2eb2e] text-black font-extrabold text-sm rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#c2f83d]/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Book 1-on-1 Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreEquipment}
            className="w-full sm:w-auto px-7 py-4 bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/20 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer"
          >
            <Dumbbell className="w-4 h-4 text-[#c2f83d]" />
            <span>Tour Equipment Lab</span>
          </button>
          <button
            onClick={onSelectMembership}
            className="w-full sm:w-auto px-6 py-4 text-slate-300 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer underline underline-offset-4 decoration-white/20 hover:decoration-[#c2f83d]"
          >
            <span>View Membership Tiers</span>
          </button>
        </div>

        {/* Claim-to-Proof Quantitative Adjacency Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-[#0f121a]/85 border border-white/[0.08] backdrop-blur-md max-w-4xl mx-auto">
          <div className="text-left px-3 border-r border-white/[0.06] last:border-0">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              12,000<span className="text-xs text-[#c2f83d] ml-1 font-sans">SQ FT</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Dedicated Biomechanics & Olympic Arena</div>
          </div>
          <div className="text-left px-3 border-r border-white/[0.06] last:border-0">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              100<span className="text-xs text-[#c2f83d] ml-1 font-sans">%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Calibrated Competition Steel & Urethane</div>
          </div>
          <div className="text-left px-3 border-r border-white/[0.06] last:border-0">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              1-on-1
            </div>
            <div className="text-xs text-slate-400 mt-1">CSCS & ISSN Certified Coach Pairing</div>
          </div>
          <div className="text-left px-3">
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              24/7
            </div>
            <div className="text-xs text-slate-400 mt-1">Biometric Keyless Facility Access</div>
          </div>
        </div>
      </div>
    </section>
  );
};
