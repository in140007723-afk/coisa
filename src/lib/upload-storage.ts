import { queryDb } from "./db";
import { promises as fs } from "fs";
import path from "path";

const publicUrlPrefix = "/api/uploads";
const uploadDir = path.join(process.cwd(), "uploads");

async function ensureUploadDirectory() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (e) {
    console.error("[upload-storage] Failed to create upload directory:", e);
  }
}

export async function ensureUploadsTable() {
  const result = await queryDb(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      mimeType VARCHAR(50) NOT NULL,
      data LONGBLOB NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  if (result === null) {
    console.warn("[upload-storage] Database table creation failed or database not connected");
    return false;
  }

  return true;
}

export async function saveUploadedFile(file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safeName}`;

  // Try to save to database first
  const dbReady = await ensureUploadsTable();

  if (dbReady) {
    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      const base64Data = bytes.toString("base64");

      const result = await queryDb(
        "INSERT INTO uploads (filename, mimeType, data) VALUES (?, ?, ?)",
        [uniqueName, file.type, base64Data]
      );

      if (result) {
        console.log("[upload-storage] Image saved to database:", uniqueName);
        return {
          filename: uniqueName,
          url: `${publicUrlPrefix}/${uniqueName}`,
          storage: "database",
        };
      }
    } catch (e) {
      console.error("[upload-storage] Database insert failed:", e);
    }
  }

  // Fallback: Save to filesystem if database fails
  console.log("[upload-storage] Falling back to filesystem storage for:", uniqueName);
  try {
    await ensureUploadDirectory();
    const filePath = path.join(uploadDir, uniqueName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, bytes);

    return {
      filename: uniqueName,
      url: `${publicUrlPrefix}/${uniqueName}`,
      storage: "filesystem",
    };
  } catch (e) {
    console.error("[upload-storage] Filesystem save also failed:", e);
    throw new Error("Failed to save image to both database and filesystem");
  }
}

export async function getUploadedFile(fileName: string) {
  const cleanedName = fileName.split("/").pop() || "";

  // Try database first
  const result = await queryDb<any[]>(
    "SELECT mimeType, data FROM uploads WHERE filename = ?",
    [cleanedName]
  );

  if (result && result.length > 0) {
    const { mimeType, data } = result[0];
    const buffer = Buffer.from(data, "base64");
    return { mimeType, buffer, storage: "database" };
  }

  // Fallback to filesystem
  try {
    const filePath = path.join(uploadDir, cleanedName);
    const buffer = await fs.readFile(filePath);
    const ext = cleanedName.split(".").pop()?.toLowerCase() || "jpg";
    const mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    console.log("[upload-storage] Image retrieved from filesystem:", cleanedName);
    return { mimeType, buffer, storage: "filesystem" };
  } catch (e) {
    console.error("[upload-storage] File not found:", cleanedName, e);
    return null;
  }
}
