import { NextResponse } from "next/server";
import { createQuotationRequest, readQuotationRequests, saveQuotationRequests } from "@/lib/product-store";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const quotations = readQuotationRequests();
    const quotation = createQuotationRequest({
      name: data.name ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      company: data.company ?? "",
      productsNeeded: data.productsNeeded ?? "",
      quantity: data.quantity ?? "",
      notes: data.notes ?? "",
    });

    saveQuotationRequests([quotation, ...quotations]);
    return NextResponse.json({ success: true, quotation });
  } catch {
    return NextResponse.json({ error: "Unable to process quotation request" }, { status: 500 });
  }
}
