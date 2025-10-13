"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Newsletter() {
  const [loading, setLoading] = useState(false);

  // Refs for animation targets
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const imgSmWrapRef = useRef<HTMLDivElement | null>(null); // small/md wheat (left)
  const imgLgWrapRef = useRef<HTMLDivElement | null>(null); // lg+ wheat (right)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    const form = formRef.current;
    const imgSm = imgSmWrapRef.current;
    const imgLg = imgLgWrapRef.current;
    if (!section || !heading || !para || !form) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const inputs = Array.from(
      form.querySelectorAll<HTMLInputElement>("input")
    );

    // ===== Wind sway (bottom pinned) =====
    let windTweenSm: gsap.core.Tween | null = null;
    let windTweenLg: gsap.core.Tween | null = null;

    const startWind = () => {
      const makeWind = (el: HTMLElement | null) => {
        if (!el) return null;
        // Anchor transforms to the bottom center so the base stays fixed.
        gsap.set(el, { transformOrigin: "50% 100%" });
        return gsap.to(el, {
          rotation: 2.2,
          skewX: 1.2,
          skewY: 0.6,
          duration: 3.0,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      };

      windTweenSm?.kill();
      windTweenLg?.kill();
      windTweenSm = makeWind(imgSm);
      windTweenLg = makeWind(imgLg);
    };

    const stopWind = () => {
      windTweenSm?.kill();
      windTweenLg?.kill();
      windTweenSm = null;
      windTweenLg = null;
      if (imgSm) gsap.set(imgSm, { clearProps: "transform" });
      if (imgLg) gsap.set(imgLg, { clearProps: "transform" });
    };

    const setInitial = () => {
      gsap.set(heading, { y: 18, autoAlpha: 0, willChange: "transform,opacity" });
      gsap.set(para, { y: 18, autoAlpha: 0, willChange: "transform,opacity" });
      gsap.set(form, {
        scale: 0.92,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
        willChange: "transform,opacity",
      });
      gsap.set(inputs, {
        scale: 0.95,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
        willChange: "transform,opacity",
      });
      // Ensure wind wrappers have clean transforms before starting
      if (imgSm) gsap.set(imgSm, { clearProps: "transform" });
      if (imgLg) gsap.set(imgLg, { clearProps: "transform" });
    };

    const clearAll = () => {
      gsap.set([heading, para, form, ...inputs], { clearProps: "all" });
      stopWind();
    };

    if (reduced) {
      clearAll();
      return;
    }

    setInitial();

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    // Heading & paragraph: fade + slide up
    tl.to(heading, { y: 0, autoAlpha: 1, duration: 0.6 }, 0.05)
      .to(para, { y: 0, autoAlpha: 1, duration: 0.65 }, 0.12);

    // Form card scales up
    tl.to(form, { scale: 1, autoAlpha: 1, duration: 0.7 }, 0.22);

    // Inputs scale up one-by-one
    if (inputs.length) {
      tl.to(
        inputs,
        { scale: 1, autoAlpha: 1, duration: 0.55, stagger: 0.12 },
        0.34
      );
    }

    // Scroll behavior: play on top→down; reset on leave back; wind only when in view
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      onEnter: () => {
        tl.play(0);
        startWind();
      },
      onEnterBack: () => {
        // keep "top→down only" feel: no replay on upward entry
      },
      onLeaveBack: () => {
        tl.pause(0);
        setInitial();
        stopWind();
      },
      invalidateOnRefresh: true,
    });

    return () => {
      stopWind();
      st.kill();
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#0a3372]">
      {/* optional bottom accent */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-yellow-400" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2">
        {/* Left: copy + BIGGER form */}
        <div className="relative z-10">
          {/* BG wheat (small+md only) */}
          <div
            ref={imgSmWrapRef}
            aria-hidden
            className="
              lg:hidden pointer-events-none absolute -z-10
              right-[-22px] top-16 h-56 w-56 opacity-45
              sm:right-[-28px] sm:top-12 sm:h-64 sm:w-64
              md:right-[-48px] md:top-10 md:h-80 md:w-80 md:opacity-50
              will-change-transform
            "
          >
            <Image
              src="/assets/images/paddy.webp"
              alt=""
              fill
              sizes="(max-width: 1023px) 80vw"
              className="object-contain"
            />
          </div>

          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white will-change-[transform,opacity]"
          >
            Keep Up with the Newest
            <br className="hidden sm:block" /> Updates
          </h2>

          <p
            ref={paraRef}
            className="mt-4 max-w-2xl text-base sm:text-lg leading-7 text-white font-semibold will-change-[transform,opacity]"
          >
            Stay connected with the world of Abu Hind. Sign up for recipes, cultivation
            stories, and exclusive offers delivered straight to your inbox.
          </p>

          {/* BIGGER form card */}
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="mt-8 w-full max-w-xl sm:max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl ring-1 ring-black/5 will-change-[transform,opacity]"
          >
            <div className="space-y-4 sm:space-y-5">
              <label className="block">
                <span className="sr-only">First Name</span>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full rounded-lg bg-slate-100 px-5 py-3.5 sm:py-4 text-base sm:text-lg text-slate-900 placeholder-slate-500 outline-none ring-1 ring-transparent focus:ring-yellow-400 will-change-[transform,opacity]"
                  required
                />
              </label>

              <label className="block">
                <span className="sr-only">Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full rounded-lg bg-slate-100 px-5 py-3.5 sm:py-4 text-base sm:text-lg text-slate-900 placeholder-slate-500 outline-none ring-1 ring-transparent focus:ring-yellow-400 will-change-[transform,opacity]"
                  required
                />
              </label>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-w-[11rem] sm:min-w-[12rem] items-center justify-center rounded-xl bg-yellow-400 px-10 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-slate-900 shadow-md transition hover:bg-yellow-300 disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: wheat image (lg+) */}
        <div className="relative lg:static hidden lg:block">
          <div
            ref={imgLgWrapRef}
            className="pointer-events-none relative mx-auto h-72 w-72 lg:absolute lg:right-0 lg:top-1/2 lg:h-[460px] lg:w-[460px] lg:-translate-y-1/2 opacity-80 will-change-transform"
          >
            <Image
              src="/assets/images/paddy.webp"
              alt="Wheat"
              fill
              sizes="(min-width: 1024px) 460px, 80vw"
              className="object-contain scale-[1.25] lg:scale-[1.6]"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
