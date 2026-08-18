"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Church,
  Headphones,
  Leaf,
  Play,
  Quote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaAmazon } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* BLOG HELPERS (copied from blog page)                                       */
/* -------------------------------------------------------------------------- */

interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  date: string;        // formatted display date
  rawDate: string;     // original ISO string for sorting
  link: string;
  author: string;
  readTime: string;
  image?: string;
}

function extractImageFromContent(content: string): string | null {
  if (!content) return null;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  const urlMatch = content.match(
    /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg)/i
  );
  if (urlMatch) return urlMatch[0];
  return null;
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return isoString;
  }
}

function parseAtomFeed(xmlText: string): BlogPost[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "text/xml");
  const entries = doc.querySelectorAll("entry");
  const posts: BlogPost[] = [];

  entries.forEach((entry) => {
    const id = entry.querySelector("id")?.textContent || "";
    const title = entry.querySelector("title")?.textContent || "Untitled";
    const contentEl = entry.querySelector("content");
    const content = contentEl?.textContent || "";
    const summaryEl = entry.querySelector("summary");
    const summaryRaw = summaryEl?.textContent || "";
    const published = entry.querySelector("published")?.textContent || "";
    const updated = entry.querySelector("updated")?.textContent || "";
    const linkEl = entry.querySelector('link[rel="alternate"]');
    const link = linkEl?.getAttribute("href") || "";
    const authorEl = entry.querySelector("author name");
    const author = authorEl?.textContent || "Unknown";

    const image = extractImageFromContent(content);

    // Generate clean summary
    let cleanSummary = summaryRaw ? stripHtml(summaryRaw) : "";
    if (!cleanSummary) {
      const textContent = stripHtml(content);
      cleanSummary = textContent.substring(0, 250) + (textContent.length > 250 ? "…" : "");
    }

    // Read time
    const wordCount = stripHtml(content).split(/\s+/).length;
    const readTime = Math.max(1, Math.round(wordCount / 200));

    posts.push({
      id,
      title,
      content,
      summary: cleanSummary,
      date: formatDate(published),
      rawDate: published,
      link,
      author,
      readTime: `${readTime} min read`,
      image: image || undefined,
    });
  });

  return posts;
}

/* -------------------------------------------------------------------------- */
/* BOOKS DATA (unchanged)                                                    */
/* -------------------------------------------------------------------------- */

const books = [
  {
    title: "The Intimate Life",
    image: "https://m.media-amazon.com/images/I/71vr8s6v2AL._SY466_.jpg",
    summary:
      "Discover the power of intimacy with God and unlock the secret to true fruitfulness in your spiritual journey.",
    amazon: "https://www.amazon.com/Intimate-Life-Ope-Rowland/dp/1539904172",
    selar: "https://selar.com/7ej173g173",
  },
  {
    title: "The Young Christian",
    image: "https://m.media-amazon.com/images/I/91yLLF58feL._AC_.jpg",
    summary:
      "A guide for young believers to take root in Christ, grow strong in faith, and win their battles with Satan.",
    amazon: "https://www.amazon.com/Young-Christian-Ope-Rowland/dp/1503032671",
    selar: "https://selar.com/1cho115h17",
  },
  {
    title: "CROSSed",
    image:
      "https://m.media-amazon.com/images/I/41zjtPNfhPL._SY445_SX342_QL70_ML2_.jpg",
    summary:
      "How the Cross Episode affects you — understanding the finished work of Christ.",
    amazon: "https://www.amazon.com/CROSSed-How-Cross-Episode-Affects/dp/1701252511",
    selar: "https://selar.com/7779700h37",
  },
  {
    title: "STRETCHED Beyond Limits",
    image:
      "https://m.media-amazon.com/images/I/51zcGL6w+JL._SY445_SX342_QL70_ML2_.jpg",
    summary:
      "Embracing God's stretching process and discovering the strength that emerges from being pushed beyond comfort.",
    amazon: "https://www.amazon.com/STRETCHED-beyond-limits-Ope-Rowland/dp/1081076380",
    selar: "https://selar.com/b7w187n55j",
  },
  {
    title: "Manifestation",
    image:
      "https://m.media-amazon.com/images/I/51m2GduESEL._SY445_SX342_QL70_ML2_.jpg",
    summary:
      "Bringing divine potential into visible reality through cooperation with the Holy Spirit.",
    amazon: "https://www.amazon.in/Manifestation-Ope-Rowland/dp/152291241X",
    selar: "https://selar.com/14i95753p0",
  },
  {
    title: "OBEDIENCE",
    image: "https://m.media-amazon.com/images/I/81n3KfK73fL._SY466_.jpg",
    summary:
      "OBEDIENCE ...the true act of worship. Discover how surrender unlocks God's favour.",
    amazon: "https://www.amazon.com/OBEDIENCE-true-act-worship-Rowland/dp/109882329X",
    selar: "https://selar.com/d87527krx1",
  },
  {
    title: "I have an IDEA",
    image:
      "https://m.media-amazon.com/images/I/41HSvXIazHL._SY445_SX342_QL70_ML2_.jpg",
    summary:
      "The art of expressing Christian ministries outside the church walls.",
    amazon: "https://www.amazon.com/have-IDEA-Ope-Rowland/dp/1081460350",
    selar: "https://selar.com/32p391g057",
  },
];

/* -------------------------------------------------------------------------- */
/* AUDIO ITEMS (unchanged)                                                    */
/* -------------------------------------------------------------------------- */

const audioItems = [
  {
    title: "Finding Your Ministry",
    category: "Teaching",
    duration: "32:14",
    image:
      "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "The Intimate Life",
    category: "Sermon",
    duration: "41:08",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Fruitfulness & Abiding",
    category: "Teaching",
    duration: "28:46",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=900&q=85",
  },
];

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

function ParallaxImage({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const image = element.querySelector("img");

    if (!image) return;

    const animation = gsap.fromTo(
      image,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          scrub: true,
          start: "top bottom",
          end: "bottom top",
        },
      },
    );

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        className="h-[115%] w-full object-cover"
        unoptimized
      />
    </div>
  );
}

function MagneticText() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });

  const rotateX = useTransform(springY, [-30, 30], [5, -5]);
  const rotateY = useTransform(springX, [-30, 30], [-5, 5]);

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
      className="relative"
    >
      <span className="pointer-events-none absolute -inset-10 rounded-full bg-[#c9a96e]/10 blur-[70px]" />

      <div className="relative">
        <p className="eyebrow mb-6">Author • Pastor • Teacher</p>

        <h1 className="display-xl max-w-[1050px] text-white">
          Helping believers
          <br />
          <span className="gold-gradient-text">find, groom</span>
          <br />
          & operate.
        </h1>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch blog feed
  useEffect(() => {
    const fetchBlogFeed = async () => {
      try {
        const res = await fetch("/api/blog/feed");
        if (!res.ok) throw new Error("Failed to fetch");
        const xml = await res.text();
        const posts = parseAtomFeed(xml);
        setBlogPosts(posts.slice(0, 3)); // only first 3
      } catch (error) {
        console.error("Error fetching blog feed:", error);
        // fallback to empty
        setBlogPosts([]);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogFeed();
  }, []);

  // GSAP and Lenis setup (unchanged)
  useEffect(() => {
    const page = pageRef.current;
    const horizontal = horizontalRef.current;

    if (!page) return;

    let lenis: {
      raf: (time: number) => void;
      destroy?: () => void;
    } | null = null;

    let rafId = 0;

    const init = async () => {
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

    init();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 45, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".line-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      if (horizontal) {
        const getDistance = () =>
          Math.max(0, horizontal.scrollWidth - window.innerWidth);

        gsap.to(horizontal, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".horizontal-story",
            start: "top top",
            end: () => `+=${getDistance() + window.innerHeight * 0.8}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      gsap.to(".hero-orb", {
        y: -180,
        x: 80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-portrait", {
        y: 100,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-copy", {
        y: -90,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
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
      {/* ------------------------------------------------------------------ */}
      {/* HERO — pixel height, responsive portrait visible on all screens    */}
      {/* ------------------------------------------------------------------ */}

      <section className="hero-section relative min-h-[900px] overflow-hidden">
        <div className="absolute inset-0 mesh-bg" />

        <div className="hero-orb absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-[#c9a96e]/10 blur-[120px]" />

        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#070707] to-transparent" />

        <div className="container-wide relative mx-auto flex min-h-[900px] flex-col items-start justify-center gap-8 pb-16 pt-32 lg:flex-row lg:items-center">
          <div className="hero-copy relative z-20 w-full lg:max-w-[78%]">
            <MagneticText />

            <p className="mt-8 max-w-xl text-sm leading-7 text-white/50 md:text-base">
              Discover transformative insights on spiritual growth, intimacy
              with God, and living out your calling through books, talks, and
              teachings that inspire genuine faith.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/books"
                className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: "#000" }}
              >
                Explore the books
                <ArrowUpRight size={14} className="arrow-icon" />
              </Link>

              <Link
                href="/about"
                className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-6 py-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white"
              >
                Discover the story
                <ArrowRight size={14} className="arrow-icon" />
              </Link>
            </div>
          </div>

          {/* Portrait — visible on all screens */}
          <div className="hero-portrait hero-image-wrap relative z-10 mx-auto h-[70vh] max-h-[600px] w-full max-w-[400px] lg:absolute lg:bottom-[-5%] lg:right-[-8%] lg:mx-0 lg:h-[90vh] lg:max-h-none lg:w-[47vw] lg:max-w-[690px]">
            <div className="vignette relative h-full overflow-hidden rounded-[40%_40%_0_0] border border-white/10">
              <Image
                src="/Ope.jpg"
                alt="Ope Rowland portrait"
                fill
                priority
                className="hero-image object-cover object-center"
                unoptimized
              />

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

              <div className="absolute bottom-10 left-10 right-10">
                <p className="text-[9px] uppercase tracking-[0.25em] text-[#ead9ae]">
                  Ope Rowland
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.25em] text-white/25" />

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
              className="hidden items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/30 md:flex"
            >
              Scroll to explore
              <ArrowDown size={14} />
            </motion.div>

            <span className="text-[9px] uppercase tracking-[0.25em] text-white/25" />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MISSION (unchanged)                                                */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative py-28 md:py-44">
        <div className="container-wide mx-auto">
          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <div className="reveal">
              <span className="eyebrow">The Mission</span>

              <div className="mt-10 hidden lg:block">
                <div className="pulse-glow h-20 w-20 rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/5" />
                <div className="ml-10 mt-[-25px] h-px w-28 bg-gradient-to-r from-[#c9a96e] to-transparent" />
              </div>
            </div>

            <div>
              <h2 className="reveal display-md max-w-5xl text-balance text-white">
                Believing in the{" "}
                <span className="gold-gradient-text">ministry</span> of every
                saint.
              </h2>

              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <p className="reveal text-sm leading-8 text-white/50 md:text-base">
                  Every believer has a divine calling and purpose. Through
                  writings, teachings, and inspiration, I help Christians
                  discover their unique ministries, develop their spiritual
                  gifts, and walk confidently in the authority God has given
                  them.
                </p>

                <p className="reveal text-sm leading-8 text-white/50 md:text-base">
                  The journey to fruitfulness begins with intimacy with God.
                  When we take root in Christ and draw near to Him, we unlock
                  the transformative power that enables us to fulfill our
                  God-given destinies.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-1 border-y border-white/10 sm:grid-cols-3">
                {[
                  {
                    icon: BookOpen,
                    title: "Published Author",
                  },
                  {
                    icon: Church,
                    title: "Lead Pastor, MIV Word House",
                  },
                  {
                    icon: Leaf,
                    title: "National Youth Pastor, MIV",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group border-b border-white/10 px-2 py-7 last:border-0 sm:border-b-0 sm:border-r sm:px-6 sm:last:border-r-0"
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.4}
                        className="text-[#c9a96e] transition-transform duration-500 group-hover:-translate-y-1"
                      />
                      <p className="mt-5 max-w-[160px] text-[10px] font-semibold uppercase leading-5 tracking-[0.14em] text-white/55">
                        {item.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SCROLL STORY / HORIZONTAL (unchanged)                              */}
      {/* ------------------------------------------------------------------ */}

      <section className="horizontal-story relative h-screen overflow-hidden border-y border-white/10 bg-[#090909]">
        <div
          ref={horizontalRef}
          className="horizontal-track flex h-full items-center gap-5 px-[6vw]"
        >
          <article className="story-panel relative flex h-[72vh] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] p-8 md:p-12">
            <div className="absolute inset-0 opacity-30">
              <ParallaxImage
                src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=85"
                alt="Church interior"
                className="absolute inset-0 h-full"
              />
            </div>

            <div className="relative z-10">
              <span className="eyebrow">01 — Find</span>
            </div>

            <div className="relative z-10 max-w-2xl">
              <p className="font-display text-5xl leading-[0.9] text-white md:text-7xl">
                Discover what God has already placed inside you.
              </p>
            </div>
          </article>

          <article className="story-panel flex h-[72vh] flex-col justify-between rounded-[2rem] border border-white/10 bg-[#15120e] p-8 md:p-12">
            <div>
              <span className="eyebrow">02 — Groom</span>
            </div>

            <div className="max-w-2xl">
              <p className="font-display text-5xl leading-[0.9] text-white md:text-7xl">
                Calling needs character. Gifts need formation.
              </p>

              <p className="mt-8 max-w-md text-sm leading-7 text-white/45">
                The hidden seasons of obedience, learning, surrender and
                discipline prepare us for the visible expression of ministry.
              </p>
            </div>
          </article>

          <article className="story-panel relative flex h-[72vh] flex-col justify-between overflow-hidden rounded-[2rem] border border-[#c9a96e]/20 bg-[#c9a96e] p-8 md:p-12">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/30 blur-[100px]" />

            <div className="relative">
              <span className="eyebrow !text-black">03 — Operate</span>
            </div>

            <div className="relative max-w-2xl">
              <p className="font-display text-5xl leading-[0.9] text-black md:text-7xl">
                Take what is inside and make it useful to the world.
              </p>

              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-black px-5 py-3 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
              >
                Learn the philosophy
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* BOOKS (unchanged)                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative py-28 md:py-40">
        <div className="container-wide mx-auto">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <span className="eyebrow reveal">Latest Works</span>
              <h2 className="reveal display-lg mt-7 text-white">
                Books for the
                <br />
                <span className="gold-gradient-text">journey.</span>
              </h2>
            </div>

            <Link
              href="/books"
              className="magnetic-button glass inline-flex w-fit items-center gap-3 rounded-full px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
            >
              View all books
              <ArrowUpRight size={14} className="arrow-icon" />
            </Link>
          </div>

          <div className="mt-16">
            <Swiper
              modules={[Pagination, Autoplay, FreeMode]}
              pagination={{ clickable: true }}
              freeMode
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              spaceBetween={18}
              slidesPerView={1.15}
              breakpoints={{
                640: {
                  slidesPerView: 2.1,
                },
                1024: {
                  slidesPerView: 3.2,
                },
                1280: {
                  slidesPerView: 4.1,
                },
              }}
              className="books-swiper !pb-16"
            >
              {books.map((book, index) => (
                <SwiperSlide key={book.title}>
                  <article className="book-card group">
                    <div className="glass-card rounded-[2rem] p-4">
                      <div className="book-cover relative aspect-[0.72] overflow-hidden rounded-[1.35rem] bg-[#181818]">
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw"
                          className="object-cover"
                          unoptimized
                        />

                        <div className="absolute left-4 top-4 flex h-8 min-w-8 items-center justify-center rounded-full bg-black/50 px-2 text-[9px] font-bold text-white backdrop-blur-md">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
                      </div>

                      <div className="relative z-10 px-2 pb-2 pt-5">
                        <h3 className="font-display text-2xl text-white">
                          {book.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-xs leading-6 text-white/40">
                          {book.summary}
                        </p>

                        <div className="mt-5 flex gap-2">
                          <a
                            href={book.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-3 py-2.5 text-[8px] font-bold uppercase tracking-[0.13em]"
                            style={{ color: "#000" }}
                          >
                            <FaAmazon size={12} />
                            Amazon
                          </a>

                          <a
                            href={book.selar}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-1 items-center justify-center rounded-full border border-white/10 px-3 py-2.5 text-[8px] font-bold uppercase tracking-[0.13em] text-white/70 transition-colors hover:border-[#c9a96e]/50 hover:text-[#ead9ae]"
                          >
                            Selar
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* QUOTE (unchanged)                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden py-32 md:py-48">
        <div className="absolute inset-0 mesh-gold opacity-50" />

        <div className="container-standard relative mx-auto text-center">
          <Quote className="mx-auto text-[#c9a96e]" size={28} strokeWidth={1} />

          <blockquote className="reveal mx-auto mt-8 max-w-5xl font-display text-4xl leading-[0.95] text-white md:text-7xl">
            “Fruitfulness ends when intimacy ends. Your productivity is
            dependent on intimacy, and your intimacy depends on how much you
            are ready to meet Him.”
          </blockquote>

          <p className="mt-10 text-[10px] font-bold uppercase tracking-[0.22em] text-[#ead9ae]">
            — Ope Rowland
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* BLOG — NOW DYNAMIC                                                 */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative py-28 md:py-40">
        <div className="container-wide mx-auto">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <span className="eyebrow reveal">From the Journal</span>
              <h2 className="reveal display-md mt-6 text-white">
                Thoughts for
                <br />
                <span className="gold-gradient-text">the journey.</span>
              </h2>
            </div>

            <Link
              href="/blog"
              className="magnetic-button inline-flex w-fit items-center gap-3 rounded-full border border-white/15 px-5 py-3.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
            >
              Read the blog
              <ArrowUpRight size={14} className="arrow-icon" />
            </Link>
          </div>

          {loadingBlogs ? (
            <div className="mt-16 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a96e] border-t-transparent" />
            </div>
          ) : (
            <div className="mt-16 grid gap-5 lg:grid-cols-3">
              {blogPosts.length > 0 ? (
                blogPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={post.link || "/blog"}
                    target={post.link ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`glass-card group overflow-hidden rounded-[2rem] ${
                      index === 0 ? "lg:translate-y-8" : ""
                    }`}
                  >
                    <div className="relative aspect-[1.15] overflow-hidden">
                      <Image
                        src={
                          post.image ||
                          "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=85"
                        }
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        unoptimized
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    </div>

                    <div className="p-6">
                      <h3 className="font-display text-3xl leading-none text-white">
                        {post.title}
                      </h3>

                      <p className="mt-4 text-xs leading-6 text-white/40 line-clamp-3">
                        {post.summary}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-white/40 transition-colors group-hover:text-[#ead9ae]">
                        {post.date}
                        <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-3 text-center text-sm text-white/40">
                  No blog posts available at the moment.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* AUDIO (unchanged)                                                  */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative border-y border-white/10 bg-[#0a0a0a] py-24 md:py-32">
        <div className="container-wide mx-auto">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="eyebrow">Listen</span>

              <h2 className="display-md mt-7 text-white">
                Teachings for
                <br />
                <span className="gold-gradient-text">your headphones.</span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/40">
                Take the teaching with you. Browse sermons, conversations and
                practical ministry resources built around intimacy, growth and
                purpose.
              </p>

              <Link
                href="/audio"
                className="magnetic-button mt-8 inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#000" }}
              >
                Browse audio
                <Headphones size={14} className="arrow-icon" />
              </Link>
            </div>

            <div className="space-y-3">
              {audioItems.map((audio) => (
                <Link
                  href="/audio"
                  key={audio.title}
                  className="group glass flex items-center gap-4 rounded-[1.5rem] p-3 transition-all duration-500 hover:-translate-x-2 hover:border-[#c9a96e]/25 md:p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={audio.image}
                      alt={audio.title}
                      fill
                      className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                      unoptimized
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                        <Play size={11} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-[#c9a96e]">
                      <span>{audio.category}</span>
                      <span className="h-1 w-1 rounded-full bg-white/20" />
                      <span className="text-white/25">{audio.duration}</span>
                    </div>

                    <h3 className="truncate font-display text-2xl text-white">
                      {audio.title}
                    </h3>
                  </div>

                  <ArrowRight
                    size={17}
                    className="mr-2 shrink-0 text-white/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#c9a96e]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA (unchanged)                                                    */}
      {/* ------------------------------------------------------------------ */}

      <section className="relative overflow-hidden py-28 md:py-44">
        <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a96e]/10 blur-[130px]" />

        <div className="container-standard relative mx-auto text-center">
          <div className="reveal">
            <Leaf
              size={24}
              strokeWidth={1}
              className="mx-auto text-[#c9a96e]"
            />

            <p className="eyebrow mt-7">Ready to grow?</p>

            <h2 className="display-lg mx-auto mt-7 max-w-5xl text-white">
              Your calling deserves
              <br />
              <span className="gold-gradient-text">expression.</span>
            </h2>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
              Connect with transformative teachings and resources designed to
              help you fulfill your calling.
            </p>

            <Link
              href="/contact"
              className="magnetic-button mt-9 inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#000" }}
            >
              Get in touch
              <ArrowUpRight size={14} className="arrow-icon" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
