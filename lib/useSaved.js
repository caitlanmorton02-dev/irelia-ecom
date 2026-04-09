"use client";

/**
 * lib/useSaved.js — Shared React hook for the Auralis save system
 *
 * Provides a single source of truth for saved state across all pages.
 * Syncs automatically when the user returns to the tab (visibilitychange).
 *
 * Usage:
 *   const { savedProducts, savedIds, toggle } = useSaved();
 *
 *   toggle(product)  →  returns added: boolean (true = saved, false = removed)
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { getSavedProducts, toggleSavedProduct } from "./saveProduct";

export function useSaved() {
  const [savedProducts, setSavedProducts] = useState([]);

  // Load on mount + re-load on tab focus (cross-tab sync)
  useEffect(() => {
    setSavedProducts(getSavedProducts());

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        setSavedProducts(getSavedProducts());
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const toggle = useCallback((product) => {
    const { products, added } = toggleSavedProduct(product);
    setSavedProducts(products);
    return added;
  }, []);

  const savedIds = useMemo(() => savedProducts.map((p) => p.id), [savedProducts]);

  return { savedProducts, savedIds, toggle };
}
