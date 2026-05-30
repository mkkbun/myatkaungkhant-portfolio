import { useCallback, useEffect, useState } from "react";

export type ColorMode = "dark" | "light";

const STORAGE_KEY = "portfolio-theme";

function getInitialTheme(): ColorMode {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(mode: ColorMode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem(STORAGE_KEY, mode);
}

export function useTheme() {
  const [colorMode, setColorModeState] = useState<ColorMode>(getInitialTheme);

  useEffect(() => {
    applyTheme(colorMode);
  }, [colorMode]);

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode);
    applyTheme(mode);
  }, []);

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  return { colorMode, setColorMode, toggleColorMode, isDark: colorMode === "dark" };
}
