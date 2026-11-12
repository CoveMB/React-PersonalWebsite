import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {
  THEME_COLORS,
  THEME_STORAGE_KEY,
  createThemeController,
  getThemeBootstrapScript,
  nextTheme,
  normalizeStoredTheme,
  persistTheme,
  readStoredTheme,
  resolveTheme,
  syncTheme,
} from "../src/utils/theme.mjs";

function createDocument() {
  const attributes = new Map();
  const meta = { content: null, setAttribute(name, value) { if (name === "content") this.content = value; } };
  return {
    attributes,
    meta,
    documentElement: {
      setAttribute(name, value) { attributes.set(name, value); },
      removeAttribute(name) { attributes.delete(name); },
    },
    querySelector(selector) {
      assert.equal(selector, 'meta[name="theme-color"]');
      return meta;
    },
  };
}

function createBrowser({ stored = null, dark = false, throwOnGet = false, throwOnSet = false } = {}) {
  const values = new Map();
  if (stored !== null) values.set(THEME_STORAGE_KEY, stored);
  const localStorage = {
    getItem(key) { if (throwOnGet) throw new Error("blocked read"); return values.get(key) ?? null; },
    setItem(key, value) { if (throwOnSet) throw new Error("blocked write"); values.set(key, value); },
  };
  const mediaQuery = { matches: dark };
  return {
    localStorage,
    mediaQuery,
    values,
    matchMedia(query) { assert.equal(query, "(prefers-color-scheme: dark)"); return mediaQuery; },
  };
}

function runBootstrap({ browser, document } = {}) {
  const actualDocument = document ?? createDocument();
  const actualBrowser = browser ?? createBrowser();
  vm.runInNewContext(getThemeBootstrapScript(), {
    window: actualBrowser,
    document: actualDocument,
  }, { timeout: 1000 });
  return actualDocument;
}

test("normalizes only valid manual choices", () => {
  for (const choice of ["dark", "light"]) assert.equal(normalizeStoredTheme(choice), choice);
  for (const choice of [null, undefined, "system", "LIGHT", "junk", ""]) {
    assert.equal(normalizeStoredTheme(choice), null);
  }
});

test("resolves OS preferences unless a valid explicit choice wins", () => {
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("nonsense", true), "dark");
  assert.equal(nextTheme("light"), "dark");
  assert.equal(nextTheme("dark"), "light");
});

test("storage reads and writes are guarded", () => {
  assert.equal(readStoredTheme(createBrowser({ stored: "dark" })), "dark");
  assert.equal(readStoredTheme(createBrowser({ stored: "invalid" })), null);
  assert.equal(readStoredTheme(createBrowser({ throwOnGet: true })), null);
  assert.doesNotThrow(() => persistTheme(createBrowser({ throwOnSet: true }), "light"));
});

test("syncTheme keeps the root attribute reserved for manual choices", () => {
  const document = createDocument();
  syncTheme(document, null, true);
  assert.equal(document.attributes.has("data-theme"), false);
  assert.equal(document.meta.content, THEME_COLORS.dark);
  syncTheme(document, "light", true);
  assert.equal(document.attributes.get("data-theme"), "light");
  assert.equal(document.meta.content, THEME_COLORS.light);
  syncTheme(document, null, false);
  assert.equal(document.attributes.has("data-theme"), false);
});

test("bootstrap uses OS preference without an override, including invalid/blocked storage", () => {
  for (const dark of [false, true]) {
    for (const stored of [null, "garbage", "system"]) {
      const document = runBootstrap({ browser: createBrowser({ stored, dark }) });
      assert.equal(document.attributes.has("data-theme"), false);
      assert.equal(document.meta.content, THEME_COLORS[dark ? "dark" : "light"]);
    }
  }
  const denied = runBootstrap({ browser: createBrowser({ dark: true, throwOnGet: true }) });
  assert.equal(denied.meta.content, THEME_COLORS.dark);
  assert.equal(denied.attributes.has("data-theme"), false);
});

test("bootstrap saved theme beats the opposite OS mode", () => {
  for (const [stored, dark] of [["dark", false], ["light", true]]) {
    const document = runBootstrap({ browser: createBrowser({ stored, dark }) });
    assert.equal(document.attributes.get("data-theme"), stored);
    assert.equal(document.meta.content, THEME_COLORS[stored]);
  }
});

test("bootstrap tolerates missing matchMedia", () => {
  const document = runBootstrap({ browser: { localStorage: { getItem: () => null } } });
  assert.equal(document.meta.content, THEME_COLORS.light);
  assert.equal(document.attributes.has("data-theme"), false);
});

test("controller toggles effective theme and holds manual overrides against OS changes", () => {
  const browser = createBrowser({ dark: true });
  const document = createDocument();
  const theme = createThemeController(browser, document);
  theme.apply();
  assert.equal(document.meta.content, THEME_COLORS.dark);
  theme.toggle();
  assert.equal(browser.values.get(THEME_STORAGE_KEY), "light");
  assert.equal(document.attributes.get("data-theme"), "light");
  browser.mediaQuery.matches = false;
  theme.onPreferenceChange();
  assert.equal(document.meta.content, THEME_COLORS.light);
  theme.toggle();
  assert.equal(browser.values.get(THEME_STORAGE_KEY), "dark");
  assert.equal(document.attributes.get("data-theme"), "dark");
});

test("automatic controller follows OS changes and cross-tab removals", () => {
  const browser = createBrowser({ dark: false, stored: "dark" });
  const document = createDocument();
  const theme = createThemeController(browser, document);
  theme.apply();
  assert.equal(document.meta.content, THEME_COLORS.dark);
  theme.onStorageChange({ key: THEME_STORAGE_KEY, newValue: null, storageArea: browser.localStorage });
  assert.equal(document.attributes.has("data-theme"), false);
  assert.equal(document.meta.content, THEME_COLORS.light);
  browser.mediaQuery.matches = true;
  theme.onPreferenceChange();
  assert.equal(document.meta.content, THEME_COLORS.dark);
  theme.onStorageChange({ key: THEME_STORAGE_KEY, newValue: "light", storageArea: browser.localStorage });
  assert.equal(document.attributes.get("data-theme"), "light");
  browser.mediaQuery.matches = false;
  theme.onPreferenceChange();
  assert.equal(document.meta.content, THEME_COLORS.light);
  theme.onStorageChange({ key: null, newValue: null, storageArea: browser.localStorage });
  assert.equal(document.attributes.has("data-theme"), false);
});

test("controller ignores unrelated storage areas and keys", () => {
  const browser = createBrowser({ dark: false });
  const document = createDocument();
  const theme = createThemeController(browser, document);
  theme.apply();
  theme.onStorageChange({ key: null, storageArea: {} });
  theme.onStorageChange({ key: "another-key", newValue: "dark", storageArea: browser.localStorage });
  assert.equal(document.attributes.has("data-theme"), false);
  assert.equal(document.meta.content, THEME_COLORS.light);
});

test("blocked persistence holds current-tab manual choice until reload", () => {
  const browser = createBrowser({ dark: false, throwOnSet: true });
  const document = createDocument();
  const theme = createThemeController(browser, document);
  theme.apply();
  theme.toggle();
  assert.equal(browser.values.has(THEME_STORAGE_KEY), false);
  assert.equal(document.attributes.get("data-theme"), "dark");
  browser.mediaQuery.matches = true;
  theme.onPreferenceChange();
  assert.equal(document.meta.content, THEME_COLORS.dark);
  browser.mediaQuery.matches = false;
  theme.onPreferenceChange();
  assert.equal(document.attributes.get("data-theme"), "dark");
});
