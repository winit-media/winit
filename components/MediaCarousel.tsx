"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";

const getOptimizedMedia = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return { videoUrl: url, posterUrl: url };
  const [baseUrl, path] = url.split('/upload/');
  return {
    videoUrl: `${baseUrl}/upload/f_auto,q_auto:eco,c_limit,w_400,so_0,eo_5/${path}`,
    posterUrl: `${baseUrl}/upload/f_auto,q_auto:eco,c_limit,w_400,so_0/${path}`.replace(/\.[^/.]+$/, ".webp")
  };
};

const getHighQualityMedia = (url: string) => {
  if (!url || !url.includes('cloudinary.com')) return { videoUrl: url };
  const [baseUrl, path] = url.split('/upload/');
  return {
    videoUrl: `${baseUrl}/upload/f_auto,q_auto:good/${path}`,
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

const useDeviceCapabilities = () => {
  const [canPlayMedia, setCanPlayMedia] = useState(true);

  useEffect(() => {
    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // @ts-ignore
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const saveData = connection?.saveData === true;
      const slowConnection = connection?.effectiveType === 'slow-2g' || connection?.effectiveType === '2g';
      
      // @ts-ignore
      const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
      const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;

      if (prefersReducedMotion || saveData || slowConnection || lowMemory || lowCPU) {
        setCanPlayMedia(false);
      }
    } catch (e) {
      // Ignore errors, default to true
    }
  }, []);

  return canPlayMedia;
};

interface VideoCardProps {
  video: { id: string; url: string; name: string };
  onExpand: (video: { id: string; url: string; name: string }) => void;
  isPaused: boolean;
  canPlayMedia: boolean;
}

function VideoCard({ video, onExpand, isPaused, canPlayMedia }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [isLandscape, setIsLandscape] = useState(false);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { videoUrl, posterUrl } = getOptimizedMedia(video.url);

  const shouldMountVideo = inView || isHovered;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !canPlayMedia) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [canPlayMedia]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !canPlayMedia) return;

    if (!isPaused && inView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [inView, isPaused, shouldMountVideo, canPlayMedia]);

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
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex-shrink-0 ${isLandscape ? "aspect-video" : "aspect-[9/16]"} h-full bg-black rounded-lg overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.02]`}
    >
      {canPlayMedia && shouldMountVideo ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          className="w-full h-full object-contain bg-black"
          loop
          playsInline
          muted={muted}
          preload="metadata"
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            setIsLandscape(v.videoWidth > v.videoHeight);
          }}
        />
      ) : (
        <img
          src={posterUrl}
          alt={video.name}
          className="w-full h-full object-contain bg-black"
          onLoad={(e) => {
            const img = e.currentTarget;
            setIsLandscape(img.naturalWidth > img.naturalHeight);
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <span className="text-white text-sm font-medium truncate drop-shadow-md">{video.name}</span>
        {canPlayMedia && (
          <button
            onClick={toggleAudio}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full p-2 transition-all duration-300"
          >
            {muted ? <VolumeX size={14} className="text-white" /> : <Volume2 size={14} className="text-white" />}
          </button>
        )}
      </div>
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
        <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full p-2 transition-all duration-300">
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
  const [muted, setMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [aspect, setAspect] = useState<string>("16/9");
  const { videoUrl } = getHighQualityMedia(video.url);

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
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
    setIsPlaying(!isPlaying);
  };

  const toggleAudio = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !muted;
      setMuted(!muted);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4"
        style={{ maxWidth: "90vw", maxHeight: "90vh", aspectRatio: aspect }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full flex items-center justify-center bg-black rounded-2xl overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            playsInline
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
      </div>
    </div>
  );
}

export default function MediaCarousel() {
  const { data } = useAdmin();
  const videos = data.carouselVideos.length > 0 ? data.carouselVideos : defaultVideos;
  const [expandedVideo, setExpandedVideo] = useState<{ id: string; url: string; name: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const canPlayMedia = useDeviceCapabilities();

  const row1Videos = videos.slice(0, Math.ceil(videos.length / 2));
  const row2Videos = videos.slice(Math.ceil(videos.length / 2));

  const handleExpand = useCallback((video: { id: string; url: string; name: string }) => {
    setExpandedVideo(video);
    setIsPaused(true);
  }, []);

  const handleClose = useCallback(() => {
    setExpandedVideo(null);
    setIsPaused(false);
  }, []);

  return (
    <section id="work" className="relative bg-brand h-screen pt-16 snap-section overflow-hidden flex flex-col">
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10 flex flex-col h-full min-h-0 overflow-hidden">
        <div className="flex-shrink-0 flex items-end justify-center pt-6 pb-8 px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white text-center">{data.carouselTitle}</h2>
        </div>

        <div 
          className="flex-1 flex flex-col gap-3 min-h-0 pb-4"
          style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
        >
          <div className="h-[min(35vh,350px)] min-h-[200px] overflow-hidden rounded-xl">
            <div className="flex h-full w-max gap-3 media-marquee media-marquee-left">
              <div className="flex items-center gap-3 shrink-0">
                {row1Videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-a-${index}`}
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
                    video={video}
                    onExpand={handleExpand}
                    isPaused={isPaused}
                    canPlayMedia={canPlayMedia}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-[min(35vh,350px)] min-h-[200px] overflow-hidden rounded-xl">
            <div className="flex h-full w-max gap-3 media-marquee media-marquee-right">
              <div className="flex items-center gap-3 shrink-0">
                {row2Videos.map((video, index) => (
                  <VideoCard
                    key={`${video.id}-a-${index}`}
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

      {expandedVideo && <ExpandedVideoModal video={expandedVideo} onClose={handleClose} />}
    </section>
  );
}
