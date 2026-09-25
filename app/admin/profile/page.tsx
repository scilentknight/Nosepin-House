"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminProfilePage() {
  const { update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((json) => {
        setName(json.data.name);
        setEmail(json.data.email);
        setImage(json.data.image ?? null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMessage(null);
    setProfileError(null);
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, image }),
    });
    const json = await res.json();
    setIsSavingProfile(false);
    if (!res.ok) {
      setProfileError(json.message);
      return;
    }
    await update({ name: json.data.name, email: json.data.email, image: json.data.image });
    setProfileMessage("Profile updated");
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage(null);
    setPasswordError(null);
    const res = await fetch("/api/admin/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
    });
    const json = await res.json();
    setIsChangingPassword(false);
    if (!res.ok) {
      setPasswordError(json.message);
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordMessage("Password changed successfully");
  }

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Profile</h1>
      <p className="mt-1 text-sm text-gray-500">Update your admin account details.</p>

      <form onSubmit={handleSaveProfile} className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile Info</h2>
        <ImageUpload label="Profile photo" value={image} onChange={setImage} folder="avatars" size="lg" />
        <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {profileError && <p className="text-sm text-red-600">{profileError}</p>}
        {profileMessage && <p className="text-sm text-green-600">{profileMessage}</p>}
        <Button type="submit" variant="admin" isLoading={isSavingProfile} className="self-start">
          Save profile
        </Button>
      </form>

      <form onSubmit={handleChangePassword} className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Change Password</h2>
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
        {passwordMessage && <p className="text-sm text-green-600">{passwordMessage}</p>}
        <Button type="submit" variant="admin" isLoading={isChangingPassword} className="self-start">
          Change password
        </Button>
      </form>
    </div>
  );
}
