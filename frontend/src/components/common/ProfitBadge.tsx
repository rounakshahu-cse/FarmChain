import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2, DollarSign, ShieldCheck } from 'lucide-react';

interface ProfitBadgeProps {
  bidPrice: number;
  costOfProduction: number;
  quantity?: number;
  benchmarkPrice?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ProfitBadge: React.FC<ProfitBadgeProps> = ({
  bidPrice,
  costOfProduction,
  quantity = 1,
  size = 'md',
}) => {
  const marginPct =
    costOfProduction > 0
      ? ((bidPrice - costOfProduction) / costOfProduction) * 100
      : 0;

  const netProfit = (bidPrice - costOfProduction) * quantity;
  const isProfitable = bidPrice >= costOfProduction;

  let colorClasses = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-emerald-950/30';
  let badgeText = 'Profitable Deal';
  let Icon = CheckCircle2;

  if (marginPct >= 25) {
    colorClasses = 'bg-emerald-900/60 text-emerald-200 border-emerald-400/60 shadow-lg shadow-emerald-950/50';
    badgeText = 'Super-Profitable Deal';
    Icon = TrendingUp;
  } else if (marginPct >= 10) {
    colorClasses = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
    badgeText = 'Healthy Profit Margin';
    Icon = CheckCircle2;
  } else if (marginPct >= 0) {
    colorClasses = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    badgeText = 'Break-Even / Marginal';
    Icon = AlertTriangle;
  } else {
    colorClasses = 'bg-rose-950/60 text-rose-300 border-rose-500/40';
    badgeText = 'Below Cost Risk';
    Icon = AlertTriangle;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <div className={`inline-flex flex-col gap-1 rounded-2xl border backdrop-blur-md shadow-sm ${colorClasses} ${padding}`}>
      <div className="flex items-center gap-1.5 font-bold tracking-wide">
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
        <span>{badgeText}</span>
        <span className="font-extrabold ml-auto px-1.5 py-0.2 rounded-md bg-white/10">
          {marginPct >= 0 ? `+${marginPct.toFixed(1)}%` : `${marginPct.toFixed(1)}%`}
        </span>
      </div>
      {quantity > 1 && (
        <div className="text-[11px] opacity-90 flex items-center justify-between gap-3 pt-1 border-t border-white/10">
          <span className="opacity-80">Net Profit ({quantity} Qtl):</span>
          <span className="font-extrabold tracking-tight">
            {netProfit >= 0 ? `+₹${Math.round(netProfit).toLocaleString('en-IN')}` : `-₹${Math.abs(Math.round(netProfit)).toLocaleString('en-IN')}`}
          </span>
        </div>
      )}
    </div>
  );
};
