'use client';

import { useEffect, useRef } from 'react';
import { mountAuroraCometScrollbar } from '../../utils/scrollbarActivity.mjs';

export default function ScrollbarActivity() {
  const railRef = useRef(null);

  useEffect(() => mountAuroraCometScrollbar({ railElement: railRef.current }), []);

  return (
    <div
      aria-label="Page scroll position"
      aria-controls="portfolio-scroll-viewport"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="auroraCometRail"
      data-direction="down"
      ref={railRef}
      role="scrollbar"
      tabIndex={0}
      hidden
    >
      <span className="auroraCometHead" aria-hidden="true" />
    </div>
  );
}
