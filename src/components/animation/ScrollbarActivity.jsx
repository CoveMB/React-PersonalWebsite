"use client";

import { useEffect, useRef } from "react";
import { observeScrollActivity } from "../../utils/scrollbarActivity.mjs";

export default function ScrollbarActivity() {
  const glowReference = useRef(null);

  useEffect(() => observeScrollActivity({ glowElement: glowReference.current }), []);

  return <div aria-hidden="true" className="auroraScrollbarGlow" ref={glowReference} hidden />;
}
