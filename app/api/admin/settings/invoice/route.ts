import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { getInvoiceSettings, updateInvoiceSettings } from "@/lib/settings";
import { invoiceSettingsSchema } from "@/schemas/admin-settings";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getInvoiceSettings();
    return ok(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = invoiceSettingsSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const settings = await updateInvoiceSettings({
      companyName: data.companyName,
      addressLine1: data.addressLine1 || null,
      addressLine2: data.addressLine2 || null,
      phone: data.phone || null,
      email: data.email || null,
      taxId: data.taxId || null,
      footerNote: data.footerNote || null,
      logo: data.logo || null,
      invoicePrefix: data.invoicePrefix,
    });

    return ok(settings, "Invoice settings saved");
  } catch (error) {
    return handleApiError(error);
  }
}
