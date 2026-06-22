"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useAdmin } from "./AdminProvider";
import PatternOverlay from "./PatternOverlay";
import "swiper/css";
import "swiper/css/navigation";

const defaultTestimonials = [
  {
    id: "1",
    name: "Riya Sharma",
    designation: "Marketing Head",
    company: "BrandVibe",
    service: "Influencer Marketing",
    review:
      "Working with this team transformed our brand presence completely. Their influencer campaigns drove real engagement and measurable results.",
    website: "https://example.com",
    logoUrl: "",
  },
  {
    id: "2",
    name: "Arjun Mehta",
    designation: "Founder & CEO",
    company: "NexGen Media",
    service: "Creative Strategy",
    review:
      "The creative strategy they developed for us was spot-on. Our social media engagement increased by 300% within three months.",
    website: "https://example.com",
    logoUrl: "",
  },
  {
    id: "3",
    name: "Priya Nair",
    designation: "Brand Manager",
    company: "UrbanWave",
    service: "Event Marketing",
    review:
      "The event they organized for our product launch was nothing short of spectacular. Every detail was perfect and the turnout exceeded expectations.",
    website: "https://example.com",
    logoUrl: "",
  },
];

function TestimonialCard({ t }: { t: (typeof defaultTestimonials)[0] }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 h-full flex flex-col">
      {t.logoUrl && (
        <img src={t.logoUrl} alt={t.company} className="h-10 w-auto object-contain mb-4 self-start" />
      )}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-600 italic leading-relaxed flex-1 mb-6">
        &ldquo;{t.review}&rdquo;
      </p>
      <div className="border-t pt-4">
        <p className="font-bold text-gray-900">{t.name}</p>
        <p className="text-sm text-gray-500">{t.designation}</p>
        <p className="text-sm text-gray-500">{t.company}</p>
        <p className="text-xs text-brand mt-1">Service: {t.service}</p>
        {t.website && (
          <a
            href={t.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand hover:underline mt-1 inline-block"
          >
            Visit Website
          </a>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const { data } = useAdmin();
  const testimonials = data.testimonials.length > 0 ? data.testimonials : defaultTestimonials;

  return (
    <section className="relative bg-white min-h-[80vh] snap-section py-20">
      <PatternOverlay opacity={0.08} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-gray-900 mb-16">
          Testimonials
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: ".testimonial-next",
              prevEl: ".testimonial-prev",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-4"
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id} className="!h-auto">
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button className="testimonial-prev bg-brand/10 hover:bg-brand/20 text-brand rounded-full p-3 transition-colors">
              <ChevronLeft size={24} />
            </button>
            <button className="testimonial-next bg-brand/10 hover:bg-brand/20 text-brand rounded-full p-3 transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
