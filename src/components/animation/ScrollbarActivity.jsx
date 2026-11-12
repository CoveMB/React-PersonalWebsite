"use client";

import { useEffect } from "react";
import { observeScrollActivity } from "../../utils/scrollbarActivity.mjs";

export default function ScrollbarActivity() {
  useEffect(() => observeScrollActivity(), []);

  return null;
}
