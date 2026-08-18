"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaBloggerB,
  FaWordpress,
  FaSoundcloud,
  FaSpotify,
  FaTelegram,
} from "react-icons/fa";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Books", href: "/books" },
  { label: "Audio", href: "/audio" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/operowland",
    icon: FaFacebookF,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/operowland",
    icon: FaTwitter,
  },
  {
    label: "Blogger",
    href: "http://operowland.blogspot.com",
    icon: FaBloggerB,
  },
  {
    label: "WordPress",
    href: "https://operowland.wordpress.com",
    icon: FaWordpress,
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/operowland",
    icon: FaSoundcloud,
  },
  {
    label: "Spotify",
    href: "https://open.spotify.com/show/1gC7m8RniOjRX1IiXGbBKu",
    icon: FaSpotify,
  },
  {
    label: "Telegram",
    href: "https://t.me/thrive_operowland2",
    icon: FaTelegram,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">
      <div className="pointer-events-none absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-[#c9a96e]/[0.04] blur-[120px]" />

      <div className="container-wide relative mx-auto py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_0.8fr]">
          <div>
            <span className="eyebrow">The Ministry</span>

            <h2 className="display-md mt-6 max-w-3xl text-white">
              Find your calling.
              <br />
              <span className="gold-gradient-text">Walk in it.</span>
            </h2>

            <p className="mt-7 max-w-xl text-sm leading-7 text-white/45 md:text-base">
              Resources, books, teachings and conversations designed to help
              believers grow in intimacy with God and confidently express the
              ministry placed inside them.
            </p>

            <Link
              href="/contact"
              className="magnetic-button mt-8 inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white"
            >
              Start a conversation
              <ArrowUpRight size={14} className="arrow-icon" />
            </Link>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]">
              Explore
            </p>

            <div className="flex flex-col">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between border-b border-white/8 py-3.5 text-sm text-white/50 transition-colors hover:text-white"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a96e]">
              Connect
            </p>

            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@operowland.com"
                className="glass group flex items-center gap-3 rounded-2xl p-4 text-xs text-white/50 transition-colors hover:text-white"
              >
                <Mail size={16} className="text-[#c9a96e]" />
                <span>Get in touch</span>
              </a>

              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="glass flex h-11 w-11 items-center justify-center rounded-full text-white/45 transition-all hover:-translate-y-1 hover:text-[#c9a96e]"
                    >
                      <Icon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-6">
          <div className="flex flex-col justify-between gap-4 text-[9px] uppercase tracking-[0.17em] text-white/25 sm:flex-row">
            <span>© {new Date().getFullYear()} Ope Rowland</span>
            <span>Find • Groom • Operate</span>
          </div>
        </div>
      </div>
    </footer>
  );
}