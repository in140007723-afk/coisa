export type Product = {
  id: string;
  name: string;
  category: string;
  categorySlug?: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  condition: string;
  description: string;
  imageUrl: string;
  slug: string;
  featured: boolean;
  tags: string[];
  specifications: Record<string, string>;
  createdAt: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
};

export type InquiryItem = {
  id: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  message: string;
  selectedProducts: string[];
  createdAt: string;
};

export type QuotationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  productsNeeded: string;
  quantity: string;
  notes: string;
  createdAt: string;
};

const PRODUCT_STORAGE_KEY = "coisa-computers-products";
const CATEGORY_STORAGE_KEY = "coisa-computers-categories";
const INQUIRY_STORAGE_KEY = "coisa-computers-inquiries";
const QUOTE_STORAGE_KEY = "coisa-computers-quotations";
const NO_TIMESTAMP = "not-available";

export const defaultCategories: ProductCategory[] = [
  { id: "category-laptops", name: "Laptops", description: "Business, student, and premium productivity laptops.", createdAt: NO_TIMESTAMP },
  { id: "category-desktops", name: "Desktops", description: "Powerful workstations and office desktops.", createdAt: NO_TIMESTAMP },
  { id: "category-printers", name: "Printers", description: "Laser, inkjet, and multifunction printers.", createdAt: NO_TIMESTAMP },
  { id: "category-laptop-bags", name: "Laptop Bags", description: "Professional and travel-friendly laptop bags for everyday carry.", createdAt: NO_TIMESTAMP },
  { id: "category-accessories", name: "Accessories", description: "Keyboards, mice, sleeves, chargers, and more.", createdAt: NO_TIMESTAMP },
];

export const defaultProducts: Product[] = [
  {
    id: "sample-laptop",
    name: "HP EliteBook 840 G8",
    category: "Laptops",
    brand: "HP",
    model: "840 G8",
    price: 145000,
    stock: 8,
    condition: "Refurbished",
    description: "14-inch business laptop with 16GB RAM and fast SSD storage.",
    imageUrl: "/images/tech-showcase.svg",
    slug: "hp-elitebook-840-g8",
    featured: true,
    tags: ["business", "laptop", "refurbished"],
    specifications: {
      Processor: "Intel Core i7",
      RAM: "16GB",
      Storage: "512GB SSD",
      Display: "14-inch FHD",
      Warranty: "6 months",
    },
    createdAt: NO_TIMESTAMP,
  },
  {
    id: "sample-printer",
    name: "Canon MF3010",
    category: "Printers",
    brand: "Canon",
    model: "MF3010",
    price: 48000,
    stock: 5,
    condition: "Brand New",
    description: "Compact laser printer with scanning and efficient office use.",
    imageUrl: "/images/tech-showcase.svg",
    slug: "canon-mf3010",
    featured: false,
    tags: ["printer", "office"],
    specifications: {
      Type: "Laser Printer",
      Function: "Print + Scan",
      Connectivity: "USB",
      Warranty: "1 Year",
    },
    createdAt: NO_TIMESTAMP,
  },
];

export function readProducts(): Product[] {
  if (typeof window === "undefined") {
    return defaultProducts;
  }

  try {
    const raw = window.localStorage.getItem(PRODUCT_STORAGE_KEY);
    if (!raw) {
      saveProducts(defaultProducts);
      return defaultProducts;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultProducts;
  } catch {
    return defaultProducts;
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

export function readCategories(): ProductCategory[] {
  if (typeof window === "undefined") {
    return defaultCategories;
  }

  try {
    const raw = window.localStorage.getItem(CATEGORY_STORAGE_KEY);
    if (!raw) {
      saveCategories(defaultCategories);
      return defaultCategories;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

export function saveCategories(categories: ProductCategory[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
}

export function readInquiries(): InquiryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInquiries(inquiries: InquiryItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(inquiries));
}

export function readQuotationRequests(): QuotationRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveQuotationRequests(quotations: QuotationRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(quotations));
}

export function createProduct(input: Omit<Product, "id" | "createdAt">): Product {
  return {
    id: createId(),
    createdAt: NO_TIMESTAMP,
    ...input,
  };
}

export function createCategory(input: Omit<ProductCategory, "id" | "createdAt">): ProductCategory {
  return {
    id: createId(),
    createdAt: NO_TIMESTAMP,
    ...input,
  };
}

export function createInquiry(input: Omit<InquiryItem, "id" | "createdAt">): InquiryItem {
  return {
    id: createId(),
    createdAt: NO_TIMESTAMP,
    ...input,
  };
}

export function createQuotationRequest(input: Omit<QuotationRequest, "id" | "createdAt">): QuotationRequest {
  return {
    id: createId(),
    createdAt: NO_TIMESTAMP,
    ...input,
  };
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
