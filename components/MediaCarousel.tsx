"use client";

import { useEffect, useRef, useState, useCallback, memo, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useDeviceCapabilities, getMaxConcurrentVideos } from "@/hooks/useDeviceCapabilities";

const getOptimizedMedia = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return { videoUrl: url, posterUrl: "" };
  const [baseUrl, path] = url.split('/upload/');
  return {
    videoUrl: `${baseUrl}/upload/f_auto,q_auto:eco,c_limit,w_400,so_0,eo_5/${path}`,
    posterUrl: `${baseUrl}/upload/q_auto:eco,c_limit,w_400,so_0/${path}`.replace(/\.[^/.]+$/, ".jpg")
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

const ActiveVideoContext = createContext<{ activeIds: Set<string> }>({ activeIds: new Set() });

interface VideoCardProps {
  video: { id: string; url: string; name: string };
  cardKey: string;
  onExpand: (video: { id: string; url: string; name: string }) => void;
  isPaused: boolean;
  canPlayMedia: boolean;
}

function VideoCard({ video, cardKey, onExpand, isPaused, canPlayMedia }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [tapRevealed, setTapRevealed] = useState(false);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { videoUrl, posterUrl } = getOptimizedMedia(video.url);
  const { activeIds } = useContext(ActiveVideoContext);

  const isActive = activeIds.has(cardKey);
  const shouldMountVideo = canPlayMedia && (inView || isHovered) && isActive;

  const handleTapReveal = () => {
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    setTapRevealed((prev) => {
      const next = !prev;
      if (next) {
        tapTimerRef.current = setTimeout(() => setTapRevealed(false), 4000);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canPlayMedia) return;

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setInView(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canPlayMedia]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !canPlayMedia) return;

    if (!isPaused && inView && isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, isPaused, isActive, canPlayMedia]);

  useEffect(() => {
    if (!canPlayMedia) return;
    const handleVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) {
        v.pause();
      } else if (inView && !isPaused && isActive) {
        v.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [inView, isPaused, isActive, canPlayMedia]);

  const handleClick = () => {
    onExpand(video);
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canPlayMedia) return;
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      setMuted(!muted);
    }
  };

  return (
    <div
      ref={containerRef}
      data-card-id={cardKey}
      onClick={(e) => {
        e.stopPropagation();
        handleTapReveal();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex-shrink-0 ${isLandscape ? "aspect-video" : "aspect-[9/16]"} h-full bg-black rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.02] border-2 border-white`}
    >
      {shouldMountVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl || undefined}
          className="w-full h-full object-cover bg-black pointer-events-none"
          loop
          playsInline webkit-playsinline="true"
          muted={muted}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setIsLandscape(v.videoWidth > v.videoHeight);
          }}
        />
      ) : posterUrl ? (
        <img
          src={posterUrl}
          alt={video.name}
          className="w-full h-full object-cover bg-black"
          loading="lazy"
          decoding="async"
          onLoad={(e) => {
            const img = e.currentTarget;
            setIsLandscape(img.naturalWidth > img.naturalHeight);
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center">
          <span className="text-white/40 text-xs font-medium px-2 text-center text-center">{video.name}</span>
        </div>
      )}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 ${tapRevealed ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
      <div className={`absolute bottom-3 left-3 right-3 flex items-center justify-between transition-opacity transition-transform duration-500 translate-y-2 group-hover:translate-y-0 ${tapRevealed ? "opacity-100 translate-y-0" : "opacity-0"}`}>
        <span className="text-white text-sm font-medium truncate drop-shadow-md">{video.name}</span>
        {canPlayMedia && (
          <button
            onClick={toggleAudio}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full p-2 transition-colors duration-300"
          >
            {muted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
          </button>
        )}
      </div>
      <div className={`absolute top-3 right-3 transition-opacity transition-transform duration-500 -translate-y-2 group-hover:translate-y-0 ${tapRevealed ? "opacity-100 translate-y-0" : "opacity-0"}`}>
        <div
          className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full p-2 transition-colors duration-300"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <Play size={14} className="text-white fill-white" />
        </div>
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
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aspect, setAspect] = useState<string>("16/9");
  const { videoUrl, posterUrl } = getHighQualityMedia(video.url);
  const containerRef = useFocusTrap(true);
  useScrollLock(true);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
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
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
          >
            {muted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
          </button>
          <button
            onClick={onClose}
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
  const [isPaused, setIsPaused] = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const canPlayMedia = useDeviceCapabilities();
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLElement>(null);
  const maxConcurrent = getMaxConcurrentVideos();

  const row1Videos = videos.slice(0, Math.ceil(videos.length / 2));
  const row2Videos = videos.slice(Math.ceil(videos.length / 2));

  // Pick the N cards closest to the horizontal viewport center to play.
  // All others show poster images only — zero video decoding cost.
  //
  // Uses IntersectionObserver (zero layout cost) to maintain a Set of
  // visible card IDs and a cached Map of DOM references, then a throttled
  // scroll event listener to recompute which visible cards are closest to
  // the viewport center. Only visible cards are measured with
  // getBoundingClientRect, keeping layout thrashing proportional to the
  // number of on-screen cards (not total cards).
  //
  // Event-driven: scroll listener starts/stops with section visibility and
  // auto-stops after 300ms idle — no continuous RAF loop.
  useEffect(() => {
    if (!canPlayMedia || maxConcurrent === 0) {
      queueMicrotask(() => setActiveIds(new Set()));
      return;
    }

    const visibleIds = new Set<string>();
    const cardElements = new Map<string, HTMLElement>();
    let inSectionView = false;
    let scrollThrottleId: ReturnType<typeof setTimeout> | null = null;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let tracking = false;
    const SCROLL_THROTTLE_MS = 250;
    const IDLE_TIMEOUT_MS = 300;
    const scrollOptions: AddEventListenerOptions = { passive: true };

    const updateActive = () => {
      const section = containerRef.current;
      if (!section || visibleIds.size === 0) {
        setActiveIds((prev) => (prev.size === 0 ? prev : new Set()));
        return;
      }

      const viewportCenterX = window.innerWidth / 2;
      const candidates: { id: string; distance: number }[] = [];

      visibleIds.forEach((id) => {
        const card = cardElements.get(id);
        if (!card) return;
        const rect = card.getBoundingClientRect();
        if (rect.right > 0 && rect.left < window.innerWidth) {
          const cardCenterX = rect.left + rect.width / 2;
          candidates.push({ id, distance: Math.abs(cardCenterX - viewportCenterX) });
        }
      });

      candidates.sort((a, b) => a.distance - b.distance);
      const newActive = new Set(candidates.slice(0, maxConcurrent).map((c) => c.id));

      setActiveIds((prev) => {
        if (prev.size === newActive.size && [...prev].every((id) => newActive.has(id))) {
          return prev;
        }
        return newActive;
      });
    };

    const onScroll = () => {
      if (scrollThrottleId != null) return;
      scrollThrottleId = setTimeout(() => {
        scrollThrottleId = null;
        if (inSectionView && !document.hidden) updateActive();
      }, SCROLL_THROTTLE_MS);

      if (idleTimer != null) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        tracking = false;
        window.removeEventListener("scroll", onScroll, scrollOptions);
      }, IDLE_TIMEOUT_MS);
    };

    const startTracking = () => {
      if (tracking) return;
      tracking = true;
      updateActive();
      window.addEventListener("scroll", onScroll, scrollOptions);
    };

    const stopTracking = () => {
      tracking = false;
      if (scrollThrottleId != null) { clearTimeout(scrollThrottleId); scrollThrottleId = null; }
      if (idleTimer != null) { clearTimeout(idleTimer); idleTimer = null; }
      window.removeEventListener("scroll", onScroll, scrollOptions);
    };

    // Per-card IntersectionObserver: tracks which cards are on-screen + caches DOM refs
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const id = el.dataset.cardId;
          if (!id) return;
          if (entry.isIntersecting) {
            visibleIds.add(id);
            cardElements.set(id, el);
          } else {
            visibleIds.delete(id);
            cardElements.delete(id);
          }
        });
        if (inSectionView && !document.hidden) updateActive();
      },
      { rootMargin: "200px 0px", threshold: 0 }
    );

    // Section-level IntersectionObserver: only run scroll tracking when section is visible
    let sectionObserver: IntersectionObserver | null = null;
    const section = containerRef.current;
    if (section && typeof IntersectionObserver !== "undefined") {
      sectionObserver = new IntersectionObserver(
        ([entry]) => {
          inSectionView = entry.isIntersecting;
          if (inSectionView && !document.hidden) startTracking();
          else stopTracking();
        },
        { threshold: 0 }
      );
      sectionObserver.observe(section);

      section.querySelectorAll<HTMLElement>("[data-card-id]").forEach((card) => {
        cardObserver.observe(card);
      });
    } else {
      inSectionView = true;
      startTracking();
    }

    const onVisibility = () => {
      if (document.hidden) stopTracking();
      else if (inSectionView) startTracking();
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopTracking();
      cardObserver.disconnect();
      sectionObserver?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [canPlayMedia, maxConcurrent, videos]);

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
    setIsPaused(true);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedVideo(null);
    setIsPaused(false);
  }, []);

  return (
    <ActiveVideoContext.Provider value={{ activeIds }}>
      <section ref={containerRef} id="work" data-theme="dark" className={`relative bg-brand h-svh pt-14 overflow-clip flex flex-col ios-gpu-stable section-lazy pattern-bg ${marqueePaused ? "animate-marquee-paused" : ""}`}>
        <div className="relative z-10 flex flex-col h-full min-h-0 overflow-hidden justify-center">
          <div className="flex-shrink-0 flex items-end justify-center pt-4 pb-4 px-4 sm:px-6 lg:px-8">
            <h2 className="text-6xl md:text-6xl lg:text-7xl font-display font-bold text-white text-center">{data.carouselTitle}</h2>
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
                      isPaused={isPaused}
                      canPlayMedia={canPlayMedia}
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
                      isPaused={isPaused}
                      canPlayMedia={canPlayMedia}
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
                      isPaused={isPaused}
                      canPlayMedia={canPlayMedia}
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
                      isPaused={isPaused}
                      canPlayMedia={canPlayMedia}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expandedVideo && <ExpandedVideoModal video={expandedVideo} onClose={handleClose} />}
        </AnimatePresence>
      </section>
    </ActiveVideoContext.Provider>
  );
});
