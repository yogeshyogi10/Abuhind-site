"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type NavItem = { id: string; label: string };

const NAV_LINKS: NavItem[] = [
  { id: "home",   label: "Home" },
  { id: "about",  label: "About" },
  { id: "blogs",  label: "Blogs" },   // ← point this to the “Crafted from the Best Tea Gardens” section
  { id: "contact",label: "Contact" }, // ← point this to your newsletter/contact section
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [headerH, setHeaderH] = useState<number>(64);

  // Measure header height (for correct offset)
  useEffect(() => {
    const header = document.querySelector("header");
    const read = () => setHeaderH(header ? (header as HTMLElement).offsetHeight : 64);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  // Smooth-scroll with header offset
  const onNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8; // tiny extra spacing
    window.scrollTo({ top, behavior: "smooth" });
    setOpen(false);
  };

  // Scroll spy (highlights the current link)
  useEffect(() => {
    const sections = NAV_LINKS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible/closest one
        const visible = entries
          .filter((en) => en.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveId(visible.target.id);
      },
      {
        // Top margin pushes the observer line below the sticky header
        root: null,
        rootMargin: `-${headerH + 10}px 0px -60% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [headerH]);

  const linkBase =
    "px-3 py-2 text-sm font-semibold tracking-tight text-[#0f2a73] hover:opacity-80";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* grid keeps center links centered */}
        <div className="flex items-center justify-between py-3 lg:grid lg:grid-cols-3 lg:py-3">
          {/* Left: logo pulled to the edge */}
          <div className="flex items-center justify-start">
            <Link href="#home" onClick={(e) => onNavClick(e as any, "home")} className="flex items-center gap-2 -ml-4 sm:-ml-6">
              <Image
                src="/assets/logo/abuhind-logo.png"
                alt="Abu Hind"
                width={860}
                height={180}
                className="h-12 w-auto sm:h-14 lg:h-12"
                priority
                sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 220px"
              />
            </Link>
          </div>

          {/* Center: nav links (desktop) */}
          <nav aria-label="Primary" className="hidden lg:flex items-center justify-center">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={(e) => onNavClick(e, id)}
                    className={`${linkBase} ${activeId === id && id !== "home" ? "underline underline-offset-4" : ""}`}
                  >
                    {label}
                  </a>
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

      {/* Mobile menu panel */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav aria-label="Mobile menu" className="border-t border-slate-200 bg-white">
          <ul className="mx-auto max-w-6xl px-4 sm:px-6 py-2">
            {NAV_LINKS.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => onNavClick(e, id)}
                  className={`block ${linkBase}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
