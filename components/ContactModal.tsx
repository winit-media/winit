"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import PatternOverlay from "./PatternOverlay";

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setTimeout(() => {
        setStatus("idle");
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 300);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    // TODO: The user will provide instructions for email integration.
    // Simulating a successful network request for now
    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
        >
          {/* Purple-White Gradient Backdrop Overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-brand via-[#b955eb] to-white/90 backdrop-blur-md cursor-pointer"
            onClick={onClose}
          >
            <PatternOverlay opacity={0.15} />
          </div>

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative pt-4 px-6 pb-3 bg-white shrink-0">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/80 text-gray-400 hover:text-brand hover:bg-purple-50 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 pr-8">
                <img
                  src="/logo.png"
                  alt="Winit logo"
                  className="h-12 w-auto rounded-lg shrink-0"
                />
                <div className="min-w-0">
                  <h2 className="text-2xl font-display font-bold text-gray-900 mb-0.5">Let&apos;s Connect</h2>
                  <p className="text-gray-500 text-sm leading-snug break-words">
                    Leave your details and our team will get back to you within 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-6 border-t border-gray-100" />

            {/* Scrollable Form Body */}
            <div className="px-6 pb-6 pt-4 overflow-y-auto">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                    <Send size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500">We'll be in touch very soon.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="Aditya"
                    />
                  </motion.div>
                  
                  <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="hi@acaditya10.tech"
                    />
                  </motion.div>

                  <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
                    <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                      placeholder="+91 9876543210"
                    />
                  </motion.div>

                  <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all text-gray-900 resize-none placeholder:text-gray-400"
                      placeholder="Tell us about your project..."
                    />
                  </motion.div>

                  <motion.button
                    custom={4}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === "submitting"}
                    type="submit"
                    className="w-full mt-1 bg-brand text-white font-semibold py-3.5 rounded-xl hover:bg-[#8025a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
