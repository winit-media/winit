"use client";

import { useRef, useEffect, useState } from "react";
import { useAdmin } from "./AdminProvider";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useAdmin();
  const [inView, setInView] = useState(false);

  const videoSrc = data.defaultVideoUrl || "/fallback-video.mp4";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView]);

  return (
    <div ref={containerRef} className="relative h-screen w-full snap-section overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        controls
      />
    </div>
  );
}
