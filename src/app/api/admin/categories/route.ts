import { NextResponse } from "next/server";
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/lib/admin-store";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const body = await request.json();
  const category = await createCategory(body);
  return NextResponse.json({ success: true, category });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = await updateCategory(body.id, body);
  return NextResponse.json({ success: true, category: updated });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deleteCategory(id);
  return NextResponse.json({ success: true });
}
