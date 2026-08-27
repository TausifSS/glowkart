/* GlowKart Seed Data Store */
const INITIAL_PRODUCTS = [
  {
    id: "gk-prod-101",
    name: "Color Sensational Lipstick",
    brand: "Maybelline",
    category: "makeup",
    description: "Rich color payoff with a creamy matte finish. Long lasting up to 8 hours, enriched with honey nectar for smooth, hydrated lips.",
    price: 299,
    mrp: 399,
    discount: 25,
    stock: 120,
    isAvailable: true,
    bestseller: true,
    newArrival: false,
    rating: 4.6,
    reviewsCount: 256,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    shades: [
      { name: "Pink Pop", hex: "#FF4DA6" },
      { name: "Red Velvet", hex: "#D9381E" },
      { name: "Nude Nuance", hex: "#C77B68" },
      { name: "Plum Passion", hex: "#8B2652" },
      { name: "Mauve Magic", hex: "#A65B78" }
    ],
    features: [
      "Rich color payoff with a creamy matte finish",
      "Long lasting up to 8 hours",
      "Enriched with honey nectar for smooth lips",
      "Dermatologically tested & 100% genuine"
    ]
  },
  {
    id: "gk-prod-102",
    name: "Swiss Beauty Blush On",
    brand: "Swiss Beauty",
    category: "makeup",
    description: "Ultra-fine silky blush powder that blends seamlessly into skin for a natural flush of rosy color.",
    price: 254,
    mrp: 299,
    discount: 15,
    stock: 65,
    isAvailable: true,
    bestseller: true,
    newArrival: false,
    rating: 4.5,
    reviewsCount: 180,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    shades: [
      { name: "Rose Pink", hex: "#FF85C0" },
      { name: "Peach Glow", hex: "#FFA07A" },
      { name: "Coral Crush", hex: "#FF6F61" }
    ],
    features: [
      "Silky smooth powder texture",
      "Highly pigmented & buildable",
      "Subtle radiant finish"
    ]
  },
  {
    id: "gk-prod-103",
    name: "Fit Me Matte + Poreless Foundation",
    brand: "Maybelline",
    category: "makeup",
    description: "Lightweight liquid foundation that controls shine, refines pores, and provides natural seamless coverage.",
    price: 359,
    mrp: 399,
    discount: 10,
    stock: 90,
    isAvailable: true,
    bestseller: true,
    newArrival: false,
    rating: 4.7,
    reviewsCount: 420,
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    shades: [
      { name: "120 Classic Ivory", hex: "#F3D3BD" },
      { name: "128 Warm Nude", hex: "#E9BEA0" },
      { name: "220 Natural Beige", hex: "#DFAA85" }
    ],
    features: [
      "Matte finish controls shine",
      "Blurs pores without clogging",
      "SPF 22 sun protection"
    ]
  },
  {
    id: "gk-prod-104",
    name: "Pond's Bright Beauty Serum",
    brand: "Pond's",
    category: "skincare",
    description: "Advanced spot-less glow serum powered by Gluta-Boost C & Niacinamide to brighten dark spots in 7 days.",
    price: 399,
    mrp: 499,
    discount: 20,
    stock: 85,
    isAvailable: true,
    bestseller: false,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 310,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    shades: [],
    features: [
      "Fades dark spots in 7 days",
      "Non-greasy fast absorbing formula",
      "Deep hydration & radiant glow"
    ]
  },
  {
    id: "gk-prod-105",
    name: "Minimalist Niacinamide 10% Serum",
    brand: "Minimalist",
    category: "skincare",
    description: "Pure Niacinamide serum with Zinc to reduce blemishes, balance sebum, and reinforce skin barrier.",
    price: 499,
    mrp: 599,
    discount: 16,
    stock: 45,
    isAvailable: true,
    bestseller: true,
    newArrival: true,
    rating: 4.9,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1608248597349-4c98782a201c?auto=format&fit=crop&w=600&q=80",
    shades: [],
    features: [
      "Controls excess oil & sebum",
      "Reduces acne marks & hyperpigmentation",
      "Fragrance-free & hypoallergenic"
    ]
  },
  {
    id: "gk-prod-106",
    name: "Bella Vita Luxury Date Perfume",
    brand: "Bella Vita",
    category: "fragrances",
    description: "An irresistible floral-fruity EDP perfume crafted for romantic date nights with notes of Pink Pepper & Jasmine.",
    price: 599,
    mrp: 999,
    discount: 40,
    stock: 30,
    isAvailable: true,
    bestseller: true,
    newArrival: false,
    rating: 4.6,
    reviewsCount: 140,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    shades: [],
    features: [
      "Long-lasting 12hr EDP scent",
      "Floral & fruity sensual notes",
      "Premium luxury glass bottle"
    ]
  },
  {
    id: "gk-prod-107",
    name: "Pro Makeup Brush Set (12 Pcs)",
    brand: "GlowKart",
    category: "accessories",
    description: "Ultra-soft synthetic makeup brushes set with premium pink pouch for flawless face & eye blending.",
    price: 699,
    mrp: 1299,
    discount: 46,
    stock: 50,
    isAvailable: true,
    bestseller: true,
    newArrival: true,
    rating: 4.8,
    reviewsCount: 95,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    shades: [],
    features: [
      "Cruelty-free ultra-soft bristles",
      "12 essential face & eye brushes",
      "Includes protective pink travel pouch"
    ]
  },
  {
    id: "gk-prod-108",
    name: "Dot & Key Ceramides Moisturizer",
    brand: "Dot & Key",
    category: "skincare",
    description: "Deep hydrating cream with 5 essential ceramides & hyaluronic acid to restore damaged moisture barrier.",
    price: 395,
    mrp: 495,
    discount: 20,
    stock: 75,
    isAvailable: true,
    bestseller: false,
    newArrival: true,
    rating: 4.7,
    reviewsCount: 190,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    shades: [],
    features: [
      "Restores damaged skin barrier",
      "Deep 72-hour moisture lock",
      "Ideal for dry & sensitive skin"
    ]
  }
];

const INITIAL_CATEGORIES = [
  { id: "makeup", name: "Makeup", count: "120+ Products", icon: "💄" },
  { id: "skincare", name: "Skincare", count: "95+ Products", icon: "✨" },
  { id: "haircare", name: "Haircare", count: "60+ Products", icon: "🧴" },
  { id: "fragrances", name: "Fragrances", count: "80+ Products", icon: "🌸" },
  { id: "accessories", name: "Beauty Accessories", count: "100+ Products", icon: "🖌️" },
  { id: "new-arrivals", name: "New Arrivals", count: "30+ Products", icon: "💖" }
];

const INITIAL_OFFERS = [
  {
    id: "off-1",
    title: "On All Skincare Products",
    discountText: "25% OFF",
    code: "GLOW25",
    validity: "Valid till 31 May 2026",
    category: "skincare",
    type: "Percentage Off"
  },
  {
    id: "off-2",
    title: "On All Makeup Products",
    discountText: "15% OFF",
    code: "MAKE15",
    validity: "Valid till 30 May 2026",
    category: "makeup",
    type: "Percentage Off"
  },
  {
    id: "off-3",
    title: "Free Beauty Pouch on orders above ₹999",
    discountText: "FREE GIFT",
    code: "FREEGIFT",
    validity: "Valid till 31 May 2026",
    category: "all",
    type: "Free Gifts"
  },
  {
    id: "off-4",
    title: "5% Instant Discount on all UPI Payments",
    discountText: "UPI EXTRA 5%",
    code: "UPI5",
    validity: "Always Active",
    category: "all",
    type: "Bank Offers"
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Order Confirmed",
    message: "Your order GK-1042 has been confirmed. We'll notify you on WhatsApp soon.",
    time: "10:30 AM",
    type: "Orders",
    unread: true,
    icon: "📦"
  },
  {
    id: "notif-2",
    title: "Order Shipped",
    message: "Great news! Your order GK-1031 is out for local delivery in Shikrapur.",
    time: "Yesterday",
    type: "Orders",
    unread: true,
    icon: "🚚"
  },
  {
    id: "notif-3",
    title: "New Offer Unlocked!",
    message: "Get up to 25% OFF on skincare products. Use code: GLOW25",
    time: "Yesterday",
    type: "Offers",
    unread: false,
    icon: "🎁"
  },
  {
    id: "notif-4",
    title: "GlowKart Announcement",
    message: "Fast local delivery now available across all areas in Shikrapur!",
    time: "3 days ago",
    type: "System",
    unread: false,
    icon: "✨"
  }
];
