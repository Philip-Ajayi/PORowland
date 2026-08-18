"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Church,
  Globe2,
  Headphones,
  Leaf,
  PenLine,
  Quote,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const beliefs = [
  {
    number: "01",
    icon: Leaf,
    title: "Intimacy Produces Fruitfulness",
    description:
      "The foundation of all ministry success is intimacy with God. Fruitfulness ends when intimacy ends. Your productivity is directly dependent on how much you draw near to Him.",
  },
  {
    number: "02",
    icon: Users,
    title: "Every Saint Has a Ministry",
    description:
      "God has called and equipped every believer for specific ministry. Our role is to help you discover, develop, and deploy your unique gifts and calling in the kingdom.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "The Word Brings Victory",
    description:
      "Young believers become strong when God's word lives in their hearts. Through Scripture, we gain the strength to win our battles and walk in spiritual authority.",
  },
  {
    number: "04",
    icon: Target,
    title: "The Cross Changes Everything",
    description:
      "Understanding how the Cross episode affects us is fundamental to Christian life. It's the foundation of our redemption, authority, and relationship with God.",
  },
];

const journey = [
  {
    number: "01",
    icon: Church,
    title: "Lead Pastor, MIV Word House",
    description:
      "Serving as the Lead Pastor of MIV Word House, shepherding believers and building a community rooted in God's Word and committed to spiritual growth.",
  },
  {
    number: "02",
    icon: Users,
    title: "National Youth Pastor, The Men of Issachar Vision Inc.",
    description:
      "Leading youth ministry nationwide for The Men of Issachar Vision Inc., raising up the next generation to understand the times and know what to do.",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Author & Writer",
    description:
      "Author of multiple published books including The Young Christian, The Intimate Life, Manifestation, CROSSed, STRETCHED Beyond Limits, and OBEDIENCE...the true act of worship.",
  },
  {
    number: "04",
    icon: PenLine,
    title: "Grenepages Contributor",
    description:
      "Regular contributor to the Thrive column on Grenepages, providing insights and teachings on spiritual growth and victorious Christian living.",
  },
  {
    number: "05",
    icon: Headphones,
    title: "Grenecast Speaker",
    description:
      "Host of short inspirational talks on Grenecast that help answer questions and reinforce scriptural and spiritual truth for believers everywhere.",
  },
  {
    number: "06",
    icon: PenLine,
    title: "Ministry Blogger",
    description:
      "Creator of thriving blogs that inspire, educate, and equip believers to discover and walk in their God-given ministries.",
  },
];

const impact = [
  {
    icon: BookOpen,
    value: "07+",
    label: "Published Works",
    description:
      "Comprehensive teachings on spiritual growth, intimacy, obedience, and ministry.",
  },
  {
    icon: Globe2,
    value: "∞",
    label: "International Reach",
    description:
      "Books available on Amazon worldwide, touching lives across continents.",
  },
  {
    icon: Headphones,
    value: "365",
    label: "Teaching Mindset",
    description:
      "A continuing stream of inspirational talks, blogs, and written content.",
  },
];

function MagneticPortrait() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, {
    stiffness: 160,
    damping: 18,
    mass: 0.7,
  });

  const springY = useSpring(y, {
    stiffness: 160,
    damping: 18,
    mass: 0.7,
  });

  const rotateX = useTransform(springY, [-100, 100], [5, -5]);
  const rotateY = useTransform(springX, [-100, 100], [-5, 5]);

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();

        x.set(event.clientX - rect.left - rect.width / 2);
        y.set(event.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative h-full w-full"
    >
      <div className="absolute -inset-16 rounded-full bg-[#c9a96e]/10 blur-[100px]" />

      <div className="relative h-full overflow-hidden rounded-[42%_42%_4%_4%] border border-white/10 bg-[#151515] shadow-2xl shadow-black/40">
        <Image
          src="/Ope.jpg"
          alt="Ope Rowland portrait"
          fill
          priority
          className="object-cover object-center saturate-[0.7] contrast-[1.05] transition-transform duration-1000 hover:scale-[1.035]"
          unoptimized
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    let lenis: {
      raf: (time: number) => void;
      destroy?: () => void;
    } | null = null;

    let rafId = 0;

    const initLenis = async () => {
      const LenisModule = await import("lenis");
      const Lenis = LenisModule.default;

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

    initLenis();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".about-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 55 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".about-line").forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.15,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".belief-card").forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 70, rotateX: 8 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.to(".about-hero-orb", {
        y: -180,
        x: 90,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".about-portrait", {
        y: 110,
        scale: 1.07,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".philosophy-word", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".philosophy-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".journey-image", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".journey-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".impact-number", {
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".impact-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, page);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      lenis?.destroy?.();
    };
  }, []);

  return (
    <div ref={pageRef} className="overflow-hidden">
      {/* ---------------------------------------------------------------- */}
      {/* HERO — pixel height, responsive portrait visible on all screens */}
      {/* ---------------------------------------------------------------- */}

      <section className="about-hero relative min-h-[900px] overflow-hidden bg-[#070707]">
        <div className="absolute inset-0 mesh-bg" />

        <div className="about-hero-orb absolute -right-40 top-20 h-[600px] w-[600px] rounded-full bg-[#c9a96e]/10 blur-[140px]" />

        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#070707] to-transparent" />

        <div className="container-wide relative mx-auto grid min-h-[900px] items-center gap-12 pb-20 pt-32 lg:grid-cols-[1fr_0.78fr] lg:gap-20">
          <div className="relative z-20">
            <h1 className="about-reveal display-xl mt-7 max-w-5xl text-white">
              About
              <br />
              <span className="gold-gradient-text">Ope Rowland.</span>
            </h1>

            <p className="about-reveal mt-8 max-w-2xl text-base leading-8 text-white/50 md:text-lg">
              A heart for ministry, a passion for helping believers discover
              their divine calling.
            </p>

            <div className="about-reveal mt-9 flex flex-wrap gap-3">
              <Link
                href="#philosophy"
                className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#000" }}
              >
                Discover the philosophy
                <ArrowDown size={14} className="arrow-icon" />
              </Link>

              <Link
                href="/books"
                className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white border border-white/15"
              >
                Explore books
                <ArrowUpRight size={14} className="arrow-icon" />
              </Link>
            </div>
          </div>

          {/* Portrait — visible on all screens */}
          <div className="about-portrait relative z-10 mx-auto h-[70vh] max-h-[600px] w-full max-w-[400px] lg:mx-0 lg:h-[75vh] lg:min-h-[580px] lg:max-h-none lg:w-full lg:max-w-none">
            <MagneticPortrait />

            <div className="absolute -left-12 top-1/4 glass rounded-2xl px-5 py-4">
              <p className="text-[8px] uppercase tracking-[0.18em] text-white/35">
                Philosophy
              </p>
              <p className="mt-1 font-display text-xl text-[#ead9ae]">
                Every saint has a ministry.
              </p>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center text-[8px] uppercase tracking-[0.24em] text-white/25">
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="hidden items-center gap-2 md:flex"
            >
              Scroll to explore
              <ArrowDown size={13} />
            </motion.span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* INTRODUCTION                                                      */}
      {/* ---------------------------------------------------------------- */}

      <section className="relative py-28 md:py-40">
        <div className="container-wide mx-auto">
          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <div className="about-reveal">
              <span className="eyebrow">The Story</span>

              <div className="mt-10 hidden lg:block">
                <div className="h-24 w-24 rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/5" />

                <div className="ml-12 mt-[-40px] h-px w-32 bg-gradient-to-r from-[#c9a96e] to-transparent" />
              </div>
            </div>

            <div>
              <h2 className="about-reveal display-md text-balance text-white">
                Believing in the{" "}
                <span className="gold-gradient-text">
                  ministry of every saint.
                </span>
              </h2>

              <div className="mt-10 grid gap-8 md:grid-cols-2">
                <p className="about-reveal text-sm leading-8 text-white/50 md:text-base">
                  Hi, I&apos;m Ope Rowland. I believe in the ministry of every
                  saint. Hence, I talk and write about believers finding,
                  grooming, and operating in their ministries.
                </p>

                <p className="about-reveal text-sm leading-8 text-white/50 md:text-base">
                  I currently serve as the Lead Pastor of MIV Word House and
                  the National Youth Pastor for The Men of Issachar Vision
                  Inc.. My journey in ministry has been guided by one central
                  truth: every believer has been called and equipped by God for
                  a unique purpose.
                </p>
              </div>

              <p className="about-reveal mt-8 max-w-3xl text-sm leading-8 text-white/50 md:text-base">
                Too often, Christians struggle to discover their ministries,
                develop their gifts, or walk confidently in their spiritual
                authority. My mission is to change that. Through books,
                teachings, and inspirational content, I help believers
                understand the profound connection between intimacy with God
                and fruitfulness in ministry.
              </p>

              <div className="about-line mt-12 h-px origin-left bg-white/10" />

              <p className="about-reveal mt-10 max-w-3xl font-display text-3xl leading-tight text-white md:text-4xl">
                When we draw near to Him, take root in Christ, and allow His
                Word to live in our hearts, we unlock the transformative power
                that enables us to fulfill our God-given destinies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* PHILOSOPHY                                                        */}
      {/* ---------------------------------------------------------------- */}

      <section
        id="philosophy"
        className="philosophy-section relative overflow-hidden border-y border-white/10 py-28 md:py-40"
      >
        <div className="absolute inset-0 mesh-bg opacity-60" />

        <div className="philosophy-word pointer-events-none absolute left-[5%] top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[20vw] leading-none text-white/[0.025]">
          PHILOSOPHY
        </div>

        <div className="container-wide relative mx-auto">
          <div className="max-w-3xl">
            <span className="eyebrow">Core Beliefs</span>

            <h2 className="about-reveal display-lg mt-7 text-white">
              Ministry
              <br />
              <span className="gold-gradient-text">Philosophy.</span>
            </h2>

            <p className="about-reveal mt-7 max-w-xl text-sm leading-7 text-white/40">
              Four convictions sit at the centre of the work: intimacy,
              identity, Scripture and the finished work of Christ.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {beliefs.map((belief) => {
              const Icon = belief.icon;

              return (
                <article
                  key={belief.number}
                  className="belief-card glass-card group relative min-h-[390px] rounded-[2rem] p-7 md:p-9"
                >
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/5">
                      <Icon
                        size={19}
                        strokeWidth={1.4}
                        className="text-[#c9a96e] transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    <span className="font-display text-3xl text-white/10">
                      {belief.number}
                    </span>
                  </div>

                  <div className="relative z-10 mt-24 max-w-lg">
                    <h3 className="font-display text-3xl leading-none text-white md:text-4xl">
                      {belief.title}
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-white/40">
                      {belief.description}
                    </p>
                  </div>

                  <div className="absolute bottom-7 right-7 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/20 transition-all duration-500 group-hover:border-[#c9a96e]/40 group-hover:text-[#c9a96e]">
                    <ArrowUpRight size={14} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* JOURNEY                                                           */}
      {/* ---------------------------------------------------------------- */}

      <section className="journey-section relative py-28 md:py-40">
        <div className="container-wide mx-auto">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <div className="relative">
              <div className="sticky top-32">
                <span className="eyebrow">A Journey of Faith & Teaching</span>

                <h2 className="about-reveal display-md mt-7 max-w-lg text-white">
                  A life shaped
                  <br />
                  by <span className="gold-gradient-text">service.</span>
                </h2>

                <div className="journey-image relative mt-12 hidden aspect-[0.8] overflow-hidden rounded-[2rem] border border-white/10 lg:block">
                  <Image
                    src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1000&q=85"
                    alt="Church and ministry placeholder"
                    fill
                    className="h-[120%] object-cover grayscale-[0.25]"
                    unoptimized
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[17px] top-4 hidden h-[calc(100%-20px)] w-px bg-gradient-to-b from-[#c9a96e]/50 via-white/10 to-transparent md:block" />

              <div className="space-y-5">
                {journey.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.number}
                      className="about-reveal group relative grid gap-6 rounded-[2rem] border border-white/8 bg-white/[0.025] p-7 transition-all duration-700 hover:-translate-y-1 hover:border-[#c9a96e]/25 hover:bg-white/[0.04] md:grid-cols-[54px_1fr] md:p-8"
                    >
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a96e]/20 bg-[#0a0a0a]">
                        <Icon
                          size={16}
                          strokeWidth={1.4}
                          className="text-[#c9a96e]"
                        />
                      </div>

                      <div>
                        <div className="mb-3 flex items-center gap-3">
                          <span className="h-px w-8 bg-white/10" />
                        </div>

                        <h3 className="font-display text-3xl leading-none text-white">
                          {item.title}
                        </h3>

                        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40">
                          {item.description}
                        </p>
                      </div>

                      <ArrowRight
                        size={16}
                        className="absolute bottom-7 right-7 text-white/15 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#c9a96e]"
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* IMPACT                                                            */}
      {/* ---------------------------------------------------------------- */}

      <section className="impact-section relative overflow-hidden border-y border-white/10 bg-[#090909] py-28 md:py-40">
        <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#c9a96e]/8 blur-[120px]" />

        <div className="container-wide relative mx-auto">
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <span className="eyebrow">Making a Difference</span>

              <h2 className="about-reveal display-md mt-7 text-white">
                Impact
                <br />
                & <span className="gold-gradient-text">Reach.</span>
              </h2>
            </div>

            <div>
              <div className="grid divide-y divide-white/10 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
                {impact.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.label}
                      className="group relative px-0 py-8 md:px-7 md:py-5 first:md:pl-0 last:md:pr-0"
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.3}
                        className="text-[#c9a96e]"
                      />

                      <div className="impact-number mt-8 font-display text-6xl text-white md:text-7xl">
                        {item.value}
                      </div>

                      <h3 className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
                        {item.label}
                      </h3>

                      <p className="mt-4 text-xs leading-6 text-white/35">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>

              <div className="about-reveal mt-10 flex flex-wrap gap-2">
                {[
                  "Spiritual Growth",
                  "Intimacy",
                  "Obedience",
                  "Ministry",
                  "Purpose",
                  "Victory",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="glass rounded-full px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-[#ead9ae]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* QUOTE                                                             */}
      {/* ---------------------------------------------------------------- */}

      <section className="relative overflow-hidden py-32 md:py-48">
        <div className="absolute inset-0 mesh-gold opacity-50" />

        <div className="container-standard relative mx-auto text-center">
          <Quote
            size={28}
            strokeWidth={1}
            className="mx-auto text-[#c9a96e]"
          />

          <blockquote className="about-reveal mx-auto mt-8 max-w-5xl font-display text-4xl leading-[0.95] text-white md:text-7xl">
            “Draw near to God and He will draw near to you. Your productivity
            is dependent on intimacy, and your intimacy depends on how much you
            are ready to meet Him.”
          </blockquote>

          <div className="about-reveal mt-10 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c9a96e]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#ead9ae]">
              Ope Rowland
            </span>
            <span className="h-px w-8 bg-[#c9a96e]" />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                               */}
      {/* ---------------------------------------------------------------- */}

      <section className="relative overflow-hidden pb-32 pt-10 md:pb-48">
        <div className="container-wide mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111] px-7 py-16 text-center md:px-16 md:py-24">
            <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#c9a96e]/10 blur-[100px]" />

            <div className="relative z-10">
              <div className="about-reveal mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10">
                <Target size={18} className="text-[#c9a96e]" />
              </div>

              <p className="eyebrow mt-7">Start Your Journey Today</p>

              <h2 className="about-reveal display-lg mx-auto mt-7 max-w-5xl text-white">
                Discover your ministry.
                <br />
                <span className="gold-gradient-text">
                  Deepen your intimacy.
                </span>
              </h2>

              <p className="about-reveal mx-auto mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                Discover your ministry, deepen your intimacy with God, and
                walk in the calling He has for you.
              </p>

              <div className="about-reveal mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/books"
                  className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#000" }}
                >
                  <BookOpen size={14} />
                  Explore Books
                  <ArrowUpRight size={13} className="arrow-icon" />
                </Link>

                <Link
                  href="/contact"
                  className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
                >
                  Get in Touch
                  <ArrowUpRight size={13} className="arrow-icon" />
                </Link>
              </div>

              <div className="about-reveal mt-10 flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.2em] text-white/20">
                <Check size={12} className="text-[#c9a96e]" />
                Find
                <span className="text-[#c9a96e]">•</span>
                Groom
                <span className="text-[#c9a96e]">•</span>
                Operate
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
