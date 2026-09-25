import { requireAdmin, ApiError } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { sendMail, MailNotConfiguredError } from "@/lib/mail";
import { testEmailSchema } from "@/schemas/admin-settings";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = testEmailSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    await sendMail({
      to: parsed.data.to,
      subject: "Test email from your store",
      html: "<p>This is a test email confirming your SMTP settings are working correctly.</p>",
      text: "This is a test email confirming your SMTP settings are working correctly.",
    });

    return ok(null, `Test email sent to ${parsed.data.to}`);
  } catch (error) {
    if (error instanceof ApiError) return handleApiError(error);
    if (error instanceof MailNotConfiguredError) {
      return fail(400, "Enable email sending and fill in SMTP host + from email before testing");
    }
    if (error instanceof Error) return fail(502, `SMTP error: ${error.message}`);
    return handleApiError(error);
  }
}
