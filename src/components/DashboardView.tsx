import React, { useState } from 'react';
import {
  CreditCard,
  TrendingUp,
  Utensils,
  Calendar,
  MessageSquare,
  Bell,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Send,
  Droplet,
  Flame,
  Award,
  Download,
  PauseCircle,
  PlayCircle,
  UserCheck,
  ChevronRight,
  Shield,
  Clock,
  Trash2
} from 'lucide-react';
import {
  MemberProfile,
  ProgressReport,
  NutritionPlan,
  BookingSession,
  ChatMessage,
  EmailNotification,
  Trainer
} from '../types';
import { api } from '../api/client';

interface DashboardViewProps {
  member: MemberProfile;
  setMember: React.Dispatch<React.SetStateAction<MemberProfile>>;
  userRole: 'member' | 'trainer';
  setUserRole: (role: 'member' | 'trainer') => void;
  trainers: Trainer[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenUpgradeModal: () => void;
  onOpenNotifications: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  member,
  setMember,
  userRole,
  setUserRole,
  trainers,
  activeTab,
  setActiveTab,
  onOpenBooking,
  onOpenUpgradeModal,
  onOpenNotifications,
}) => {
  // State for Sub-Views
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [nutrition, setNutrition] = useState<NutritionPlan | null>(null);
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [waterLogged, setWaterLogged] = useState(2.75); // liters today

  // Trainer New Report Form State
  const [showNewReportModal, setShowNewReportModal] = useState(false);
  const [newWeight, setNewWeight] = useState(member.currentWeightKg);
  const [newBodyFat, setNewBodyFat] = useState(member.bodyFatPct);
  const [newBench, setNewBench] = useState(127.5);
  const [newSquat, setNewSquat] = useState(170);
  const [newDeadlift, setNewDeadlift] = useState(210);
  const [newCompliance, setNewCompliance] = useState(96);
  const [newPhase, setNewPhase] = useState('Phase 4: Maximum Neuromuscular Peak');
  const [newFeedback, setNewFeedback] = useState(
    'Exceptional bar speed and pelvic control. Upper back tightness locked in during high-load pulls.'
  );
  const [newMilestone, setNewMilestone] = useState(
    'Targeting 132.5kg bench press and sub-12% body fat while preserving lean tissue.'
  );

  // Load Initial Dashboard Data
  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [repData, nutData, bookData, msgData] = await Promise.all([
          api.getProgressReports(),
          api.getNutritionPlan(),
          api.getBookings(),
          api.getChatMessages(),
        ]);
        setReports(repData);
        setNutrition(nutData);
        setBookings(bookData);
        setChatMessages(msgData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle Subscription Auto-Renew Toggle
  const handleToggleAutoRenew = async () => {
    const updatedStatus = !member.autoRenew;
    try {
      const res = await api.updateSubscription({ autoRenew: updatedStatus });
      if (res.success) {
        setMember(res.member);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Membership Freeze/Unfreeze
  const handleToggleFreeze = async () => {
    const nextStatus = member.status === 'Frozen' ? 'Active' : 'Frozen';
    try {
      const res = await api.updateSubscription({ status: nextStatus });
      if (res.success) {
        setMember(res.member);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (id: string) => {
    try {
      const res = await api.cancelBooking(id);
      if (res.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Chat Message
  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const textToSend = chatInput;
    setChatInput('');

    try {
      const res = await api.sendChatMessage({
        text: textToSend,
        sender: userRole === 'trainer' ? 'trainer' : 'member',
      });
      if (res.success) {
        setChatMessages((prev) => [...prev, res.message]);

        // Auto-reply simulation if user is member
        if (userRole === 'member') {
          setTimeout(() => {
            const replies = [
              "Noted Alex! I've updated your workout logs accordingly. Keep hitting that protein goal today.",
              "Great work. Make sure to get at least 8 hours of sleep tonight before our heavy compound session.",
              "Received! I reviewed your video form; bar path is looking much tighter on the eccentric phase.",
            ];
            const autoReply: ChatMessage = {
              id: `msg_${Date.now()}`,
              sender: 'trainer',
              senderName: 'Marcus Vance (Coach)',
              text: replies[Math.floor(Math.random() * replies.length)],
              timestamp: 'Just now',
              read: true,
            };
            setChatMessages((prev) => [...prev, autoReply]);
          }, 1200);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Publish New Trainer Report
  const handlePublishReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createProgressReport({
        phase: newPhase,
        weightKg: Number(newWeight),
        bodyFatPct: Number(newBodyFat),
        muscleMassKg: Number((newWeight * (1 - newBodyFat / 100)).toFixed(1)),
        benchPress1RM: Number(newBench),
        squat1RM: Number(newSquat),
        deadlift1RM: Number(newDeadlift),
        weeklyComplianceRate: Number(newCompliance),
        statusSummary: 'Outstanding Progress',
        trainerFeedback: newFeedback,
        nextMilestone: newMilestone,
      });

      if (res.success) {
        setReports((prev) => [res.report, ...prev]);
        setMember((prev) => ({
          ...prev,
          currentWeightKg: Number(newWeight),
          bodyFatPct: Number(newBodyFat),
        }));
        setShowNewReportModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'subscription', label: 'Subscription & Dues', icon: CreditCard },
    { id: 'reports', label: 'Trainer Progress Reports', icon: TrendingUp },
    { id: 'nutrition', label: 'Nutrition Architecture', icon: Utensils },
    { id: 'schedule', label: 'Session Calendar', icon: Calendar },
    { id: 'chat', label: 'Direct Secure Chat', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#08090c] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header with Breadcrumbs and Role Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0f121a] border border-white/[0.08]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userRole === 'member' ? member.avatarUrl : '/src/assets/images/coach_marcus_vance_1791141226432.jpg'}
                alt={userRole === 'member' ? member.name : 'Marcus Vance'}
                className="w-14 h-14 rounded-xl object-cover bg-slate-800 border border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#c2f83d] rounded-full border-2 border-[#0f121a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  {userRole === 'member' ? member.name : 'Coach Marcus Vance'}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#c2f83d]/15 text-[#c2f83d] font-semibold">
                  {userRole === 'member' ? member.tier : 'Master Coach View'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                <span>Member ID: {member.id}</span>
                <span aria-hidden="true">·</span>
                <span>Status: {member.status}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">Renewal: {member.renewalDate}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNotifications}
              className="px-3 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-lg border border-white/[0.08] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-[#c2f83d]" />
              <span>Audit Emails</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="px-3.5 py-2 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Session</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs (Segmented Control style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.08]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#c2f83d] text-black shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SUBSCRIPTION & BILLING */}
        {activeTab === 'subscription' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Card */}
              <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-slate-400">Current Plan Tier</span>
                    <h3 className="text-2xl font-bold text-white font-display mt-0.5">
                      {member.tier}
                    </h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                      member.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monthly Dues:</span>
                    <span className="font-bold text-white">$189.00 USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Cadence:</span>
                    <span>{member.billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Renewal Date:</span>
                    <span className="text-[#c2f83d] font-bold">{member.renewalDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={onOpenUpgradeModal}
                    className="w-full py-2.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Change / Upgrade Plan
                  </button>
                </div>
              </div>

              {/* Subscription Controls */}
              <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400">Automated Controls</span>
                  <h3 className="text-lg font-bold text-white font-display mt-0.5">
                    Billing Preferences
                  </h3>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Auto Renew Switch */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <div>
                      <div className="font-semibold text-white">Auto-Renewal</div>
                      <div className="text-[11px] text-slate-400">Charge payment method automatically</div>
                    </div>
                    <button
                      onClick={handleToggleAutoRenew}
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        member.autoRenew ? 'bg-[#c2f83d]' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-black transition-transform absolute top-0.5 ${
                          member.autoRenew ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Freeze Account */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <div>
                      <div className="font-semibold text-white">Temporary Freeze</div>
                      <div className="text-[11px] text-slate-400">Pause dues & access for travel / recovery</div>
                    </div>
                    <button
                      onClick={handleToggleFreeze}
                      className="px-3 py-1.5 bg-white/[0.08] hover:bg-white/[0.15] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {member.status === 'Frozen' ? 'Unfreeze' : 'Freeze'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  All updates automatically trigger instant verification email alerts.
                </div>
              </div>

              {/* Payment Method Stored */}
              <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400">Vaulted Method</span>
                  <h3 className="text-lg font-bold text-white font-display mt-0.5">
                    Payment Instrument
                  </h3>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-tr from-slate-900 to-zinc-900 border border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>MASTERCARD CORPORATE</span>
                    <Shield className="w-4 h-4 text-[#c2f83d]" />
                  </div>
                  <div className="text-lg font-mono tracking-widest text-white">
                    •••• •••• •••• 4242
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
                    <span>EXP 12/28</span>
                    <span>ALEX HUNTER</span>
                  </div>
                </div>

                <button
                  onClick={onOpenUpgradeModal}
                  className="w-full py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Update Stored Card
                </button>
              </div>
            </div>

            {/* Invoices Ledger Table (Tabular figures) */}
            <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Billing History & Tax Invoices
                  </h3>
                  <p className="text-xs text-slate-400">
                    Encrypted receipts for all subscription dues and training session purchases
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[11px]">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-right">Amount Paid</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-mono">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-bold text-white">INV-98124</td>
                      <td className="py-3.5 px-4 text-slate-300">2026-09-15</td>
                      <td className="py-3.5 px-4 font-sans text-slate-200">Black Onyx VIP Monthly Renewal</td>
                      <td className="py-3.5 px-4 text-right text-white font-bold tabular-nums">$189.00</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-bold">
                          PAID
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={onOpenNotifications}
                          className="text-[#c2f83d] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-bold text-white">INV-96402</td>
                      <td className="py-3.5 px-4 text-slate-300">2026-08-15</td>
                      <td className="py-3.5 px-4 font-sans text-slate-200">Black Onyx VIP Monthly Renewal</td>
                      <td className="py-3.5 px-4 text-right text-white font-bold tabular-nums">$189.00</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 font-bold">
                          PAID
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={onOpenNotifications}
                          className="text-[#c2f83d] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINER PROGRESS REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Top Stat Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-slate-400">Current Scale Mass</div>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                  {member.currentWeightKg}{' '}
                  <span className="text-xs text-slate-400 font-normal">KG</span>
                </div>
                <div className="text-[11px] text-[#c2f83d] font-mono mt-1">+1.9kg lean tissue since Aug</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-slate-400">Body Fat (InBody)</div>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                  {member.bodyFatPct}{' '}
                  <span className="text-xs text-slate-400 font-normal">%</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">-1.1% adiposity drop</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-slate-400">Squat 1RM Peak</div>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
                  {reports[0]?.squat1RM || 165}{' '}
                  <span className="text-xs text-slate-400 font-normal">KG</span>
                </div>
                <div className="text-[11px] text-[#c2f83d] font-mono mt-1">+20kg overload delta</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-slate-400">Training Compliance</div>
                <div className="text-3xl font-extrabold text-[#c2f83d] font-mono tabular-nums mt-1">
                  {reports[0]?.weeklyComplianceRate || 94}{' '}
                  <span className="text-xs text-slate-400 font-normal">%</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">Elite Tier Adherence</div>
              </div>
            </div>

            {/* Trainer Actions & Reports List */}
            <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Trainer Biomechanical & Progress Reports
                  </h3>
                  <p className="text-xs text-slate-400">
                    Comprehensive clinical check-ins logged by Head Coach Marcus Vance
                  </p>
                </div>

                {/* Trainer Action: Publish new report */}
                <button
                  onClick={() => setShowNewReportModal(true)}
                  className="px-4 py-2.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center gap-2 self-start cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish New Assessment Report</span>
                </button>
              </div>

              {/* Progress Reports Feed */}
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#c2f83d]">
                          <span>{report.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>Evaluator: {report.trainerName}</span>
                        </div>
                        <h4 className="text-base font-bold text-white font-display mt-0.5">
                          {report.phase}
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#c2f83d]/10 text-[#c2f83d] self-start sm:self-center">
                        {report.statusSummary} ({report.weeklyComplianceRate}% Adherence)
                      </span>
                    </div>

                    {/* Numeric Telemetry Grid (Tabular-nums) */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 py-2 text-xs font-mono">
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-400 text-[10px] block">Body Mass</span>
                        <span className="font-bold text-white tabular-nums">{report.weightKg} kg</span>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-400 text-[10px] block">Body Fat</span>
                        <span className="font-bold text-white tabular-nums">{report.bodyFatPct}%</span>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-400 text-[10px] block">Lean Mass</span>
                        <span className="font-bold text-white tabular-nums">{report.muscleMassKg} kg</span>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-400 text-[10px] block">Bench 1RM</span>
                        <span className="font-bold text-[#c2f83d] tabular-nums">{report.benchPress1RM} kg</span>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-400 text-[10px] block">Squat 1RM</span>
                        <span className="font-bold text-[#c2f83d] tabular-nums">{report.squat1RM} kg</span>
                      </div>
                      <div className="bg-black/30 p-2.5 rounded-lg border border-white/[0.04]">
                        <span className="text-slate-400 text-[10px] block">Deadlift 1RM</span>
                        <span className="font-bold text-[#c2f83d] tabular-nums">{report.deadlift1RM} kg</span>
                      </div>
                    </div>

                    {/* Feedback & Milestone */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-300">Coach Clinical Observations:</span>
                        <p className="text-slate-300 mt-0.5 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                          {report.trainerFeedback}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px] pt-1">
                        <span className="text-[#c2f83d] font-bold">Targeted Next Milestone:</span>
                        <span>{report.nextMilestone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for Creating New Trainer Report */}
            {showNewReportModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#12151f] border border-white/10 rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                  <h3 className="text-xl font-bold text-white font-display mb-1">
                    Publish Biomechanical Progress Assessment
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Logged as Coach Marcus Vance for athlete Alex Hunter. Automatically dispatches notification email.
                  </p>

                  <form onSubmit={handlePublishReport} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Cycle Phase Name</label>
                      <input
                        type="text"
                        required
                        value={newPhase}
                        onChange={(e) => setNewPhase(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Current Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={newWeight}
                          onChange={(e) => setNewWeight(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Body Fat %</label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={newBodyFat}
                          onChange={(e) => setNewBodyFat(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Bench 1RM (kg)</label>
                        <input
                          type="number"
                          required
                          value={newBench}
                          onChange={(e) => setNewBench(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Squat 1RM (kg)</label>
                        <input
                          type="number"
                          required
                          value={newSquat}
                          onChange={(e) => setNewSquat(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-medium mb-1">Deadlift 1RM (kg)</label>
                        <input
                          type="number"
                          required
                          value={newDeadlift}
                          onChange={(e) => setNewDeadlift(Number(e.target.value))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Coach Diagnostic Feedback</label>
                      <textarea
                        rows={3}
                        required
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Next Cycle Objective</label>
                      <input
                        type="text"
                        required
                        value={newMilestone}
                        onChange={(e) => setNewMilestone(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setShowNewReportModal(false)}
                        className="px-4 py-2 bg-white/[0.06] text-white rounded-lg hover:bg-white/[0.1]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#c2f83d] text-black font-bold rounded-lg hover:bg-[#b0e830]"
                      >
                        Publish & Notify Athlete
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NUTRITION ARCHITECTURE */}
        {activeTab === 'nutrition' && nutrition && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Macro Summary Header */}
            <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono text-[#c2f83d] uppercase">Assigned Sports Nutrition</span>
                  <h3 className="text-2xl font-bold text-white font-display mt-0.5">
                    {nutrition.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Calibrated by Coach Marcus Vance · High-BV Protein & Peri-Workout Glycogen Split
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                      {nutrition.calorieTarget}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">TARGET KCAL/DAY</div>
                  </div>
                </div>
              </div>

              {/* Progress Bars for Macros */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Protein</span>
                    <span className="text-white font-bold">{nutrition.macros.proteinGrams}g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-[#c2f83d] h-full w-[85%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">85% met today</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Carbohydrates</span>
                    <span className="text-amber-400 font-bold">{nutrition.macros.carbsGrams}g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-amber-400 h-full w-[70%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">70% met today</span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>Healthy Fats</span>
                    <span className="text-blue-400 font-bold">{nutrition.macros.fatGrams}g</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div className="bg-blue-400 h-full w-[90%]" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">90% met today</span>
                </div>

                {/* Water Hydration Quick Logger */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-cyan-400">
                      <Droplet className="w-3.5 h-3.5" />
                      <span>Hydration</span>
                    </span>
                    <span className="text-white font-bold">{waterLogged.toFixed(2)}L / {nutrition.waterLiters}L</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-cyan-400 h-full transition-all"
                      style={{ width: `${Math.min(100, (waterLogged / nutrition.waterLiters) * 100)}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setWaterLogged((w) => +(w + 0.25).toFixed(2))}
                    className="text-[10px] text-[#c2f83d] hover:underline font-mono mt-1 block cursor-pointer"
                  >
                    + Log 250ml Glass
                  </button>
                </div>
              </div>
            </div>

            {/* Meals List */}
            <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
              <h3 className="text-lg font-bold text-white font-display">
                Tailored Meal Protocol
              </h3>

              <div className="space-y-3">
                {nutrition.meals.map((meal) => (
                  <div
                    key={meal.mealNumber}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-[#c2f83d]/15 text-[#c2f83d] font-mono font-bold flex items-center justify-center shrink-0">
                        {meal.mealNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{meal.name}</span>
                          <span className="text-xs text-slate-400 font-mono">({meal.timing})</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{meal.description}</p>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs shrink-0 bg-black/40 px-3.5 py-2 rounded-lg border border-white/[0.04]">
                      <span className="text-white font-bold text-sm">{meal.calories} kcal</span>
                      <div className="text-slate-400 text-[11px] mt-0.5">
                        <span className="text-[#c2f83d]">{meal.protein}g P</span> ·{' '}
                        <span className="text-amber-300">{meal.carbs}g C</span> ·{' '}
                        <span className="text-blue-300">{meal.fat}g F</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SESSION CALENDAR */}
        {activeTab === 'schedule' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">
                    Private Session Calendar & Scheduled Floor Time
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your scheduled 1-on-1 coaching blocks, biomechanical reviews, and platform reservations
                  </p>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center gap-2 self-start cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Reserve New Session</span>
                </button>
              </div>

              {/* Bookings List */}
              <div className="space-y-3">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                    No sessions scheduled. Book your next private block above.
                  </div>
                ) : (
                  bookings.map((session) => (
                    <div
                      key={session.id}
                      className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#c2f83d]/10 text-[#c2f83d] flex flex-col items-center justify-center font-mono shrink-0">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base font-display">
                              {session.sessionType}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400">
                              {session.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono mt-1 flex flex-wrap items-center gap-2">
                            <span>Coach: {session.trainerName}</span>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#c2f83d] font-bold">{session.date} ({session.timeSlot})</span>
                            <span aria-hidden="true">·</span>
                            <span>{session.location}</span>
                          </div>
                          {session.notes && (
                            <p className="text-xs text-slate-300 mt-2 bg-white/[0.02] p-2 rounded">
                              Focus: {session.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => handleCancelBooking(session.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURE CHAT */}
        {activeTab === 'chat' && (
          <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] flex flex-col h-[650px] animate-in fade-in duration-200">
            {/* Chat Header */}
            <div className="border-b border-white/[0.08] pb-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={userRole === 'member' ? '/src/assets/images/coach_marcus_vance_1791141226432.jpg' : member.avatarUrl}
                  alt="Chat Participant"
                  className="w-10 h-10 rounded-xl object-cover bg-slate-800 border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="font-bold text-white text-sm font-display">
                    {userRole === 'member' ? 'Coach Marcus Vance (Head Trainer)' : `Athlete: ${member.name}`}
                  </h3>
                  <div className="text-[11px] text-[#c2f83d] flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c2f83d] animate-pulse" />
                    <span>Direct Biometric & Protocol Channel (Encrypted)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {chatMessages.map((msg) => {
                const isMe = (userRole === 'member' && msg.sender === 'member') || (userRole === 'trainer' && msg.sender === 'trainer');
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-1 px-1 font-mono">
                      {msg.senderName} · {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#c2f83d] text-black font-medium rounded-tr-none'
                          : 'bg-[#181c28] text-slate-100 border border-white/[0.08] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="py-2 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
              <span className="text-slate-500 font-mono text-[10px] shrink-0">Quick Queries:</span>
              <button
                onClick={() => setChatInput("Coach, can we review my paused squat bar path tomorrow?")}
                className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 rounded-md whitespace-nowrap cursor-pointer"
              >
                Paused Squat Bar Path
              </button>
              <button
                onClick={() => setChatInput("Logged 210g protein and 3.5L water today. Ready for high load.")}
                className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 rounded-md whitespace-nowrap cursor-pointer"
              >
                Log Today's Fueling
              </button>
              <button
                onClick={() => setChatInput("Requesting a 15-minute warmup on the Normatec recovery boots.")}
                className="px-2.5 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 rounded-md whitespace-nowrap cursor-pointer"
              >
                Normatec Recovery Prep
              </button>
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="pt-2 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={userRole === 'member' ? "Message Coach Marcus Vance..." : "Message Athlete Alex Hunter..."}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="p-2.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
