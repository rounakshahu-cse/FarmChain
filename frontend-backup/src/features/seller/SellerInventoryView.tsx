import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Plus,
  PackageCheck,
  ShieldCheck,
  Star,
  Loader2,
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';

export const SellerInventoryView: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<any[]>('/pesticides/');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#557373]" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0d0d0d]">
              {t.seller.title}
            </h2>
          </div>
          <p className="text-xs text-[#64748b] mt-1">
            {t.seller.subtitle}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
          <span className="text-xs">{t.common.loading}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-3xl p-5 border border-[#557373]/20 space-y-3 bg-white"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#557373]/20"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-[#272401] font-bold block truncate">
                    {p.brand}
                  </span>
                  <h4 className="font-bold text-sm text-[#0d0d0d] truncate">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-[#64748b]">
                    {t.seller.stock}: {p.stock} {t.seller.activeStock}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#64748b] block">{t.seller.price}</span>
                  <span className="font-black text-[#557373]">
                    ₹{p.price}/{p.unit}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dfe5f3] text-[#557373] border border-[#557373]/30">
                  {t.common.active}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
