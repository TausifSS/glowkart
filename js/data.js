/* GlowKart Products, Categories, Offers & Initial Seed Database */

const INITIAL_CATEGORIES = [
  { id: 'makeup', name: 'Makeup', icon: '💄', count: '120+ Products' },
  { id: 'skincare', name: 'Skincare', icon: '✨', count: '85+ Products' },
  { id: 'haircare', name: 'Haircare', icon: '💆‍♀️', count: '60+ Products' },
  { id: 'fragrances', name: 'Fragrances', icon: '🌸', count: '45+ Products' },
  { id: 'accessories', name: 'Beauty Accessories', icon: '💅', count: '70+ Products' }
];

const INITIAL_PRODUCTS = [
  {
    id: 'gk-prod-1',
    name: 'Maybelline Color Sensational Lipstick - Pink Pop',
    brand: 'Maybelline',
    category: 'makeup',
    price: 299,
    mrp: 399,
    discount: 25,
    rating: 4.6,
    reviewsCount: 245,
    bestseller: true,
    newArrival: false,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80',
    description: 'Crisp color lipstick infused with pure precious oils for a smooth, vibrant pink look.',
    shades: [
      { name: 'Pink Pop', hex: '#FF2E93' },
      { name: 'Ruby Red', hex: '#D90429' },
      { name: 'Nude Nuance', hex: '#C88D79' }
    ],
    features: ['Hydrating formula', 'Long-lasting matte finish', '100% Original Authentic']
  },
  {
    id: 'gk-prod-2',
    name: "Pond's Bright Beauty Serum 30ml",
    brand: "Pond's",
    category: 'skincare',
    price: 399,
    mrp: 499,
    discount: 20,
    rating: 4.7,
    reviewsCount: 182,
    bestseller: true,
    newArrival: true,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80',
    description: 'Advanced Vitamin B3+ facial serum for bright, glowing skin spot reduction.',
    shades: [],
    features: ['Infused with Gluta-Boost', 'Fades dark spots', 'Lightweight non-greasy feel']
  },
  {
    id: 'gk-prod-3',
    name: 'Swiss Beauty Blusher Rose Pink',
    brand: 'Swiss Beauty',
    category: 'makeup',
    price: 230,
    mrp: 299,
    discount: 23,
    rating: 4.5,
    reviewsCount: 132,
    bestseller: true,
    newArrival: false,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    description: 'Silky smooth powder blush delivering natural flushed color glow.',
    shades: [
      { name: 'Rose Pink', hex: '#FF70A6' },
      { name: 'Coral Coral', hex: '#FF9770' }
    ],
    features: ['Blendable texture', 'High pigment payoff', 'All day wear']
  },
  {
    id: 'gk-prod-4',
    name: 'Lakme 9 to 5 CC Cream Beige',
    brand: 'Lakme',
    category: 'makeup',
    price: 375,
    mrp: 499,
    discount: 25,
    rating: 4.4,
    reviewsCount: 210,
    bestseller: true,
    newArrival: false,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    description: 'Complexion care cream with SPF 30 PA++ for everyday skin protection and even coverage.',
    shades: [
      { name: 'Beige', hex: '#E0AC69' },
      { name: 'Honey', hex: '#C68642' }
    ],
    features: ['SPF 30 Sun Protection', 'Evens skin tone', 'Moisturizes & brightens']
  },
  {
    id: 'gk-prod-5',
    name: 'Minimalist Niacinamide Serum 10%',
    brand: 'Minimalist',
    category: 'skincare',
    price: 499,
    mrp: 599,
    discount: 17,
    rating: 4.8,
    reviewsCount: 320,
    bestseller: true,
    newArrival: true,
    image: 'https://images.unsplash.com/photo-1608248597263-00079e96e70a?w=400&q=80',
    description: 'Nourishing face serum with Matmarine to control oil production & reduce acne scars.',
    shades: [],
    features: ['Pure Niacinamide 10%', 'Reduces blemishes', 'Fragrance free']
  },
  {
    id: 'gk-prod-6',
    name: 'L-Oreal Paris Extraordinary Hair Oil 100ml',
    brand: 'L-Oreal Paris',
    category: 'haircare',
    price: 549,
    mrp: 649,
    discount: 15,
    rating: 4.6,
    reviewsCount: 195,
    bestseller: false,
    newArrival: true,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80',
    description: 'Multi-use hair serum with 6 rare floral oils for glossy, smooth & manageable hair.',
    shades: [],
    features: ['Deep nourishment', 'Frizz control', 'Non-sticky texture']
  }
];

const INITIAL_OFFERS = [
  {
    id: 'off-1',
    code: 'MAKEUP25',
    title: 'Flat 25% OFF on Makeup',
    discountText: '25% OFF',
    type: 'Category Deal',
    validity: 'Valid on orders above ₹499'
  },
  {
    id: 'off-2',
    code: 'GLOW100',
    title: 'Flat ₹100 Instant Discount',
    discountText: '₹100 OFF',
    type: 'Super Saver',
    validity: 'Valid on orders above ₹699'
  },
  {
    id: 'off-3',
    code: 'FREEGIFT',
    title: 'Free Beauty Surprise Gift',
    discountText: 'FREE GIFT',
    type: 'Special Gift',
    validity: 'Valid on orders above ₹999'
  }
];

// No demo notifications by default! Real notifications appear when orders/actions happen.
const INITIAL_NOTIFICATIONS = [];
