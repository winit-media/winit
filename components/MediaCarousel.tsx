"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { getMaxConcurrentVideos } from "@/hooks/useDeviceCapabilities";

const getOptimizedMedia = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return { videoUrl: url, posterUrl: "" };
  const [baseUrl, path] = url.split('/upload/');
  return {
    videoUrl: `${baseUrl}/upload/f_auto,q_auto:good,c_limit,w_400,so_0,eo_3/${path}`,
    posterUrl: `${baseUrl}/upload/q_auto:good,c_limit,w_400,so_0/${path}`.replace(/\.[^/.]+$/, ".jpg")
  };
};

const getHighQualityMedia = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return { videoUrl: url, posterUrl: undefined as string | undefined };
  const [baseUrl, path] = url.split('/upload/');
  const posterUrl = `${baseUrl}/upload/q_auto:good,w_800,so_0,eo_3/${path}`.replace(/\.[^/.]+$/, ".jpg");
  return {
    videoUrl: `${baseUrl}/upload/f_auto,q_auto:good/${path}`,
    posterUrl,
  };
};

const defaultVideos = [
  { id: "1", name: "Campaign 1", url: "/fallback-video.mp4" },
  { id: "2", name: "Campaign 2", url: "/fallback-video.mp4" },
  { id: "3", name: "Campaign 3", url: "/fallback-video.mp4" },
  { id: "4", name: "Campaign 4", url: "/fallback-video.mp4" },
  { id: "5", name: "Campaign 5", url: "/fallback-video.mp4" },
  { id: "6", name: "Campaign 6", url: "/fallback-video.mp4" },
  { id: "7", name: "Campaign 7", url: "/fallback-video.mp4" },
  { id: "8", name: "Campaign 8", url: "/fallback-video.mp4" },
];

interface VideoCardProps {
  video: { id: string; url: string; name: string };
  cardKey: string;
  onExpand: (video: { id: string; url: string; name: string }) => void;
  shouldPlay: boolean;
}

function VideoCard({ video, cardKey, onExpand, shouldPlay }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { videoUrl, posterUrl } = getOptimizedMedia(video.url);
  const isMobile = useRef(typeof navigator !== "undefined" && (navigator.maxTouchPoints > 0 || /Mobi|Android/i.test(navigator.userAgent)));
  const previewDuration = 3;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (shouldPlay && !isHovered) {
      if (isMobile.current) {
        v.currentTime = 0;
        v.loop = false;
        const onTimeUpdate = () => {
          if (v.currentTime >= previewDuration) {
            v.currentTime = 0;
          }
        };
        v.addEventListener("timeupdate", onTimeUpdate);
        v.play().catch(() => {});
        return () => v.removeEventListener("timeupdate", onTimeUpdate);
      } else {
        v.loop = true;
        v.play().catch(() => {});
      }
    } else {
      v.pause();
    }
  }, [shouldPlay, isHovered]);

  useEffect(() => {
    const handleVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) {
        v.pause();
      } else if (shouldPlay && !isHovered) {
        v.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [shouldPlay, isHovered]);

  const handleClick = () => {
    onExpand(video);
  };

  return (
    <div
      data-card-id={cardKey}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex-shrink-0 ${isLandscape ? "aspect-video" : "aspect-[9/16]"} h-full bg-black rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.02] border-2 border-white`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl || undefined}
        className="w-full h-full object-cover bg-black pointer-events-none"
        playsInline webkit-playsinline="true"
        muted
        preload="metadata"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setIsLandscape(v.videoWidth > v.videoHeight);
        }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`} />
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <div className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-full p-4 transition-colors duration-300">
          <Play size={24} className="text-white fill-white" />
        </div>
      </div>
      <div className={`absolute bottom-3 left-3 right-3 transition-opacity transition-transform duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
        <span className="text-white text-sm font-medium truncate drop-shadow-md">{video.name}</span>
      </div>
    </div>
  );
}

interface ExpandedVideoModalProps {
  video: { id: string; url: string; name: string };
  onClose: () => void;
}

function ExpandedVideoModal({ video, onClose }: ExpandedVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspect, setAspect] = useState<string>("16/9");
  const { videoUrl, posterUrl } = getHighQualityMedia(video.url);
  const containerRef = useFocusTrap(true);
  useScrollLock(true);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.muted = false;
      v.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
    } else {
      v.play();
    }
  };

  const toggleAudio = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      setMuted(!muted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <motion.div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Play ${video.name}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative mx-4"
        style={{ maxWidth: "90vw", maxHeight: "90vh", aspectRatio: aspect }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full flex items-center justify-center bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            className="w-full h-full object-contain"
            playsInline webkit-playsinline="true"
            muted={muted}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              setAspect(`${v.videoWidth}/${v.videoHeight}`);
            }}
          />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          >
            {isPlaying ? (
              <Pause size={20} className="text-white" />
            ) : (
              <Play size={20} className="text-white fill-white" />
            )}
          </button>
          <button
            onClick={toggleAudio}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          >
            {muted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
          </button>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <span className="text-white/80 text-sm font-medium">{video.name}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default memo(function MediaCarousel() {
  const { data } = useAdmin();
  const videos = data.carouselVideos.length > 0 ? data.carouselVideos : defaultVideos;
  const [expandedVideo, setExpandedVideo] = useState<{ id: string; url: string; name: string } | null>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLElement>(null);

  const row1Videos = videos.slice(0, Math.ceil(videos.length / 2));
  const row2Videos = videos.slice(Math.ceil(videos.length / 2));

  useEffect(() => {
    if (getMaxConcurrentVideos() === 0) {
      queueMicrotask(() => setActiveIds(new Set()));
      return;
    }

    const visibleIds = new Set<string>();

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.cardId;
          if (!id) return;
          if (entry.isIntersecting) {
            visibleIds.add(id);
          } else {
            visibleIds.delete(id);
          }
        });

        setActiveIds((prev) => {
          if (prev.size === visibleIds.size && [...prev].every((id) => visibleIds.has(id))) return prev;
          return new Set(visibleIds);
        });
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    containerRef.current?.querySelectorAll<HTMLElement>("[data-card-id]").forEach((card) => {
      cardObserver.observe(card);
    });

    return () => cardObserver.disconnect();
  }, [videos]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setMarqueePaused(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleExpand = useCallback((video: { id: string; url: string; name: string }) => {
    setExpandedVideo(video);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedVideo(null);
  }, []);

  return (
    <section ref={containerRef} id="work" data-theme="dark" className={`relative bg-brand h-svh pt-14 overflow-clip flex flex-col ios-gpu-stable section-lazy pattern-bg ${marqueePaused ? "animate-marquee-paused" : ""}`}>
      <div className="relative z-10 flex flex-col h-full min-h-0 overflow-hidden justify-center">
        <div className="flex-shrink-0 flex items-end justify-center pt-4 pb-4 px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-white text-center">{data.carouselTitle}</h2>
        </div>

        <div 
          className="flex-1 w-full flex flex-col gap-3 sm:gap-4 min-h-0 pb-4 sm:pb-4"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
        >
          <div className="flex-1 min-h-0 overflow-hidden rounded-xl">
            <div className="flex h-full w-max gap-3 media-marquee media-marquee-left">
              <div className="flex items-center gap-3 shrink-0">
                {row1Videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-a-${index}`}
                    cardKey={`${video.id}-a-${index}`}
                    video={video}
                    onExpand={handleExpand}
                    shouldPlay={activeIds.has(`${video.id}-a-${index}`)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {row1Videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-b-${index}`}
                    cardKey={`${video.id}-b-${index}`}
                    video={video}
                    onExpand={handleExpand}
                    shouldPlay={activeIds.has(`${video.id}-b-${index}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden rounded-xl">
            <div className="flex h-full w-max gap-3 media-marquee media-marquee-right">
              <div className="flex items-center gap-3 shrink-0">
                {row2Videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-a-${index}`}
                    cardKey={`${video.id}-a-${index}`}
                    video={video}
                    onExpand={handleExpand}
                    shouldPlay={activeIds.has(`${video.id}-a-${index}`)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {row2Videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-b-${index}`}
                    cardKey={`${video.id}-b-${index}`}
                    video={video}
                    onExpand={handleExpand}
                    shouldPlay={activeIds.has(`${video.id}-b-${index}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {expandedVideo && <ExpandedVideoModal video={expandedVideo} onClose={handleClose} />}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
});
