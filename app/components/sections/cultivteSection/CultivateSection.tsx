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
  const descRef = useRef<HTMLParagraphElement | null>(null);

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
      gsap.set(descRef.current, { x: -24, autoAlpha: 0 });
      gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(circles, { scale: 0.6, autoAlpha: 0 });
      gsap.set(train, { x: 0, y: 0, autoAlpha: 0 });
    };

    const clearAll = () => {
      gsap.set(
        [titleRef.current, subRef.current, descRef.current, dividerRef.current, ...circles],
        { clearProps: "all" }
      );
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

    // desktop-only flag
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

      // Headings, divider, paragraph
      timeline
        .to(titleRef.current, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.0)
        .to(subRef.current,   { y: 0, autoAlpha: 1, duration: 0.8 }, 0.1)
        .to(dividerRef.current, { scaleX: 1, duration: 0.5 }, 0.65)
        .to(descRef.current,  { x: 0, autoAlpha: 1, duration: 0.8 }, 0.7);

      const startAt = 0.55;

      if (!enableTrain) {
        // 👉 Mobile & Tablet: reveal ALL circles with a staggered pop
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
        // 👉 Desktop: first circle pops, the rest pop as the train "arrives"
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

    if (reduced) {
      clearAll();
      return;
    }

    setInitial();

    const masterST = ScrollTrigger.create({
      trigger: section,
      start: "top 72%",
      onEnter: () => {
        tl?.scrollTrigger?.kill();
        tl?.kill();
        setInitial();
        tl = buildTimeline(measure(), section, isDesktop());
      },
      onEnterBack: () => {},
      onLeaveBack: () => {
        tl?.scrollTrigger?.kill();
        tl?.kill();
        setInitial();
      },
      invalidateOnRefresh: true,
    });

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
      <div className="absolute pointer-events-none opacity-10 z-0 -right-12 top-122 h-56 w-56 sm:-right-16 sm:top-46 sm:h-100 sm:w-50 md:-right-20 md:top-50 md:h-52 md:w-52 lg:-right-30 lg:top-50 lg:bottom-0 lg:w-1/4 lg:h-auto">
        <div className="relative w-full h-full">
          <Image src="/assets/images/bg-logo.png" alt="Right background" fill className="object-contain object-right" priority />
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-[#002060] mb-12 will-change-[transform,opacity]">
          How Abu Hind Cultivates
        </h2>

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

        {/* Subheading + Yellow Line + Paragraph */}
        <h3 ref={subRef} className="text-2xl font-semibold text-blue-900 mb-3 will-change-[transform,opacity]">
          Seed Selection and Sowing
        </h3>
        <div ref={dividerRef} className="w-20 h-[3px] bg-[#F9B233] mx-auto mb-5 rounded-full origin-left scale-x-0 will-change-transform" />
        <p ref={descRef} className="text-blue-900 font-semibold max-w-3xl mx-auto leading-relaxed text-sm sm:text-base will-change-[transform,opacity]">
          Only high-caliber seeds are selected for optimal harvest. These pest-resistant
          seeds are either sown straight into the soil or transplanted from nursery beds
          after initial growth.
        </p>
      </div>
    </section>
  );
}
