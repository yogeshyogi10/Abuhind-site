"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WhySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const labelRef = useRef<HTMLParagraphElement | null>(null); // "Why Abu Hind?"
  const headingRef = useRef<HTMLHeadingElement | null>(null); // H2
  const paraRef = useRef<HTMLParagraphElement | null>(null);  // paragraph
  const ctaRef = useRef<HTMLAnchorElement | null>(null);      // button

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    const h2 = headingRef.current;
    const p = paraRef.current;
    const cta = ctaRef.current;
    if (!section || !bg || !label || !h2 || !p || !cta) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split text into word spans while preserving inner markup (colors)
    const splitWordsPreserveChildren = (root: HTMLElement): HTMLElement[] => {
      if ((root as any).__splitDone) {
        // return existing words if already split (StrictMode-safe)
        return Array.from(
          root.querySelectorAll(
            ":scope span.inline-block.will-change-transform"
          )
        ) as HTMLElement[];
      }
      const words: HTMLElement[] = [];
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          const parts = text.split(/(\s+)/); // keep spaces
          const frag = document.createDocumentFragment();
          parts.forEach((t) => {
            if (t.trim() === "") {
              frag.appendChild(document.createTextNode(t));
            } else {
              const s = document.createElement("span");
              s.textContent = t;
              s.className = "inline-block will-change-transform";
              frag.appendChild(s);
              words.push(s);
            }
          });
          node.parentNode?.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // keep this element (classes, colors) and process its children
          Array.from(node.childNodes).forEach(processNode);
        }
      };
      Array.from(root.childNodes).forEach(processNode);
      (root as any).__splitDone = true;
      return words;
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([bg, label, h2, p, cta], { clearProps: "all" });
        return;
      }

      // Prepare word arrays (preserve span colors in label)
      const labelWords = splitWordsPreserveChildren(label);
      const hWords = splitWordsPreserveChildren(h2);
      const pWords = splitWordsPreserveChildren(p);

      // Initial states + reset helper
      const setInitial = () => {
        gsap.set(bg, { autoAlpha: 0 }); // background fade
        gsap.set(labelWords, { y: 18, autoAlpha: 0 });
        gsap.set(hWords, { y: 18, autoAlpha: 0 });
        gsap.set(pWords, { y: 16, autoAlpha: 0 });
        gsap.set(cta, { scale: 0.85, autoAlpha: 0, transformOrigin: "50% 50%" });
      };
      setInitial();

      // Master timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
      tl.to(bg, { autoAlpha: 1, duration: 0.8 }) // background fade-in
        // label ("Why Abu Hind?") word-by-word
        .to(
          labelWords,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.58,
            stagger: 0.05,
          },
          "-=0.35"
        )
        // heading words
        .to(
          hWords,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.04,
          },
          "-=0.25"
        )
        // paragraph words
        .to(
          pWords,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.012,
          },
          "-=0.18"
        )
        // button grow
        .to(
          cta,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.6)",
          },
          "-=0.05"
        );

      // Replay on downward scroll; reset when scrolling back above
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        onEnter: () => tl.play(0),
        onEnterBack: () => {}, // ignore upward re-entry
        onLeaveBack: () => {
          tl.pause(0);
          setInitial();
        },
        invalidateOnRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="blogs" className="relative isolate sm:-mt-25 lg:-mt-55 z-10 overflow-hidden">
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <Image
          src="/assets/images/field.webp"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Blue overlay (tint) */}
        <div className="absolute inset-0 bg-blue-600/45" />
        {/* Bottom darkening for readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <p ref={labelRef} className="text-lg font-semibold">
          <span className="text-blue-900">Why</span>{" "}
          <span className="text-yellow-300">Abu Hind?</span>
        </p>

        <h2
          ref={headingRef}
          className="mt-2 text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#E8B01D]"
        >
          A Tradition of Purity and Premium Quality
        </h2>

        <p ref={paraRef} className="mt-4 text-slate-100/90 leading-7 sm:text-lg">
          Choosing Abu Hind means selecting rice renowned for its exceptional purity,
          superior grain quality, and unmatched freshness. Each grain is carefully
          cultivated to meet the highest standards of aroma, texture, and taste,
          delivering an authentic sensory experience. Rooted in a royal legacy and
          Indian heritage, Abu Hind rice promises consistent excellence, bringing to your
          kitchen not only centuries of tradition but also rice that cooks to perfection,
          enriching every meal with its fragrant and delicate flavor.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            ref={ctaRef}
            href="#"
            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-10 py-3 text-sm font-semibold text-slate-100 shadow-md hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 will-change-transform"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}
