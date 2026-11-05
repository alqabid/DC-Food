/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Flame, Users } from 'lucide-react';
import { MenuItem, ProductExtra, ProductSize } from '../types';
import { formatGhs } from '../data/menuData';

interface ProductModalProps {
  product: MenuItem | null;
  onClose: () => void;
  onConfirmAdd: (
    product: MenuItem,
    size: ProductSize,
    preference: string,
    constituent: string | undefined,
    extras: ProductExtra[],
    note: string,
    quantity: number
  ) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onConfirmAdd
}) => {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedPreference, setSelectedPreference] = useState<string>('');
  const [selectedConstituent, setSelectedConstituent] = useState<string | undefined>(undefined);
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [Quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedPreference(product.preferences[0] || 'Standard');
      setSelectedConstituent(product.constituentsOptions?.[0]);
      setSelectedExtras([]);
      setQuantity(1);
    }
  }, [product]);

  if (!product || !selectedSize) return null;

  const toggleExtra = (extra: ProductExtra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id) ? prev.filter((e) => e.id !== extra.id) : [...prev, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = product.basePrice + selectedSize.priceDelta + extrasTotal;

  const thresholdDiscount =
    product.thresholdQty && product.thresholdSaveAmount && Quantity >= product.thresholdQty
      ? Math.floor(Quantity / product.thresholdQty) * product.thresholdSaveAmount
      : 0;

  const finalLineTotal = unitPrice * Quantity - thresholdDiscount;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-[520px] rounded-t-3xl sm:rounded-3xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle */}
        <div className="sm:hidden pt-2.5 pb-1 bg-white flex justify-center">
          <div className="w-10 h-1.5 bg-stone-300 rounded-full" />
        </div>

        {/* Large Visual Food Header */}
        <div className="relative h-60 bg-stone-100 shrink-0">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3.5 right-3.5 min-w-[46px] min-h-[46px] rounded-full bg-white/95 text-stone-900 shadow-md flex items-center justify-center hover:bg-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3.5 left-4 right-4 text-white flex items-end justify-between gap-2">
            <h2 className="text-xl font-extrabold leading-tight">{product.name}</h2>
            <span className="text-lg font-extrabold font-mono bg-emerald-700 px-3 py-1 rounded-xl shrink-0">
              {formatGhs(finalLineTotal)}
            </span>
          </div>
        </div>

        {/* Visual-First Customizer Options (Minimal Text, Big Icons) */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* 1. Visual Portion Size Tiles */}
          <div className="space-y-2">
            <div className="text-xs font-extrabold text-stone-500 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>1. Size</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {product.sizes.map((sz, idx) => {
                const isSelected = selectedSize.id === sz.id;
                const circleSize = idx === 0 ? 'w-6 h-6' : idx === 1 ? 'w-8 h-8' : 'w-10 h-10';
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`min-h-[88px] p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-xs'
                        : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div
                      className={`${circleSize} rounded-full flex items-center justify-center font-extrabold text-xs ${
                        isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {idx === 0 ? 'S' : idx === 1 ? 'M' : 'L'}
                    </div>
                    <div className="text-xs font-extrabold mt-1.5 line-clamp-1">
                      {sz.label.split('(')[0]}
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-800">
                      {formatGhs(product.basePrice + sz.priceDelta)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Visual Style / Spice Selection */}
          {product.preferences.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-stone-500 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>2. Style</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {product.preferences.map((pref) => {
                  const isSelected = selectedPreference === pref;
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setSelectedPreference(pref)}
                      className={`min-h-[48px] px-3 py-2 rounded-xl border-2 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-white text-stone-800'
                      }`}
                    >
                      <span className="truncate pr-1">{pref}</span>
                      {isSelected && <Check className="w-4 h-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Visual Extras Grid */}
          {product.extras.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-stone-500">3. Extras (+ Add)</div>
              <div className="grid grid-cols-2 gap-2">
                {product.extras.map((ex) => {
                  const isChecked = selectedExtras.some((e) => e.id === ex.id);
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => toggleExtra(ex)}
                      className={`min-h-[48px] px-3 py-2 rounded-xl border-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked
                          ? 'border-emerald-700 bg-emerald-50 font-extrabold text-emerald-950'
                          : 'border-stone-200 text-stone-700 bg-white'
                      }`}
                    >
                      <span className="truncate pr-1">{ex.name.replace('Fried Sweet ', '')}</span>
                      <span className="font-mono font-bold text-emerald-800 shrink-0">
                        +{ex.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Giant Bottom Action Bar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-white border-2 border-stone-200 rounded-2xl px-2 py-1">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-900 cursor-pointer"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-base font-extrabold font-mono w-7 text-center">{Quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-10 h-10 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-900 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              onConfirmAdd(
                product,
                selectedSize,
                selectedPreference,
                selectedConstituent,
                selectedExtras,
                '',
                Quantity
              )
            }
            className="flex-1 min-h-[54px] py-3.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold transition-colors flex items-center justify-between shadow-md cursor-pointer"
          >
            <span>Put in Bag</span>
            <span className="font-mono text-base">{formatGhs(finalLineTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
