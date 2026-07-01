"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap";
    document.head.appendChild(link);
  }, []);

  return null;
}
