import React, { useState } from 'react';
import {
  Sprout,
  X,
  Calendar,
  AlertCircle,
  TrendingUp,
  MapPin,
  FileText,
  Loader2,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [cropName, setCropName] = useState('Soybean');
  const [variety, setVariety] = useState('JS-335');
  const [quantity, setQuantity] = useState<number>(50);
  const [qualityGrade, setQualityGrade] = useState('Grade A - Premium');
  const [basePrice, setBasePrice] = useState<number>(4900);
  const [costOfProduction, setCostOfProduction] = useState<number>(3800);
  const [farmLocation, setFarmLocation] = useState(user?.location || 'Dindori Farm, Nashik');
  const [scheduleTomorrow, setScheduleTomorrow] = useState(true);
  const [notes, setNotes] = useState('Harvested recently, moisture < 10%, graded and packed.');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiFetch('/listings/', {
        method: 'POST',
        body: JSON.stringify({
          crop_name: cropName,
          variety,
          quantity_quintals: Number(quantity),
          quality_grade: qualityGrade,
          base_price: Number(basePrice),
          cost_of_production: Number(costOfProduction),
          farm_location: farmLocation,
          district: user?.district || 'Nashik',
          state: user?.state || 'Maharashtra',
          schedule_for_tomorrow: scheduleTomorrow,
          notes,
        }),
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to create listing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const estimatedProfitMargin =
    costOfProduction > 0
      ? (((basePrice - costOfProduction) / costOfProduction) * 100).toFixed(1)
      : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {t.farmer.createListing}
              </h3>
              <p className="text-xs text-slate-400">
                Direct-to-merchant bidding without middleman commission
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">
                {t.farmer.cropName} *
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 font-medium"
              >
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Wheat">Sharbati Wheat (गहू / गेहूं)</option>
                <option value="Cotton">BT Cotton (कापूस / कपास)</option>
                <option value="Tomato">Hybrid Tomato (टोमॅटो / टमाटर)</option>
                <option value="Red Onion">Red Onion (कांदा / प्याज)</option>
                <option value="Basmati Rice">Basmati 1121 Rice (तांदूळ)</option>
                <option value="Mustard">Mustard Seed (मोहरी / सरसों)</option>
                <option value="Maize">Yellow Maize (मका / मक्का)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                {t.farmer.variety}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. JS-335, Pusa 1121"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 block mb-1">
                {t.farmer.quantity} *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1">
                {t.farmer.qualityGrade} *
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500 text-slate-100 font-medium"
              >
                <option value="Grade A - Premium">Grade A - Premium (Top Quality)</option>
                <option value="Grade B - Standard">Grade B - Standard (Market Grade)</option>
                <option value="Grade C - Fair">Grade C - Fair Average</option>
              </select>
            </div>
          </div>

          {/* Pricing & Profit Baseline */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-emerald-400 block mb-1">
                  {t.farmer.basePrice} *
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-amber-400 block mb-1">
                  {t.farmer.costOfProduction} *
                </label>
                <input
                  type="number"
                  value={costOfProduction}
                  onChange={(e) => setCostOfProduction(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400 border-t border-slate-800">
              <span>Expected Base Profit Margin:</span>
              <span className="font-bold text-emerald-400">
                +{estimatedProfitMargin}% Margin (₹
                {((basePrice - costOfProduction) * quantity).toLocaleString('en-IN')}{' '}
                est. profit)
              </span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">
              {t.farmer.farmLocation}
            </label>
            <input
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100"
            />
          </div>

          {/* Next-Day Scheduled Bidding Option */}
          <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="schedule"
              checked={scheduleTomorrow}
              onChange={(e) => setScheduleTomorrow(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-500 accent-emerald-500"
            />
            <label htmlFor="schedule" className="cursor-pointer">
              <span className="font-bold text-emerald-300 block">
                {t.farmer.scheduleTomorrow} (Recommended)
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {t.farmer.scheduleTomorrowDesc}
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-950/60 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>{t.farmer.submitListing}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
