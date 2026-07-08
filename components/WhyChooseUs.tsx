"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Target, Lightbulb, Megaphone } from "lucide-react";
import PatternOverlay from "./PatternOverlay";
import { useAdmin } from "./AdminProvider";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const iconMap = [Target, Users, Award, TrendingUp, Lightbulb, Megaphone];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function WhyChooseUs() {
  const { data } = useAdmin();

  return (
    <section className="relative bg-brand min-h-screen snap-section pt-24 lg:pt-32 pb-10 lg:pb-20">
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white text-center mb-6 lg:mb-16 leading-[1.1]">
          {data.whyChooseUsTitle.replace(/Choose /i, "Choose \n").split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br className="block md:hidden" />}
            </span>
          ))}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          {data.stats.map((stat, i) => {
            const Icon = iconMap[i % iconMap.length];
            return (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg text-center flex flex-col items-center justify-center"
              >
                <Icon className="text-brand mb-2 lg:mb-4" size={28} />
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand font-display mb-1 lg:mb-2">
                  <AnimatedCounter target={stat.number} suffix={stat.suffix} />
                </div>
                <p className="text-gray-600 font-medium text-xs sm:text-sm lg:text-base leading-tight">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
