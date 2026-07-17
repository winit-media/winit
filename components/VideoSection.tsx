"use client";

import { useRef, useEffect, useState, memo } from "react";
import { useAdmin } from "./AdminProvider";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useDeviceCapabilities } from "@/hooks/useDeviceCapabilities";

export default memo(function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useAdmin();
  const [inView, setInView] = useState(false);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canPlayMedia = useDeviceCapabilities();

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

  const rawSrc = data.defaultVideoUrl || "/fallback-video.mp4";
  const isCloudinary = rawSrc.includes("cloudinary.com");
  const videoSrc = isCloudinary
    ? rawSrc.replace("/upload/", "/upload/f_auto,q_auto,w_1280,so_0/")
    : rawSrc;
  const posterSrc = isCloudinary
    ? rawSrc.replace("/upload/", "/upload/q_auto:eco,w_1280,so_0,eo_3/").replace(/\.[^/.]+$/, ".jpg")
    : undefined;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

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

    if (inView && (canPlayMedia || manualPlay)) {
      video.play().then(() => {
        setAutoplayBlocked(false);
      }).catch(() => {
        setAutoplayBlocked(true);
        setIsPlaying(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [inView, canPlayMedia, manualPlay]);

  // Pause when tab is hidden (iOS backgrounding)
  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else if (inView && (canPlayMedia || manualPlay)) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [inView, canPlayMedia, manualPlay]);

  const togglePlay = async () => {
    if (!canPlayMedia && !manualPlay) {
      setManualPlay(true);
      return;
    }
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      try {
        await v.play();
      } catch {
        setAutoplayBlocked(true);
      }
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <section
      ref={containerRef}
      data-theme="dark"
      className="relative w-full aspect-video overflow-hidden bg-black group ios-gpu-stable section-lazy"
      onClick={toggleControls}
    >
      {(canPlayMedia || manualPlay) ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          className="w-full h-full object-cover pointer-events-none"
          muted={muted}
          loop
          playsInline webkit-playsinline="true"
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <img
          src={posterSrc || rawSrc}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="bg-white/30 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-colors"
          >
            {isPlaying ? (
              <Pause size={28} className="text-white" />
            ) : (
              <Play size={28} className="text-white fill-white" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="bg-white/30 hover:bg-white/40 backdrop-blur-sm rounded-full p-4 transition-colors"
          >
            {muted ? (
              <VolumeX size={28} className="text-white" />
            ) : (
              <Volume2 size={28} className="text-white" />
            )}
          </button>
        </div>
      </div>
      {(autoplayBlocked || !canPlayMedia) && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="bg-white/90 hover:bg-white rounded-full p-6 shadow-2xl transition-transform hover:scale-110"
          >
            <Play size={40} className="text-brand fill-brand" />
          </button>
        </div>
      )}
    </section>
  );
});
