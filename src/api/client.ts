import {
  MemberProfile,
  EquipmentItem,
  Trainer,
  BookingSession,
  NutritionPlan,
  ProgressReport,
  ChatMessage,
  EmailNotification
} from '../types';

export const api = {
  // Member Profile
  async getMemberProfile(): Promise<MemberProfile> {
    try {
      const res = await fetch('/api/member/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');
      return await res.json();
    } catch {
      return {
        id: 'mem_01',
        name: 'Alex Hunter',
        email: 'alex.hunter@performance.io',
        phone: '+1 (555) 234-8901',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        tier: 'Black Onyx VIP',
        status: 'Active',
        joinedDate: '2026-01-15',
        renewalDate: '2026-11-15',
        billingCycle: 'Monthly',
        autoRenew: true,
        assignedTrainerId: 'tr_marcus',
        fitnessGoal: 'Hypertrophy & Biomechanical Rebalance',
        currentWeightKg: 82.4,
        targetWeightKg: 85.0,
        bodyFatPct: 12.8,
      };
    }
  },

  async updateMemberProfile(updates: Partial<MemberProfile>): Promise<{ success: boolean; member: MemberProfile }> {
    const res = await fetch('/api/member/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  async updateSubscription(data: {
    tier?: MemberProfile['tier'];
    autoRenew?: boolean;
    status?: MemberProfile['status'];
    billingCycle?: MemberProfile['billingCycle'];
  }): Promise<{ success: boolean; member: MemberProfile }> {
    const res = await fetch('/api/subscription/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Payment Processing
  async processPayment(payload: {
    cardNumber: string;
    cardExp: string;
    cardCvv: string;
    planTier: MemberProfile['tier'];
    billingCycle: 'Monthly' | 'Annual';
    amount: number;
    memberName?: string;
    email?: string;
  }): Promise<{
    success: boolean;
    transactionId: string;
    amount: number;
    currency: string;
    status: string;
    timestamp: string;
    member: MemberProfile;
  }> {
    const res = await fetch('/api/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // Equipment
  async getEquipment(category?: string): Promise<EquipmentItem[]> {
    try {
      const url = category && category !== 'All' ? `/api/equipment?category=${encodeURIComponent(category)}` : '/api/equipment';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch equipment');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Trainers
  async getTrainers(): Promise<Trainer[]> {
    try {
      const res = await fetch('/api/trainers');
      if (!res.ok) throw new Error('Failed to fetch trainers');
      return await res.json();
    } catch {
      return [];
    }
  },

  // Nutrition Plan
  async getNutritionPlan(): Promise<NutritionPlan> {
    const res = await fetch('/api/nutrition/plan');
    return await res.json();
  },

  async updateNutritionPlan(updates: Partial<NutritionPlan>): Promise<{ success: boolean; nutritionPlan: NutritionPlan }> {
    const res = await fetch('/api/nutrition/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return await res.json();
  },

  // Progress Reports
  async getProgressReports(): Promise<ProgressReport[]> {
    const res = await fetch('/api/progress-reports');
    return await res.json();
  },

  async createProgressReport(reportData: Partial<ProgressReport>): Promise<{ success: boolean; report: ProgressReport }> {
    const res = await fetch('/api/progress-reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reportData),
    });
    return await res.json();
  },

  // Bookings
  async getBookings(): Promise<BookingSession[]> {
    const res = await fetch('/api/bookings');
    return await res.json();
  },

  async createBooking(bookingData: {
    sessionType: BookingSession['sessionType'];
    date: string;
    timeSlot: string;
    trainerId: string;
    notes?: string;
  }): Promise<{ success: boolean; booking: BookingSession }> {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return await res.json();
  },

  async cancelBooking(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  // Chat
  async getChatMessages(): Promise<ChatMessage[]> {
    const res = await fetch('/api/chat/messages');
    return await res.json();
  },

  async sendChatMessage(payload: {
    text: string;
    sender: 'member' | 'trainer';
    attachmentType?: ChatMessage['attachmentType'];
  }): Promise<{ success: boolean; message: ChatMessage }> {
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  // Email notifications
  async getEmailNotifications(): Promise<EmailNotification[]> {
    const res = await fetch('/api/notifications/emails');
    return await res.json();
  },

  // Admin Portal API
  async loginAdmin(credentials: { email?: string; password?: string }): Promise<{
    success: boolean;
    token?: string;
    adminUser?: { name: string; role: string; email: string };
    error?: string;
  }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  },

  async getAdminMembers(): Promise<MemberProfile[]> {
    try {
      const res = await fetch('/api/admin/members');
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch {
      return [];
    }
  },

  async updateAdminMemberStatus(id: string, status: MemberProfile['status']): Promise<{ success: boolean; member: MemberProfile }> {
    const res = await fetch(`/api/admin/members/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  },

  async updateAdminMemberTier(id: string, tier: MemberProfile['tier']): Promise<{ success: boolean; member: MemberProfile }> {
    const res = await fetch(`/api/admin/members/${id}/tier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier }),
    });
    return await res.json();
  },

  async createAdminMember(memberData: Partial<MemberProfile>): Promise<{ success: boolean; member: MemberProfile }> {
    const res = await fetch('/api/admin/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData),
    });
    return await res.json();
  },

  async deleteAdminMember(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/admin/members/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  async updateEquipmentStatus(id: string, status: EquipmentItem['status']): Promise<{ success: boolean; equipment: EquipmentItem }> {
    const res = await fetch(`/api/admin/equipment/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  },

  async broadcastAdminEmail(payload: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; email: EmailNotification }> {
    const res = await fetch('/api/admin/notifications/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }
};
