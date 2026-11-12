export const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_COLORS = Object.freeze({
  light: "#F8F8F8",
  dark: "#08192B",
});

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export const normalizeStoredTheme = (value) =>
  value === "light" || value === "dark" ? value : null;

export const resolveTheme = (override, prefersDark) =>
  normalizeStoredTheme(override) ?? (prefersDark ? "dark" : "light");

export const nextTheme = (current) => (current === "dark" ? "light" : "dark");

export function readStoredTheme(browser) {
  try {
    return normalizeStoredTheme(browser.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function persistTheme(browser, choice) {
  if (normalizeStoredTheme(choice) !== choice) return;

  try {
    browser.localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Storage can be unavailable or blocked. The controller retains the choice in this tab.
  }
}

export function syncTheme(document, override, prefersDark) {
  const manual = normalizeStoredTheme(override);

  if (manual) {
    document.documentElement.setAttribute("data-theme", manual);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", THEME_COLORS[resolveTheme(manual, prefersDark)]);
  }
}

export function getThemeBootstrapScript() {
  return `(() => {
    let stored = null;
    try { stored = window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}
    const manual = stored === "light" || stored === "dark" ? stored : null;
    if (manual) document.documentElement.setAttribute("data-theme", manual);
    else document.documentElement.removeAttribute("data-theme");
    let prefersDark = false;
    try { prefersDark = Boolean(window.matchMedia(${JSON.stringify(COLOR_SCHEME_QUERY)}).matches); } catch {}
    const theme = manual ?? (prefersDark ? "dark" : "light");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? ${JSON.stringify(THEME_COLORS.dark)} : ${JSON.stringify(THEME_COLORS.light)});
  })();`;
}

// One controller belongs to the one mounted toggle; no application-wide React state is needed.
export function createThemeController(browser, document) {
  let mediaQuery = null;
  try {
    mediaQuery = browser.matchMedia?.(COLOR_SCHEME_QUERY) ?? null;
  } catch {
    // Unsupported media query API falls back to light.
  }

  let manual = readStoredTheme(browser);
  const prefersDark = () => Boolean(mediaQuery?.matches);
  const apply = () => syncTheme(document, manual, prefersDark());

  const toggle = () => {
    manual = nextTheme(resolveTheme(manual, prefersDark()));
    persistTheme(browser, manual);
    apply();
  };

  const onPreferenceChange = () => {
    if (manual === null) apply();
  };

  const onStorageChange = (event) => {
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;

    try {
      if (event.storageArea !== browser.localStorage) return;
    } catch {
      return;
    }

    manual = event.key === null ? null : normalizeStoredTheme(event.newValue);
    apply();
  };

  return { apply, toggle, onPreferenceChange, onStorageChange, mediaQuery };
}
