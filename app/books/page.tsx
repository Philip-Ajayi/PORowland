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
  BookOpen,
  Check,
  ExternalLink,
  Library,
  Quote,
  X,
} from "lucide-react";
import { FaAmazon } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const AMAZON_PROFILE_URL =
  "https://www.amazon.com/stores/Ope-Rowland/author/B00QCBHNJW?ref=ap_rdr&shoppingPortalEnabled=true";

const books = [
  {
    id: "intimate-life",
    number: "01",
    title: "The Intimate Life",
    subtitle: "Discovering the Secret to True Fruitfulness",
    image:
      "https://m.media-amazon.com/images/I/71vr8s6v2AL._SY466_.jpg",
    description:
      "God has always been interested in fellowship—in intimacy. The first Adam missed it and his intimacy with God was cut off, but the second Adam, Christ, identified intimacy as his secret and said we too can have that intimacy.",
    extended:
      "The person that will get much result in life must be intimate with God. Fruitfulness ends when intimacy ends. Some people's intimacy have ended but they are still seeing little results because withering is a process. Intimacy is a personal thing. Draw near to God and He will draw near to you. Your productivity is dependent on intimacy and your intimacy depends on how much you are ready to meet Him.",
    tags: ["Intimacy with God", "Spiritual Fruitfulness", "Christian Growth"],
    amazon:
      "https://www.amazon.com/Intimate-Life-Ope-Rowland/dp/1539904172",
    selar: "https://selar.com/7ej173g173",
  },
  {
    id: "young-christian",
    number: "02",
    title: "The Young Christian",
    subtitle: "Taking Root in Christ for Victorious Living",
    image:
      "https://m.media-amazon.com/images/I/91yLLF58feL._AC_.jpg",
    description:
      "I am writing to you who are young because you are strong with God's word living in your hearts, and you have won your battle with Satan. (1 John 2:14 NLT)",
    extended:
      "Age and years do not make you young but your state and day to day experiences do. Be that strong believer, with God's word living in your hearts, winning your battle with Satan. The way to bear fruits is to take roots downward. The roots must reach and go beyond the underlying rock. Christ remains our rock. We must keep digging deeper into Christ.",
    tags: ["Young Believers", "Spiritual Strength", "Victory in Christ"],
    amazon:
      "https://www.amazon.com/Young-Christian-Ope-Rowland/dp/1503032671",
    selar: "https://selar.com/1cho115h17",
  },
  {
    id: "crossed",
    number: "03",
    title: "CROSSed",
    subtitle: "How The Cross Episode Affects You",
    image:
      "https://m.media-amazon.com/images/I/41zjtPNfhPL._SY445_SX342_QL70_ML2_.jpg",
    description:
      "Understanding the finished work of Christ and its impact on your life.",
    extended:
      "The Cross is the central event of human history and the foundation of Christian faith. Understanding how the Cross episode affects your life is crucial to walking in the fullness of what Christ accomplished.",
    tags: ["The Cross", "Redemption", "Christian Identity"],
    amazon:
      "https://www.amazon.com/CROSSed-How-Cross-Episode-Affects/dp/1701252511",
    selar: "https://selar.com/7779700h37",
  },
  {
    id: "manifestation",
    number: "04",
    title: "Manifestation",
    subtitle: "Bringing the Invisible into the Visible",
    image:
      "https://m.media-amazon.com/images/I/51m2GduESEL._SY445_SX342_QL70_ML2_.jpg",
    description:
      "Every believer carries within them the seeds of divine potential. Manifestation is about bringing what God has placed within you into visible reality.",
    extended:
      "This book teaches you how to cooperate with the Holy Spirit to manifest the gifts, callings, and purposes that God has ordained for your life. Learn to move from promise to performance, from vision to victory, and from potential to manifestation.",
    tags: ["Divine Purpose", "Spiritual Gifts", "Kingdom Living"],
    amazon:
      "https://www.amazon.in/Manifestation-Ope-Rowland/dp/152291241X",
    selar: "https://selar.com/14i95753p0",
  },
  {
    id: "stretched",
    number: "05",
    title: "STRETCHED Beyond Limits",
    subtitle: "Embracing God's Expansion Process",
    image:
      "https://m.media-amazon.com/images/I/51zcGL6w+JL._SY445_SX342_QL70_ML2_.jpg",
    description:
      "God often takes us beyond our comfort zones and stretches us beyond what we thought possible. This stretching is not punishment—it's preparation.",
    extended:
      "When God stretches you, He's making room for greater capacity, deeper faith, and more significant impact. The uncomfortable process of being stretched is actually the pathway to your next level.",
    tags: ["Spiritual Growth", "Faith Expansion", "Divine Process"],
    amazon:
      "https://www.amazon.com/STRETCHED-beyond-limits-Ope-Rowland/dp/1081076380",
    selar: "https://selar.com/b7w187n55j",
  },
  {
    id: "obedience",
    number: "06",
    title: "OBEDIENCE",
    subtitle: "...the true act of worship",
    image:
      "https://m.media-amazon.com/images/I/81n3KfK73fL._SY466_.jpg",
    description:
      "Discovering how surrender unlocks God's favour and blessing.",
    extended:
      "Obedience is more than following rules—it's the truest expression of worship. When we obey God, we demonstrate our love, trust, and submission to His lordship.",
    tags: ["Obedience", "Worship", "Divine Favor"],
    amazon:
      "https://www.amazon.com/OBEDIENCE-true-act-worship-Rowland/dp/109882329X",
    selar: "https://selar.com/d87527krx1",
  },
  {
    id: "idea",
    number: "07",
    title: "I have an IDEA",
    subtitle:
      "The art of expressing Christian ministries outside the church walls",
    image:
      "https://m.media-amazon.com/images/I/41HSvXIazHL._SY445_SX342_QL70_ML2_.jpg",
    description:
      "Ideas are powerful. They solve problems, create opportunities, and change the world. But where do great ideas come from, and how can believers tap into divine creativity?",
    extended:
      "This book explores the connection between faith and innovation, showing how God gifts His people with creative insights to accomplish His purposes. Discover how to cultivate an environment where inspired ideas can flourish.",
    tags: ["Creativity", "Innovation", "Divine Inspiration"],
    amazon:
      "https://www.amazon.com/have-IDEA-Ope-Rowland/dp/1081460350",
    selar: "https://selar.com/32p391g057",
  },
];

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function BookCover({
  book,
  priority = false,
  className = "",
}: {
  book: (typeof books)[number];
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#141414] shadow-2xl shadow-black/40 ${className}`}
    >
      <Image
        src={book.image}
        alt={book.title}
        fill
        priority={priority}
        unoptimized
        sizes="(max-width: 768px) 70vw, 400px"
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5 opacity-70" />

      <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`books-reveal ${className}`}>{children}</div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function BooksPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [selectedBook, setSelectedBook] = useState<
    (typeof books)[number] | null
  >(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let lenis: {
      raf: (time: number) => void;
      destroy?: () => void;
    } | null = null;

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
      gsap.utils.toArray<HTMLElement>(".books-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 55,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 87%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".book-grid-card").forEach(
        (element, index) => {
          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: 70,
              rotateX: 8,
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 1,
              delay: (index % 3) * 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 88%",
                once: true,
              },
            },
          );
        },
      );

      gsap.to(".books-hero-orb", {
        x: 130,
        y: -160,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".books-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".books-hero-cover", {
        y: 110,
        rotate: -4,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: ".books-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".horizontal-book-word", {
        xPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".horizontal-section",
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

  useEffect(() => {
    document.body.style.overflow = selectedBook ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedBook]);

  return (
    <div ref={pageRef} className="overflow-hidden bg-[#070707] text-white">
      {/* ================================================================== */}
      {/* HERO — pixel height, responsive book composition visible all screens */}
      {/* ================================================================== */}

      <section className="books-hero relative min-h-[900px] overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-90" />

        <div className="books-hero-orb absolute -right-48 top-10 h-[650px] w-[650px] rounded-full bg-[#c9a96e]/10 blur-[150px]" />

        <div className="absolute left-[-15%] top-[40%] h-[400px] w-[400px] rounded-full bg-[#9f7b3e]/5 blur-[120px]" />

        <div className="container-wide relative mx-auto grid min-h-[900px] items-center gap-14 pb-20 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="relative z-10">
            <Reveal>
              <h1 className="display-xl mt-7 max-w-5xl text-white">
                Books that
                <br />
                <span className="gold-gradient-text">shape believers.</span>
              </h1>
            </Reveal>

            <Reveal>
              <p className="mt-8 max-w-xl text-base leading-8 text-white/45 md:text-lg">
                Transformative teachings on intimacy, ministry, spiritual
                growth, and victorious Christian living.
              </p>
            </Reveal>

            <Reveal className="mt-9 flex flex-wrap gap-3">
              <Link
                href="#collection"
                className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#000" }}
              >
                Explore the collection
                <ArrowDown size={14} />
              </Link>

              <a
                href={AMAZON_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
              >
                <FaAmazon size={14} />
                Amazon Author Profile
              </a>
            </Reveal>

            <Reveal className="mt-12 flex items-center gap-5">
              <div className="flex -space-x-2">
                {books.slice(0, 4).map((book) => (
                  <div
                    key={book.id}
                    className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-[#070707]"
                  >
                    <Image
                      src={book.image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                {books.length} published works
              </p>
            </Reveal>
          </div>

          {/* Hero book composition — visible on all screens */}
          <div className="relative flex min-h-[450px] items-center justify-center lg:min-h-[650px]">
            <div className="absolute h-[480px] w-[480px] rounded-full border border-[#c9a96e]/10" />
            <div className="absolute h-[350px] w-[350px] rounded-full border border-[#c9a96e]/10" />

            <div className="books-hero-cover group relative w-[220px] rotate-6 sm:w-[280px]">
              <BookCover book={books[0]} priority className="shadow-[0_50px_100px_rgba(0,0,0,.55)]" />

              <div className="absolute -bottom-8 -left-10 glass rounded-2xl p-5 backdrop-blur-2xl sm:-left-16">
                <p className="text-[8px] uppercase tracking-[0.2em] text-white/30">
                  Featured
                </p>
                <p className="mt-1 max-w-[150px] font-display text-xl leading-tight text-white">
                  The Intimate Life
                </p>
              </div>

              <div className="absolute -right-12 top-16 flex h-16 w-16 items-center justify-center rounded-full border border-[#c9a96e]/30 bg-[#c9a96e]/10 backdrop-blur-xl sm:-right-20">
                <BookOpen size={22} className="text-[#ead9ae]" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between text-[8px] uppercase tracking-[0.24em] text-white/20">
            <span className="hidden md:block">
              Read • Reflect • Become
            </span>
            <span>Ope Rowland</span>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* COLLECTION INTRO                                                    */}
      {/* ================================================================== */}

      <section id="collection" className="relative py-28 md:py-40">
        <div className="container-wide mx-auto">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <Reveal>
              <span className="eyebrow">The Collection</span>

              <div className="mt-10 hidden lg:block">
                <div className="h-28 w-28 rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/5" />

                <div className="ml-14 mt-[-55px] h-px w-40 bg-gradient-to-r from-[#c9a96e] to-transparent" />
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h2 className="display-md text-white">
                  Seven books.
                  <br />
                  <span className="gold-gradient-text">
                    One recurring invitation.
                  </span>
                </h2>
              </Reveal>

              <Reveal>
                <p className="mt-8 max-w-2xl text-sm leading-8 text-white/40 md:text-base">
                  Go deeper. Draw near. Discover your calling. Grow in Christ.
                  Walk in the authority and purpose God has entrusted to you.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURED SWIPER                                                     */}
      {/* ================================================================== */}

      <section className="relative border-y border-white/10 bg-[#0a0a0a] py-24 md:py-32">
        <div className="container-wide mx-auto">
          <div className="mb-12 flex items-end justify-between gap-8">
            <div>
              <span className="eyebrow">Featured Reading</span>
              <h2 className="display-sm mt-5 text-white">
                Start with <span className="gold-gradient-text">intimacy.</span>
              </h2>
            </div>

            <div className="hidden text-right md:block">
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/25">
                Swipe to explore
              </p>
              <div className="mt-3 flex justify-end gap-2">
                <span className="h-px w-8 bg-[#c9a96e]" />
                <span className="h-px w-2 bg-white/10" />
              </div>
            </div>
          </div>

          <Swiper
            modules={[Autoplay, EffectCoverflow, Pagination]}
            effect="coverflow"
            centeredSlides
            slidesPerView={1.15}
            spaceBetween={18}
            loop
            autoplay={{
              delay: 4200,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 130,
              modifier: 1.1,
              slideShadows: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2.2,
              },
              1024: {
                slidesPerView: 3.1,
              },
            }}
            className="books-swiper !overflow-visible"
          >
            {books.map((book) => (
              <SwiperSlide key={book.id}>
                <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] p-5">
                  <div className="relative mx-auto max-w-[260px]">
                    <BookCover book={book} />
                  </div>

                  <div className="p-3 pt-7 text-center">
                    <p className="text-[8px] uppercase tracking-[0.2em] text-[#c9a96e]">
                      {book.number} / {books.length}
                    </p>

                    <h3 className="mt-3 font-display text-2xl text-white">
                      {book.title}
                    </h3>

                    <button
                      onClick={() => setSelectedBook(book)}
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[8px] font-bold uppercase tracking-[0.16em] text-white/50 transition-colors hover:border-[#c9a96e]/40 hover:text-[#ead9ae]"
                    >
                      Read about the book
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FULL BOOK GRID                                                      */}
      {/* ================================================================== */}

      <section className="relative py-24 md:py-36">
        <div className="container-wide mx-auto">
          <div className="mb-16 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <Reveal>
              <span className="eyebrow">Complete Library</span>
              <h2 className="display-md mt-5 max-w-3xl text-white">
                Every title has a{" "}
                <span className="gold-gradient-text">message.</span>
              </h2>
            </Reveal>

            <Reveal>
              <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.2em] text-white/25">
                <Library size={15} className="text-[#c9a96e]" />
                {books.length} publications
              </div>
            </Reveal>
          </div>

          <div className="grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book.id}
                className="book-grid-card group relative"
              >
                <button
                  type="button"
                  onClick={() => setSelectedBook(book)}
                  className="block w-full text-left"
                  aria-label={`View details for ${book.title}`}
                >
                  <div className="relative mx-auto max-w-[320px]">
                    <BookCover book={book} />

                    <div className="absolute inset-0 flex items-end justify-between p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="rounded-full border border-white/15 bg-black/40 px-3 py-2 text-[8px] uppercase tracking-[0.15em] text-white backdrop-blur-xl">
                        View details
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                        <ArrowUpRight size={15} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-7">
                    <div className="flex items-center gap-3">
                      <span className="h-px w-7 bg-white/10" />
                      <span className="text-[8px] uppercase tracking-[0.18em] text-white/25">
                        Ope Rowland
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-3xl leading-[0.95] text-white transition-colors duration-500 group-hover:text-[#ead9ae]">
                      {book.title}
                    </h3>

                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.1em] leading-5 text-white/35">
                      {book.subtitle}
                    </p>

                    <p className="mt-5 line-clamp-3 text-sm leading-7 text-white/35">
                      {book.description}
                    </p>
                  </div>
                </button>

                <div className="mt-6 flex flex-wrap gap-2">
                  {book.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/8 px-3 py-2 text-[7px] uppercase tracking-[0.14em] text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex gap-2">
                  <a
                    href={book.amazon}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-[8px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "#000" }}
                  >
                    <FaAmazon size={12} />
                    Amazon
                  </a>

                  <a
                    href={book.selar}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-[8px] font-bold uppercase tracking-[0.14em] text-white/60 transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a96e]/40 hover:text-[#ead9ae]"
                  >
                    Selar
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* AMAZON PROFILE                                                      */}
      {/* ================================================================== */}

      <section className="relative py-10 md:py-20">
        <div className="container-wide mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111] p-8 md:p-14">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#c9a96e]/10 blur-[100px]" />

            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <Reveal>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a96e]/20 bg-[#c9a96e]/10">
                    <BookOpen size={18} className="text-[#c9a96e]" />
                  </div>

                  <span className="eyebrow">Amazon Author</span>
                </div>

                <h2 className="display-sm mt-6 max-w-3xl text-white">
                  Find Ope Rowland&apos;s{" "}
                  <span className="gold-gradient-text">complete catalogue.</span>
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40">
                  Explore the published works, editions, and available formats
                  through the author profile on Amazon.
                </p>
              </Reveal>

              <a
                href={AMAZON_PROFILE_URL}
                target="_blank"
                rel="noreferrer"
                className="magnetic-button inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "#000" }}
              >
                <FaAmazon size={16} />
                Visit Amazon Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* QUOTE                                                               */}
      {/* ================================================================== */}

      <section className="relative overflow-hidden py-32 md:py-48">
        <div className="absolute inset-0 mesh-gold opacity-60" />

        <div className="container-standard relative mx-auto text-center">
          <Quote
            size={25}
            strokeWidth={1}
            className="mx-auto text-[#c9a96e]"
          />

          <Reveal>
            <blockquote className="mx-auto mt-8 max-w-5xl font-display text-4xl leading-[0.98] text-white md:text-7xl">
              “The quality of this life tremendously outweighs the normal
              life. It is the God kind of life—the Zoë life, which can best be
              described as God living on this planet.”
            </blockquote>
          </Reveal>

          <Reveal className="mt-9 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#c9a96e]" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#ead9ae]">
              From The Young Christian
            </span>
            <span className="h-px w-8 bg-[#c9a96e]" />
          </Reveal>
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
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a96e]/25 bg-[#c9a96e]/10">
                  <Check size={18} className="text-[#c9a96e]" />
                </div>

                <p className="eyebrow mt-7">Transform Your Spiritual Journey</p>

                <h2 className="display-lg mx-auto mt-7 max-w-5xl text-white">
                  There is more to
                  <br />
                  <span className="gold-gradient-text">discover.</span>
                </h2>

                <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                  Each book offers unique insights and practical wisdom for
                  your walk with God.
                </p>

                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/contact"
                    className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: "#000" }}
                  >
                    Connect for More Information
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/audio"
                    className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em] text-white"
                  >
                    Explore Audio
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* BOOK DETAIL MODAL                                                   */}
      {/* ================================================================== */}

      <AnimatePresence>
        {selectedBook && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              aria-label="Close book details"
              className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-xl"
              onClick={() => setSelectedBook(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selectedBook.title}
              className="relative z-10 max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-[#101010] shadow-2xl"
              initial={{
                opacity: 0,
                y: 35,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                onClick={() => setSelectedBook(null)}
                aria-label="Close"
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/60 backdrop-blur-xl transition-colors hover:text-white"
              >
                <X size={17} />
              </button>

              <div className="grid gap-10 p-6 md:grid-cols-[300px_1fr] md:p-10">
                <div>
                  <BookCover
                    book={selectedBook}
                    className="mx-auto max-w-[300px]"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#c9a96e]">
                    {selectedBook.number} / {books.length} · Published Work
                  </p>

                  <h2 className="mt-4 font-display text-4xl leading-none text-white md:text-6xl">
                    {selectedBook.title}
                  </h2>

                  <p className="mt-5 text-xs font-medium uppercase leading-5 tracking-[0.1em] text-white/40">
                    {selectedBook.subtitle}
                  </p>

                  <p className="mt-7 text-sm leading-8 text-white/50">
                    {selectedBook.description}
                  </p>

                  <p className="mt-5 text-sm leading-8 text-white/35">
                    {selectedBook.extended}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {selectedBook.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-2 text-[7px] uppercase tracking-[0.14em] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href={selectedBook.amazon}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-[9px] font-bold uppercase tracking-[0.16em]"
                      style={{ color: "#000" }}
                    >
                      <FaAmazon size={14} />
                      Buy on Amazon
                    </a>

                    <a
                      href={selectedBook.selar}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-white/10 px-6 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white"
                    >
                      Buy on Selar
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
