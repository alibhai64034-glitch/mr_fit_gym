import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Data Store for Mr Fit Gym
interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  tier: 'Standard Core' | 'Black Onyx VIP' | 'Executive Performance';
  status: 'Active' | 'Frozen' | 'Pending Renewal';
  joinedDate: string;
  renewalDate: string;
  billingCycle: 'Monthly' | 'Annual';
  autoRenew: boolean;
  assignedTrainerId: string;
  fitnessGoal: string;
  currentWeightKg: number;
  targetWeightKg: number;
  bodyFatPct: number;
}

interface EquipmentItem {
  id: string;
  name: string;
  category: 'Biomechanical Strength' | 'Olympic & Free Weights' | 'Cardio Conditioning' | 'Recovery & Mobility';
  targetMuscles: string[];
  brand: string;
  specs: string;
  image: string;
  status: 'Available' | 'Reserved';
  guide: string;
}

interface Trainer {
  id: string;
  name: string;
  title: string;
  specialty: string[];
  experienceYears: number;
  certification: string;
  avatar: string;
  bio: string;
  availableDays: string[];
  hourlyRate: number;
}

interface BookingSession {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  sessionType: '1-on-1 Hypertrophy' | 'Olympic Form & Power' | 'Metabolic Conditioning' | 'Biomechanical Assessment' | 'Nutrition Consultation';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "08:00 AM - 09:00 AM"
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes?: string;
  location: string;
}

interface NutritionPlan {
  id: string;
  memberId: string;
  trainerId: string;
  title: string;
  calorieTarget: number;
  macros: {
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  waterLiters: number;
  dietaryType: 'High Protein / Lean Mass' | 'Ketogenic Performance' | 'Plant-Based Strength' | 'Carb Cycling';
  updatedAt: string;
  meals: {
    mealNumber: number;
    name: string;
    timing: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
  trainerNotes: string;
}

interface ProgressReport {
  id: string;
  memberId: string;
  trainerId: string;
  trainerName: string;
  date: string;
  phase: string;
  weightKg: number;
  bodyFatPct: number;
  muscleMassKg: number;
  benchPress1RM: number;
  squat1RM: number;
  deadlift1RM: number;
  weeklyComplianceRate: number; // percentage
  statusSummary: 'Outstanding Progress' | 'On Track' | 'Adjustment Required';
  trainerFeedback: string;
  nextMilestone: string;
}

interface ChatMessage {
  id: string;
  sender: 'member' | 'trainer';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachmentType?: 'nutrition_log' | 'progress_check' | 'schedule_update';
}

interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  type: 'membership_welcome' | 'payment_receipt' | 'booking_confirmation' | 'plan_update' | 'progress_report';
  dispatchedAt: string;
  status: 'Delivered' | 'Sent';
  previewSnippet: string;
  htmlBody: string;
}

// Initial In-Memory State
let member: MemberProfile = {
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

let membersList: MemberProfile[] = [
  member,
  {
    id: 'mem_02',
    name: 'Sarah Connor',
    email: 'sarah.c@cyberdyne.fit',
    phone: '+1 (555) 890-1234',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    tier: 'Executive Performance',
    status: 'Active',
    joinedDate: '2025-11-10',
    renewalDate: '2026-11-10',
    billingCycle: 'Annual',
    autoRenew: true,
    assignedTrainerId: 'tr_elena',
    fitnessGoal: 'Tactical Conditioning & Functional Power',
    currentWeightKg: 64.2,
    targetWeightKg: 63.0,
    bodyFatPct: 15.4,
  },
  {
    id: 'mem_03',
    name: 'David Goggins',
    email: 'stay.hard@canthurtme.org',
    phone: '+1 (555) 777-4321',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    tier: 'Black Onyx VIP',
    status: 'Active',
    joinedDate: '2026-02-01',
    renewalDate: '2026-12-01',
    billingCycle: 'Monthly',
    autoRenew: true,
    assignedTrainerId: 'tr_damon',
    fitnessGoal: 'Ultra-Endurance & Mental Fortitude',
    currentWeightKg: 86.0,
    targetWeightKg: 85.0,
    bodyFatPct: 9.8,
  },
  {
    id: 'mem_04',
    name: 'Chloe Zhao',
    email: 'chloe.z@studioarch.com',
    phone: '+1 (555) 345-6789',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    tier: 'Standard Core',
    status: 'Frozen',
    joinedDate: '2026-03-12',
    renewalDate: '2026-10-25',
    billingCycle: 'Monthly',
    autoRenew: false,
    assignedTrainerId: 'tr_marcus',
    fitnessGoal: 'Postural Realignment & Mobility',
    currentWeightKg: 58.5,
    targetWeightKg: 58.0,
    bodyFatPct: 18.2,
  },
];

const trainers: Trainer[] = [
  {
    id: 'tr_marcus',
    name: 'Marcus Vance',
    title: 'Head Strength & Biomechanics Coach',
    specialty: ['Hypertrophy Science', 'Postural Alignment', 'Olympic Power'],
    experienceYears: 12,
    certification: 'CSCS · ISSN Master Sports Nutritionist',
    avatar: '/src/assets/images/coach_marcus_vance_1791141226432.jpg',
    bio: 'Founder of the Mr Fit Protocol. Specializes in transforming elite athletes and high-performing executives using metric-driven progressive overload and dialed metabolic nutrition.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    hourlyRate: 110,
  },
  {
    id: 'tr_elena',
    name: 'Elena Rostova',
    title: 'Lead Conditioning & Movement Specialist',
    specialty: ['Metabolic Conditioning', 'Mobility Restoration', 'Endurance'],
    experienceYears: 8,
    certification: 'NASM-PES · EXOS Performance Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    bio: 'Former national track athlete focusing on explosive sprint kinematics, cardiac output training, and functional longevity.',
    availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    hourlyRate: 95,
  },
  {
    id: 'tr_damon',
    name: 'Damon Cole',
    title: 'Master Powerlifting & Heavy Athletics',
    specialty: ['Powerlifting 1RM', 'Barbell Mechanics', 'Injury Prevention'],
    experienceYears: 10,
    certification: 'USAPL Senior Coach · FMS Level 2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Specialist in the Big Three lifts, nervous system readiness, and tendon adaptation for sustainable heavy lifting.',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    hourlyRate: 105,
  }
];

const equipmentCatalog: EquipmentItem[] = [
  {
    id: 'eq_01',
    name: 'Eleiko Vulkan Dual Adjustable Cable Rig',
    category: 'Biomechanical Strength',
    targetMuscles: ['Chest', 'Rear Delts', 'Lats', 'Rotator Cuff'],
    brand: 'Eleiko Performance',
    specs: 'Precision 2:1 ratio ball-bearing pulleys, laser-indexed 100kg weight stacks per side, 32 height adjustment increments.',
    image: '/src/assets/images/equipment_strength_rig_1791141193449.jpg',
    status: 'Available',
    guide: 'Ideal for unilateral flyes, high-to-low cable rows, and face pulls with continuous tension curves.',
  },
  {
    id: 'eq_02',
    name: 'Werksan Olympic Power Station & Wood Platform',
    category: 'Olympic & Free Weights',
    targetMuscles: ['Glutes', 'Hamstrings', 'Quadriceps', 'Traps'],
    brand: 'Werksan IWF Certified',
    specs: 'Hand-finished solid birch center drop deck with high-density urethane acoustic dampening wings and magnetic barbell jacks.',
    image: '/src/assets/images/hero_mr_fit_gym_1791141178174.jpg',
    status: 'Available',
    guide: 'Standardized Olympic cleans, snatches, deadlifts and deep front squats with zero bounce deflection.',
  },
  {
    id: 'eq_03',
    name: 'Prime Biomechanics Plate-Loaded Chest Press',
    category: 'Biomechanical Strength',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoid', 'Triceps'],
    brand: 'Prime Fitness USA',
    specs: 'SmartStrength 3-pin cam system altering resistance curve (early, mid, or late range loading).',
    image: '/src/assets/images/equipment_strength_rig_1791141193449.jpg',
    status: 'Available',
    guide: 'Adjust the cam pin to shift mechanical overload to the contracted peak or the stretched position.',
  },
  {
    id: 'eq_04',
    name: 'Woodway Curve Treadmill & Wattbike Pro',
    category: 'Cardio Conditioning',
    targetMuscles: ['Cardiovascular System', 'Posterior Chain', 'Calves'],
    brand: 'Woodway & Wattbike',
    specs: 'Non-motorized slat belt with dual air/magnetic resistance generator and dual-sided pedaling metric telemetry.',
    image: '/src/assets/images/hero_mr_fit_gym_1791141178174.jpg',
    status: 'Available',
    guide: 'True self-paced sprint intervals and maximal aerobic speed threshold testing.',
  },
  {
    id: 'eq_05',
    name: 'Normatec 3 Hyperice Cryo & Compression Station',
    category: 'Recovery & Mobility',
    targetMuscles: ['Full Body Recovery', 'Lymphatic Drainage', 'Legs'],
    brand: 'Hyperice Recovery Suite',
    specs: 'Dynamic air compression with 7 intensity levels and pulse technology to flush metabolic waste.',
    image: '/src/assets/images/nutrition_athlete_meal_1791141213906.jpg',
    status: 'Available',
    guide: 'Use for 20-30 minutes post-session to reduce delayed-onset muscle soreness (DOMS).',
  }
];

let nutritionPlan: NutritionPlan = {
  id: 'nut_plan_01',
  memberId: 'mem_01',
  trainerId: 'tr_marcus',
  title: 'Lean Hypertrophy & Neuromuscular Fueling Plan',
  calorieTarget: 2950,
  macros: {
    proteinGrams: 210,
    carbsGrams: 330,
    fatGrams: 75,
  },
  waterLiters: 4.0,
  dietaryType: 'High Protein / Lean Mass',
  updatedAt: '2026-10-02',
  trainerNotes: 'Focus on consuming the bulk of your carbohydrates around the peri-workout window (Meal 2 pre-training and Meal 3 post-training) to sustain high power output on compound lifts.',
  meals: [
    {
      mealNumber: 1,
      name: 'Morning Metabolic Primer',
      timing: '07:30 AM',
      description: '4 pastured eggs scrambled with baby spinach, 80g rolled oats cooked in almond milk with wild blueberries and 1 tbsp chia seeds.',
      calories: 640,
      protein: 42,
      carbs: 65,
      fat: 22,
    },
    {
      mealNumber: 2,
      name: 'Pre-Workout Glycogen Loader',
      timing: '11:45 AM',
      description: 'Gourmet wild salmon fillet (180g) over steamed tri-color quinoa and roasted Japanese sweet potatoes with lemon-herb drizzle.',
      calories: 780,
      protein: 52,
      carbs: 84,
      fat: 24,
    },
    {
      mealNumber: 3,
      name: 'Post-Workout Anabolic Window',
      timing: '04:15 PM',
      description: 'Whey Isolate shake (40g) blended with ripe banana, rice flakes, and raw honey, accompanied by 2 whole wheat sourdough toasts.',
      calories: 610,
      protein: 48,
      carbs: 92,
      fat: 6,
    },
    {
      mealNumber: 4,
      name: 'Nighttime Tissue Repair & Satiety',
      timing: '08:00 PM',
      description: 'Grass-fed lean beef sirloin steak (200g) with grilled asparagus, roasted portobello mushrooms, and steamed jasmine rice.',
      calories: 720,
      protein: 58,
      carbs: 68,
      fat: 21,
    }
  ]
};

let progressReports: ProgressReport[] = [
  {
    id: 'rep_03',
    memberId: 'mem_01',
    trainerId: 'tr_marcus',
    trainerName: 'Marcus Vance',
    date: '2026-10-01',
    phase: 'Phase 3: Hypertrophy & Load Intensification',
    weightKg: 82.4,
    bodyFatPct: 12.8,
    muscleMassKg: 42.1,
    benchPress1RM: 125,
    squat1RM: 165,
    deadlift1RM: 205,
    weeklyComplianceRate: 94,
    statusSummary: 'Outstanding Progress',
    trainerFeedback: 'Alex has shown tremendous technical discipline on the eccentric phase of his heavy squats. Upper body lean mass increased by 0.6kg while maintaining waist circumference at 31 inches.',
    nextMilestone: 'Attempting a 130kg paused bench press and crossing 83.5kg solid lean weight by end of November.',
  },
  {
    id: 'rep_02',
    memberId: 'mem_01',
    trainerId: 'tr_marcus',
    trainerName: 'Marcus Vance',
    date: '2026-09-01',
    phase: 'Phase 2: Volume Accumulation & Density',
    weightKg: 81.8,
    bodyFatPct: 13.2,
    muscleMassKg: 41.5,
    benchPress1RM: 120,
    squat1RM: 155,
    deadlift1RM: 195,
    weeklyComplianceRate: 88,
    statusSummary: 'On Track',
    trainerFeedback: 'Consistency improved markedly. Nutrition tracking adherence reached 90%. Rest intervals maintained under 90s on hypertrophy accessory work.',
    nextMilestone: 'Overcoming plateau on the squat sticking point using pin squats and pause reps.',
  },
  {
    id: 'rep_01',
    memberId: 'mem_01',
    trainerId: 'tr_marcus',
    trainerName: 'Marcus Vance',
    date: '2026-08-01',
    phase: 'Phase 1: Biomechanical Baseline & Foundation',
    weightKg: 80.5,
    bodyFatPct: 13.9,
    muscleMassKg: 40.8,
    benchPress1RM: 112.5,
    squat1RM: 145,
    deadlift1RM: 180,
    weeklyComplianceRate: 85,
    statusSummary: 'On Track',
    trainerFeedback: 'Initial postural and pelvic tilt assessment completed. Good scapular mobility. Prescribed rotator cuff strengthening and high-protein baseline meal timing.',
    nextMilestone: 'Establish stable 4-day training split routine and dial in sleep hygiene.',
  }
];

let bookings: BookingSession[] = [
  {
    id: 'bk_101',
    memberId: 'mem_01',
    memberName: 'Alex Hunter',
    trainerId: 'tr_marcus',
    trainerName: 'Marcus Vance',
    sessionType: '1-on-1 Hypertrophy',
    date: '2026-10-06',
    timeSlot: '09:00 AM - 10:00 AM',
    status: 'Confirmed',
    notes: 'Focus on incline dumbbell presses and heavy cable row drop sets.',
    location: 'Main Training Arena - Zone Alpha',
  },
  {
    id: 'bk_102',
    memberId: 'mem_01',
    memberName: 'Alex Hunter',
    trainerId: 'tr_marcus',
    trainerName: 'Marcus Vance',
    sessionType: 'Olympic Form & Power',
    date: '2026-10-09',
    timeSlot: '10:30 AM - 11:30 AM',
    status: 'Confirmed',
    notes: 'Werksan platform lifting session; reviewing bar path on high-hang snatch.',
    location: 'Olympic Weightlifting Deck',
  },
  {
    id: 'bk_103',
    memberId: 'mem_01',
    memberName: 'Alex Hunter',
    trainerId: 'tr_marcus',
    trainerName: 'Marcus Vance',
    sessionType: 'Nutrition Consultation',
    date: '2026-10-14',
    timeSlot: '02:00 PM - 02:45 PM',
    status: 'Confirmed',
    notes: 'Monthly macro adjustment and review of recovery biomarkers.',
    location: 'Private Coaching Suite 2B',
  }
];

let chatMessages: ChatMessage[] = [
  {
    id: 'msg_01',
    sender: 'trainer',
    senderName: 'Marcus Vance',
    text: 'Hey Alex, great intensity on Wednesday! Your squat depth was locked in. How are the adductors feeling today?',
    timestamp: 'Yesterday at 3:15 PM',
    read: true,
  },
  {
    id: 'msg_02',
    sender: 'member',
    senderName: 'Alex Hunter',
    text: 'Feeling strong coach! Minimal soreness thanks to the Normatec recovery session right after. Hit 215g of protein yesterday as well.',
    timestamp: 'Yesterday at 4:20 PM',
    read: true,
  },
  {
    id: 'msg_03',
    sender: 'trainer',
    senderName: 'Marcus Vance',
    text: 'Perfect. For tomorrow morning at 9:00 AM, make sure to drink at least 750ml of water with electrolytes before you arrive. We are testing the Prime Chest Press cam setting 3!',
    timestamp: 'Today at 09:30 AM',
    read: true,
    attachmentType: 'progress_check',
  }
];

let emailNotifications: EmailNotification[] = [
  {
    id: 'em_001',
    recipientEmail: 'alex.hunter@performance.io',
    recipientName: 'Alex Hunter',
    subject: 'Membership Confirmed: Welcome to Mr Fit Gym Black Onyx VIP',
    type: 'membership_welcome',
    dispatchedAt: '2026-01-15 08:30:12',
    status: 'Delivered',
    previewSnippet: 'Your Black Onyx VIP membership is active with 24/7 biometric club access and elite trainer matching...',
    htmlBody: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0d13; color: #f1f5f9; padding: 32px; border-radius: 8px;">
      <h2 style="color: #c2f83d; margin-top: 0;">MR FIT GYM · OFFICIAL MEMBERSHIP CONFIRMATION</h2>
      <p>Dear Alex Hunter,</p>
      <p>Welcome to the highest tier of athletic preparation. Your <strong>Black Onyx VIP Membership</strong> is now active.</p>
      <div style="background: #151822; padding: 20px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>Member ID:</strong> MEM-01-ALEX</p>
        <p style="margin: 4px 0;"><strong>Assigned Head Coach:</strong> Marcus Vance</p>
        <p style="margin: 4px 0;"><strong>Access Tier:</strong> All-Club + Private Recovery Suite</p>
        <p style="margin: 4px 0;"><strong>Monthly Dues:</strong> $189.00 / month</p>
      </div>
      <p>Your biometric access code has been synchronized. We look forward to seeing you on the training floor.</p>
    </div>`
  },
  {
    id: 'em_002',
    recipientEmail: 'alex.hunter@performance.io',
    recipientName: 'Alex Hunter',
    subject: 'Payment Successful: Transaction #MF-2026-9812 ($189.00)',
    type: 'payment_receipt',
    dispatchedAt: '2026-09-15 09:00:44',
    status: 'Delivered',
    previewSnippet: 'Your automated monthly renewal of $189.00 was processed securely via card ending in •••• 4242...',
    htmlBody: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0d13; color: #f1f5f9; padding: 32px; border-radius: 8px;">
      <h2 style="color: #c2f83d; margin-top: 0;">MR FIT GYM · PAYMENT RECEIPT</h2>
      <p>Thank you for your timely payment. Your monthly subscription has been renewed through <strong>November 15, 2026</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #232838;"><td style="padding: 8px 0;">Invoice #</td><td style="text-align: right;">INV-98124</td></tr>
        <tr style="border-bottom: 1px solid #232838;"><td style="padding: 8px 0;">Plan</td><td style="text-align: right;">Black Onyx VIP Membership</td></tr>
        <tr style="border-bottom: 1px solid #232838;"><td style="padding: 8px 0;">Amount Paid</td><td style="text-align: right; color: #c2f83d; font-weight: bold;">$189.00 USD</td></tr>
        <tr><td style="padding: 8px 0;">Payment Method</td><td style="text-align: right;">Mastercard ending in 4242</td></tr>
      </table>
    </div>`
  },
  {
    id: 'em_003',
    recipientEmail: 'alex.hunter@performance.io',
    recipientName: 'Alex Hunter',
    subject: 'Session Confirmed: 1-on-1 Hypertrophy with Coach Marcus Vance',
    type: 'booking_confirmation',
    dispatchedAt: '2026-10-03 14:10:00',
    status: 'Delivered',
    previewSnippet: 'Your upcoming private session is scheduled for Tuesday, Oct 6 at 09:00 AM at Zone Alpha...',
    htmlBody: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0d13; color: #f1f5f9; padding: 32px; border-radius: 8px;">
      <h2 style="color: #c2f83d; margin-top: 0;">SESSION BOOKING CONFIRMATION</h2>
      <p>Your session with <strong>Coach Marcus Vance</strong> is locked into the gym schedule.</p>
      <ul style="line-height: 1.8;">
        <li><strong>Focus:</strong> 1-on-1 Hypertrophy & Biomechanics</li>
        <li><strong>Date:</strong> Tuesday, October 6, 2026</li>
        <li><strong>Time:</strong> 09:00 AM - 10:00 AM</li>
        <li><strong>Location:</strong> Main Arena Zone Alpha</li>
      </ul>
      <p>If you need to reschedule, please provide at least 12 hours notice in your member portal.</p>
    </div>`
  }
];

// Helper to send automated email notification
function triggerAutomatedEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  type: EmailNotification['type'],
  previewSnippet: string,
  htmlBody: string
) {
  const newEmail: EmailNotification = {
    id: `em_${Date.now()}`,
    recipientEmail,
    recipientName,
    subject,
    type,
    dispatchedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'Delivered',
    previewSnippet,
    htmlBody,
  };
  emailNotifications.unshift(newEmail);
  return newEmail;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Mr Fit Gym Enterprise Backend', timestamp: new Date().toISOString() });
  });

  // Member Profile & Subscriptions
  app.get('/api/member/profile', (req, res) => {
    res.json(member);
  });

  app.post('/api/member/profile', (req, res) => {
    const updates = req.body;
    member = { ...member, ...updates };
    res.json({ success: true, member });
  });

  // Subscription management
  app.post('/api/subscription/update', (req, res) => {
    const { tier, autoRenew, status, billingCycle } = req.body;
    if (tier) member.tier = tier;
    if (typeof autoRenew === 'boolean') member.autoRenew = autoRenew;
    if (status) member.status = status;
    if (billingCycle) member.billingCycle = billingCycle;

    // Trigger automated notification
    triggerAutomatedEmail(
      member.email,
      member.name,
      `Membership Plan Updated: ${member.tier} (${member.status})`,
      'plan_update',
      `Your subscription parameters have been modified. Status is now ${member.status} with ${member.tier}...`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <h3 style="color: #c2f83d;">Subscription Status Update</h3>
        <p>Hello ${member.name}, your membership status has been updated to <strong>${member.status}</strong> under the <strong>${member.tier}</strong> plan.</p>
        <p>Auto-renew: <strong>${member.autoRenew ? 'Enabled' : 'Paused'}</strong></p>
      </div>`
    );

    res.json({ success: true, member });
  });

  // Secure Payment Simulation endpoint
  app.post('/api/payments/process', (req, res) => {
    const { cardNumber, cardExp, cardCvv, planTier, billingCycle, amount, memberName, email } = req.body;
    
    // Simulate PCI-DSS safe processing
    const last4 = cardNumber ? String(cardNumber).slice(-4) : '8892';
    const txnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Update member's plan if requested
    if (planTier) {
      member.tier = planTier;
      member.status = 'Active';
      member.renewalDate = '2026-11-20';
    }

    // Auto-generate official payment email notification
    triggerAutomatedEmail(
      email || member.email,
      memberName || member.name,
      `Payment Receipt & Access Pass: #${txnId} ($${amount || 189}.00)`,
      'payment_receipt',
      `Payment processed successfully for ${planTier || member.tier}. Card ending in •••• ${last4}.`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 28px; border-radius: 8px;">
        <h2 style="color: #c2f83d; margin-top: 0;">MR FIT GYM · OFFICIAL PAYMENT CONFIRMATION</h2>
        <p>Hi ${memberName || member.name}, your payment of <strong>$${amount || 189}.00 USD</strong> has been approved.</p>
        <p><strong>Transaction ID:</strong> ${txnId}</p>
        <p><strong>Card:</strong> •••• •••• •••• ${last4}</p>
        <p><strong>Plan:</strong> ${planTier || member.tier} (${billingCycle || 'Monthly'})</p>
        <p>Next billing date: November 20, 2026.</p>
      </div>`
    );

    res.json({
      success: true,
      transactionId: txnId,
      amount: amount || 189,
      currency: 'USD',
      status: 'APPROVED_CAPTURED',
      timestamp: new Date().toISOString(),
      member
    });
  });

  // Equipment Catalog
  app.get('/api/equipment', (req, res) => {
    const { category } = req.query;
    if (category && category !== 'All') {
      return res.json(equipmentCatalog.filter(e => e.category === category));
    }
    res.json(equipmentCatalog);
  });

  // Trainers Roster
  app.get('/api/trainers', (req, res) => {
    res.json(trainers);
  });

  // Nutrition Plans
  app.get('/api/nutrition/plan', (req, res) => {
    res.json(nutritionPlan);
  });

  app.post('/api/nutrition/plan', (req, res) => {
    const updates = req.body;
    nutritionPlan = { ...nutritionPlan, ...updates, updatedAt: new Date().toISOString().slice(0, 10) };

    triggerAutomatedEmail(
      member.email,
      member.name,
      `New Nutrition Plan Deployed by Coach Marcus Vance`,
      'plan_update',
      `Your daily calorie target is now ${nutritionPlan.calorieTarget} kcal with ${nutritionPlan.macros.proteinGrams}g Protein...`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <h3 style="color: #c2f83d;">Updated Nutrition & Macro Architecture</h3>
        <p>Coach Marcus Vance has customized your performance nutrition plan.</p>
        <p>Target: <strong>${nutritionPlan.calorieTarget} kcal</strong> | Protein: <strong>${nutritionPlan.macros.proteinGrams}g</strong> | Carbs: <strong>${nutritionPlan.macros.carbsGrams}g</strong></p>
      </div>`
    );

    res.json({ success: true, nutritionPlan });
  });

  // Progress Reports
  app.get('/api/progress-reports', (req, res) => {
    res.json(progressReports);
  });

  app.post('/api/progress-reports', (req, res) => {
    const newReport: ProgressReport = {
      id: `rep_${Date.now()}`,
      memberId: 'mem_01',
      trainerId: 'tr_marcus',
      trainerName: 'Marcus Vance',
      date: new Date().toISOString().slice(0, 10),
      ...req.body,
    };
    progressReports.unshift(newReport);

    // Update member's current weight and metrics
    if (newReport.weightKg) member.currentWeightKg = newReport.weightKg;
    if (newReport.bodyFatPct) member.bodyFatPct = newReport.bodyFatPct;

    triggerAutomatedEmail(
      member.email,
      member.name,
      `Coach Progress Assessment Published: ${newReport.phase}`,
      'progress_report',
      `Coach Marcus posted your latest strength, compliance, and body composition analytics...`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <h3 style="color: #c2f83d;">New Progress Report Available</h3>
        <p>Your latest physical evaluation has been published. Status: <strong>${newReport.statusSummary}</strong> (${newReport.weeklyComplianceRate}% Compliance).</p>
        <p>Feedback: "${newReport.trainerFeedback}"</p>
      </div>`
    );

    res.json({ success: true, report: newReport });
  });

  // Booking & Scheduling
  app.get('/api/bookings', (req, res) => {
    res.json(bookings);
  });

  app.post('/api/bookings', (req, res) => {
    const { sessionType, date, timeSlot, trainerId, notes } = req.body;
    const selectedTrainer = trainers.find(t => t.id === trainerId) || trainers[0];

    const newBooking: BookingSession = {
      id: `bk_${Date.now()}`,
      memberId: member.id,
      memberName: member.name,
      trainerId: selectedTrainer.id,
      trainerName: selectedTrainer.name,
      sessionType: sessionType || '1-on-1 Hypertrophy',
      date: date || '2026-10-10',
      timeSlot: timeSlot || '10:00 AM - 11:00 AM',
      status: 'Confirmed',
      notes: notes || 'Standard workout slot',
      location: 'Mr Fit Gym Arena - High-Performance Bay',
    };

    bookings.unshift(newBooking);

    triggerAutomatedEmail(
      member.email,
      member.name,
      `Session Scheduled: ${newBooking.sessionType} with ${newBooking.trainerName}`,
      'booking_confirmation',
      `Confirmed for ${newBooking.date} at ${newBooking.timeSlot}. Location: ${newBooking.location}.`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <h3 style="color: #c2f83d;">Training Session Confirmed</h3>
        <p>Your session with <strong>${newBooking.trainerName}</strong> is reserved for <strong>${newBooking.date}</strong> at <strong>${newBooking.timeSlot}</strong>.</p>
        <p>Location: ${newBooking.location}</p>
      </div>`
    );

    res.json({ success: true, booking: newBooking });
  });

  app.delete('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const index = bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      const removed = bookings.splice(index, 1)[0];
      triggerAutomatedEmail(
        member.email,
        member.name,
        `Session Cancelled: ${removed.sessionType} on ${removed.date}`,
        'booking_confirmation',
        `Your training session on ${removed.date} at ${removed.timeSlot} has been cancelled.`,
        `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
          <h3 style="color: #ef4444;">Session Cancellation Notice</h3>
          <p>Your booking for <strong>${removed.sessionType}</strong> on ${removed.date} has been released.</p>
        </div>`
      );
      return res.json({ success: true, message: 'Session cancelled' });
    }
    res.status(404).json({ error: 'Booking not found' });
  });

  // Secure Chat
  app.get('/api/chat/messages', (req, res) => {
    res.json(chatMessages);
  });

  app.post('/api/chat/messages', (req, res) => {
    const { text, sender = 'member', attachmentType } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: sender === 'trainer' ? 'trainer' : 'member',
      senderName: sender === 'trainer' ? 'Marcus Vance (Coach)' : member.name,
      text: text.trim(),
      timestamp: 'Just now',
      read: true,
      attachmentType: attachmentType || undefined,
    };

    chatMessages.push(newMessage);

    // If sent by member, trainer sends an automated contextual reply after short interval simulation if needed
    res.json({ success: true, message: newMessage });
  });

  // Automated Email Notifications Log
  app.get('/api/notifications/emails', (req, res) => {
    res.json(emailNotifications);
  });

  // ADMIN ENDPOINTS
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    // Allow demo admin login with admin@mrfitgym.com / admin123 or pin 1234 or any admin password
    if ((email === 'admin@mrfitgym.com' && password === 'admin123') || password === 'admin' || password === '1234') {
      return res.json({
        success: true,
        token: 'admin-jwt-session-2026',
        adminUser: {
          name: 'Marcus Vance',
          role: 'General Manager & Performance Director',
          email: 'admin@mrfitgym.com',
        },
      });
    }
    return res.status(401).json({ error: 'Invalid admin credentials. Use admin@mrfitgym.com / admin123' });
  });

  app.get('/api/admin/members', (req, res) => {
    res.json(membersList);
  });

  app.post('/api/admin/members', (req, res) => {
    const newMember: MemberProfile = {
      id: `mem_${Date.now()}`,
      joinedDate: new Date().toISOString().slice(0, 10),
      renewalDate: '2026-11-20',
      autoRenew: true,
      billingCycle: 'Monthly',
      status: 'Active',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      assignedTrainerId: 'tr_marcus',
      currentWeightKg: 75.0,
      targetWeightKg: 75.0,
      bodyFatPct: 14.0,
      fitnessGoal: 'General Athletic Optimization',
      ...req.body,
    };
    membersList.unshift(newMember);

    triggerAutomatedEmail(
      newMember.email,
      newMember.name,
      `Welcome to Mr Fit Gym: Staff Enrolled (${newMember.tier})`,
      'membership_welcome',
      `Your account has been configured by management. Biometric access pass ready...`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <h3 style="color: #c2f83d;">Mr Fit Gym Membership Enrolled</h3>
        <p>Welcome, ${newMember.name}. You have been assigned tier <strong>${newMember.tier}</strong>.</p>
        <p>Access is active immediately at 480 Ironworks Way.</p>
      </div>`
    );

    res.json({ success: true, member: newMember });
  });

  app.post('/api/admin/members/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const m = membersList.find(x => x.id === id);
    if (!m) return res.status(404).json({ error: 'Member not found' });
    m.status = status;
    if (m.id === member.id) member.status = status;

    triggerAutomatedEmail(
      m.email,
      m.name,
      `Membership Account Status Updated: ${status}`,
      'plan_update',
      `Your account status has been set to ${status} by Mr Fit Gym administration.`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <p>Dear ${m.name}, your membership account status is now <strong>${status}</strong>.</p>
      </div>`
    );

    res.json({ success: true, member: m });
  });

  app.post('/api/admin/members/:id/tier', (req, res) => {
    const { id } = req.params;
    const { tier } = req.body;
    const m = membersList.find(x => x.id === id);
    if (!m) return res.status(404).json({ error: 'Member not found' });
    m.tier = tier;
    if (m.id === member.id) member.tier = tier;

    triggerAutomatedEmail(
      m.email,
      m.name,
      `Membership Tier Adjusted by Admin: ${tier}`,
      'plan_update',
      `Your membership tier has been updated to ${tier}. All corresponding privileges are active.`,
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <p>Dear ${m.name}, your tier has been upgraded/adjusted to <strong>${tier}</strong>.</p>
      </div>`
    );

    res.json({ success: true, member: m });
  });

  app.delete('/api/admin/members/:id', (req, res) => {
    const { id } = req.params;
    const idx = membersList.findIndex(x => x.id === id);
    if (idx !== -1) {
      const removed = membersList.splice(idx, 1)[0];
      return res.json({ success: true, removed });
    }
    res.status(404).json({ error: 'Member not found' });
  });

  app.post('/api/admin/equipment/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const eq = equipmentCatalog.find(e => e.id === id);
    if (!eq) return res.status(404).json({ error: 'Equipment not found' });
    eq.status = status;
    res.json({ success: true, equipment: eq });
  });

  app.post('/api/admin/notifications/broadcast', (req, res) => {
    const { recipientEmail, recipientName, subject, message } = req.body;
    const sent = triggerAutomatedEmail(
      recipientEmail || 'alex.hunter@performance.io',
      recipientName || 'Alex Hunter',
      subject || 'Notice from Mr Fit Gym Administration',
      'plan_update',
      message || 'Official operational announcement from gym leadership...',
      `<div style="font-family: Arial, sans-serif; background: #0b0d13; color: #f1f5f9; padding: 24px; border-radius: 6px;">
        <h3 style="color: #c2f83d;">Mr Fit Gym Management Communication</h3>
        <p>${message || 'Official update regarding your membership account and facility access.'}</p>
      </div>`
    );
    res.json({ success: true, email: sent });
  });

  // Mount Vite or Serve Static Files
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Mr Fit Gym] Full-stack Server listening on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
