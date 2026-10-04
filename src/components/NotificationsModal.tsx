import React, { useState } from 'react';
import { X, Mail, CheckCircle2, Clock, Calendar, ArrowRight, Shield, Award, AlertCircle } from 'lucide-react';
import { EmailNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: EmailNotification[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(
    notifications[0] || null
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#10131e] border border-white/10 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col relative shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#0c0e17]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c2f83d]/10 text-[#c2f83d] flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Automated Transactional Email Dispatcher
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                System-triggered audit log · All membership & session notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2-column split (Email List & HTML Email Preview) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Email Inbox List (5 cols) */}
          <div className="md:col-span-5 border-r border-white/[0.08] overflow-y-auto divide-y divide-white/[0.04] bg-[#0d0f17]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No notifications logged yet.
              </div>
            ) : (
              notifications.map((item) => {
                const isSelected = selectedEmail?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEmail(item)}
                    className={`w-full p-4 text-left transition-colors flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-[#c2f83d]/10 border-l-2 border-[#c2f83d]'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#c2f83d] uppercase font-bold truncate max-w-[140px]">
                        {item.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-500">{item.dispatchedAt.slice(5, 16)}</span>
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-1">
                      {item.subject}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2">
                      {item.previewSnippet}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1">
                      <CheckCircle2 className="w-3 h-3 text-[#c2f83d]" />
                      <span>{item.status} to {item.recipientEmail}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Rendered HTML Email Preview (7 cols) */}
          <div className="md:col-span-7 bg-[#08090d] overflow-y-auto p-6 flex flex-col">
            {selectedEmail ? (
              <div className="space-y-4">
                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>To:</span>
                    <span className="text-white font-mono">{selectedEmail.recipientName} &lt;{selectedEmail.recipientEmail}&gt;</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Subject:</span>
                    <span className="text-white font-semibold">{selectedEmail.subject}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Dispatched:</span>
                    <span className="text-slate-300 font-mono">{selectedEmail.dispatchedAt} UTC</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Delivery Status:</span>
                    <span className="text-[#c2f83d] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectedEmail.status} (TLS Encrypted SMTP)</span>
                    </span>
                  </div>
                </div>

                {/* Actual HTML Email Rendering Frame */}
                <div
                  className="bg-[#0b0d13] border border-white/10 rounded-xl p-6 text-sm text-slate-200"
                  dangerouslySetInnerHTML={{ __html: selectedEmail.htmlBody }}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Select an automated email to preview the client template.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
