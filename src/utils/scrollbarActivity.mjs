const ACTIVE_ATTRIBUTE = "data-aurora-scroll-active";

export function observeScrollActivity({
  scrollTarget = window,
  rootElement = document.documentElement,
  idleDelayMs = 220,
} = {}) {
  let idleTimerId;
  let attached = true;

  const onScroll = () => {
    rootElement.setAttribute(ACTIVE_ATTRIBUTE, "");
    scrollTarget.clearTimeout(idleTimerId);
    idleTimerId = scrollTarget.setTimeout(() => {
      rootElement.removeAttribute(ACTIVE_ATTRIBUTE);
      idleTimerId = undefined;
    }, idleDelayMs);
  };

  scrollTarget.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    if (!attached) return;
    attached = false;
    scrollTarget.removeEventListener("scroll", onScroll);
    scrollTarget.clearTimeout(idleTimerId);
    rootElement.removeAttribute(ACTIVE_ATTRIBUTE);
  };
}
