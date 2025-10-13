"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GrainSection() {
  const BOX = 224;
  const GAP = 40;
  const SHRINK = 48;

  const sectionRef = useRef<HTMLElement | null>(null);
  const crossRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const imgs = gsap.utils.toArray<HTMLElement>(".js-img");
      const txtLeft = gsap.utils.toArray<HTMLElement>(".js-txt-left");
      const txtRight = gsap.utils.toArray<HTMLElement>(".js-txt-right");

      const vLines = gsap.utils.toArray<HTMLElement>(".js-cross-v");
      const hLines = gsap.utils.toArray<HTMLElement>(".js-cross-h");
      const dots = gsap.utils.toArray<HTMLElement>(".js-cross-dot");

      const setInitial = () => {
        gsap.set(imgs, { scale: 0.85, autoAlpha: 0, willChange: "transform,opacity" });
        gsap.set(txtLeft, { x: -24, autoAlpha: 0, willChange: "transform,opacity" });
        gsap.set(txtRight, { x: 24, autoAlpha: 0, willChange: "transform,opacity" });
        gsap.set(vLines, { scaleY: 0, transformOrigin: "50% 50%", willChange: "transform" });
        gsap.set(hLines, { scaleX: 0, transformOrigin: "50% 50%", willChange: "transform" });
        gsap.set(dots, { scale: 0, autoAlpha: 0, willChange: "transform,opacity" });
      };

      if (reduced) {
        gsap.set([imgs, txtLeft, txtRight, vLines, hLines, dots].flat(), { clearProps: "all" });
        return;
      }

      setInitial();

      // Slower, softer timeline
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

      // Cross lines & dots
      if (vLines.length || hLines.length) {
        tl.to(vLines, { scaleY: 1, duration: 0.95, ease: "power1.out" }, 0.0)
          .to(hLines, { scaleX: 1, duration: 0.95, ease: "power1.out" }, 0.0)
          .to(
            dots,
            { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.4)", stagger: 0.06 },
            0.1
          );
      }

      // Images pop
      tl.to(
        imgs,
        { scale: 1, autoAlpha: 1, duration: 0.85, ease: "power2.out", stagger: 0.18 },
        0.2
      );

      // Text slide-ins
      tl.to(
        txtLeft,
        { x: 0, autoAlpha: 1, duration: 0.85, ease: "power2.out", stagger: 0.12 },
        0.25
      ).to(
        txtRight,
        { x: 0, autoAlpha: 1, duration: 0.85, ease: "power2.out", stagger: 0.12 },
        0.3
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top 78%",
        onEnter: () => tl.play(0),    // play only top -> down
        onEnterBack: () => {},        // ignore bottom -> top
        onLeaveBack: () => {          // reset when scrolling back above
          tl.pause(0);
          setInitial();
        },
        invalidateOnRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const imgCls =
    "js-img h-40 w-40 sm:h-48 sm:w-48 md:h-[224px] md:w-[224px] object-cover";
  const copyCls = "text-sm leading-6 font-bold text-[#011D6E]";

  return (
    <section ref={sectionRef} className="relative bg-white overflow-hidden">
      {/* === Existing background SVGs (unchanged) === */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute inset-0 z-0 opacity-30 bg-no-repeat
          [background-image:url('/assets/svg/wheat-1.svg'),url('/assets/svg/wheat-2.svg')]
          [background-position:left_-60px_top_100px,_right_70px_top_120px]
          sm:[background-position:left_-40px_top_80px,_right_-40px_top_100px]
          md:[background-position:left_-10px_top_80px,_right_-40px_top_0px]
          [background-size:200px_auto,_200px_auto]
          sm:[background-size:260px_auto,_260px_auto]
          md:[background-size:220px_auto,_320px_auto]
        "
      />

      {/* === Extra bottom corner SVGs (new) === */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute bottom-[-12px] left-[-16px] z-0 opacity-25
          hidden xs:block sm:block
        "
        style={{ width: 180, height: 180 }}
      >
        <Image
          src="/assets/svg/wheat-1.svg"
          alt=""
          fill
          sizes="180px"
          className="object-contain"
          priority={false}
        />
      </div>

      <div
        aria-hidden
        className="
          pointer-events-none absolute bottom-[-16px] right-[-20px] z-0 opacity-25
          hidden xs:block sm:block
        "
        style={{ width: 210, height: 210 }}
      >
        <Image
          src="/assets/svg/wheat-2.svg"
          alt=""
          fill
          sizes="210px"
          className="object-contain"
          priority={false}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight text-[#173a78]">
          {/* optional heading */}
        </h2>

        {/* MOBILE */}
        <div className="mt-8 space-y-6 md:hidden">
          <div className="flex flex-col items-center text-center">
            <Image src="/assets/images/rice-1.jpg" alt="Grain 1" width={224} height={224}
              className={`${imgCls} rounded-tr-3xl rounded-bl-3xl`} />
            <p className={`${copyCls} js-txt-left mt-3`}>
              Retaining the bran and germ, brown basmati provides a chewier texture, nuttier flavor, and greater nutritional value including higher fiber and more minerals. It is a wholesome option for health-conscious consumers and adds depth to salads and wholesome recipes.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Image src="/assets/images/rice-2.jpg" alt="Grain 2" width={224} height={224}
              className={`${imgCls} rounded-tl-3xl rounded-br-3xl`} />
            <p className={`${copyCls} js-txt-right mt-3`}>
              A parboiled variety with a beautiful golden hue, Golden Sella preserves more nutrients and is loved for its firm, robust grains that stay separate after cooking. It’s especially favored by restaurants and caterers for its resilience and appearance.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Image src="/assets/images/rice-3.jpg" alt="Grain 3" width={224} height={224}
              className={`${imgCls} rounded-br-3xl rounded-tl-3xl`} />
            <p className={`${copyCls} js-txt-left mt-3`}>
              Known for its authentic fragrance, traditional basmati has a rich, deep aroma and a classic soft texture that is prized in festive cooking and everyday meals. It features delicate, nutty flavor and grains that remain wonderfully separate after cooking.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Image src="/assets/images/rice-4.jpg" alt="Grain 4" width={224} height={224}
              className={`${imgCls} rounded-bl-3xl rounded-tr-3xl`} />
            <p className={`${copyCls} js-txt-right mt-3`}>
              Known for its authentic fragrance, traditional basmati has a rich, deep aroma and a classic soft texture that is prized in festive cooking and everyday meals. It features delicate, nutty flavor and grains that remain wonderfully separate after cooking.
            </p>
          </div>
        </div>

        {/* TABLET */}
        <div className="hidden md:grid lg:hidden mt-10 grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <Image src="/assets/images/rice-1.jpg" alt="Grain 1" width={BOX} height={BOX}
              className={`${imgCls} rounded-tr-3xl rounded-bl-3xl`} />
          </div>
          <p className={`${copyCls} js-txt-right`}>
            Retaining the bran and germ, brown basmati provides a chewier texture, nuttier flavor, and greater nutritional value including higher fiber and more minerals. It is a wholesome option for health-conscious consumers and adds depth to salads and wholesome recipes
          </p>

          <p className={`${copyCls} js-txt-left text-right`}>
            A parboiled variety with a beautiful golden hue, Golden Sella preserves more nutrients and is loved for its firm, robust grains that stay separate after cooking. It’s especially favored by restaurants and caterers for its resilience and appearance.
          </p>
          <div className="flex justify-center">
            <Image src="/assets/images/rice-2.jpg" alt="Grain 2" width={BOX} height={BOX}
              className={`${imgCls} rounded-tl-3xl rounded-br-3xl`} />
          </div>

          <div className="flex justify-center">
            <Image src="/assets/images/rice-3.jpg" alt="Grain 3" width={BOX} height={BOX}
              className={`${imgCls} rounded-br-3xl rounded-tl-3xl`} />
          </div>
          <p className={`${copyCls} js-txt-right`}>
            Known for its authentic fragrance, traditional basmati has a rich, deep aroma and a classic soft texture that is prized in festive cooking and everyday meals. It features delicate, nutty flavor and grains that remain wonderfully separate after cooking.
          </p>

          <p className={`${copyCls} js-txt-left text-right`}>
            Among the longest grain varieties, 1121 Basmati stands out for its extended slender grains, superior fluffiness, and non-stickiness. It’s ideal for gourmet dishes, signature biryanis, and premium presentations, with a light, nutty aroma and consistent texture after cooking
          </p>
          <div className="flex justify-center">
            <Image src="/assets/images/rice-4.jpg" alt="Grain 4" width={BOX} height={BOX}
              className={`${imgCls} rounded-bl-3xl rounded-tr-3xl`} />
          </div>
        </div>

        {/* DESKTOP (lg+): cross grid */}
        <div
          className="relative mx-auto mt-8 lg:mt-12 hidden lg:block"
          style={
            {
              // @ts-ignore
              "--box": `${BOX}px`,
              "--gap": `${GAP}px`,
              "--shrink": `${SHRINK}px`,
              "--cross": `calc(var(--box) * 2 + var(--gap) - var(--shrink))`,
            } as React.CSSProperties
          }
        >
          {/* Cross (animated) */}
          <div
            ref={crossRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 will-change-transform"
            style={{ width: "var(--cross)", height: "var(--cross)" }}
          >
            <span className="js-cross-v absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 rounded-full bg-yellow-400 origin-center will-change-transform" />
            <span className="js-cross-h absolute left-0 top-1/2 -translate-y-1/2 h-1 w-full rounded-full bg-yellow-400 origin-center will-change-transform" />
            <span className="js-cross-dot absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-yellow-400 will-change-[transform,opacity]" />
            <span className="js-cross-dot absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 h-3.5 w-3.5 rounded-full bg-yellow-400 will-change-[transform,opacity]" />
            <span className="js-cross-dot absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-yellow-400 will-change-[transform,opacity]" />
            <span className="js-cross-dot absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-yellow-400 will-change-[transform,opacity]" />
          </div>

          {/* Grid */}
          <div
            className="
              relative z-10 grid grid-cols-[1fr_var(--box)_var(--box)_1fr]
              grid-rows-2 gap-[var(--gap)] items-center
            "
          >
            <p className={`${copyCls} js-txt-left text-right pr-6 col-start-1 row-start-1`}>
              Retaining the bran and germ, brown basmati provides a chewier texture, nuttier flavor, and greater nutritional value including higher fiber and more minerals. It is a wholesome option for health-conscious consumers and adds depth to salads and wholesome recipes
            </p>
            <div className="col-start-2 row-start-1 flex justify-center">
              <Image src="/assets/images/rice-1.jpg" alt="Grain 1" width={BOX} height={BOX}
                className="js-img h-[var(--box)] w-[var(--box)] object-cover rounded-tr-3xl rounded-bl-3xl" />
            </div>

            <div className="col-start-3 row-start-1 flex justify-center">
              <Image src="/assets/images/rice-2.jpg" alt="Grain 2" width={BOX} height={BOX}
                className="js-img h-[var(--box)] w-[var(--box)] object-cover rounded-tl-3xl rounded-br-3xl" />
            </div>
            <p className={`${copyCls} js-txt-right text-left pl-6 col-start-4 row-start-1`}>
              A parboiled variety with a beautiful golden hue, Golden Sella preserves more nutrients and is loved for its firm, robust grains that stay separate after cooking. It’s especially favored by restaurants and caterers for its resilience and appearance.
            </p>

            <p className={`${copyCls} js-txt-left text-right pr-6 col-start-1 row-start-2`}>
              Known for its authentic fragrance, traditional basmati has a rich, deep aroma and a classic soft texture that is prized in festive cooking and everyday meals. It features delicate, nutty flavor and grains that remain wonderfully separate after cooking.
            </p>
            <div className="col-start-2 row-start-2 flex justify-center">
              <Image src="/assets/images/rice-3.jpg" alt="Grain 3" width={BOX} height={BOX}
                className="js-img h-[var(--box)] w-[var(--box)] object-cover rounded-br-3xl rounded-tl-3xl" />
            </div>

            <div className="col-start-3 row-start-2 flex justify-center">
              <Image src="/assets/images/rice-4.jpg" alt="Grain 4" width={BOX} height={BOX}
                className="js-img h-[var(--box)] w-[var(--box)] object-cover rounded-bl-3xl rounded-tr-3xl" />
            </div>
            <p className={`${copyCls} js-txt-right text-left pl-6 col-start-4 row-start-2`}>
              Among the longest grain varieties, 1121 Basmati stands out for its extended slender grains, superior fluffiness, and non-stickiness. It’s ideal for gourmet dishes, signature biryanis, and premium presentations, with a light, nutty aroma and consistent texture after cooking
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
