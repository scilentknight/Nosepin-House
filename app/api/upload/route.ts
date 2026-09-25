import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireUser } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";

export const runtime = "nodejs";

// Customer-facing upload endpoint — deliberately locked to the avatars folder only.
// Any other upload destination (products, categories, etc.) goes through /api/admin/upload.
const FOLDER = "avatars";

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    await requireUser();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) return fail(400, "No file provided");

    const ext = ALLOWED_MIME_TO_EXT[file.type];
    if (!ext) return fail(400, "Unsupported file type. Use JPEG, PNG, WEBP, or GIF.");
    if (file.size > MAX_SIZE_BYTES) return fail(400, "File exceeds the 5MB limit");

    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", FOLDER);
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return ok({ url: `/uploads/${FOLDER}/${filename}` });
  } catch (error) {
    return handleApiError(error);
  }
}
