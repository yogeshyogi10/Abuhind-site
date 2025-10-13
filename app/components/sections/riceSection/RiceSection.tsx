'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Card = {
  iconSrc: string;
  iconAlt: string;
  text: string;
};

const leftCards: Card[] = [
  {
    iconSrc: '/assets/icons/rice-logo.png',
    iconAlt: 'Leaf',
    text:
      'Each grain releases a rich, natural fragrance that elevates every meal and signals premium quality from the moment it’s cooked.',
  },
  {
    iconSrc: '/assets/icons/wheat-logo.png',
    iconAlt: 'Waves',
    text:
      'Abu Hind rice boasts slender, extra-long grains that remain separate and fluffy, ideal for biryanis, pilafs, and festive dishes.',
  },
];

const rightCards: Card[] = [
  {
    iconSrc: '/assets/icons/rice-bowl-logo.png',
    iconAlt: 'List',
    text:
      'Abu Hind rice is naturally free from gluten, making it suitable for those with dietary restrictions',
  },
  {
    iconSrc: '/assets/icons/cooker-logo.png',
    iconAlt: 'Stand',
    text:
      ' Carefully processed and matured for consistent results, our rice cooks evenly and resists sticking, making preparation simple and reliable',
  },
];

function InfoCard({ iconSrc, iconAlt, text }: Card) {
  return (
    <div
      className="
        group relative overflow-hidden
        w-80 h-50
        rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5
        transition-colors duration-300
        hover:bg-yellow-400
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
      "
    >
      {/* Shine sweep */}
      <span
        aria-hidden
        className="
          pointer-events-none absolute inset-y-0 -left-1/2 w-2/3 rotate-12
          -translate-x-full
          bg-gradient-to-r from-transparent via-white/80 to-transparent
          transition-transform duration-900 ease-out
          group-hover:translate-x-[200%]
          mix-blend-screen
        "
        style={{ filter: 'blur(2px)' }}
      />

      {/* Icon */}
      <div
        className="
          z-10 relative mx-auto mb-3 flex items-center justify-center
          rounded-full bg-slate-100 ring-1 ring-slate-200 w-16 h-16
          transition-colors
          group-hover:bg-yellow-300 group-hover:ring-yellow-500
        "
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={32}
          height={32}
          className="object-contain"
          priority={false}
        />
      </div>

      {/* Text */}
      <p
        className="
          z-10 relative text-center text-sm leading-6
          text-[#011D6E]
          transition-colors
          group-hover:text-[#072c6a]
        "
      >
        {text}
      </p>
    </div>
  );
}

export default function AboutRice() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const underlineRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    const heading = headingRef.current;
    const underline = underlineRef.current;
    if (!section || !heading || !underline) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const supportsClip =
      typeof CSS !== 'undefined' &&
      (CSS.supports('clip-path', 'inset(0% 0% 0% 0%)') ||
        CSS.supports('clipPath', 'inset(0% 0% 0% 0%)'));

    const ctx = gsap.context(() => {
      // Select groups
      const leftEls = gsap.utils.toArray<HTMLElement>('.js-card.js-left');
      const rightEls = gsap.utils.toArray<HTMLElement>('.js-card.js-right');
      const riceEls = gsap.utils.toArray<HTMLElement>('.js-rice');

      // Helpers to set/restore initial states
      const initStates = () => {
        gsap.set(heading, { autoAlpha: 0, y: 10 });
        gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' });

        if (supportsClip) {
          gsap.set(leftEls, {
            clipPath: 'inset(0% 100% 0% 0%)', // reveal from left → right
            autoAlpha: 1,
          });
          gsap.set(rightEls, {
            clipPath: 'inset(0% 0% 0% 100%)', // reveal from right → left
            autoAlpha: 1,
          });
        } else {
          gsap.set(leftEls, { x: -24, autoAlpha: 0 });
          gsap.set(rightEls, { x: 24, autoAlpha: 0 });
        }

        gsap.set(riceEls, { autoAlpha: 0, y: 6, scale: 1 }); // entry pose
      };

      initStates();

      if (reduced) {
        gsap.set([heading, underline, ...leftEls, ...rightEls, ...riceEls], {
          clearProps: 'all',
        });
        return;
      }

      // Float tweens holder
      let floats: gsap.core.Tween[] = [];
      const startFloat = () => {
        stopFloat();
        floats = riceEls.map((el) =>
          gsap.to(el, {
            y: '+=8',
            duration: 5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        );
      };
      const stopFloat = () => {
        floats.forEach((t) => t.kill());
        floats = [];
        gsap.set(riceEls, { y: 0 });
      };

      // Master TL (paused, replayable on downward entry)
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

      // Heading fade
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.6 }, 0);

      // Underline wipe
      tl.to(underline, { scaleX: 1, duration: 0.9 }, 0.1);

      // Cards wipe in (left & right), slightly overlapping, one-by-one
      if (supportsClip) {
        tl.to(
          leftEls,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.15 },
          0.2
        ).to(
          rightEls,
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.15 },
          0.2
        );
      } else {
        tl.to(
          leftEls,
          { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 },
          0.2
        ).to(
          rightEls,
          { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 },
          0.2
        );
      }

      // Rice packet entry + start float
      tl.to(
        riceEls,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          onComplete: startFloat,
        },
        0.25
      );

      // ScrollTrigger: play on downward entry, reset when scrolling back above
      ScrollTrigger.create({
        trigger: section,
        start: 'top 80%',
        onEnter: () => tl.play(0),
        onEnterBack: () => {}, // ignore upward entry
        onLeaveBack: () => {
          tl.pause(0);
          stopFloat();
          initStates();
        },
        invalidateOnRefresh: true,
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const allCards = [...leftCards, ...rightCards];

  return (
    <section ref={sectionRef} className="relative bg-[#072c6a]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        {/* Heading */}
        <h2 ref={headingRef} className="text-yellow-500 text-xl sm:text-2xl font-bold">
          About Our Rice
        </h2>
        {/* Yellow underline (wipe) */}
        <div
          ref={underlineRef}
          className="mx-auto mt-2 h-1 w-24 rounded bg-yellow-400 origin-left scale-x-0 will-change-transform"
        />

        {/* ====== SMALL (base–sm) ====== */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:hidden md:hidden">
          {/* Left cards */}
          <div className="space-y-6 order-2 flex flex-col items-center">
            {leftCards.map((c, i) => (
              <div key={`s-l-${i}`} className="js-card js-left will-change-[clip-path,transform,opacity]">
                <InfoCard {...c} />
              </div>
            ))}
          </div>

          {/* Center image with glow */}
          <div className="order-1 flex items-center justify-center">
            <div className="relative js-rice">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)]" />
              <Image
                src="/assets/images/rice-bag.webp"
                alt="Abu Hind rice pack"
                width={900}
                height={1200}
                className="relative z-10 h-100 w-56 sm:w-64 lg:w-100 object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right cards */}
          <div className="space-y-6 order-3 flex flex-col items-center">
            {rightCards.map((c, i) => (
              <div key={`s-r-${i}`} className="js-card js-right will-change-[clip-path,transform,opacity]">
                <InfoCard {...c} />
              </div>
            ))}
          </div>
        </div>

        {/* ====== MEDIUM (md only) ====== */}
        <div className="mt-10 hidden md:grid lg:hidden grid-cols-2 gap-8 place-items-center">
          {/* Center image */}
          <div className="col-span-2 flex items-center justify-center">
            <div className="relative js-rice">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)]" />
              <Image
                src="/assets/images/rice-bag.webp"
                alt="Abu Hind rice pack"
                width={900}
                height={1200}
                className="relative z-10 h-100 w-64 object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Cards — mark first two as left, last two as right */}
          {allCards.map((c, i) => (
            <div
              key={`m-${i}`}
              className={`js-card ${i < leftCards.length ? 'js-left' : 'js-right'} will-change-[clip-path,transform,opacity]`}
            >
              <InfoCard {...c} />
            </div>
          ))}
        </div>

        {/* ====== LARGE (lg+) ====== */}
        <div className="mt-10 hidden lg:grid grid-cols-3 gap-8 items-start">
          {/* Left cards */}
          <div className="space-y-6 order-2 lg:order-1 flex flex-col items-center">
            {leftCards.map((c, i) => (
              <div key={`l-${i}`} className="js-card js-left will-change-[clip-path,transform,opacity]">
                <InfoCard {...c} />
              </div>
            ))}
          </div>

          {/* Center image */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative js-rice">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)]" />
              <Image
                src="/assets/images/rice-bag.webp"
                alt="Abu Hind rice pack"
                width={900}
                height={1200}
                className="relative z-10 h-100 w-56 sm:w-64 lg:w-100 object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right cards */}
          <div className="space-y-6 order-3 flex flex-col items-center">
            {rightCards.map((c, i) => (
              <div key={`r-${i}`} className="js-card js-right will-change-[clip-path,transform,opacity]">
                <InfoCard {...c} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
