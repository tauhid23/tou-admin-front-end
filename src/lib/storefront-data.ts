export type CategoryStatus = "Active" | "Hidden";
export type ProductStatus = "Active" | "Draft" | "Archived";
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export type StorefrontCategory = {
  id: string;
  label: string;
  slug: string;
  count: string;
  description: string;
  image: string;
  status: CategoryStatus;
  featured: boolean;
  subcategories: { id: string; label: string; products: number }[];
};

export type AdminProduct = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  image: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  stock: number;
  reserved: number;
  reorderPoint: number;
  incoming: number;
  warehouse: string;
  status: ProductStatus;
  rating: number;
  reviewsCount: number;
  deliveryWindow: string;
  lastUpdated: string;
};

export const storefrontCategories: StorefrontCategory[] = [
  {
    id: "men",
    label: "Men",
    slug: "men",
    count: "120+ items",
    description: "Everyday apparel, outerwear, and essentials.",
    image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: true,
    subcategories: [
      { id: "shirts", label: "Shirts", products: 24 },
      { id: "t-shirts", label: "T-Shirts", products: 32 },
      { id: "polo", label: "Polo", products: 14 },
      { id: "jackets", label: "Jackets", products: 18 },
      { id: "pants", label: "Pants", products: 21 },
      { id: "shoes", label: "Shoes", products: 11 },
    ],
  },
  {
    id: "women",
    label: "Women",
    slug: "women",
    count: "160+ items",
    description: "Dresses, tops, sets, and seasonal collections.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: true,
    subcategories: [
      { id: "dresses", label: "Dresses", products: 38 },
      { id: "tops", label: "Tops", products: 35 },
      { id: "gowns", label: "Gowns", products: 18 },
      { id: "skirts", label: "Skirts", products: 22 },
      { id: "bags", label: "Bags", products: 20 },
      { id: "footwear", label: "Footwear", products: 27 },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    slug: "kids",
    count: "90+ items",
    description: "Comfortable pieces for boys, girls, and babies.",
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: true,
    subcategories: [
      { id: "t-shirts", label: "T-Shirts", products: 19 },
      { id: "hoodies", label: "Hoodies", products: 15 },
      { id: "shorts", label: "Shorts", products: 12 },
      { id: "school-wear", label: "School Wear", products: 18 },
      { id: "baby-sets", label: "Baby Sets", products: 16 },
      { id: "shoes", label: "Shoes", products: 10 },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    slug: "accessories",
    count: "75+ items",
    description: "Add-ons that complete the order basket.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: true,
    subcategories: [
      { id: "belts", label: "Belts", products: 12 },
      { id: "caps", label: "Caps", products: 14 },
      { id: "wallets", label: "Wallets", products: 16 },
      { id: "scarves", label: "Scarves", products: 10 },
      { id: "socks", label: "Socks", products: 13 },
      { id: "jewelry", label: "Jewelry", products: 10 },
    ],
  },
  {
    id: "electronics",
    label: "Electronics",
    slug: "electronics",
    count: "210+ items",
    description: "Consumer devices, components, and smart products.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: false,
    subcategories: [
      { id: "mobile-accessories", label: "Mobile Accessories", products: 42 },
      { id: "audio", label: "Audio", products: 39 },
      { id: "chargers", label: "Chargers", products: 37 },
      { id: "smart-watches", label: "Smart Watches", products: 26 },
      { id: "cables", label: "Cables", products: 44 },
      { id: "led-lights", label: "LED Lights", products: 22 },
    ],
  },
  {
    id: "home-textile",
    label: "Home Textile",
    slug: "home-textile",
    count: "130+ items",
    description: "Soft goods for home, hotel, and retail programs.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: false,
    subcategories: [
      { id: "bedding", label: "Bedding", products: 30 },
      { id: "curtains", label: "Curtains", products: 22 },
      { id: "towels", label: "Towels", products: 24 },
      { id: "cushions", label: "Cushions", products: 18 },
      { id: "rugs", label: "Rugs", products: 17 },
      { id: "kitchen-linen", label: "Kitchen Linen", products: 19 },
    ],
  },
  {
    id: "beauty",
    label: "Beauty & Health",
    slug: "beauty",
    count: "110+ items",
    description: "Personal care, beauty tools, and wellness items.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: false,
    subcategories: [
      { id: "skin-care", label: "Skin Care", products: 25 },
      { id: "hair-tools", label: "Hair Tools", products: 19 },
      { id: "makeup", label: "Makeup", products: 24 },
      { id: "nail-care", label: "Nail Care", products: 13 },
      { id: "grooming", label: "Grooming", products: 16 },
      { id: "wellness", label: "Wellness", products: 13 },
    ],
  },
  {
    id: "sports",
    label: "Sports & Outdoor",
    slug: "sports",
    count: "85+ items",
    description: "Activewear, fitness gear, and travel-ready goods.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
    status: "Active",
    featured: false,
    subcategories: [
      { id: "activewear", label: "Activewear", products: 18 },
      { id: "gym-gear", label: "Gym Gear", products: 17 },
      { id: "outdoor-bags", label: "Outdoor Bags", products: 13 },
      { id: "cycling", label: "Cycling", products: 11 },
      { id: "camping", label: "Camping", products: 16 },
      { id: "team-wear", label: "Team Wear", products: 10 },
    ],
  },
];

export const adminProducts: AdminProduct[] = [
  {
    id: "P-1001",
    title: "Men Classic Shirt",
    slug: "men-classic-shirt",
    sku: "MEN-SHIRT-001",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
    category: "men",
    subcategory: "shirts",
    price: 24.99,
    comparePrice: 32,
    stock: 64,
    reserved: 6,
    reorderPoint: 18,
    incoming: 40,
    warehouse: "Dhaka warehouse",
    status: "Active",
    rating: 4.8,
    reviewsCount: 124,
    deliveryWindow: "2-3 days",
    lastUpdated: "Today, 10:20",
  },
  {
    id: "P-1002",
    title: "Women Summer Dress",
    slug: "women-summer-dress",
    sku: "WOM-DRESS-004",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    category: "women",
    subcategory: "dresses",
    price: 34.99,
    comparePrice: 46,
    stock: 11,
    reserved: 3,
    reorderPoint: 16,
    incoming: 30,
    warehouse: "Dhaka warehouse",
    status: "Active",
    rating: 4.7,
    reviewsCount: 156,
    deliveryWindow: "2-3 days",
    lastUpdated: "Today, 09:10",
  },
  {
    id: "P-1003",
    title: "Wireless Audio Earbuds",
    slug: "wireless-audio-earbuds",
    sku: "EL-AUDIO-013",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80",
    category: "electronics",
    subcategory: "audio",
    price: 39.99,
    stock: 0,
    reserved: 0,
    reorderPoint: 22,
    incoming: 75,
    warehouse: "Overseas supplier",
    status: "Active",
    rating: 4.5,
    reviewsCount: 84,
    deliveryWindow: "10-16 days",
    lastUpdated: "Yesterday",
  },
  {
    id: "P-1004",
    title: "Cotton Bedding Set",
    slug: "cotton-bedding-set",
    sku: "HOME-BED-014",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    category: "home-textile",
    subcategory: "bedding",
    price: 48.99,
    comparePrice: 58,
    stock: 28,
    reserved: 4,
    reorderPoint: 12,
    incoming: 0,
    warehouse: "Dhaka warehouse",
    status: "Active",
    rating: 4.8,
    reviewsCount: 76,
    deliveryWindow: "2-3 days",
    lastUpdated: "2 days ago",
  },
  {
    id: "P-1005",
    title: "Skin Care Travel Kit",
    slug: "skin-care-travel-kit",
    sku: "BEAUTY-SKIN-016",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    category: "beauty",
    subcategory: "skin-care",
    price: 29.99,
    stock: 7,
    reserved: 2,
    reorderPoint: 10,
    incoming: 25,
    warehouse: "Dhaka warehouse",
    status: "Draft",
    rating: 4.6,
    reviewsCount: 91,
    deliveryWindow: "2-3 days",
    lastUpdated: "4 days ago",
  },
  {
    id: "P-1006",
    title: "Outdoor Camping Lantern",
    slug: "outdoor-camping-lantern",
    sku: "SPORT-CAMP-019",
    image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
    category: "sports",
    subcategory: "camping",
    price: 18.49,
    stock: 46,
    reserved: 5,
    reorderPoint: 14,
    incoming: 0,
    warehouse: "Chattogram warehouse",
    status: "Active",
    rating: 4.3,
    reviewsCount: 36,
    deliveryWindow: "3-5 days",
    lastUpdated: "1 week ago",
  },
];

export function getCategoryLabel(categoryId: string) {
  return storefrontCategories.find((category) => category.id === categoryId)?.label ?? categoryId;
}

export function getSubcategoryLabel(categoryId: string, subcategoryId: string) {
  return (
    storefrontCategories
      .find((category) => category.id === categoryId)
      ?.subcategories.find((subcategory) => subcategory.id === subcategoryId)?.label ?? subcategoryId
  );
}

export function getStockStatus(product: Pick<AdminProduct, "stock" | "reorderPoint">): StockStatus {
  if (product.stock <= 0) return "Out of Stock";
  if (product.stock <= product.reorderPoint) return "Low Stock";
  return "In Stock";
}
