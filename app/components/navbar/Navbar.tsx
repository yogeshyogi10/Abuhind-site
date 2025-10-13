"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blogs", label: "Blogs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const linkBase =
    "px-3 py-2 text-sm font-semibold tracking-tight text-[#0f2a73] hover:opacity-80";
  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* grid keeps center links centered */}
        <div className="flex items-center justify-between py-3 lg:grid lg:grid-cols-3 lg:py-3">
          {/* Left: logo */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo/abuhind-logo.png"
                alt="Abu Hind"
                width={360}
                height={180}
                // Larger on mobile now
                className="h-12 w-auto sm:h-14 lg:h-12"
                priority
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 220px"
              />
            </Link>
          </div>

          {/* Center: nav links (desktop) */}
          <nav aria-label="Primary" className="hidden lg:flex items-center justify-center">
            <ul className="flex items-center gap-8">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`${linkBase} ${
                      isActive(href) && href !== "/" ? "underline underline-offset-4" : ""
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: hamburger (mobile) / spacer (desktop) */}
          <div className="flex items-center justify-end lg:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
              className="inline-flex items-center rounded-md p-2 text-[#0f2a73] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0f2a73]/30"
            >
              {!open ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          {/* spacer on desktop keeps center truly centered */}
          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Mobile menu panel — unchanged */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile menu" className="border-t border-slate-200 bg-white">
          <ul className="mx-auto max-w-6xl px-4 sm:px-6 py-2">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block ${linkBase}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
