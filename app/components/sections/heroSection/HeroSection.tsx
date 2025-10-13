"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Bowl (image)
  const bowlWrapRef = useRef<HTMLDivElement | null>(null);

  // Content
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

      // Initial states (no layout shift)
      gsap.set(section, { opacity: 0 });
      gsap.set(content, { opacity: 0 });
      gsap.set(bowl, {
        xPercent: -130,
        rotate: -90,
        opacity: 0,
        filter: "blur(2px)",
        willChange: "transform,opacity,filter",
      });

      if (supportsClip) {
        gsap.set([h1, p, cta], {
          clipPath: "inset(0% 100% 0% 0%)", // hidden from left
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

      // Section fade
      tl.to(section, { opacity: 1, duration: 0.35 });

      // Bowl roll-in
      tl.to(
        bowl,
        {
          xPercent: 0,
          rotate: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.9,
          force3D: true,
        },
        0.05
      );

      // Content fade visible (keeps layout stable)
      tl.to(
        content,
        {
          opacity: 1,
          duration: 0.95,
        },
        "-=0.55"
      );

      // Heading swipe
      const HEADING_SWEEP_DUR = 1.2; // was 0.6
const HEADING_SWEEP_EASE = "power1.out";
      if (supportsClip) {
        tl.to(
          h1,
          { clipPath: "inset(0% 0% 0% 0%)", duration: HEADING_SWEEP_DUR,ease: HEADING_SWEEP_EASE, },
          "-=0.25"
        );
      } else {
        tl.to(
          h1,
          { x: 0, autoAlpha: 1, duration: HEADING_SWEEP_DUR,ease: HEADING_SWEEP_EASE, },
          "-=0.25"
        );
      }

      // Paragraph swipe (was fade; now matches heading style)
      if (supportsClip) {
        tl.to(
          p,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75 },
          "-=0.25"
        );
      } else {
        tl.to(
          p,
          { x: 0, autoAlpha: 1, duration: 0.9 },
          "-=0.25"
        );
      }

      // Button swipe
      if (supportsClip) {
        tl.to(
          cta,
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
          "-=0.2"
        );
      } else {
        tl.to(
          cta,
          { x: 0, autoAlpha: 1, duration: 0.5 },
          "-=0.2"
        );
      }

      // Polished idle float (no layout impact)
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
      {/* Pattern overlay */}
      <div className="absolute inset-0 z-0 bg-[url('/assets/pattern/bg-pattern.png')] bg-repeat bg-[length:2000px_1000px]" />

      {/* Image layer */}
      <div
        aria-hidden
        className="
          absolute inset-0 z-[1] flex items-center justify-center pointer-events-none
          lg:static lg:z-auto lg:flex-shrink-0 lg:w-96 lg:h-96
        "
      >
        <div
          ref={bowlWrapRef}
          className="relative w-72 h-72 lg:w-56 lg:h-56 md:w-96 md:h-96 overflow-visible will-change-transform lg:ml-60"
        >
          <Image
            src="/assets/images/rice-bowl.webp"
            alt="Rice bowl"
            width={500}
            height={500}
            className="
              w-full h-full object-contain
              scale-[2.5] sm:scale-[2.2] md:scale-[2]
              lg:scale-[7.7] -translate-y-3 md:-translate-y-5 lg:-translate-y-15
              [backface-visibility:hidden]
            "
            priority
          />
        </div>
      </div>

      {/* Content wrapper */}
      <div
        className="
          relative z-10 max-w-5xl w-full
          px-6 lg:px-12
          flex flex-col lg:flex-row
          justify-start lg:justify-between
          items-center
          gap-12
          pt-8 pb-20 lg:pt-0 lg:pb-0
        "
      >
        <div className="w-full lg:hidden h-6" />

        <div
          ref={contentRef}
          className="text-white max-w-lg text-center lg:text-center font-manrope items-center"
        >
          {/* Heading swipe */}
          <h1
            ref={headingRef}
            className="text-4xl lg:text-5xl font-bold mb-6 lg:-mr-80 will-change-[clip-path,transform,opacity]"
          >
            The Essence of Rice
          </h1>

          {/* Paragraph swipe */}
          <p
            ref={paraRef}
            className="text-base leading-relaxed mb-8 opacity-90 font-manrope text-left w-full lg:text-left lg:ml-45 will-change-[clip-path,transform,opacity]"
          >
            Rice is much more than a staple it is a symbol of life, prosperity, and
            cultural heritage for billions around the world. At Abu Hind, we honor this
            timeless grain that fuels traditions, celebrations, and everyday
            nourishment alike. Each grain carries the richness of history, embodying
            connection, abundance, and unity that transcends generations. With Abu Hind
            rice, you bring a heritage of exceptional quality, aroma, and flavor to your
            table, preserving the legacy of a grain that has shaped civilizations.
          </p>

          {/* Button swipe */}
          <button
            ref={ctaRef}
            className="bg-[#F9B233] hover:bg-[#f0a824] text-[#0033A0] font-semibold py-3 px-8 rounded-md transition-all lg:-mr-80 will-change-[clip-path,transform,opacity]"
          >
            View More
          </button>
        </div>

        <div className="hidden lg:block w-10" />
      </div>
    </section>
  );
}
