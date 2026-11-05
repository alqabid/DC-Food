/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Branch, MenuItem, ProductExtra, SavedLocation, OrderRecord } from '../types';

export const IMG_BANNER_FEAST = '/src/assets/images/promo_banner_feast_1793887634784.jpg';
export const IMG_BANNER_PIZZA = '/src/assets/images/promo_banner_pizza_1793887635434.jpg';
export const IMG_PIZZA = '/src/assets/images/food_pizza_signature_1793887635985.jpg';
export const IMG_JOLLOF = '/src/assets/images/food_jollof_chicken_1793887636679.jpg';
export const IMG_WINGS = '/src/assets/images/food_wings_bucket_1793887636902.jpg';
export const IMG_FRIED_RICE = '/src/assets/images/food_fried_rice_special_1793890643012.jpg';
export const IMG_SOBOLO = '/src/assets/images/food_sobolo_drinks_1793890643926.jpg';
export const IMG_KELEWELE = '/src/assets/images/food_kelewele_sides_1793890645068.jpg';
export const IMG_SHAWARMA = '/src/assets/images/food_burger_shawarma_1793890645310.jpg';

export const BRANCHES: Branch[] = [
  {
    id: 'br-east-legon',
    name: 'DC Foods East Legon',
    area: 'Boundary Road',
    city: 'Accra',
    address: '14 Boundary Rd, Near American House, East Legon',
    distanceKm: 1.8,
    etaMins: '20–30 mins',
    phone: '030 275 3430',
    isOpen: true,
    hours: '09:00 AM – 11:30 PM',
    coordinates: { lat: 5.6358, lng: -0.1514 }
  },
  {
    id: 'br-osu',
    name: 'DC Foods Osu Oxford St',
    area: 'Osu RE',
    city: 'Accra',
    address: 'Cantonments Rd, Oxford Street, Near Danquah Circle',
    distanceKm: 3.4,
    etaMins: '25–35 mins',
    phone: '030 275 3431',
    isOpen: true,
    hours: '09:00 AM – 12:00 AM',
    coordinates: { lat: 5.5612, lng: -0.1819 }
  },
  {
    id: 'br-spintex',
    name: 'DC Foods Spintex Coastal',
    area: 'Spintex Road',
    city: 'Accra',
    address: 'Spintex Rd, Opposite Baatsona Total Service Station',
    distanceKm: 5.2,
    etaMins: '30–40 mins',
    phone: '030 275 3432',
    isOpen: true,
    hours: '09:30 AM – 11:00 PM',
    coordinates: { lat: 5.6295, lng: -0.0942 }
  },
  {
    id: 'br-cantonments',
    name: 'DC Foods Labone & Airport',
    area: 'Labone Junction',
    city: 'Accra',
    address: '5th Circular Rd, Labone, Accra',
    distanceKm: 2.9,
    etaMins: '20–30 mins',
    phone: '030 275 3433',
    isOpen: true,
    hours: '09:00 AM – 11:30 PM',
    coordinates: { lat: 5.5734, lng: -0.1682 }
  },
  {
    id: 'br-knust',
    name: 'DC Foods KNUST Kumasi',
    area: 'Bomso / Ayeduase',
    city: 'Kumasi',
    address: 'Accra–Kumasi Rd, Bomso Junction, Near KNUST Gate',
    distanceKm: 4.1,
    etaMins: '25–35 mins',
    phone: '032 209 1140',
    isOpen: true,
    hours: '09:00 AM – 11:30 PM',
    coordinates: { lat: 6.6745, lng: -1.5716 }
  },
  {
    id: 'br-tema',
    name: 'DC Foods Tema Comm. 11',
    area: 'Community 11',
    city: 'Tema',
    address: 'Hospital Rd, Community 11, Tema',
    distanceKm: 6.8,
    etaMins: '30–40 mins',
    phone: '030 321 8890',
    isOpen: true,
    hours: '09:30 AM – 11:00 PM',
    coordinates: { lat: 5.6698, lng: -0.0166 }
  }
];

export const INITIAL_SAVED_LOCATIONS: SavedLocation[] = [
  {
    id: 'loc-1',
    label: 'Home · East Legon',
    address: 'East Legon, American House, Boundary Rd, Accra',
    city: 'Accra',
    coordinates: { lat: 5.6382, lng: -0.1489 }
  },
  {
    id: 'loc-2',
    label: 'Office · Airport Residential',
    address: 'Patrice Lumumba Rd, Airport Residential Area, Accra',
    city: 'Accra',
    coordinates: { lat: 5.6054, lng: -0.1792 }
  },
  {
    id: 'loc-3',
    label: 'Campus · UG Legon',
    address: 'University of Ghana, Pentagon Hostel Block B, Legon',
    city: 'Accra',
    coordinates: { lat: 5.6508, lng: -0.1869 }
  }
];

export const GHANA_LANDMARKS: SavedLocation[] = [
  ...INITIAL_SAVED_LOCATIONS,
  {
    id: 'lm-4',
    label: 'Osu Oxford Street',
    address: 'Osu RE, Near Papaye & Danquah Circle, Accra',
    city: 'Accra',
    coordinates: { lat: 5.5619, lng: -0.1822 }
  },
  {
    id: 'lm-5',
    label: 'Cantonments US Embassy Area',
    address: 'Fourth Circular Rd, Cantonments, Accra',
    city: 'Accra',
    coordinates: { lat: 5.5789, lng: -0.1631 }
  },
  {
    id: 'lm-6',
    label: 'Madina Zongo Junction',
    address: 'Accra-Aburi Hwy, Madina Zongo Junction, Accra',
    city: 'Accra',
    coordinates: { lat: 5.6782, lng: -0.1665 }
  },
  {
    id: 'lm-7',
    label: 'KNUST Ayeduase Gate',
    address: 'Ayeduase New Site, Near KNUST Commercial Area, Kumasi',
    city: 'Kumasi',
    coordinates: { lat: 6.6712, lng: -1.5648 }
  }
];

export const COMMON_EXTRAS: ProductExtra[] = [
  { id: 'ex-cheese', name: 'Extra Mozzarella Cheese', price: 22 },
  { id: 'ex-plantain', name: 'Fried Sweet Plantain (Kelewele)', price: 18 },
  { id: 'ex-sausage', name: 'Grilled Beef Sausage Cuts', price: 16 },
  { id: 'ex-dip', name: 'DC Signature Cocktail Dip', price: 10 },
  { id: 'ex-shito', name: 'Extra Homemade Spicy Shito', price: 12 },
  { id: 'ex-coleslaw', name: 'Creamy Rainbow Coleslaw', price: 14 }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dc-emerald-supreme-pizza',
    name: 'DC Emerald Supreme Pizza',
    subtitle: 'Signature Wood-Fired',
    description: 'Savory herb-roasted chicken breast, smoked beef ham, sweet bell peppers, black olives & stretchy mozzarella served with house cocktail sauce.',
    category: 'dcpizza',
    subCategory: 'Signatures',
    basePrice: 135,
    wasPrice: 160,
    promoFamily: 'FLASH_DEAL',
    thresholdQty: 2,
    thresholdSaveAmount: 25,
    prepTimeMins: '18–22 mins',
    spiceLevel: 'Medium',
    isPopular: true,
    image: IMG_PIZZA,
    sizes: [
      { id: 'sz-reg', label: 'Regular (10")', servings: '6 Slices · Serves 1–2', priceDelta: 0 },
      { id: 'sz-lrg', label: 'Large (13")', servings: '8 Slices · Serves 2–3', priceDelta: 40 },
      { id: 'sz-fam', label: 'Family Mega (16")', servings: '12 Slices · Serves 4–5', priceDelta: 75 }
    ],
    preferences: ['Classic Hand-Tossed Crust', 'Thin Crispy Artisan Crust', 'Mozzarella Stuffed Crust'],
    constituentsLabel: 'Second Half Flavor (Optional Half & Half)',
    constituentsOptions: [
      'Full Emerald Supreme (Single Flavor)',
      'Half Emerald Supreme + Half Triple Crown Meat',
      'Half Emerald Supreme + Half BBQ Suya Chicken'
    ],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-jollof-maxi-bucket',
    name: 'Smoky Party Jollof & Crispy Chicken',
    subtitle: 'Maxi Bucket Promo',
    description: 'Firewood-infused Ghanaian party Jollof rice paired with golden spiced fried chicken thighs, caramelized fried plantains, and homemade shito.',
    category: 'dcchicken',
    subCategory: 'Jollof Meals',
    basePrice: 98,
    wasPrice: 120,
    promoFamily: 'FLASH_DEAL',
    thresholdQty: 2,
    thresholdSaveAmount: 18,
    prepTimeMins: '15–20 mins',
    spiceLevel: 'Spicy',
    isPopular: true,
    image: IMG_JOLLOF,
    sizes: [
      { id: 'sz-solo', label: 'Solo Pack (2 pcs Chicken)', servings: 'Serves 1', priceDelta: 0 },
      { id: 'sz-mini', label: 'Mini Bucket (4 pcs Chicken)', servings: 'Serves 2–3', priceDelta: 45 },
      { id: 'sz-maxi', label: 'Maxi Bucket (8 pcs Chicken)', servings: 'Serves 4–5', priceDelta: 110 }
    ],
    preferences: ['Crispy Golden Fried Chicken', 'Chargrilled Peri-Peri Chicken', '50/50 Fried & Grilled Mix'],
    constituentsLabel: 'Rice Base Selection',
    constituentsOptions: [
      '100% Smoky Party Jollof Rice',
      'Half Jollof Rice + Half Assorted Fried Rice',
      'Jollof Rice with Extra Steamed Veggies'
    ],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-wings-platter',
    name: 'Honey-Chili Glazed Wings & Wedges',
    subtitle: 'Wings Bucket Promo',
    description: 'Crispy double-dredged chicken wings tossed in warm honey-chili glaze, served with rosemary potato wedges and two signature dips.',
    category: 'dcchicken',
    subCategory: 'Crispy Wings',
    basePrice: 115,
    wasPrice: 140,
    promoFamily: 'FLASH_DEAL',
    thresholdQty: 2,
    thresholdSaveAmount: 20,
    prepTimeMins: '15–18 mins',
    spiceLevel: 'Spicy',
    isPopular: true,
    image: IMG_WINGS,
    sizes: [
      { id: 'sz-8pc', label: '8 Wings + Wedges', servings: 'Serves 1–2', priceDelta: 0 },
      { id: 'sz-14pc', label: '14 Wings Bucket', servings: 'Serves 2–3', priceDelta: 50 },
      { id: 'sz-22pc', label: '22 Wings Party Bucket', servings: 'Serves 4–5', priceDelta: 95 }
    ],
    preferences: ['Honey-Chili Glaze', 'Fiery Shito & Ginger Toss', 'Classic Southern Crispy'],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-assorted-fried-rice',
    name: 'DC Special Assorted Fried Rice',
    subtitle: 'Fried Rice Meals',
    description: 'Wok-tossed long-grain basmati fried rice loaded with grilled chicken strips, beef sausages, carrots, sweet corn, and 2 crispy drumsticks.',
    category: 'dcchicken',
    subCategory: 'Fried Rice Meals',
    basePrice: 105,
    wasPrice: 125,
    promoFamily: 'FLASH_DEAL',
    thresholdQty: 2,
    thresholdSaveAmount: 15,
    prepTimeMins: '15–20 mins',
    spiceLevel: 'Medium',
    isPopular: true,
    image: IMG_FRIED_RICE,
    sizes: [
      { id: 'sz-reg', label: 'Regular Box (2 pcs Chicken)', servings: 'Serves 1', priceDelta: 0 },
      { id: 'sz-jumbo', label: 'Jumbo Box (3 pcs Chicken)', servings: 'Serves 1–2', priceDelta: 38 },
      { id: 'sz-bucket', label: 'Sharing Bucket (6 pcs)', servings: 'Serves 3–4', priceDelta: 90 }
    ],
    preferences: ['With Spicy Shito & Coleslaw', 'With Garlic Herb Sauce & Shito', 'Mild (No Pepper)'],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-triple-meat-pizza',
    name: 'Triple Crown Meat Lovers Pizza',
    subtitle: 'Classics',
    description: 'Loaded with spicy beef pepperoni, chargrilled suya beef strips, smoky chicken sausage, oregano, and double melted mozzarella.',
    category: 'dcpizza',
    subCategory: 'Classics',
    basePrice: 145,
    wasPrice: 170,
    promoFamily: 'FLASH_DEAL',
    thresholdQty: 2,
    thresholdSaveAmount: 30,
    prepTimeMins: '18–24 mins',
    spiceLevel: 'Medium',
    image: IMG_BANNER_PIZZA,
    sizes: [
      { id: 'sz-reg', label: 'Regular (10")', servings: '6 Slices', priceDelta: 0 },
      { id: 'sz-lrg', label: 'Large (13")', servings: '8 Slices', priceDelta: 40 },
      { id: 'sz-fam', label: 'Family Mega (16")', servings: '12 Slices', priceDelta: 75 }
    ],
    preferences: ['Classic Hand-Tossed Crust', 'Thin Crispy Artisan Crust'],
    constituentsLabel: 'Second Half Flavor (Optional Half & Half)',
    constituentsOptions: [
      'Full Triple Crown Meat Lovers',
      'Half Triple Crown + Half DC Emerald Supreme',
      'Half Triple Crown + Half Margherita Double Cheese'
    ],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-suya-shawarma-wrap',
    name: 'Double Suya Chicken & Beef Shawarma',
    subtitle: 'Grill & Wraps',
    description: 'Toasted flatbread wrap stuffed with spiced chargrilled chicken, suya beef strips, melted cheddar, garlic-herb crema, and seasoned fries.',
    category: 'dcchicken',
    subCategory: 'Grill & Wraps',
    basePrice: 82,
    wasPrice: 95,
    thresholdQty: 2,
    thresholdSaveAmount: 14,
    prepTimeMins: '12–16 mins',
    spiceLevel: 'Medium',
    image: IMG_SHAWARMA,
    sizes: [
      { id: 'sz-single', label: 'Single Loaded Wrap + Fries', servings: 'Serves 1', priceDelta: 0 },
      { id: 'sz-double', label: 'Twin Wrap Combo + 2 Fries', servings: 'Serves 2', priceDelta: 68 }
    ],
    preferences: ['Extra Garlic Crema & Spicy Suya', 'Mild Cheese & Herb', 'Extra Crispy Fries'],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-family-feast-box',
    name: 'DC Grand Squad Feast Package',
    subtitle: 'Family Packages',
    description: '1 Large Signature Pizza + 1 Mini Bucket Party Jollof + 8 Crispy Chicken Pieces + Spiced Kelewele + 2 Chilled Artisan Sobolo Bottles.',
    category: 'packages',
    subCategory: 'Family Packages',
    basePrice: 320,
    wasPrice: 375,
    promoFamily: 'FLASH_DEAL',
    prepTimeMins: '25–30 mins',
    spiceLevel: 'Medium',
    isPopular: true,
    image: IMG_BANNER_FEAST,
    sizes: [
      { id: 'sz-squad4', label: 'Squad Feast (Serves 4–5)', servings: '4–5 People', priceDelta: 0 },
      { id: 'sz-office8', label: 'Office Party Feast (Serves 8–10)', servings: '8–10 People', priceDelta: 240 }
    ],
    preferences: ['Emerald Supreme Pizza', 'Triple Crown Meat Pizza'],
    constituentsLabel: 'Choose Bucket Rice Base',
    constituentsOptions: [
      'Smoky Party Jollof Bucket',
      'Assorted Basmati Fried Rice Bucket',
      'Half Jollof + Half Fried Rice Bucket'
    ],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-couple-chilla-box',
    name: 'Couple Chilla Combo Box',
    subtitle: 'Couple Deals',
    description: '1 Regular Loaded Pizza + 2 Solo Jollof & Chicken Packs + 6 Honey-Chili Wings + 2 Pineapple-Ginger Refreshers.',
    category: 'packages',
    subCategory: 'Couple Deals',
    basePrice: 210,
    wasPrice: 245,
    promoFamily: 'FLASH_DEAL',
    prepTimeMins: '20–25 mins',
    spiceLevel: 'Medium',
    image: IMG_PIZZA,
    sizes: [
      { id: 'sz-std', label: 'Standard Couple Box', servings: 'Serves 2–3', priceDelta: 0 },
      { id: 'sz-lrg', label: 'Upgrade to Large Pizza', servings: 'Serves 3–4', priceDelta: 35 }
    ],
    preferences: ['Emerald Supreme Pizza', 'Triple Crown Meat Pizza'],
    constituentsLabel: 'Included Drink Selection',
    constituentsOptions: [
      '2× Chilled Hibiscus Sobolo',
      '2× Pineapple-Ginger Refreshers',
      '1× Sobolo + 1× Pineapple-Ginger'
    ],
    extras: COMMON_EXTRAS
  },
  {
    id: 'dc-kelewele-yam-platter',
    name: 'Spiced Kelewele & Crispy Yam Fries',
    subtitle: 'Ghanaian Sides',
    description: 'Golden caramelized ripe plantain cubes tossed in ginger, cloves, and chili with roasted groundnuts alongside crispy salted yam fries.',
    category: 'drinks',
    subCategory: 'Sides & Extras',
    basePrice: 42,
    thresholdQty: 2,
    thresholdSaveAmount: 8,
    prepTimeMins: '10–14 mins',
    spiceLevel: 'Spicy',
    isPopular: true,
    image: IMG_KELEWELE,
    sizes: [
      { id: 'sz-reg', label: 'Regular Bowl', servings: 'Serves 1–2', priceDelta: 0 },
      { id: 'sz-share', label: 'Sharing Platter', servings: 'Serves 3–4', priceDelta: 25 }
    ],
    preferences: ['With Roasted Peanuts & Shito', 'No Peanuts (Allergy Safe)', 'Mild Ginger'],
    extras: [
      { id: 'ex-dip', name: 'DC Signature Cocktail Dip', price: 10 },
      { id: 'ex-shito', name: 'Extra Homemade Spicy Shito', price: 12 }
    ]
  },
  {
    id: 'dc-sobolo-pineapple-pack',
    name: 'Artisan Sobolo & Pineapple-Ginger Cooler',
    subtitle: 'Fresh Coolers',
    description: 'House-brewed spiced hibiscus blossom (Sobolo) and cold-pressed Ghanaian pineapple-ginger juice served ice cold.',
    category: 'drinks',
    subCategory: 'Fresh Coolers',
    basePrice: 25,
    thresholdQty: 3,
    thresholdSaveAmount: 10,
    prepTimeMins: '5 mins',
    spiceLevel: 'Mild',
    isPopular: true,
    image: IMG_SOBOLO,
    sizes: [
      { id: 'sz-bottle', label: 'Single 500ml Glass Bottle', servings: '500ml', priceDelta: 0 },
      { id: 'sz-duo', label: 'Duo Pack (1 Sobolo + 1 Pineapple)', servings: '2 × 500ml', priceDelta: 22 },
      { id: 'sz-4pack', label: '4-Bottle Party Carrier', servings: '4 × 500ml', priceDelta: 62 }
    ],
    preferences: ['Spiced Hibiscus Sobolo', 'Pineapple-Ginger Refresh', '50/50 Mixed Pack'],
    extras: []
  }
];

export const PROMO_BANNERS = [
  {
    id: 'bn-1',
    title: 'Maxi Jollof & Crispy Chicken Bucket Feast',
    kicker: 'Flash Deal · Save GH₵ 22 Today',
    cta: 'Order Maxi Bucket',
    targetProductId: 'dc-jollof-maxi-bucket',
    image: IMG_BANNER_FEAST
  },
  {
    id: 'bn-2',
    title: 'Double Wood-Fired Artisan Pizza Box',
    kicker: 'Buy 2 Save GH₵ 30 · Half & Half Available',
    cta: 'Customize Pizza',
    targetProductId: 'dc-emerald-supreme-pizza',
    image: IMG_BANNER_PIZZA
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord-9482',
    code: 'DCF-9482',
    createdAt: 'Today, 12:40 PM',
    scheduledFor: 'ASAP (20–30 mins)',
    branchName: 'DC Foods East Legon',
    deliveryType: 'DELIVERY',
    address: 'East Legon, American House, Boundary Rd, Accra',
    riderName: 'Emmanuel Mensah',
    riderPhone: '024 812 9940',
    statusStep: 3,
    items: [
      {
        productId: 'dc-jollof-maxi-bucket',
        name: 'Smoky Party Jollof & Crispy Chicken',
        size: 'Mini Bucket (4 pcs Chicken)',
        preference: 'Crispy Golden Fried Chicken',
        extras: ['Fried Sweet Plantain (Kelewele)'],
        quantity: 1,
        unitPrice: 161
      },
      {
        productId: 'dc-wings-platter',
        name: 'Honey-Chili Glazed Wings & Wedges',
        size: '8 Wings + Wedges',
        preference: 'Honey-Chili Glaze',
        extras: [],
        quantity: 1,
        unitPrice: 115
      }
    ],
    subTotal: 276,
    discount: 20,
    deliveryFee: 0,
    total: 256,
    paymentMethod: 'MTN Mobile Money (024 555 0192)'
  }
];

export const INITIAL_FLYER_SLIDES = [
  {
    id: 'flyer-1',
    tag: 'MEGA WEEKEND FEAST',
    headline: 'Smoky Firewood Party Jollof & Crispy Chicken Bucket',
    subheadline: 'Served hot with caramelized Kelewele, rainbow coleslaw & signature spicy shito.',
    priceCallout: 'From GH₵ 98.00',
    ctaText: 'Order Jollof Bucket',
    targetCategory: 'dcchicken' as const,
    targetProductId: 'dc-jollof-maxi-bucket',
    image: IMG_BANNER_FEAST,
    enabled: true
  },
  {
    id: 'flyer-2',
    tag: 'ARTISAN WOOD-FIRED PIZZA',
    headline: 'Double Cheese & Herb-Roasted Chicken Supreme',
    subheadline: 'Buy 2 Pizzas and save GH₵ 25.00 automatically. Half & Half flavors available.',
    priceCallout: 'Save GH₵ 25.00',
    ctaText: 'Get Pizza Deal',
    targetCategory: 'dcpizza' as const,
    targetProductId: 'dc-emerald-supreme-pizza',
    image: IMG_BANNER_PIZZA,
    enabled: true
  },
  {
    id: 'flyer-3',
    tag: 'NEW FLAVOR DROP · WINGS & WEDGES',
    headline: 'Honey-Chili Glazed Crispy Wings Sharing Platter',
    subheadline: 'Double-dredged golden wings tossed in warm honey-chili glaze with rosemary wedges.',
    priceCallout: 'GH₵ 115.00',
    ctaText: 'Grab Wings Platter',
    targetCategory: 'dcchicken' as const,
    targetProductId: 'dc-wings-platter',
    image: IMG_WINGS,
    enabled: true
  },
  {
    id: 'flyer-4',
    tag: 'CHILLED GHANAIAN CRAFT COOLERS',
    headline: 'Ice-Cold Spiced Hibiscus Sobolo & Pineapple-Ginger',
    subheadline: '100% natural house-brewed refreshers delivered ice cold with every meal.',
    priceCallout: 'GH₵ 25.00',
    ctaText: 'Add Chilled Drinks',
    targetCategory: 'drinks' as const,
    targetProductId: 'dc-sobolo-pineapple-pack',
    image: IMG_SOBOLO,
    enabled: true
  },
  {
    id: 'flyer-5',
    tag: 'NEWS · FREE EXPRESS DISPATCH',
    headline: 'Zero Rider Fees on Orders Above GH₵ 250 across 6 Branches',
    subheadline: 'Fast 20–30 min thermal-box delivery in East Legon, Osu, Spintex, Labone, Kumasi & Tema.',
    priceCallout: 'Code: DCFEAST20',
    ctaText: 'Explore Full Menu',
    targetCategory: 'all' as const,
    image: IMG_FRIED_RICE,
    enabled: true
  }
];

export const INITIAL_VOUCHERS = [
  {
    code: 'DCFEAST20',
    discountAmount: 20,
    description: 'GH₵ 20.00 off any family feast or pizza order',
    active: true
  },
  {
    code: 'FIRSTORDER15',
    discountAmount: 15,
    description: 'GH₵ 15.00 welcome discount for new customers',
    active: true
  },
  {
    code: 'WEEKEND30',
    discountAmount: 30,
    description: 'GH₵ 30.00 off weekend squad orders',
    active: true
  }
];

export const ALL_FOOD_IMAGES = [
  { label: 'Party Jollof Feast Banner', url: IMG_BANNER_FEAST },
  { label: 'Wood-Fired Pizza Banner', url: IMG_BANNER_PIZZA },
  { label: 'Emerald Supreme Pizza', url: IMG_PIZZA },
  { label: 'Jollof & Crispy Chicken', url: IMG_JOLLOF },
  { label: 'Honey-Chili Wings Bucket', url: IMG_WINGS },
  { label: 'Assorted Fried Rice', url: IMG_FRIED_RICE },
  { label: 'Artisan Sobolo & Pineapple', url: IMG_SOBOLO },
  { label: 'Spiced Kelewele & Yam Fries', url: IMG_KELEWELE },
  { label: 'Double Suya Shawarma', url: IMG_SHAWARMA }
];

export function formatGhs(amount: number): string {
  return `GH₵ ${amount.toFixed(2)}`;
}

