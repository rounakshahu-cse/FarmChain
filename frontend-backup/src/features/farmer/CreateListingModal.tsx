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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#557373]/20 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#0d0d0d]">
        <div className="flex items-center justify-between border-b border-[#557373]/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-[#557373]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#0d0d0d]">
                {t.farmer.createListing}
              </h3>
              <p className="text-xs text-[#64748b]">
                {t.merchant.escrowGuaranteed}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748b] hover:text-[#0d0d0d] hover:bg-[#dfe5f3]/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#0d0d0d] block mb-1">
                {t.farmer.cropName} *
              </label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 focus:border-[#557373] text-[#0d0d0d] font-medium"
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
              <label className="font-bold text-[#0d0d0d] block mb-1">
                {t.farmer.variety}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. JS-335, Pusa 1121"
                className="w-full px-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 focus:border-[#557373] text-[#0d0d0d]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#0d0d0d] block mb-1">
                {t.farmer.quantity} *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="w-full px-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 focus:border-[#557373] text-[#0d0d0d]"
              />
            </div>

            <div>
              <label className="font-bold text-[#0d0d0d] block mb-1">
                {t.farmer.qualityGrade} *
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 focus:border-[#557373] text-[#0d0d0d] font-medium"
              >
                <option value="Grade A - Premium">Grade A - Premium (Top Quality)</option>
                <option value="Grade B - Standard">Grade B - Standard (Market Grade)</option>
                <option value="Grade C - Fair">Grade C - Fair Average</option>
              </select>
            </div>
          </div>

          {/* Pricing & Profit Baseline */}
          <div className="p-3.5 rounded-2xl bg-[#dfe5f3]/40 border border-[#557373]/20 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#557373] block mb-1">
                  {t.farmer.basePrice} *
                </label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#557373]/40 text-[#0d0d0d] font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-[#272401] block mb-1">
                  {t.farmer.costOfProduction} *
                </label>
                <input
                  type="number"
                  value={costOfProduction}
                  onChange={(e) => setCostOfProduction(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#272401]/30 text-[#0d0d0d] font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 text-[#64748b] border-t border-[#557373]/15">
              <span>{t.farmer.profitMargin}:</span>
              <span className="font-bold text-[#557373]">
                +{estimatedProfitMargin}% ({t.common.amount}: ₹
                {((basePrice - costOfProduction) * quantity).toLocaleString('en-IN')}{' '}
                est. {t.common.price})
              </span>
            </div>
          </div>

          <div>
            <label className="font-bold text-[#0d0d0d] block mb-1">
              {t.farmer.farmLocation}
            </label>
            <input
              type="text"
              value={farmLocation}
              onChange={(e) => setFarmLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#f2efea]/70 border border-[#557373]/30 text-[#0d0d0d]"
            />
          </div>

          {/* Next-Day Scheduled Bidding Option */}
          <div className="p-3 rounded-2xl bg-[#dfe5f3]/60 border border-[#557373]/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="schedule"
              checked={scheduleTomorrow}
              onChange={(e) => setScheduleTomorrow(e.target.checked)}
              className="mt-1 w-4 h-4 rounded accent-[#557373]"
            />
            <label htmlFor="schedule" className="cursor-pointer">
              <span className="font-bold text-[#557373] block">
                {t.farmer.scheduleTomorrow} (Recommended)
              </span>
              <span className="text-[11px] text-[#64748b] block mt-0.5">
                {t.farmer.scheduleTomorrowDesc}
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#557373]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-[#64748b] hover:bg-[#dfe5f3]/50 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#557373] hover:bg-[#435c5c] text-white font-extrabold shadow-md shadow-[#557373]/25 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.common.loading}</span>
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
