import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/upload-storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: "Only image files are supported" }, { status: 400 });
    }

    const result = await saveUploadedFile(file);
    return NextResponse.json({ success: true, url: result.url, filename: result.filename });
  } catch (error) {
    console.error("[upload] error:", error);
    return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
  }
}
