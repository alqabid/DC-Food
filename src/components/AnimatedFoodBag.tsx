/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, Check, X } from 'lucide-react';
import { CartItem } from '../types';
import { formatGhs } from '../data/menuData';

interface AnimatedFoodBagProps {
  cart: CartItem[];
  totalBagItems: number;
  finalTotal: number;
  freeDeliveryProgressPct: number;
  amountNeededForFreeDelivery: number;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  getUnitPrice: (item: CartItem) => number;
  onOpenFullBagModal?: () => void;
}

export const AnimatedFoodBag: React.FC<AnimatedFoodBagProps> = ({
  cart,
  totalBagItems,
  finalTotal,
  freeDeliveryProgressPct,
  amountNeededForFreeDelivery,
  onUpdateQuantity,
  onClearCart,
  onProceedToCheckout,
  getUnitPrice,
  onOpenFullBagModal
}) => {
  const [selectedBagItemId, setSelectedBagItemId] = useState<string | null>(null);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(true);

  const visualPlates = cart.flatMap((item) =>
    Array.from({ length: Math.min(item.quantity, 3) }, (_, idx) => ({
      uniqueKey: `${item.cartItemId}-plate-${idx}`,
      cartItem: item,
      indexInItem: idx
    }))
  );

  const activeItem =
    cart.find((c) => c.cartItemId === selectedBagItemId) || cart[cart.length - 1] || null;

  return (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Bar: Bag Count + Clear */}
      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onOpenFullBagModal) {
                onOpenFullBagModal();
              } else {
                setIsBagOpen((v) => !v);
              }
            }}
            className="min-h-[42px] px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag ({totalBagItems})</span>
          </button>
        </div>

        {cart.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            title="Empty bag"
            className="min-w-[42px] min-h-[42px] rounded-xl text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* REAL ANIMATED 3D CARRIER BAG STAGE */}
      <div
        onClick={() => onOpenFullBagModal && onOpenFullBagModal()}
        className="relative my-3 flex flex-col items-center justify-center py-3 px-2 rounded-3xl bg-gradient-to-b from-stone-100/90 to-stone-200/60 border border-stone-200/90 overflow-hidden cursor-pointer"
      >
        {/* Bag Rope Handles */}
        <motion.div
          animate={{
            y: isBagOpen ? 0 : 4,
            scaleX: isBagOpen ? 1.05 : 0.96
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-28 h-9 border-4 border-amber-900/70 rounded-t-full -mb-2 z-0"
        />

        {/* Physical Takeout Bag Body */}
        <motion.div
          key={totalBagItems}
          initial={{ scale: 0.94, y: 6 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 15 }}
          className="relative w-full max-w-[295px] z-10"
        >
          {/* Animated Top Kraft Paper Flaps */}
          <div className="relative h-7 w-full flex justify-between overflow-visible z-20">
            <motion.div
              initial={{ rotateZ: 0 }}
              animate={{
                rotateZ: isBagOpen ? -18 : 0,
                y: isBagOpen ? -2 : 8
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="w-1/2 h-7 bg-[#D6B588] border-t-2 border-l-2 border-[#B89362] rounded-tl-xl origin-bottom-left shadow-xs"
            />
            <motion.div
              initial={{ rotateZ: 0 }}
              animate={{
                rotateZ: isBagOpen ? 18 : 0,
                y: isBagOpen ? -2 : 8
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              className="w-1/2 h-7 bg-[#CCA878] border-t-2 border-r-2 border-[#B89362] rounded-tr-xl origin-bottom-right shadow-xs"
            />
          </div>

          {/* Bag Interior Cavity + Cutaway Window */}
          <div className="relative min-h-[215px] rounded-b-3xl rounded-t-lg bg-gradient-to-b from-[#C69F6E] via-[#DEC096] to-[#C8A272] border-2 border-[#B38B59] shadow-xl p-3 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 left-2 right-2 h-10 bg-gradient-to-b from-stone-900/45 to-transparent rounded-t-md pointer-events-none" />

            <div className="relative z-20 flex items-center justify-between px-2 pt-1">
              <span className="text-[11px] font-extrabold tracking-wider text-emerald-950 bg-emerald-500/25 px-2 py-0.5 rounded-md border border-emerald-800/20">
                DC FOODS BAG
              </span>
              {amountNeededForFreeDelivery === 0 && cart.length > 0 && (
                <span className="text-[10px] font-extrabold bg-emerald-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  FREE RIDER
                </span>
              )}
            </div>

            {/* Cutaway Front Window Showing Real Food Inside the Bag */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 my-2 min-h-[145px] rounded-2xl bg-stone-900/15 backdrop-blur-[2px] border-2 border-dashed border-[#9E7644]/60 p-2.5 flex items-center justify-center"
            >
              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div
                    key="empty-bag"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    className="flex flex-col items-center justify-center text-center py-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center text-stone-600 mb-1.5">
                      <Plus className="w-6 h-6 text-emerald-800" />
                    </div>
                    <span className="text-xs font-extrabold text-stone-800">Empty Bag</span>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 w-full place-items-center">
                    {visualPlates.slice(0, 9).map((plate, i) => {
                      const isSelected = activeItem?.cartItemId === plate.cartItem.cartItemId;
                      return (
                        <motion.button
                          key={plate.uniqueKey}
                          layout
                          type="button"
                          onClick={() => setSelectedBagItemId(plate.cartItem.cartItemId)}
                          initial={{ y: -140, scale: 0.3, opacity: 0, rotate: -18 }}
                          animate={{
                            y: 0,
                            scale: isSelected ? 1.06 : 1,
                            opacity: 1,
                            rotate: (i % 2 === 0 ? -1 : 1) * ((i % 3) + 1) * 2
                          }}
                          exit={{ y: -90, scale: 0.2, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 18,
                            delay: i * 0.03
                          }}
                          className={`relative w-16 h-16 rounded-2xl overflow-hidden border-2 shadow-md cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-emerald-600 ring-2 ring-emerald-500'
                              : 'border-white'
                          }`}
                        >
                          <img
                            src={plate.cartItem.product.image}
                            alt={plate.cartItem.product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {plate.indexInItem === 0 && plate.cartItem.quantity > 1 && (
                            <span className="absolute top-0.5 right-0.5 bg-emerald-700 text-white text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                              ×{plate.cartItem.quantity}
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-2 border-t border-[#A98250]/60 flex items-center justify-center">
              <div className="w-16 h-1 bg-[#9E7644]/50 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Selected Food Item Quick Adjuster Strip */}
      {activeItem && (
        <div className="mb-3 p-3 bg-white border border-stone-200 rounded-2xl flex items-center justify-between gap-2.5 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={activeItem.product.image}
              alt={activeItem.product.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-extrabold text-stone-900 truncate">
                {activeItem.product.name}
              </h4>
              <div className="text-xs font-extrabold font-mono text-emerald-800">
                {formatGhs(getUnitPrice(activeItem) * activeItem.quantity)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onUpdateQuantity(activeItem.cartItemId, -1)}
              aria-label="Decrease"
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-red-100 text-stone-800 hover:text-red-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-mono text-sm font-extrabold text-stone-900">
              {activeItem.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(activeItem.cartItemId, 1)}
              aria-label="Increase"
              className="w-10 h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Horizontal Mini Picture Tabs when multiple items are inside bag */}
      {cart.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-2">
          {cart.map((item) => {
            const isCurr = activeItem?.cartItemId === item.cartItemId;
            return (
              <button
                key={item.cartItemId}
                type="button"
                onClick={() => setSelectedBagItemId(item.cartItemId)}
                className={`p-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isCurr ? 'border-emerald-700 bg-emerald-50' : 'border-stone-200 bg-white'
                }`}
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <span className="text-xs font-mono font-extrabold pr-1">×{item.quantity}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Visual Free Delivery Progress Bar */}
      {cart.length > 0 && (
        <div className="mb-3 px-3 py-2 rounded-2xl bg-white border border-stone-200">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="text-emerald-800">
              {amountNeededForFreeDelivery === 0
                ? 'Free Rider Delivery!'
                : `+${formatGhs(amountNeededForFreeDelivery)} = Free Rider`}
            </span>
            <span className="font-mono text-stone-500">{freeDeliveryProgressPct}%</span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryProgressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Total & Giant Checkout Button */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500">Total</span>
          <span className="text-lg font-extrabold font-mono tabular-nums text-emerald-800">
            {formatGhs(cart.length > 0 ? finalTotal : 0)}
          </span>
        </div>

        <button
          type="button"
          disabled={cart.length === 0}
          onClick={onProceedToCheckout}
          className="w-full min-h-[52px] py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed shadow-md"
        >
          <span>Buy Now</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

interface VisualBagModalProps extends AnimatedFoodBagProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualBagModal: React.FC<VisualBagModalProps> = ({
  isOpen,
  onClose,
  ...bagProps
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, scale: 0.92, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 80, scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#F4F3EF] w-full sm:max-w-[440px] rounded-t-3xl sm:rounded-3xl border border-stone-200 p-5 max-h-[92vh] overflow-y-auto shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close bag"
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white text-stone-800 shadow-md flex items-center justify-center hover:bg-stone-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatedFoodBag
          {...bagProps}
          onProceedToCheckout={() => {
            onClose();
            bagProps.onProceedToCheckout();
          }}
        />
      </motion.div>
    </div>
  );
};
