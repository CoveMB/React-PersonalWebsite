"use client";

import { useEffect, useRef } from "react";
import { createThemeController } from "../../utils/theme.mjs";

export default function ThemeToggle() {
  const controllerRef = useRef(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    const controller = createThemeController(window, document);
    controllerRef.current = controller;
    controller.apply();

    controller.mediaQuery?.addEventListener?.("change", controller.onPreferenceChange);
    window.addEventListener("storage", controller.onStorageChange);
    anchorRef.current?.setAttribute("data-ready", "true");

    return () => {
      controller.mediaQuery?.removeEventListener?.("change", controller.onPreferenceChange);
      window.removeEventListener("storage", controller.onStorageChange);
      anchorRef.current?.removeAttribute("data-ready");
      controllerRef.current = null;
    };
  }, []);

  return (
    <div className="themeToggleAnchor" ref={anchorRef}>
      <button
        className="themeToggleButton"
        type="button"
        onClick={() => controllerRef.current?.toggle()}
      >
        <span aria-hidden="true" className="themeToggleTrack">
          <span className="themeToggleThumb" />
          <svg className="themeToggleIcon themeToggleSun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
          </svg>
          <svg className="themeToggleIcon themeToggleMoon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.985 12.486A9 9 0 0 1 11.514 3.015a9 9 0 1 0 9.471 9.471Z" />
          </svg>
        </span>
        <span className="themeToggleLabel themeToggleNextDark">Switch to dark mode</span>
        <span className="themeToggleLabel themeToggleNextLight">Switch to light mode</span>
      </button>
    </div>
  );
}
