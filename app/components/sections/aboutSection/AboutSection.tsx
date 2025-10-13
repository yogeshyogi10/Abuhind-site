'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Feature = {
  no: string;
  title: string;
  blurb: string;
  img: string;
  imgAlt: string;
  offset?: boolean;
};

const features: Feature[] = [
  { no: '01', title: 'Rich in Quality', blurb: 'Our rice meets the highest standards, cultivated and processed with care to ensure consistent excellence', img: '/assets/images/crop.webp', imgAlt: 'Golden rice in the field' },
  { no: '02', title: 'Rich in Aroma', blurb: 'Swift processing preserves the freshness and nutrients from field to table.', img: '/assets/images/sack.jpg', imgAlt: 'Grains in a sack', offset: true },
  { no: '03', title: 'Freshly Harvested', blurb: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.', img: '/assets/images/farmer.webp', imgAlt: 'Farmer in the field' },
];

function FeatureItem({ no, title, blurb, img, imgAlt, offset }: Feature) {
  return (
    <div className={`relative transition-transform duration-300 hover:-translate-y-1 overflow-visible ${offset ? 'lg:mt-40' : 'lg:mt-8'}`}>
      {/* Big faint number (kept outside to avoid clipping) */}
      <div
        aria-hidden
        className="select-none pointer-events-none absolute -top-6 left-0 z-0 text-7xl sm:text-8xl font-extrabold text-[#011D6E3D] leading-none"
      >
        {no}
      </div>

      {/* Card wrapper (animates as a unit) */}
      <div className="js-card relative z-10 will-change-[transform,opacity]">
        <div className="mt-12">
          <h3 className="js-card-title text-xl font-semibold text-[#011D6E] font-manrope will-change-[transform,opacity]">
            {title}
          </h3>
          <p className="js-card-blurb mt-2 text-sm leading-6 text-[#011D6E] font-manrope will-change-[transform,opacity]">
            {blurb}
          </p>
        </div>

        <div
          className={`js-card-img relative z-10 mt-5 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5 will-change-[transform,opacity] ${
            offset ? 'h-[40rem] sm:h-[26rem]' : 'h-[40rem] sm:h-[25rem]'
          }`}
        >
          <Image src={img} alt={imgAlt} width={640} height={480} className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const yellowWrapRef = useRef<HTMLDivElement | null>(null);
  const yellowWipeRef = useRef<HTMLDivElement | null>(null);
  const headingRef   = useRef<HTMLHeadingElement | null>(null);
  const introRef     = useRef<HTMLParagraphElement | null>(null);
  const gridRef      = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const yellowWrap = yellowWrapRef.current!;
    const yellowWipe = yellowWipeRef.current!;
    const heading    = headingRef.current!;
    const intro      = introRef.current!;
    const grid       = gridRef.current!;

    // ---- Initial states
    const setInitialBar = () => {
      gsap.set(yellowWipe, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(heading,   { y: 12, autoAlpha: 0 });
    };
    const setInitialIntro = () => {
      gsap.set(intro, { x: -28, autoAlpha: 0 });
    };
    const setInitialCards = () => {
      const cards  = gsap.utils.toArray<HTMLElement>('.js-card');
      const imgs   = gsap.utils.toArray<HTMLElement>('.js-card-img');
      const titles = gsap.utils.toArray<HTMLElement>('.js-card-title');
      const blurbs = gsap.utils.toArray<HTMLElement>('.js-card-blurb');

      // SLOW rise: start lower with slight scale
      gsap.set(cards,  { y: 40, scale: 0.96, autoAlpha: 0 });
      // keep image pop separate
      gsap.set(imgs,   { scale: 0.92, autoAlpha: 0 });
      gsap.set([...titles, ...blurbs], { y: 14, autoAlpha: 0 });
    };
    const clearAll = () => {
      gsap.set([yellowWipe, heading, intro], { clearProps: 'all' });
      gsap.set(gsap.utils.toArray('.js-card, .js-card-img, .js-card-title, .js-card-blurb'), { clearProps: 'all' });
    };

    if (reduced) {
      clearAll();
      return;
    }

    setInitialBar();
    setInitialIntro();
    setInitialCards();

    // Helper: scrubbed (down-only) timeline with reset on leaveBack.
    const makeDownOnlyScrub = ({
      trigger,
      start,
      end,
      build,
      onReset,
    }: {
      trigger: Element;
      start: string;
      end: string;
      build: () => gsap.core.Timeline;
      onReset: () => void;
    }) => {
      let tl = build();
      let last = 0;

      const st = ScrollTrigger.create({
        trigger,
        start,
        end,
        scrub: true,
        onUpdate: (self) => {
          last = Math.max(last, self.progress); // only forward
          tl.progress(last);
        },
        onLeaveBack: () => {
          last = 0;
          tl.progress(0).pause(0);
          onReset();
        },
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          tl.kill();
          onReset();
          tl = build();
          last = 0;
        },
      });

      return () => {
        st.kill();
        tl.kill();
      };
    };

    // --- Yellow bar + heading (scrubbed)
    const killBar = makeDownOnlyScrub({
      trigger: yellowWrap,
      start: 'top 100%',
      end: 'bottom 40%',
      build: () => {
        const tl = gsap.timeline({ paused: true });
        tl.to(yellowWipe, { scaleX: 1, duration: 1.2, ease: 'power2.out' }, 0)
          .to(heading,    { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, 0.25);
        return tl;
      },
      onReset: setInitialBar,
    });

    // --- Intro paragraph (scrubbed)
    const killIntro = makeDownOnlyScrub({
      trigger: intro,
      start: 'top 85%',
      end: '+=280',
      build: () => {
        const tl = gsap.timeline({ paused: true });
        tl.to(intro, { x: 0, autoAlpha: 1, duration: 1.15, ease: 'power3.out' }, 0);
        return tl;
      },
      onReset: setInitialIntro,
    });

    // --- Cards: VERY SLOW RISE (scrubbed + staggered)
    const killCards = makeDownOnlyScrub({
      trigger: grid,
      start: 'top 80%',
      end: '+=900', // longer scrub distance => slower movement
      build: () => {
        const tl = gsap.timeline({ paused: true });

        const cards  = gsap.utils.toArray<HTMLElement>('.js-card');

        let base = 0;
        const step = 0.45; // more spacing between cards

        cards.forEach((card) => {
          const img   = card.querySelector<HTMLElement>('.js-card-img');
          const title = card.querySelector<HTMLElement>('.js-card-title');
          const blurb = card.querySelector<HTMLElement>('.js-card-blurb');

          // slow rise + gentle scale
          tl.to(card, { y: 0, scale: 1, autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, base);

          // image pop, then text slide-up
          if (img)   tl.to(img,   { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'power3.out' }, base + 0.12);
          if (title) tl.to(title, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },   base + 0.20);
          if (blurb) tl.to(blurb, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },   base + 0.26);

          base += step;
        });

        return tl;
      },
      onReset: setInitialCards,
    });

    return () => {
      killBar();
      killIntro();
      killCards();
    };
  }, []);

  return (
    <main className="bg-white">
      {/* Top yellow heading bar */}
      <section className="relative">
        <div ref={yellowWrapRef} className="relative overflow-hidden bg-yellow-400/20">
          <div ref={yellowWipeRef} aria-hidden className="absolute inset-0 bg-yellow-400 origin-left scale-x-0 will-change-transform" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
            <h1
              ref={headingRef}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight font-manrope will-change-[transform,opacity]"
            >
              <span className="text-white font-semibold">About</span>{' '}
              <span className="text-[#011D6E] font-semibold">Abu Hind</span>
            </h1>
          </div>
        </div>

        {/* Intro paragraph */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 font-manrope">
          <p
            ref={introRef}
            className="text-sm sm:text-base leading-7 max-w-4xl text-[#011D6E] will-change-[transform,opacity]"
          >
            Welcome to Abu Hind, where heritage and quality converge in every grain. Our
            rice carries a royal legacy, cultivated with care and time-honored tradition
            to deliver a rich aroma and exquisite taste. Rooted in centuries of cultural
            heritage, Abu Hind connects diverse cultures through the purity of nature and
            the promise of excellence. Experience rice that is more than food—it is a
            celebration of legacy, craftsmanship, and the timeless bond between land and
            table.
          </p>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative pb-20 z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div ref={gridRef} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureItem key={f.no} {...f} />
            ))}
          </div>
        </div>
      </section>

      <div className="h-12 w-full bg-gradient-to-t from-slate-200/50 to-transparent" />
    </main>
  );
}
