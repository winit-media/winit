"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay, Keyboard, Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";

const defaultVideos = [
  { id: "1", name: "Campaign 1", url: "/fallback-video.mp4" },
  { id: "2", name: "Campaign 2", url: "/fallback-video.mp4" },
  { id: "3", name: "Campaign 3", url: "/fallback-video.mp4" },
  { id: "4", name: "Campaign 4", url: "/fallback-video.mp4" },
  { id: "5", name: "Campaign 5", url: "/fallback-video.mp4" },
];

function CarouselVideoSlide({ video, isActive }: { video: { id: string; url: string; name: string }; isActive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  const toggleAudio = () => {
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      setMuted(!muted);
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden border-[5px] border-white">
      <video
        ref={videoRef}
        src={video.url}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted
        preload="metadata"
      />
      {isActive && (
        <button
          onClick={toggleAudio}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors z-10"
        >
          {muted ? <VolumeX size={20} className="text-brand" /> : <Volume2 size={20} className="text-brand" />}
        </button>
      )}
    </div>
  );
}

export default function MediaCarousel() {
  const { data } = useAdmin();
  const videos = data.carouselVideos.length > 0 ? data.carouselVideos : defaultVideos;
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  return (
    <section id="work" className="relative bg-brand min-h-[80vh] snap-section py-16 overflow-hidden">
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white text-center">Our Work</h2>
        </div>

        <div className="relative">
          <Swiper
            modules={[EffectCoverflow, Autoplay, Keyboard, Navigation]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 1.5,
              slideShadows: false,
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            keyboard={{ enabled: true }}
            navigation
            loop
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="w-full !overflow-visible"
          >
            {videos.map((video) => (
              <SwiperSlide key={video.id} className="!w-[300px] md:!w-[500px]">
                {({ isActive }) => (
                  <div className="h-[400px] md:h-[550px]">
                    <CarouselVideoSlide video={video} isActive={isActive} />
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <span className="text-white/80 text-sm font-medium">
              {activeIndex + 1} / {videos.length}
            </span>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
