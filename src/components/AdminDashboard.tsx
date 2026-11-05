import React, { useState } from 'react';
import {
  Film,
  UtensilsCrossed,
  ShoppingBag,
  Store,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RotateCcw,
  ExternalLink,
  Copy,
  Flame,
  Tag,
  TrendingUp,
  Bike,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import {
  Branch,
  MainCategory,
  FlyerSlide,
  MenuItem,
  OrderRecord,
  PromoVoucher,
} from '../types';
import { ALL_FOOD_IMAGES, COMMON_EXTRAS, formatGhs } from '../data/menuData';

interface AdminDashboardProps {
  flyers: FlyerSlide[];
  onUpdateFlyers: (flyers: FlyerSlide[]) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  orders: OrderRecord[];
  onUpdateOrders: (orders: OrderRecord[]) => void;
  branches: Branch[];
  onUpdateBranches: (branches: Branch[]) => void;
  vouchers: PromoVoucher[];
  onUpdateVouchers: (vouchers: PromoVoucher[]) => void;
  onResetFactoryDefaults: () => void;
  onExitAdmin: () => void;
}

type AdminTab = 'flyers' | 'menu' | 'orders' | 'branches';

const ADMIN_CATEGORIES: { id: MainCategory; label: string }[] = [
  { id: 'all', label: 'All Food Menu' },
  { id: 'dcpizza', label: 'DC Pizza' },
  { id: 'dcchicken', label: 'Rice, Jollof & Chicken' },
  { id: 'packages', label: 'Family & Squad Boxes' },
  { id: 'drinks', label: 'Drinks & Ghanaian Sides' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  flyers,
  onUpdateFlyers,
  menuItems,
  onUpdateMenuItems,
  orders,
  onUpdateOrders,
  branches,
  onUpdateBranches,
  vouchers,
  onUpdateVouchers,
  onResetFactoryDefaults,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('flyers');
  const [copiedLink, setCopiedLink] = useState(false);

  // Flyer Editor Modal State
  const [editingFlyer, setEditingFlyer] = useState<FlyerSlide | null>(null);
  const [isNewFlyer, setIsNewFlyer] = useState(false);

  // Menu Item Editor Modal State
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isNewMenuItem, setIsNewMenuItem] = useState(false);

  // New Voucher State
  const [newVoucherCode, setNewVoucherCode] = useState('');
  const [newVoucherAmount, setNewVoucherAmount] = useState('20');
  const [newVoucherDesc, setNewVoucherDesc] = useState('');

  const adminUrl = `${window.location.origin}/admin`;

  const copyAdminLink = () => {
    navigator.clipboard?.writeText(adminUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // KPI Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const activeOrdersCount = orders.filter((o) => o.statusStep < 4).length;
  const activeFlyersCount = flyers.filter((f) => f.enabled).length;

  // --- Flyer Handlers ---
  const openNewFlyerModal = () => {
    setIsNewFlyer(true);
    setEditingFlyer({
      id: `flyer-${Date.now()}`,
      tag: 'NEW WEEKEND SPECIAL',
      headline: 'Hot Firewood Jollof & Crispy Wings Combo',
      subheadline: 'Fresh off the grill — limited time offer across all DC Foods branches.',
      priceCallout: 'GH₵ 99.00',
      ctaText: 'Order Combo Now',
      image: ALL_FOOD_IMAGES[0].url,
      targetCategory: 'all',
      enabled: true,
    });
  };

  const saveFlyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFlyer) return;
    if (isNewFlyer) {
      onUpdateFlyers([editingFlyer, ...flyers]);
    } else {
      onUpdateFlyers(flyers.map((f) => (f.id === editingFlyer.id ? editingFlyer : f)));
    }
    setEditingFlyer(null);
  };

  const toggleFlyerEnabled = (id: string) => {
    onUpdateFlyers(
      flyers.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const moveFlyer = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= flyers.length) return;
    const copy = [...flyers];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    onUpdateFlyers(copy);
  };

  const deleteFlyer = (id: string) => {
    onUpdateFlyers(flyers.filter((f) => f.id !== id));
  };

  // --- Menu Item Handlers ---
  const openNewDishModal = () => {
    setIsNewMenuItem(true);
    setEditingMenuItem({
      id: `dc-${Date.now()}`,
      name: 'New Signature Feast',
      subtitle: 'Chef Special',
      description: 'Freshly prepared with signature DC spices and served piping hot.',
      category: 'dcchicken',
      subCategory: 'Specials',
      basePrice: 95,
      wasPrice: 115,
      promoFamily: 'FLASH_DEAL',
      prepTimeMins: '18–22 mins',
      spiceLevel: 'Medium',
      isPopular: true,
      image: ALL_FOOD_IMAGES[3].url,
      sizes: [
        { id: 'sz-reg', label: 'Regular Pack', servings: 'Serves 1', priceDelta: 0 },
        { id: 'sz-lrg', label: 'Jumbo Pack', servings: 'Serves 2–3', priceDelta: 40 },
      ],
      preferences: ['Crispy Fried Chicken', 'Chargrilled Peri-Peri Chicken'],
      extras: COMMON_EXTRAS,
    });
  };

  const saveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMenuItem) return;
    if (isNewMenuItem) {
      onUpdateMenuItems([editingMenuItem, ...menuItems]);
    } else {
      onUpdateMenuItems(
        menuItems.map((m) => (m.id === editingMenuItem.id ? editingMenuItem : m))
      );
    }
    setEditingMenuItem(null);
  };

  const deleteMenuItem = (id: string) => {
    onUpdateMenuItems(menuItems.filter((m) => m.id !== id));
  };

  const toggleDishPopular = (id: string) => {
    onUpdateMenuItems(
      menuItems.map((m) => (m.id === id ? { ...m, isPopular: !m.isPopular } : m))
    );
  };

  const toggleDishFlashDeal = (id: string) => {
    onUpdateMenuItems(
      menuItems.map((m) =>
        m.id === id
          ? {
              ...m,
              promoFamily: m.promoFamily === 'FLASH_DEAL' ? undefined : 'FLASH_DEAL',
            }
          : m
      )
    );
  };

  // --- Order Status Handler ---
  const setOrderStatus = (orderId: string, statusStep: 1 | 2 | 3 | 4) => {
    onUpdateOrders(
      orders.map((o) => (o.id === orderId ? { ...o, statusStep } : o))
    );
  };

  // --- Branch & Voucher Handlers ---
  const toggleBranchStatus = (branchId: string) => {
    onUpdateBranches(
      branches.map((b) => (b.id === branchId ? { ...b, isOpen: !b.isOpen } : b))
    );
  };

  const handleAddVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newVoucherCode.trim().toUpperCase();
    const amountNum = Math.max(5, Number(newVoucherAmount) || 20);
    if (!cleanCode) return;
    const created: PromoVoucher = {
      code: cleanCode,
      discountAmount: amountNum,
      description: newVoucherDesc.trim() || `GH₵ ${amountNum}.00 Off Promo Voucher`,
      active: true,
    };
    onUpdateVouchers([
      created,
      ...vouchers.filter((v) => v.code !== cleanCode),
    ]);
    setNewVoucherCode('');
    setNewVoucherDesc('');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Top Admin Command Bar */}
      <header className="sticky top-0 z-40 bg-stone-950 text-white border-b border-stone-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-extrabold text-lg text-white shadow">
              DC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">
                  DC FOODS ADMIN STUDIO
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                  Hidden Portal
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Manage IG Welcome Flyers, Dishes, Prices, Live Orders & Branches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={copyAdminLink}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              title="Copy Secret Admin URL"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copiedLink ? 'Admin Link Copied!' : 'Copy Admin Link'}</span>
            </button>

            <button
              type="button"
              onClick={onResetFactoryDefaults}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-rose-950/80 text-stone-300 hover:text-rose-200 text-xs font-bold flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              title="Reset Demo Data to Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Store</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Top KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
              <span>IG Loop Flyers</span>
              <Film className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1 font-mono tabular-nums">
              {activeFlyersCount}{' '}
              <span className="text-sm font-sans font-medium text-stone-400">
                / {flyers.length} active
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
              <span>Menu Dishes</span>
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            </div>
            <div className="font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1 font-mono tabular-nums">
              {menuItems.length}{' '}
              <span className="text-sm font-sans font-medium text-stone-400">items</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
              <span>Active Orders</span>
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-extrabold text-2xl sm:text-3xl text-stone-900 mt-1 font-mono tabular-nums">
              {activeOrdersCount}{' '}
              <span className="text-sm font-sans font-medium text-stone-400">in kitchen/bike</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase">
              <span>Total Sales</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-extrabold text-2xl sm:text-3xl text-emerald-700 mt-1 font-mono tabular-nums">
              {formatGhs(totalRevenue)}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-stone-200/90 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('flyers')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'flyers'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Welcome Flyers (IG Slides)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'menu'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & Prices ({menuItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Live Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Branches & Promo Codes</span>
          </button>
        </div>

        {/* TAB 1: WELCOME FLYERS (IG LOOP SLIDES) */}
        {activeTab === 'flyers' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200/90">
              <div>
                <h2 className="font-extrabold text-lg sm:text-xl text-stone-900">
                  Welcome Page News & Promo Flyers
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  These flyers auto-play in an Instagram Story loop on the customer Welcome Page.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewFlyerModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Flyer Slide</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flyers.map((flyer, index) => (
                <div
                  key={flyer.id}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between ${
                    flyer.enabled
                      ? 'border-stone-200/90 shadow-sm'
                      : 'border-stone-200 opacity-60'
                  }`}
                >
                  <div>
                    <div className="relative h-48 bg-stone-900">
                      <img
                        src={flyer.image}
                        alt={flyer.headline}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-mono font-extrabold text-xs tabular-nums">
                          Slide #{index + 1}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 font-extrabold text-xs">
                          {flyer.tag}
                        </span>
                      </div>
                      {flyer.priceCallout && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white text-stone-950 font-mono font-extrabold text-xs">
                          {flyer.priceCallout}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <h3 className="font-extrabold text-lg leading-tight">
                          {flyer.headline}
                        </h3>
                        <p className="text-xs text-stone-200 line-clamp-1 mt-0.5">
                          {flyer.subheadline}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between gap-2 bg-stone-50 border-t border-stone-100">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveFlyer(index, -1)}
                        disabled={index === 0}
                        className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-40 hover:bg-stone-100 cursor-pointer"
                        title="Move Earlier"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFlyer(index, 1)}
                        disabled={index === flyers.length - 1}
                        className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-40 hover:bg-stone-100 cursor-pointer"
                        title="Move Later"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleFlyerEnabled(flyer.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                          flyer.enabled
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {flyer.enabled ? (
                          <>
                            <Eye className="w-3.5 h-3.5" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" /> Hidden
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsNewFlyer(false);
                          setEditingFlyer(flyer);
                        }}
                        className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 cursor-pointer"
                        title="Edit Flyer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteFlyer(flyer.id)}
                        className="p-2 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Flyer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MENU & DISHES */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-stone-200/90">
              <div>
                <h2 className="font-extrabold text-lg sm:text-xl text-stone-900">
                  Menu Dishes & Price Control
                </h2>
                <p className="text-xs sm:text-sm text-stone-500">
                  Add new meals, adjust prices, or toggle Flash Deals in real time.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewDishModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-40 bg-stone-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-950/80 text-white font-extrabold text-xs uppercase">
                        {item.category}
                      </div>
                      <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-emerald-700 text-white font-mono font-extrabold text-sm tabular-nums shadow">
                        {formatGhs(item.basePrice)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-extrabold text-base text-stone-900">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <button
                          type="button"
                          onClick={() => toggleDishPopular(item.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                            item.isPopular
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          <Check className="w-3 h-3" /> Popular
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleDishFlashDeal(item.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                            item.promoFamily === 'FLASH_DEAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          <Flame className="w-3 h-3" /> Flash Deal
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500 font-mono tabular-nums">
                      Prep: {item.prepTimeMins}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewMenuItem(false);
                          setEditingMenuItem(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1 hover:bg-stone-100 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMenuItem(item.id)}
                        className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LIVE ORDERS & DISPATCH */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90">
              <h2 className="font-extrabold text-lg sm:text-xl text-stone-900">
                Live Kitchen & Rider Dispatch Control
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Advance order stages in real time. Customers see this progress bar update live on their screen.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-lg text-stone-800">
                  No Orders Placed Yet
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  Orders placed by customers will appear here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-3 py-1 rounded-lg bg-stone-900 text-white font-mono font-extrabold text-xs">
                          {order.code}
                        </span>
                        <span className="font-extrabold text-sm text-stone-900">
                          {order.branchName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-xs uppercase">
                          {order.deliveryType} · {order.paymentMethod}
                        </span>
                        <span className="text-xs text-stone-400 font-mono tabular-nums">
                          {order.createdAt}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 font-medium">
                        {order.items
                          .map((i) => `${i.quantity}× ${i.name} (${i.size})`)
                          .join(' · ')}
                      </div>

                      {order.address && (
                        <div className="text-xs text-stone-500">
                          📍 {order.address} · Rider: {order.riderName} ({order.riderPhone})
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                      <div className="font-mono font-extrabold text-lg text-emerald-700 tabular-nums mr-2">
                        {formatGhs(order.total)}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(
                          [
                            { step: 1, label: 'Order In', icon: Clock },
                            { step: 2, label: 'Cooking', icon: Flame },
                            { step: 3, label: 'On Bike', icon: Bike },
                            { step: 4, label: 'Arrived', icon: CheckCircle2 },
                          ] as const
                        ).map(({ step, label, icon: Icon }) => (
                          <button
                            key={step}
                            type="button"
                            onClick={() => setOrderStatus(order.id, step)}
                            className={`px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer ${
                              order.statusStep === step
                                ? 'bg-emerald-700 text-white shadow'
                                : order.statusStep > step
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: BRANCHES & PROMO CODES */}
        {activeTab === 'branches' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Branches Control */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  DC FOODS Branches
                </h3>
                <p className="text-xs text-stone-500">
                  Toggle branch open/closed status for customer checkout.
                </p>
              </div>

              <div className="space-y-3">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900">
                        {b.name}
                      </h4>
                      <p className="text-xs text-stone-500">{b.address}</p>
                      <p className="text-xs font-bold text-emerald-700 mt-1 font-mono tabular-nums">
                        ETA: {b.etaMins} · {b.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleBranchStatus(b.id)}
                      className={`px-4 py-2 rounded-xl font-extrabold text-xs cursor-pointer ${
                        b.isOpen
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-300 text-stone-700'
                      }`}
                    >
                      {b.isOpen ? 'OPEN' : 'CLOSED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Vouchers Control */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 space-y-4">
              <div>
                <h3 className="font-extrabold text-lg text-stone-900">
                  Promo Vouchers
                </h3>
                <p className="text-xs text-stone-500">
                  Create GH₵ discount codes for your Instagram flyers and promos.
                </p>
              </div>

              <form onSubmit={handleAddVoucher} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="CODE (e.g. FRIDAY25)"
                  value={newVoucherCode}
                  onChange={(e) => setNewVoucherCode(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-extrabold uppercase"
                />
                <input
                  type="number"
                  placeholder="GH₵ Off (e.g. 25)"
                  value={newVoucherAmount}
                  onChange={(e) => setNewVoucherAmount(e.target.value)}
                  min={5}
                  max={200}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Voucher
                </button>
              </form>

              <div className="space-y-2.5">
                {vouchers.map((v) => (
                  <div
                    key={v.code}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Tag className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="font-mono font-extrabold text-sm text-stone-900">
                          {v.code}
                        </span>
                        <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-extrabold text-xs tabular-nums">
                          GH₵ {v.discountAmount} OFF
                        </span>
                        <p className="text-xs text-stone-500">{v.description}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateVouchers(vouchers.filter((item) => item.code !== v.code))
                      }
                      className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLYER MODAL */}
      {editingFlyer && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={saveFlyer}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-xl text-stone-900">
                {isNewFlyer ? 'Create Welcome Flyer Slide' : 'Edit Flyer Slide'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFlyer(null)}
                className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Flyer Headline
                </label>
                <input
                  type="text"
                  required
                  value={editingFlyer.headline}
                  onChange={(e) =>
                    setEditingFlyer({ ...editingFlyer, headline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Short Subtitle / News Line
                </label>
                <input
                  type="text"
                  required
                  value={editingFlyer.subheadline}
                  onChange={(e) =>
                    setEditingFlyer({ ...editingFlyer, subheadline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Top Tag Badge
                </label>
                <input
                  type="text"
                  required
                  value={editingFlyer.tag}
                  onChange={(e) =>
                    setEditingFlyer({ ...editingFlyer, tag: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Price / Promo Sticker
                </label>
                <input
                  type="text"
                  value={editingFlyer.priceCallout || ''}
                  onChange={(e) =>
                    setEditingFlyer({ ...editingFlyer, priceCallout: e.target.value })
                  }
                  placeholder="e.g. From GH₵ 98.00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Button CTA Text
                </label>
                <input
                  type="text"
                  required
                  value={editingFlyer.ctaText}
                  onChange={(e) =>
                    setEditingFlyer({ ...editingFlyer, ctaText: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Target Menu Category
                </label>
                <select
                  value={editingFlyer.targetCategory || 'all'}
                  onChange={(e) =>
                    setEditingFlyer({
                      ...editingFlyer,
                      targetCategory: e.target.value as MainCategory,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold bg-white"
                >
                  {ADMIN_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1.5">
                  Choose Flyer Artwork or Paste Image URL
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {ALL_FOOD_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() =>
                        setEditingFlyer({ ...editingFlyer, image: img.url })
                      }
                      className={`h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        editingFlyer.image === img.url
                          ? 'border-emerald-600 scale-105 shadow'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editingFlyer.image}
                  onChange={(e) =>
                    setEditingFlyer({ ...editingFlyer, image: e.target.value })
                  }
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingFlyer(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Flyer Slide</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MENU DISH MODAL */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={saveMenuItem}
            className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-stone-200 my-8"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-xl text-stone-900">
                {isNewMenuItem ? 'Add New Menu Dish' : 'Edit Menu Dish'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMenuItem(null)}
                className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Dish Name
                </label>
                <input
                  type="text"
                  required
                  value={editingMenuItem.name}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Price (GH₵)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={editingMenuItem.basePrice}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      basePrice: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Category
                </label>
                <select
                  value={editingMenuItem.category}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      category: e.target.value as Exclude<MainCategory, 'all'>,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 font-bold text-sm bg-white"
                >
                  {ADMIN_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingMenuItem.description}
                  onChange={(e) =>
                    setEditingMenuItem({
                      ...editingMenuItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold uppercase text-stone-500 mb-1.5">
                  Dish Photo
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {ALL_FOOD_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() =>
                        setEditingMenuItem({ ...editingMenuItem, image: img.url })
                      }
                      className={`h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        editingMenuItem.image === img.url
                          ? 'border-emerald-600 scale-105 shadow'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={editingMenuItem.image}
                  onChange={(e) =>
                    setEditingMenuItem({ ...editingMenuItem, image: e.target.value })
                  }
                  placeholder="Or paste custom image URL..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingMenuItem(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Dish</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
