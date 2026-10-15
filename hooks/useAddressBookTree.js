"use client";
import { useEffect, useState } from "react";
const EMPTY_TREE = { provinces: [] };
/** Fetches the full Province -> District -> Municipality tree once per mount. Cached for a day server-side, so this is cheap to call from multiple components. */
export function useAddressBookTree() {
    const [tree, setTree] = useState(null);
    useEffect(() => {
        fetch("/api/address-book")
            .then((res) => res.json())
            .then((json) => setTree(json?.data ?? EMPTY_TREE))
            .catch(() => setTree(EMPTY_TREE));
    }, []);
    return tree;
}
