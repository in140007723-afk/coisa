import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), ".data");
const productsFile = path.join(dataDir, "products.json");
const inquiriesFile = path.join(dataDir, "inquiries.json");

async function ensureDataFile(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  await ensureDataFile(filePath);
  const content = await fs.readFile(filePath, "utf8");
  if (!content.trim()) {
    return [] as T;
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    return [] as T;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataFile(filePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export interface StoredProduct {
  id: string;
  name: string;
  category: string;
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
  specifications: Record<string, unknown>;
  createdAt: string;
}

export interface StoredInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  message: string;
  selectedProducts: string[];
  createdAt: string;
}

export async function getStoredProducts(): Promise<StoredProduct[]> {
  return readJsonFile<StoredProduct[]>(productsFile);
}

export async function addStoredProduct(product: StoredProduct) {
  const products = await getStoredProducts();
  const nextItems = [product, ...products.filter((item) => item.id !== product.id)];
  await writeJsonFile(productsFile, nextItems);
  return nextItems;
}

export async function deleteStoredProduct(id: string) {
  const products = await getStoredProducts();
  const nextItems = products.filter((item) => item.id !== id);
  await writeJsonFile(productsFile, nextItems);
  return nextItems;
}

export async function getStoredInquiries(): Promise<StoredInquiry[]> {
  return readJsonFile<StoredInquiry[]>(inquiriesFile);
}

export async function addStoredInquiry(inquiry: StoredInquiry) {
  const inquiries = await getStoredInquiries();
  const nextItems = [inquiry, ...inquiries.filter((item) => item.id !== inquiry.id)];
  await writeJsonFile(inquiriesFile, nextItems);
  return nextItems;
}
