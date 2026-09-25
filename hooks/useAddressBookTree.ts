"use client";

import { useEffect, useState } from "react";

export interface AddressBookMunicipality {
  id: number;
  name: string;
  type: string | null;
  wardCount: number;
}

export interface AddressBookDistrict {
  id: number;
  name: string;
  municipalities: AddressBookMunicipality[];
}

export interface AddressBookProvince {
  id: number;
  name: string;
  districts: AddressBookDistrict[];
}

export interface AddressBookTree {
  provinces: AddressBookProvince[];
}

const EMPTY_TREE: AddressBookTree = { provinces: [] };

/** Fetches the full Province -> District -> Municipality tree once per mount. Cached for a day server-side, so this is cheap to call from multiple components. */
export function useAddressBookTree() {
  const [tree, setTree] = useState<AddressBookTree | null>(null);

  useEffect(() => {
    fetch("/api/address-book")
      .then((res) => res.json())
      .then((json) => setTree(json?.data ?? EMPTY_TREE))
      .catch(() => setTree(EMPTY_TREE));
  }, []);

  return tree;
}
