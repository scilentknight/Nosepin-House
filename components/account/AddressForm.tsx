"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInput } from "@/schemas/checkout";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAddressBookTree, type AddressBookMunicipality } from "@/hooks/useAddressBookTree";

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Address",
  isSaving = false,
  formError,
  extraFooter,
  onLocationChange,
}: {
  defaultValues?: Partial<AddressInput>;
  onSubmit: (values: AddressInput) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  isSaving?: boolean;
  formError?: string | null;
  extraFooter?: React.ReactNode;
  /** Fires whenever the selected province/district/municipality/ward changes — lets a parent page (e.g. checkout) keep a live shipping estimate in sync. */
  onLocationChange?: (location: {
    provinceId?: number;
    districtId?: number;
    municipalityId?: number;
    wardNo?: number;
  }) => void;
}) {
  const tree = useAddressBookTree();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: { addressType: "HOME", ...defaultValues },
  });

  // Cascading selects need their <option>s in the DOM before a native <select>'s
  // value can "stick" — so defaultValues are only applied once the tree has loaded.
  useEffect(() => {
    if (tree && defaultValues) {
      reset({ addressType: "HOME", ...defaultValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree]);

  const provinceId = watch("provinceId");
  const districtId = watch("districtId");
  const municipalityId = watch("municipalityId");
  const wardNo = watch("wardNo");

  useEffect(() => {
    onLocationChange?.({ provinceId, districtId, municipalityId, wardNo });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId, districtId, municipalityId, wardNo]);

  const prevProvinceId = useRef(provinceId);
  useEffect(() => {
    if (prevProvinceId.current !== provinceId) {
      setValue("districtId", undefined as unknown as number);
      setValue("municipalityId", undefined as unknown as number);
      setValue("wardNo", undefined as unknown as number);
      prevProvinceId.current = provinceId;
    }
  }, [provinceId, setValue]);

  const prevDistrictId = useRef(districtId);
  useEffect(() => {
    if (prevDistrictId.current !== districtId) {
      setValue("municipalityId", undefined as unknown as number);
      setValue("wardNo", undefined as unknown as number);
      prevDistrictId.current = districtId;
    }
  }, [districtId, setValue]);

  const prevMunicipalityId = useRef(municipalityId);
  useEffect(() => {
    if (prevMunicipalityId.current !== municipalityId) {
      setValue("wardNo", undefined as unknown as number);
      prevMunicipalityId.current = municipalityId;
    }
  }, [municipalityId, setValue]);

  const districts = useMemo(() => {
    if (!tree || !provinceId) return [];
    const province = tree.provinces.find((p) => p.id === Number(provinceId));
    return province?.districts ?? [];
  }, [tree, provinceId]);

  const municipalities = useMemo((): AddressBookMunicipality[] => {
    if (!districtId) return [];
    const district = districts.find((d) => d.id === Number(districtId));
    return district?.municipalities ?? [];
  }, [districts, districtId]);

  const selectedMunicipality = municipalities.find((m) => m.id === Number(municipalityId));
  const wardOptions = selectedMunicipality ? Array.from({ length: selectedMunicipality.wardCount }, (_, i) => i + 1) : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Input label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
      <Input label="Phone" error={errors.phone?.message} {...register("phone")} />

      <Select label="Province" disabled={!tree} error={errors.provinceId?.message} {...register("provinceId", { valueAsNumber: true })}>
        <option value="">Select province</option>
        {tree?.provinces.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </Select>

      <Select
        label="District"
        disabled={!provinceId || districts.length === 0}
        error={errors.districtId?.message}
        {...register("districtId", { valueAsNumber: true })}
      >
        <option value="">Select district</option>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </Select>

      <Select
        label="City"
        disabled={!districtId || municipalities.length === 0}
        error={errors.municipalityId?.message}
        {...register("municipalityId", { valueAsNumber: true })}
      >
        <option value="">Select city</option>
        {municipalities.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </Select>

      <Select
        label="Area"
        disabled={!selectedMunicipality}
        error={errors.wardNo?.message}
        {...register("wardNo", { valueAsNumber: true })}
      >
        <option value="">Select ward</option>
        {wardOptions.map((w) => (
          <option key={w} value={w}>
            Ward {w}
          </option>
        ))}
      </Select>

      <Input label="Landmark (Optional)" error={errors.landmark?.message} {...register("landmark")} />

      <Input
        label="Local Address / Tole"
        className="sm:col-span-2"
        error={errors.line1?.message}
        {...register("line1")}
      />

      <Select label="Address Type" error={errors.addressType?.message} {...register("addressType")}>
        <option value="HOME">Home</option>
        <option value="OFFICE">Office</option>
        <option value="OTHER">Other</option>
      </Select>

      {extraFooter}

      {formError && <p className="text-sm text-red-600 sm:col-span-2">{formError}</p>}

      <div className="flex gap-3 sm:col-span-2">
        <Button type="submit" isLoading={isSaving} className="flex-1">
          {submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
