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
    iconSrc: '/assets/icons/wheat.png',
    iconAlt: 'Leaf',
    text:
      'Authentic Indian Origin – 100% sourced and processed in India’s traditional basmati regions for true geographical authenticity.',
  },
  {
    iconSrc: '/assets/icons/hands.png',
    iconAlt: 'Waves',
    text:
      'Globally Trusted – Preferred by importers, retailers, and chefs across GCC, Africa, Europe, and Asia for consistent quality and royal presentation.',
  },
];

const rightCards: Card[] = [
  {
    iconSrc: '/assets/icons/rice-bowl.png',
    iconAlt: 'List',
    text:
      'Aromatic Excellence – Naturally aged, releasing a delicate, nutty aroma that defines premium Indian cuisine.',
  },
  {
    iconSrc: '/assets/icons/sack.png',
    iconAlt: 'Stand',
    text:
      'Pure, Nutritious & Export-Grade – Carefully sorted, graded, and packaged to ensure freshness; low in fat, gluten-free, and naturally rich in carbs and minerals',
  },
];

function InfoCard({
  iconSrc,
  iconAlt,
  text,
  className = '',
}: Card & { className?: string }) {
  // Bold "Grade" anywhere (case-insensitive)
  const wrapGrade = (s: string) => {
    const parts = s.split(/(Grade)\b/gi);
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={`g-${i}`} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // If "ifan" appears, bold text before it; else bold before first dash
  const renderText = (t: string) => {
    const lower = t.toLowerCase();
    const ifanIndex = lower.indexOf('ifan');

    if (ifanIndex > 0) {
      const before = t.slice(0, ifanIndex);
      const after = t.slice(ifanIndex);
      return (
        <>
          <span className="font-bold">{wrapGrade(before)}</span>
          {wrapGrade(after)}
        </>
      );
    }

    const m = t.match(/^(.*?)(\s*[—–-]\s*)(.*)$/);
    if (m) {
      const [, prefix, sep, suffix] = m;
      return (
        <>
          <span className="font-bold">{wrapGrade(prefix)}</span>
          {sep}
          {wrapGrade(suffix)}
        </>
      );
    }

    return wrapGrade(t);
  };

  return (
    <div
      className={`
        group relative overflow-hidden js-card ${className}
        w-80 h-55 rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5
        transition-colors duration-300 hover:bg-yellow-400
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
        cursor-pointer select-none
      `}
      role="button"
      tabIndex={0}
    >
      {/* Gold sweep (animated by GSAP) */}
      <span
        aria-hidden
        className="js-shine pointer-events-none absolute inset-y-0 -left-1/2 w-[85%] rotate-12 will-change-transform"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0), rgba(252,211,77,0.95), rgba(0,0,0,0))',
          filter: 'blur(2px)',
          transform: 'translateX(-160%)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Quick gold glow on hover/tap */}
      <span
        aria-hidden
        className="js-glow pointer-events-none absolute inset-0 rounded-xl opacity-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(252,211,77,0.35), transparent 60%)',
        }}
      />

      <div
        className="
          z-10 relative mx-auto mb-3 flex items-center justify-center
          rounded-full bg-slate-100 ring-1 ring-slate-200 w-16 h-16
          transition-colors group-hover:bg-yellow-300 group-hover:ring-yellow-500
        "
      >
        <Image
          src={iconSrc}
          alt={iconAlt}
          width={45}
          height={45}
          className="object-contain"
        />
      </div>

      <p className="z-10 relative text-center text-sm leading-6 text-[#011D6E] transition-colors group-hover:text-[#072c6a]">
        {renderText(text)}
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

    const ctx = gsap.context((self) => {
      // ===== Gold shimmer on cards =====
      const cards = gsap.utils.toArray<HTMLElement>('.js-card');
      const cleanupFns: Array<() => void> = [];

      cards.forEach((card) => {
        const shine = card.querySelector<HTMLElement>('.js-shine');
        const glow = card.querySelector<HTMLElement>('.js-glow');
        if (!shine) return;

        const loop = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.2 });
        loop.fromTo(shine, { xPercent: -160 }, { xPercent: 260, duration: 1.2, ease: 'power2.out' });

        ScrollTrigger.create({
          trigger: card,
          start: 'top 95%',
          end: 'bottom 5%',
          onEnter: () => loop.play(),
          onEnterBack: () => loop.play(),
          onLeave: () => loop.pause(0),
          onLeaveBack: () => loop.pause(0),
        });

        const kick = () => {
          loop.restart(true);
          if (glow) {
            gsap.fromTo(
              glow,
              { opacity: 0 },
              { opacity: 0.45, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out' }
            );
          }
        };

        const hasHover =
          typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
        const supportsPointer = typeof window !== 'undefined' && 'PointerEvent' in window;

        if (hasHover) {
          const onEnter = () => kick();
          card.addEventListener('mouseenter', onEnter);
          cleanupFns.push(() => card.removeEventListener('mouseenter', onEnter));
        }

        if (supportsPointer) {
          const onPointerDown = () => kick();
          card.addEventListener('pointerdown', onPointerDown);
          cleanupFns.push(() => card.removeEventListener('pointerdown', onPointerDown));
        } else {
          const onTouchStart = () => kick();
          const onClick = () => kick();
          card.addEventListener('touchstart', onTouchStart, { passive: true });
          card.addEventListener('click', onClick);
          cleanupFns.push(() => card.removeEventListener('touchstart', onTouchStart));
          cleanupFns.push(() => card.removeEventListener('click', onClick));
        }
      });

      // ===== Entrance animations =====
      const leftEls = gsap.utils.toArray<HTMLElement>('.js-left');
      const rightEls = gsap.utils.toArray<HTMLElement>('.js-right');
      const riceEls = gsap.utils.toArray<HTMLElement>('.js-rice'); // rice bag wrappers

      const init = () => {
        gsap.set(heading, { autoAlpha: 0, y: 10 });
        gsap.set(underline, { scaleX: 0, transformOrigin: 'left center' });

        if (supportsClip) {
          gsap.set(leftEls, { clipPath: 'inset(0% 100% 0% 0%)', autoAlpha: 1 });
          gsap.set(rightEls, { clipPath: 'inset(0% 0% 0% 100%)', autoAlpha: 1 });
        } else {
          gsap.set(leftEls, { x: -24, autoAlpha: 0 });
          gsap.set(rightEls, { x: 24, autoAlpha: 0 });
        }

        // IMPORTANT: start visible so mobile/tablet see the image
        gsap.set(riceEls, {
          autoAlpha: 1,
          y: 6,
          scale: 1,
          willChange: 'transform',
        });
      };

      init();

      if (reduced) {
        gsap.set([heading, underline, ...leftEls, ...rightEls, ...riceEls], { clearProps: 'all' });
        self.add(() => cleanupFns.forEach((fn) => fn()));
        return;
      }

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.6 }, 0);
      tl.to(underline, { scaleX: 1, duration: 0.9 }, 0.1);

      if (supportsClip) {
        tl.to(leftEls, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.15 }, 0.2)
          .to(rightEls, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.15 }, 0.2);
      } else {
        tl.to(leftEls, { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 }, 0.2)
          .to(rightEls, { x: 0, autoAlpha: 1, duration: 0.7, stagger: 0.15 }, 0.2);
      }

      // Only move the rice bags up slightly (no fade-in, they’re already visible)
      tl.to(riceEls, { y: 0, duration: 0.6 }, 0.25);

      ScrollTrigger.create({
        trigger: section!,
        start: 'top 85%',
        onEnter: () => tl.play(0),
        onLeaveBack: () => {
          tl.pause(0);
          init();
        },
        invalidateOnRefresh: true,
      });

      // ===== Floating rice bag (in view only) =====
      const floatTweens: gsap.core.Tween[] = [];
      riceEls.forEach((el, i) => {
        const tween = gsap.to(el, {
          y: i % 2 === 0 ? '+=10' : '+=14',
          rotation: i % 2 === 0 ? -0.6 : 0.6,
          duration: 4 + (i % 3), // 4..6s
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          paused: true,
          force3D: true,
        });

        floatTweens.push(tween);

        ScrollTrigger.create({
          trigger: el,
          start: 'top 95%',
          end: 'bottom 5%',
          onEnter: () => tween.play(),
          onEnterBack: () => tween.play(),
          onLeave: () => tween.pause(0),
          onLeaveBack: () => tween.pause(0),
        });
      });

      // Cleanup
      self.add(() => {
        cleanupFns.forEach((fn) => fn());
        floatTweens.forEach((t) => t.kill());
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const allCards = [...leftCards, ...rightCards];

  return (
    <section ref={sectionRef} className="relative bg-[#072c6a]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
        <h2 ref={headingRef} className="text-yellow-500 text-xl sm:text-2xl font-bold">
          About Our Rice
        </h2>
        <div
          ref={underlineRef}
          className="mx-auto mt-2 h-1 w-24 rounded bg-yellow-400 origin-left scale-x-0 will-change-transform"
        />

        {/* SMALL */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:hidden md:hidden">
          <div className="space-y-6 order-2 flex flex-col items-center font-semibold">
            {leftCards.map((c, i) => (
              <InfoCard key={`s-l-${i}`} {...c} className="js-left font-semibold" />
            ))}
          </div>

          <div className="order-1 flex items-center justify-center">
            <div className="relative js-rice will-change-transform [transform:translateZ(0)]">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)]" />
              <Image
                src="/assets/images/rice-bag.webp"
                alt="Abu Hind rice pack"
                width={900}
                height={1200}
                sizes="(max-width: 639px) 14rem, 100vw"
                className="relative z-10 h-100 w-56 sm:w-64 lg:w-100 object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 order-3 flex flex-col items-center">
            {rightCards.map((c, i) => (
              <InfoCard key={`s-r-${i}`} {...c} className="js-right" />
            ))}
          </div>
        </div>

        {/* MEDIUM */}
        <div className="mt-10 hidden md:grid lg:hidden grid-cols-2 gap-8 place-items-center font-semibold">
          <div className="col-span-2 flex items-center justify-center font-semibold">
            <div className="relative js-rice will-change-transform [transform:translateZ(0)]">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)]" />
              <Image
                src="/assets/images/rice-bag.webp"
                alt="Abu Hind rice pack"
                width={900}
                height={1200}
                sizes="(min-width: 640px) and (max-width: 1023px) 16rem, 100vw"
                className="relative z-10 h-100 w-64 object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {allCards.map((c, i) => (
            <InfoCard
              key={`m-${i}`}
              {...c}
              className={i < leftCards.length ? 'js-left' : 'js-right'}
            />
          ))}
        </div>

        {/* LARGE */}
        <div className="mt-10 hidden lg:grid grid-cols-3 gap-8 items-start font-semibold">
          <div className="space-y-6 order-2 lg:order-1 flex flex-col items-center font-semibold">
            {leftCards.map((c, i) => (
              <InfoCard key={`l-${i}`} {...c} className="js-left" />
            ))}
          </div>

          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative js-rice will-change-transform [transform:translateZ(0)]">
              <div className="pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.55),transparent_60%)]" />
              <Image
                src="/assets/images/rice-bag.webp"
                alt="Abu Hind rice pack"
                width={900}
                height={1200}
                sizes="(min-width: 1024px) 20rem, 100vw"
                className="relative z-10 h-100 w-56 sm:w-64 lg:w-100 object-cover drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 order-3 flex flex-col items-center">
            {rightCards.map((c, i) => (
              <InfoCard key={`r-${i}`} {...c} className="js-right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
