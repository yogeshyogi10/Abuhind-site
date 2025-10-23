"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function WhySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  const labelRef = useRef<HTMLParagraphElement | null>(null); // "Why Abu Hind?"
  const headingRef = useRef<HTMLHeadingElement | null>(null); // H2
  const paraRef = useRef<HTMLDivElement | null>(null);        // lead + list container
  const ctaRef = useRef<HTMLAnchorElement | null>(null);      // optional

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const bg = bgRef.current;
    const label = labelRef.current;
    const h2 = headingRef.current;
    const p = paraRef.current;
    const cta = ctaRef.current; // may be null (optional)

    if (!section || !bg || !label || !h2 || !p) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Split text into word spans while preserving inner markup (colors, spans)
    const splitWordsPreserveChildren = (root: HTMLElement): HTMLElement[] => {
      if ((root as any).__splitDone) {
        return Array.from(
          root.querySelectorAll(":scope span.inline-block.will-change-transform")
        ) as HTMLElement[];
      }
      const words: HTMLElement[] = [];
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          const parts = text.split(/(\s+)/); // keep spaces
          const frag = document.createDocumentFragment();
          parts.forEach((t) => {
            if (t.trim() === "") {
              frag.appendChild(document.createTextNode(t));
            } else {
              const s = document.createElement("span");
              s.textContent = t;
              s.className = "inline-block will-change-transform";
              frag.appendChild(s);
              words.push(s);
            }
          });
          node.parentNode?.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          Array.from(node.childNodes).forEach(processNode);
        }
      };
      Array.from(root.childNodes).forEach(processNode);
      (root as any).__splitDone = true;
      return words;
    };

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([bg, label, h2, p, cta ?? undefined].filter(Boolean) as any, { clearProps: "all" });
        return;
      }

      // Build word arrays (label, heading, and all text inside paraRef)
      const labelWords = splitWordsPreserveChildren(label);
      const hWords = splitWordsPreserveChildren(h2);
      const pWords = splitWordsPreserveChildren(p);

      // Initial state (add subtle 3D flip + slide from left)
      const setInitial = () => {
        gsap.set(bg, { autoAlpha: 0 });

        // give elements perspective in 3D
        const seed3D = (els: HTMLElement[], rotX = -55, z = -60, y = 18) =>
          gsap.set(els, {
            x: -18,
            y,
            z,
            rotationX: rotX,
            autoAlpha: 0,
            transformPerspective: 900,
            transformOrigin: "left center",
            force3D: true,
          });

        seed3D(labelWords, -45, -50, 20);
        seed3D(hWords, -65, -70, 22);
        seed3D(pWords, -35, -40, 16);

        if (cta) {
          gsap.set(cta, { scale: 0.85, autoAlpha: 0, transformOrigin: "50% 50%" });
        }
      };
      setInitial();

      // Timeline (downward only)
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
      tl.to(bg, { autoAlpha: 1, duration: 0.8 }, 0)
        // label
        .to(
          labelWords,
          {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: 0.55,
            stagger: 0.045,
          },
          0.12
        )
        // heading
        .to(
          hWords,
          {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.04,
          },
          0.22
        )
        // paragraph + list
        .to(
          pWords,
          {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            autoAlpha: 1,
            duration: 0.5,
            stagger: 0.012,
          },
          0.30
        );

      if (cta) {
        tl.to(
          cta,
          { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" },
          0.42
        );
      }

      // ScrollTrigger: play only on downward entry; reset when scrolling back above
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        onEnter: () => tl.play(0),
        onEnterBack: () => {}, // ignore upward re-entry
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
      id="blogs"
      className="relative isolate sm:-mt-25 lg:-mt-55 z-10 overflow-hidden"
    >
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <Image
          src="/assets/images/field.webp"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-blue-600/45" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-900/50 to-transparent" />
      </div>

      {/* Content (add perspective context for nicer 3D) */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 [perspective:1000px] [transform-style:preserve-3d]">
        <p ref={labelRef} className="text-4xl font-semibold font-alro">
          <span className="text-white">Why</span>{" "}
          <span className="text-yellow-500">Abu Hind?</span>
        </p>

        <h2
          ref={headingRef}
          className="mt-2 text-xl sm:text-3xl lg:text-2xl font-bold tracking-tight text-[#E8B01D]"
        >
          A Tradition of Purity and Premium Quality
        </h2>

        {/* Lead + benefits list */}
        <div
          ref={paraRef}
          className="mt-4 text-slate-100/90 leading-7 sm:text-lg space-y-4 font-semibold"
        >
          <p>
            Abu Hind rice delivers exceptional purity, superior grain quality, and unmatched
            freshness — a legacy of royal Indian heritage in every grain.
          </p>

          <div>
            <p className="font-semibold text-yellow-300">Benefits:</p>
            <ul className="mt-2 list-disc list-inside marker:text-yellow-300 space-y-1 sm:w-300 lg:w-200 md:w-180">
              <li>
                <span className="font-semibold">Exceptional Purity:</span> Each grain is carefully
                cultivated to meet the highest standards.
              </li>
              <li>
                <span className="font-semibold">Superior Grain Quality:</span> Slender, long grains
                that cook perfectly and remain separate.
              </li>
              <li>
                <span className="font-semibold">Unmatched Freshness:</span> Processed to preserve
                natural aroma and nutrients.
              </li>
              <li>
                <span className="font-semibold">Rich Aroma &amp; Flavor:</span> Delicate, fragrant
                taste that enhances every meal.
              </li>
              <li>
                <span className="font-semibold">Royal Heritage:</span> Rooted in centuries of Indian
                tradition and culinary excellence.
              </li>
              <li>
                <span className="font-semibold">Consistent Excellence:</span> Reliable quality in
                every batch for an authentic sensory experience.
              </li>
            </ul>
          </div>
        </div>

        {/* Optional CTA (uncomment to use)
        <div className="mt-8 flex justify-center">
          <a
            ref={ctaRef}
            href="#"
            className="inline-flex items-center justify-center rounded-xl bg-yellow-400 px-10 py-3 text-sm font-semibold text-slate-100 shadow-md hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 will-change-transform"
          >
            View More
          </a>
        </div>
        */}
      </div>
    </section>
  );
}
