"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Props = {
  bgSrc?: string; // /public path
  title?: string;
  body?: string | string[];
};

export default function HeroVignette({
  bgSrc = "/assets/images/golden-field.png",
  title = "Legacy Of Royal Taste",
  body = [
    "Centuries ago, from the royal kitchens of Persia to the grand courts of India, a timeless masterpiece was born Biryani. Derived from the Persian word birinj biriyan meaning “fried rice,” the dish traveled with emperors and traders, evolving with every new land it touched.",
    "When this art of cooking spiced meat and rice met India’s fragrant Basmati from the Himalayan foothills, a legend took shape. The Mughals and Nawabs perfected it by layering saffron kissed grains with marinated meat, slow-cooked in sealed pots the traditional dum pukht style.",
    "From the royal courts of Delhi and Lucknow to the kitchens of Hyderabad and Malabar, Biryani became a celebration of culture and flavor.",
    "With Basmati rice at its heart, Biryani remains more than food — it is India’s aromatic gift to the world, carrying the fragrance of history and the legacy of royal taste.",
  ],
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgWrapRef = useRef<HTMLDivElement | null>(null);
  const bgImgRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const paragraphs = useMemo<string[]>(() => {
    if (Array.isArray(body)) return body.filter(Boolean);
    const src = (body ?? "").trim();
    if (!src) return [];
    return src.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
  }, [body]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const bgWrap = bgWrapRef.current;
    const bgImg = bgImgRef.current;
    const h1 = titleRef.current as HTMLElement | null;
    const bodyContainer = bodyRef.current as HTMLElement | null;
    if (!section || !bgWrap || !bgImg || !h1 || !bodyContainer) return;

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

    // normalize words for matching (unicode-safe)
    const norm = (s: string) =>
      (s || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

    const findWordIndex = (words: HTMLElement[], target: string) => {
      const t = norm(target);
      if (!t) return -1;
      return words.findIndex((w) => {
        const n = norm(w.textContent || "");
        return n === t || n.startsWith(t); // "taste" matches "taste."
      });
    };

    const highlightRange = (
      words: HTMLElement[],
      startWord: string,
      endWord: string
    ) => {
      const startIdx = findWordIndex(words, startWord);
      if (startIdx === -1) return;
      const endRel = findWordIndex(words.slice(startIdx), endWord);
      if (endRel === -1) return;
      const endIdx = startIdx + endRel;
      for (let i = startIdx; i <= endIdx; i++) {
        // Add bold to the already colored/italic range
        words[i].classList.add(
          "text-yellow-200",
          "font-bold",
          "italic" // ← remove this if you don't want italics
        );
      }
    };

    // only words after the em dash "—"
    const wordsAfterDash = (words: HTMLElement[]) => {
      const dashIdx = words.findIndex((w) =>
        (w.textContent || "").includes("—")
      );
      return dashIdx >= 0 ? words.slice(dashIdx + 1) : words;
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([bgWrap, bgImg, h1, bodyContainer], { clearProps: "all" });
        return;
      }

      const titleWords = splitWords(h1);

      // Split each paragraph separately
      const bodyParagraphEls = Array.from(
        bodyContainer.querySelectorAll("p")
      ) as HTMLElement[];
      const splitByParagraph = bodyParagraphEls.map((p) => splitWords(p));
      const bodyWords = splitByParagraph.flat();

      // Highlight from just after "—" to "taste" in the LAST paragraph
      const lastParaWords = splitByParagraph[splitByParagraph.length - 1] ?? [];
      const targetRange = wordsAfterDash(lastParaWords);
      highlightRange(targetRange, "it", "taste");

      // Initial states
      const setInitial = () => {
        gsap.set(bgWrap, { autoAlpha: 0 });
        gsap.set(bgImg, { scale: 1.08, y: 12, filter: "blur(2px)" });
        gsap.set(titleWords, { y: 16, scale: 0.96, autoAlpha: 0 });
        gsap.set(bodyWords, { y: 14, scale: 0.96, autoAlpha: 0 });
      };
      setInitial();

      // Timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });
      tl.to(bgWrap, { autoAlpha: 1, duration: 0.6 }, 0)
        .to(
          bgImg,
          { scale: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
          0
        )
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

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        onEnter: () => tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          setInitial();
        },
        invalidateOnRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, [paragraphs.length]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[60vh] sm:min-h-[70vh] md:min-h-[30vh] overflow-hidden"
    >
      {/* Background */}
      <div ref={bgWrapRef} className="absolute inset-0 -z-10">
        <div ref={bgImgRef} className="relative h-full w-full will-change-transform">
          <Image src={bgSrc} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 -top-15 h-28 sm:h-36 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-15  h-28 sm:h-36 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 sm:px-6 py-16 sm:py-20 lg:py-28 text-center ">
        <h1 ref={titleRef} className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          {title}
        </h1>

        <div
          ref={bodyRef}
          className="mt-4 max-w-4xl text-xs sm:text-sm lg:text-base leading-6 sm:leading-7 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)] lg:font-regular"
        >
          {paragraphs.map((para, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
