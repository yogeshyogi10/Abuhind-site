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

  // (optional) unique IDs if you keep overlays later
  const gid = useId();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const h2 = titleRef.current!;
    const p1 = p1Ref.current!;
    const p2 = p2Ref.current!;
    const imgWrap = rightImgWrapRef.current!;
    if (!section || !h2 || !p1 || !p2 || !imgWrap) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split into words once (keeps whitespace)
    const splitWords = (el: HTMLElement) => {
      if ((el as any).__splitDone) {
        return Array.from(el.querySelectorAll<HTMLElement>(":scope span.js-word"));
      }
      const text = el.textContent ?? "";
      const parts = text.match(/\S+|\s+/g) ?? [];
      el.textContent = "";
      const frag = document.createDocumentFragment();
      const spans: HTMLElement[] = [];
      for (const t of parts) {
        if (/^\s+$/.test(t)) {
          frag.appendChild(document.createTextNode(t));
        } else {
          const s = document.createElement("span");
          s.textContent = t;
          s.className = "js-word inline-block align-baseline will-change-[transform,opacity]";
          frag.appendChild(s);
          spans.push(s);
        }
      }
      el.appendChild(frag);
      (el as any).__splitDone = true;
      return spans;
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([h2, p1, p2, imgWrap], { clearProps: "all" });
        return;
      }

      const h2Words = splitWords(h2);
      const p1Words = splitWords(p1);
      const p2Words = splitWords(p2);

      gsap.set([h2Words, p1Words, p2Words].flat(), { y: 8, autoAlpha: 0 });
      gsap.set(imgWrap, { autoAlpha: 0 }); // simple fade only (no transform)

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

      // image fades in as words begin
      tl.to(imgWrap, { autoAlpha: 1, duration: 0.6 }, 0.02);

      // strict left→right word-by-word (no scramble)
      tl.to(h2Words, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04 }, 0.04)
        .to(p1Words, { y: 0, autoAlpha: 1, duration: 0.28, stagger: 0.03 }, "+=0.05")
        .to(p2Words, { y: 0, autoAlpha: 1, duration: 0.28, stagger: 0.03 }, "+=0.05");

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          gsap.set([h2Words, p1Words, p2Words].flat(), { y: 8, autoAlpha: 0 });
          gsap.set(imgWrap, { autoAlpha: 0 });
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
            className="relative text-2xl sm:text-3xl font-bold tracking-tight text-[#011D6E]"
          >
            {title}
          </h2>

          <p
            ref={p1Ref}
            className="relative mt-5 text-sm sm:text-base leading-7 text-[#011D6E]"
          >
            {para1}
          </p>

          <p
            ref={p2Ref}
            className="relative mt-4 text-sm sm:text-base leading-7 text-[#011D6E]"
          >
            {para2}
          </p>
        </div>

        {/* Right: product image — nudged right on tablet */}
        <div
          ref={rightImgWrapRef}
          className="flex items-center justify-center md:translate-x-3 lg:translate-x-0 lg:justify-end"
        >
          <Image
            src={rightImageSrc}
            alt="Rice and wheat"
            width={640}
            height={460}
            className="h-auto w-[88%] max-w-[520px] object-contain origin-center scale-[1.15] sm:scale-[1.25] lg:scale-[1.35] md:-mr-0"
            priority={false}
          />
        </div>
      </div>

      {/* Bottom pattern: continuous left→right loop */}
      <div className="relative mt-5 h-16 sm:h-12 lg:h-20 overflow-hidden md:-mt-5 lg:mt-30">
        <div
          className="absolute inset-0 story-marquee"
          style={{
            backgroundImage: `url(${bottomPatternSrc})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: "auto 100%",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 -top-3 h-3 bg-gradient-to-b from-white to-transparent " />
      </div>

      {/* Marquee animation styles */}
      <style jsx global>{`
        @keyframes story-marquee-x {
          0% { background-position-x: 0; }
          100% { background-position-x: 100%; }
        }
        .story-marquee {
          animation: story-marquee-x 20s linear infinite;
        }
      `}</style>
    </section>
  );
}
