const ACTIVE_ATTRIBUTE = "data-aurora-scroll-active";
const HOVER_ATTRIBUTE = "data-aurora-scroll-hover";

// Native scrollbar thumbs shrink as document height grows. Match their
// approximate geometry without replacing, intercepting, or hiding them.
export function getAuroraGlowGeometry({ viewportHeight, scrollHeight, scrollTop }) {
  if (!Number.isFinite(viewportHeight) || !Number.isFinite(scrollHeight) ||
      viewportHeight <= 0 || scrollHeight <= viewportHeight) {
    return null;
  }

  const height = Math.min(viewportHeight, Math.max(28, viewportHeight ** 2 / scrollHeight));
  const travel = viewportHeight - height;
  const progress = Math.max(0, Math.min(1, scrollTop / (scrollHeight - viewportHeight)));

  return { height, top: travel * progress };
}

export function observeScrollActivity({
  scrollTarget = window,
  rootElement = document.documentElement,
  glowElement = null,
  idleDelayMs = 220,
} = {}) {
  let idleTimerId;
  let attached = true;

  const updateGlowGeometry = () => {
    if (!glowElement) return;
    const metrics = getAuroraGlowGeometry({
      viewportHeight: rootElement.clientHeight || scrollTarget.innerHeight,
      scrollHeight: rootElement.scrollHeight,
      scrollTop: scrollTarget.scrollY,
    });
    glowElement.hidden = metrics === null;
    if (metrics) {
      glowElement.style.setProperty("--aurora-glow-height", `${metrics.height}px`);
      glowElement.style.setProperty("--aurora-glow-top", `${metrics.top}px`);
    }
  };

  const onScroll = () => {
    rootElement.setAttribute(ACTIVE_ATTRIBUTE, "");
    scrollTarget.clearTimeout(idleTimerId);
    idleTimerId = scrollTarget.setTimeout(() => {
      rootElement.removeAttribute(ACTIVE_ATTRIBUTE);
      idleTimerId = undefined;
    }, idleDelayMs);
    updateGlowGeometry();
  };

  const onPointerMove = ({ clientX }) => {
    if (clientX >= scrollTarget.innerWidth - 16) {
      rootElement.setAttribute(HOVER_ATTRIBUTE, "");
    } else {
      rootElement.removeAttribute(HOVER_ATTRIBUTE);
    }
  };
  const onPointerLeave = () => rootElement.removeAttribute(HOVER_ATTRIBUTE);

  scrollTarget.addEventListener("scroll", onScroll, { passive: true });
  if (glowElement) {
    scrollTarget.addEventListener("resize", updateGlowGeometry);
    scrollTarget.addEventListener("pointermove", onPointerMove, { passive: true });
    scrollTarget.addEventListener("pointerleave", onPointerLeave);
    updateGlowGeometry();
  }

  const resizeObserver = glowElement && scrollTarget.ResizeObserver
    ? new scrollTarget.ResizeObserver(updateGlowGeometry)
    : null;
  resizeObserver?.observe(rootElement);

  return () => {
    if (!attached) return;
    attached = false;
    scrollTarget.removeEventListener("scroll", onScroll);
    scrollTarget.clearTimeout(idleTimerId);
    rootElement.removeAttribute(ACTIVE_ATTRIBUTE);
    if (glowElement) {
      scrollTarget.removeEventListener("resize", updateGlowGeometry);
      scrollTarget.removeEventListener("pointermove", onPointerMove);
      scrollTarget.removeEventListener("pointerleave", onPointerLeave);
      rootElement.removeAttribute(HOVER_ATTRIBUTE);
      resizeObserver?.disconnect();
    }
  };
}
