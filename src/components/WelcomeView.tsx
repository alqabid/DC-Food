import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  UtensilsCrossed,
  Pause,
  Play,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { MainCategory, FlyerSlide, MenuItem } from '../types';
import {
  IMG_BANNER_FEAST,
  IMG_JOLLOF,
  IMG_PIZZA,
  IMG_SOBOLO,
  formatGhs,
} from '../data/menuData';

interface WelcomeViewProps {
  flyers: FlyerSlide[];
  menuItems: MenuItem[];
  onEnterMenu: (category?: MainCategory) => void;
  onSelectDish: (item: MenuItem) => void;
  onOpenAdmin: () => void;
}

const SLIDE_DURATION_MS = 4800;
const TICK_MS = 60;

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  flyers,
  menuItems,
  onEnterMenu,
  onSelectDish,
  onOpenAdmin,
}) => {
  const activeFlyers = flyers.filter((f) => f.enabled);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const safeIndex = activeFlyers.length > 0 ? currentIndex % activeFlyers.length : 0;
  const currentFlyer = activeFlyers[safeIndex];

  useEffect(() => {
    if (activeFlyers.length === 0 || isPaused) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const step = (TICK_MS / SLIDE_DURATION_MS) * 100;
        if (prev + step >= 100) {
          setDirection(1);
          setCurrentIndex((idx) => (idx + 1) % activeFlyers.length);
          return 0;
        }
        return prev + step;
      });
    }, TICK_MS);

    return () => window.clearInterval(timer);
  }, [activeFlyers.length, isPaused, safeIndex]);

  const goToSlide = (index: number) => {
    if (activeFlyers.length === 0) return;
    const nextIndex = (index + activeFlyers.length) % activeFlyers.length;
    setDirection(nextIndex >= safeIndex ? 1 : -1);
    setCurrentIndex(nextIndex);
    setProgress(0);
  };

  const handleNext = () => {
    goToSlide(safeIndex + 1);
  };

  const handlePrev = () => {
    goToSlide(safeIndex - 1);
  };

  const handleFlyerAction = (flyer: FlyerSlide) => {
    if (flyer.targetProductId) {
      const targetItem = menuItems.find((m) => m.id === flyer.targetProductId);
      if (targetItem) {
        onSelectDish(targetItem);
        return;
      }
    }
    onEnterMenu(flyer.targetCategory || 'all');
  };

  const featuredMenuPreview = menuItems
    .filter((item) => item.isPopular || item.promoFamily === 'FLASH_DEAL')
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-4">
      {/* Main Welcome & IG Story Flyer Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left / Primary Column: Instagram-Style Automated Looping Flyer Deck */}
        <div className="lg:col-span-7 xl:col-span-8">
          {currentFlyer ? (
            <div
              className="relative rounded-[2rem] overflow-hidden bg-stone-950 shadow-2xl border border-stone-900/15 select-none h-[490px] sm:h-[540px] flex flex-col justify-between"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {/* Animated Slide Background Image */}
              <AnimatePresence initial={false} custom={direction} mode="sync">
                <motion.div
                  key={currentFlyer.id}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    scale: 1.08,
                    x: direction > 0 ? 70 : -70,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.96,
                    x: direction > 0 ? -70 : 70,
                  }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <motion.img
                    src={currentFlyer.image}
                    alt={currentFlyer.headline}
                    initial={{ scale: 1 }}
                    animate={{ scale: isPaused ? 1.03 : 1.09 }}
                    transition={{ duration: 5.2, ease: 'linear' }}
                    className="w-full h-full object-cover"
                  />
                  {/* Scrim Overlays for crisp flyer readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/35" />
                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950/85 via-stone-950/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Top Section: IG Story Progress Bars + Flyer Header */}
              <div className="relative z-20 p-4 sm:p-6 space-y-3.5">
                {/* Segmented IG Story Progress Bars */}
                <div className="flex items-center gap-1.5">
                  {activeFlyers.map((flyer, idx) => {
                    const fillWidth =
                      idx < safeIndex ? 100 : idx === safeIndex ? progress : 0;
                    return (
                      <button
                        key={flyer.id}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`Slide ${idx + 1}: ${flyer.headline}`}
                        className="flex-1 h-1.5 rounded-full bg-white/25 overflow-hidden cursor-pointer focus:outline-none"
                      >
                        <div
                          className="h-full bg-white rounded-full transition-[width] duration-75 ease-linear"
                          style={{ width: `${fillWidth}%` }}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Story Author / Live News Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-700 border-2 border-amber-400 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                      DC
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-extrabold text-sm tracking-tight">
                          DC FOODS FLYERS
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-300">
                          News & Promos
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 font-mono tabular-nums">
                        {safeIndex + 1} / {activeFlyers.length}
                      </p>
                    </div>
                  </div>

                  {/* Pause / Play toggle */}
                  <button
                    type="button"
                    onClick={() => setIsPaused((p) => !p)}
                    className="w-9 h-9 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
                    title={isPaused ? 'Resume slide loop' : 'Pause slide loop'}
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4 fill-current" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Left / Right Visible Nav Buttons */}
              <div className="relative z-20 flex items-center justify-between px-3 sm:px-5 pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="pointer-events-auto w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-transform active:scale-90 shadow-lg cursor-pointer"
                  aria-label="Previous flyer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="pointer-events-auto w-11 h-11 rounded-2xl bg-black/40 hover:bg-black/65 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-transform active:scale-90 shadow-lg cursor-pointer"
                  aria-label="Next flyer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Flyer Content Poster */}
              <div className="relative z-20 p-5 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFlyer.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-xl space-y-4"
                  >
                    {/* Flyer Tag + Price Sticker */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg bg-amber-400 text-stone-950">
                        {currentFlyer.tag}
                      </span>
                      {currentFlyer.priceCallout && (
                        <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-stone-950 font-extrabold text-sm font-mono tabular-nums shadow-lg">
                          {currentFlyer.priceCallout}
                        </span>
                      )}
                    </div>

                    {/* Headline & Short Subtitle */}
                    <div>
                      <h1 className="font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-[1.06] drop-shadow-sm">
                        {currentFlyer.headline}
                      </h1>
                      <p className="text-stone-200 text-sm sm:text-base font-medium mt-2 max-w-lg">
                        {currentFlyer.subheadline}
                      </p>
                    </div>

                    {/* Action CTA */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleFlyerAction(currentFlyer)}
                        className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-xl flex items-center gap-2.5 transition-all active:scale-95 cursor-pointer"
                      >
                        <span>{currentFlyer.ctaText}</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEnterMenu('all')}
                        className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-sm sm:text-base transition-all cursor-pointer"
                      >
                        Full Picture Menu
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : null}

          {/* Flyer Story Thumbnail Strip (Tap any flyer to jump straight to it) */}
          {activeFlyers.length > 1 && (
            <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
              {activeFlyers.map((flyer, idx) => {
                const isCurrent = idx === safeIndex;
                return (
                  <button
                    key={flyer.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`group relative flex items-center gap-3 p-2 pr-4 rounded-2xl border text-left transition-all shrink-0 cursor-pointer ${
                      isCurrent
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]'
                        : 'bg-white text-stone-800 border-stone-200/80 hover:border-emerald-600/50'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-2 ${
                        isCurrent ? 'ring-amber-400' : 'ring-transparent'
                      }`}
                    >
                      <img
                        src={flyer.image}
                        alt={flyer.headline}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0">
                      <span
                        className={`block text-[10px] font-extrabold uppercase tracking-wider ${
                          isCurrent ? 'text-amber-400' : 'text-emerald-700'
                        }`}
                      >
                        {flyer.tag}
                      </span>
                      <span className="block font-bold text-xs sm:text-sm truncate max-w-[145px]">
                        {flyer.headline}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Visual Welcome Greeting & Quick Tap Entry */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-4 bg-white rounded-[2rem] p-5 sm:p-7 border border-stone-200/80 shadow-sm">
          <div className="space-y-5">
            {/* Warm Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-700" />
              Welcome to DC FOODS
            </div>

            <div className="space-y-2">
              <h2 className="font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight leading-tight">
                Hot Party Jollof, Crispy Chicken & Wood-Fired Pizza
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Tap any picture below to pack your food bag in seconds.
              </p>
            </div>

            {/* Visual Picture Category Tiles */}
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-stone-400 mb-2.5">
                Tap a Picture to Browse
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onEnterMenu('dcchicken')}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-600/40 transition-all text-left group cursor-pointer"
                >
                  <img
                    src={IMG_JOLLOF}
                    alt="Rice & Chicken"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-sm text-stone-900 block truncate">
                      Rice & Chicken
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">Jollof & Wings</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onEnterMenu('dcpizza')}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-600/40 transition-all text-left group cursor-pointer"
                >
                  <img
                    src={IMG_PIZZA}
                    alt="Pizza"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-sm text-stone-900 block truncate">
                      Loaded Pizza
                    </span>
                    <span className="text-[11px] font-bold text-amber-600">2-for-1 Deals</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onEnterMenu('packages')}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-600/40 transition-all text-left group cursor-pointer"
                >
                  <img
                    src={IMG_BANNER_FEAST}
                    alt="Big Boxes"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-sm text-stone-900 block truncate">
                      Family Boxes
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">Squad Feasts</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onEnterMenu('drinks')}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-600/40 transition-all text-left group cursor-pointer"
                >
                  <img
                    src={IMG_SOBOLO}
                    alt="Drinks & Sides"
                    className="w-12 h-12 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0">
                    <span className="font-extrabold text-sm text-stone-900 block truncate">
                      Drinks & Sides
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">Sobolo & Kelewele</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Primary Full-Width Enter Menu Button */}
          <div className="pt-3 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" /> 6 Branches Open
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> 20–30 min Delivery
              </span>
            </div>

            <button
              type="button"
              onClick={() => onEnterMenu('all')}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Open Full Food Menu</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Visual Strip: Today's Hot Picks (1-Tap Order) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-stone-900">
                Today&apos;s Hot Picks
              </h3>
              <p className="text-xs text-stone-500">Tap any dish to pack into your bag</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEnterMenu('all')}
            className="text-sm font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>See All Dishes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredMenuPreview.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectDish(item)}
              className="group bg-white rounded-3xl p-3 border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-emerald-600/40 transition-all text-left flex flex-col justify-between cursor-pointer"
            >
              <div className="relative h-36 sm:h-40 rounded-2xl overflow-hidden bg-stone-100 mb-3 w-full">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-xl bg-stone-950/85 backdrop-blur-md text-white font-mono font-extrabold text-xs tabular-nums">
                  {formatGhs(item.basePrice)}
                </div>
              </div>
              <div className="px-1">
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900 line-clamp-1">
                  {item.name}
                </h4>
                <span className="text-xs font-bold text-emerald-700 mt-1 inline-flex items-center gap-1">
                  Tap to Order <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Invisible / Discreet Link Below the Welcome Page to Open Admin */}
      <div className="pt-8 pb-2 flex justify-center">
        <a
          href="/admin"
          onClick={(e) => {
            e.preventDefault();
            onOpenAdmin();
          }}
          aria-label="Admin Portal"
          className="px-6 py-2 text-[11px] font-semibold text-stone-300/40 hover:text-stone-400 transition-colors select-none cursor-pointer"
        >
          © DC FOODS
        </a>
      </div>
    </div>
  );
};
