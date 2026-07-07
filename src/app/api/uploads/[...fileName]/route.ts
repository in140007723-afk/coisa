import { NextResponse } from "next/server";
import { getUploadedFile } from "@/lib/upload-storage";

export async function GET(request: Request, { params }: { params: Promise<{ fileName: string[] }> }) {
  try {
    const resolvedParams = await params;
    const fileName = resolvedParams?.fileName?.join("/") ?? "";
    
    const uploadedFile = await getUploadedFile(fileName);
    if (!uploadedFile) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const { mimeType, buffer } = uploadedFile;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[uploads-api] error:", error);
    return NextResponse.json({ error: "Failed to retrieve image" }, { status: 500 });
  }
}
