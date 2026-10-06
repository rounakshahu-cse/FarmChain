import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

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

  let colorClasses = 'bg-[#557373]/15 text-[#557373] border-[#557373]/30';
  let badgeText = 'Profitable Deal';
  let Icon = CheckCircle2;

  if (marginPct >= 25) {
    colorClasses = 'bg-[#557373]/20 text-[#557373] border-[#557373]/45 shadow-sm';
    badgeText = 'Super-Profitable Deal';
    Icon = TrendingUp;
  } else if (marginPct >= 10) {
    colorClasses = 'bg-[#557373]/15 text-[#557373] border-[#557373]/30';
    badgeText = 'Healthy Profit Margin';
    Icon = CheckCircle2;
  } else if (marginPct >= 0) {
    colorClasses = 'bg-[#272401]/10 text-[#272401] border-[#272401]/30';
    badgeText = 'Break-Even / Marginal';
    Icon = AlertTriangle;
  } else {
    colorClasses = 'bg-rose-50 text-rose-700 border-rose-200';
    badgeText = 'Below Cost Risk';
    Icon = AlertTriangle;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3.5 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <div className={`inline-flex flex-col gap-1 rounded-2xl border backdrop-blur-md shadow-xs ${colorClasses} ${padding}`}>
      <div className="flex items-center gap-1.5 font-bold tracking-wide">
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} />
        <span>{badgeText}</span>
        <span className="font-extrabold ml-auto px-1.5 py-0.2 rounded-md bg-[#dfe5f3]/80 text-[#0d0d0d]">
          {marginPct >= 0 ? `+${marginPct.toFixed(1)}%` : `${marginPct.toFixed(1)}%`}
        </span>
      </div>
      {quantity > 1 && (
        <div className="text-[11px] opacity-90 flex items-center justify-between gap-3 pt-1 border-t border-black/10">
          <span className="opacity-80">Net Profit ({quantity} Qtl):</span>
          <span className="font-extrabold tracking-tight">
            {netProfit >= 0 ? `+₹${Math.round(netProfit).toLocaleString('en-IN')}` : `-₹${Math.abs(Math.round(netProfit)).toLocaleString('en-IN')}`}
          </span>
        </div>
      )}
    </div>
  );
};
