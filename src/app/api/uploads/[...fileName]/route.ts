import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import { getUploadFilePath } from "@/lib/upload-storage";

export async function GET(request: Request, { params }: { params: Promise<{ fileName: string[] }> }) {
  try {
    const resolvedParams = await params;
    const fileName = resolvedParams?.fileName?.join("/") ?? "";
    const resolvedPath = await getUploadFilePath(fileName);
    const fileBuffer = await fs.readFile(resolvedPath);
    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}
