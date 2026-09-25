import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { getPaymentSettings, updatePaymentSettings } from "@/lib/settings";
import { paymentSettingsSchema } from "@/schemas/admin-settings";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getPaymentSettings();
    return ok({
      ...settings,
      codMinOrderAmount: settings.codMinOrderAmount ? Number(settings.codMinOrderAmount) : null,
      codMaxOrderAmount: settings.codMaxOrderAmount ? Number(settings.codMaxOrderAmount) : null,
      esewaSecretKey: undefined,
      hasEsewaSecretKey: Boolean(settings.esewaSecretKey),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = paymentSettingsSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const settings = await updatePaymentSettings({
      codEnabled: data.codEnabled,
      codMinOrderAmount: data.codMinOrderAmount ?? null,
      codMaxOrderAmount: data.codMaxOrderAmount ?? null,
      esewaEnabled: data.esewaEnabled,
      esewaLogo: data.esewaLogo || null,
      esewaProductCode: data.esewaProductCode || null,
      esewaSecretKey: data.esewaSecretKey === undefined ? undefined : data.esewaSecretKey || null,
      esewaPaymentUrl: data.esewaPaymentUrl || null,
      esewaStatusUrl: data.esewaStatusUrl || null,
    });

    return ok(
      {
        ...settings,
        codMinOrderAmount: settings.codMinOrderAmount ? Number(settings.codMinOrderAmount) : null,
        codMaxOrderAmount: settings.codMaxOrderAmount ? Number(settings.codMaxOrderAmount) : null,
        esewaSecretKey: undefined,
        hasEsewaSecretKey: Boolean(settings.esewaSecretKey),
      },
      "Payment settings saved"
    );
  } catch (error) {
    return handleApiError(error);
  }
}
