/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Truck,
  Store,
  MapPin,
  Check,
  CreditCard,
  Smartphone,
  Navigation,
  Printer
} from 'lucide-react';
import { Branch, CheckoutStep, OrderRecord, SavedLocation } from '../types';
import { BRANCHES, GHANA_LANDMARKS, formatGhs } from '../data/menuData';

interface CheckoutModalsProps {
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;
  selectedBranch: Branch;
  setSelectedBranch: (b: Branch) => void;
  deliveryOption: 'DELIVERY' | 'PICKUP';
  setDeliveryOption: (opt: 'DELIVERY' | 'PICKUP') => void;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;
  savedLocations: SavedLocation[];
  onAddSavedLocation: (loc: SavedLocation) => void;
  courierTier: { id: string; label: string; fee: number; eta: string };
  setCourierTier: (t: { id: string; label: string; fee: number; eta: string }) => void;
  scheduledTime: string;
  setScheduledTime: (t: string) => void;
  couponCode: string;
  setCouponCode: (c: string) => void;
  onApplyCoupon: (code?: string) => void;
  paymentMethod: 'MOMO' | 'CARD' | 'COD';
  setPaymentMethod: (pm: 'MOMO' | 'CARD' | 'COD') => void;
  momoNetwork: 'MTN' | 'Telecel' | 'AT';
  setMomoNetwork: (net: 'MTN' | 'Telecel' | 'AT') => void;
  momoPhone: string;
  setMomoPhone: (p: string) => void;
  rawSubTotal: number;
  totalThresholdSavings: number;
  appliedCouponDiscount: number;
  effectiveDeliveryFee: number;
  finalCheckoutTotal: number;
  cartCount: number;
  onPlaceOrder: () => void;
  onGoToHistory: () => void;
}

export const CheckoutModals: React.FC<CheckoutModalsProps> = ({
  step,
  setStep,
  selectedBranch,
  setSelectedBranch,
  deliveryOption,
  setDeliveryOption,
  deliveryAddress,
  setDeliveryAddress,
  courierTier,
  setCourierTier,
  paymentMethod,
  setPaymentMethod,
  momoNetwork,
  setMomoNetwork,
  momoPhone,
  setMomoPhone,
  rawSubTotal,
  effectiveDeliveryFee,
  finalCheckoutTotal,
  cartCount,
  onPlaceOrder,
  onGoToHistory
}) => {
  const [mapPinIndex, setMapPinIndex] = useState<number>(0);

  if (step === 'NONE') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4"
      onClick={() => setStep('NONE')}
    >
      <div
        className="bg-white w-full sm:max-w-[500px] rounded-t-3xl sm:rounded-3xl border border-stone-200 overflow-hidden p-5 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 1: VISUAL DELIVERY VS PICKUP & LOCATION */}
        {step === 'ADDRESS' && (
          <>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-extrabold text-stone-900">1. Where to?</h2>
              <button
                onClick={() => setStep('NONE')}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Visual Picture Cards: Rider vs Shop */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryOption('DELIVERY')}
                className={`min-h-[96px] p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  deliveryOption === 'DELIVERY'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    deliveryOption === 'DELIVERY'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <Truck className="w-6 h-6" />
                </div>
                <span className="text-sm font-extrabold">Rider Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryOption('PICKUP')}
                className={`min-h-[96px] p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                  deliveryOption === 'PICKUP'
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-950 shadow-sm'
                    : 'border-stone-200 bg-white text-stone-600'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    deliveryOption === 'PICKUP'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-sm font-extrabold">Shop Pickup</span>
              </button>
            </div>

            {/* Visual Map Button + Quick Locations */}
            {deliveryOption === 'DELIVERY' && (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setStep('MAP_PICKER')}
                  className="w-full min-h-[52px] p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-600/50 text-emerald-900 font-extrabold text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-700" />
                    <span>Tap to Pin on Map</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white">Open Map</span>
                </button>

                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                  {GHANA_LANDMARKS.slice(0, 4).map((loc) => {
                    const isSelected = deliveryAddress === loc.address;
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setDeliveryAddress(loc.address)}
                        className={`min-h-[52px] p-3 rounded-2xl border-2 text-left flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50 font-extrabold text-stone-900'
                            : 'border-stone-200 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
                          <span className="text-xs truncate">{loc.label}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-emerald-700 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nearest DC Foods Branch */}
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-stone-500">DC Foods Branch</div>
              <div className="grid grid-cols-2 gap-2">
                {BRANCHES.slice(0, 4).map((b) => {
                  const isSelected = selectedBranch.id === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBranch(b)}
                      className={`min-h-[54px] p-2.5 rounded-2xl border-2 text-left flex flex-col justify-center cursor-pointer ${
                        isSelected
                          ? 'border-emerald-700 bg-emerald-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="text-xs font-extrabold text-stone-900 truncate">
                        {b.name.replace('DC Foods ', '')}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700">{b.etaMins}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                cartCount > 0
                  ? setStep(deliveryOption === 'DELIVERY' ? 'FEES' : 'PAYMENT')
                  : setStep('NONE')
              }
              className="w-full min-h-[54px] py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold cursor-pointer shadow-md"
            >
              {cartCount > 0 ? 'Next →' : 'Done'}
            </button>
          </>
        )}

        {/* STEP 1B: VISUAL MAP PIN PICKER */}
        {step === 'MAP_PICKER' && (
          <>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-extrabold text-stone-900">Tap Your Area on Map</h2>
              <button
                onClick={() => setStep('ADDRESS')}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-64 rounded-2xl bg-[#EBF1EC] border-2 border-stone-300 overflow-hidden p-3 flex flex-col justify-between">
              <svg
                className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
                viewBox="0 0 400 240"
                fill="none"
              >
                <path d="M0 60 H400 M0 130 H400 M0 190 H400" stroke="#94a3b8" strokeWidth="2" />
                <path d="M90 0 V240 M210 0 V240 M320 0 V240" stroke="#94a3b8" strokeWidth="2" />
                <path
                  d="M20 220 Q 180 110 380 30"
                  stroke="#047857"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />
              </svg>

              <div className="relative z-10 grid grid-cols-2 gap-2.5 my-auto">
                {GHANA_LANDMARKS.slice(0, 6).map((lm, idx) => {
                  const active = mapPinIndex === idx;
                  return (
                    <button
                      key={lm.id}
                      type="button"
                      onClick={() => {
                        setMapPinIndex(idx);
                        setDeliveryAddress(lm.address);
                      }}
                      className={`min-h-[54px] p-2.5 rounded-2xl border-2 text-left transition-all flex items-center gap-2 cursor-pointer ${
                        active
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-[1.03]'
                          : 'bg-white/95 text-stone-800 border-stone-200'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 shrink-0 ${active ? 'text-amber-300' : 'text-emerald-700'}`} />
                      <span className="text-xs font-extrabold truncate">{lm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('ADDRESS')}
              className="w-full min-h-[54px] py-3.5 px-4 rounded-2xl bg-emerald-700 text-white text-sm font-extrabold cursor-pointer"
            >
              Use This Pin →
            </button>
          </>
        )}

        {/* STEP 2: VISUAL RIDER SPEED */}
        {step === 'FEES' && (
          <>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-extrabold text-stone-900">2. Rider Speed</h2>
              <button
                onClick={() => setStep('NONE')}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'express',
                  label: 'Fast Rider (20 mins)',
                  fee: 15,
                  eta: '20–30 mins'
                },
                {
                  id: 'standard',
                  label: 'Normal Rider (35 mins)',
                  fee: 10,
                  eta: '35–45 mins'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCourierTier(opt)}
                  className={`w-full min-h-[70px] p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                    courierTier.id === opt.id
                      ? 'border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                      <Truck className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-stone-900">{opt.label}</span>
                  </div>
                  <span className="text-base font-extrabold font-mono text-emerald-800">
                    {rawSubTotal >= 250 ? 'FREE' : formatGhs(opt.fee)}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStep('ADDRESS')}
                className="min-h-[52px] px-5 py-2.5 rounded-2xl border-2 border-stone-200 text-xs font-extrabold text-stone-700 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep('PAYMENT')}
                className="flex-1 min-h-[52px] py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-extrabold cursor-pointer"
              >
                Next: Pay →
              </button>
            </div>
          </>
        )}

        {/* STEP 3: VISUAL PAYMENT */}
        {step === 'PAYMENT' && (
          <>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="text-lg font-extrabold text-stone-900">3. How to Pay</h2>
              <button
                onClick={() => setStep('NONE')}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Big Visual Payment Tiles */}
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'MOMO' as const, label: 'MoMo', icon: Smartphone },
                { id: 'COD' as const, label: 'Cash', icon: Truck },
                { id: 'CARD' as const, label: 'Card', icon: CreditCard }
              ].map((pm) => {
                const Icon = pm.icon;
                const active = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`min-h-[84px] p-3 rounded-2xl border-2 text-xs font-extrabold flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                      active
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-700'
                        : 'border-stone-200 text-stone-600 bg-white'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-emerald-700" />
                    <span className="text-sm">{pm.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'MOMO' && (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <div className="grid grid-cols-3 gap-2">
                  {(['MTN', 'Telecel', 'AT'] as const).map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setMomoNetwork(net)}
                      className={`min-h-[42px] py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                        momoNetwork === net
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white border border-stone-200 text-stone-700'
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
                <input
                  type="tel"
                  value={momoPhone}
                  onChange={(e) => setMomoPhone(e.target.value)}
                  placeholder="MoMo Phone Number"
                  className="w-full px-4 py-3 text-sm font-mono font-bold bg-white border-2 border-stone-200 rounded-xl focus:outline-none focus:border-emerald-700"
                />
              </div>
            )}

            {/* Big Visual Total Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-700/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-stone-600">Total to Pay</div>
                <div className="text-[11px] text-emerald-800 font-semibold">
                  {effectiveDeliveryFee === 0 ? 'Free Delivery Included' : `+${formatGhs(effectiveDeliveryFee)} Rider`}
                </div>
              </div>
              <span className="text-2xl font-extrabold font-mono text-emerald-900">
                {formatGhs(finalCheckoutTotal)}
              </span>
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(deliveryOption === 'DELIVERY' ? 'FEES' : 'ADDRESS')}
                className="min-h-[54px] px-5 py-2.5 rounded-2xl border-2 border-stone-200 text-xs font-extrabold text-stone-700 cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={onPlaceOrder}
                className="flex-1 min-h-[54px] py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-base font-extrabold cursor-pointer shadow-md"
              >
                Confirm Order · {formatGhs(finalCheckoutTotal)}
              </button>
            </div>
          </>
        )}

        {/* STEP 4: VISUAL ORDER CONFIRMED */}
        {step === 'CONFIRMED' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Check className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-stone-900">Order Sent!</h2>
            <p className="text-sm font-semibold text-stone-600">
              {selectedBranch.name} ({selectedBranch.etaMins})
            </p>
            <button
              type="button"
              onClick={onGoToHistory}
              className="w-full min-h-[54px] py-3.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-base font-extrabold cursor-pointer"
            >
              See Rider on Road →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ReceiptModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[400px] rounded-3xl border border-stone-200 p-6 space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-dashed border-stone-300 pb-3">
          <div>
            <div className="text-base font-extrabold text-emerald-800">DC FOODS RECEIPT</div>
            <div className="text-xs font-mono font-bold text-stone-500">{order.code}</div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between font-bold text-stone-900">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span className="font-mono">{formatGhs(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-dashed border-stone-300 flex justify-between text-base font-extrabold text-emerald-800">
          <span>Total Paid</span>
          <span className="font-mono">{formatGhs(order.total)}</span>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="w-full min-h-[48px] py-2.5 px-4 rounded-2xl bg-stone-900 text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
};
