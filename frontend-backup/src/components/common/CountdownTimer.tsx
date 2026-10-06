import React, { useState, useEffect } from 'react';
import { Clock, Flame, CalendarClock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  type?: 'opens_at' | 'closes_at';
  onExpire?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  type = 'closes_at',
  onExpire,
}) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    return {
      hours: Math.floor((difference / (1000 * 60 * 60))),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);
      if (updated.isExpired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-500 text-xs font-medium">
        <Clock className="w-3.5 h-3.5" />
        <span>Window Closed</span>
      </div>
    );
  }

  const isScheduled = type === 'opens_at';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border backdrop-blur-md text-xs font-mono font-semibold ${
        isScheduled
          ? 'bg-[#dfe5f3] border-[#557373]/30 text-[#272401]'
          : 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse-slow'
      }`}
    >
      {isScheduled ? (
        <CalendarClock className="w-3.5 h-3.5 text-[#557373]" />
      ) : (
        <Flame className="w-3.5 h-3.5 text-rose-600" />
      )}
      <span className="text-[11px] uppercase tracking-wider font-sans opacity-80">
        {isScheduled ? 'Bidding Opens In:' : 'Closes In:'}
      </span>
      <span className="tabular-nums font-bold">
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
