import { promises as fs } from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "uploads");
const publicUrlPrefix = "/api/uploads";

export async function ensureUploadDirectory() {
  await fs.mkdir(uploadDir, { recursive: true });
  return uploadDir;
}

export async function saveUploadedFile(file: File) {
  await ensureUploadDirectory();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadDir, uniqueName);
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, bytes);

  return {
    filePath,
    filename: uniqueName,
    url: `${publicUrlPrefix}/${uniqueName}`,
  };
}

export async function getUploadFilePath(fileName: string) {
  const cleanedName = path.basename(fileName);
  return path.join(uploadDir, cleanedName);
}
