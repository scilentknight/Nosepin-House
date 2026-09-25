"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useAddressBookTree } from "@/hooks/useAddressBookTree";

interface ShippingZoneRow {
  id: number;
  country: string;
  label: string;
  rate: number;
  freeShippingMinOrder: number | null;
  isDefault: boolean;
}

interface TaxRateRow {
  id: number;
  country: string;
  label: string;
  percent: number;
  active: boolean;
}

interface MunicipalityRateRow {
  id: number;
  municipalityId: number;
  municipalityName: string;
  districtId: number | null;
  districtName: string | null;
  provinceId: number | null;
  provinceName: string | null;
  label: string | null;
  rate: number;
  freeShippingMinOrder: number | null;
}

type ZoneFormValues = Omit<ShippingZoneRow, "id">;
type RateFormValues = Omit<TaxRateRow, "id">;
interface MunicipalityRateFormValues {
  provinceId: number | null;
  districtId: number | null;
  municipalityId: number | null;
  label: string;
  rate: number;
  freeShippingMinOrder: number | null;
}

const EMPTY_ZONE: ZoneFormValues = { country: "", label: "", rate: 0, freeShippingMinOrder: null, isDefault: false };
const EMPTY_RATE: RateFormValues = { country: "", label: "VAT", percent: 0, active: true };
const EMPTY_MUNICIPALITY_RATE: MunicipalityRateFormValues = {
  provinceId: null,
  districtId: null,
  municipalityId: null,
  label: "",
  rate: 0,
  freeShippingMinOrder: null,
};

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft-lg">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {children}
        <button type="button" onClick={onClose} className="sr-only">
          Close
        </button>
      </div>
    </div>
  );
}

export default function ShippingTaxSettingsPage() {
  const [zones, setZones] = useState<ShippingZoneRow[]>([]);
  const [rates, setRates] = useState<TaxRateRow[]>([]);
  const [municipalityRates, setMunicipalityRates] = useState<MunicipalityRateRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const tree = useAddressBookTree();

  const [zoneModal, setZoneModal] = useState<{ id: number | null; values: ZoneFormValues } | null>(null);
  const [rateModal, setRateModal] = useState<{ id: number | null; values: RateFormValues } | null>(null);
  const [municipalityRateModal, setMunicipalityRateModal] = useState<{
    id: number | null;
    values: MunicipalityRateFormValues;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteZoneTarget, setDeleteZoneTarget] = useState<ShippingZoneRow | null>(null);
  const [deleteRateTarget, setDeleteRateTarget] = useState<TaxRateRow | null>(null);
  const [deleteMunicipalityRateTarget, setDeleteMunicipalityRateTarget] = useState<MunicipalityRateRow | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const load = useCallback(() => {
    setIsLoading(true);
    Promise.all([
      fetch("/api/admin/settings/shipping-zones").then((res) => res.json()),
      fetch("/api/admin/settings/tax-rates").then((res) => res.json()),
      fetch("/api/admin/settings/municipality-shipping-rates").then((res) => res.json()),
    ])
      .then(([zonesJson, ratesJson, municipalityRatesJson]) => {
        setZones(zonesJson.data ?? []);
        setRates(ratesJson.data ?? []);
        setMunicipalityRates(municipalityRatesJson.data ?? []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const districtsForModal = useMemo(() => {
    if (!tree || !municipalityRateModal?.values.provinceId) return [];
    const province = tree.provinces.find((p) => p.id === municipalityRateModal.values.provinceId);
    return province?.districts ?? [];
  }, [tree, municipalityRateModal?.values.provinceId]);

  const municipalitiesForModal = useMemo(() => {
    if (!municipalityRateModal?.values.districtId) return [];
    const district = districtsForModal.find((d) => d.id === municipalityRateModal.values.districtId);
    return district?.municipalities ?? [];
  }, [districtsForModal, municipalityRateModal?.values.districtId]);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function saveZone() {
    if (!zoneModal) return;
    setIsSaving(true);
    setFormError(null);
    const isEdit = zoneModal.id !== null;
    const res = await fetch(
      isEdit ? `/api/admin/settings/shipping-zones/${zoneModal.id}` : "/api/admin/settings/shipping-zones",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zoneModal.values),
      }
    );
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setFormError(json.message ?? "Something went wrong");
      return;
    }
    setZoneModal(null);
    load();
  }

  async function saveRate() {
    if (!rateModal) return;
    setIsSaving(true);
    setFormError(null);
    const isEdit = rateModal.id !== null;
    const res = await fetch(isEdit ? `/api/admin/settings/tax-rates/${rateModal.id}` : "/api/admin/settings/tax-rates", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rateModal.values),
    });
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setFormError(json.message ?? "Something went wrong");
      return;
    }
    setRateModal(null);
    load();
  }

  async function saveMunicipalityRate() {
    if (!municipalityRateModal) return;
    if (!municipalityRateModal.values.municipalityId) {
      setFormError("Please select a province, district, and city");
      return;
    }
    setIsSaving(true);
    setFormError(null);
    const isEdit = municipalityRateModal.id !== null;
    const res = await fetch(
      isEdit
        ? `/api/admin/settings/municipality-shipping-rates/${municipalityRateModal.id}`
        : "/api/admin/settings/municipality-shipping-rates",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          municipalityId: municipalityRateModal.values.municipalityId,
          label: municipalityRateModal.values.label,
          rate: municipalityRateModal.values.rate,
          freeShippingMinOrder: municipalityRateModal.values.freeShippingMinOrder,
        }),
      }
    );
    const json = await res.json();
    setIsSaving(false);
    if (!res.ok) {
      setFormError(json.message ?? "Something went wrong");
      return;
    }
    setMunicipalityRateModal(null);
    load();
  }

  async function deleteMunicipalityRate() {
    if (!deleteMunicipalityRateTarget) return;
    setIsBusy(true);
    const res = await fetch(`/api/admin/settings/municipality-shipping-rates/${deleteMunicipalityRateTarget.id}`, {
      method: "DELETE",
    });
    setIsBusy(false);
    if (res.ok) {
      setDeleteMunicipalityRateTarget(null);
      load();
    }
  }

  async function toggleRateActive(rate: TaxRateRow) {
    setRates((prev) => prev.map((r) => (r.id === rate.id ? { ...r, active: !r.active } : r)));
    const res = await fetch(`/api/admin/settings/tax-rates/${rate.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !rate.active }),
    });
    if (!res.ok) {
      setRates((prev) => prev.map((r) => (r.id === rate.id ? { ...r, active: rate.active } : r)));
    }
  }

  async function deleteZone() {
    if (!deleteZoneTarget) return;
    setIsBusy(true);
    const res = await fetch(`/api/admin/settings/shipping-zones/${deleteZoneTarget.id}`, { method: "DELETE" });
    setIsBusy(false);
    if (res.ok) {
      setDeleteZoneTarget(null);
      load();
    }
  }

  async function deleteRate() {
    if (!deleteRateTarget) return;
    setIsBusy(true);
    const res = await fetch(`/api/admin/settings/tax-rates/${deleteRateTarget.id}`, { method: "DELETE" });
    setIsBusy(false);
    if (res.ok) {
      setDeleteRateTarget(null);
      load();
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shipping &amp; Tax</h1>
      <p className="mt-1 text-sm text-gray-500">
        Configure per-country shipping rates and VAT/tax rates applied at checkout.
      </p>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Shipping Zones</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Matched by the customer&apos;s shipping country. The zone marked Default is used when no exact match is found.
            </p>
          </div>
          <Button
            type="button"
            variant="admin"
            size="sm"
            onClick={() => {
              setFormError(null);
              setZoneModal({ id: null, values: EMPTY_ZONE });
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Zone
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading...</p>
          ) : zones.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No shipping zones configured yet.</p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Country</th>
                      <th className="px-4 py-3">Label</th>
                      <th className="px-4 py-3 text-right">Rate</th>
                      <th className="px-4 py-3 text-right">Free over</th>
                      <th className="px-4 py-3">Default</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {zones.map((zone) => (
                      <tr key={zone.id}>
                        <td className="px-4 py-3.5 font-medium text-gray-900">{zone.country}</td>
                        <td className="px-4 py-3.5 text-gray-600">{zone.label}</td>
                        <td className="px-4 py-3.5 text-right text-gray-600">Rs {zone.rate.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-right text-gray-500">
                          {zone.freeShippingMinOrder ? `Rs ${zone.freeShippingMinOrder.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          {zone.isDefault && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                              Default
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="Edit"
                              aria-label="Edit"
                              onClick={() => {
                                setFormError(null);
                                setZoneModal({
                                  id: zone.id,
                                  values: {
                                    country: zone.country,
                                    label: zone.label,
                                    rate: zone.rate,
                                    freeShippingMinOrder: zone.freeShippingMinOrder,
                                    isDefault: zone.isDefault,
                                  },
                                });
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              aria-label="Delete"
                              onClick={() => setDeleteZoneTarget(zone)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-gray-100 md:hidden">
                {zones.map((zone) => (
                  <li key={zone.id} className="flex items-start justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-gray-900">{zone.country}</p>
                        {zone.isDefault && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{zone.label}</p>
                      <p className="mt-1 text-sm text-gray-600">
                        Rs {zone.rate.toLocaleString()}
                        {zone.freeShippingMinOrder && (
                          <span className="text-gray-400"> · free over Rs {zone.freeShippingMinOrder.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        title="Edit"
                        aria-label="Edit"
                        onClick={() => {
                          setFormError(null);
                          setZoneModal({
                            id: zone.id,
                            values: {
                              country: zone.country,
                              label: zone.label,
                              rate: zone.rate,
                              freeShippingMinOrder: zone.freeShippingMinOrder,
                              isDefault: zone.isDefault,
                            },
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        aria-label="Delete"
                        onClick={() => setDeleteZoneTarget(zone)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Tax Rates</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              VAT/tax percent applied to the post-discount amount, by shipping country. Countries with no match pay no tax.
            </p>
          </div>
          <Button
            type="button"
            variant="admin"
            size="sm"
            onClick={() => {
              setFormError(null);
              setRateModal({ id: null, values: EMPTY_RATE });
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Tax Rate
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading...</p>
          ) : rates.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No tax rates configured yet.</p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Country</th>
                      <th className="px-4 py-3">Label</th>
                      <th className="px-4 py-3 text-right">Percent</th>
                      <th className="px-4 py-3 text-center">Active</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {rates.map((rate) => (
                      <tr key={rate.id} className={rate.active ? "" : "opacity-50"}>
                        <td className="px-4 py-3.5 font-medium text-gray-900">{rate.country}</td>
                        <td className="px-4 py-3.5 text-gray-600">{rate.label}</td>
                        <td className="px-4 py-3.5 text-right text-gray-600">{rate.percent}%</td>
                        <td className="px-4 py-3.5 text-center">
                          <label
                            className="inline-flex cursor-pointer items-center"
                            title={rate.active ? "Applied at checkout" : "Not applied at checkout"}
                          >
                            <input
                              type="checkbox"
                              checked={rate.active}
                              onChange={() => toggleRateActive(rate)}
                              className="h-4 w-4 rounded border-gray-300 text-slate-700 focus:ring-slate-400"
                            />
                          </label>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="Edit"
                              aria-label="Edit"
                              onClick={() => {
                                setFormError(null);
                                setRateModal({
                                  id: rate.id,
                                  values: { country: rate.country, label: rate.label, percent: rate.percent, active: rate.active },
                                });
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              aria-label="Delete"
                              onClick={() => setDeleteRateTarget(rate)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-gray-100 md:hidden">
                {rates.map((rate) => (
                  <li key={rate.id} className={`flex items-start justify-between gap-3 py-3.5 ${rate.active ? "" : "opacity-50"}`}>
                    <div className="flex items-start gap-3">
                      <label
                        className="mt-0.5 inline-flex cursor-pointer items-center"
                        title={rate.active ? "Applied at checkout" : "Not applied at checkout"}
                      >
                        <input
                          type="checkbox"
                          checked={rate.active}
                          onChange={() => toggleRateActive(rate)}
                          className="h-4 w-4 rounded border-gray-300 text-slate-700 focus:ring-slate-400"
                        />
                      </label>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{rate.country}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{rate.label}</p>
                        <p className="mt-1 text-sm text-gray-600">{rate.percent}%</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        title="Edit"
                        aria-label="Edit"
                        onClick={() => {
                          setFormError(null);
                          setRateModal({
                            id: rate.id,
                            values: { country: rate.country, label: rate.label, percent: rate.percent, active: rate.active },
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        aria-label="Delete"
                        onClick={() => setDeleteRateTarget(rate)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Municipality Shipping Rates</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Overrides the Nepal shipping zone for a specific city/municipality — useful for cheaper local delivery or
              surcharging remote areas. Falls back to the zone above when a municipality has no override.
            </p>
          </div>
          <Button
            type="button"
            variant="admin"
            size="sm"
            onClick={() => {
              setFormError(null);
              setMunicipalityRateModal({ id: null, values: EMPTY_MUNICIPALITY_RATE });
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Add Municipality Rate
          </Button>
        </div>

        <div className="mt-4">
          {isLoading ? (
            <p className="py-6 text-center text-sm text-gray-500">Loading...</p>
          ) : municipalityRates.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No municipality-specific rates configured yet.</p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Municipality</th>
                      <th className="px-4 py-3">Label</th>
                      <th className="px-4 py-3 text-right">Rate</th>
                      <th className="px-4 py-3 text-right">Free over</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {municipalityRates.map((rate) => (
                      <tr key={rate.id}>
                        <td className="px-4 py-3.5">
                          <p className="font-medium text-gray-900">{rate.municipalityName}</p>
                          <p className="text-xs text-gray-500">
                            {rate.districtName}, {rate.provinceName}
                          </p>
                        </td>
                        <td className="px-4 py-3.5 text-gray-600">{rate.label ?? "—"}</td>
                        <td className="px-4 py-3.5 text-right text-gray-600">Rs {rate.rate.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-right text-gray-500">
                          {rate.freeShippingMinOrder ? `Rs ${rate.freeShippingMinOrder.toLocaleString()}` : "—"}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              title="Edit"
                              aria-label="Edit"
                              onClick={() => {
                                setFormError(null);
                                setMunicipalityRateModal({
                                  id: rate.id,
                                  values: {
                                    provinceId: rate.provinceId,
                                    districtId: rate.districtId,
                                    municipalityId: rate.municipalityId,
                                    label: rate.label ?? "",
                                    rate: rate.rate,
                                    freeShippingMinOrder: rate.freeShippingMinOrder,
                                  },
                                });
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-slate-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title="Delete"
                              aria-label="Delete"
                              onClick={() => setDeleteMunicipalityRateTarget(rate)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="divide-y divide-gray-100 md:hidden">
                {municipalityRates.map((rate) => (
                  <li key={rate.id} className="flex items-start justify-between gap-3 py-3.5">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{rate.municipalityName}</p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {rate.districtName}, {rate.provinceName}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Rs {rate.rate.toLocaleString()}
                        {rate.freeShippingMinOrder && (
                          <span className="text-gray-400"> · free over Rs {rate.freeShippingMinOrder.toLocaleString()}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        title="Edit"
                        aria-label="Edit"
                        onClick={() => {
                          setFormError(null);
                          setMunicipalityRateModal({
                            id: rate.id,
                            values: {
                              provinceId: rate.provinceId,
                              districtId: rate.districtId,
                              municipalityId: rate.municipalityId,
                              label: rate.label ?? "",
                              rate: rate.rate,
                              freeShippingMinOrder: rate.freeShippingMinOrder,
                            },
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        aria-label="Delete"
                        onClick={() => setDeleteMunicipalityRateTarget(rate)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      {zoneModal && (
        <ModalShell title={zoneModal.id === null ? "Add Shipping Zone" : "Edit Shipping Zone"} onClose={() => setZoneModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveZone();
            }}
            className="mt-4 flex flex-col gap-4"
          >
            <Input
              label="Country"
              value={zoneModal.values.country}
              onChange={(e) => setZoneModal({ ...zoneModal, values: { ...zoneModal.values, country: e.target.value } })}
              placeholder="e.g. Nepal, or International for the fallback zone"
              required
            />
            <Input
              label="Label"
              value={zoneModal.values.label}
              onChange={(e) => setZoneModal({ ...zoneModal, values: { ...zoneModal.values, label: e.target.value } })}
              placeholder="e.g. Nepal Domestic Shipping"
              required
            />
            <Input
              label="Rate (Rs)"
              type="number"
              min={0}
              step="0.01"
              value={zoneModal.values.rate}
              onChange={(e) => setZoneModal({ ...zoneModal, values: { ...zoneModal.values, rate: Number(e.target.value) } })}
              required
            />
            <Input
              label="Free shipping over (optional)"
              type="number"
              min={0}
              step="0.01"
              value={zoneModal.values.freeShippingMinOrder ?? ""}
              onChange={(e) =>
                setZoneModal({
                  ...zoneModal,
                  values: { ...zoneModal.values, freeShippingMinOrder: e.target.value === "" ? null : Number(e.target.value) },
                })
              }
              placeholder="No free shipping threshold"
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={zoneModal.values.isDefault}
                onChange={(e) => setZoneModal({ ...zoneModal, values: { ...zoneModal.values, isDefault: e.target.checked } })}
                className="h-4 w-4 rounded border-gray-300"
              />
              Use as the default/fallback zone for unmatched countries
            </label>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="adminOutline" size="sm" onClick={() => setZoneModal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="admin" size="sm" isLoading={isSaving}>
                {zoneModal.id === null ? "Add Zone" : "Save Changes"}
              </Button>
            </div>
          </form>
        </ModalShell>
      )}

      {rateModal && (
        <ModalShell title={rateModal.id === null ? "Add Tax Rate" : "Edit Tax Rate"} onClose={() => setRateModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveRate();
            }}
            className="mt-4 flex flex-col gap-4"
          >
            <Input
              label="Country"
              value={rateModal.values.country}
              onChange={(e) => setRateModal({ ...rateModal, values: { ...rateModal.values, country: e.target.value } })}
              placeholder="e.g. Nepal"
              required
            />
            <Input
              label="Label"
              value={rateModal.values.label}
              onChange={(e) => setRateModal({ ...rateModal, values: { ...rateModal.values, label: e.target.value } })}
              placeholder="e.g. VAT"
              required
            />
            <Input
              label="Percent (%)"
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={rateModal.values.percent}
              onChange={(e) => setRateModal({ ...rateModal, values: { ...rateModal.values, percent: Number(e.target.value) } })}
              required
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={rateModal.values.active}
                onChange={(e) => setRateModal({ ...rateModal, values: { ...rateModal.values, active: e.target.checked } })}
                className="h-4 w-4 rounded border-gray-300"
              />
              Apply this tax rate at checkout
            </label>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="adminOutline" size="sm" onClick={() => setRateModal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="admin" size="sm" isLoading={isSaving}>
                {rateModal.id === null ? "Add Tax Rate" : "Save Changes"}
              </Button>
            </div>
          </form>
        </ModalShell>
      )}

      {municipalityRateModal && (
        <ModalShell
          title={municipalityRateModal.id === null ? "Add Municipality Rate" : "Edit Municipality Rate"}
          onClose={() => setMunicipalityRateModal(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMunicipalityRate();
            }}
            className="mt-4 flex flex-col gap-4"
          >
            <Select
              label="Province"
              disabled={!tree}
              value={municipalityRateModal.values.provinceId ?? ""}
              onChange={(e) =>
                setMunicipalityRateModal({
                  ...municipalityRateModal,
                  values: {
                    ...municipalityRateModal.values,
                    provinceId: e.target.value ? Number(e.target.value) : null,
                    districtId: null,
                    municipalityId: null,
                  },
                })
              }
            >
              <option value="">Select province</option>
              {tree?.provinces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>

            <Select
              label="District"
              disabled={!municipalityRateModal.values.provinceId || districtsForModal.length === 0}
              value={municipalityRateModal.values.districtId ?? ""}
              onChange={(e) =>
                setMunicipalityRateModal({
                  ...municipalityRateModal,
                  values: {
                    ...municipalityRateModal.values,
                    districtId: e.target.value ? Number(e.target.value) : null,
                    municipalityId: null,
                  },
                })
              }
            >
              <option value="">Select district</option>
              {districtsForModal.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>

            <Select
              label="City"
              disabled={!municipalityRateModal.values.districtId || municipalitiesForModal.length === 0}
              value={municipalityRateModal.values.municipalityId ?? ""}
              onChange={(e) =>
                setMunicipalityRateModal({
                  ...municipalityRateModal,
                  values: { ...municipalityRateModal.values, municipalityId: e.target.value ? Number(e.target.value) : null },
                })
              }
            >
              <option value="">Select city</option>
              {municipalitiesForModal.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>

            <Input
              label="Label (optional)"
              value={municipalityRateModal.values.label}
              onChange={(e) =>
                setMunicipalityRateModal({
                  ...municipalityRateModal,
                  values: { ...municipalityRateModal.values, label: e.target.value },
                })
              }
              placeholder="Defaults to the municipality name"
            />
            <Input
              label="Rate (Rs)"
              type="number"
              min={0}
              step="0.01"
              value={municipalityRateModal.values.rate}
              onChange={(e) =>
                setMunicipalityRateModal({
                  ...municipalityRateModal,
                  values: { ...municipalityRateModal.values, rate: Number(e.target.value) },
                })
              }
              required
            />
            <Input
              label="Free shipping over (optional)"
              type="number"
              min={0}
              step="0.01"
              value={municipalityRateModal.values.freeShippingMinOrder ?? ""}
              onChange={(e) =>
                setMunicipalityRateModal({
                  ...municipalityRateModal,
                  values: {
                    ...municipalityRateModal.values,
                    freeShippingMinOrder: e.target.value === "" ? null : Number(e.target.value),
                  },
                })
              }
              placeholder="No free shipping threshold"
            />

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="adminOutline" size="sm" onClick={() => setMunicipalityRateModal(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="admin" size="sm" isLoading={isSaving}>
                {municipalityRateModal.id === null ? "Add Municipality Rate" : "Save Changes"}
              </Button>
            </div>
          </form>
        </ModalShell>
      )}

      <ConfirmDialog
        open={deleteZoneTarget !== null}
        title="Delete this shipping zone?"
        description={`This will remove the "${deleteZoneTarget?.label ?? ""}" zone. This cannot be undone.`}
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={deleteZone}
        onCancel={() => setDeleteZoneTarget(null)}
      />

      <ConfirmDialog
        open={deleteRateTarget !== null}
        title="Delete this tax rate?"
        description={`This will remove the tax rate for "${deleteRateTarget?.country ?? ""}". This cannot be undone.`}
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={deleteRate}
        onCancel={() => setDeleteRateTarget(null)}
      />

      <ConfirmDialog
        open={deleteMunicipalityRateTarget !== null}
        title="Delete this municipality rate?"
        description={`This will remove the shipping rate override for "${deleteMunicipalityRateTarget?.municipalityName ?? ""}". This cannot be undone.`}
        confirmLabel="Delete"
        danger
        isBusy={isBusy}
        onConfirm={deleteMunicipalityRate}
        onCancel={() => setDeleteMunicipalityRateTarget(null)}
      />
    </div>
  );
}
