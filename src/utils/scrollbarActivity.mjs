const COMET_SIZE = 5;
const READY_ATTRIBUTE = 'data-aurora-comet-ready';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// A fixed 5px comet moves across the rail's full length while the document
// retains its native scrolling, keyboard, wheel, and touch behaviour.
export function getCometGeometry({ viewportHeight, scrollHeight, scrollTop, railHeight }) {
  if (![viewportHeight, scrollHeight, scrollTop, railHeight].every(Number.isFinite) ||
      viewportHeight <= 0 || railHeight <= COMET_SIZE || scrollHeight <= viewportHeight) {
    return null;
  }

  const progress = clamp(scrollTop / (scrollHeight - viewportHeight), 0, 1);
  return { top: progress * (railHeight - COMET_SIZE), percentage: Math.round(progress * 100) };
}

export function mountAuroraCometScrollbar({
  railElement,
  scrollTarget = window,
  rootElement = document.documentElement,
  scrollingElement = document.scrollingElement || document.documentElement,
  idleDelayMs = 220,
} = {}) {
  if (!railElement) return () => {};

  let previousScrollTop = scrollingElement.scrollTop;
  let idleTimer;
  let mounted = true;

  const measurements = () => ({
    viewportHeight: rootElement.clientHeight || scrollTarget.innerHeight,
    scrollHeight: scrollingElement.scrollHeight,
    scrollTop: scrollingElement.scrollTop,
    railHeight: railElement.clientHeight,
  });

  const update = () => {
    if (!mounted) return;
    // Measure even after an earlier empty page hid the indicator.
    railElement.hidden = false;
    const geometry = getCometGeometry(measurements());
    railElement.hidden = geometry === null;
    if (!geometry) return;
    railElement.style.setProperty('--comet-y', `${geometry.top}px`);
    railElement.setAttribute('aria-valuenow', String(geometry.percentage));
  };

  const onScroll = () => {
    const scrollTop = scrollingElement.scrollTop;
    if (Math.abs(scrollTop - previousScrollTop) > 0.5) {
      railElement.dataset.direction = scrollTop > previousScrollTop ? 'down' : 'up';
      previousScrollTop = scrollTop;
    }
    railElement.classList.add('is-moving');
    scrollTarget.clearTimeout(idleTimer);
    idleTimer = scrollTarget.setTimeout(() => {
      railElement.classList.remove('is-moving');
      idleTimer = undefined;
    }, idleDelayMs);
    update();
  };

  const seek = (clientY) => {
    const rect = railElement.getBoundingClientRect();
    const progress = clamp((clientY - rect.top - COMET_SIZE / 2) / (rect.height - COMET_SIZE), 0, 1);
    const { viewportHeight, scrollHeight } = measurements();
    scrollTarget.scrollTo({ top: progress * Math.max(0, scrollHeight - viewportHeight), behavior: 'instant' });
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 || railElement.hidden) return;
    event.preventDefault();
    railElement.setPointerCapture(event.pointerId);
    seek(event.clientY);
  };
  const onPointerMove = (event) => {
    if (railElement.hasPointerCapture(event.pointerId)) seek(event.clientY);
  };
  const onKeyDown = (event) => {
    const scrollStep = 48;
    const pageStep = (rootElement.clientHeight || scrollTarget.innerHeight) * 0.8;
    const maxScroll = Math.max(0, scrollingElement.scrollHeight - (rootElement.clientHeight || scrollTarget.innerHeight));
    const changes = {
      ArrowDown: () => scrollTarget.scrollBy({ top: scrollStep, behavior: 'instant' }),
      ArrowUp: () => scrollTarget.scrollBy({ top: -scrollStep, behavior: 'instant' }),
      PageDown: () => scrollTarget.scrollBy({ top: pageStep, behavior: 'instant' }),
      PageUp: () => scrollTarget.scrollBy({ top: -pageStep, behavior: 'instant' }),
      Home: () => scrollTarget.scrollTo({ top: 0, behavior: 'instant' }),
      End: () => scrollTarget.scrollTo({ top: maxScroll, behavior: 'instant' }),
      ' ': () => scrollTarget.scrollBy({ top: event.shiftKey ? -pageStep : pageStep, behavior: 'instant' }),
    };
    if (Object.hasOwn(changes, event.key)) {
      event.preventDefault();
      changes[event.key]();
    }
  };

  scrollTarget.addEventListener('scroll', onScroll, { passive: true });
  scrollTarget.addEventListener('resize', update);
  railElement.addEventListener('pointerdown', onPointerDown);
  railElement.addEventListener('pointermove', onPointerMove);
  railElement.addEventListener('keydown', onKeyDown);

  const resizeObserver = scrollTarget.ResizeObserver
    ? new scrollTarget.ResizeObserver(update)
    : null;
  resizeObserver?.observe(scrollingElement);
  rootElement.setAttribute(READY_ATTRIBUTE, '');
  update();

  return () => {
    if (!mounted) return;
    mounted = false;
    scrollTarget.removeEventListener('scroll', onScroll);
    scrollTarget.removeEventListener('resize', update);
    railElement.removeEventListener('pointerdown', onPointerDown);
    railElement.removeEventListener('pointermove', onPointerMove);
    railElement.removeEventListener('keydown', onKeyDown);
    scrollTarget.clearTimeout(idleTimer);
    resizeObserver?.disconnect();
    railElement.classList.remove('is-moving');
    rootElement.removeAttribute(READY_ATTRIBUTE);
  };
}
