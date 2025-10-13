"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bowlWrapRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bowl = bowlWrapRef.current;
    const content = contentRef.current;
    const h1 = headingRef.current;
    const p = paraRef.current;
    const cta = ctaRef.current;
    if (!section || !bowl || !content || !h1 || !p || !cta) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsClip =
      typeof CSS !== "undefined" &&
      (CSS.supports("clip-path", "inset(0% 100% 0% 0%)") ||
        CSS.supports("clipPath", "inset(0% 100% 0% 0%)"));

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([section, bowl, content, h1, p, cta], { clearProps: "all" });
        return;
      }

      gsap.set(section, { opacity: 0 });
      gsap.set(content, { opacity: 0 });

      // dissolve in
      gsap.set(bowl, {
        opacity: 0,
        filter: "blur(6px)",
        scale: 1.05,
        willChange: "opacity,filter,transform",
      });

      if (supportsClip) {
        gsap.set([h1, p, cta], {
          clipPath: "inset(0% 100% 0% 0%)",
          willChange: "clip-path,opacity,transform",
        });
      } else {
        gsap.set([h1, p, cta], {
          x: -16,
          autoAlpha: 0,
          willChange: "transform,opacity",
        });
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(section, { opacity: 1, duration: 0.35 });

      tl.to(
        bowl,
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 0.9,
          clearProps: "filter",
          force3D: true,
        },
        0.05
      );

      tl.to(
        content,
        { opacity: 1, duration: 0.95 },
        "-=0.55"
      );

      const HEADING_SWEEP_DUR = 1.9;
      const HEADING_SWEEP_EASE = "power1.out";
      if (supportsClip) {
        tl.to(h1, { clipPath: "inset(0% 0% 0% 0%)", duration: HEADING_SWEEP_DUR, ease: HEADING_SWEEP_EASE }, "-=0.25");
      } else {
        tl.to(h1, { x: 0, autoAlpha: 1, duration: HEADING_SWEEP_DUR, ease: HEADING_SWEEP_EASE }, "-=0.25");
      }

      if (supportsClip) {
        tl.to(p, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75 }, "-=0.25");
      } else {
        tl.to(p, { x: 0, autoAlpha: 1, duration: 0.9 }, "-=0.25");
      }

      if (supportsClip) {
        tl.to(cta, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, "-=0.2");
      } else {
        tl.to(cta, { x: 0, autoAlpha: 1, duration: 0.5 }, "-=0.2");
      }

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
            className="w-full h-full object-contain scale-[2] sm:scale-[2.5] md:scale-[3.2] lg:scale-[7.7] -translate-y-3 md:-translate-y-5 lg:-translate-y-[15px] opacity-60 md:opacity-100 [backface-visibility:hidden] transition-transform"
            priority
          />
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-5xl w-full px-6 lg:mr-[7.5rem] flex flex-col lg:flex-row justify-start lg:justify-between items-center gap-12 pt-8 pb-20 lg:pt-0 lg:pb-0">
        <div className="w-full lg:hidden h-6" />
        <div
          ref={contentRef}
          className="text-white max-w-lg text-center lg:text-center font-manrope items-center md:translate-x-4 lg:translate-x-0 transition-transform"
        >
          <h1
            ref={headingRef}
            className="text-4xl sm:text-5xl font-extrabold sm:font-bold mb-6 lg:-mr-80 will-change-[clip-path,transform,opacity]"
          >
            The Essence of Rice
          </h1>
          <p
            ref={paraRef}
            className="text-base leading-relaxed mb-8 opacity-90 font-manrope font-bold sm:font-bold text-left w-full lg:text-left lg:ml-40 will-change-[clip-path,transform,opacity]"
          >
            Rice is much more than a staple it is a symbol of life, prosperity, and
            cultural heritage for billions around the world. At Abu Hind, we honor this
            timeless grain that fuels traditions, celebrations, and everyday
            nourishment alike. Each grain carries the richness of history, embodying
            connection, abundance, and unity that transcends generations. With Abu Hind
            rice, you bring a heritage of exceptional quality, aroma, and flavor to your
            table, preserving the legacy of a grain that has shaped civilizations.
          </p>
          <button
            ref={ctaRef}
            className="bg-[#F9B233] hover:bg-[#f0a824] text-[#0033A0] font-semibold py-3 px-8 rounded-md transition-all md:translate-x-2 lg:translate-x-0 will-change-[clip-path,transform,opacity] lg:ml-[16.25rem]"
          >
            View More
          </button>
        </div>
        <div className="hidden lg:block w-10" />
      </div>
    </section>
  );
}
