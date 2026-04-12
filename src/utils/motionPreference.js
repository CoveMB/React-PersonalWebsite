const supportsMatchMedia = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

export const prefersReducedMotion = () =>
  supportsMatchMedia() &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const getPreferredScrollBehavior = () =>
  prefersReducedMotion() ? "auto" : "smooth";
