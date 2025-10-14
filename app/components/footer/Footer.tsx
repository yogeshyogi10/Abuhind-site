"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [headerH, setHeaderH] = useState(64);

  // Measure sticky header height for correct offset
  useEffect(() => {
    const read = () => {
      const header = document.querySelector("header") as HTMLElement | null;
      setHeaderH(header ? header.offsetHeight : 64);
    };
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const scrollToId = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <footer className="bg-yellow-400 text-slate-900">
      <div className="mx-auto max-w-6xl px-0 sm:px-6 py-0 sm:py-12 lg:py-14 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image
            src="/assets/logo/abuhind-logo.png"
            alt="Abu Hind"
            width={320}
            height={140}
            className="h-auto w-40 sm:w-28 md:w-46 lg:w-64"
            sizes="(min-width:1024px) 16rem, (min-width:768px) 14rem, (min-width:640px) 12rem, 10rem"
            priority
          />
        </div>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-3xl text-xs sm:text-sm leading-6">
          Abu Hind — Bringing the legacy of royal taste to your table. Pure, aromatic, and perfectly
          crafted grains for every meal.
        </p>

        {/* Main nav (anchors) */}
        <nav aria-label="Footer" className="mt-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium">
            <li>
              <Link
                href="#home"
                onClick={(e) => scrollToId(e, "home")}
                className="hover:underline"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                onClick={(e) => scrollToId(e, "about")}
                className="hover:underline"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="#blogs" // your “Crafted from the Best Tea Gardens” section
                onClick={(e) => scrollToId(e, "blogs")}
                className="hover:underline"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="#contact" // your newsletter/contact section
                onClick={(e) => scrollToId(e, "contact")}
                className="hover:underline"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Policies (use real routes or keep as-is) */}
        <div className="mt-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs">
            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            <li><Link href="/cookies" className="hover:underline">Cookies Policy</Link></li>
          </ul>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-xs">
          &copy; {new Date().getFullYear()} Abuhind. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
