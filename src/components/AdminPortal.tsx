import React, { useState, useEffect } from 'react';
import {
  Users,
  CreditCard,
  Dumbbell,
  Mail,
  Shield,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  DollarSign,
  Calendar,
  Send,
  RefreshCw,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { MemberProfile, EquipmentItem, EmailNotification, Trainer } from '../types';
import { api } from '../api/client';

interface AdminPortalProps {
  onBackToHome: () => void;
  onGoToMemberView: () => void;
  onLogoutAdmin: () => void;
  trainers: Trainer[];
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToHome,
  onGoToMemberView,
  onLogoutAdmin,
  trainers,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'revenue' | 'equipment' | 'broadcast'>('members');
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [loading, setLoading] = useState(false);

  // New Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+1 (555) 678-1234');
  const [newTier, setNewTier] = useState<MemberProfile['tier']>('Black Onyx VIP');
  const [newTrainerId, setNewTrainerId] = useState(trainers[0]?.id || 'tr_marcus');

  // Broadcast Email State
  const [broadcastRecipient, setBroadcastRecipient] = useState('alex.hunter@performance.io');
  const [broadcastSubject, setBroadcastSubject] = useState('Facility Notice: Private Lifting Deck Reserved for Masterclass');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Please be advised that the Olympic platform area will host an advanced coaching clinic tomorrow from 2:00 PM to 3:30 PM. All other biomechanics zones remain fully open.'
  );
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  // Load Data
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [membersData, eqData, emailsData] = await Promise.all([
        api.getAdminMembers(),
        api.getEquipment(),
        api.getEmailNotifications(),
      ]);
      setMembers(membersData);
      setEquipmentList(eqData);
      setEmailLogs(emailsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Toggle member status (Active / Frozen)
  const handleToggleMemberStatus = async (m: MemberProfile) => {
    const nextStatus = m.status === 'Active' ? 'Frozen' : 'Active';
    try {
      const res = await api.updateAdminMemberStatus(m.id, nextStatus);
      if (res.success) {
        setMembers((prev) =>
          prev.map((item) => (item.id === m.id ? { ...item, status: nextStatus } : item))
        );
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Member Tier
  const handleChangeMemberTier = async (m: MemberProfile, tier: MemberProfile['tier']) => {
    try {
      const res = await api.updateAdminMemberTier(m.id, tier);
      if (res.success) {
        setMembers((prev) =>
          prev.map((item) => (item.id === m.id ? { ...item, tier } : item))
        );
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Member
  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this member profile?')) return;
    try {
      const res = await api.deleteAdminMember(id);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Enroll New Member
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createAdminMember({
        name: newName,
        email: newEmail,
        phone: newPhone,
        tier: newTier,
        assignedTrainerId: newTrainerId,
      });
      if (res.success) {
        setMembers((prev) => [res.member, ...prev]);
        setShowAddMemberModal(false);
        setNewName('');
        setNewEmail('');
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Equipment Status
  const handleToggleEquipmentStatus = async (item: EquipmentItem) => {
    const nextStatus = item.status === 'Available' ? 'Reserved' : 'Available';
    try {
      const res = await api.updateEquipmentStatus(item.id, nextStatus);
      if (res.success) {
        setEquipmentList((prev) =>
          prev.map((eq) => (eq.id === item.id ? { ...eq, status: nextStatus } : eq))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Broadcast Email
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastStatus('Sending automated email...');
    try {
      const res = await api.broadcastAdminEmail({
        recipientEmail: broadcastRecipient,
        recipientName: broadcastRecipient.split('@')[0],
        subject: broadcastSubject,
        message: broadcastMessage,
      });
      if (res.success) {
        setBroadcastStatus('Email successfully dispatched & logged to member audit trail!');
        loadAdminData();
        setTimeout(() => setBroadcastStatus(null), 4000);
      }
    } catch (err) {
      setBroadcastStatus('Failed to send broadcast.');
    }
  };

  // Calculations
  const totalMRR = members.reduce((acc, m) => {
    if (m.status !== 'Active') return acc;
    if (m.tier === 'Standard Core') return acc + 99;
    if (m.tier === 'Black Onyx VIP') return acc + 189;
    if (m.tier === 'Executive Performance') return acc + 299;
    return acc;
  }, 0);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'All' ? true : m.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-[#07080b] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Admin Header Bar */}
        <div className="p-6 rounded-2xl bg-[#0f121b] border border-[#c2f83d]/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#c2f83d] text-black flex items-center justify-center font-extrabold shadow-md">
              <Shield className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                  MR FIT GYM · EXECUTIVE ADMIN SUITE
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c2f83d] text-black font-extrabold uppercase">
                  Root Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Staff: Director Marcus Vance · 480 Ironworks Way Facility Command
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <a
              href="/download/admin-files.zip"
              download="admin-update-files.zip"
              className="px-3.5 py-2 bg-[#c2f83d] hover:bg-[#b0e830] text-black rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Download the updated admin source files as a ZIP archive for GitHub"
            >
              <span>Download ZIP for GitHub</span>
            </a>
            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white rounded-lg border border-white/[0.08] text-xs font-semibold transition-colors cursor-pointer"
            >
              Public Website
            </button>
            <button
              onClick={onGoToMemberView}
              className="px-3.5 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white rounded-lg border border-white/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              Member View (Alex)
            </button>
            <button
              onClick={onLogoutAdmin}
              className="px-3.5 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* High-Level Metric Tiles (Tabular-nums) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Roster Athletes</span>
              <Users className="w-4 h-4 text-[#c2f83d]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {members.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">
              {members.filter((m) => m.status === 'Active').length} Active Subscriptions
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Monthly Recurring</span>
              <DollarSign className="w-4 h-4 text-[#c2f83d]" />
            </div>
            <div className="text-3xl font-extrabold text-[#c2f83d] font-mono tabular-nums mt-1">
              ${totalMRR}
              <span className="text-xs text-slate-400 font-normal"> / mo</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">100% Secure PCI Captured</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Hardware Status</span>
              <Dumbbell className="w-4 h-4 text-[#c2f83d]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {equipmentList.length}
            </div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">Floor Apparatus Ready</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08]">
            <div className="text-[11px] font-mono uppercase text-slate-400 flex items-center justify-between">
              <span>Automated Emails</span>
              <Mail className="w-4 h-4 text-[#c2f83d]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-mono tabular-nums mt-1">
              {emailLogs.length}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">100% TLS Delivered</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/[0.08] overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'members'
                ? 'bg-[#c2f83d] text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Member Subscriptions Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'revenue'
                ? 'bg-[#c2f83d] text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Revenue & Financial Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'equipment'
                ? 'bg-[#c2f83d] text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Equipment Floor Management</span>
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'bg-[#c2f83d] text-black shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Automated Email Dispatcher</span>
          </button>
        </div>

        {/* SUBTAB 1: MEMBERS DIRECTORY */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Filter and Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by athlete name or email..."
                    className="w-full bg-[#11131b] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
                <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value)}
                  className="bg-[#11131b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="All">All Tiers</option>
                  <option value="Standard Core">Standard Core</option>
                  <option value="Black Onyx VIP">Black Onyx VIP</option>
                  <option value="Executive Performance">Executive Performance</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddMemberModal(true)}
                className="px-4 py-2 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll New Member</span>
              </button>
            </div>

            {/* Members Table */}
            <div className="bg-[#11131b] border border-white/[0.08] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[11px] bg-white/[0.02]">
                      <th className="py-3.5 px-4">Athlete / Contact</th>
                      <th className="py-3.5 px-4">Membership Plan Tier</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Renewal Date</th>
                      <th className="py-3.5 px-4">Assigned Coach</th>
                      <th className="py-3.5 px-4 text-right">Admin Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredMembers.map((m) => {
                      const coach = trainers.find((t) => t.id === m.assignedTrainerId);
                      return (
                        <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={m.avatarUrl}
                                alt={m.name}
                                className="w-9 h-9 rounded-lg object-cover bg-slate-800 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="font-bold text-white text-sm">{m.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">{m.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={m.tier}
                              onChange={(e) =>
                                handleChangeMemberTier(m, e.target.value as MemberProfile['tier'])
                              }
                              className="bg-black/40 border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none font-mono"
                            >
                              <option value="Standard Core">Standard Core ($99)</option>
                              <option value="Black Onyx VIP">Black Onyx VIP ($189)</option>
                              <option value="Executive Performance">Executive Performance ($299)</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 font-mono">
                            <button
                              onClick={() => handleToggleMemberStatus(m)}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                m.status === 'Active'
                                  ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30'
                                  : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
                              }`}
                            >
                              {m.status === 'Active' ? (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span>Active (Click to Freeze)</span>
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  <span>Frozen (Click to Activate)</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-4 px-4 font-mono text-slate-300">
                            <div>{m.renewalDate}</div>
                            <span className="text-[10px] text-slate-400">
                              {m.autoRenew ? 'Auto-renew on' : 'Manual invoice'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-300">
                            {coach ? coach.name : 'Unassigned'}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => handleDeleteMember(m.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enroll New Member Modal */}
            {showAddMemberModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className="bg-[#12151f] border border-white/10 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
                  <h3 className="text-xl font-bold text-white font-display mb-1">
                    Staff Member Enrollment
                  </h3>
                  <p className="text-xs text-slate-400 mb-5">
                    Enroll a new athlete manually. Triggers automated welcome email immediately.
                  </p>

                  <form onSubmit={handleCreateMember} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="e.g. Liam Gallagher"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                        placeholder="liam.g@athlete.com"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Membership Plan</label>
                      <select
                        value={newTier}
                        onChange={(e) => setNewTier(e.target.value as MemberProfile['tier'])}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="Standard Core">Standard Core ($99/mo)</option>
                        <option value="Black Onyx VIP">Black Onyx VIP ($189/mo)</option>
                        <option value="Executive Performance">Executive Performance ($299/mo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Assigned Coach</label>
                      <select
                        value={newTrainerId}
                        onChange={(e) => setNewTrainerId(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                      >
                        {trainers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.title})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
                      <button
                        type="button"
                        onClick={() => setShowAddMemberModal(false)}
                        className="px-4 py-2 bg-white/[0.06] text-white rounded-lg hover:bg-white/[0.1]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#c2f83d] text-black font-extrabold rounded-lg hover:bg-[#b0e830]"
                      >
                        Enroll & Send Pass
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: REVENUE & FINANCIAL LEDGER */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-3">
                <span className="text-[11px] font-mono uppercase text-slate-400">Total Run-rate</span>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  ${totalMRR * 12}.00
                </div>
                <div className="text-xs text-slate-400">Projected Annual Recurring Revenue (ARR)</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-3">
                <span className="text-[11px] font-mono uppercase text-slate-400">Payment Gateway Status</span>
                <div className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Stripe & PCI-DSS Operational</span>
                </div>
                <div className="text-xs text-slate-400">Zero chargebacks · Auto retry enabled</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-3">
                <span className="text-[11px] font-mono uppercase text-slate-400">Average Revenue Per User</span>
                <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                  ${members.length ? Math.round(totalMRR / members.length) : 0}.00
                </div>
                <div className="text-xs text-[#c2f83d] font-mono">Weighted to Black Onyx VIP</div>
              </div>
            </div>

            {/* Invoices Log */}
            <div className="p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
              <h3 className="text-lg font-bold text-white font-display">
                Captured Transactions & Auto-Invoices
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 uppercase text-[11px]">
                      <th className="py-3 px-4">Transaction ID</th>
                      <th className="py-3 px-4">Athlete</th>
                      <th className="py-3 px-4">Plan Category</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                      <th className="py-3 px-4 text-center">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-bold text-white">TXN-491204</td>
                      <td className="py-3.5 px-4 font-sans text-white">Alex Hunter</td>
                      <td className="py-3.5 px-4 font-sans text-slate-300">Black Onyx VIP Monthly</td>
                      <td className="py-3.5 px-4 text-right text-[#c2f83d] font-bold tabular-nums">$189.00</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          SETTLED
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-bold text-white">TXN-382901</td>
                      <td className="py-3.5 px-4 font-sans text-white">Sarah Connor</td>
                      <td className="py-3.5 px-4 font-sans text-slate-300">Executive Performance (Annual)</td>
                      <td className="py-3.5 px-4 text-right text-[#c2f83d] font-bold tabular-nums">$2,868.00</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          SETTLED
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-4 font-bold text-white">TXN-210492</td>
                      <td className="py-3.5 px-4 font-sans text-white">David Goggins</td>
                      <td className="py-3.5 px-4 font-sans text-slate-300">Black Onyx VIP Monthly</td>
                      <td className="py-3.5 px-4 text-right text-[#c2f83d] font-bold tabular-nums">$189.00</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                          SETTLED
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: EQUIPMENT MANAGEMENT */}
        {activeTab === 'equipment' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white font-display">
                  Training Equipment & Biomechanical Apparatus
                </h3>
                <p className="text-xs text-slate-400">
                  Toggle status of gym hardware between Operational and Maintenance / Reserved
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {equipmentList.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-mono uppercase text-[#c2f83d]">
                        {item.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                          item.status === 'Available'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-display">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.specs}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">{item.brand}</span>
                    <button
                      onClick={() => handleToggleEquipmentStatus(item)}
                      className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {item.status === 'Available' ? 'Mark Reserved / Tune' : 'Mark Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 4: BROADCAST / EMAIL DISPATCH CONSOLE */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Dispatch Form (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Staff Announcement Broadcast
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Trigger an official automated email directly to athlete notification inboxes.
                </p>
              </div>

              {broadcastStatus && (
                <div className="p-3 bg-[#c2f83d]/10 border border-[#c2f83d]/20 rounded-lg text-xs text-[#c2f83d] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{broadcastStatus}</span>
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Recipient Athlete</label>
                  <select
                    value={broadcastRecipient}
                    onChange={(e) => setBroadcastRecipient(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.email}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Subject Line</label>
                  <input
                    type="text"
                    required
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Notification Body</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Verified Email</span>
                </button>
              </form>
            </div>

            {/* Right: Live Email Audit Feed (7 cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#11131b] border border-white/[0.08] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Transactional Email Audit Logs
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-time feed of all automated emails dispatched by Mr Fit Gym backend
                  </p>
                </div>
                <button
                  onClick={loadAdminData}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Refresh Audit Logs"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {emailLogs.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="text-[#c2f83d] font-bold uppercase">{item.type.replace('_', ' ')}</span>
                      <span>{item.dispatchedAt}</span>
                    </div>
                    <div className="font-bold text-white font-sans text-sm">{item.subject}</div>
                    <div className="text-slate-400 font-sans text-xs">{item.previewSnippet}</div>
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 pt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.status} · Delivered to {item.recipientEmail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
