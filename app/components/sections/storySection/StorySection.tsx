"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  title?: string;
  para1?: string;
  para2?: string;
  para3?: string;
  para4?: string;
  rightImageSrc?: string;
  leftPatternSrc?: string;
  bottomPatternSrc?: string;
};

export default function StorySection({
  title = "Where Every Grain Tells a Story",
  para1 = `From India’s lush fields to homes and hotels across the GCC, Europe, and beyond, Abu Hind continues to represent India’s mastery in rice cultivation and culinary excellence.`,
  para2 = `Each grain that bears our name embodies purity, passion, and perfection — connecting Indian heritage with international taste.`,
  para3 = `For importers, retailers, and families alike, Abu Hind stands for one enduring promise:`,
  para4 = `The Royal Taste of India — Delivered to the World.`,
  rightImageSrc = "/assets/images/rice-heap.webp",
  leftPatternSrc = "/assets/images/bg-logo.png",
  bottomPatternSrc = "/assets/pattern/Group-pattern.png",
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const p1Ref = useRef<HTMLParagraphElement | null>(null);
  const p2Ref = useRef<HTMLParagraphElement | null>(null);
  const p3Ref = useRef<HTMLParagraphElement | null>(null);
  const p4Ref = useRef<HTMLParagraphElement | null>(null);
  const rightImgWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const h2 = titleRef.current!;
    const p1 = p1Ref.current!;
    const p2 = p2Ref.current!;
    const p3 = p3Ref.current!;
    const p4 = p4Ref.current!;
    const imgWrap = rightImgWrapRef.current!;
    if (!section || !h2 || !p1 || !p2 || !p3 || !p4 || !imgWrap) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
        gsap.set([h2, p1, p2, p3, p4, imgWrap], { clearProps: "all" });
        return;
      }

      const h2Words = splitWords(h2);
      const p1Words = splitWords(p1);
      const p2Words = splitWords(p2);
      const p3Words = splitWords(p3);
      const p4Words = splitWords(p4);

      gsap.set([h2Words, p1Words, p2Words, p3Words, p4Words].flat(), { y: 8, autoAlpha: 0 });

      // animate the actual <img>
      const imgEl = imgWrap.querySelector("img") as HTMLImageElement | null;
      if (imgEl) {
        gsap.set(imgEl, {
          autoAlpha: 0,
          y: 12,
          filter: "blur(6px)",
          willChange: "opacity, transform, filter",
        });
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

      // SLOWER image (duration ↑)
      if (imgEl) {
        tl.to(
          imgEl,
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.6,         // was 0.9 → slower dissolve
            ease: "power1.out",
          },
          0.02
        );
      }

      // FASTER text (durations & staggers ↓)
      tl.to(h2Words, { y: 0, autoAlpha: 1, duration: 0.10, stagger: 0.010 }, 0.10)
        .to(p1Words, { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.015 }, "+=0.03")
        .to(p2Words, { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.015 }, "+=0.03")
        .to(p3Words, { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.015 }, "+=0.03")
        .to(p4Words, { y: 0, autoAlpha: 1, duration: 0.18, stagger: 0.015 }, "+=0.03");

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          gsap.set([h2Words, p1Words, p2Words, p3Words, p4Words].flat(), { y: 8, autoAlpha: 0 });
          if (imgEl) gsap.set(imgEl, { autoAlpha: 0, y: 12, filter: "blur(6px)" });
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
        <div>
          <h2 ref={titleRef} className="relative text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#011D6E]">
            {title}
          </h2>
          <p ref={p1Ref} className="relative mt-5 text-sm sm:text-base leading-7 text-[#011D6E] font-poppins font-semibold">{para1}</p>
          <p ref={p2Ref} className="relative mt-0 text-sm sm:text-base leading-7 text-[#011D6E] font-semibold">{para2}</p>
          <p ref={p3Ref} className="relative mt-0 text-sm sm:text-base leading-7 text-[#011D6E] font-semibold">{para3}</p>
          <p ref={p4Ref} className="relative mt-0 text-sm lg:text-xl sm:text-base leading-7 text-[#011D6E] font-extrabold font-poppins">{para4}</p>
        </div>

        {/* Right image (size unchanged) */}
        <div ref={rightImgWrapRef} className="flex items-center justify-center md:translate-x-3 lg:translate-x-0 lg:justify-end">
          <Image
            src={rightImageSrc}
            alt="Rice and wheat"
            width={640}
            height={460}
            className="h-auto w-[88%] max-w-[520px] object-contain origin-center scale-[1.15] sm:scale-[1.25] lg:scale-[1.75] md:-mr-0 mt-20 [backface-visibility:hidden]"
            priority={false}
          />
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative mt-5 h-16 sm:h-12 lg:h-20 overflow-hidden md:-mt-5 lg:mt-30">
        <div
          className="absolute inset-0 story-marquee"
          style={{ backgroundImage: `url(${bottomPatternSrc})`, backgroundRepeat: "repeat-x", backgroundSize: "auto 100%" }}
        />
        <div className="pointer-events-none absolute inset-x-0 -top-3 h-3 bg-gradient-to-b from-white to-transparent " />
      </div>

      <style jsx global>{`
        @keyframes story-marquee-x { 0% { background-position-x: 0; } 100% { background-position-x: 100%; } }
        .story-marquee { animation: story-marquee-x 20s linear infinite; }
      `}</style>
    </section>
  );
}
