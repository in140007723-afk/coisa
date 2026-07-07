import { queryDb } from "./db";

const publicUrlPrefix = "/api/uploads";

export async function ensureUploadsTable() {
  await queryDb(`
    CREATE TABLE IF NOT EXISTS uploads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      mimeType VARCHAR(50) NOT NULL,
      data LONGBLOB NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function saveUploadedFile(file: File) {
  await ensureUploadsTable();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const uniqueName = `${Date.now()}-${safeName}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  const base64Data = bytes.toString("base64");

  await queryDb(
    "INSERT INTO uploads (filename, mimeType, data) VALUES (?, ?, ?)",
    [uniqueName, file.type, base64Data]
  );

  return {
    filename: uniqueName,
    url: `${publicUrlPrefix}/${uniqueName}`,
  };
}

export async function getUploadedFile(fileName: string) {
  const cleanedName = fileName.split("/").pop() || "";
  const result = await queryDb<any[]>(
    "SELECT mimeType, data FROM uploads WHERE filename = ?",
    [cleanedName]
  );

  if (!result || !result.length) {
    return null;
  }

  const { mimeType, data } = result[0];
  const buffer = Buffer.from(data, "base64");
  return { mimeType, buffer };
}
