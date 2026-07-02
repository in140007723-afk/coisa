import { NextResponse } from "next/server";
import { createEnquiry, getEnquiries } from "@/lib/admin-store";

export async function GET() {
  const enquiries = await getEnquiries();
  return NextResponse.json(enquiries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const selectedProducts = Array.isArray(body.selectedProducts) ? body.selectedProducts : [];
    const subject = body.subject || (selectedProducts.length ? `Inquiry for ${selectedProducts.join(", ")}` : "Website inquiry");
    const message = [body.message, selectedProducts.length ? `Products of interest: ${selectedProducts.join(", ")}` : ""]
      .filter(Boolean)
      .join("\n");

    const enquiry = await createEnquiry({
      customerName: body.name || body.customerName || "",
      email: body.email || "",
      phone: body.phone || "",
      productId: body.productId || "",
      subject,
      message,
      status: "New",
      adminReply: "",
    });

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (error: any) {
    console.error("[POST /api/inquiries] Error:", error);
    return NextResponse.json({ error: "Backend connection failed" }, { status: 500 });
  }
}
