"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  Headphones,
  Pause,
  Play,
  Radio,
  Search,
  Volume2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* AUDIO DATA                                                                 */
/* -------------------------------------------------------------------------- */
/*
 * Replace the placeholder audio URLs with the real MP3/M4A files.
 *
 * Every item supports:
 * - thumbnail
 * - topic
 * - series
 * - date
 * - duration
 * - audio URL
 * - download
 * - in-page playback
 */

const audioItems = [
  {
    id: "intimacy-01",
    title: "The Secret of True Fruitfulness",
    topic: "Intimacy With God",
    series: "The Intimate Life",
    date: "August 17, 2026",
    duration: "32:18",
    image:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/the-secret-of-true-fruitfulness.mp3",
  },
  {
    id: "ministry-01",
    title: "The Ministry of Every Saint",
    topic: "Ministry",
    series: "Finding Your Ministry",
    date: "August 10, 2026",
    duration: "28:42",
    image:
      "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/the-ministry-of-every-saint.mp3",
  },
  {
    id: "young-christian-01",
    title: "Taking Root Downward",
    topic: "Spiritual Growth",
    series: "The Young Christian",
    date: "August 03, 2026",
    duration: "36:05",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/taking-root-downward.mp3",
  },
  {
    id: "crossed-01",
    title: "The Finished Work of Christ",
    topic: "The Cross",
    series: "CROSSed",
    date: "July 27, 2026",
    duration: "41:20",
    image:
      "https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/the-finished-work-of-christ.mp3",
  },
  {
    id: "stretched-01",
    title: "When God Stretches You",
    topic: "Spiritual Formation",
    series: "STRETCHED Beyond Limits",
    date: "July 20, 2026",
    duration: "30:54",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/when-god-stretches-you.mp3",
  },
  {
    id: "obedience-01",
    title: "Obedience Is Worship",
    topic: "Obedience",
    series: "The True Act of Worship",
    date: "July 13, 2026",
    duration: "27:38",
    image:
      "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/obedience-is-worship.mp3",
  },
  {
    id: "idea-01",
    title: "Ministry Beyond Church Walls",
    topic: "Christian Ministry",
    series: "I Have an IDEA",
    date: "July 06, 2026",
    duration: "34:11",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/ministry-beyond-church-walls.mp3",
  },
  {
    id: "gifting-01",
    title: "Discover What God Has Placed in You",
    topic: "Spiritual Gifts",
    series: "Finding Your Ministry",
    date: "June 29, 2026",
    duration: "29:47",
    image:
      "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=85",
    audio:
      "/audio/discover-what-god-has-placed-in-you.mp3",
  },
];

const topics = [
  "All",
  ...Array.from(new Set(audioItems.map((item) => item.topic))),
];

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function AudioPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTopic, setActiveTopic] = useState("All");
  const [search, setSearch] = useState("");

  const filteredAudio = useMemo(() => {
    return audioItems.filter((item) => {
      const matchesTopic =
        activeTopic === "All" || item.topic === activeTopic;

      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.topic.toLowerCase().includes(query) ||
        item.series.toLowerCase().includes(query);

      return matchesTopic && matchesSearch;
    });
  }, [activeTopic, search]);

  /* ------------------------------------------------------------------------ */
  /* LENIS + GSAP                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    let lenis: {
      raf: (time: number) => void;
      destroy?: () => void;
    } | null = null;

    let rafId = 0;

    const setupLenis = async () => {
      const module = await import("lenis");
      const Lenis = module.default;

      const instance = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        syncTouch: true,
      });

      lenis = instance;

      const raf = (time: number) => {
        instance.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
    };

    setupLenis();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".audio-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 55,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.utils
        .toArray<HTMLElement>(".audio-card")
        .forEach((element, index) => {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 55,
              rotateX: 6,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9,
              delay: (index % 3) * 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                once: true,
              },
            },
          );
        });

      gsap.to(".audio-hero-orb", {
        x: 180,
        y: -100,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".audio-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".audio-hero-image", {
        y: 90,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".audio-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".audio-marquee-track", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".audio-marquee",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, page);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis?.destroy?.();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* AUDIO PLAYER                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateProgress = () => {
      if (!audio.duration) return;

      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const ended = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", ended);
    };
  }, [currentAudio]);

  const playAudio = (id: string, source: string) => {
    if (!audioRef.current) return;

    if (currentAudio === id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }

      return;
    }

    audioRef.current.pause();
    audioRef.current.src = source;
    audioRef.current.load();

    setCurrentAudio(id);
    setProgress(0);

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const seekAudio = (value: number) => {
    if (!audioRef.current?.duration) return;

    audioRef.current.currentTime =
      (value / 100) * audioRef.current.duration;

    setProgress(value);
  };

  const activeAudio = audioItems.find(
    (item) => item.id === currentAudio,
  );

  return (
    <div
      ref={pageRef}
      className="overflow-hidden bg-[#070707] text-white"
    >
      <audio ref={audioRef} preload="metadata" />

      {/* ================================================================== */}
      {/* HERO                                                               */}
      {/* ================================================================== */}

      <section className="audio-hero relative min-h-[92svh] overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-80" />

        <div className="audio-hero-orb absolute -right-48 top-10 h-[620px] w-[620px] rounded-full bg-[#c9a96e]/10 blur-[150px]" />

        <div className="container-wide relative mx-auto grid min-h-[92svh] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1fr_0.85fr]">
          <div className="relative z-10">
            {/* Removed the "Audio / Teachings" line and "Ope Rowland / Audio Library" eyebrow */}

            <h1 className="audio-reveal display-xl mt-7 max-w-5xl">
              Listen.
              <br />
              <span className="gold-gradient-text">
                Go deeper.
              </span>
            </h1>

            <p className="audio-reveal mt-8 max-w-xl text-base leading-8 text-white/45 md:text-lg">
              Listen to teachings, inspirational talks, and ministry
              resources designed to help you grow in intimacy with God,
              discover your calling, and walk in spiritual maturity.
            </p>

            <div className="audio-reveal mt-9 flex flex-wrap gap-3">
              <a
                href="#audio-library"
                className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#000" }} // ensure black text on light background
              >
                Explore audio
                <ArrowDown size={14} />
              </a>

              <Link
                href="/contact"
                className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
              >
                Invite Ope
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="audio-reveal mt-12 flex items-center gap-4">
              <Radio size={15} className="text-[#c9a96e]" />

              <span className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                Teachings • Sermons • Conversations • Inspiration
              </span>
            </div>
          </div>

          {/* Hero artwork */}
          <div className="relative hidden min-h-[570px] lg:block">
            <div className="absolute right-0 top-1/2 h-[480px] w-[390px] -translate-y-1/2 rotate-3 rounded-[2rem] border border-white/10 bg-white/[0.02] p-3 backdrop-blur-xl">
              <div className="audio-hero-image group relative h-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src={audioItems[0].image}
                  alt={audioItems[0].title}
                  fill
                  priority
                  unoptimized
                  sizes="390px"
                  className="object-cover transition-transform duration-[1.2s] group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.16em] text-white/55">
                    <span>{audioItems[0].series}</span>
                    <span className="h-1 w-1 rounded-full bg-[#c9a96e]" />
                    <span>{audioItems[0].duration}</span>
                  </div>

                  <h2 className="mt-3 font-display text-3xl leading-tight">
                    {audioItems[0].title}
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      playAudio(
                        audioItems[0].id,
                        audioItems[0].audio,
                      )
                    }
                    className="mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
                  >
                    {currentAudio === audioItems[0].id &&
                    isPlaying ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} fill="currentColor" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Removed the floating "Audio Library" card */}
          </div>
        </div>

        {/* Removed the bottom bar with "01 / {audioItems.length}" and "Listen • Learn • Live" */}
      </section>

      {/* ================================================================== */}
      {/* INTRO                                                               */}
      {/* ================================================================== */}

      <section className="relative py-28 md:py-40">
        <div className="container-wide mx-auto grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <div className="audio-reveal">
            <span className="eyebrow">The Audio Library</span>

            <div className="mt-10 hidden lg:block">
              <div className="h-24 w-24 rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/5" />
              <div className="ml-12 mt-[-45px] h-px w-36 bg-gradient-to-r from-[#c9a96e] to-transparent" />
            </div>
          </div>

          <div>
            <h2 className="audio-reveal display-md">
              Teachings for the
              <br />
              <span className="gold-gradient-text">
                journey.
              </span>
            </h2>

            <p className="audio-reveal mt-8 max-w-2xl text-sm leading-8 text-white/40 md:text-base">
              Stream each teaching directly from the site or download the
              audio to listen later. Search the library, browse by topic,
              or explore complete teaching series.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* SERIES SWIPER                                                       */}
      {/* ================================================================== */}

      <section className="border-y border-white/10 bg-[#0a0a0a] py-24 md:py-32">
        <div className="container-wide mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="eyebrow">Teaching Series</span>
              <h2 className="display-sm mt-5">
                Explore by <span className="gold-gradient-text">series.</span>
              </h2>
            </div>

            <span className="hidden text-[8px] uppercase tracking-[0.2em] text-white/20 md:block">
              Swipe / drag
            </span>
          </div>

          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop
            spaceBetween={18}
            slidesPerView={1.15}
            breakpoints={{
              640: {
                slidesPerView: 2.1,
              },
              1024: {
                slidesPerView: 3.1,
              },
            }}
          >
            {Array.from(
              new Map(
                audioItems.map((item) => [item.series, item]),
              ).values(),
            ).map((item) => (
              <SwiperSlide key={item.series}>
                <div className="group relative aspect-[1.35/1] overflow-hidden rounded-[1.5rem] border border-white/10">
                  <Image
                    src={item.image}
                    alt={item.series}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 90vw, 33vw"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[8px] uppercase tracking-[0.18em] text-[#ead9ae]">
                      {item.topic}
                    </p>

                    <h3 className="mt-2 font-display text-2xl">
                      {item.series}
                    </h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================================================================== */}
      {/* MARQUEE - REMOVED                                                   */}
      {/* ================================================================== */}

      {/* ================================================================== */}
      {/* AUDIO LIBRARY                                                        */}
      {/* ================================================================== */}

      <section id="audio-library" className="relative py-24 md:py-36">
        <div className="container-wide mx-auto">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="audio-reveal eyebrow">
                All Teachings
              </span>

              <h2 className="audio-reveal display-md mt-5">
                Press <span className="gold-gradient-text">play.</span>
              </h2>
            </div>

            {/* Search */}
            <div className="relative w-full md:max-w-xs">
              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search teachings..."
                className="w-full rounded-full border border-white/10 bg-white/[0.03] py-4 pl-11 pr-10 text-xs text-white outline-none backdrop-blur-xl placeholder:text-white/20 focus:border-[#c9a96e]/40"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Topic filters */}
          <div className="mt-10 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {topics.map((topic) => {
              const active = activeTopic === topic;

              return (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setActiveTopic(topic)}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.14em] transition-all ${
                    active
                      ? "border-[#c9a96e]/40 bg-[#c9a96e]/10 text-[#ead9ae]"
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          {/* Audio cards */}
          <motion.div layout className="mt-14 grid gap-5">
            <AnimatePresence mode="popLayout">
              {filteredAudio.map((item, index) => {
                const active = currentAudio === item.id;

                return (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{
                      duration: 0.45,
                      delay: index * 0.035,
                    }}
                    className={`audio-card group relative overflow-hidden rounded-[1.75rem] border transition-all duration-500 ${
                      active
                        ? "border-[#c9a96e]/30 bg-[#c9a96e]/[0.045]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.035]"
                    }`}
                  >
                    <div className="grid gap-0 lg:grid-cols-[250px_1fr_auto]">
                      {/* Thumbnail */}
                      <div className="relative aspect-[1.4/1] overflow-hidden lg:aspect-auto lg:min-h-[210px]">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="250px"
                          className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30" />

                        <button
                          type="button"
                          aria-label={
                            active && isPlaying
                              ? `Pause ${item.title}`
                              : `Play ${item.title}`
                          }
                          onClick={() =>
                            playAudio(item.id, item.audio)
                          }
                          className="absolute left-5 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-2xl transition-all duration-300 hover:scale-110"
                        >
                          {active && isPlaying ? (
                            <Pause size={17} />
                          ) : (
                            <Play
                              size={17}
                              fill="currentColor"
                            />
                          )}
                        </button>

                        {active && isPlaying && (
                          <div className="absolute bottom-4 left-5 flex items-end gap-1">
                            {[12, 20, 15, 24, 17].map((height, i) => (
                              <motion.span
                                key={i}
                                animate={{
                                  height: [
                                    height / 2,
                                    height,
                                    height / 1.5,
                                    height,
                                  ],
                                }}
                                transition={{
                                  duration: 0.7,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                                className="w-1 rounded-full bg-white"
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col justify-center p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-3 text-[8px] uppercase tracking-[0.16em]">
                          <span className="text-[#ead9ae]">
                            {item.topic}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-white/15" />

                          <span className="text-white/25">
                            {item.series}
                          </span>
                        </div>

                        <h3 className="mt-4 font-display text-2xl leading-tight text-white md:text-3xl">
                          {item.title}
                        </h3>

                        <div className="mt-5 flex flex-wrap items-center gap-5 text-[8px] uppercase tracking-[0.15em] text-white/25">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={12} />
                            {item.date}
                          </span>

                          <span>{item.duration}</span>

                          <span className="flex items-center gap-2">
                            <Headphones size={12} />
                            Audio
                          </span>
                        </div>

                        {/* Progress */}
                        {active && (
                          <div className="mt-6 flex items-center gap-3">
                            <span className="text-[8px] text-white/25">
                              {Math.round(progress)}%
                            </span>

                            <input
                              aria-label="Audio progress"
                              type="range"
                              min="0"
                              max="100"
                              step="0.1"
                              value={progress}
                              onChange={(event) =>
                                seekAudio(
                                  Number(event.target.value),
                                )
                              }
                              className="audio-range h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
                            />

                            <Volume2
                              size={13}
                              className="shrink-0 text-white/25"
                            />
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 border-t border-white/10 p-6 lg:border-l lg:border-t-0 lg:p-8">
                        <button
                          type="button"
                          onClick={() =>
                            playAudio(item.id, item.audio)
                          }
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-white/30 hover:bg-white hover:text-black"
                          title="Play on site"
                        >
                          {active && isPlaying ? (
                            <Pause size={14} />
                          ) : (
                            <Play
                              size={14}
                              fill="currentColor"
                            />
                          )}
                        </button>

                        <a
                          href={item.audio}
                          download
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all hover:border-[#c9a96e]/40 hover:bg-[#c9a96e]/10 hover:text-[#ead9ae]"
                          title="Download audio"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredAudio.length === 0 && (
            <div className="py-24 text-center">
              <Headphones
                size={30}
                className="mx-auto text-white/20"
              />

              <p className="mt-5 text-sm text-white/30">
                No teachings match your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* STICKY MINI PLAYER                                                  */}
      {/* ================================================================== */}

      <AnimatePresence>
        {activeAudio && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            className="fixed bottom-5 left-1/2 z-50 w-[calc(100%-24px)] max-w-3xl -translate-x-1/2"
          >
            <div className="glass overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#0b0b0b]/80 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl sm:block">
                  <Image
                    src={activeAudio.image}
                    alt={activeAudio.title}
                    fill
                    unoptimized
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    playAudio(
                      activeAudio.id,
                      activeAudio.audio,
                    )
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black"
                >
                  {isPlaying ? (
                    <Pause size={14} />
                  ) : (
                    <Play size={14} fill="currentColor" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-xs font-medium text-white">
                      {activeAudio.title}
                    </p>

                    <span className="hidden shrink-0 text-[8px] uppercase tracking-[0.15em] text-white/25 sm:block">
                      {activeAudio.series}
                    </span>
                  </div>

                  <input
                    aria-label="Player progress"
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={(event) =>
                      seekAudio(Number(event.target.value))
                    }
                    className="audio-range mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10"
                  />
                </div>

                <a
                  href={activeAudio.audio}
                  download
                  className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/50 hover:bg-white hover:text-black sm:flex"
                  title="Download"
                >
                  <Download size={13} />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================== */}
      {/* CTA                                                                 */}
      {/* ================================================================== */}

      <section className="pb-32 md:pb-48">
        <div className="container-wide mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111] px-7 py-20 text-center md:px-16">
            <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#c9a96e]/10 blur-[110px]" />

            <div className="relative z-10">
              <p className="audio-reveal eyebrow">
                Keep Exploring
              </p>

              <h2 className="audio-reveal display-lg mx-auto mt-7 max-w-5xl">
                Let the teaching
                <br />
                <span className="gold-gradient-text">
                  become practice.
                </span>
              </h2>

              <p className="audio-reveal mx-auto mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                Continue your journey through books, articles, and ministry
                resources.
              </p>

              <div className="audio-reveal mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/books"
                  className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#000" }} // ensure black text on light background
                >
                  Explore Books
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/blog"
                  className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
                >
                  Read the Journal
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}