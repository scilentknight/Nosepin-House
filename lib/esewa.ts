import { createHmac } from "crypto";

/**
 * eSewa ePay v2 integration. Defaults to eSewa's official sandbox (UAT) merchant
 * code and secret key — both publicly documented by eSewa for integration testing
 * (see https://developer.esewa.com.np/pages/Epay). Override via env vars, or from
 * the admin dashboard's Payment Settings (which take precedence — see
 * `resolveEsewaConfig`); no code changes needed to go live.
 */
export interface EsewaConfig {
  productCode: string;
  secretKey: string;
  paymentUrl: string;
  statusUrl: string;
}

const envDefaults: EsewaConfig = {
  productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
  paymentUrl: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  statusUrl: process.env.ESEWA_STATUS_URL || "https://rc.esewa.com.np/api/epay/transaction/status/",
};

/** Merges admin-configured Payment Settings over the env-var/sandbox defaults. */
export function resolveEsewaConfig(overrides?: {
  esewaProductCode?: string | null;
  esewaSecretKey?: string | null;
  esewaPaymentUrl?: string | null;
  esewaStatusUrl?: string | null;
}): EsewaConfig {
  return {
    productCode: overrides?.esewaProductCode || envDefaults.productCode,
    secretKey: overrides?.esewaSecretKey || envDefaults.secretKey,
    paymentUrl: overrides?.esewaPaymentUrl || envDefaults.paymentUrl,
    statusUrl: overrides?.esewaStatusUrl || envDefaults.statusUrl,
  };
}

function sign(config: EsewaConfig, fields: Record<string, string>, signedFieldNames: string[]): string {
  const message = signedFieldNames.map((name) => `${name}=${fields[name]}`).join(",");
  return createHmac("sha256", config.secretKey).update(message).digest("base64");
}

export interface EsewaFormFields {
  amount: string;
  tax_amount: string;
  product_service_charge: string;
  product_delivery_charge: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export function buildEsewaFormFields(params: {
  transactionUuid: string;
  /** Product amount before tax/shipping — eSewa's "amount" field. */
  productAmount: number;
  taxAmount?: number;
  deliveryCharge?: number;
  successUrl: string;
  failureUrl: string;
  config?: EsewaConfig;
}): EsewaFormFields {
  const config = params.config ?? envDefaults;
  const amount = params.productAmount.toFixed(2);
  const taxAmount = (params.taxAmount ?? 0).toFixed(2);
  const deliveryCharge = (params.deliveryCharge ?? 0).toFixed(2);
  const totalAmount = (params.productAmount + (params.taxAmount ?? 0) + (params.deliveryCharge ?? 0)).toFixed(2);
  const signedFieldNames = ["total_amount", "transaction_uuid", "product_code"];
  const fields: Record<string, string> = {
    amount,
    tax_amount: taxAmount,
    product_service_charge: "0",
    product_delivery_charge: deliveryCharge,
    total_amount: totalAmount,
    transaction_uuid: params.transactionUuid,
    product_code: config.productCode,
  };

  return {
    ...fields,
    success_url: params.successUrl,
    failure_url: params.failureUrl,
    signed_field_names: signedFieldNames.join(","),
    signature: sign(config, fields, signedFieldNames),
  } as EsewaFormFields;
}

export type EsewaTransactionStatus =
  | "COMPLETE"
  | "PENDING"
  | "FULL_REFUND"
  | "PARTIAL_REFUND"
  | "AMBIGUOUS"
  | "NOT_FOUND"
  | "CANCELED";

export interface EsewaStatusResult {
  product_code: string;
  transaction_uuid: string;
  total_amount: number;
  status: EsewaTransactionStatus;
  ref_id: string | null;
}

export async function checkEsewaStatus(
  transactionUuid: string,
  totalAmount: number,
  config: EsewaConfig = envDefaults
): Promise<EsewaStatusResult> {
  const url = new URL(config.statusUrl);
  url.searchParams.set("product_code", config.productCode);
  url.searchParams.set("total_amount", totalAmount.toFixed(2));
  url.searchParams.set("transaction_uuid", transactionUuid);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`eSewa status check failed with HTTP ${res.status}`);
  }
  return res.json();
}
