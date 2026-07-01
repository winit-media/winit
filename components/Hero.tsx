"use client";

import { useState, useEffect, useRef } from "react";
import PatternOverlay from "./PatternOverlay";
import { useAdmin } from "./AdminProvider";

const TYPING_SPEED = 80;

export default function Hero() {
  const { data } = useAdmin();
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const indexRef = useRef(0);

  const headingText = data.heroHeading;

  useEffect(() => {
    indexRef.current = 0;
    setTypedText("");
    setTypingDone(false);
    setShowSubtext(false);

    const interval = setInterval(() => {
      indexRef.current += 1;
      if (indexRef.current <= headingText.length) {
        setTypedText(headingText.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, [headingText]);

  useEffect(() => {
    if (typingDone) {
      const timer = setTimeout(() => setShowSubtext(true), 600);
      return () => clearTimeout(timer);
    }
  }, [typingDone]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center bg-brand overflow-hidden snap-section"
    >
      <PatternOverlay opacity={0.16} />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div
          className="transition-transform duration-800 ease-out"
          style={{ transform: showSubtext ? 'translateY(-10px)' : 'translateY(0)', transition: 'transform 0.8s ease-out' }}
        >
          <h1
            className="font-display text-white text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-black mt-16 mb-2"
            style={{ letterSpacing: "-0.03em", lineHeight: "0.95" }}
          >
            <span>{typedText}</span>
            {!typingDone && <span className="dot-cursor" />}
          </h1>
        </div>

        {showSubtext && (
          <>
            <div
              className="mt-2 max-w-3xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0s' }}
            >
              <p className="text-white text-base sm:text-lg md:text-xl leading-relaxed font-medium mx-auto" style={{ maxWidth: '60ch', opacity: 0.85 }}>
                {data.heroSubtext}
              </p>
            </div>

            <div
              className="mt-8 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-contact-modal"))}
                className="bg-white text-[#912dbf] px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgba(255,255,255,0.3)] active:scale-95"
              >
                {data.heroCtaText}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
