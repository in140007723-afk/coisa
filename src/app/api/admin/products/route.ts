import { NextResponse } from "next/server";
import { createProduct, deleteProduct, getProducts, updateProduct } from "@/lib/admin-store";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const body = await request.json();
  // Log incoming admin payload for debugging category/image mapping
  try {
    // eslint-disable-next-line no-console
    console.log('[API /api/admin/products] incoming payload:', JSON.stringify(body));
  } catch (e) {
    // ignore
  }

  const normalizedBody = {
    ...body,
    categoryId: body.categoryId ?? body.category ?? "",
    categoryName: body.categoryName || body.category || "",
    images: Array.isArray(body.images) ? body.images : body.imageUrl ? [body.imageUrl] : [],
    stockQuantity: Number(body.stockQuantity ?? body.stock ?? 0),
    discountPrice: Number(body.discountPrice ?? 0),
    price: Number(body.price ?? 0),
    featured: Boolean(body.featured),
    tags: Array.isArray(body.tags) ? body.tags : [],
    status: body.status || "active",
  };

  const product = await createProduct(normalizedBody);

  try {
    // eslint-disable-next-line no-console
    console.log('[API /api/admin/products] created product:', JSON.stringify(product));
  } catch (e) {
    // ignore
  }

  return NextResponse.json({ success: true, product });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = await updateProduct(body.id, body);
  return NextResponse.json({ success: true, product: updated });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
