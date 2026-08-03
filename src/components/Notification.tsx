/* ========================================
   Toast Notification Component
   Desktop: slides in from right
   Mobile: slides down from top center
   ======================================== */

import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import type { Notification as NotificationType } from '../types';

interface Props {
  notifications: NotificationType[];
}

function getNotificationStyle(type: NotificationType['type']) {
  switch (type) {
    case 'success':
      return { icon: <CheckCircle size={18} />, bg: 'bg-emerald-500', border: 'border-emerald-400' };
    case 'error':
      return { icon: <XCircle size={18} />, bg: 'bg-red-500', border: 'border-red-400' };
    case 'warning':
      return { icon: <AlertTriangle size={18} />, bg: 'bg-amber-500', border: 'border-amber-400' };
    case 'info':
    default:
      return { icon: <Info size={18} />, bg: 'bg-blue-500', border: 'border-blue-400' };
  }
}

export default function NotificationContainer({ notifications }: Props) {
  return (
    <>
      {/* Desktop: top-right */}
      <div
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
          maxWidth: '380px',
        }}
        className="hidden md:flex"
      >
        {notifications.map((n) => {
          const s = getNotificationStyle(n.type);
          return (
            <div
              key={n.id}
              style={{ animation: 'notificationSlide 3s ease-in-out forwards', pointerEvents: 'auto' }}
              className={`${s.bg} text-white px-4 py-3 rounded-xl shadow-lg border ${s.border} flex items-center gap-2.5`}
            >
              {s.icon}
              <span style={{ fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.3 }}>{n.message}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile: top-center */}
      <div
        style={{
          position: 'fixed',
          top: '0.75rem',
          left: '0.75rem',
          right: '0.75rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
        className="md:hidden"
      >
        {notifications.map((n) => {
          const s = getNotificationStyle(n.type);
          return (
            <div
              key={n.id}
              style={{ animation: 'notificationSlideMobile 3s ease-in-out forwards', pointerEvents: 'auto' }}
              className={`${s.bg} text-white px-4 py-2.5 rounded-xl shadow-lg border ${s.border} flex items-center gap-2.5`}
            >
              {s.icon}
              <span style={{ fontSize: '0.82rem', fontWeight: 500, lineHeight: 1.3, flex: 1 }}>{n.message}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
