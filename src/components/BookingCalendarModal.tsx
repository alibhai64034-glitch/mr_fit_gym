import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, CheckCircle2, MapPin, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { Trainer, BookingSession } from '../types';
import { api } from '../api/client';

interface BookingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainers: Trainer[];
  defaultTrainerId?: string;
  defaultSessionType?: BookingSession['sessionType'];
  onBookingSuccess: (booking: BookingSession) => void;
  onOpenNotifications: () => void;
}

const SESSION_TYPES: BookingSession['sessionType'][] = [
  '1-on-1 Hypertrophy',
  'Olympic Form & Power',
  'Metabolic Conditioning',
  'Biomechanical Assessment',
  'Nutrition Consultation',
];

const TIME_SLOTS = [
  '07:30 AM - 08:30 AM',
  '09:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '01:00 PM - 02:00 PM',
  '03:30 PM - 04:30 PM',
  '05:00 PM - 06:00 PM',
  '06:30 PM - 07:30 PM',
];

export const BookingCalendarModal: React.FC<BookingCalendarModalProps> = ({
  isOpen,
  onClose,
  trainers,
  defaultTrainerId,
  defaultSessionType,
  onBookingSuccess,
  onOpenNotifications,
}) => {
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(
    defaultTrainerId || (trainers[0]?.id ?? 'tr_marcus')
  );
  const [selectedSessionType, setSelectedSessionType] = useState<BookingSession['sessionType']>(
    defaultSessionType || '1-on-1 Hypertrophy'
  );
  // Generate next 14 dates for visual calendar
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push({
        iso: d.toISOString().split('T')[0],
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  };

  const availableDates = generateDates();
  const [selectedDate, setSelectedDate] = useState<string>(availableDates[0]?.iso || '2026-10-06');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[1]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingSession | null>(null);

  if (!isOpen) return null;

  const currentTrainer = trainers.find((t) => t.id === selectedTrainerId) || trainers[0];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await api.createBooking({
        sessionType: selectedSessionType,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        trainerId: selectedTrainerId,
        notes: notes || undefined,
      });

      if (res.success) {
        setConfirmedBooking(res.booking);
        onBookingSuccess(res.booking);
      }
    } catch (err) {
      console.error('Booking creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#10131d] border border-white/10 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={() => {
            setConfirmedBooking(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* SUCCESS STATE */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-[#c2f83d]/15 text-[#c2f83d] rounded-full flex items-center justify-center mx-auto border border-[#c2f83d]/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#c2f83d]">
                Calendar Sync · Session Locked
              </span>
              <h3 className="text-2xl font-bold text-white font-display mt-1">
                Training Session Confirmed
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Your private assessment with <strong className="text-white">{confirmedBooking.trainerName}</strong> is reserved.
              </p>
            </div>

            <div className="bg-black/40 border border-white/[0.08] rounded-xl p-5 text-xs space-y-3 text-left">
              <div className="flex justify-between items-center text-slate-400">
                <span>Discipline:</span>
                <span className="font-semibold text-white">{confirmedBooking.sessionType}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Date & Time:</span>
                <span className="font-mono text-[#c2f83d] font-bold">
                  {confirmedBooking.date} ({confirmedBooking.timeSlot})
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Location:</span>
                <span className="text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c2f83d]" />
                  <span>{confirmedBooking.location}</span>
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#c2f83d]/[0.06] border border-[#c2f83d]/20 rounded-lg text-xs text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#c2f83d] shrink-0" />
              <span>An automated session confirmation email has been logged to your account.</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  onClose();
                  onOpenNotifications();
                }}
                className="flex-1 py-3 px-4 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Mail className="w-4 h-4" />
                <span>View Confirmation Email</span>
              </button>
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  onClose();
                }}
                className="py-3 px-5 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleBooking} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#c2f83d] uppercase tracking-wider mb-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Private Coaching Schedule</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-display">
                Book a Training Session
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Lock in your training slot with one of our certified master trainers.
              </p>
            </div>

            {/* 1. Select Trainer */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Master Trainer
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {trainers.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setSelectedTrainerId(t.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      selectedTrainerId === t.id
                        ? 'bg-[#c2f83d]/10 border-[#c2f83d] shadow-sm'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{t.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.title}</div>
                      <div className="text-[10px] text-[#c2f83d] font-mono mt-0.5">${t.hourlyRate}/hr</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Select Session Focus */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Session Focus / Modality
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SESSION_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setSelectedSessionType(type)}
                    className={`p-2.5 text-xs text-left font-medium rounded-lg border transition-all cursor-pointer ${
                      selectedSessionType === type
                        ? 'bg-[#c2f83d] text-black border-[#c2f83d] font-bold'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Interactive Date Strip */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                3. Choose Date (Next 14 Days)
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableDates.map((item) => (
                  <button
                    type="button"
                    key={item.iso}
                    onClick={() => setSelectedDate(item.iso)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border min-w-16 transition-all shrink-0 cursor-pointer ${
                      selectedDate === item.iso
                        ? 'bg-[#c2f83d] text-black border-[#c2f83d] font-bold shadow-md'
                        : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-mono">{item.dayName}</span>
                    <span className="text-base font-bold font-mono my-0.5">{item.dayNum}</span>
                    <span className="text-[10px]">{item.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Choose Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                4. Select Available Time Window
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`p-2 text-xs font-mono text-center rounded-lg border transition-all cursor-pointer ${
                      selectedTimeSlot === slot
                        ? 'bg-[#c2f83d] text-black border-[#c2f83d] font-bold'
                        : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:bg-white/[0.06]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Custom Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Special Objective or Equipment Request (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Squat bar path analysis on Werksan drop platform, rotator cuff prep"
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#c2f83d] transition-colors"
              />
            </div>

            {/* Confirm CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#c2f83d] hover:bg-[#b0e830] text-black font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c2f83d]/20 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>Scheduling Session...</span>
              ) : (
                <>
                  <CalendarIcon className="w-4 h-4" />
                  <span>Lock in Session with {currentTrainer?.name}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
