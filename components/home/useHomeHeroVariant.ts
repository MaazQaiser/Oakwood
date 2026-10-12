"use client";

import { useCallback, useEffect, useState } from "react";
import {
  HOME_HERO_VARIANT_PARAM,
  HOME_HERO_VARIANT_STORAGE,
  isHomeHeroVariant,
  type HomeHeroVariant,
} from "@/lib/home/hero-variant";

function readVariant(): HomeHeroVariant {
  if (typeof window === "undefined") {
    return "current";
  }

  const fromUrl = new URLSearchParams(window.location.search).get(
    HOME_HERO_VARIANT_PARAM,
  );
  if (isHomeHeroVariant(fromUrl)) {
    return fromUrl;
  }

  const fromStore = window.sessionStorage.getItem(HOME_HERO_VARIANT_STORAGE);
  return isHomeHeroVariant(fromStore) ? fromStore : "current";
}

export function useHomeHeroVariant() {
  const [variant, setVariant] = useState<HomeHeroVariant>("current");

  useEffect(() => {
    setVariant(readVariant());
  }, []);

  const changeVariant = useCallback((next: HomeHeroVariant) => {
    setVariant(next);
    window.sessionStorage.setItem(HOME_HERO_VARIANT_STORAGE, next);
    const url = new URL(window.location.href);
    url.searchParams.set(HOME_HERO_VARIANT_PARAM, next);
    window.history.replaceState({}, "", url);
  }, []);

  return { variant, changeVariant };
}
