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
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Agri Input Inventory & Kendra Catalog
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your certified bio-pesticides, fungicides, and seed stock for direct farmer delivery.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="text-xs">Loading inventory catalog...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-purple-400 font-bold block truncate">
                    {p.brand}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate">
                    {p.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Stock: {p.stock} units available
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Unit Price</span>
                  <span className="font-black text-emerald-400">
                    ₹{p.price}/{p.unit}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  In Stock
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
