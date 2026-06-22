"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cardData = [
  {
    sub: "Influencer Marketing",
    content:
      "We specialize in crafting potent campaigns that link brands with the perfect influencers to promote their products or services effectively. Our strategic approach ensures we select influencers tailored to your target market and goals.",
    bg: "bg-blue-500",
  },
  {
    sub: "Celebrity Endorsement",
    content:
      "We connect your brand with top celebrities for authentic endorsements that boost credibility and expand reach. Let's make your brand shine with star power!",
    bg: "bg-red-500",
  },
  {
    sub: "Podcast",
    content:
      "We create engaging podcasts that amplify your brand's voice. Through compelling storytelling and expert insights, we connect you with your audience authentically. Let's bring your brand to life through audio!",
    bg: "bg-purple-400",
  },
  {
    sub: "User Generated Content",
    content:
      "We leverage user-generated content to boost trust and engagement. Partnering with creators, we craft authentic content that resonates with your audience. Let's amplify your brand's impact!",
    bg: "bg-pink-400",
  },
  {
    sub: "Talent Management",
    content:
      "We manage talent to elevate your brand's presence. From collaborations to career growth, we connect influencers and brands for impactful partnerships. Let's build success together!",
    bg: "bg-orange-400",
  },
  {
    sub: "Creative Strategy",
    content:
      "We craft tailored strategies that align with your brand's goals and audience. With industry insights, striking visuals, and compelling stories, we create lasting impact. Let's make your brand unforgettable!",
    bg: "bg-green-400",
  },
  {
    sub: "Event Marketing",
    content:
      "We create unforgettable events that captivate audiences and amplify your brand's impact. From strategy to execution, we turn moments into lasting impressions. Let's make your event a success!",
    bg: "bg-yellow-400",
  },
];

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
  item: (typeof cardData)[0];
  index: number;
  total: number;
  progress: any;
  onClick: () => void;
}) {
  const isLast = index === total - 1;
  const step = 1 / total;
  
  // Create a buffer before the card flies away
  const startFly = (index + 0.2) * step;
  const endFly = startFly + step * 0.8;

  // Alternate rotation to create a beautiful flower-fan
  const dir = index % 2 === 0 ? 1 : -1;
  const initialRotation = dir * index * ROTATION_AMOUNT;

  const y = useTransform(
    progress,
    [startFly, endFly],
    ["0vh", isLast ? "0vh" : "-100vh"]
  );

  // Cards smoothly rotate from their initial fanned angle to 0 as they approach the top of the stack
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

  // First card (index 0) has the highest z-index so it's on top
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
        <h3 className="text-3xl lg:text-4xl font-bold mb-4 font-serif">{item.sub}</h3>
        <p className="text-white/90 text-[15px] lg:text-base leading-relaxed">{item.content}</p>
      </div>
    </motion.div>
  );
}

export default function WhatWeDo() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const handleCardClick = () => {
    // Each card effectively takes up 80vh of scroll height in the section.
    // Scrolling by this amount flawlessly advances to the next card using the native framer-motion animation.
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
      {/* Pinned background and content container */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden z-0">
        
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url(/pattern.svg)",
              opacity: 0.24,
            }}
          />
        </div>

        {/* Content Wrapper */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row h-full relative z-10">
          
          {/* Left side — "What we do" text */}
          <div className="w-full lg:w-5/12 flex items-center justify-center lg:justify-start h-[35%] lg:h-full pt-10 lg:pt-0">
            <div className="relative flex items-center justify-center lg:justify-start">
              {/* Big Background Question Mark */}
              <span
                className="absolute text-brand font-serif font-bold opacity-10 select-none pointer-events-none"
                style={{
                  fontSize: "clamp(12rem, 30vw, 26rem)",
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
                className="font-serif font-bold text-brand leading-[0.95] text-center lg:text-left relative z-10"
                style={{ fontSize: "clamp(3.5rem, 8vw, 7.5rem)" }}
              >
                What
                <br />
                we do
              </h2>
            </div>
          </div>

          {/* Right side — Framer Motion Cards */}
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
