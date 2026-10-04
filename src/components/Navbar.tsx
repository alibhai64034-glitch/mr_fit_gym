import React from 'react';
import { Dumbbell, Shield, User, Calendar, Bell, ChevronDown, Check } from 'lucide-react';
import { MemberProfile } from '../types';

interface NavbarProps {
  currentView: 'home' | 'dashboard';
  setCurrentView: (view: 'home' | 'dashboard') => void;
  activeDashboardTab: string;
  setActiveDashboardTab: (tab: string) => void;
  member: MemberProfile;
  userRole: 'member' | 'trainer';
  setUserRole: (role: 'member' | 'trainer') => void;
  onOpenBooking: () => void;
  unreadEmailsCount: number;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  setActiveDashboardTab,
  member,
  userRole,
  setUserRole,
  onOpenBooking,
  unreadEmailsCount,
  onOpenNotifications,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090c]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-[#c2f83d] flex items-center justify-center text-black font-extrabold shadow-sm group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-black fill-current" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none font-display">
                MR FIT GYM
              </span>
              <span className="text-[10px] tracking-widest text-[#c2f83d] uppercase font-mono font-semibold">
                Athletic Performance
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean 4-6 Nav Links (Single line) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-[#c2f83d] transition-colors py-1 cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => scrollToSection('equipment')}
            className="hover:text-[#c2f83d] transition-colors py-1 cursor-pointer"
          >
            Equipment Lab
          </button>
          <button
            onClick={() => scrollToSection('trainers')}
            className="hover:text-[#c2f83d] transition-colors py-1 cursor-pointer"
          >
            Trainers
          </button>
          <button
            onClick={() => scrollToSection('nutrition')}
            className="hover:text-[#c2f83d] transition-colors py-1 cursor-pointer"
          >
            Nutrition Engine
          </button>
          <button
            onClick={() => scrollToSection('memberships')}
            className="hover:text-[#c2f83d] transition-colors py-1 cursor-pointer"
          >
            Memberships
          </button>
        </nav>

        {/* Zone 3: Primary Actions & User Switcher */}
        <div className="flex items-center gap-3">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            title="Automated Email Notifications"
            className="relative p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadEmailsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c2f83d] text-black text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                {unreadEmailsCount}
              </span>
            )}
          </button>

          {/* Book Session CTA */}
          <button
            onClick={onOpenBooking}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-black bg-[#c2f83d] hover:bg-[#b0e830] transition-colors rounded-lg whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Session</span>
          </button>

          {/* Member / Trainer Portal Toggle */}
          <button
            onClick={() => {
              if (currentView === 'dashboard') {
                setCurrentView('home');
              } else {
                setCurrentView('dashboard');
                setActiveDashboardTab(userRole === 'trainer' ? 'reports' : 'subscription');
              }
            }}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-white text-slate-900 border-white'
                : 'bg-white/[0.06] text-white border-white/[0.12] hover:bg-white/[0.1]'
            }`}
          >
            {currentView === 'dashboard' ? 'Back to Website' : 'Member Portal'}
          </button>

          {/* Role Persona Switcher (Member vs Trainer) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors text-xs text-slate-300 cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                {userRole === 'member' ? (
                  <User className="w-3.5 h-3.5 text-slate-300" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-[#c2f83d]" />
                )}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-slate-200 truncate max-w-[100px]">
                {userRole === 'member' ? member.name : 'Coach Marcus'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#12151d] border border-white/10 shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 border-b border-white/[0.06] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Switch Persona Demo
                </div>
                <button
                  onClick={() => {
                    setUserRole('member');
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-white/[0.05] text-slate-200 cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-white">Alex Hunter (Member)</div>
                    <div className="text-[11px] text-slate-400">Black Onyx VIP · Assigned to Marcus</div>
                  </div>
                  {userRole === 'member' && <Check className="w-4 h-4 text-[#c2f83d]" />}
                </button>
                <button
                  onClick={() => {
                    setUserRole('trainer');
                    setRoleDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-white/[0.05] text-slate-200 cursor-pointer"
                >
                  <div>
                    <div className="font-semibold text-white">Marcus Vance (Head Trainer)</div>
                    <div className="text-[11px] text-[#c2f83d]">CSCS Coach · Can Publish Reports</div>
                  </div>
                  {userRole === 'trainer' && <Check className="w-4 h-4 text-[#c2f83d]" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
