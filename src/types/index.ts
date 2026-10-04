export interface MemberProfile {
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

export interface EquipmentItem {
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

export interface Trainer {
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

export interface BookingSession {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  sessionType: '1-on-1 Hypertrophy' | 'Olympic Form & Power' | 'Metabolic Conditioning' | 'Biomechanical Assessment' | 'Nutrition Consultation';
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled';
  notes?: string;
  location: string;
}

export interface MealItem {
  mealNumber: number;
  name: string;
  timing: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionPlan {
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
  meals: MealItem[];
  trainerNotes: string;
}

export interface ProgressReport {
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
  weeklyComplianceRate: number;
  statusSummary: 'Outstanding Progress' | 'On Track' | 'Adjustment Required';
  trainerFeedback: string;
  nextMilestone: string;
}

export interface ChatMessage {
  id: string;
  sender: 'member' | 'trainer';
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
  attachmentType?: 'nutrition_log' | 'progress_check' | 'schedule_update';
}

export interface EmailNotification {
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
