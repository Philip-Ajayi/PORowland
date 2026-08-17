import Link from "next/link";
import { AtSign, Flame, Send, X } from "lucide-react";

/* ── Custom X (Twitter) icon ──────────────────────────── */
export const XBrandIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.59l5.25 6.93 6.06-6.93Zm-1.29 19.49h2.04L6.49 3.24H4.3l13.31 17.4Z" />
  </svg>
);

/* ── Social links ──────────────────────────────────────── */
export const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/mivwordhouse", Icon: X },
  { label: "Instagram", href: "https://instagram.com/mivwordhouse", Icon: X },
  { label: "YouTube", href: "https://youtube.com/@mivwordhouse", Icon: X },
  { label: "Threads", href: "https://threads.net/@mivwordhouse", Icon: AtSign },
  { label: "X", href: "https://x.com/mivwordhouse", Icon: XBrandIcon },
  { label: "Telegram", href: "https://t.me/mivwordhouse", Icon: Send },
  { label: "Spotify", href: "https://open.spotify.com/@mivwordhouse", Icon: X },
];

/* ── Logo component ────────────────────────────────────── */
export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-fuchsia-500 to-gold shadow-lg shadow-primary/40">
        <Flame className="relative z-10 h-6 w-6 text-white" fill="currentColor" />
        <span className="absolute inset-0 translate-y-full bg-white/25 transition-transform duration-500 group-hover:translate-y-0" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-extrabold tracking-wide">
          MIV <span className="text-gradient">WORD HOUSE</span>
        </span>
        <span className="block text-[9px] font-semibold uppercase tracking-[0.24em] text-white/50">
          Men of Issachar Vision Inc.
        </span>
      </span>
    </Link>
  );
}