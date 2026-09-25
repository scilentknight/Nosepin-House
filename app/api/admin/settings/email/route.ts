import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { getEmailSettings, updateEmailSettings } from "@/lib/settings";
import { emailSettingsSchema } from "@/schemas/admin-settings";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await getEmailSettings();
    return ok({ ...settings, smtpPassword: undefined, hasPassword: Boolean(settings.smtpPassword) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = emailSettingsSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = parsed.data;
    const settings = await updateEmailSettings({
      enabled: data.enabled,
      smtpHost: data.smtpHost || null,
      smtpPort: data.smtpPort,
      smtpUser: data.smtpUser || null,
      smtpPassword: data.smtpPassword === undefined ? undefined : data.smtpPassword || null,
      secure: data.secure,
      fromName: data.fromName,
      fromEmail: data.fromEmail || null,
    });

    return ok({ ...settings, smtpPassword: undefined, hasPassword: Boolean(settings.smtpPassword) }, "Email settings saved");
  } catch (error) {
    return handleApiError(error);
  }
}
