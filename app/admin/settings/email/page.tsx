"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EmailSettingsValues {
  enabled: boolean;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  secure: boolean;
  fromName: string;
  fromEmail: string;
}

const EMPTY: EmailSettingsValues = {
  enabled: false,
  smtpHost: "",
  smtpPort: 587,
  smtpUser: "",
  smtpPassword: "",
  secure: false,
  fromName: "DXN",
  fromEmail: "",
};

export default function EmailSettingsPage() {
  const [values, setValues] = useState<EmailSettingsValues>(EMPTY);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [testEmail, setTestEmail] = useState("");
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/email")
      .then((res) => res.json())
      .then((json) => {
        const s = json.data;
        setValues({
          enabled: s.enabled,
          smtpHost: s.smtpHost ?? "",
          smtpPort: s.smtpPort,
          smtpUser: s.smtpUser ?? "",
          smtpPassword: "",
          secure: s.secure,
          fromName: s.fromName,
          fromEmail: s.fromEmail ?? "",
        });
        setHasPassword(s.hasPassword);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function set<K extends keyof EmailSettingsValues>(key: K, value: EmailSettingsValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/settings/email", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        smtpHost: values.smtpHost || null,
        smtpUser: values.smtpUser || null,
        fromEmail: values.fromEmail || null,
        smtpPassword: passwordTouched ? values.smtpPassword : undefined,
      }),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    setHasPassword(json.data.hasPassword);
    setPasswordTouched(false);
    setValues((v) => ({ ...v, smtpPassword: "" }));
    setMessage("Email settings saved");
  }

  async function handleTestEmail() {
    if (!testEmail) return;
    setIsTesting(true);
    setMessage(null);
    setError(null);
    const res = await fetch("/api/admin/settings/email/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: testEmail }),
    });
    const json = await res.json();
    setIsTesting(false);
    if (!res.ok) {
      setError(json.message);
      return;
    }
    setMessage(json.message);
  }

  if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Email Settings</h1>
      <p className="mt-1 text-sm text-gray-500">Configure the SMTP server used to send transactional email.</p>

      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={values.enabled} onChange={(e) => set("enabled", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          Enable email sending
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="SMTP host" value={values.smtpHost} onChange={(e) => set("smtpHost", e.target.value)} placeholder="smtp.example.com" />
          <Input
            label="SMTP port"
            type="number"
            value={values.smtpPort}
            onChange={(e) => set("smtpPort", Number(e.target.value))}
          />
          <Input label="SMTP username" value={values.smtpUser} onChange={(e) => set("smtpUser", e.target.value)} />
          <Input
            label={`SMTP password${hasPassword && !passwordTouched ? " (saved)" : ""}`}
            type="password"
            value={values.smtpPassword}
            onChange={(e) => {
              setPasswordTouched(true);
              set("smtpPassword", e.target.value);
            }}
            placeholder={hasPassword ? "Leave blank to keep existing password" : ""}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={values.secure} onChange={(e) => set("secure", e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
          Use TLS/SSL (typically port 465)
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="From name" value={values.fromName} onChange={(e) => set("fromName", e.target.value)} />
          <Input label="From email" type="email" value={values.fromEmail} onChange={(e) => set("fromEmail", e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <Button type="submit" variant="admin" isLoading={isSaving} className="self-start">
          Save settings
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Send a test email</h2>
        <div className="flex gap-2">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
          <Button type="button" variant="adminOutline" isLoading={isTesting} onClick={handleTestEmail}>
            Send test
          </Button>
        </div>
      </div>
    </div>
  );
}
