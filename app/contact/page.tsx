"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Mic2,
  Quote,
  Send,
} from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How can I purchase your books?",
    answer:
      'All books are available on Amazon in paperback and Kindle formats. Search for "Ope Rowland" on Amazon, or visit the Books page for direct links.',
  },
  {
    question: "Are your books available internationally?",
    answer:
      "Yes. The published works are available through Amazon and other distribution channels, depending on the title and region.",
  },
  {
    question: "Where can I listen to Grenecast?",
    answer:
      "Explore the Audio section of this website for available teachings, talks, and inspirational content.",
  },
  {
    question: "Do you do speaking engagements?",
    answer:
      "Yes. Speaking requests for conferences, church gatherings, youth meetings, leadership events, and other ministry engagements can be submitted through the contact form.",
  },
  {
    question: "How often is new content published?",
    answer:
      "New teachings, articles, and media are published as they become available. Follow the Blog and Audio sections for new releases.",
  },
  {
    question: "Can I share the content?",
    answer:
      "Yes. You are welcome to share links to the original content. Please preserve the author's attribution and avoid presenting the material as your own.",
  },
];

const contactTopics = [
  "Book Inquiry",
  "Speaking Engagement",
  "Ministry Question",
  "Share Testimony",
  "General Inquiry",
  "Other",
];

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);

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
      gsap.utils.toArray<HTMLElement>(".contact-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 55,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.95,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".contact-card").forEach((el, i) => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 45,
            rotateX: 5,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.9,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      gsap.to(".contact-orb-one", {
        x: 180,
        y: -100,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".contact-orb-two", {
        x: -140,
        y: 130,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".contact-portrait", {
        y: 90,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".contact-hero",
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSent(true);

    window.setTimeout(() => {
      setSent(false);
    }, 6000);
  };

  return (
    <main
      ref={pageRef}
      className="overflow-hidden bg-[#070707] text-white"
    >
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}

      <section className="contact-hero relative min-h-[90svh] overflow-hidden">
        <div className="absolute inset-0 mesh-bg opacity-80" />

        <div className="contact-orb-one absolute -right-48 top-0 h-[600px] w-[600px] rounded-full bg-[#c9a96e]/10 blur-[150px]" />

        <div className="contact-orb-two absolute -left-64 bottom-0 h-[500px] w-[500px] rounded-full bg-white/[0.025] blur-[130px]" />

        <div className="container-wide relative mx-auto grid min-h-[90svh] items-center gap-16 pb-20 pt-32 lg:grid-cols-[1.05fr_.75fr]">
          <div className="relative z-10">
            {/* Removed the "Contact / Connect" line and "Get in Touch" eyebrow */}

            <h1 className="contact-reveal display-xl mt-7 max-w-5xl">
              Let&apos;s start a
              <br />
              <span className="gold-gradient-text">conversation.</span>
            </h1>

            <p className="contact-reveal mt-8 max-w-xl text-base leading-8 text-white/45 md:text-lg">
              Have questions? Want to connect? Whether you want to ask
              about a book, invite Ope to speak, or simply share your
              testimony, I&apos;d love to hear from you.
            </p>

            <a
              href="#contact-form"
              className="contact-reveal magnetic-button mt-9 inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "#000" }} // ensure black text on light background
            >
              Send a message
              <ArrowDown size={14} />
            </a>
          </div>

          {/* Portrait / visual */}
          <div className="relative hidden min-h-[560px] lg:block">
            <div className="absolute right-0 top-1/2 h-[500px] w-[400px] -translate-y-1/2 rotate-3 rounded-[2rem] border border-white/10 bg-white/[0.02] p-3 backdrop-blur-xl">
              <div className="contact-portrait relative h-full overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/Ope.jpg"
                  alt="Ope Rowland"
                  fill
                  priority
                  sizes="400px"
                  className="object-cover object-top"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="text-[8px] uppercase tracking-[0.2em] text-[#ead9ae]">
                    Pastor / Author / Teacher
                  </span>

                  <h2 className="mt-3 font-display text-4xl">
                    Ope Rowland
                  </h2>

                  <p className="mt-2 max-w-xs text-xs leading-6 text-white/45">
                    Helping believers find, groom and operate in their
                    ministries.
                  </p>
                </div>
              </div>
            </div>

            {/* Removed the "Open to meaningful conversations" floating card */}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* MARQUEE (REMOVED)                                                */}
      {/* ================================================================ */}

      {/* ================================================================ */}
      {/* FORM + DETAILS                                                    */}
      {/* ================================================================ */}

      <section id="contact-form" className="relative py-28 md:py-40">
        <div className="container-wide mx-auto grid gap-16 lg:grid-cols-[1fr_.48fr] lg:gap-24">
          {/* Form */}
          <div>
            <div className="contact-reveal">
              <span className="eyebrow">Send a Message</span>

              <h2 className="display-md mt-6">
                Tell me
                <br />
                <span className="gold-gradient-text">what&apos;s on your heart.</span>
              </h2>

              <p className="mt-7 max-w-2xl text-sm leading-8 text-white/40">
                Whether you have questions about the books, want to invite
                Ope to speak, or simply want to share your testimony,
                please reach out.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  className="mt-12 rounded-[2rem] border border-[#c9a96e]/20 bg-[#c9a96e]/[0.05] p-8 md:p-10"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#c9a96e]/10 text-[#ead9ae]">
                    <Check size={22} />
                  </div>

                  <h3 className="mt-7 font-display text-3xl">
                    Message prepared.
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-7 text-white/40">
                    Thank you for reaching out. Your message has been
                    received.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-7 text-[9px] font-bold uppercase tracking-[0.18em] text-[#ead9ae]"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="mt-12 space-y-7"
                >
                  <div className="grid gap-7 md:grid-cols-2">
                    <Field
                      label="Full Name"
                      name="name"
                      placeholder="Your full name"
                      required
                    />

                    <Field
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="grid gap-7 md:grid-cols-2">
                    <Field
                      label="Subject"
                      name="subject"
                      placeholder="What is this about?"
                      required
                    />

                    <div>
                      <label
                        htmlFor="topic"
                        className="mb-3 block text-[8px] font-bold uppercase tracking-[0.2em] text-white/30"
                      >
                        Select a topic
                      </label>

                      <div className="relative">
                        <select
                          id="topic"
                          name="topic"
                          defaultValue=""
                          className="w-full appearance-none rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm text-white outline-none transition-colors focus:border-[#c9a96e]/50"
                        >
                          <option
                            value=""
                            disabled
                            className="bg-[#0b0b0b]"
                          >
                            Choose a topic
                          </option>

                          {contactTopics.map((topic) => (
                            <option
                              key={topic}
                              value={topic}
                              className="bg-[#0b0b0b]"
                            >
                              {topic}
                            </option>
                          ))}
                        </select>

                        <ChevronDown
                          size={15}
                          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-3 block text-[8px] font-bold uppercase tracking-[0.2em] text-white/30"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={7}
                      required
                      placeholder="Write your message..."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-5 text-sm leading-7 text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em] transition-transform hover:scale-[1.03]"
                    style={{ color: "#000" }} // ensure black text on light background
                  >
                    Send Message
                    <Send size={13} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Contact information */}
          <aside className="lg:pt-16">
            <div className="contact-card glass rounded-[2rem] p-7 md:p-8">
              {/* Removed the "Pastor Ope Rowland" eyebrow line */}

              <h3 className="mt-6 font-display text-3xl">
                Let&apos;s connect.
              </h3>

              <p className="mt-4 text-sm leading-7 text-white/40">
                For general inquiries, books, media, ministry questions,
                and speaking engagements.
              </p>

              <div className="mt-8 space-y-3">
                <ContactLink
                  icon={<Mail size={16} />}
                  label="Email"
                  description="For general inquiries and book questions"
                  href="mailto:info@operowland.gt.tc"
                />

                <ContactLink
                  icon={<BookOpen size={16} />}
                  label="Books"
                  description="Explore the published works"
                  href="/books"
                />

                <ContactLink
                  icon={<Mic2 size={16} />}
                  label="Speaking"
                  description="Available for conferences and events"
                  href="#contact-form"
                />

                <ContactLink
                  icon={<MessageCircle size={16} />}
                  label="Media"
                  description="Listen to talks and read articles"
                  href="/audio"
                />

                <ContactLink
                  icon={<FaTelegram size={16} />}
                  label="Telegram"
                  description="Join the Thrive Telegram community"
                  href="https://t.me/thrive_operowland2"
                  external
                />
              </div>
            </div>

            <div className="contact-card mt-5 rounded-[2rem] border border-white/10 bg-white/[0.02] p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c9a96e]/10 text-[#ead9ae]">
                  <Clock3 size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/50">
                    Speaking & Ministry
                  </p>

                  <p className="mt-2 text-xs leading-6 text-white/30">
                    For invitations and ministry engagements, please
                    include your event date, location, audience, and
                    purpose in your message.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FAQ                                                               */}
      {/* ================================================================ */}

      <section className="border-y border-white/10 bg-[#0a0a0a] py-28 md:py-40">
        <div className="container-wide mx-auto grid gap-16 lg:grid-cols-[.65fr_1.35fr] lg:gap-24">
          <div className="contact-reveal">
            <span className="eyebrow">Common Questions</span>

            <h2 className="display-md mt-6">
              Frequently
              <br />
              <span className="gold-gradient-text">
                asked.
              </span>
            </h2>

            <p className="mt-7 max-w-md text-sm leading-7 text-white/35">
              A few answers to common questions about books, media,
              speaking engagements, and the ministry.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <motion.div
                  layout
                  key={faq.question}
                  className={`contact-card overflow-hidden rounded-2xl border transition-colors ${
                    isOpen
                      ? "border-[#c9a96e]/20 bg-[#c9a96e]/[0.035]"
                      : "border-white/10 bg-white/[0.015]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-7"
                  >
                    <span className="flex items-center gap-5">
                      <span className="font-mono text-[9px] text-[#c9a96e]/60">
                        0{index + 1}
                      </span>

                      <span className="text-sm font-medium text-white/80">
                        {faq.question}
                      </span>
                    </span>

                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="shrink-0 text-white/30"
                    >
                      <ArrowRight size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.35,
                          ease: "easeOut",
                        }}
                      >
                        <p className="max-w-2xl px-6 pb-7 pl-[4.15rem] text-sm leading-7 text-white/35 md:px-7 md:pl-[4.7rem]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* QUOTE                                                             */}
      {/* ================================================================ */}

      <section className="relative py-32 md:py-48">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9a96e]/[0.04] blur-[130px]" />

        <div className="container-narrow relative mx-auto text-center">
          <Quote
            size={22}
            className="contact-reveal mx-auto text-[#c9a96e]/60"
          />

          <blockquote className="contact-reveal mt-8 font-display text-3xl leading-[1.2] text-white/85 md:text-5xl lg:text-6xl">
            &ldquo;I believe in the ministry of every saint. Hence, I
            talk and write about believers finding, grooming and
            operating in their ministries.&rdquo;
          </blockquote>

          <p className="contact-reveal mt-8 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c9a96e]">
            — Ope Rowland
          </p>
        </div>
      </section>

      {/* ================================================================ */}
      {/* FINAL CTA                                                         */}
      {/* ================================================================ */}

      <section className="pb-32 md:pb-48">
        <div className="container-wide mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111] px-7 py-20 text-center md:px-16">
            <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c9a96e]/10 blur-[120px]" />

            <div className="relative z-10">
              <span className="contact-reveal eyebrow">
                Begin Your Journey
              </span>

              <h2 className="contact-reveal display-lg mx-auto mt-7 max-w-5xl">
                Grow in intimacy.
                <br />
                <span className="gold-gradient-text">
                  Walk in your calling.
                </span>
              </h2>

              <p className="contact-reveal mx-auto mt-7 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                Explore the resources available to help you grow in
                intimacy with God and walk confidently in your calling.
              </p>

              <div className="contact-reveal mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/books"
                  className="magnetic-button inline-flex items-center gap-3 rounded-full bg-[#f2ede1] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#000" }} // ensure black text on light background
                >
                  Browse Books
                  <BookOpen size={14} />
                </Link>

                <Link
                  href="/audio"
                  className="magnetic-button glass inline-flex items-center gap-3 rounded-full px-7 py-4 text-[9px] font-bold uppercase tracking-[0.18em]"
                >
                  Browse Audio
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* FIELD                                                                      */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block text-[8px] font-bold uppercase tracking-[0.2em] text-white/30"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-[#c9a96e]/50"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CONTACT LINK                                                               */
/* -------------------------------------------------------------------------- */

function ContactLink({
  icon,
  label,
  description,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.015] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.04]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a96e]/10 text-[#ead9ae] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">
          {label}
        </span>

        <span className="mt-1 block text-[11px] leading-5 text-white/25">
          {description}
        </span>
      </span>

      <ArrowUpRight
        size={14}
        className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#ead9ae]"
      />
    </a>
  );
}