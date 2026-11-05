/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type NavRoute = 'welcome' | 'menu' | 'explore' | 'history' | 'branches' | 'you';
export type MainCategory = 'all' | 'dcpizza' | 'dcchicken' | 'packages' | 'drinks';
export type CheckoutStep = 'NONE' | 'ADDRESS' | 'MAP_PICKER' | 'FEES' | 'PAYMENT' | 'CONFIRMED';

export interface ProductSize {
  id: string;
  label: string;
  servings: string;
  priceDelta: number;
}

export interface ProductExtra {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: Exclude<MainCategory, 'all'>;
  subCategory: string;
  basePrice: number;
  wasPrice?: number;
  promoFamily?: string;
  thresholdQty?: number;
  thresholdSaveAmount?: number;
  prepTimeMins: string;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  isPopular?: boolean;
  image: string;
  sizes: ProductSize[];
  preferences: string[];
  constituentsLabel?: string;
  constituentsOptions?: string[];
  extras: ProductExtra[];
}

export interface FlyerSlide {
  id: string;
  tag: string;
  headline: string;
  subheadline: string;
  priceCallout?: string;
  ctaText: string;
  targetCategory?: MainCategory;
  targetProductId?: string;
  image: string;
  enabled: boolean;
}

export interface PromoVoucher {
  code: string;
  discountAmount: number;
  description: string;
  active: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: MenuItem;
  selectedSize: ProductSize;
  selectedPreference: string;
  selectedConstituent?: string;
  selectedExtras: ProductExtra[];
  note: string;
  quantity: number;
}

export interface Branch {
  id: string;
  name: string;
  area: string;
  city: 'Accra' | 'Kumasi' | 'Tema';
  address: string;
  distanceKm: number;
  etaMins: string;
  phone: string;
  isOpen: boolean;
  hours: string;
  coordinates: { lat: number; lng: number };
}

export interface SavedLocation {
  id: string;
  label: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
}

export interface OrderRecord {
  id: string;
  code: string;
  createdAt: string;
  scheduledFor: string;
  branchName: string;
  deliveryType: 'DELIVERY' | 'PICKUP';
  address: string;
  riderName: string;
  riderPhone: string;
  statusStep: 1 | 2 | 3 | 4;
  items: {
    productId: string;
    name: string;
    size: string;
    preference: string;
    extras: string[];
    quantity: number;
    unitPrice: number;
  }[];
  subTotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
}
