"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ShoppingBag, Wallet, KeyRound, MapPin, ArrowRight, Pencil } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { formatPrice, formatDate } from "@/lib/format";

interface Props {
  initial: { name: string; email: string; phone: string | null; image: string | null; createdAt: string };
  orderCount: number;
  totalSpent: number;
}

export function AccountProfileCard({ initial, orderCount, totalSpent }: Props) {
  const { update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [image, setImage] = useState<string | null>(initial.image);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function cancelEdit() {
    setName(initial.name);
    setPhone(initial.phone ?? "");
    setImage(initial.image);
    setError(null);
    setIsEditing(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, image }),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setError(json.message ?? "Something went wrong");
      return;
    }
    await update({ name: json.data.name, image: json.data.image });
    setIsEditing(false);
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-soft">
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
            {image ? (
              <Image
                src={image}
                alt=""
                width={64}
                height={64}
                className="h-12 w-12 shrink-0 rounded-full border-2 border-white/70 object-cover sm:h-16 sm:w-16"
              />
            ) : (
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-xl font-bold text-white sm:h-16 sm:w-16 sm:text-2xl">
                {name[0]?.toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-white sm:text-xl">{name}</p>
              <p className="truncate text-sm text-white/80">{initial.email}</p>
              <p className="mt-1 text-xs text-white/70">Member since {formatDate(initial.createdAt)}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex shrink-0 items-center justify-center gap-1.5 self-start rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/25 sm:self-auto"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
        <div className="flex flex-col items-center gap-1 py-5">
          <ShoppingBag className="h-5 w-5 text-primary-500" />
          <p className="text-lg font-bold text-gray-900">{orderCount}</p>
          <p className="text-xs text-gray-500">Orders Placed</p>
        </div>
        <div className="flex flex-col items-center gap-1 py-5">
          <Wallet className="h-5 w-5 text-accent-600" />
          <p className="text-lg font-bold text-gray-900">{formatPrice(totalSpent)}</p>
          <p className="text-xs text-gray-500">Total Spent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Edit Profile</h2>
              <ImageUpload
                label="Profile photo"
                value={image}
                onChange={setImage}
                folder="avatars"
                size="lg"
                uploadEndpoint="/api/upload"
              />
              <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" isLoading={isSaving} className="flex-1">
                  Save changes
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Contact Details</h2>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium text-gray-900">{name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-gray-900">{initial.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-medium text-gray-900">{phone || "—"}</dd>
                </div>
              </dl>
            </>
          )}
        </div>

        <div className="flex flex-col justify-center gap-3 p-6">
          <Link
            href="/account/orders"
            className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" /> View My Orders
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link
            href="/account/addresses"
            className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Manage Addresses
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
          <Link
            href="/forgot-password"
            className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:border-primary-300 hover:bg-primary-50"
          >
            <span className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" /> Change Password
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
