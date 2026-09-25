import nodemailer from "nodemailer";
import { getEmailSettings } from "@/lib/settings";

export class MailNotConfiguredError extends Error {
  constructor() {
    super("Email sending is not configured or enabled");
  }
}

interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: MailAttachment[];
}) {
  const settings = await getEmailSettings();

  if (!settings.enabled || !settings.smtpHost || !settings.fromEmail) {
    throw new MailNotConfiguredError();
  }

  const transporter = nodemailer.createTransport({
    host: settings.smtpHost,
    port: settings.smtpPort,
    secure: settings.secure,
    auth: settings.smtpUser ? { user: settings.smtpUser, pass: settings.smtpPassword ?? undefined } : undefined,
  });

  return transporter.sendMail({
    from: `"${settings.fromName}" <${settings.fromEmail}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  });
}

/** Best-effort send — never throws, since email delivery must not block order placement. */
export async function sendMailBestEffort(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: MailAttachment[];
}) {
  try {
    await sendMail(options);
    return true;
  } catch (error) {
    if (!(error instanceof MailNotConfiguredError)) {
      console.error("[mail] send failed:", error);
    }
    return false;
  }
}

const SITE_URL = (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
const BRAND_PRIMARY = "#f85606";
const BRAND_SECONDARY = "#e8324a";
const BRAND_ACCENT = "#019c3a";

function formatMoney(amount: number) {
  return `Rs ${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function button(label: string, href: string, color: string = BRAND_PRIMARY) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 4px;">
      <tr>
        <td align="center" bgcolor="${color}" style="border-radius:8px;">
          <a href="${href}" target="_blank" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;">
            ${label}
          </a>
        </td>
      </tr>
    </table>`;
}

/**
 * Shared table-based layout for every transactional email. Kept deliberately
 * simple (no CSS grid/flexbox, no external images) so it renders consistently
 * across Gmail, Outlook, and mobile mail clients.
 */
function emailLayout({ preheader, bodyHtml }: { preheader: string; bodyHtml: string }) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<title>DXN</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(15,15,15,0.08);">
          <tr>
            <td bgcolor="${BRAND_PRIMARY}" style="background-color:${BRAND_PRIMARY};background-image:linear-gradient(135deg,${BRAND_PRIMARY},${BRAND_SECONDARY});padding:26px 32px;">
              <span style="font-size:22px;font-weight:800;letter-spacing:0.5px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">DXN</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td bgcolor="#fafafa" style="background-color:#fafafa;padding:20px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;line-height:18px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">
                This is an automated message from DXN — please don't reply directly to this email.
              </p>
              <p style="margin:6px 0 0;font-size:12px;line-height:18px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">
                &copy; ${year} DXN. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export interface OrderConfirmationData {
  orderNumber: string;
  fullName: string;
  paymentMethod: "COD" | "ONLINE";
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  taxLabel: string | null;
  total: number;
  shipping: {
    phone: string;
    email: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export function orderConfirmationEmail(order: OrderConfirmationData) {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-family:Arial,Helvetica,sans-serif;">
          ${escapeHtml(item.name)}
        </td>
        <td align="center" style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">
          &times;${item.quantity}
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;font-family:Arial,Helvetica,sans-serif;white-space:nowrap;">
          ${formatMoney(item.price * item.quantity)}
        </td>
      </tr>`
    )
    .join("");

  const discountRow =
    order.discount > 0
      ? `<tr>
          <td style="padding:4px 0;font-size:14px;color:${BRAND_ACCENT};font-family:Arial,Helvetica,sans-serif;">Discount</td>
          <td></td>
          <td align="right" style="padding:4px 0;font-size:14px;color:${BRAND_ACCENT};font-family:Arial,Helvetica,sans-serif;">
            -${formatMoney(order.discount)}
          </td>
        </tr>`
      : "";

  const shippingRow = `<tr>
          <td style="padding:4px 0;font-size:14px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Shipping</td>
          <td></td>
          <td align="right" style="padding:4px 0;font-size:14px;color:#111827;font-family:Arial,Helvetica,sans-serif;">
            ${order.shippingFee > 0 ? formatMoney(order.shippingFee) : "Free"}
          </td>
        </tr>`;

  const taxRow =
    order.tax > 0
      ? `<tr>
          <td style="padding:4px 0;font-size:14px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(order.taxLabel ?? "Tax")}</td>
          <td></td>
          <td align="right" style="padding:4px 0;font-size:14px;color:#111827;font-family:Arial,Helvetica,sans-serif;">
            ${formatMoney(order.tax)}
          </td>
        </tr>`
      : "";

  const addressLines = [
    order.shipping.line1,
    order.shipping.line2,
    `${order.shipping.city}, ${order.shipping.state}${order.shipping.postalCode ? ` ${order.shipping.postalCode}` : ""}`,
    order.shipping.country,
  ]
    .filter(Boolean)
    .map((line) => escapeHtml(line as string))
    .join("<br />");

  const bodyHtml = `
    <h1 style="margin:0 0 6px;font-size:21px;color:#111827;font-family:Arial,Helvetica,sans-serif;">
      Thanks for your order, ${escapeHtml(order.fullName)}!
    </h1>
    <p style="margin:0 0 24px;font-size:14px;line-height:20px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">
      Your order <strong style="color:#111827;">${escapeHtml(order.orderNumber)}</strong> has been placed and is now being processed. We'll email you again once it ships.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:8px;">
      <thead>
        <tr>
          <th align="left" style="padding:0 0 8px;border-bottom:2px solid #e5e7eb;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">Item</th>
          <th align="center" style="padding:0 0 8px;border-bottom:2px solid #e5e7eb;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">Qty</th>
          <th align="right" style="padding:0 0 8px;border-bottom:2px solid #e5e7eb;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="padding:10px 0 4px;font-size:14px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">Subtotal</td>
        <td></td>
        <td align="right" style="padding:10px 0 4px;font-size:14px;color:#111827;font-family:Arial,Helvetica,sans-serif;">${formatMoney(order.subtotal)}</td>
      </tr>
      ${discountRow}
      ${shippingRow}
      ${taxRow}
      <tr>
        <td style="padding:10px 0 0;border-top:1px solid #e5e7eb;font-size:16px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;">Total</td>
        <td style="border-top:1px solid #e5e7eb;"></td>
        <td align="right" style="padding:10px 0 0;border-top:1px solid #e5e7eb;font-size:16px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;">${formatMoney(order.total)}</td>
      </tr>
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td width="50%" valign="top" style="background-color:#f9fafb;border-radius:10px;padding:16px 18px;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;font-weight:700;">Shipping Address</p>
          <p style="margin:0;font-size:13px;line-height:19px;color:#374151;">
            ${escapeHtml(order.fullName)}<br />${addressLines}<br />${escapeHtml(order.shipping.phone)}
          </p>
        </td>
        <td width="12"></td>
        <td width="50%" valign="top" style="background-color:#f9fafb;border-radius:10px;padding:16px 18px;font-family:Arial,Helvetica,sans-serif;">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:0.4px;color:#9ca3af;font-weight:700;">Payment Method</p>
          <p style="margin:0;font-size:13px;line-height:19px;color:#374151;">
            ${order.paymentMethod === "COD" ? "Cash on Delivery" : "eSewa (Paid Online)"}
          </p>
        </td>
      </tr>
    </table>

    ${button("View Order", `${SITE_URL}/account/orders`)}
  `;

  const textItems = order.items.map((item) => `  - ${item.name} x${item.quantity}: ${formatMoney(item.price * item.quantity)}`).join("\n");
  const text = `Hi ${order.fullName},

Your order ${order.orderNumber} has been placed and is now being processed.

Items:
${textItems}

Subtotal: ${formatMoney(order.subtotal)}${order.discount > 0 ? `\nDiscount: -${formatMoney(order.discount)}` : ""}
Shipping: ${order.shippingFee > 0 ? formatMoney(order.shippingFee) : "Free"}${order.tax > 0 ? `\n${order.taxLabel ?? "Tax"}: ${formatMoney(order.tax)}` : ""}
Total: ${formatMoney(order.total)}

Shipping to: ${order.fullName}, ${order.shipping.line1}${order.shipping.line2 ? `, ${order.shipping.line2}` : ""}, ${order.shipping.city}, ${order.shipping.state}${order.shipping.postalCode ? ` ${order.shipping.postalCode}` : ""}, ${order.shipping.country}
Payment: ${order.paymentMethod === "COD" ? "Cash on Delivery" : "eSewa (Paid Online)"}

View your order: ${SITE_URL}/account/orders`;

  return {
    subject: `Order ${order.orderNumber} confirmed`,
    html: emailLayout({ preheader: `Your DXN order ${order.orderNumber} is confirmed.`, bodyHtml }),
    text,
  };
}

export function welcomeEmail(user: { name: string }) {
  const bodyHtml = `
    <h1 style="margin:0 0 6px;font-size:21px;color:#111827;font-family:Arial,Helvetica,sans-serif;">Welcome to DXN, ${escapeHtml(user.name)}!</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:21px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">
      Your account has been created successfully. We're glad to have you — explore our Ganoderma coffee, spirulina supplements,
      and natural personal care essentials, all made for everyday wellness.
    </p>
    ${button("Start Shopping", `${SITE_URL}/shop`)}
  `;

  return {
    subject: "Welcome to DXN",
    html: emailLayout({ preheader: "Your DXN account is ready.", bodyHtml }),
    text: `Hi ${user.name}, welcome to DXN! Your account has been created successfully. Start shopping: ${SITE_URL}/shop`,
  };
}

export function orderStatusUpdateEmail(order: { orderNumber: string; fullName: string }, message: string) {
  const bodyHtml = `
    <h1 style="margin:0 0 6px;font-size:21px;color:#111827;font-family:Arial,Helvetica,sans-serif;">
      Update on order ${escapeHtml(order.orderNumber)}
    </h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:21px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">
      Hi ${escapeHtml(order.fullName)},
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="background-color:#f9fafb;border-left:4px solid ${BRAND_PRIMARY};border-radius:6px;padding:16px 18px;font-size:14px;line-height:21px;color:#374151;font-family:Arial,Helvetica,sans-serif;">
          ${escapeHtml(message)}
        </td>
      </tr>
    </table>
    ${button("View Order", `${SITE_URL}/account/orders`)}
  `;

  return {
    subject: `Update on your order ${order.orderNumber}`,
    html: emailLayout({ preheader: message, bodyHtml }),
    text: `Hi ${order.fullName}, ${message}\n\nView your order: ${SITE_URL}/account/orders`,
  };
}

export function passwordResetEmail(resetUrl: string) {
  const bodyHtml = `
    <h1 style="margin:0 0 6px;font-size:21px;color:#111827;font-family:Arial,Helvetica,sans-serif;">Reset your password</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:21px;color:#6b7280;font-family:Arial,Helvetica,sans-serif;">
      We received a request to reset your DXN account password. Click the button below to choose a new one —
      this link expires in <strong>1 hour</strong>.
    </p>
    ${button("Reset Password", resetUrl)}
    <p style="margin:20px 0 0;font-size:12px;line-height:18px;color:#9ca3af;font-family:Arial,Helvetica,sans-serif;">
      If you didn't request this, you can safely ignore this email — your password won't be changed.
    </p>
  `;

  return {
    subject: "Reset your DXN password",
    html: emailLayout({ preheader: "Reset your DXN password — link expires in 1 hour.", bodyHtml }),
    text: `Reset your password: ${resetUrl} (expires in 1 hour). If you didn't request this, ignore this email.`,
  };
}
