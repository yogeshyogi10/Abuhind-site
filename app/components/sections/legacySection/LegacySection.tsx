"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  bgSrc?: string; // /public path
  title?: string;
  body?: string;
};

export default function HeroVignette({
  bgSrc = "/assets/images/golden-paddy.webp",
  title = "Legacy Of Royal Taste",
  body = `Long ago, an Arab Sulthan visited India and was generously hosted by an Indian Rajah, who had a daughter named Hind. To welcome the Sulthan, the Rajah prepared an extraordinary feast featuring biriyani made with a special rice—Basmati. The Sulthan was overwhelmed by the richness and fragrant aroma of the dish and asked the Rajah about the rice. Proudly, the Rajah showed him the royal fields where this exceptional rice was grown.
Captivated by its quality and flavor, the Sulthan decided to bring this treasured rice to his homeland for his people to enjoy. In honor of Rajah Hind, he named the rice “Abu Hind,” meaning "Father of Hind," symbolizing the bond between cultures and the rich legacy of this special grain.`,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const bgImgRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const bgWrap = bgWrapRef.current;
    const bgImg = bgImgRef.current;
    const h1 = titleRef.current as HTMLElement | null;
    const p = bodyRef.current as HTMLElement | null;
    if (!section || !bgWrap || !bgImg || !h1 || !p) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split text into word spans (preserve spaces)
    const splitWords = (el: HTMLElement): HTMLElement[] => {
      if ((el as any).__splitDone) {
        return Array.from(
          el.querySelectorAll(":scope span.inline-block.will-change-transform")
        ) as HTMLElement[];
      }
      const text = el.textContent ?? "";
      const parts = text.split(/(\s+)/); // keep spaces
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
        gsap.set([bgWrap, bgImg, h1, p], { clearProps: "all" });
        return;
      }

      const titleWords = splitWords(h1);
      const bodyWords = splitWords(p);

      // Initial states + reset helper
      const setInitial = () => {
        gsap.set(bgWrap, { autoAlpha: 0 });
        gsap.set(bgImg, { scale: 1.08, y: 12, filter: "blur(2px)" }); // Ken Burns: start slightly zoomed & soft
        gsap.set(titleWords, { y: 16, scale: 0.96, autoAlpha: 0 });
        gsap.set(bodyWords, { y: 14, scale: 0.96, autoAlpha: 0 });
      };
      setInitial();

      // Master timeline (plays on downward entry)
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      tl.to(bgWrap, { autoAlpha: 1, duration: 0.6 }, 0)
        // Background Ken Burns to rest
        .to(
          bgImg,
          {
            scale: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power2.out",
          },
          0
        )
        // Title words bubble up
        .to(
          titleWords,
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
            ease: "back.out(1.6)",
            stagger: 0.04,
          },
          0.15
        )
        // Body words bubble up
        .to(
          bodyWords,
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.5,
            ease: "back.out(1.4)",
            stagger: 0.009,
          },
          0.25
        );

      // Play on top→down entry, reset on leaving upward
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
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
    <section
      ref={sectionRef}
      className="relative isolate min-h-[60vh] sm:min-h-[70vh] overflow-hidden"
    >
      {/* Background (wrapped for animation) */}
      <div ref={bgWrapRef} className="absolute inset-0 -z-10">
        <div ref={bgImgRef} className="relative h-full w-full will-change-transform">
          <Image
            src={bgSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* White vignette top & bottom */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 sm:px-6 py-16 sm:py-20 lg:py-28 text-center">
        <h1
          ref={titleRef}
          className="text-2xl sm:text-4xl font-bold tracking-tight text-[#011D6E]"
        >
          {title}
        </h1>

        <p
          ref={bodyRef}
          className="mt-4 max-w-4xl text-xs sm:text-sm lg:text-base leading-6 sm:leading-7 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)] lg:font-bold"
        >
          {body}
        </p>
      </div>
    </section>
  );
}
