"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAdmin } from "./AdminProvider";

const CARD_WIDTH = 440;
const CARD_HEIGHT = 440;
const ROTATION_AMOUNT = 8;

function StackedCard({
  item,
  index,
  total,
  progress,
  onClick,
}: {
  item: { sub: string; content: string; bg: string };
  index: number;
  total: number;
  progress: any;
  onClick: () => void;
}) {
  const isLast = index === total - 1;
  const step = 1 / total;

  const startFly = (index + 0.2) * step;
  const endFly = startFly + step * 0.8;

  const dir = index % 2 === 0 ? 1 : -1;
  const initialRotation = dir * index * ROTATION_AMOUNT;

  const y = useTransform(
    progress,
    [startFly, endFly],
    ["0vh", isLast ? "0vh" : "-100vh"]
  );

  const rotate = useTransform(
    progress,
    [0, startFly, endFly],
    [initialRotation, 0, isLast ? 0 : initialRotation + dir * 45]
  );

  const opacity = useTransform(
    progress,
    [startFly, endFly - step * 0.2],
    [1, isLast ? 1 : 0]
  );

  const scale = useTransform(
    progress,
    [startFly, endFly],
    [1, isLast ? 1 : 0.8]
  );

  const zIndex = total - index;

  return (
    <motion.div
      onClick={onClick}
      className="absolute inset-0 flex items-center justify-center origin-center cursor-pointer"
      style={{
        y,
        rotate,
        opacity,
        scale,
        zIndex,
      }}
    >
      <div
        className={`${item.bg} w-full h-full rounded-3xl shadow-2xl p-8 lg:p-12 flex flex-col justify-center text-white`}
      >
        <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-display">{item.sub}</h3>
        <p className="text-white/90 text-[15px] lg:text-base leading-relaxed">{item.content}</p>
      </div>
    </motion.div>
  );
}

export default function WhatWeDo() {
  const { data } = useAdmin();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardData = data.services;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const handleCardClick = () => {
    window.scrollBy({
      top: window.innerHeight * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-white w-full"
      style={{ height: `${cardData.length * 80}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden z-0">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url(/pattern.svg)",
              opacity: 0.24,
            }}
          />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row h-full relative z-10">
          <div className="w-full lg:w-5/12 flex items-center justify-center lg:justify-start h-[35%] lg:h-full pt-28 lg:pt-0">
            <div className="relative flex items-center justify-center lg:justify-start">
              <span
                className="absolute text-brand font-display font-bold opacity-25 select-none pointer-events-none"
                style={{
                  fontSize: "clamp(18rem, 40vw, 36rem)",
                  lineHeight: 1,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: -1,
                }}
              >
                ?
              </span>
              <h2
                className="font-display font-bold text-black leading-[0.95] text-center relative z-10"
                style={{ fontSize: "clamp(2.835rem, 6.48vw, 5.67rem)" }}
              >
                What we<br />do
              </h2>
            </div>
          </div>

          <div className="w-full lg:w-7/12 flex items-center justify-center h-[65%] lg:h-full pb-10 lg:pb-0">
            <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] flex items-center justify-center">
              {cardData.map((item, i) => (
                <StackedCard
                  key={i}
                  item={item}
                  index={i}
                  total={cardData.length}
                  progress={scrollYProgress}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
