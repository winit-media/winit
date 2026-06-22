"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Users, Award, Target, Lightbulb, Megaphone } from "lucide-react";
import PatternOverlay from "./PatternOverlay";

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
      {count}
      {suffix}
    </span>
  );
}

const stats = [
  { number: 150, suffix: "+", label: "Projects Completed", icon: Target },
  { number: 50, suffix: "+", label: "Happy Clients", icon: Users },
  { number: 98, suffix: "%", label: "Client Satisfaction", icon: Award },
];

const reasons = [
  {
    title: "Data-Driven Approach",
    desc: "Every campaign is backed by analytics and insights to maximize ROI.",
    icon: TrendingUp,
  },
  {
    title: "Creative Excellence",
    desc: "Our team delivers innovative content that stands out in crowded markets.",
    icon: Lightbulb,
  },
  {
    title: "Full-Service Agency",
    desc: "From strategy to execution, we handle everything under one roof.",
    icon: Megaphone,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function WhyChooseUs() {
  return (
    <section className="relative bg-brand min-h-screen snap-section py-20">
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white text-center mb-16">
          Why Choose Us?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center flex flex-col items-center"
            >
              <stat.icon className="text-brand mb-4" size={36} />
              <div className="text-4xl md:text-5xl font-bold text-brand font-serif mb-2">
                <AnimatedCounter target={stat.number} suffix={stat.suffix} />
              </div>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              custom={i + 3}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <reason.icon className="text-brand mb-4" size={32} />
              <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
              <p className="text-gray-600 leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
