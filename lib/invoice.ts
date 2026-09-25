import { readFile } from "fs/promises";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import { getInvoiceSettings } from "@/lib/settings";
import { InvoiceDocument, type InvoiceOrderData } from "@/components/pdf/InvoiceDocument";

const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

async function logoToDataUri(logo: string | null): Promise<string | null> {
  if (!logo || !logo.startsWith("/uploads/")) return null;
  try {
    const filePath = path.join(process.cwd(), "public", logo);
    const buffer = await readFile(filePath);
    const ext = logo.split(".").pop()?.toLowerCase() ?? "";
    const mime = EXT_TO_MIME[ext];
    if (!mime) return null;
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Renders an order invoice to a PDF buffer, used by both the download/preview routes and order-confirmation email attachments. */
export async function renderInvoicePdf(order: InvoiceOrderData): Promise<Buffer> {
  const settings = await getInvoiceSettings();
  const logoDataUri = await logoToDataUri(settings.logo);

  return renderToBuffer(InvoiceDocument({ order, company: settings, logoDataUri }));
}
