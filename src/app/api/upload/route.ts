import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

const uploadDir = path.join(process.cwd(), "public", "uploads");

async function saveFileLocally(file: File) {
  await fs.mkdir(uploadDir, { recursive: true });
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadDir, uniqueName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, bytes);
  return `/uploads/${uniqueName}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await saveFileLocally(file);
    return NextResponse.json({
      success: true,
      url,
      filename: path.basename(url),
    });
  } catch {
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  }
}
