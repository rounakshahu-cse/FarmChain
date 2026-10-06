import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  ShieldCheck,
  Star,
  Plus,
  CheckCircle2,
  Loader2,
  Sparkles,
  MapPin,
  Truck,
  Package
} from 'lucide-react';
import { apiFetch } from '../../api/client';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

interface PesticideStoreViewProps {
  initialSearchQuery?: string;
}

export const PesticideStoreView: React.FC<PesticideStoreViewProps> = ({
  initialSearchQuery = '',
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Order modal state
  const [orderingProduct, setOrderingProduct] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState(user?.location || 'Dindori Farm, Nashik');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch<any[]>('/pesticides/');
      setProducts(data);
    } catch (err) {
      console.error('Failed to load pesticides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingProduct) return;

    setIsSubmittingOrder(true);
    try {
      await apiFetch('/pesticides/order', {
        method: 'POST',
        body: JSON.stringify({
          product_id: orderingProduct.id,
          quantity,
          delivery_address: address,
        }),
      });

      setOrderSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setOrderingProduct(null);
        setOrderSuccess(false);
      }, 1800);
    } catch (err: any) {
      alert(`Order placement failed: ${err.message}`);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const categories = [
    { id: 'all', label: t.pesticides.allCategories },
    { id: 'Bio-Fungicide', label: t.pesticides.fungicide },
    { id: 'Bio-Pesticide', label: t.pesticides.pesticide },
    { id: 'Nutrient / Fertilizer', label: t.pesticides.fertilizer },
    { id: 'Organic Neem Oil', label: t.pesticides.neemOil },
    { id: 'Certified Seeds', label: t.pesticides.seeds },
    { id: 'Sprayer Equipment', label: t.pesticides.sprayer },
  ];

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.target_crops.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.target_pests.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#0d0d0d]">
                {t.pesticides.title}
              </h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                {t.pesticides.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.pesticides.searchProducts}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#557373]/25 text-xs text-[#0d0d0d] placeholder:text-[#64748b] focus:outline-none focus:border-[#557373]"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
              selectedCategory === cat.id
                ? 'bg-[#557373] border-[#557373] text-white font-black shadow-md shadow-[#557373]/20 scale-105'
                : 'bg-white border-[#557373]/20 text-[#0d0d0d] hover:bg-[#dfe5f3]/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-[#64748b] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#557373]" />
          <span className="text-xs font-semibold">{t.common.loading}</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-[#64748b] border border-[#557373]/20 bg-white">
          <ShoppingBag className="w-12 h-12 mx-auto text-[#557373]/50 mb-3" />
          <h4 className="font-bold text-base text-[#0d0d0d]">{t.common.noData}</h4>
          <p className="text-xs mt-1 text-[#64748b]">{t.pesticides.subtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group bg-white border border-[#557373]/20"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[#dfe5f3] border border-[#557373]/30">
                    {p.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-[#557373] text-white flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    Gov Certified
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#272401] font-extrabold block truncate uppercase">
                    {p.brand}
                  </span>
                  <h4 className="font-black text-sm text-[#0d0d0d] line-clamp-2 mt-0.5">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-[#64748b] mt-1 line-clamp-2 leading-relaxed">
                    Target: {p.target_pests} on {p.target_crops}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#557373]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#64748b] block font-semibold">
                      {t.common.price} ({p.unit})
                    </span>
                    <span className="text-base sm:text-lg font-black text-[#557373]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setOrderingProduct(p);
                      setQuantity(1);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black text-xs shadow-md shadow-[#557373]/20 transition-all hover:scale-105 active:scale-95"
                  >
                    {t.pesticides.buyNow}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {orderingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white border border-[#557373]/20 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#0d0d0d]">
            <div className="flex items-center justify-between border-b border-[#557373]/15 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#dfe5f3] border border-[#557373]/30 flex items-center justify-center text-[#557373]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-[#0d0d0d]">
                  Confirm Input Order
                </h3>
              </div>
              <button
                onClick={() => setOrderingProduct(null)}
                className="text-[#64748b] hover:text-[#0d0d0d] p-1.5 rounded-lg hover:bg-[#dfe5f3]/50 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 mt-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/20">
                <img
                  src={orderingProduct.image_url}
                  alt={orderingProduct.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#557373]/20"
                />
                <div>
                  <h4 className="font-black text-xs text-[#0d0d0d]">{orderingProduct.name}</h4>
                  <span className="text-[11px] text-[#557373] font-bold">
                    ₹{orderingProduct.price} / {orderingProduct.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#0d0d0d]">
                  {t.common.quantity} ({orderingProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-[#557373]/30 text-base font-black text-[#0d0d0d] focus:outline-none focus:border-[#557373]"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-[#0d0d0d]">
                  {t.common.location}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#f2efea]/70 border border-[#557373]/30 text-[#0d0d0d] focus:outline-none focus:border-[#557373]"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-[#dfe5f3]/70 border border-[#557373]/25 flex items-center justify-between">
                <span className="font-semibold text-[#64748b]">{t.common.amount}:</span>
                <span className="font-black text-lg text-[#557373]">
                  ₹{(quantity * orderingProduct.price).toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder || orderSuccess}
                className="w-full py-3.5 rounded-2xl bg-[#557373] hover:bg-[#435c5c] text-white font-black shadow-md shadow-[#557373]/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSubmittingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.common.loading}</span>
                  </>
                ) : orderSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{t.pesticides.orderPlacedSuccess}</span>
                  </>
                ) : (
                  <>
                    <span>{t.pesticides.buyNow}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
