import { NextResponse } from "next/server";
import { deleteEnquiry, getEnquiries, updateEnquiry } from "@/lib/admin-store";

export async function GET() {
  const enquiries = await getEnquiries();
  return NextResponse.json({ enquiries });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const updated = await updateEnquiry(body.id, body);
  return NextResponse.json({ success: true, enquiry: updated });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await deleteEnquiry(id);
  return NextResponse.json({ success: true });
}
