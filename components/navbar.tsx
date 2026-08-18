"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Audio", href: "/audio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    let previousY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;

      setScrolled(currentY > 30);

      if (currentY > previousY && currentY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      previousY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (deltaY > 80) {
      setOpen(false);
    }
    touchStartY.current = null;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: hidden ? -120 : 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-5"
      >
        <nav
          className={[
            "container-wide mx-auto flex h-[68px] items-center justify-between rounded-full px-4 transition-all duration-500 md:h-[76px] md:px-6",
            scrolled
              ? "glass shadow-2xl shadow-black/20"
              : "bg-black/15 backdrop-blur-md",
          ].join(" ")}
        >
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setOpen(false)}
            aria-label="Ope Rowland home"
          >
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-[#c9a96e]/40 bg-[#c9a96e]/10">
              <span className="font-display text-lg text-[#ead9ae]">O</span>
              <span className="absolute inset-0 rounded-full border border-[#c9a96e]/20 transition-transform duration-700 group-hover:scale-125" />
            </span>

            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90 sm:block">
              Ope Rowland
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/55 transition-colors duration-300 hover:text-white"
              >
                {item.label}
                <span className="absolute bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-[#c9a96e] transition-all duration-300 group-hover:w-4" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className="magnetic-button hidden items-center gap-2 rounded-full border border-[#c9a96e]/50 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#ead9ae] sm:flex"
            >
              <span>Connect</span>
              <ArrowUpRight size={13} className="arrow-icon" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="glass flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-2xl lg:hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <motion.div
              initial={{ y: "-10%" }}
              animate={{ y: 0 }}
              exit={{ y: "-10%" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex min-h-full flex-col justify-end px-5 pb-8 pt-28 overflow-y-auto max-h-[100dvh]"
            >
              <div className="mb-8">
                <span className="eyebrow">Navigation</span>
              </div>

              <div className="flex flex-col">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.55,
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-end justify-between border-t border-white/10 py-5"
                    >
                      <span className="font-display text-5xl text-white transition-colors duration-300 group-hover:text-[#c9a96e]">
                        {item.label}
                      </span>

                      <ArrowUpRight
                        className="mb-2 text-white/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#c9a96e]"
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5 text-xs leading-6 text-white/40">
                Helping believers find, groom & operate in their ministries.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
