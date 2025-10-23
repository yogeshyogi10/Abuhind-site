"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function HowAbuHindCultivates() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const rowRef = useRef<HTMLDivElement | null>(null);
  const globalTrainRef = useRef<HTMLDivElement | null>(null);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLHeadingElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const parasWrapRef = useRef<HTMLDivElement | null>(null); // ⬅️ NEW: paragraphs container

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const row = rowRef.current;
    const train = globalTrainRef.current;
    if (!section || !row || !train) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const circles = gsap.utils.toArray<HTMLDivElement>(".js-circle");
    const connWraps = gsap.utils.toArray<HTMLDivElement>(".js-conn-wrap");

    let tl: gsap.core.Timeline | null = null;

    const setInitial = () => {
      gsap.set([titleRef.current, subRef.current], { y: 24, autoAlpha: 0 });
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(circles, { scale: 0.6, autoAlpha: 0 });
      gsap.set(train, { x: 0, y: 0, autoAlpha: 0 });
    };

    const clearAll = () => {
      gsap.set([titleRef.current, subRef.current, dividerRef.current, ...circles], {
        clearProps: "all",
      });
      gsap.set(train, { clearProps: "all" });
    };

    const measure = () => {
      const rowBox = row!.getBoundingClientRect();
      const segments = connWraps.map((wrap) => {
        const track = wrap.querySelector<HTMLDivElement>(".js-track")!;
        const r = track.getBoundingClientRect();
        return {
          xStart: r.left - rowBox.left,
          xEnd: r.right - rowBox.left,
          y: r.top + r.height / 2 - rowBox.top,
        };
      });

      const body = train.querySelector<HTMLDivElement>(".js-train-body") as HTMLDivElement;
      const tBox = body.getBoundingClientRect();
      return { segments, trainW: tBox.width, trainH: tBox.height };
    };

    const isDesktop = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches;

    const buildTimeline = (
      m: ReturnType<typeof measure>,
      secEl: HTMLElement,
      enableTrain: boolean
    ) => {
      const { segments, trainW, trainH } = m;

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: secEl,
          start: "top 82%",
          end: "bottom 99%",
          invalidateOnRefresh: true,
        },
      });

      // Headings + divider
      timeline
        .to(titleRef.current, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.0)
        .to(subRef.current, { y: 0, autoAlpha: 1, duration: 0.8 }, 0.1)
        .to(dividerRef.current, { scaleX: 1, duration: 0.5 }, 0.65);

      const startAt = 0.55;

      if (!enableTrain) {
        // Mobile & Tablet: reveal ALL circles with a staggered pop
        if (circles.length) {
          timeline.fromTo(
            circles,
            { scale: 0.6, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.3,
              ease: "back.out(2)",
              stagger: 0.12,
            },
            startAt
          );
        }
      } else {
        // Desktop: first circle pops, the rest pop as the train "arrives"
        if (circles[0]) {
          timeline.fromTo(
            circles[0],
            { scale: 0.6, autoAlpha: 0 },
            { scale: 1, autoAlpha: 1, duration: 0.28, ease: "back.out(2)" },
            startAt
          );
        }

        if (segments.length > 0) {
          const dwell = 0.12;
          const segDur = 0.5;

          timeline.set(
            train,
            { x: segments[0].xStart, y: segments[0].y - trainH / 2, autoAlpha: 1 },
            startAt + 0.05
          );

          let t = startAt + 0.08;

          segments.forEach((seg, i) => {
            // travel current segment
            timeline.to(
              train,
              {
                x: seg.xEnd - trainW,
                y: seg.y - trainH / 2,
                duration: segDur,
                ease: "power1.inOut",
              },
              t
            );

            // next station pops
            const nextCircle = circles[i + 1];
            if (nextCircle) {
              timeline.fromTo(
                nextCircle,
                { scale: 0.6, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.28, ease: "back.out(2)" },
                t + segDur - 0.12
              );
            }

            // jump to next segment (cut) or fade out at end
            const nextSeg = segments[i + 1];
            if (nextSeg) {
              timeline
                .to(train, { autoAlpha: 0, duration: 0.02 }, t + segDur + 0.01)
                .set(train, { x: nextSeg.xStart, y: nextSeg.y - trainH / 2 })
                .to(train, { autoAlpha: 1, duration: 0.02 });
            } else {
              timeline.to(train, { autoAlpha: 0, duration: 0.15 }, t + segDur + dwell / 2);
            }

            t += segDur + dwell;
          });
        }
      }

      return timeline;
    };

    // ====== PARAGRAPH ANIMATION (unique effect) ======
    const setupParagraphs = () => {
      const wrap = parasWrapRef.current;
      if (!wrap) return;

      // Split words while preserving spaces and inner markup
      const splitWords = (el: HTMLElement) => {
        if ((el as any).__splitDone) {
          return Array.from(el.querySelectorAll<HTMLElement>(":scope span.js-w"));
        }
        const txt = el.textContent ?? "";
        const parts = txt.match(/\S+|\s+/g) ?? [];
        el.textContent = "";
        const frag = document.createDocumentFragment();
        const words: HTMLElement[] = [];

        parts.forEach((t) => {
          if (/^\s+$/.test(t)) {
            frag.appendChild(document.createTextNode(t));
          } else {
            const s = document.createElement("span");
            s.textContent = t;
            s.className = "js-w inline-block will-change-[transform,opacity,filter]";
            frag.appendChild(s);
            words.push(s);
          }
        });

        // Add a glow sweep element
        const glow = document.createElement("span");
        glow.className = "js-glow pointer-events-none absolute inset-y-0 -left-1/2 w-[85%] rotate-1";
        Object.assign(glow.style, {
              background:
                "linear-gradient(90deg, rgba(0,0,0,0), rgba(255,255,255,0.18), rgba(0,0,0,0))",
              filter: "blur(6px)",
              transform: "translateX(-120%)",
              mixBlendMode: "screen",
              opacity: "0",
        } as CSSStyleDeclaration);
        el.appendChild(frag);
        el.appendChild(glow);

        (el as any).__splitDone = true;
        return words;
      };

      const paras = Array.from(wrap.querySelectorAll<HTMLElement>(".js-para"));

      // init styles
      paras.forEach((para, i) => {
        para.style.position = "relative";
        para.style.overflow = "hidden";

        const words = splitWords(para);
        const fromLeft = i % 2 === 0; // alternate direction

        gsap.set(words, {
          x: fromLeft ? -12 : 12,
          y: 14,
          z: -24,
          rotationX: -35,
          autoAlpha: 0,
          filter: "blur(2px)",
          transformPerspective: 900,
          transformOrigin: fromLeft ? "left center" : "right center",
          force3D: true,
        });

        const glow = para.querySelector<HTMLElement>(".js-glow");
        if (glow) {
          gsap.set(glow, { xPercent: -120, autoAlpha: 0 });
        }
      });

      // build timeline just for paragraphs
      const pTL = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

      paras.forEach((para, i) => {
        const words = Array.from(para.querySelectorAll<HTMLElement>(".js-w"));
        const glow = para.querySelector<HTMLElement>(".js-glow");
        const base = 0.2 + i * 0.28;

        pTL.to(
          words,
          {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.012,
          },
          base
        );

        if (glow) {
          pTL.fromTo(
            glow,
            { xPercent: -120, autoAlpha: 0 },
            { xPercent: 160, autoAlpha: 1, duration: 0.8, ease: "power2.out" },
            base + 0.08
          ).to(glow, { autoAlpha: 0, duration: 0.2 }, ">-0.2");
        }
      });

      // ScrollTrigger: only play downward; reset when leaving back
      ScrollTrigger.create({
        trigger: section!,
        start: "top 78%",
        onEnter: () => pTL.play(0),
        onEnterBack: () => {}, // ignore upward re-entry
        onLeaveBack: () => {
          pTL.pause(0);
          paras.forEach((para, i) => {
            const fromLeft = i % 2 === 0;
            const words = Array.from(para.querySelectorAll<HTMLElement>(".js-w"));
            gsap.set(words, {
              x: fromLeft ? -12 : 12,
              y: 14,
              z: -24,
              rotationX: -35,
              autoAlpha: 0,
              filter: "blur(2px)",
            });
            const glow = para.querySelector<HTMLElement>(".js-glow");
            if (glow) gsap.set(glow, { xPercent: -120, autoAlpha: 0 });
          });
        },
        invalidateOnRefresh: true,
      });
    };

    if (reduced) {
      clearAll();
      return;
    }

    setInitial();

    // Headings + circles/train timeline (downward only, resets on back)
    const masterST = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      onEnter: () => {
        tl?.scrollTrigger?.kill();
        tl?.kill();
        setInitial();
        tl = buildTimeline(measure(), section, isDesktop());
      },
      onEnterBack: () => {}, // ignore upward re-entry
      onLeaveBack: () => {
        tl?.scrollTrigger?.kill();
        tl?.kill();
        setInitial();
      },
      invalidateOnRefresh: true,
    });

    // Paragraph animation setup (separate TL)
    setupParagraphs();

    // Re-measure on refresh (layout changes)
    const onRefresh = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      setInitial();
      tl = buildTimeline(measure(), section, isDesktop());
    };
    ScrollTrigger.addEventListener("refreshInit", onRefresh);

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      tl?.scrollTrigger?.kill();
      tl?.kill();
      masterST.kill();
    };
  }, []);

  const steps = [
    { img: "/assets/images/image-1.webp", alt: "Farmer" },
    { img: "/assets/images/image-2.webp", alt: "Paddy Field" },
    { img: "/assets/images/image-3.webp", alt: "Soil" },
    { img: "/assets/images/image-4.webp", alt: "Rice" },
    { img: "/assets/images/image-5.webp", alt: "Cooked Rice" },
  ];

  return (
    <section ref={sectionRef} className="relative w-full bg-white overflow-hidden py-16 md:py-24">
      {/* Backgrounds */}
      <div className="absolute pointer-events-none opacity-10 z-0 -left-12 top-28 h-56 w-56 sm:-left-16 sm:top-10 sm:h-44 sm:w-44 md:-left-20 md:top-12 md:h-52 md:w-52 lg:-left-30 lg:-top-35 lg:bottom-0 lg:w-1/4 lg:h-auto">
        <div className="relative w-full h-full">
          <Image src="/assets/images/bg-logo.png" alt="Left background" fill className="object-contain object-left" priority />
        </div>
      </div>
      <div className="absolute pointer-events-none opacity-10 z-0 -right-12 top-122 h-56 w-56 sm:-right-16 sm:top-46 sm:h-100 sm:w-50 md:-right-20 md:top-50 md:h-52 md:w-52 lg:-right-30 lg:top-80 lg:bottom-0 lg:w-1/4 lg:h-auto">
        <div className="relative w-full h-full">
          <Image src="/assets/images/bg-logo.png" alt="Right background" fill className="object-contain object-right" priority />
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-[#002060] mb-12 will-change-[transform,opacity]">
          From Indian Fields to The World
        </h2>
        <div ref={dividerRef} className="w-40 h-[3px] bg-[#F9B233] mx-auto mb-20 -mt-5 rounded-full origin-left scale-x-0 will-change-transform" />

        {/* Steps Row */}
        <div ref={rowRef} className="relative flex flex-wrap justify-center items-center gap-6 md:gap-10 mb-16">
          {/* Train is hidden on tablet; visible only on desktop */}
          <div ref={globalTrainRef} className="hidden lg:block absolute left-0 top-0 pointer-events-none opacity-0">
            <div className="js-train-body flex items-center">
              <div className="h-[3px] w-8 bg-[#002060] rounded-full" />
              <div className="ml-[2px] w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-t-transparent border-b-transparent border-l-[#002060]" />
            </div>
          </div>

          {steps.map((step, index) => (
            <div key={index} className="relative flex items-center">
              {/* Station (circle) */}
              <div className="relative flex-shrink-0">
                <div className="js-circle relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden shadow-lg border-4 border-white">
                  <Image src={step.img} alt={step.alt} fill className="object-cover [backface-visibility:hidden]" />
                </div>
              </div>

              {/* Connector (track) — only if there is a next station */}
              {index < steps.length - 1 && (
                <div className="hidden md:block ml-4 relative w-16 md:w-20 h-4">
                  <div className="js-conn-wrap absolute inset-0">
                    <div className="js-track absolute left-0 top-1/2 -translate-y-1/2 h-[3px] w-full bg-[#002060]/35 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Subheading (optional) */}
        {/* <h3 ref={subRef} className="text-xl font-semibold text-[#002060] mb-4 will-change-[transform,opacity]">
          How Abu Hind Cultivates Quality
        </h3> */}

        {/* Paragraphs (unique animation) */}
        <div
          ref={parasWrapRef}
          className="max-w-3xl mx-auto text-blue-900 font-semibold leading-relaxed text-sm sm:text-base space-y-4"
        >
          <p className="js-para relative">
            Abu Hind’s journey begins in India’s basmati heartland. Only selected, high-grade seeds are cultivated in
            nutrient-rich soil using sustainable, time-tested techniques. Every harvest is naturally aged to develop aroma
            and strength before being carefully processed in state-of-the-art facilities. From these fields, Abu Hind
            premium basmati travels across borders, maintaining full traceability, purity, and consistency from farm to
            export.
          </p>
          <p className="js-para relative">
            Our promise is simple: To deliver authentic Indian basmati that exceeds global quality benchmarks and delights
            every market it reaches.
          </p>
        </div>
      </div>
    </section>
  );
}
