"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PatternOverlay from "./PatternOverlay";

const headingText = "SHAPING SUCCESS STORIES";

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Hero() {
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtext(true), headingText.length * 40 + 600);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-brand overflow-hidden snap-section"
    >
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-serif text-white text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-wide leading-tight">
          {headingText.split(" ").map((word, wordIndex, wordsArray) => {
            const previousCharsCount = wordsArray.slice(0, wordIndex).join(" ").length + (wordIndex > 0 ? 1 : 0);
            return (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.3em] last:mr-0">
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    custom={previousCharsCount + charIndex}
                    variants={letterVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showSubtext ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-10 max-w-3xl mx-auto"
        >
          <p className="text-white/90 text-base sm:text-lg md:text-xl leading-relaxed">
            We believe every brand has a unique story waiting to be told. Our mission is to
            transform those stories into powerful narratives that drive success. By connecting
            your brand with the right audience, we ensure your message isn&apos;t just heard, but
            truly remembered. Let&apos;s craft your story together and make it unforgettable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showSubtext ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContact}
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white hover:text-brand"
          >
            Connect Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
