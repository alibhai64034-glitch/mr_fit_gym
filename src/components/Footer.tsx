import React from 'react';
import { Dumbbell, MapPin, Clock, Phone, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onScrollTo: (id: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollTo, onOpenBooking }) => {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#c2f83d] flex items-center justify-center text-black font-extrabold">
                <Dumbbell className="w-4 h-4 fill-current text-black" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display">
                MR FIT GYM
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered private athletic facility dedicated to biomechanical rigor, Olympic lifting,
              and precision performance nutrition.
            </p>
            <div className="text-[11px] text-slate-400 font-mono">
              ISSN Licensed Facility · Eleiko Certified Performance Center
            </div>
          </div>

          {/* Quick Navigation Mirror */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Facility Areas
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onScrollTo('hero')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Overview & Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('equipment')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Equipment Lab & Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('trainers')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Master Conditioning Coaches
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('nutrition')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Nutrition Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollTo('memberships')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Memberships & Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Facility Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Club Hours & Location
            </h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c2f83d] shrink-0 mt-0.5" />
                <span>480 Ironworks Way, Suite 100, Performance District</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#c2f83d] shrink-0 mt-0.5" />
                <div>
                  <div>24/7 Biometric Access for Members</div>
                  <div className="text-[11px] text-slate-400">Coaching Hours: 05:00 AM – 10:00 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c2f83d] shrink-0" />
                <span>+1 (555) 748-9321</span>
              </div>
            </div>
          </div>

          {/* Membership Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Direct Inquiries
            </h4>
            <p className="text-xs text-slate-400">
              Schedule a private walkthrough and consultation with our conditioning directors.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-2.5 px-4 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold rounded-lg text-xs transition-colors cursor-pointer"
            >
              Book Consultation Session
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2026 Mr Fit Gym Performance Corp. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>PCI-DSS Secured Payments</span>
            <span>Automated TLS Notifications</span>
            <span>Biometric Privacy Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
