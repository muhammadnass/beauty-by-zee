// Beauty by Zee - Product Data
// Images served via Cloudinary CDN (auto format, auto quality, 600px wide)
// Prices are managed by admin via admin portal

const CDN = 'https://res.cloudinary.com/mtlh9cyx/image/upload/f_auto,q_auto,w_600/beauty-by-zee';

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Face Wash",
    description: "Deep Cleansing · Refreshing · Glow Boosting. For All Skin Types.",
    category: "Face Care",
    image: `${CDN}/face-wash`,
    defaultPrice: 0,
    badge: "Bestseller"
  },
  {
    id: 2,
    name: "Face Cream",
    description: "Hydration · Brightening · Nourishing. For All Skin Types.",
    category: "Face Care",
    image: `${CDN}/face-cream`,
    defaultPrice: 0,
    badge: "New"
  },
  {
    id: 3,
    name: "Super Glow Soap",
    description: "Brightening · Even Tone · Radiance. Smooth · Radiant · Renewed.",
    category: "Body Care",
    image: `${CDN}/super-glow-soap`,
    defaultPrice: 0,
    badge: null
  },
  {
    id: 4,
    name: "Glow Body Scrub",
    description: "Brightening & Exfoliating. Smooth · Radiant · Renewed. For All Skin Types.",
    category: "Body Care",
    image: `${CDN}/glow-body-scrub`,
    defaultPrice: 0,
    badge: "Popular"
  },
  {
    id: 5,
    name: "Super Glow Oil",
    description: "Radiance · Nourishment · Even Tone. A Few Drops. A Natural Glow. For All Skin Types.",
    category: "Body Care",
    image: `${CDN}/super-glow-oil-1`,
    defaultPrice: 0,
    badge: "Bestseller"
  },
  {
    id: 6,
    name: "Qasli Powder",
    description: "100% Natural Moroccan Ritual. Glow & Detoxify. Skin Detoxifier & Brightener. For All Skin Types.",
    category: "Natural Rituals",
    image: `${CDN}/qasli-powder-1`,
    defaultPrice: 0,
    badge: "Natural"
  },
  {
    id: 7,
    name: "Nila Mask",
    description: "Lighten. Brighten. Glow. For Hyperpigmentation — Safe & Side-Effect Free. Natural · Pure · Effective.",
    category: "Face Care",
    image: `${CDN}/nila-mask-1`,
    defaultPrice: 0,
    badge: "Trending"
  },
  {
    id: 8,
    name: "Beauty By Zee Body Cream",
    description: "Soft, Silky, Radiant Skin. Luxurious daily moisturiser for glowing skin.",
    category: "Body Care",
    image: `${CDN}/body-cream`,
    defaultPrice: 0,
    badge: null
  },
  {
    id: 9,
    name: "Glow Cream (500ml)",
    description: "Intense Moisture. Radiant Glow. Available in 500ml jar.",
    category: "Body Care",
    image: `${CDN}/glow-cream`,
    defaultPrice: 0,
    badge: null
  },
  {
    id: 10,
    name: "Glow Cream (1KG)",
    description: "Intense Moisture. Radiant Glow. Family-size 1KG jar — best value.",
    category: "Body Care",
    image: `${CDN}/glow-cream-2`,
    defaultPrice: 0,
    badge: "Best Value"
  },
  {
    id: 11,
    name: "Moroccan Black Soap",
    description: "100% Natural. No Added Chemicals. Deep Cleans & Glow. Natural · Pure · Traditional.",
    category: "Natural Rituals",
    image: `${CDN}/moroccan-black-soap-1`,
    defaultPrice: 0,
    badge: "Natural"
  },
  {
    id: 12,
    name: "Extreme Glowing Oil",
    description: "The Perfect Combo. Radiant, Even-Toned Skin.",
    category: "Body Care",
    image: `${CDN}/extreme-glowing-oil`,
    defaultPrice: 0,
    badge: null
  },
  {
    id: 13,
    name: "Caramel Body Lotion",
    description: "The Perfect Combo with Extreme Glowing Oil. Radiant, Even-Toned Skin.",
    category: "Body Care",
    image: `${CDN}/product-collection-1`,
    defaultPrice: 0,
    badge: null
  },
  {
    id: 14,
    name: "Glow Soap & Body Scrub Set",
    description: "Nourish. Exfoliate. Radiate. Super Glow Soap + Glow Body Scrub combo.",
    category: "Sets & Combos",
    image: `${CDN}/glow-soap-scrub`,
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
