import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { AccountProfileCard } from "@/components/account/AccountProfileCard";

export default async function AccountPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, phone: true, image: true, createdAt: true },
  });
  if (!user) redirect("/login");

  const [orderCount, spentAgg] = await Promise.all([
    prisma.order.count({ where: { userId: sessionUser.id } }),
    prisma.order.aggregate({
      where: { userId: sessionUser.id, status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
  ]);
  const totalSpent = Number(spentAgg._sum.total ?? 0);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Account</h1>

      <AccountProfileCard
        initial={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          image: user.image,
          createdAt: user.createdAt.toISOString(),
        }}
        orderCount={orderCount}
        totalSpent={totalSpent}
      />
    </div>
  );
}
