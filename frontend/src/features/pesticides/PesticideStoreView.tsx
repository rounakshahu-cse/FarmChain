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
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black">
                {t.pesticides.title}
              </h2>
              <p className="text-xs opacity-75 mt-0.5">
                Government CIBRC certified bio-pesticides, organic inputs & certified foundation seeds
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inputs, pests, or brands..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-card text-xs placeholder:opacity-50 focus:outline-none focus:border-amber-500"
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
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/40 scale-105'
                : 'glass-card opacity-80 hover:opacity-100 hover:border-amber-500/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center opacity-60 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span className="text-xs font-semibold">Loading verified inputs catalog...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center opacity-75">
          <ShoppingBag className="w-12 h-12 mx-auto opacity-40 mb-3" />
          <h4 className="font-bold text-base">No products found</h4>
          <p className="text-xs mt-1 opacity-75">Try clearing your category filter or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {p.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-xl bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Gov Certified
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <span className="text-[10px] text-amber-400 font-extrabold block truncate uppercase">
                    {p.brand}
                  </span>
                  <h4 className="font-black text-sm line-clamp-2 mt-0.5">
                    {p.name}
                  </h4>
                  <p className="text-[11px] opacity-75 mt-1 line-clamp-2 leading-relaxed">
                    Target: {p.target_pests} on {p.target_crops}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] opacity-70 block font-semibold">
                      Price ({p.unit})
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-400">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setOrderingProduct(p);
                      setQuantity(1);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-950/40 transition-all hover:scale-105 active:scale-95"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl glass-panel shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base">
                  Confirm Input Order
                </h3>
              </div>
              <button
                onClick={() => setOrderingProduct(null)}
                className="opacity-60 hover:opacity-100 p-1.5 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4 mt-4 text-xs">
              <div className="p-3.5 rounded-2xl glass-card space-y-1">
                <div className="font-black text-sm">
                  {orderingProduct.name}
                </div>
                <div className="text-amber-400 font-bold">
                  {orderingProduct.brand} · {orderingProduct.unit}
                </div>
                <div className="opacity-75 text-[11px] pt-1">
                  Certified Kendra: {orderingProduct.seller_name} ({orderingProduct.seller_location})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={orderingProduct.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-2xl glass-card font-black text-base focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">
                    Total Payable
                  </label>
                  <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-black text-base flex items-center">
                    ₹{(orderingProduct.price * quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">
                  Farm Delivery Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl glass-card focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="text-[11px] opacity-75 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.pesticides.deliveryInDays}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingOrder || orderSuccess}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/50 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSubmittingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : orderSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" />
                    <span>Order Placed Successfully!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Place Order (₹{(orderingProduct.price * quantity).toLocaleString('en-IN')})</span>
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
