import { ok, handleApiError } from "@/lib/api";
import { getPaymentSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getPaymentSettings();
    return ok({
      codEnabled: settings.codEnabled,
      esewaEnabled: settings.esewaEnabled,
      esewaLogo: settings.esewaLogo,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
