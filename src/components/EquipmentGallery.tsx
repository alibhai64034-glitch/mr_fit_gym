import React, { useState } from 'react';
import { Dumbbell, Info, CheckCircle2, ChevronRight, X, Sparkles, Filter } from 'lucide-react';
import { EquipmentItem } from '../types';

interface EquipmentGalleryProps {
  equipment: EquipmentItem[];
  onBookWithEquipment?: (equipmentName: string) => void;
}

const CATEGORIES = [
  'All',
  'Biomechanical Strength',
  'Olympic & Free Weights',
  'Cardio Conditioning',
  'Recovery & Mobility',
] as const;

export const EquipmentGallery: React.FC<EquipmentGalleryProps> = ({
  equipment,
  onBookWithEquipment,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItemModal, setActiveItemModal] = useState<EquipmentItem | null>(null);

  const filteredEquipment = equipment.filter((item) =>
    selectedCategory === 'All' ? true : item.category === selectedCategory
  );

  return (
    <section id="equipment" className="py-20 bg-[#0a0b0f] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c2f83d] mb-2">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Engineered Hardware Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              GALLERY OF TRAINING EQUIPMENT
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Every apparatus in Mr Fit Gym is curated for biomechanical resistance curve precision,
              joint integrity, and maximal muscular recruitment.
            </p>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-1.5 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl self-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#c2f83d] text-black shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              className="group bg-[#11131b] border border-white/[0.08] hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Image Frame with Fallback */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#181c26]">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-zinc-900 text-slate-400 p-6 text-center">
                          <svg class="w-12 h-12 text-[#c2f83d] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                          <span class="text-xs font-mono uppercase tracking-wider text-slate-300">${item.brand}</span>
                          <span class="text-sm font-bold text-white mt-1">${item.name}</span>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11131b] via-transparent to-transparent opacity-80" />

                {/* Status Indicator (Pairing text + color) */}
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-[#c2f83d] border border-[#c2f83d]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c2f83d] animate-pulse" />
                  <span>{item.status}</span>
                </div>

                <div className="absolute bottom-3 left-3 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                  {item.brand}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#c2f83d] mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug mb-2 font-display">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {item.specs}
                  </p>

                  {/* Target Muscles: Clean unboxed metadata with separators (Rule 1.A) */}
                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-300 mb-4 bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.04]">
                    <span className="text-slate-400 font-medium">Target:</span>
                    {item.targetMuscles.map((muscle, idx) => (
                      <React.Fragment key={muscle}>
                        <span className="text-white font-medium">{muscle}</span>
                        {idx < item.targetMuscles.length - 1 && (
                          <span aria-hidden="true" className="text-slate-600">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <button
                    onClick={() => setActiveItemModal(item)}
                    className="text-xs font-semibold text-[#c2f83d] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Biomechanics & Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {onBookWithEquipment && (
                    <button
                      onClick={() => onBookWithEquipment(item.name)}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white/[0.08] hover:bg-white/[0.15] text-white rounded transition-colors cursor-pointer"
                    >
                      Book With Coach
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for In-depth Equipment Details */}
        {activeItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#12151f] border border-white/10 rounded-2xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl">
              <button
                onClick={() => setActiveItemModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-[#c2f83d] mb-1">
                <span>{activeItemModal.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeItemModal.brand}</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display mb-4">
                {activeItemModal.name}
              </h3>

              <div className="aspect-16/9 rounded-xl overflow-hidden mb-6 bg-slate-900 border border-white/10">
                <img
                  src={activeItemModal.image}
                  alt={activeItemModal.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Mechanical Specifications
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-white/[0.03] p-3 rounded-lg border border-white/[0.05]">
                    {activeItemModal.specs}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-[#c2f83d] uppercase tracking-wider mb-1">
                    Trainer Coaching & Resistance Curve Guide
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-[#c2f83d]/[0.03] p-3 rounded-lg border border-[#c2f83d]/10">
                    {activeItemModal.guide}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-200 uppercase tracking-wider mb-1">
                    Primary Muscular Kinetic Chains
                  </h4>
                  <div className="flex flex-wrap gap-2 text-slate-300">
                    {activeItemModal.targetMuscles.map((m) => (
                      <span key={m} className="px-2.5 py-1 bg-white/[0.06] rounded-md font-medium">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => {
                    const itemName = activeItemModal.name;
                    setActiveItemModal(null);
                    if (onBookWithEquipment) onBookWithEquipment(itemName);
                  }}
                  className="px-5 py-2.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Schedule Guided Session
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
