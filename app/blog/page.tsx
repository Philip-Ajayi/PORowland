"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Feather,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
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

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

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

    // Generate clean summary: use summary if available, else truncate content
    let cleanSummary = summaryRaw ? stripHtml(summaryRaw) : "";
    if (!cleanSummary) {
      const textContent = stripHtml(content);
      cleanSummary = textContent.substring(0, 250) + (textContent.length > 250 ? "…" : "");
    }

    // Read time: ~200 words per minute
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
/* COMPONENT: BlogImage                                                       */
/* -------------------------------------------------------------------------- */

function BlogImage({
  post,
  priority = false,
  className = "",
}: {
  post: BlogPost;
  priority?: boolean;
  className?: string;
}) {
  const imageSrc = post.image || "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=85";

  return (
    <div className={`relative overflow-hidden bg-[#111] ${className}`}>
      <Image
        src={imageSrc}
        alt={post.title}
        fill
        priority={priority}
        unoptimized
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[#c9a96e]/10 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: Reading Modal                                                   */
/* -------------------------------------------------------------------------- */

function ReadingModal({
  post,
  isOpen,
  onClose,
}: {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!post) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d0d] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between p-4 md:p-6 border-b border-white/10">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm md:text-lg text-white truncate">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-[8px] uppercase tracking-[0.15em] text-white/30">
                  <span>{post.date}</span>
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                  <span>{post.readTime}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 ml-4 p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            {/* Scrollable content – duplicate image removed */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 prose prose-invert prose-sm md:prose-base max-w-none text-white">
              <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="blog-content"
              />
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-end p-4 md:p-6 border-t border-white/10">
              <span className="text-[8px] uppercase tracking-[0.15em] text-white/20">
                {post.date}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT: Reveal                                                          */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`blog-reveal ${className}`}>{children}</div>;
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const feedUrl = "/api/blog/feed";

  // Fetch feed
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await fetch(feedUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        const posts = parseAtomFeed(xmlText);
        setAllPosts(posts);
        setDisplayedPosts(posts.slice(0, POSTS_PER_PAGE));
        setHasMore(posts.length > POSTS_PER_PAGE);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blog feed:", err);
        setError("Failed to load blog posts. Please try again later.");
        setAllPosts([]);
        setDisplayedPosts([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setLoadingMore(true);
          setTimeout(() => {
            const nextCount = Math.min(
              visibleCount + POSTS_PER_PAGE,
              allPosts.length
            );
            setVisibleCount(nextCount);
            setDisplayedPosts(allPosts.slice(0, nextCount));
            setHasMore(nextCount < allPosts.length);
            setLoadingMore(false);
          }, 400);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, visibleCount, allPosts]);

  // GSAP animations
  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let lenis: { raf: (time: number) => void; destroy?: () => void } | null = null;
    let rafId = 0;

    const initLenis = async () => {
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

    initLenis();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".blog-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 55 },
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
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".blog-card").forEach((element, index) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 60, rotateX: 7 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            delay: (index % 3) * 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              once: true,
            },
          }
        );
      });

      gsap.to(".blog-hero-orb", {
        x: 150,
        y: -120,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".blog-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".blog-hero-image", {
        y: 100,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".blog-hero",
          start: "top top",
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

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  return (
    <div ref={pageRef} className="overflow-hidden bg-[#070707] text-white">
      {/* ================================================================== */}
      {/* HERO — pixel height, featured image visible on all screens          */}
      {/* ================================================================== */}

      <section className="blog-hero relative min-h-[900px] overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-80" />
        <div className="blog-hero-orb absolute -right-48 top-10 h-[600px] w-[600px] rounded-full bg-[#c9a96e]/10 blur-[150px]" />

        <div className="container-wide relative mx-auto grid min-h-[900px] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1fr_0.9fr]">
          <div className="relative z-10">
            <Reveal>
              <h1 className="display-xl mt-7 max-w-5xl text-white">
                Ideas for
                <br />
                <span className="gold-gradient-text">deeper living.</span>
              </h1>
            </Reveal>
            <Reveal>
              <p className="mt-8 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                Reflections, teachings, and practical insights to help you
                grow in intimacy with God, discover your ministry, and live
                with purpose.
              </p>
            </Reveal>
            <Reveal className="mt-9 flex flex-wrap gap-3">
              <a
                href="#articles"
                className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#000" }}
              >
                Explore articles
                <ArrowDown size={14} />
              </a>
              <Link
                href="/contact"
                className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
              >
                Connect
                <ArrowUpRight size={13} />
              </Link>
            </Reveal>
            <Reveal className="mt-12 flex items-center gap-4">
              <Feather size={15} className="text-[#c9a96e]" />
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                Faith • Ministry • Growth • Purpose
              </span>
            </Reveal>
          </div>

          {/* Featured image — now visible on all screens */}
          <div className="relative block min-h-[400px] lg:min-h-[580px]">
            {allPosts.length > 0 && (
              <div className="mx-auto relative h-[400px] w-[300px] rotate-3 rounded-[2rem] border border-white/10 bg-white/[0.02] p-3 backdrop-blur-xl sm:h-[480px] sm:w-[380px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:mx-0">
                <div className="blog-hero-image group relative h-full overflow-hidden rounded-[1.5rem]">
                  <BlogImage post={allPosts[0]} priority className="absolute inset-0 h-full w-full" />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.16em] text-white/60">
                      <span>{allPosts[0].date}</span>
                      <span className="h-1 w-1 rounded-full bg-[#c9a96e]" />
                      <span>{allPosts[0].readTime}</span>
                    </div>
                    <h2 className="mt-3 font-display text-3xl leading-tight text-white">
                      {allPosts[0].title}
                    </h2>
                    <button
                      onClick={() => openPost(allPosts[0])}
                      className="mt-4 inline-flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#c9a96e] hover:text-[#ead9ae] transition-colors"
                    >
                      Read full article
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0">
          <div className="container-wide mx-auto flex justify-between text-[8px] uppercase tracking-[0.24em] text-white/20">
            <span>Read • Reflect • Become</span>
            {allPosts.length > 0 && <span>{allPosts.length} articles</span>}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* INTRO                                                               */}
      {/* ================================================================== */}

      <section className="relative py-28 md:py-40">
        <div className="container-wide mx-auto grid gap-12 lg:grid-cols-[0.55fr_1.45fr] lg:gap-24">
          <Reveal>
            <span className="eyebrow">The Journal</span>
            <div className="mt-10 hidden lg:block">
              <div className="h-24 w-24 rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/5" />
              <div className="ml-12 mt-[-45px] h-px w-36 bg-gradient-to-r from-[#c9a96e] to-transparent" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="display-md max-w-5xl text-white">
                Thoughts that invite you
                <br />
                <span className="gold-gradient-text">to go deeper.</span>
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-8 max-w-2xl text-sm leading-8 text-white/40 md:text-base">
                Explore teachings around spiritual growth, intimacy with God,
                ministry, Christian living, leadership, and the practical
                realities of following Christ.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURED SWIPER — two-column grid from tablet up, stacked on mobile */}
      {/* ================================================================== */}

      {allPosts.length > 0 && (
        <section className="relative border-y border-white/10 bg-[#0a0a0a] py-24 md:py-32">
          <div className="container-wide mx-auto">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <span className="eyebrow">Featured</span>
                <h2 className="display-sm mt-5 text-white">
                  Start <span className="gold-gradient-text">here.</span>
                </h2>
              </div>
              <span className="hidden text-[8px] uppercase tracking-[0.2em] text-white/20 md:block">
                Swipe through featured teachings
              </span>
            </div>

            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop
              spaceBetween={24}
              className="featured-blog-swiper"
            >
              {allPosts.slice(0, 4).map((post) => (
                <SwiperSlide key={post.id}>
                  <article className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] md:grid-cols-[1.05fr_0.95fr]">
                    <div
                      className="group relative min-h-[300px] overflow-hidden md:min-h-[500px] cursor-pointer"
                      onClick={() => openPost(post)}
                    >
                      <BlogImage post={post} className="absolute inset-0 h-full w-full" />
                      <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                        Featured
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-7 md:p-12 lg:p-16">
                      <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.16em] text-white/25">
                        <span className="text-[#c9a96e]">Article</span>
                        <span className="h-1 w-1 rounded-full bg-white/20" />
                        <span>{post.date}</span>
                      </div>
                      <h3 className="mt-6 font-display text-4xl leading-[0.98] text-white md:text-5xl">
                        {post.title}
                      </h3>
                      <p className="mt-6 max-w-xl text-sm leading-8 text-white/40">
                        {post.summary}
                      </p>
                      <div className="mt-8 flex items-center gap-4">
                        <button
                          onClick={() => openPost(post)}
                          className="magnetic-button inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[9px] font-bold uppercase tracking-[0.16em]"
                          style={{ color: "#000" }}
                        >
                          Read full article
                          <ArrowRight size={14} />
                        </button>
                        <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.15em] text-white/25">
                          <Clock3 size={13} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* BLOG COLLECTION (no filter)                                        */}
      {/* ================================================================== */}

      <section id="articles" className="relative py-24 md:py-36">
        <div className="container-wide mx-auto">
          <Reveal>
            <span className="eyebrow">All Articles</span>
            <h2 className="display-md mt-5 text-white">
              Read. <span className="gold-gradient-text">Learn. Grow.</span>
            </h2>
          </Reveal>

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="h-8 w-8 animate-spin text-[#c9a96e]" />
            </div>
          ) : error ? (
            <div className="py-20 text-center">
              <p className="text-sm text-white/40">{error}</p>
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {displayedPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 25, scale: 0.98 }}
                      transition={{ duration: 0.45, delay: index * 0.04 }}
                      className="blog-card group cursor-pointer"
                      onClick={() => openPost(post)}
                    >
                      <div className="block">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#111]">
                          <BlogImage post={post} className="absolute inset-0 h-full w-full" />
                          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-2 backdrop-blur-xl">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
                            <span className="text-[7px] font-bold uppercase tracking-[0.15em] text-white/70">
                              Article
                            </span>
                          </div>
                          <div className="absolute bottom-5 right-5 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <ArrowUpRight size={15} />
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.15em] text-white/25">
                            <span>{post.date}</span>
                            <span className="h-1 w-1 rounded-full bg-white/15" />
                            <span>{post.readTime}</span>
                          </div>
                          <h3 className="mt-4 font-display text-2xl leading-tight text-white transition-colors duration-300 group-hover:text-[#ead9ae] md:text-3xl">
                            {post.title}
                          </h3>
                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/35">
                            {post.summary}
                          </p>
                          <div className="mt-6 inline-flex items-center gap-2 border-b border-white/10 pb-2 text-[8px] font-bold uppercase tracking-[0.17em] text-white/50 transition-colors group-hover:border-[#c9a96e]/50 group-hover:text-[#ead9ae]">
                            Read full article
                            <ArrowRight
                              size={12}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>

              {displayedPosts.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-sm text-white/30">No articles found.</p>
                </div>
              )}

              {/* Lazy loading trigger */}
              {hasMore && displayedPosts.length < allPosts.length && (
                <div ref={loadMoreRef} className="mt-16 flex justify-center py-8">
                  {loadingMore ? (
                    <Loader2 className="h-6 w-6 animate-spin text-[#c9a96e]" />
                  ) : (
                    <button
                      onClick={() => {
                        setLoadingMore(true);
                        setTimeout(() => {
                          const nextCount = Math.min(
                            visibleCount + POSTS_PER_PAGE,
                            allPosts.length
                          );
                          setVisibleCount(nextCount);
                          setDisplayedPosts(allPosts.slice(0, nextCount));
                          setHasMore(nextCount < allPosts.length);
                          setLoadingMore(false);
                        }, 400);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-[8px] font-bold uppercase tracking-[0.16em] text-white/60 hover:border-white/30 hover:text-white transition-colors"
                    >
                      Load more
                      <ChevronDown size={14} />
                    </button>
                  )}
                </div>
              )}

              {!hasMore && allPosts.length > POSTS_PER_PAGE && (
                <div className="mt-16 text-center text-[8px] uppercase tracking-[0.2em] text-white/20">
                  — You've reached the end —
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ================================================================== */}
      {/* SCROLL STORY / PHILOSOPHY                                          */}
      {/* ================================================================== */}

      <section className="relative py-24 md:py-40">
        <div className="container-wide mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0d0d0d]">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c9a96e]/10 blur-[110px]" />
            <div className="grid gap-12 p-8 md:p-14 lg:grid-cols-[0.8fr_1.2fr] lg:p-20">
              <Reveal>
                <p className="eyebrow">A recurring truth</p>
                <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/10">
                  <Feather size={23} className="text-[#c9a96e]" />
                </div>
              </Reveal>
              <Reveal>
                <p className="font-display text-3xl leading-tight text-white md:text-5xl">
                  “Draw near to God and He will draw near to you. Your
                  productivity is dependent on intimacy, and your intimacy
                  depends on how much you are ready to meet Him.”
                </p>
                <div className="mt-8 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#c9a96e]" />
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#ead9ae]">
                    Ope Rowland
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA                                                                 */}
      {/* ================================================================== */}

      <section className="pb-32 md:pb-48">
        <div className="container-wide mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111] px-7 py-20 text-center md:px-16">
            <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-[#c9a96e]/10 blur-[110px]" />
            <div className="relative z-10">
              <Reveal>
                <p className="eyebrow">Keep Going Deeper</p>
                <h2 className="display-lg mx-auto mt-7 max-w-5xl text-white">
                  Your next
                  <br />
                  <span className="gold-gradient-text">insight awaits.</span>
                </h2>
                <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                  Explore the books, listen to teachings, or connect directly
                  for more ministry resources.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/books"
                    className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: "#000" }}
                  >
                    Explore Books
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/audio"
                    className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
                  >
                    Listen to Audio
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* READING MODAL                                                       */}
      {/* ================================================================== */}

      <ReadingModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
      />

      {/* ================================================================== */}
      {/* STYLES                                                              */}
      {/* ================================================================== */}

      <style jsx global>{`
        /* Utility classes */
        .container-wide {
          max-width: 1280px;
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
        @media (min-width: 768px) {
          .container-wide {
            padding-left: 3rem;
            padding-right: 3rem;
          }
        }
        .display-xl {
          font-size: clamp(2.8rem, 8vw, 5.5rem);
          font-weight: 600;
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .display-lg {
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 600;
          line-height: 1.08;
          letter-spacing: -0.02em;
        }
        .display-md {
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .display-sm {
          font-size: clamp(1.6rem, 3vw, 2.4rem);
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .gold-gradient-text {
          background: linear-gradient(135deg, #c9a96e 0%, #e8d5a3 50%, #c9a96e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .eyebrow {
          display: inline-block;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.3);
          padding: 0.25rem 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.03);
        }
        .glass {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .mesh-bg {
          background-image:
            radial-gradient(circle at 20% 30%, rgba(201, 169, 110, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(201, 169, 110, 0.03) 0%, transparent 40%);
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Blog content styling for modal – light text */
        .blog-content {
          color: #e0e0e0;
          font-size: 0.95rem;
          line-height: 1.8;
        }
        .blog-content p {
          margin-bottom: 1.2rem;
        }
        .blog-content h2,
        .blog-content h3,
        .blog-content h4 {
          color: #fff;
          font-weight: 600;
          margin-top: 1.8rem;
          margin-bottom: 0.8rem;
        }
        .blog-content h2 {
          font-size: 1.4rem;
        }
        .blog-content h3 {
          font-size: 1.2rem;
        }
        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0 1.2rem 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.4rem;
        }
        .blog-content a {
          color: #c9a96e;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .blog-content a:hover {
          color: #ead9ae;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 1.5rem 0;
        }
        .blog-content blockquote {
          border-left: 3px solid #c9a96e;
          padding-left: 1.2rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Force light text and transparent backgrounds for feed content */
        .blog-content,
        .blog-content * {
          color: #e0e0e0 !important;
          background: transparent !important;
          text-shadow: none !important;
        }

        .blog-content a {
          color: #c9a96e !important;
          text-decoration: underline !important;
          text-underline-offset: 2px;
        }

        .blog-content a:hover {
          color: #ead9ae !important;
        }

        .blog-content strong,
        .blog-content b {
          color: #ffffff !important;
        }

        .blog-content pre,
        .blog-content code {
          background: rgba(255, 255, 255, 0.08) !important;
          color: #e0e0e0 !important;
        }

        .blog-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.75rem;
        }

        /* Swiper overrides */
        .featured-blog-swiper .swiper-wrapper {
          padding-bottom: 8px;
        }
        .featured-blog-swiper .swiper-slide {
          height: auto;
        }

        /* Magnetic button hover */
        .magnetic-button {
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .magnetic-button:hover {
          transform: scale(1.04);
        }
      `}</style>
    </div>
  );
}
