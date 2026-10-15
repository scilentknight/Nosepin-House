import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { ok, fail, handleApiError } from "@/lib/api";
import { customerPutSchema, customerPatchSchema } from "@/schemas/admin-customer";

const customerSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  image: true,
  role: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { orders: true, reviews: true, addresses: true } },
  addresses: {
    orderBy: { isDefault: "desc" },
    take: 5,
    select: {
      id: true,
      fullName: true,
      phone: true,
      line1: true,
      landmark: true,
      wardNo: true,
      addressType: true,
      isDefault: true,
      province: { select: { name: true } },
      district: { select: { name: true } },
      municipality: { select: { name: true } },
    },
  },
  orders: {
    orderBy: { placedAt: "desc" },
    take: 5,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      total: true,
      placedAt: true,
    },
  },
};

async function findCustomer(id) {
  return prisma.user.findFirst({
    where: { id, role: "USER" },
    select: customerSelect,
  });
}

async function assertEmailAvailable(email, customerId) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.id !== customerId) {
    return "This email is already in use";
  }
  return null;
}

function mapCustomer(customer) {
  return {
    ...customer,
    orders: customer.orders.map((order) => ({
      ...order,
      total: Number(order.total),
    })),
  };
}

export async function GET(_request, { params }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid customer id");

    const customer = await findCustomer(id);
    if (!customer) return fail(404, "Customer not found");

    return ok(mapCustomer(customer));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid customer id");

    const existing = await prisma.user.findFirst({ where: { id, role: "USER" } });
    if (!existing) return fail(404, "Customer not found");

    const body = await request.json();
    const parsed = customerPutSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const email = parsed.data.email.toLowerCase().trim();
    const emailError = await assertEmailAvailable(email, id);
    if (emailError) return fail(400, emailError);

    const phone =
      parsed.data.phone === undefined || parsed.data.phone === ""
        ? null
        : parsed.data.phone;

    const customer = await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name,
        email,
        phone,
      },
      select: customerSelect,
    });

    return ok(mapCustomer(customer), "Customer updated");
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    await requireAdmin();
    const { id: rawId } = await params;
    const id = Number(rawId);
    if (Number.isNaN(id)) return fail(400, "Invalid customer id");

    const existing = await prisma.user.findFirst({ where: { id, role: "USER" } });
    if (!existing) return fail(404, "Customer not found");

    const body = await request.json();
    const parsed = customerPatchSchema.safeParse(body);
    if (!parsed.success) return fail(400, parsed.error.issues[0]?.message ?? "Invalid request");

    const data = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.phone !== undefined) {
      data.phone = parsed.data.phone === "" ? null : parsed.data.phone;
    }
    if (parsed.data.email !== undefined) {
      const email = parsed.data.email.toLowerCase().trim();
      const emailError = await assertEmailAvailable(email, id);
      if (emailError) return fail(400, emailError);
      data.email = email;
    }
    if (parsed.data.emailVerified !== undefined) {
      data.emailVerified = parsed.data.emailVerified
        ? existing.emailVerified ?? new Date()
        : null;
    }

    const customer = await prisma.user.update({
      where: { id },
      data,
      select: customerSelect,
    });

    return ok(mapCustomer(customer), "Customer updated");
  } catch (error) {
    return handleApiError(error);
  }
}
