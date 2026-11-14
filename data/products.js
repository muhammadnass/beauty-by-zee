// Beauty by Zee - Product Data
// Prices are managed by admin via admin portal (stored in localStorage)

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Face Wash",
    description: "Deep Cleansing · Refreshing · Glow Boosting. For All Skin Types.",
    category: "Face Care",
    image: "images/face-wash.jpg",
    defaultPrice: 0,
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Face Cream",
    description: "Hydration · Brightening · Nourishing. For All Skin Types.",
    category: "Face Care",
    image: "images/face-cream.jpg",
    defaultPrice: 0,
    badge: "New"
  },
  {
    id: 3,
    name: "Super Glow Soap",
    description: "Brightening · Even Tone · Radiance. Smooth · Radiant · Renewed.",
    category: "Body Care",
    image: "images/super-glow-soap.jpg",
    defaultPrice: 0,
    badge: null
  },
  {
    id: 4,
    name: "Glow Body Scrub",
    description: "Brightening & Exfoliating. Smooth · Radiant · Renewed. For All Skin Types.",
    category: "Body Care",
    image: "images/glow-body-scrub.jpg",
    defaultPrice: 0,
    badge: "Popular"
  },
  {
    id: 5,
    name: "Super Glow Oil",
    description: "Radiance · Nourishment · Even Tone. A Few Drops. A Natural Glow. For All Skin Types.",
    category: "Body Care",
    image: "images/super-glow-oil-1.jpg",
    defaultPrice: 0,
    badge: "Bestseller"
  },
  {
    id: 6,
    name: "Qasli Powder",
    description: "100% Natural Moroccan Ritual. Glow & Detoxify. Skin Detoxifier & Brightener. For All Skin Types.",
    category: "Natural Rituals",
    image: "images/qasli-powder-1.jpg",
    defaultPrice: 0,
    badge: "Natural"
  },
  {
    id: 7,
    name: "Nila Mask",
    description: "Lighten. Brighten. Glow. For Hyperpigmentation — Safe & Side-Effect Free. Natural · Pure · Effective.",
    category: "Face Care",
    image: "images/nila-mask-1.jpg",
    defaultPrice: 0,
    badge: "Trending"
  },
  {
    id: 8,
    name: "Beauty By Zee Body Cream",
    description: "Soft, Silky, Radiant Skin. Luxurious daily moisturiser for glowing skin.",
    category: "Body Care",
    image: "images/body-cream.jpg",
    defaultPrice: 0,
    badge: null
  },
  {
    id: 9,
    name: "Glow Cream (500ml)",
    description: "Intense Moisture. Radiant Glow. Available in 500ml jar.",
    category: "Body Care",
    image: "images/glow-cream.jpg",
    defaultPrice: 0,
    badge: null
  },
  {
    id: 10,
    name: "Glow Cream (1KG)",
    description: "Intense Moisture. Radiant Glow. Family-size 1KG jar — best value.",
    category: "Body Care",
    image: "images/glow-cream-2.jpg",
    defaultPrice: 0,
    badge: "Best Value"
  },
  {
    id: 11,
    name: "Moroccan Black Soap",
    description: "100% Natural. No Added Chemicals. Deep Cleans & Glow. Natural · Pure · Traditional.",
    category: "Natural Rituals",
    image: "images/moroccan-black-soap-1.jpg",
    defaultPrice: 0,
    badge: "Natural"
  },
  {
    id: 12,
    name: "Extreme Glowing Oil",
    description: "The Perfect Combo. Radiant, Even-Toned Skin.",
    category: "Body Care",
    image: "images/extreme-glowing-oil.jpg",
    defaultPrice: 0,
    badge: null
  },
  {
    id: 13,
    name: "Caramel Body Lotion",
    description: "The Perfect Combo with Extreme Glowing Oil. Radiant, Even-Toned Skin.",
    category: "Body Care",
    image: "images/extreme-glowing-oil.jpg",
    defaultPrice: 0,
    badge: null
  },
  {
    id: 14,
    name: "Glow Soap & Body Scrub Set",
    description: "Nourish. Exfoliate. Radiate. Super Glow Soap + Glow Body Scrub combo.",
    category: "Sets & Combos",
    image: "images/glow-soap-scrub.jpg",
    defaultPrice: 0,
    badge: "Combo Deal"
  }
];

// Get products with admin-set prices from localStorage
function getProducts() {
  const savedPrices = JSON.parse(localStorage.getItem('bbz_prices') || '{}');
  return DEFAULT_PRODUCTS.map(p => ({
    ...p,
    price: savedPrices[p.id] !== undefined ? savedPrices[p.id] : p.defaultPrice
  }));
}

if (typeof module !== 'undefined') module.exports = { DEFAULT_PRODUCTS, getProducts };
