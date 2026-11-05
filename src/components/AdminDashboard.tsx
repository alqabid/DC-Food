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
  ArrowLeft,
  RotateCcw,
  Flame,
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
  { id: 'all', label: 'All Food' },
  { id: 'dcpizza', label: 'Pizza' },
  { id: 'dcchicken', label: 'Rice & Chicken' },
  { id: 'packages', label: 'Big Boxes' },
  { id: 'drinks', label: 'Drinks & Sides' },
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
  onResetFactoryDefaults,
  onExitAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('flyers');

  // Flyer Editor Modal State
  const [editingFlyer, setEditingFlyer] = useState<FlyerSlide | null>(null);
  const [isNewFlyer, setIsNewFlyer] = useState(false);

  // Menu Item Editor Modal State
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isNewMenuItem, setIsNewMenuItem] = useState(false);

  // --- Flyer Handlers ---
  const openNewFlyerModal = () => {
    setIsNewFlyer(true);
    setEditingFlyer({
      id: `flyer-${Date.now()}`,
      tag: 'NEW PROMO',
      headline: 'Weekend Special Deal',
      subheadline: 'Freshly prepared and delivered hot.',
      priceCallout: 'GH₵ 99.00',
      ctaText: 'Order Now',
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

  const deleteFlyer = (id: string) => {
    onUpdateFlyers(flyers.filter((f) => f.id !== id));
  };

  // --- Menu Item Handlers ---
  const openNewDishModal = () => {
    setIsNewMenuItem(true);
    setEditingMenuItem({
      id: `dc-${Date.now()}`,
      name: 'New Dish',
      subtitle: 'Special',
      description: 'Freshly prepared with signature DC spices.',
      category: 'dcchicken',
      subCategory: 'Specials',
      basePrice: 95,
      prepTimeMins: '20 mins',
      spiceLevel: 'Medium',
      isPopular: true,
      image: ALL_FOOD_IMAGES[3].url,
      sizes: [
        { id: 'sz-reg', label: 'Regular', servings: 'Serves 1', priceDelta: 0 },
        { id: 'sz-lrg', label: 'Large', servings: 'Serves 2–3', priceDelta: 40 },
      ],
      preferences: ['Standard'],
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

  // --- Order Status Handler ---
  const setOrderStatus = (orderId: string, statusStep: 1 | 2 | 3 | 4) => {
    onUpdateOrders(
      orders.map((o) => (o.id === orderId ? { ...o, statusStep } : o))
    );
  };

  // --- Branch Handler ---
  const toggleBranchStatus = (branchId: string) => {
    onUpdateBranches(
      branches.map((b) => (b.id === branchId ? { ...b, isOpen: !b.isOpen } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 pb-16">
      {/* Clean, Simple Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 md:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <span className="text-base sm:text-lg font-extrabold text-emerald-800">
              DC FOODS · Admin
            </span>
          </div>

          <button
            type="button"
            onClick={onResetFactoryDefaults}
            className="px-3 py-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Reset Default Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 space-y-6">
        {/* 4 Simple Visual Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { id: 'flyers' as AdminTab, label: 'Welcome Flyers', count: flyers.length, icon: Film },
            { id: 'menu' as AdminTab, label: 'Food Menu', count: menuItems.length, icon: UtensilsCrossed },
            { id: 'orders' as AdminTab, label: 'Orders', count: orders.length, icon: ShoppingBag },
            { id: 'branches' as AdminTab, label: 'Branches', count: branches.length, icon: Store },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-3.5 rounded-2xl border-2 font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  active
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono ${
                    active ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FLYERS */}
        {activeTab === 'flyers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-stone-900">
                Welcome Slides
              </h2>
              <button
                type="button"
                onClick={openNewFlyerModal}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Flyer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {flyers.map((flyer) => (
                <div
                  key={flyer.id}
                  className={`bg-white rounded-3xl border-2 overflow-hidden flex flex-col justify-between ${
                    flyer.enabled ? 'border-stone-200' : 'border-stone-200 opacity-55'
                  }`}
                >
                  <div className="relative h-44 bg-stone-100">
                    <img
                      src={flyer.image}
                      alt={flyer.headline}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-amber-400 text-stone-950 font-extrabold text-[11px]">
                      {flyer.tag}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-extrabold text-base leading-snug line-clamp-1">
                        {flyer.headline}
                      </h3>
                      {flyer.priceCallout && (
                        <span className="text-xs font-mono font-bold text-amber-300">
                          {flyer.priceCallout}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFlyerEnabled(flyer.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                        flyer.enabled
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {flyer.enabled ? 'Showing' : 'Hidden'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewFlyer(false);
                          setEditingFlyer(flyer);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFlyer(flyer.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete flyer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FOOD MENU */}
        {activeTab === 'menu' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-stone-900">
                Food Menu
              </h2>
              <button
                type="button"
                onClick={openNewDishModal}
                className="px-4 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-stone-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-xl bg-emerald-700 text-white font-mono font-extrabold text-xs">
                      {formatGhs(item.basePrice)}
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <h3 className="font-extrabold text-sm text-stone-900 line-clamp-1">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewMenuItem(false);
                          setEditingMenuItem(item);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteMenuItem(item.id)}
                        className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 cursor-pointer"
                        aria-label="Delete food"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-stone-900">
              Customer Orders
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border-2 border-stone-200">
                <p className="text-sm font-bold text-stone-500">No orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-4 border-2 border-stone-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-mono font-extrabold text-xs">
                        {order.code}
                      </span>
                      <span className="text-sm font-extrabold text-stone-900">
                        {order.branchName}
                      </span>
                    </div>
                    <span className="font-mono font-extrabold text-base text-emerald-700">
                      {formatGhs(order.total)}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-stone-600">
                    {order.items.map((i) => `${i.quantity}× ${i.name}`).join(' · ')}
                  </p>

                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {(
                      [
                        { step: 1, label: 'Order In', icon: Clock },
                        { step: 2, label: 'Cooking', icon: Flame },
                        { step: 3, label: 'On Bike', icon: Bike },
                        { step: 4, label: 'Arrived', icon: CheckCircle2 },
                      ] as const
                    ).map(({ step, label, icon: Icon }) => {
                      const active = order.statusStep === step;
                      return (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setOrderStatus(order.id, step)}
                          className={`p-2.5 rounded-2xl border-2 text-xs font-extrabold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                            active
                              ? 'bg-emerald-700 text-white border-emerald-700'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: BRANCHES */}
        {activeTab === 'branches' && (
          <div className="space-y-3">
            <h2 className="text-lg font-extrabold text-stone-900">
              Branches
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-3xl bg-white border-2 border-stone-200 flex items-center justify-between gap-3"
                >
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900">{b.name}</h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">{b.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleBranchStatus(b.id)}
                    className={`px-4 py-2 rounded-2xl font-extrabold text-xs cursor-pointer ${
                      b.isOpen
                        ? 'bg-emerald-700 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {b.isOpen ? 'Open' : 'Closed'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SIMPLE FLYER MODAL */}
      {editingFlyer && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={saveFlyer}
            className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-stone-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-stone-900">
                {isNewFlyer ? 'New Flyer' : 'Edit Flyer'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingFlyer(null)}
                className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-stone-500 mb-1">
                  Title
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFlyer.tag}
                    onChange={(e) =>
                      setEditingFlyer({ ...editingFlyer, tag: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 mb-1">
                    Price Sticker
                  </label>
                  <input
                    type="text"
                    value={editingFlyer.priceCallout || ''}
                    onChange={(e) =>
                      setEditingFlyer({ ...editingFlyer, priceCallout: e.target.value })
                    }
                    placeholder="GH₵ 98.00"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-500 mb-1.5">
                  Pick Flyer Picture
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {ALL_FOOD_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() =>
                        setEditingFlyer({ ...editingFlyer, image: img.url })
                      }
                      className={`h-12 rounded-xl overflow-hidden border-2 cursor-pointer ${
                        editingFlyer.image === img.url
                          ? 'border-emerald-600 scale-105'
                          : 'border-transparent opacity-70'
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
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingFlyer(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SIMPLE MENU DISH MODAL */}
      {editingMenuItem && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={saveMenuItem}
            className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-stone-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-stone-900">
                {isNewMenuItem ? 'Add Food' : 'Edit Food'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMenuItem(null)}
                className="p-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-stone-500 mb-1">
                  Food Name
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

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-extrabold text-stone-500 mb-1">
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
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-stone-500 mb-1">
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-sm bg-white"
                  >
                    {ADMIN_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-stone-500 mb-1.5">
                  Pick Food Picture
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {ALL_FOOD_IMAGES.map((img) => (
                    <button
                      key={img.label}
                      type="button"
                      onClick={() =>
                        setEditingMenuItem({ ...editingMenuItem, image: img.url })
                      }
                      className={`h-12 rounded-xl overflow-hidden border-2 cursor-pointer ${
                        editingMenuItem.image === img.url
                          ? 'border-emerald-600 scale-105'
                          : 'border-transparent opacity-70'
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
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingMenuItem(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
