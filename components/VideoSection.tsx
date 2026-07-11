"use client";

import { useRef, useEffect, useState } from "react";
import { useAdmin } from "./AdminProvider";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useAdmin();
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleControls = () => {
    setShowControls((prev) => {
      const next = !prev;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (next) {
        hideTimerRef.current = setTimeout(() => setShowControls(false), 4000);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const videoSrc = data.defaultVideoUrl || "/fallback-video.mp4";

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-10% 0px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden bg-black group"
      onClick={toggleControls}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-colors"
          >
            {isPlaying ? (
              <Pause size={28} className="text-white" />
            ) : (
              <Play size={28} className="text-white fill-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-4 transition-colors"
          >
            {muted ? (
              <VolumeX size={28} className="text-white" />
            ) : (
              <Volume2 size={28} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
