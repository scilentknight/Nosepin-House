import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  logo: { width: 48, height: 48, objectFit: "contain", marginBottom: 6 },
  companyName: { fontSize: 14, fontWeight: 700 },
  muted: { color: "#6b7280" },
  invoiceTitle: { fontSize: 20, fontWeight: 700, textAlign: "right" },
  section: { marginTop: 20 },
  twoCol: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 8, textTransform: "uppercase", color: "#6b7280", marginBottom: 3, letterSpacing: 0.5 },
  table: { marginTop: 20 },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottom: "1px solid #f3f4f6" },
  colName: { flex: 4 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1.5, textAlign: "right" },
  colTotal: { flex: 1.5, textAlign: "right" },
  headerCell: { fontSize: 8, textTransform: "uppercase", color: "#6b7280", letterSpacing: 0.5 },
  totalsBlock: { marginTop: 16, alignItems: "flex-end" },
  totalsRow: { flexDirection: "row", width: 200, justifyContent: "space-between", marginTop: 3 },
  grandTotalRow: {
    flexDirection: "row",
    width: 200,
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTop: "1px solid #e5e7eb",
  },
  grandTotalText: { fontSize: 12, fontWeight: 700 },
  footer: { marginTop: 40, paddingTop: 12, borderTop: "1px solid #e5e7eb", color: "#6b7280", fontSize: 9 },
});

export interface InvoiceOrderData {
  orderNumber: string;
  placedAt: string;
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  taxLabel: string | null;
  total: number;
  items: { name: string; price: number; quantity: number }[];
}

export interface InvoiceCompanyData {
  companyName: string;
  addressLine1: string | null;
  addressLine2: string | null;
  phone: string | null;
  email: string | null;
  taxId: string | null;
  footerNote: string | null;
  logo: string | null;
  invoicePrefix: string;
}

function formatMoney(value: number) {
  return `Rs ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function InvoiceDocument({ order, company, logoDataUri }: { order: InvoiceOrderData; company: InvoiceCompanyData; logoDataUri?: string | null }) {
  const invoiceNumber = `${company.invoicePrefix}${order.orderNumber}`;
  const placedDate = new Date(order.placedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is a PDF primitive, not an HTML img */}
            {logoDataUri && <Image src={logoDataUri} style={styles.logo} />}
            <Text style={styles.companyName}>{company.companyName}</Text>
            {company.addressLine1 && <Text style={styles.muted}>{company.addressLine1}</Text>}
            {company.addressLine2 && <Text style={styles.muted}>{company.addressLine2}</Text>}
            {company.phone && <Text style={styles.muted}>{company.phone}</Text>}
            {company.email && <Text style={styles.muted}>{company.email}</Text>}
            {company.taxId && <Text style={styles.muted}>Tax ID: {company.taxId}</Text>}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={[styles.muted, { textAlign: "right", marginTop: 4 }]}>{invoiceNumber}</Text>
            <Text style={[styles.muted, { textAlign: "right" }]}>{placedDate}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.twoCol]}>
          <View>
            <Text style={styles.label}>Bill To</Text>
            <Text>{order.fullName}</Text>
            <Text style={styles.muted}>{order.line1}{order.line2 ? `, ${order.line2}` : ""}</Text>
            <Text style={styles.muted}>
              {order.city}, {order.state}{order.postalCode ? ` ${order.postalCode}` : ""}, {order.country}
            </Text>
            <Text style={styles.muted}>{order.phone} · {order.email}</Text>
          </View>
          <View>
            <Text style={styles.label}>Payment</Text>
            <Text>{order.paymentMethod === "COD" ? "Cash on Delivery" : "eSewa (Online)"}</Text>
            <Text style={styles.muted}>Status: {order.paymentStatus}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.headerCell, styles.colName]}>Item</Text>
            <Text style={[styles.headerCell, styles.colQty]}>Qty</Text>
            <Text style={[styles.headerCell, styles.colPrice]}>Price</Text>
            <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
          </View>
          {order.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colName}>{item.name}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{formatMoney(item.price)}</Text>
              <Text style={styles.colTotal}>{formatMoney(item.price * item.quantity)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>Subtotal</Text>
            <Text>{formatMoney(order.subtotal)}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.muted}>Discount</Text>
              <Text>-{formatMoney(order.discount)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.muted}>Shipping</Text>
            <Text>{order.shippingFee > 0 ? formatMoney(order.shippingFee) : "Free"}</Text>
          </View>
          {order.tax > 0 && (
            <View style={styles.totalsRow}>
              <Text style={styles.muted}>{order.taxLabel ?? "Tax"}</Text>
              <Text>{formatMoney(order.tax)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalText}>Total</Text>
            <Text style={styles.grandTotalText}>{formatMoney(order.total)}</Text>
          </View>
        </View>

        {company.footerNote && (
          <View style={styles.footer}>
            <Text>{company.footerNote}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
