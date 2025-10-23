"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef   = useRef<HTMLElement | null>(null);
  const bowlWrapRef  = useRef<HTMLDivElement | null>(null);

  const contentRef   = useRef<HTMLDivElement | null>(null);
  const hSubRef      = useRef<HTMLHeadingElement | null>(null);
  const hMainRef     = useRef<HTMLHeadingElement | null>(null);
  const p1Ref        = useRef<HTMLParagraphElement | null>(null);
  const p2Ref        = useRef<HTMLParagraphElement | null>(null);
  // const ctaRef    = useRef<HTMLButtonElement | null>(null); // optional, currently unused

  useEffect(() => {
    const section  = sectionRef.current;
    const bowl     = bowlWrapRef.current;
    const hSub     = hSubRef.current;
    const hMain    = hMainRef.current;
    const p1       = p1Ref.current;
    const p2       = p2Ref.current;

    if (!section || !bowl || !hSub || !hMain || !p1 || !p2) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split an element's text content into word <span>s, preserving spaces.
    const splitWords = (el: HTMLElement) => {
      if ((el as any).__splitDone) {
        return Array.from(
          el.querySelectorAll<HTMLElement>(":scope span.__word")
        );
      }
      const txt = el.textContent ?? "";
      const parts = txt.match(/\S+|\s+/g) ?? [];
      el.textContent = "";
      const frag = document.createDocumentFragment();
      const words: HTMLElement[] = [];
      for (const piece of parts) {
        if (/^\s+$/.test(piece)) {
          frag.appendChild(document.createTextNode(piece));
        } else {
          const s = document.createElement("span");
          s.textContent = piece;
          s.className = "__word inline-block will-change-transform";
          frag.appendChild(s);
          words.push(s);
        }
      }
      el.appendChild(frag);
      (el as any).__splitDone = true;
      return words;
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([section, bowl, hSub, hMain, p1, p2], { clearProps: "all" });
        return;
      }

      const subWords  = splitWords(hSub);
      const mainWords = splitWords(hMain);
      const p1Words   = splitWords(p1);
      const p2Words   = splitWords(p2);

      gsap.set(section, { opacity: 0 });
      gsap.set(bowl, { opacity: 0, filter: "blur(8px)", scale: 1.04, willChange: "opacity,filter,transform" });

      gsap.set([subWords, mainWords, p1Words, p2Words].flat(), {
        x: -18,
        autoAlpha: 0,
        willChange: "transform,opacity",
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(section, { opacity: 1, duration: 0.3 }, 0);
      tl.to(bowl, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 0.9,
        clearProps: "filter",
        force3D: true,
      }, 0.05);

      tl.to(subWords,  { x: 0, autoAlpha: 1, duration: 0.42, stagger: 0.035 }, 0.15)
        .to(mainWords, { x: 0, autoAlpha: 1, duration: 0.46, stagger: 0.035 }, 0.28)
        .to(p1Words,   { x: 0, autoAlpha: 1, duration: 0.38, stagger: 0.012 }, 0.42)
        .to(p2Words,   { x: 0, autoAlpha: 1, duration: 0.38, stagger: 0.010 }, 0.50);

      const float = gsap.to(bowl, {
        y: "+=8",
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        force3D: true,
      });

      return () => {
        tl.kill();
        float.kill();
      };
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative w-full min-h-[90vh] flex items-stretch lg:items-center justify-center bg-[#011D6EE5] overflow-hidden"
    >
      {/* Moving pattern */}
      <div
        className="absolute inset-0 z-0 bg-[url('/assets/pattern/bg-pattern.png')] bg-repeat bg-[length:2000px_1000px] bg-anim"
        aria-hidden
      />

      {/* Image layer */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none lg:static lg:z-auto lg:flex-shrink-0 lg:w-96 lg:h-96"
      >
        <div
          ref={bowlWrapRef}
          className="relative w-[26rem] h-[26rem] sm:w-[26rem] sm:h-[26rem] md:w-[30rem] md:h-[30rem] lg:w-56 lg:h-56 overflow-visible will-change-transform lg:ml-60"
        >
          <Image
            src="/assets/images/rice-bowl.webp"
            alt="Rice bowl"
            width={600}
            height={600}
            className="w-full h-full object-contain scale-[2] sm:scale-[2.5] md:scale-[3.2] lg:scale-[7.7] lg:-mr-80 -translate-y-3 md:-translate-y-5 lg:-translate-y-[25px] opacity-60 md:opacity-100 [backface-visibility:hidden] transition-transform"
            priority
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full px-6 lg:mr-[7.5rem] flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-12 pt-8 pb-20 lg:pt-0 lg:pb-0">
        <div className="w-full lg:hidden h-6" />

        <div
          ref={contentRef}
          className="text-white max-w-lg text-center lg:text-center items-center md:translate-x-4 lg:translate-x-0 transition-transform"
        >
          <h6
            ref={hSubRef}
            className="text-base sm:text-5xl mb-3 lg:-mr-[65px] w-[185px] lg:w-190 lg:-ml-20 md:w-200 md:-ml-35"
          >
            The Essence of Rice
          </h6>

          <h1
            ref={hMainRef}
            className="text-5xl sm:text-5xl font-bold mb-8 text-yellow-500 lg:-mr-[85px] lg:w-220 lg:-ml-20"
          >
            A Legacy of Royal Taste
          </h1>

          <p
            ref={p1Ref}
            className="text-base leading-relaxed mb-5 opacity-90 font-semibold text-left w-full lg:text-left lg:ml-20"
          >
            Across centuries and continents, one grain has defined the art of fine dining, The Indian Basmati.
          </p>

          <p
            ref={p2Ref}
            className="text-base leading-relaxed mb-8 opacity-90 font-semibold text-left w-full lg:text-left lg:ml-20"
          >
            Renowned for its long, slender grains, natural fragrance, and soft texture, it stands as India’s royal gift to the global table.
            At Abu Hind, we carry forward this heritage with pride. Our premium basmati rice embodies the purity of Indian soil, the precision
            of modern cultivation, and the timeless aroma that has captivated chefs and connoisseurs worldwide. Each grain is a reflection
            of excellence — rich in nutrition, heritage, and unmatched quality.
          </p>
        </div>

        <div className="hidden lg:block w-10" />
      </div>
    </section>
  );
} // ← this closing brace was missing
