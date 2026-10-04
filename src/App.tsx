import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EquipmentGallery } from './components/EquipmentGallery';
import { TrainerNutritionSection } from './components/TrainerNutritionSection';
import { MembershipPlans } from './components/MembershipPlans';
import { DashboardView } from './components/DashboardView';
import { PaymentModal } from './components/PaymentModal';
import { BookingCalendarModal } from './components/BookingCalendarModal';
import { NotificationsModal } from './components/NotificationsModal';
import { Footer } from './components/Footer';
import {
  MemberProfile,
  EquipmentItem,
  Trainer,
  NutritionPlan,
  EmailNotification,
  BookingSession,
} from './types';
import { api } from './api/client';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [activeDashboardTab, setActiveDashboardTab] = useState<string>('subscription');
  const [userRole, setUserRole] = useState<'member' | 'trainer'>('member');

  // Application Data
  const [member, setMember] = useState<MemberProfile>({
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
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [notifications, setNotifications] = useState<EmailNotification[]>([]);

  // Modals State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingTrainerId, setBookingTrainerId] = useState<string | undefined>(undefined);
  const [bookingSessionType, setBookingSessionType] = useState<BookingSession['sessionType'] | undefined>(undefined);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<MemberProfile['tier']>('Black Onyx VIP');
  const [paymentCycle, setPaymentCycle] = useState<'Monthly' | 'Annual'>('Monthly');
  const [paymentPrice, setPaymentPrice] = useState<number>(189);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function initData() {
      try {
        const [prof, eq, tr, nut, emails] = await Promise.all([
          api.getMemberProfile(),
          api.getEquipment(),
          api.getTrainers(),
          api.getNutritionPlan(),
          api.getEmailNotifications(),
        ]);
        if (prof) setMember(prof);
        if (eq) setEquipment(eq);
        if (tr) setTrainers(tr);
        if (nut) setNutritionPlan(nut);
        if (emails) setNotifications(emails);
      } catch (err) {
        console.error('Error initializing application data:', err);
      }
    }
    initData();
  }, []);

  // Refresh notifications after any event
  const refreshNotifications = async () => {
    try {
      const emails = await api.getEmailNotifications();
      setNotifications(emails);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenBooking = (trainerId?: string, sessionType?: BookingSession['sessionType']) => {
    setBookingTrainerId(trainerId);
    setBookingSessionType(sessionType);
    setIsBookingOpen(true);
  };

  const handleSelectPlan = (
    tier: MemberProfile['tier'],
    cycle: 'Monthly' | 'Annual',
    price: number
  ) => {
    setPaymentPlan(tier);
    setPaymentCycle(cycle);
    setPaymentPrice(price);
    setIsPaymentOpen(true);
  };

  const handleScrollTo = (id: string) => {
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
    <div className="min-h-screen bg-[#08090c] text-slate-100 flex flex-col selection:bg-[#c2f83d] selection:text-black">
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeDashboardTab={activeDashboardTab}
        setActiveDashboardTab={setActiveDashboardTab}
        member={member}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenBooking={() => handleOpenBooking()}
        unreadEmailsCount={notifications.length}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' ? (
          <div>
            {/* Hero Section with Cinematic Visual Asset */}
            <HeroSection
              onOpenBooking={() => handleOpenBooking()}
              onExploreEquipment={() => handleScrollTo('equipment')}
              onSelectMembership={() => handleScrollTo('memberships')}
            />

            {/* Gallery of Training Equipment */}
            <EquipmentGallery
              equipment={equipment}
              onBookWithEquipment={(itemName) => {
                handleOpenBooking(undefined, 'Biomechanical Assessment');
              }}
            />

            {/* Personal Trainers & Nutrition Engine */}
            {nutritionPlan && (
              <TrainerNutritionSection
                trainers={trainers}
                nutritionPlan={nutritionPlan}
                onBookTrainer={(tId) => handleOpenBooking(tId)}
                onOpenDashboardNutrition={() => {
                  setCurrentView('dashboard');
                  setActiveDashboardTab('nutrition');
                }}
              />
            )}

            {/* Subscriptions & Membership Tiers */}
            <MembershipPlans
              currentTier={member.tier}
              onSelectPlan={handleSelectPlan}
            />
          </div>
        ) : (
          /* Member & Personal Trainer Dashboard */
          <DashboardView
            member={member}
            setMember={setMember}
            userRole={userRole}
            setUserRole={setUserRole}
            trainers={trainers}
            activeTab={activeDashboardTab}
            setActiveTab={setActiveDashboardTab}
            onOpenBooking={() => handleOpenBooking()}
            onOpenUpgradeModal={() => {
              handleSelectPlan(member.tier, member.billingCycle, 189);
            }}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <Footer
        onScrollTo={handleScrollTo}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Modals & Dialogs */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        planTier={paymentPlan}
        billingCycle={paymentCycle}
        price={paymentPrice}
        member={member}
        onPaymentSuccess={(newTier) => {
          setMember((prev) => ({
            ...prev,
            tier: newTier,
            status: 'Active',
          }));
          refreshNotifications();
        }}
        onOpenNotifications={() => {
          refreshNotifications();
          setIsNotificationsOpen(true);
        }}
      />

      <BookingCalendarModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        trainers={trainers}
        defaultTrainerId={bookingTrainerId}
        defaultSessionType={bookingSessionType}
        onBookingSuccess={(booking) => {
          refreshNotifications();
        }}
        onOpenNotifications={() => {
          refreshNotifications();
          setIsNotificationsOpen(true);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
      />
    </div>
  );
}
