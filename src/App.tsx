/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  ShoppingBag,
  MapPin,
  Search,
  Plus,
  Minus,
  X,
  Clock,
  Phone,
  Check,
  Compass,
  History,
  UtensilsCrossed,
  RotateCcw,
  Heart,
  Printer,
  Flame,
  Users,
  Truck,
  ChefHat,
  PackageCheck,
  Home,
} from 'lucide-react';
import {
  Branch,
  CartItem,
  CheckoutStep,
  FlyerSlide,
  MainCategory,
  MenuItem,
  NavRoute,
  OrderRecord,
  ProductExtra,
  ProductSize,
  PromoVoucher,
  SavedLocation,
} from './types';
import {
  BRANCHES,
  COMMON_EXTRAS,
  IMG_BANNER_FEAST,
  IMG_JOLLOF,
  IMG_PIZZA,
  IMG_SOBOLO,
  INITIAL_FLYER_SLIDES,
  INITIAL_ORDERS,
  INITIAL_SAVED_LOCATIONS,
  INITIAL_VOUCHERS,
  MENU_ITEMS,
  PROMO_BANNERS,
  formatGhs,
} from './data/menuData';
import { ProductModal } from './components/ProductModal';
import { CheckoutModals, ReceiptModal } from './components/CheckoutModals';
import { AnimatedFoodBag, VisualBagModal } from './components/AnimatedFoodBag';
import { WelcomeView } from './components/WelcomeView';
import { AdminDashboard } from './components/AdminDashboard';

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function checkIsAdminUrl(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();
  return (
    path === '/admin' ||
    path.startsWith('/admin/') ||
    search.has('admin') ||
    hash === '#admin' ||
    hash.startsWith('#/admin')
  );
}

export default function App() {
  // Hidden Admin Portal URL detection (/admin, ?admin=true, or #/admin)
  const [isAdminPortal, setIsAdminPortal] = useState<boolean>(() => checkIsAdminUrl());

  useEffect(() => {
    const syncUrlState = () => {
      setIsAdminPortal(checkIsAdminUrl());
    };
    window.addEventListener('popstate', syncUrlState);
    window.addEventListener('hashchange', syncUrlState);
    return () => {
      window.removeEventListener('popstate', syncUrlState);
      window.removeEventListener('hashchange', syncUrlState);
    };
  }, []);

  // Navigation & Category State (Default to Welcome Page with IG Looping Flyers)
  const [activeRoute, setActiveRoute] = useState<NavRoute>('welcome');
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('all');
  const [visualBagModalOpen, setVisualBagModalOpen] = useState<boolean>(false);

  // Admin-Managed Dynamic Store Data (Flyers, Menu Items, Branches, Vouchers)
  const [flyers, setFlyers] = useState<FlyerSlide[]>(() =>
    loadStorage('dcfoods_flyers', INITIAL_FLYER_SLIDES)
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() =>
    loadStorage('dcfoods_menu_items', MENU_ITEMS)
  );
  const [branches, setBranches] = useState<Branch[]>(() =>
    loadStorage('dcfoods_branches', BRANCHES)
  );
  const [vouchers, setVouchers] = useState<PromoVoucher[]>(() =>
    loadStorage('dcfoods_vouchers', INITIAL_VOUCHERS)
  );

  // Persisted Branch & Location State
  const [selectedBranch, setSelectedBranch] = useState<Branch>(() =>
    loadStorage('dcfoods_branch', BRANCHES[0])
  );
  const [deliveryOption, setDeliveryOption] = useState<'DELIVERY' | 'PICKUP'>(() =>
    loadStorage('dcfoods_delivery_option', 'DELIVERY')
  );
  const [deliveryAddress, setDeliveryAddress] = useState<string>(() =>
    loadStorage('dcfoods_delivery_address', INITIAL_SAVED_LOCATIONS[0].address)
  );
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() =>
    loadStorage('dcfoods_saved_locations', INITIAL_SAVED_LOCATIONS)
  );

  // Favorites & Explore State
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() =>
    loadStorage('dcfoods_favorites', ['dc-emerald-supreme-pizza', 'dc-jollof-maxi-bucket'])
  );
  const [exploreQuery, setExploreQuery] = useState<string>('');

  // Product Customizer Modal State
  const [activeProductModal, setActiveProductModal] = useState<MenuItem | null>(null);

  // Persisted Shopping Bag State
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStorage('dcfoods_cart', [
      {
        cartItemId: 'seed-emerald-pizza',
        product: MENU_ITEMS[0],
        selectedSize: MENU_ITEMS[0].sizes[0],
        selectedPreference: MENU_ITEMS[0].preferences[0],
        selectedConstituent: MENU_ITEMS[0].constituentsOptions?.[0],
        selectedExtras: [COMMON_EXTRAS[3]],
        note: '',
        quantity: 1,
      },
      {
        cartItemId: 'seed-jollof-bucket',
        product: MENU_ITEMS[1],
        selectedSize: MENU_ITEMS[1].sizes[0],
        selectedPreference: MENU_ITEMS[1].preferences[0],
        selectedConstituent: MENU_ITEMS[1].constituentsOptions?.[0],
        selectedExtras: [],
        note: '',
        quantity: 1,
      },
    ])
  );

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('NONE');
  const [courierTier, setCourierTier] = useState<{
    id: string;
    label: string;
    fee: number;
    eta: string;
  }>({
    id: 'express',
    label: 'Fast Rider (20 mins)',
    fee: 15,
    eta: '20–30 mins',
  });
  const [scheduledTime, setScheduledTime] = useState<string>('ASAP (20–30 mins)');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCouponDiscount, setAppliedCouponDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'CARD' | 'COD'>('MOMO');
  const [momoNetwork, setMomoNetwork] = useState<'MTN' | 'Telecel' | 'AT'>('MTN');
  const [momoPhone, setMomoPhone] = useState<string>('024 555 0192');

  // Orders & Receipt Modal
  const [orders, setOrders] = useState<OrderRecord[]>(() =>
    loadStorage('dcfoods_orders', INITIAL_ORDERS)
  );
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<OrderRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; status: 'success' | 'info' } | null>(null);

  // Save state changes to localStorage
  useEffect(() => {
    window.localStorage.setItem('dcfoods_flyers', JSON.stringify(flyers));
  }, [flyers]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_branch', JSON.stringify(selectedBranch));
  }, [selectedBranch]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_delivery_option', JSON.stringify(deliveryOption));
  }, [deliveryOption]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_delivery_address', JSON.stringify(deliveryAddress));
  }, [deliveryAddress]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_saved_locations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_favorites', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    window.localStorage.setItem('dcfoods_orders', JSON.stringify(orders));
  }, [orders]);

  // Cross-tab synchronization so changes in /admin reflect immediately in customer tab
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'dcfoods_flyers') {
        setFlyers(loadStorage('dcfoods_flyers', INITIAL_FLYER_SLIDES));
      } else if (e.key === 'dcfoods_menu_items') {
        setMenuItems(loadStorage('dcfoods_menu_items', MENU_ITEMS));
      } else if (e.key === 'dcfoods_branches') {
        setBranches(loadStorage('dcfoods_branches', BRANCHES));
      } else if (e.key === 'dcfoods_orders') {
        setOrders(loadStorage('dcfoods_orders', INITIAL_ORDERS));
      } else if (e.key === 'dcfoods_vouchers') {
        setVouchers(loadStorage('dcfoods_vouchers', INITIAL_VOUCHERS));
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  const showToast = (message: string, status: 'success' | 'info' = 'success') => {
    setToast({ message, status });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 2400);
  };

  const handleResetFactoryDefaults = () => {
    setFlyers(INITIAL_FLYER_SLIDES);
    setMenuItems(MENU_ITEMS);
    setBranches(BRANCHES);
    setOrders(INITIAL_ORDERS);
    setVouchers(INITIAL_VOUCHERS);
    showToast('Factory defaults restored!');
  };

  const handleExitAdmin = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
    setIsAdminPortal(false);
    setActiveRoute('welcome');
  };

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const getCartItemUnitPrice = (item: CartItem): number => {
    const extrasSum = item.selectedExtras.reduce((acc, ex) => acc + ex.price, 0);
    return item.product.basePrice + item.selectedSize.priceDelta + extrasSum;
  };

  const getLineSavings = (item: CartItem): number => {
    if (
      item.product.thresholdQty &&
      item.product.thresholdSaveAmount &&
      item.quantity >= item.product.thresholdQty
    ) {
      return (
        Math.floor(item.quantity / item.product.thresholdQty) * item.product.thresholdSaveAmount
      );
    }
    return 0;
  };

  const getProductBagQuantity = (productId: string): number => {
    return cart
      .filter((c) => c.product.id === productId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  // Direct +1 / -1 on Menu Card
  const handleQuickAdd = (product: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const defaultSize = product.sizes[0];
    const defaultPref = product.preferences[0] || 'Standard';
    const defaultConst = product.constituentsOptions?.[0];
    handleConfirmAdd(product, defaultSize, defaultPref, defaultConst, [], '', 1);
  };

  const handleQuickDecrementProduct = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const matching = cart.find((c) => c.product.id === productId);
    if (matching) {
      updateCartQuantity(matching.cartItemId, -1);
    }
  };

  const handleConfirmAdd = (
    product: MenuItem,
    size: ProductSize,
    preference: string,
    constituent: string | undefined,
    extras: ProductExtra[],
    note: string,
    quantity: number
  ) => {
    const extrasKey = extras
      .map((e) => e.id)
      .sort()
      .join(',');
    const signatureKey = `${product.id}__${size.id}__${preference}__${constituent || ''}__${extrasKey}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.cartItemId === signatureKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId: signatureKey,
          product,
          selectedSize: size,
          selectedPreference: preference,
          selectedConstituent: constituent,
          selectedExtras: extras,
          note,
          quantity,
        },
      ];
    });

    showToast(`Added ${product.name} into Bag`);
    setActiveProductModal(null);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCouponDiscount(0);
    showToast('Bag emptied', 'info');
  };

  // Totals
  const totalBagItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const rawSubTotal = useMemo(
    () => cart.reduce((sum, item) => sum + getCartItemUnitPrice(item) * item.quantity, 0),
    [cart]
  );
  const totalThresholdSavings = useMemo(
    () => cart.reduce((sum, item) => sum + getLineSavings(item), 0),
    [cart]
  );
  const freeDeliveryThreshold = 250;
  const freeDeliveryProgressPct = Math.min(
    100,
    Math.round((rawSubTotal / freeDeliveryThreshold) * 100)
  );
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - rawSubTotal);

  const effectiveDeliveryFee =
    deliveryOption === 'PICKUP' ? 0 : rawSubTotal >= freeDeliveryThreshold ? 0 : courierTier.fee;

  const finalCheckoutTotal = Math.max(
    0,
    rawSubTotal - totalThresholdSavings - appliedCouponDiscount + effectiveDeliveryFee
  );

  const displayedProducts = useMemo(() => {
    return menuItems.filter(
      (item) => selectedCategory === 'all' || item.category === selectedCategory
    );
  }, [menuItems, selectedCategory]);

  const exploreResults = useMemo(() => {
    const q = exploreQuery.trim().toLowerCase();
    return menuItems.filter(
      (item) =>
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q)
    );
  }, [menuItems, exploreQuery]);

  const handleApplyCoupon = (overrideCode?: string) => {
    const clean = (overrideCode ?? couponCode).trim().toUpperCase();
    const matchedVoucher = vouchers.find((v) => v.active && v.code.toUpperCase() === clean);
    if (matchedVoucher) {
      setAppliedCouponDiscount(matchedVoucher.discountAmount);
      showToast(`GH₵ ${matchedVoucher.discountAmount.toFixed(2)} Off Applied!`);
      return;
    }
    if (clean === 'DCFEAST20' || clean === 'DC20') {
      setAppliedCouponDiscount(20);
      showToast('GH₵ 20.00 Off Applied!');
    }
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      code: `DCF-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      scheduledFor: scheduledTime,
      branchName: selectedBranch.name,
      deliveryType: deliveryOption,
      address:
        deliveryOption === 'DELIVERY' ? deliveryAddress : `${selectedBranch.name}`,
      riderName: 'Kwesi Boateng',
      riderPhone: '024 903 4412',
      statusStep: 1,
      items: cart.map((c) => ({
        productId: c.product.id,
        name: c.product.name,
        size: c.selectedSize.label,
        preference: c.selectedPreference,
        extras: c.selectedExtras.map((e) => e.name),
        quantity: c.quantity,
        unitPrice: getCartItemUnitPrice(c),
      })),
      subTotal: rawSubTotal,
      discount: totalThresholdSavings + appliedCouponDiscount,
      deliveryFee: effectiveDeliveryFee,
      total: finalCheckoutTotal,
      paymentMethod:
        paymentMethod === 'MOMO'
          ? `${momoNetwork} MoMo`
          : paymentMethod === 'CARD'
          ? 'Card'
          : 'Cash',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCouponDiscount(0);
    setCheckoutStep('CONFIRMED');
  };

  const handleOrderAgain = (order: OrderRecord) => {
    const rebuiltItems: CartItem[] = [];
    order.items.forEach((line, idx) => {
      const foundProduct =
        menuItems.find((m) => m.id === line.productId) || menuItems[0] || MENU_ITEMS[0];
      const matchedSize =
        foundProduct.sizes.find((s) => s.label === line.size) || foundProduct.sizes[0];
      rebuiltItems.push({
        cartItemId: `reorder-${Date.now()}-${idx}`,
        product: foundProduct,
        selectedSize: matchedSize,
        selectedPreference: line.preference || foundProduct.preferences[0],
        selectedConstituent: foundProduct.constituentsOptions?.[0],
        selectedExtras: [],
        note: '',
        quantity: line.quantity,
      });
    });

    setCart(rebuiltItems);
    setVisualBagModalOpen(true);
    showToast('Food put inside your Bag!');
  };

  // If the user visits the secret /admin link, render the full Admin Dashboard
  if (isAdminPortal) {
    return (
      <AdminDashboard
        flyers={flyers}
        onUpdateFlyers={setFlyers}
        menuItems={menuItems}
        onUpdateMenuItems={setMenuItems}
        orders={orders}
        onUpdateOrders={setOrders}
        branches={branches}
        onUpdateBranches={setBranches}
        vouchers={vouchers}
        onUpdateVouchers={setVouchers}
        onResetFactoryDefaults={handleResetFactoryDefaults}
        onExitAdmin={handleExitAdmin}
      />
    );
  }

  // Visual Card Renderer (Picture-Driven, Minimal Text, Direct +/- Controls)
  const renderVisualFoodCard = (product: MenuItem) => {
    const inBagQty = getProductBagQuantity(product.id);
    const isFav = favoriteIds.includes(product.id);
    const flameCount =
      product.spiceLevel === 'Spicy' ? 3 : product.spiceLevel === 'Medium' ? 2 : 1;
    const peopleCount =
      product.category === 'packages' ? '4+' : product.basePrice >= 115 ? '2–3' : '1';

    return (
      <article
        key={product.id}
        onClick={() => setActiveProductModal(product)}
        className={`group bg-white rounded-3xl border-2 overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
          inBagQty > 0 ? 'border-emerald-700 ring-1 ring-emerald-700' : 'border-stone-200/90'
        }`}
      >
        {/* Large Appetizing Food Picture (70% of Card Height) */}
        <div className="relative h-48 sm:h-52 w-full bg-stone-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Top-Right: Heart Favorite Button */}
          <button
            type="button"
            onClick={(e) => toggleFavorite(product.id, e)}
            aria-label="Favorite"
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md flex items-center justify-center cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : 'text-stone-500'}`}
            />
          </button>

          {/* Bottom-Left on Image: Universal Icons (People Count + Spice Flames) */}
          <div className="absolute bottom-2.5 left-3 flex items-center gap-3 text-white text-xs font-extrabold">
            <span className="inline-flex items-center gap-1 bg-black/55 backdrop-blur-xs px-2.5 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-emerald-300" />
              <span>{peopleCount}</span>
            </span>
            <span className="inline-flex items-center gap-0.5 bg-black/55 backdrop-blur-xs px-2 py-1 rounded-full">
              {Array.from({ length: flameCount }).map((_, idx) => (
                <Flame key={idx} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </span>
          </div>

          {/* Bottom-Right on Image: Price Tag */}
          <div className="absolute bottom-2.5 right-3 bg-emerald-700 text-white px-3 py-1 rounded-xl font-mono font-extrabold text-sm shadow-sm">
            {formatGhs(product.basePrice)}
          </div>
        </div>

        {/* Clean Minimal Bottom Action Strip */}
        <div className="p-3.5 flex items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-extrabold text-stone-900 line-clamp-1">
            {product.name}
          </h3>

          {inBagQty > 0 ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-700/40 rounded-2xl p-1 shrink-0"
            >
              <button
                type="button"
                onClick={(e) => handleQuickDecrementProduct(product.id, e)}
                aria-label="Remove one"
                className="w-9 h-9 rounded-xl bg-white text-stone-900 shadow-2xs flex items-center justify-center hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-6 text-center font-mono text-sm font-extrabold text-emerald-950">
                {inBagQty}
              </span>
              <button
                type="button"
                onClick={(e) => handleQuickAdd(product, e)}
                aria-label="Add one more"
                className="w-9 h-9 rounded-xl bg-emerald-700 text-white shadow-2xs flex items-center justify-center hover:bg-emerald-800 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => handleQuickAdd(product, e)}
              aria-label={`Add ${product.name} to bag`}
              className="min-h-[42px] px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col pb-24 md:pb-12">
      {/* Notification Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Contract: Brand Wordmark | Concise Single-Line Nav Links | 1 Primary Bag Action */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 md:px-8 py-3.5">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#welcome"
            onClick={(e) => {
              e.preventDefault();
              setActiveRoute('welcome');
            }}
            className="text-lg font-extrabold tracking-tight text-emerald-800 whitespace-nowrap shrink-0"
          >
            DC FOODS.
          </a>

          {/* Zone 2: Concise Single-Line Nav Links (No Admin Link Shown) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-stone-600">
            <button
              type="button"
              onClick={() => setActiveRoute('welcome')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeRoute === 'welcome'
                  ? 'text-emerald-800 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Welcome
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute('menu')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeRoute === 'menu'
                  ? 'text-emerald-800 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Food Menu
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute('explore')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeRoute === 'explore'
                  ? 'text-emerald-800 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute('history')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeRoute === 'history'
                  ? 'text-emerald-800 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              My Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveRoute('branches')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeRoute === 'branches'
                  ? 'text-emerald-800 underline underline-offset-8 decoration-2'
                  : ''
              }`}
            >
              Branches
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Open Animated Food Bag) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setVisualBagModalOpen(true)}
              className="min-h-[44px] px-4 py-2 text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 rounded-2xl transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Open Bag ({totalBagItems})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-[1280px] w-full mx-auto px-4 md:px-8 pt-6 flex-1">
        {/* ROUTE 0: WELCOME PAGE WITH IG-STYLE AUTOMATED LOOPING FLYERS */}
        {activeRoute === 'welcome' ? (
          <WelcomeView
            flyers={flyers}
            menuItems={menuItems}
            onEnterMenu={(cat) => {
              if (cat) setSelectedCategory(cat);
              setActiveRoute('menu');
            }}
            onSelectDish={(dish) => {
              setActiveProductModal(dish);
            }}
            onOpenAdmin={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/admin');
              }
              setIsAdminPortal(true);
            }}
          />
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* LEFT MAIN VIEWPORT */}
            <div className="w-full lg:max-w-[820px] flex-1 space-y-6">
              {/* ROUTE 1: VISUAL MENU */}
              {activeRoute === 'menu' && (
                <>
                  {/* Location Bar */}
                  <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('ADDRESS')}
                      className="flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-stone-900 truncate">
                          {selectedBranch.name}
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-700">
                          {selectedBranch.etaMins} · Tap to change
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveRoute('welcome')}
                      className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5 text-amber-600" />
                      <span>Welcome</span>
                    </button>
                  </div>

                  {/* 5 Visual Picture Category Tiles (All + 4 Main Categories) */}
                  <section aria-label="Food Categories">
                    <div className="grid grid-cols-5 gap-2 sm:gap-3">
                      {[
                        { id: 'all' as MainCategory, name: 'All Food', image: IMG_BANNER_FEAST },
                        { id: 'dcpizza' as MainCategory, name: 'Pizza', image: IMG_PIZZA },
                        { id: 'dcchicken' as MainCategory, name: 'Rice & Chicken', image: IMG_JOLLOF },
                        { id: 'packages' as MainCategory, name: 'Big Boxes', image: IMG_BANNER_FEAST },
                        { id: 'drinks' as MainCategory, name: 'Drinks & Sides', image: IMG_SOBOLO },
                      ].map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`group flex flex-col items-center p-2 sm:p-2.5 rounded-2xl border-2 transition-all cursor-pointer ${
                              isActive
                                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm scale-[1.02]'
                                : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 border border-white/40 mb-1.5">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-[11px] sm:text-xs font-extrabold whitespace-nowrap truncate max-w-full">
                              {cat.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {/* Promo Picture Banners */}
                  {selectedCategory === 'all' && (
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PROMO_BANNERS.map((banner) => (
                        <div
                          key={banner.id}
                          onClick={() => {
                            const target = menuItems.find((m) => m.id === banner.targetProductId);
                            if (target) setActiveProductModal(target);
                          }}
                          className="relative h-[165px] rounded-3xl overflow-hidden border-2 border-stone-200 cursor-pointer group"
                        >
                          <img
                            src={banner.image}
                            alt={banner.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                            <span className="text-xs font-extrabold text-amber-300">
                              {banner.kicker}
                            </span>
                            <h3 className="text-base font-extrabold text-white mt-0.5">
                              {banner.title}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </section>
                  )}

                  {/* Visual Picture Food Grid */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayedProducts.map((product) => renderVisualFoodCard(product))}
                  </section>
                </>
              )}

              {/* ROUTE 2: VISUAL SEARCH */}
              {activeRoute === 'explore' && (
                <section className="space-y-5">
                  <div className="bg-white p-4 rounded-3xl border border-stone-200">
                    <div className="relative">
                      <Search className="w-5 h-5 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={exploreQuery}
                        onChange={(e) => setExploreQuery(e.target.value)}
                        placeholder="Type food name (Pizza, Jollof, Wings, Sobolo)..."
                        className="w-full pl-11 pr-10 py-3 text-sm font-bold bg-stone-50 border-2 border-stone-200 rounded-2xl focus:outline-none focus:border-emerald-700"
                      />
                      {exploreQuery && (
                        <button
                          type="button"
                          onClick={() => setExploreQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {exploreResults.map((product) => renderVisualFoodCard(product))}
                  </div>
                </section>
              )}

              {/* ROUTE 3: VISUAL ORDER TRACKING (/history) */}
              {activeRoute === 'history' && (
                <section className="space-y-4">
                  {orders.map((order) => (
                    <article
                      key={order.id}
                      className="p-5 bg-white border-2 border-stone-200 rounded-3xl space-y-5"
                    >
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-stone-200">
                        <div>
                          <span className="font-mono text-sm font-extrabold text-emerald-800">
                            {order.code}
                          </span>
                          <h3 className="text-sm font-bold text-stone-900">{order.branchName}</h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReceiptOrder(order)}
                            className="min-h-[42px] px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOrderAgain(order)}
                            className="min-h-[42px] px-4 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>Buy Again</span>
                          </button>
                        </div>
                      </div>

                      {/* Visual 4-Picture Order Status Tracker */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        {[
                          { step: 1, label: 'Order In', icon: Check },
                          { step: 2, label: 'Cooking', icon: ChefHat },
                          { step: 3, label: 'On Bike', icon: Truck },
                          { step: 4, label: 'Arrived', icon: PackageCheck },
                        ].map((s) => {
                          const Icon = s.icon;
                          const reached = order.statusStep >= s.step;
                          return (
                            <div
                              key={s.step}
                              onClick={() => {
                                setOrders((prev) =>
                                  prev.map((o) =>
                                    o.id === order.id
                                      ? { ...o, statusStep: s.step as 1 | 2 | 3 | 4 }
                                      : o
                                  )
                                );
                              }}
                              className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                                reached
                                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                                  : 'border-stone-200 bg-stone-50 text-stone-400'
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                              <span className="text-xs font-extrabold">{s.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </section>
              )}

              {/* ROUTE 4: BRANCHES */}
              {activeRoute === 'branches' && (
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {branches.map((branch) => {
                    const isCurrent = selectedBranch.id === branch.id;
                    return (
                      <div
                        key={branch.id}
                        onClick={() => {
                          if (!branch.isOpen) {
                            showToast(`${branch.name} is currently closed`, 'info');
                            return;
                          }
                          setSelectedBranch(branch);
                          setActiveRoute('menu');
                          showToast(`Selected ${branch.name}`);
                        }}
                        className={`p-4 rounded-3xl border-2 bg-white flex items-center justify-between gap-3 cursor-pointer ${
                          isCurrent ? 'border-emerald-700 bg-emerald-50/40' : 'border-stone-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <h3 className="text-sm font-extrabold text-stone-900">{branch.name}</h3>
                          <div className="text-xs text-emerald-700 font-bold flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{branch.etaMins}</span>
                            <span>·</span>
                            <Phone className="w-3.5 h-3.5" />
                            <span className="font-mono">{branch.phone}</span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-2 rounded-xl text-xs font-extrabold shrink-0 ${
                            !branch.isOpen
                              ? 'bg-stone-200 text-stone-600'
                              : 'bg-emerald-700 text-white'
                          }`}
                        >
                          {!branch.isOpen ? 'Closed' : isCurrent ? 'Active' : 'Select'}
                        </span>
                      </div>
                    );
                  })}
                </section>
              )}

              {/* ROUTE 5: ACCOUNT */}
              {activeRoute === 'you' && (
                <section className="p-5 bg-white border-2 border-stone-200 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full bg-emerald-800 text-white flex items-center justify-center text-lg font-extrabold">
                      SA
                    </div>
                    <div>
                      <h1 className="text-base font-extrabold text-stone-900">Siaka Abdul</h1>
                      <p className="text-xs text-stone-500 font-mono">024 555 0192</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCouponDiscount(20);
                      showToast('GH₵ 20.00 Gift Applied!');
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-amber-400 text-stone-950 text-xs font-extrabold cursor-pointer"
                  >
                    Use GH₵ 20 Gift
                  </button>
                </section>
              )}
            </div>

            {/* RIGHT PERSISTENT ANIMATED 3D CARRIER BAG SLOT (Desktop) */}
            <aside className="hidden lg:block w-[360px] shrink-0 sticky top-20 bg-[#F4F3EF] border-2 border-stone-200 rounded-3xl p-4 shadow-xs">
              <AnimatedFoodBag
                cart={cart}
                totalBagItems={totalBagItems}
                finalTotal={finalCheckoutTotal}
                freeDeliveryProgressPct={freeDeliveryProgressPct}
                amountNeededForFreeDelivery={amountNeededForFreeDelivery}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeCartItem}
                onClearCart={clearCart}
                onProceedToCheckout={() => setCheckoutStep('ADDRESS')}
                getUnitPrice={getCartItemUnitPrice}
                onOpenFullBagModal={() => setVisualBagModalOpen(true)}
              />
            </aside>
          </div>
        )}
      </main>

      {/* FLOATING BOTTOM NAVIGATION BAR ON MOBILE */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 flex lg:hidden items-center gap-1.5 px-3 py-2 rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-stone-200 shadow-2xl">
        {[
          { id: 'welcome' as NavRoute, label: 'Welcome', icon: Home },
          { id: 'menu' as NavRoute, label: 'Food', icon: UtensilsCrossed },
          { id: 'explore' as NavRoute, label: 'Search', icon: Compass },
          { id: 'history' as NavRoute, label: 'Orders', icon: History },
        ].map((item) => {
          const Icon = item.icon;
          const active = activeRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveRoute(item.id)}
              className={`min-h-[46px] flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
                active ? 'bg-emerald-700 text-white' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {active && <span>{item.label}</span>}
            </button>
          );
        })}

        {/* Mobile Animated Bag Trigger */}
        <button
          type="button"
          onClick={() => setVisualBagModalOpen(true)}
          className="relative min-h-[46px] flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold bg-amber-400 text-stone-950 shadow-xs cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="font-mono text-xs font-extrabold">{totalBagItems}</span>
        </button>
      </div>

      {/* FULL ANIMATED 3D BAG MODAL (When user clicks Open Bag on Mobile or Desktop) */}
      <VisualBagModal
        isOpen={visualBagModalOpen}
        onClose={() => setVisualBagModalOpen(false)}
        cart={cart}
        totalBagItems={totalBagItems}
        finalTotal={finalCheckoutTotal}
        freeDeliveryProgressPct={freeDeliveryProgressPct}
        amountNeededForFreeDelivery={amountNeededForFreeDelivery}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeCartItem}
        onClearCart={clearCart}
        onProceedToCheckout={() => setCheckoutStep('ADDRESS')}
        getUnitPrice={getCartItemUnitPrice}
      />

      {/* VISUAL PRODUCT CUSTOMIZER MODAL */}
      <ProductModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onConfirmAdd={handleConfirmAdd}
      />

      {/* VISUAL CHECKOUT & MAP PICKER MODALS */}
      <CheckoutModals
        step={checkoutStep}
        setStep={setCheckoutStep}
        selectedBranch={selectedBranch}
        setSelectedBranch={setSelectedBranch}
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        savedLocations={savedLocations}
        onAddSavedLocation={(loc) => setSavedLocations((prev) => [loc, ...prev])}
        courierTier={courierTier}
        setCourierTier={setCourierTier}
        scheduledTime={scheduledTime}
        setScheduledTime={setScheduledTime}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        onApplyCoupon={handleApplyCoupon}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        momoNetwork={momoNetwork}
        setMomoNetwork={setMomoNetwork}
        momoPhone={momoPhone}
        setMomoPhone={setMomoPhone}
        rawSubTotal={rawSubTotal}
        totalThresholdSavings={totalThresholdSavings}
        appliedCouponDiscount={appliedCouponDiscount}
        effectiveDeliveryFee={effectiveDeliveryFee}
        finalCheckoutTotal={finalCheckoutTotal}
        cartCount={cart.length}
        onPlaceOrder={handlePlaceOrder}
        onGoToHistory={() => {
          setCheckoutStep('NONE');
          setActiveRoute('history');
        }}
      />

      {/* PRINTABLE RECEIPT MODAL */}
      <ReceiptModal
        order={activeReceiptOrder}
        onClose={() => setActiveReceiptOrder(null)}
      />
    </div>
  );
}
