import React, { useState } from 'react';
import { Check, Shield, Zap, Sparkles, Star } from 'lucide-react';
import { MemberProfile } from '../types';

interface MembershipPlansProps {
  currentTier?: MemberProfile['tier'];
  onSelectPlan: (tier: MemberProfile['tier'], billingCycle: 'Monthly' | 'Annual', price: number) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({
  currentTier = 'Black Onyx VIP',
  onSelectPlan,
}) => {
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>('Monthly');

  const plans = [
    {
      name: 'Standard Core' as MemberProfile['tier'],
      subtitle: 'For independent lifters seeking world-class hardware and open floor access',
      priceMonthly: 99,
      priceAnnual: 79,
      popular: false,
      features: [
        'Full 24/7 biometric keyless access',
        'Unlimited Olympic platforms & Eleiko cable rigs',
        'Locker room, dry Finnish sauna & steam suite',
        'Standard mobile member dashboard & habit log',
        'Quarterly baseline body composition scan',
      ],
      ctaText: 'Join Standard Core',
    },
    {
      name: 'Black Onyx VIP' as MemberProfile['tier'],
      subtitle: 'For committed athletes requiring dedicated coach pairing and dialed nutrition',
      priceMonthly: 189,
      priceAnnual: 149,
      popular: true,
      features: [
        'Everything in Standard Core',
        'Assigned Head Coach with monthly 1-on-1 progress reports',
        'Bespoke ISSN Nutrition Plan with macro timing',
        'Direct secure chat with coach via member portal',
        'Hyperice Normatec compression & cryo lounge (3x/mo)',
        'Priority booking window (14 days advance)',
      ],
      ctaText: 'Claim Black Onyx VIP',
    },
    {
      name: 'Executive Performance' as MemberProfile['tier'],
      subtitle: 'All-inclusive athletic concierge for executives and competitive athletes',
      priceMonthly: 299,
      priceAnnual: 239,
      popular: false,
      features: [
        'Everything in Black Onyx VIP',
        'Weekly 1-on-1 private coaching sessions included (4x/mo)',
        'Bi-weekly InBody 770 composition & ultrasound muscle scans',
        'Full laundry, reserved permanent locker & towel valet',
        'Unlimited Hyperice recovery suite access',
        'Unlimited guest passes (up to 4 per month)',
      ],
      ctaText: 'Apply for Executive',
    },
  ];

  return (
    <section id="memberships" className="py-20 bg-[#090a0f] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#c2f83d] mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Transparent Subscription Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display mb-4">
            MEMBERSHIP TIERS & PRIVILEGES
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            No long-term lock-ins or hidden cancellation fees. Upgrade, downgrade, or pause your membership anytime
            with instant automated email notification receipts.
          </p>

          {/* Billing Cycle Selector (Clean segmented control) */}
          <div className="mt-8 inline-flex items-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            <button
              onClick={() => setBillingCycle('Monthly')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                billingCycle === 'Monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('Annual')}
              className={`px-5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'Annual'
                  ? 'bg-[#c2f83d] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] font-mono uppercase bg-black/15 px-1.5 py-0.5 rounded font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const price = billingCycle === 'Monthly' ? plan.priceMonthly : plan.priceAnnual;
            const isCurrent = currentTier === plan.name;

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-[#121622] border-2 border-[#c2f83d]/60 shadow-xl shadow-[#c2f83d]/5 lg:-translate-y-2'
                    : 'bg-[#10121a] border border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c2f83d] text-black font-extrabold text-[11px] uppercase tracking-wider px-3 py-0.5 rounded-full font-mono shadow-sm">
                    Most Selected by Athletes
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white font-display">
                      {plan.name}
                    </h3>
                    {isCurrent && (
                      <span className="text-[11px] font-mono text-[#c2f83d] bg-[#c2f83d]/10 px-2 py-0.5 rounded">
                        Current Tier
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 min-h-10 leading-relaxed">
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mt-6 mb-6 pb-6 border-b border-white/[0.06]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-white font-mono tabular-nums">
                        ${price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / month
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      {billingCycle === 'Annual' ? 'Billed annually ($' + (price * 12) + '/yr)' : 'Billed monthly · Cancel anytime'}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Tier Inclusions:
                    </div>
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-[#c2f83d] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA */}
                <div>
                  <button
                    onClick={() => onSelectPlan(plan.name, billingCycle, price)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      plan.popular
                        ? 'bg-[#c2f83d] hover:bg-[#b0e830] text-black shadow-md shadow-[#c2f83d]/20'
                        : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10'
                    }`}
                  >
                    {isCurrent ? 'Manage Subscription' : plan.ctaText}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">
                    Instant automated email receipt & 256-bit SSL secured
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
