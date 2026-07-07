import bcrypt from "bcryptjs";
import { queryDb } from "./db";
import fs from "fs";
import path from "path";
import { hashPassword } from "./auth";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  role: "admin";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  brand: string;
  model: string;
  description: string;
  specifications: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  images: string[];
  featured: boolean;
  status: "active" | "draft" | "archived";
  sku: string;
  tags: string[];
  warranty: string;
  quantity?: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  productId: string;
  subject: string;
  message: string;
  status: "New" | "Pending" | "Replied" | "Closed";
  adminReply: string;
  createdAt: string;
}

const fallbackProducts: Product[] = [
  {
    id: "prod-1",
    name: "Dell Latitude 7440",
    categoryId: "cat-1",
    categoryName: "Laptops",
    brand: "Dell",
    model: "7440",
    description: "Business-ready laptop with premium performance.",
    specifications: "16GB RAM • 512GB SSD • Intel i7",
    price: 129000,
    discountPrice: 118000,
    stockQuantity: 8,
    images: ["/images/laptop.png"],
    featured: true,
    status: "active",
    sku: "DL7440",
    tags: ["business", "premium"],
    warranty: "1 year",
    createdAt: new Date().toISOString(),
  },
];

const fallbackCategories: Category[] = [
  { id: "1", name: "Laptops", image: "/images/laptop.png", description: "Portable computing solutions", createdAt: new Date().toISOString() },
  { id: "2", name: "Accessories", image: "/images/accessories.png", description: "Computer peripherals and accessories", createdAt: new Date().toISOString() },
];

const fallbackEnquiries: Enquiry[] = [
  {
    id: "inq-1",
    customerName: "Jane Doe",
    email: "jane@example.com",
    phone: "+254700000000",
    productId: "prod-1",
    subject: "Laptop quote request",
    message: "I would like a quotation for the Dell Latitude 7440.",
    status: "New",
    adminReply: "",
    createdAt: new Date().toISOString(),
  },
];

const fallbackAdmins: AdminUser[] = [];

const fallbackState = {
  admins: fallbackAdmins,
  products: fallbackProducts,
  categories: fallbackCategories,
  enquiries: fallbackEnquiries,
};

const DATA_DIR = path.resolve(process.cwd(), ".data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  } catch (e) {
    // ignore
  }
}

function readPersistedProducts(): Product[] | null {
  try {
    if (!fs.existsSync(PRODUCTS_FILE)) return null;
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Product[];
  } catch (e) {
    // ignore
  }
  return null;
}

function writePersistedProducts(products: Product[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
  } catch (e) {
    // ignore
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseImageArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item)).filter(Boolean);
    } catch {
      // ignore
    }
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeCategoryId(value: unknown) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
  }
  return null;
}

function makeCategorySlug(value: string) {
  const normalized = (value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (!normalized) return "";
  if (normalized.endsWith("-ies")) return `${normalized.slice(0, -3)}y`;
  if (normalized.endsWith("-es")) return normalized.slice(0, -2);
  if (normalized.endsWith("-s")) return normalized.slice(0, -1);
  return normalized;
}

function mapProduct(row: Record<string, any>): Product {
  const fallbackImages = parseImageArray(row.images) || (row.image_url ? [row.image_url] : row.image ? [row.image] : []);
  return {
    id: String(row.id),
    name: row.name || "",
    categoryId: String(row.category_id || row.categoryId || row.category || ""),
    categoryName: row.category_name || row.categoryName || row.category || undefined,
    brand: row.brand || "",
    model: row.model || "",
    description: row.description || "",
    specifications: row.specifications || "",
    price: Number(row.price || 0),
    discountPrice: Number(row.discount_price || 0),
    stockQuantity: Number(row.stock_quantity || row.stock || 0),
    images: fallbackImages.map((image: string) => (image.startsWith("/api/uploads/") ? image : image)),
    featured: Boolean(row.featured),
    status: (row.status as Product["status"]) || (row.item_condition as Product["status"]) || "active",
    sku: row.sku || "",
    tags: parseStringArray(row.tags),
    warranty: row.warranty || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapCategory(row: Record<string, any>): Category {
  return {
    id: String(row.id),
    name: row.name || "",
    image: row.image || "",
    description: row.description || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

function mapEnquiry(row: Record<string, any>): Enquiry {
  return {
    id: String(row.id),
    customerName: row.customer_name || row.customerName || "",
    email: row.email || "",
    phone: row.phone || "",
    productId: String(row.product_id || row.productId || ""),
    subject: row.subject || "",
    message: row.message || "",
    status: (row.status as Enquiry["status"]) || "New",
    adminReply: row.admin_reply || row.adminReply || "",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export async function getAdminByEmail(email: string) {
  const rows = await queryDb<any[]>("SELECT * FROM admins WHERE email = ?", [email]);
  if (rows && rows.length) {
    return rows[0] as AdminUser;
  }
  return null;
}

export async function verifyAdminPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getProducts(params?: { search?: string; category?: string; brand?: string; availability?: string; sort?: string; limit?: number }) {
  const rows = await queryDb<any[]>("SELECT * FROM products ORDER BY created_at DESC");
  const imageRows = await queryDb<any[]>("SELECT product_id, image FROM product_images ORDER BY id ASC");
  const imagesByProductId = new Map<string, string[]>();
  (imageRows || []).forEach((imageRow) => {
    const productId = String(imageRow.product_id || "");
    if (!productId) return;
    const currentImages = imagesByProductId.get(productId) || [];
    currentImages.push(String(imageRow.image || ""));
    imagesByProductId.set(productId, currentImages.filter(Boolean));
  });
  let products = rows && rows.length ? rows.map((row) => {
    const mapped = mapProduct(row);
    const attachedImages = imagesByProductId.get(String(row.id)) || [];
    if (attachedImages.length) mapped.images = attachedImages;
    return mapped;
  }) : fallbackState.products;
  if ((!rows || !rows.length) && (!products || !products.length)) {
    const persisted = readPersistedProducts();
    if (persisted && persisted.length) products = persisted;
  }
  let filtered = [...products];
  if (params?.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter((item) => `${item.name} ${item.brand} ${item.model}`.toLowerCase().includes(term));
  }
  if (params?.category) {
    filtered = filtered.filter((item) => item.categoryId === params.category);
  }
  if (params?.brand) {
    const brand = params.brand.toLowerCase();
    filtered = filtered.filter((item) => item.brand.toLowerCase() === brand);
  }
  if (params?.availability === "in-stock") {
    filtered = filtered.filter((item) => item.stockQuantity > 0);
  }
  if (params?.availability === "out-of-stock") {
    filtered = filtered.filter((item) => item.stockQuantity <= 0);
  }
  if (params?.sort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  }
  if (params?.sort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  }
  if (params?.sort === "newest") {
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  if (params?.limit) {
    return filtered.slice(0, params.limit);
  }
  return filtered;
}

export async function createProduct(product: Omit<Product, "id" | "createdAt">) {
  const imagesToStore = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const imageValue = imagesToStore[0] || "";
  const slugValue = slugify(product.name || "");
  const categoryValue = product.categoryName || product.categoryId || "General";
  const stockValue = Number(product.stockQuantity ?? product.quantity ?? 0);
  const normalizedCategoryId = normalizeCategoryId(product.categoryId);
  const conditionValue = product.status === "active" ? "Brand New" : product.status;
  const insertResult = await queryDb<any>("INSERT INTO products (name, category_id, category, brand, model, price, discount_price, stock_quantity, stock, status, description, image_url, slug, featured, tags, specifications, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())", [product.name, normalizedCategoryId, categoryValue, product.brand, product.model, product.price, product.discountPrice || 0, stockValue, stockValue, conditionValue, product.description, imageValue, slugValue, product.featured ? 1 : 0, (product.tags || []).join(","), product.specifications,]);
  if (insertResult && typeof insertResult === "object" && "insertId" in insertResult) {
    const insertId = Number((insertResult as any).insertId);
    if (insertId) {
      for (const image of imagesToStore) {
        await queryDb<any>("INSERT INTO product_images (product_id, image) VALUES (?, ?)", [insertId, image]);
      }
    }
    const created = {
      ...product,
      id: String((insertResult as any).insertId),
      createdAt: new Date().toISOString(),
    } as Product;
    fallbackState.products.unshift(created);
    writePersistedProducts(fallbackState.products);
    return created;
  }
  const newProduct = { ...product, id: `prod-${Date.now()}`, createdAt: new Date().toISOString() } as Product;
  fallbackState.products.unshift(newProduct);
  writePersistedProducts(fallbackState.products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const imagesToStore = Array.isArray(updates.images) ? updates.images.filter(Boolean) : [];
  const imageValue = imagesToStore[0] || "";
  const slugValue = updates.name ? slugify(updates.name) : undefined;
  const categoryValue = updates.categoryName || updates.categoryId || "General";
  const stockValue = Number(updates.stockQuantity ?? updates.quantity ?? 0);
  const normalizedCategoryId = normalizeCategoryId(updates.categoryId);
  const conditionValue = updates.status === "active" ? "Brand New" : updates.status;
  const updateResult = await queryDb<any>("UPDATE products SET name = ?, category_id = ?, category = ?, brand = ?, model = ?, price = ?, discount_price = ?, stock_quantity = ?, stock = ?, status = ?, description = ?, image_url = ?, slug = ?, featured = ?, tags = ?, specifications = ? WHERE id = ?", [updates.name, normalizedCategoryId, categoryValue, updates.brand, updates.model, updates.price, updates.discountPrice || 0, stockValue, stockValue, conditionValue, updates.description, imageValue, slugValue, updates.featured ? 1 : 0, (updates.tags || []).join(","), updates.specifications, id]);
  if (id) {
    await queryDb<any>("DELETE FROM product_images WHERE product_id = ?", [id]);
    for (const image of imagesToStore) {
      await queryDb<any>("INSERT INTO product_images (product_id, image) VALUES (?, ?)", [id, image]);
    }
  }
  if (updateResult && typeof updateResult === "object") {
    const existing = fallbackState.products.find((item) => item.id === id);
    if (existing) {
      Object.assign(existing, updates);
      writePersistedProducts(fallbackState.products);
      return existing;
    }
  }
  const product = fallbackState.products.find((item) => item.id === id);
  if (!product) {
    return null;
  }
  Object.assign(product, updates);
  writePersistedProducts(fallbackState.products);
  return product;
}

export async function deleteProduct(id: string) {
  await queryDb<any>("DELETE FROM products WHERE id = ?", [id]);
  fallbackState.products = fallbackState.products.filter((item) => item.id !== id);
  writePersistedProducts(fallbackState.products);
  return true;
}

export async function getCategories() {
  const rows = await queryDb<any[]>("SELECT * FROM categories ORDER BY created_at DESC");
  return rows && rows.length ? rows.map(mapCategory) : fallbackState.categories;
}

export async function createCategory(category: Omit<Category, "id" | "createdAt">) {
  const insertResult = await queryDb<any>("INSERT INTO categories (name, image, description, created_at) VALUES (?, ?, ?, NOW())", [category.name, category.image, category.description]);
  if (insertResult && typeof insertResult === "object" && "insertId" in insertResult) {
    const created = { ...category, id: String((insertResult as any).insertId), createdAt: new Date().toISOString() } as Category;
    fallbackState.categories.unshift(created);
    return created;
  }
  const newCategory = { ...category, id: `cat-${Date.now()}`, createdAt: new Date().toISOString() } as Category;
  fallbackState.categories.unshift(newCategory);
  return newCategory;
}

export async function updateCategory(id: string, updates: Partial<Category>) {
  await queryDb<any>("UPDATE categories SET name = ?, image = ?, description = ? WHERE id = ?", [updates.name, updates.image, updates.description, id]);
  const category = fallbackState.categories.find((item) => item.id === id);
  if (!category) {
    return null;
  }
  Object.assign(category, updates);
  return category;
}

export async function deleteCategory(id: string) {
  await queryDb<any>("DELETE FROM categories WHERE id = ?", [id]);
  fallbackState.categories = fallbackState.categories.filter((item) => item.id !== id);
  return true;
}

export async function getEnquiries(params?: { search?: string; status?: string; limit?: number }) {
  const rows = await queryDb<any[]>("SELECT * FROM enquiries ORDER BY created_at DESC");
  const enquiries = rows && rows.length ? rows.map(mapEnquiry) : fallbackState.enquiries;
  let filtered = [...enquiries];
  if (params?.search) {
    const term = params.search.toLowerCase();
    filtered = filtered.filter((item) => `${item.customerName} ${item.subject} ${item.message}`.toLowerCase().includes(term));
  }
  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((item) => item.status === params.status);
  }
  if (params?.limit) {
    return filtered.slice(0, params.limit);
  }
  return filtered;
}

export async function createEnquiry(enquiry: Omit<Enquiry, "id" | "createdAt">) {
  const insertResult = await queryDb<any>("INSERT INTO enquiries (customer_name, email, phone, product_id, subject, message, status, admin_reply, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())", [enquiry.customerName, enquiry.email, enquiry.phone, enquiry.productId, enquiry.subject, enquiry.message, enquiry.status || "New", enquiry.adminReply || ""]);
  if (insertResult && typeof insertResult === "object" && "insertId" in insertResult) {
    const created = { ...enquiry, id: String((insertResult as any).insertId), createdAt: new Date().toISOString() } as Enquiry;
    fallbackState.enquiries.unshift(created);
    return created;
  }
  const newEnquiry = { ...enquiry, id: `inq-${Date.now()}`, createdAt: new Date().toISOString() } as Enquiry;
  fallbackState.enquiries.unshift(newEnquiry);
  return newEnquiry;
}

export async function updateEnquiry(id: string, updates: Partial<Enquiry>) {
  await queryDb<any>("UPDATE enquiries SET status = ?, admin_reply = ? WHERE id = ?", [updates.status, updates.adminReply, id]);
  const enquiry = fallbackState.enquiries.find((item) => item.id === id);
  if (!enquiry) {
    return null;
  }
  Object.assign(enquiry, updates);
  return enquiry;
}

export async function deleteEnquiry(id: string) {
  await queryDb<any>("DELETE FROM enquiries WHERE id = ?", [id]);
  fallbackState.enquiries = fallbackState.enquiries.filter((item) => item.id !== id);
  return true;
}

export async function getDashboardStats() {
  const products = await getProducts();
  const enquiries = await getEnquiries();
  const categories = await getCategories();
  return {
    products: products.length,
    categories: categories.length,
    enquiries: enquiries.length,
    newEnquiries: enquiries.filter((item) => item.status === "New").length,
    lowStock: products.filter((item) => item.stockQuantity > 0 && item.stockQuantity <= 5).length,
    outOfStock: products.filter((item) => item.stockQuantity <= 0).length,
  };
}

