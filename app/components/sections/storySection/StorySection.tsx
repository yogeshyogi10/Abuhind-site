"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  title?: string;
  para1?: string;
  para2?: string;
  rightImageSrc?: string;
  leftPatternSrc?: string;
  bottomPatternSrc?: string;
};

export default function StorySection({
  title = "Where Every Grain Tells a Story",
  para1 = `From rich, fertile fields to your plate, every grain of Abu Hind rice embodies nature’s bounty and human care. Crafted with precision and deep respect for tradition, our rice is nurtured from seed to harvest before being meticulously selected for quality. Each meal made with Abu Hind rice is a testament to heritage, excellence, and the skillful hands that guide its journey.`,
  para2 = `With a legacy that extends beyond borders, Abu Hind rice is exported to homes and kitchens throughout the GCC and worldwide, making it a preferred choice for families and professional chefs seeking authenticity and premium taste. Let every serving tell a story of Indian origin, global connection, and unwavering commitment to quality and tradition.`,
  rightImageSrc = "/assets/images/rice-heap.webp",
  leftPatternSrc = "/assets/images/bg-logo.png",
  bottomPatternSrc = "/assets/pattern/Group-pattern.png",
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const p1Ref = useRef<HTMLParagraphElement | null>(null);
  const p2Ref = useRef<HTMLParagraphElement | null>(null);
  const rightImgWrapRef = useRef<HTMLDivElement | null>(null);

  // Grain overlay refs
  const titleGrainRef = useRef<SVGSVGElement | null>(null);
  const p1GrainRef = useRef<SVGSVGElement | null>(null);
  const p2GrainRef = useRef<SVGSVGElement | null>(null);

  // Unique IDs for SVG filters (avoid collisions if component reused)
  const gid = useId();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const h2 = titleRef.current!;
    const p1 = p1Ref.current!;
    const p2 = p2Ref.current!;
    const rightImgWrap = rightImgWrapRef.current!;
    const gTitle = titleGrainRef.current!;
    const gP1 = p1GrainRef.current!;
    const gP2 = p2GrainRef.current!;
    if (!section || !h2 || !p1 || !p2 || !rightImgWrap || !gTitle || !gP1 || !gP2) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split text into word spans (preserve spaces) — StrictMode-safe.
    const splitWords = (el: HTMLElement): HTMLElement[] => {
      if ((el as any).__splitDone) {
        return Array.from(el.querySelectorAll(":scope span.inline-block.will-change-transform")) as HTMLElement[];
      }
      const text = el.textContent ?? "";
      const parts = text.split(/(\s+)/);
      el.textContent = "";
      const spans: HTMLElement[] = [];
      const frag = document.createDocumentFragment();
      parts.forEach((t) => {
        if (t.trim() === "") {
          frag.appendChild(document.createTextNode(t));
        } else {
          const s = document.createElement("span");
          s.textContent = t;
          s.className = "inline-block will-change-transform";
          frag.appendChild(s);
          spans.push(s);
        }
      });
      el.appendChild(frag);
      (el as any).__splitDone = true;
      return spans;
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([h2, p1, p2, rightImgWrap, gTitle, gP1, gP2], { clearProps: "all" });
        return;
      }

      const h2Words = splitWords(h2);
      const p1Words = splitWords(p1);
      const p2Words = splitWords(p2);

      // Initial states + reset helper
      const setInitial = () => {
        gsap.set(rightImgWrap, { x: 32, autoAlpha: 0, filter: "blur(1px)" });
        gsap.set([...h2Words, ...p1Words, ...p2Words], {
          y: 10,
          autoAlpha: 0,
          filter: "blur(6px)",
          rotateZ: 0.001,
        });
        gsap.set([gTitle, gP1, gP2], { autoAlpha: 0 }); // grain overlay hidden initially
      };
      setInitial();

      // Master timeline (paused; plays on downward entry only)
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      // Image in from right
      tl.to(rightImgWrap, { x: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.7 }, 0);

      // Title dissolve + grain fade-in
      tl.to(
        h2Words,
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.55,
          stagger: { each: 0.035, from: "random" },
        },
        0.05
      ).to(gTitle, { autoAlpha: 0.18, duration: 0.35, ease: "power2.out" }, 0.12);

      // Para1 dissolve + grain
      tl.to(
        p1Words,
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: { each: 0.009, from: "random" },
        },
        0.15
      ).to(gP1, { autoAlpha: 0.14, duration: 0.3, ease: "power2.out" }, 0.2);

      // Para2 dissolve + grain
      tl.to(
        p2Words,
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.5,
          stagger: { each: 0.009, from: "random" },
        },
        0.2
      ).to(gP2, { autoAlpha: 0.14, duration: 0.3, ease: "power2.out" }, 0.25);

      // Play on top→down; reset when scrolling above
      ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        onEnter: () => tl.play(0),
        onEnterBack: () => {}, // ignore bottom→top
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
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* LEFT DECORATIVE IMAGE */}
      <div
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 z-0 w-[40%] max-w-[520px] hidden sm:block opacity-20"
      >
        <div className="relative h-[420px] -ml-35">
          <Image
            src={leftPatternSrc}
            alt=""
            fill
            sizes="(min-width:1024px) 40vw, 50vw"
            className="object-contain object-left"
            priority={false}
          />
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:py-16">
        {/* Left: copy */}
        <div>
          <h2
            ref={titleRef}
            className="relative text-2xl sm:text-3xl font-bold tracking-tight text-[#011D6E] will-change-[transform,opacity,filter]"
          >
            {title}
            {/* Grain overlay for title */}
            <svg
              ref={titleGrainRef}
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-0"
              preserveAspectRatio="none"
            >
              <filter id={`${gid}-grain-title`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter={`url(#${gid}-grain-title)`} />
            </svg>
          </h2>

          <p
            ref={p1Ref}
            className="relative mt-5 text-sm sm:text-base leading-7 text-[#011D6E] will-change-[transform,opacity,filter]"
          >
            {para1}
            {/* Grain overlay for p1 */}
            <svg
              ref={p1GrainRef}
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-0"
              preserveAspectRatio="none"
            >
              <filter id={`${gid}-grain-p1`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter={`url(#${gid}-grain-p1)`} />
            </svg>
          </p>

          <p
            ref={p2Ref}
            className="relative mt-4 text-sm sm:text-base leading-7 text-[#011D6E] will-change-[transform,opacity,filter]"
          >
            {para2}
            {/* Grain overlay for p2 */}
            <svg
              ref={p2GrainRef}
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-0"
              preserveAspectRatio="none"
            >
              <filter id={`${gid}-grain-p2`} x="0" y="0" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.88" numOctaves="2" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter={`url(#${gid}-grain-p2)`} />
            </svg>
          </p>
        </div>

        {/* Right: product image (animates in from right) */}
        <div
          ref={rightImgWrapRef}
          className="flex items-center justify-center lg:justify-end will-change-[transform,opacity,filter]"
        >
          <Image
            src={rightImageSrc}
            alt="Rice and wheat"
            width={640}
            height={460}
            className="h-auto w-[88%] max-w-[520px] object-contain origin-center scale-[1.15] sm:scale-[1.25] lg:scale-[1.35] transition-transform"
            priority={false}
          />
        </div>
      </div>

      {/* bottom repeating pattern strip */}
      <div className="relative h-16 sm:h-12 lg:h-20 mt-30">
        <Image src={bottomPatternSrc} alt="" fill sizes="100vw" className="object-cover" priority={false} />
        <div className="pointer-events-none absolute inset-x-0 -top-3 h-3 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
