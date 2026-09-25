import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = ["categories", "brands", "products", "variants", "banners", "invoices", "payment", "avatars"] as const;
type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder");

    if (!(file instanceof File)) return fail(400, "No file provided");
    if (typeof folder !== "string" || !ALLOWED_FOLDERS.includes(folder as UploadFolder)) {
      return fail(400, "Invalid upload folder");
    }

    const ext = ALLOWED_MIME_TO_EXT[file.type];
    if (!ext) return fail(400, "Unsupported file type. Use JPEG, PNG, WEBP, or GIF.");
    if (file.size > MAX_SIZE_BYTES) return fail(400, "File exceeds the 5MB limit");

    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return ok({ url: `/uploads/${folder}/${filename}` });
  } catch (error) {
    return handleApiError(error);
  }
}
