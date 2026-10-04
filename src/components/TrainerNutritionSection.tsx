import React, { useState } from 'react';
import { Award, Zap, Flame, Utensils, Droplet, Clock, Check, ChevronRight, Activity, Calendar } from 'lucide-react';
import { Trainer, NutritionPlan } from '../types';

interface TrainerNutritionSectionProps {
  trainers: Trainer[];
  nutritionPlan: NutritionPlan;
  onBookTrainer: (trainerId: string) => void;
  onOpenDashboardNutrition: () => void;
}

export const TrainerNutritionSection: React.FC<TrainerNutritionSectionProps> = ({
  trainers,
  nutritionPlan,
  onBookTrainer,
  onOpenDashboardNutrition,
}) => {
  // Interactive Coach Macro Calculator
  const [calcWeight, setCalcWeight] = useState<number>(82);
  const [calcGoal, setCalcGoal] = useState<'hypertrophy' | 'fat_loss' | 'power'>('hypertrophy');

  // Dynamic calculation based on athletic formulas
  const calculateMacros = () => {
    let multiplier = 36; // kcal per kg
    let proteinMultiplier = 2.4; // g per kg
    let fatMultiplier = 0.9;

    if (calcGoal === 'fat_loss') {
      multiplier = 28;
      proteinMultiplier = 2.6;
      fatMultiplier = 0.7;
    } else if (calcGoal === 'power') {
      multiplier = 40;
      proteinMultiplier = 2.2;
      fatMultiplier = 1.0;
    }

    const totalKcal = Math.round(calcWeight * multiplier);
    const proteinGrams = Math.round(calcWeight * proteinMultiplier);
    const fatGrams = Math.round(calcWeight * fatMultiplier);
    const remainingKcal = totalKcal - (proteinGrams * 4 + fatGrams * 9);
    const carbsGrams = Math.max(50, Math.round(remainingKcal / 4));

    return { totalKcal, proteinGrams, carbsGrams, fatGrams };
  };

  const calculated = calculateMacros();

  return (
    <div className="space-y-24 py-20 bg-[#08090c]">
      {/* 1. PERSONAL TRAINERS ROSTER */}
      <section id="trainers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c2f83d] mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Master Conditioning Faculty</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            ELITE PERSONAL COACHES & BIOMECHANISTS
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every coach at Mr Fit Gym holds accredited certifications (CSCS, ISSN, EXOS) with proven track
            records in transforming athlete kinematics, body composition, and neuromuscular power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((coach) => (
            <div
              key={coach.id}
              className="bg-[#11131b] border border-white/[0.08] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                {/* Coach Portrait */}
                <div className="relative aspect-square overflow-hidden bg-slate-800">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#11131b] via-[#11131b]/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-display leading-tight">
                        {coach.name}
                      </h3>
                      <div className="text-xs font-medium text-[#c2f83d] mt-0.5">
                        {coach.title}
                      </div>
                    </div>
                    <div className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-right border border-white/10">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">Rate</div>
                      <div className="text-xs font-bold text-white font-mono tabular-nums">
                        ${coach.hourlyRate}/hr
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coach Body */}
                <div className="p-6 space-y-4">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
                    <Award className="w-3.5 h-3.5 text-[#c2f83d]" />
                    <span className="truncate">{coach.certification}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {coach.bio}
                  </p>

                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Core Disciplines
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {coach.specialty.map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-[11px] bg-white/[0.05] text-slate-200 rounded font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  {coach.experienceYears} Years Track
                </span>
                <button
                  onClick={() => onBookTrainer(coach.id)}
                  className="px-4 py-2 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book with {coach.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. NUTRITION PLAN FEATURES FOR PERSONAL TRAINERS */}
      <section id="nutrition" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.06] pt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c2f83d] mb-2">
              <Utensils className="w-3.5 h-3.5" />
              <span>Bioenergetic Fueling Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              NUTRITION PLAN ENGINE FOR PERSONAL TRAINERS
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">
              Training stimulates adaptations; structured nutrition builds them. Our trainers design tailored
              macronutrient splits, peri-workout timing regimens, and hydration guidelines synced directly to your progress.
            </p>
          </div>

          <button
            onClick={onOpenDashboardNutrition}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 self-start cursor-pointer"
          >
            <span>Open Member Nutrition Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#c2f83d]" />
          </button>
        </div>

        {/* 2-Column Grid: Featured Plan Showcase + Interactive Coach Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Current Active Protocol Showcase (7 cols) */}
          <div className="lg:col-span-7 bg-[#11131b] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-[#c2f83d]">
                  Active Protocol · Assigned by Coach Marcus Vance
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-0.5">
                  {nutritionPlan.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  {nutritionPlan.calorieTarget}
                </span>
                <span className="text-xs text-slate-400 ml-1">KCAL / DAY</span>
              </div>
            </div>

            {/* Meal Prep Visual Media */}
            <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-white/[0.06]">
              <img
                src="/src/assets/images/nutrition_athlete_meal_1791141213906.jpg"
                alt="Athletic Performance Nutrition"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-xs text-slate-200 font-mono">
                Meal 2: Wild Salmon, Quinoa & Sweet Potato (780 kcal · 52g P)
              </div>
            </div>

            {/* Macro Ratio Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] font-medium text-slate-400 uppercase">Protein (High-BV)</div>
                <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                  {nutritionPlan.macros.proteinGrams}g
                </div>
                <div className="text-[11px] text-[#c2f83d] font-mono mt-0.5">
                  {Math.round((nutritionPlan.macros.proteinGrams * 4 / nutritionPlan.calorieTarget) * 100)}% of intake
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] font-medium text-slate-400 uppercase">Complex Carbs</div>
                <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                  {nutritionPlan.macros.carbsGrams}g
                </div>
                <div className="text-[11px] text-amber-400 font-mono mt-0.5">
                  {Math.round((nutritionPlan.macros.carbsGrams * 4 / nutritionPlan.calorieTarget) * 100)}% of intake
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[11px] font-medium text-slate-400 uppercase">Essential Fats</div>
                <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                  {nutritionPlan.macros.fatGrams}g
                </div>
                <div className="text-[11px] text-blue-400 font-mono mt-0.5">
                  {Math.round((nutritionPlan.macros.fatGrams * 9 / nutritionPlan.calorieTarget) * 100)}% of intake
                </div>
              </div>
            </div>

            {/* Daily Meals Schedule */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Daily Nutrient Timing Sequence
              </h4>
              {nutritionPlan.meals.map((m) => (
                <div
                  key={m.mealNumber}
                  className="flex items-start justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-xs hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded bg-[#c2f83d]/10 text-[#c2f83d] font-mono font-bold flex items-center justify-center shrink-0">
                      {m.mealNumber}
                    </span>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{m.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">· {m.timing}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] mt-0.5">{m.description}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3 font-mono text-[11px] text-slate-300">
                    <div className="text-white font-bold">{m.calories} kcal</div>
                    <div className="text-[#c2f83d]">{m.protein}g P · {m.carbs}g C</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coach Clinical Advice */}
            <div className="p-3.5 rounded-lg bg-[#c2f83d]/[0.04] border border-[#c2f83d]/20 text-xs">
              <div className="font-semibold text-[#c2f83d] mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Coach Vance Clinical Note</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {nutritionPlan.trainerNotes}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Coach Nutrition Calculator Tool (5 cols) */}
          <div className="lg:col-span-5 bg-[#12151f] border border-white/[0.08] rounded-2xl p-6 sm:p-7 space-y-6">
            <div>
              <div className="text-[11px] font-mono text-[#c2f83d] uppercase tracking-wider">
                Trainer Tools
              </div>
              <h3 className="text-xl font-bold text-white font-display mt-0.5">
                Interactive Athlete Macro Calculator
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Simulate athletic energy expenditure and baseline macro allocations for your personal training clients.
              </p>
            </div>

            {/* Athlete Weight Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium">Athlete Body Mass:</span>
                <span className="text-white font-bold font-mono text-sm tabular-nums">
                  {calcWeight} kg / {Math.round(calcWeight * 2.20462)} lbs
                </span>
              </div>
              <input
                type="range"
                min="55"
                max="135"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Number(e.target.value))}
                className="w-full accent-[#c2f83d] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Objective Selector */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-medium">Training Phase Objective:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setCalcGoal('hypertrophy')}
                  className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    calcGoal === 'hypertrophy'
                      ? 'bg-[#c2f83d] text-black border-[#c2f83d]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  Hypertrophy
                </button>
                <button
                  onClick={() => setCalcGoal('fat_loss')}
                  className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    calcGoal === 'fat_loss'
                      ? 'bg-[#c2f83d] text-black border-[#c2f83d]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  Fat Loss Cut
                </button>
                <button
                  onClick={() => setCalcGoal('power')}
                  className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    calcGoal === 'power'
                      ? 'bg-[#c2f83d] text-black border-[#c2f83d]'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                  }`}
                >
                  Strength Peak
                </button>
              </div>
            </div>

            {/* Calculated Blueprint Output */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Calculated Baseline</span>
                <span className="text-xs text-[#c2f83d] font-bold">Recommended</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {calculated.totalKcal}{' '}
                <span className="text-sm text-slate-400 font-normal">kcal/day</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Target Protein:</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {calculated.proteinGrams}g ({(calculated.proteinGrams / calcWeight).toFixed(1)}g/kg)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Fueling Carbohydrates:</span>
                  <span className="font-mono font-bold text-amber-300 tabular-nums">
                    {calculated.carbsGrams}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Essential Lipids:</span>
                  <span className="font-mono font-bold text-blue-300 tabular-nums">
                    {calculated.fatGrams}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Recommended Hydration:</span>
                  <span className="font-mono font-bold text-[#c2f83d] tabular-nums">
                    {(calcWeight * 0.045).toFixed(1)} Liters / Day
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenDashboardNutrition}
              className="w-full py-3 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Utensils className="w-4 h-4" />
              <span>Apply to Member Nutrition Dashboard</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
