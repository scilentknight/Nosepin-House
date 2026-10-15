import { createHmac } from "crypto";
const envDefaults = {
    productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
    secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
    paymentUrl: process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    statusUrl: process.env.ESEWA_STATUS_URL || "https://rc.esewa.com.np/api/epay/transaction/status/",
};
/** Merges admin-configured Payment Settings over the env-var/sandbox defaults. */
export function resolveEsewaConfig(overrides) {
    return {
        productCode: overrides?.esewaProductCode || envDefaults.productCode,
        secretKey: overrides?.esewaSecretKey || envDefaults.secretKey,
        paymentUrl: overrides?.esewaPaymentUrl || envDefaults.paymentUrl,
        statusUrl: overrides?.esewaStatusUrl || envDefaults.statusUrl,
    };
}
function sign(config, fields, signedFieldNames) {
    const message = signedFieldNames.map((name) => `${name}=${fields[name]}`).join(",");
    return createHmac("sha256", config.secretKey).update(message).digest("base64");
}
export function buildEsewaFormFields(params) {
    const config = params.config ?? envDefaults;
    const amount = params.productAmount.toFixed(2);
    const taxAmount = (params.taxAmount ?? 0).toFixed(2);
    const deliveryCharge = (params.deliveryCharge ?? 0).toFixed(2);
    const totalAmount = (params.productAmount + (params.taxAmount ?? 0) + (params.deliveryCharge ?? 0)).toFixed(2);
    const signedFieldNames = ["total_amount", "transaction_uuid", "product_code"];
    const fields = {
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
    };
}
export async function checkEsewaStatus(transactionUuid, totalAmount, config = envDefaults) {
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
