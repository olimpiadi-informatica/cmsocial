"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";

import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ChevronUp, Mouse } from "lucide-react";

import type { Post, RemoteDiario } from "~/lib/diari";

import airplaneImg from "./airplane.png";
import bookStyles from "./book.module.css";
import { Cooked, CookedLoading } from "./cooked";
import { FixedVerticalFlightTracker } from "./vertical-flight-tracker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, useGSAP);
}

const FLIGHT_PATH_D =
  "M -140,650 C 140,520 280,180 540,180 C 800,180 820,680 1060,680 C 1280,680 1420,400 1620,200";

type Props = {
  contest: string;
  year: string;
  diario: RemoteDiario;
  postsData: Promise<Post[]>;
};

export default function DiaryBookView({ contest, year, diario, postsData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [postsContainer, setPostsContainer] = useState<HTMLDivElement | null>(null);
  const contestTitle = diario.name || contest.toUpperCase();

  useGSAP(
    () => {
      // 1. Initial setup
      gsap.set(".book-cover", {
        transformOrigin: "left center",
        rotateY: 0,
        opacity: 1,
      });

      gsap.set(".cover-front-face", {
        opacity: 1,
      });

      // Setup Airplane & Ribbon Trail
      const trailPath = containerRef.current?.querySelector<SVGPathElement>(".airplane-trail-path");
      const pathLength = trailPath?.getTotalLength() ?? 3200;

      gsap.set(".airplane-trail-mask-path", {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.set(".airplane-carrier", {
        opacity: 0,
      });

      gsap.set(".airplane-body-group", {
        scale: 1,
        transformOrigin: "center center",
      });

      gsap.set(".airplane-shadow-group", {
        transformOrigin: "center center",
      });

      gsap.set([".back-to-top-btn", ".fixed-vertical-tracker"], {
        opacity: 0,
        scale: 0.75,
        pointerEvents: "none",
      });

      // 2. Tactile Drop on Workbench with Gold Shimmer
      const introTl = gsap.timeline({
        defaults: { ease: "power2.out" },
      });

      introTl
        .fromTo(
          ".book-wrapper",
          {
            y: -35,
            scale: 1.08,
            opacity: 0,
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.95,
            ease: "power2.out",
          },
        )
        .fromTo(
          `.${bookStyles.goldEmboss}`,
          {
            backgroundPosition: "220% center",
          },
          {
            backgroundPosition: "0% center",
            duration: 1.5,
            ease: "power1.inOut",
          },
          "-=0.5",
        )
        .fromTo(
          ".top-bar",
          {
            opacity: 0,
            y: -10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.9",
        )
        .fromTo(
          ".scroll-indicator",
          {
            opacity: 0,
            y: 10,
          },
          {
            opacity: 0.6,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.7",
        );

      // 3. Main ScrollTrigger timeline for opening the book & expanding to fullscreen
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1600",
          pin: ".pin-section",
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Step 1: Top bar and scroll indicator fade out on initial scroll
      tl.to(
        [".top-bar", ".scroll-indicator"],
        {
          opacity: 0,
          y: -15,
          duration: 0.3,
          ease: "power1.out",
        },
        0,
      );

      // Step 2: Cover rotates in 3D to the left (opens up)
      tl.to(
        ".book-cover",
        {
          rotateY: -160,
          duration: 1.6,
          ease: "power2.inOut",
        },
        0.1,
      );

      // Hide front face as soon as it passes 85 degrees to prevent mirroring
      tl.to(
        ".cover-front-face",
        {
          opacity: 0,
          duration: 0.05,
          ease: "none",
        },
        0.9,
      );

      // Cover fades out once opened to clear full view
      tl.to(
        ".cover-back-face",
        {
          opacity: 0,
          duration: 0.4,
          ease: "power1.out",
        },
        1.3,
      );

      // Step 3: Expand book wrapper smoothly to cover 100% of the window
      tl.to(
        ".book-wrapper",
        {
          width: "100%",
          height: "100%",
          marginBottom: 0,
          duration: 1.8,
          ease: "power2.inOut",
        },
        0.4,
      );
      tl.to(
        ".book-wrapper",
        {
          borderRadius: 0,
          duration: 1.0,
          ease: "power2.inOut",
        },
        0.8,
      );

      // Step 4: Airplane flight animation along the ribbon loop
      // Starts as cover begins opening (t=0.05) and exits right as posts become visible (t=1.75)
      tl.set(".airplane-carrier", { opacity: 1 }, 0.05);

      tl.to(
        ".airplane-carrier",
        {
          motionPath: {
            path: "#airplane-flight-path",
            align: "#airplane-flight-path",
            autoRotate: 45,
            alignOrigin: [0.5, 0.5],
          },
          duration: 1.7,
          ease: "none",
        },
        0.05,
      );

      tl.to(
        ".airplane-trail-mask-path",
        {
          strokeDashoffset: 0,
          duration: 1.7,
          ease: "none",
        },
        0.05,
      );

      // Dynamic 3D altitude scale and soft shadow along the S-wave
      tl.to(
        ".airplane-body-group",
        {
          scale: 1.15,
          duration: 0.45,
          ease: "power1.out",
        },
        0.35,
      );
      tl.to(
        ".airplane-body-group",
        {
          scale: 1.0,
          duration: 0.55,
          ease: "power1.inOut",
        },
        0.8,
      );

      tl.to(
        ".airplane-shadow-group",
        {
          x: 18,
          y: 24,
          opacity: 0.22,
          scale: 0.9,
          duration: 0.45,
          ease: "power1.out",
        },
        0.35,
      );
      tl.to(
        ".airplane-shadow-group",
        {
          x: 10,
          y: 16,
          opacity: 0.35,
          scale: 1.0,
          duration: 0.55,
          ease: "power1.inOut",
        },
        0.8,
      );

      // Ribbon trail dissolves smoothly as airplane zooms away
      tl.to(
        ".airplane-trail-group",
        {
          opacity: 0,
          duration: 0.35,
          ease: "power1.out",
        },
        1.45,
      );

      // Step 5: Spine crease fades out as it expands to full screen
      tl.to(
        ".paper-spine-crease",
        {
          opacity: 0,
          duration: 0.8,
          ease: "power1.out",
        },
        1.0,
      );

      // Step 6: Seamless handoff to main content when fully expanded
      tl.to(
        ".pin-section",
        {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.5,
          ease: "power2.in",
        },
        1.45,
      );

      // Step 7: Back to top button & vertical flight tracker appear only once initial animation is complete and posts are fully visible
      tl.to(
        [".back-to-top-btn", ".fixed-vertical-tracker"],
        {
          opacity: 1,
          scale: 1,
          pointerEvents: "auto",
          duration: 0.3,
          ease: "power2.out",
        },
        1.85,
      );
    },
    { scope: containerRef },
  );

  const handleScrollToFirstPost = () => {
    const postsEl = document.getElementById("posts-container");
    if (postsEl) {
      postsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#fbf9f5] text-stone-900 pointer-events-none">
      {/* ========================================================================= */}
      {/* 1. PINNED 3D STAGE (Animates book opening & zoom to fullscreen)            */}
      {/* ========================================================================= */}
      <section
        className={clsx(
          "pin-section relative w-full h-screen flex flex-col items-center justify-center overflow-hidden transition-colors z-20",
          bookStyles.perspectiveContainer,
          bookStyles.blueprintContainer,
        )}>
        {/* Ambient Top Bar (shown when book is closed) */}
        <div
          className="top-bar absolute top-6 left-6 z-40 transition-opacity duration-300 pointer-events-auto opacity-0"
          style={{ opacity: 0 }}>
          <Link
            href="/diari/1"
            className="inline-flex items-center gap-2 text-sm text-stone-300 hover:text-amber-300 transition-colors bg-stone-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-stone-800 shadow-lg">
            <ArrowLeft className="w-4 h-4" />
            Tutti i diari
          </Link>
        </div>

        {/* 3D Book Container */}
        <div
          className={clsx(
            "book-wrapper relative rounded-r-[1.25rem] will-change-transform flex items-stretch justify-stretch opacity-0 mb-[calc(100vh-100dvh)]",
            bookStyles.preserve3d,
            bookStyles.bookSize,
          )}
          style={{ transformOrigin: "center center", opacity: 0 }}>
          {/* ----------------------------------------------------------------------- */}
          {/* FRONT COVER (Rotates open in 3D)                                        */}
          {/* ----------------------------------------------------------------------- */}
          <div className={clsx("book-cover", bookStyles.bookCover)}>
            {/* Front Face */}
            <div
              className={clsx(
                "cover-front-face",
                bookStyles.coverFront,
                "flex flex-col items-center justify-center p-6 sm:p-8 border-t border-r border-b border-amber-500/30 text-stone-100 shadow-2xl select-none",
              )}>
              {/* Spine crease shadow on left */}
              <div className={clsx("absolute inset-y-0 left-0 w-8 z-20", bookStyles.spineShadow)} />

              {/* Decorative Golden Borders */}
              <div className="cover-ornament absolute inset-3.5 sm:inset-4 rounded-xl border border-amber-500/25 pointer-events-none" />
              <div className="cover-ornament absolute inset-4.5 sm:inset-5 rounded-lg border border-amber-400/15 pointer-events-none" />

              {/* Centered Cover Title */}
              <div
                className={clsx(
                  "cover-title relative z-10 text-center px-4",
                  bookStyles.coverTitle,
                )}>
                <h1
                  className={clsx(
                    "text-[length:4.5vh] font-serif font-black tracking-wider leading-relaxed",
                    bookStyles.goldEmboss,
                  )}>
                  <div className="font-bold tracking-widest uppercase">DIARIO</div>
                  <div className="text-[1.25em]">
                    {contestTitle} {year}
                  </div>
                </h1>
              </div>
            </div>

            {/* Back Face of Cover */}
            <div
              className={clsx(
                "cover-back-face",
                bookStyles.coverBack,
                "border-l border-stone-700 shadow-inner p-6 flex items-center justify-center",
              )}>
              <div className="w-full h-full border border-stone-800 rounded-l-xl bg-[#12100e] flex items-center justify-center p-4 text-stone-400 text-xs text-center font-mono select-none">
                {contestTitle} {year} • {diario.city || "Olimpiadi di Informatica"}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* INSIDE PAGE BACKGROUND (Inside 3D Book)                                  */}
          {/* ----------------------------------------------------------------------- */}
          <div
            className={clsx(
              "diary-page relative size-full text-stone-900 rounded-r-[1.25rem] border border-stone-300 shadow-inner z-10 flex flex-col overflow-hidden",
              bookStyles.paperBg,
            )}>
            {/* Paper inner spine crease */}
            <div
              className={clsx(
                "paper-spine-crease absolute inset-y-0 left-0 w-8 z-20 transition-opacity",
                bookStyles.paperInnerSpine,
              )}
            />
          </div>
        </div>

        {/* Airplane Flight & Ribbon Loop Stage */}
        <svg
          className="absolute inset-0 size-full pointer-events-none z-30 overflow-visible"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true">
          <defs>
            {/* Mask to reveal the trail progressively behind the plane */}
            <mask id="airplane-trail-mask" maskUnits="userSpaceOnUse">
              <path
                className="airplane-trail-mask-path"
                d={FLIGHT_PATH_D}
                fill="none"
                stroke="white"
                strokeWidth="45"
                strokeLinecap="round"
                style={{ strokeDasharray: 3200, strokeDashoffset: 3200 }}
              />
            </mask>
            <filter id="plane-trail-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Hidden reference path for GSAP motionPath */}
          <path
            id="airplane-flight-path"
            className="airplane-trail-path opacity-0 pointer-events-none"
            d={FLIGHT_PATH_D}
            fill="none"
            stroke="none"
          />

          {/* Masked flight trails */}
          <g className="airplane-trail-group" mask="url(#airplane-trail-mask)">
            {/* Outer soft ambient vapor glow */}
            <path
              d={FLIGHT_PATH_D}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="14"
              strokeOpacity="0.35"
              filter="url(#plane-trail-glow)"
            />
            {/* Core bright vapor streak */}
            <path
              d={FLIGHT_PATH_D}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeOpacity="0.95"
              strokeDasharray="6 8"
            />
          </g>

          {/* Airplane Carrier */}
          <g className="airplane-carrier will-change-transform opacity-0" style={{ opacity: 0 }}>
            {/* Dynamic 3D Altitude Shadow */}
            <g className="airplane-shadow-group" transform="translate(10, 16)" opacity="0.35">
              <image
                href={airplaneImg.src}
                width={105}
                height={(105 * airplaneImg.height) / airplaneImg.width}
                x={-52.5}
                y={(-52.5 * airplaneImg.height) / airplaneImg.width}
                className="brightness-0 blur-[3px]"
              />
            </g>
            {/* Main Airplane Body */}
            <g className="airplane-body-group">
              <image
                href={airplaneImg.src}
                width={105}
                height={(105 * airplaneImg.height) / airplaneImg.width}
                x={-52.5}
                y={(-52.5 * airplaneImg.height) / airplaneImg.width}
                style={{ filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.22))" }}
              />
            </g>
          </g>
        </svg>

        {/* Scroll Indicator */}
        <div
          className="scroll-indicator absolute bottom-[calc(1.5rem+100vh-100dvh)] z-40 opacity-0 flex items-center gap-2 text-sm text-stone-300 select-none animate-pulse"
          style={{ opacity: 0 }}>
          <Mouse className="w-4 h-4" />
          <span>Scorri verso il basso</span>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. POSTS CONTENT (Flows naturally in document - single native scrollbar)  */}
      {/* ========================================================================= */}
      <main className="relative w-full bg-[#fbf9f5] text-stone-900 z-10 -mt-[100vh] pointer-events-auto">
        <div className="w-full max-w-3xl mx-auto px-6 sm:px-10 pb-24">
          {/* Back to all diaries link */}
          <div className="mb-4 sm:mb-6">
            <Link
              href="/diari/1"
              className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-blue-700 font-medium transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Tutti i diari
            </Link>
          </div>

          {/* All Posts */}
          <Suspense fallback={<CookedLoading />}>
            <Cooked postsData={postsData} onContainerMount={setPostsContainer} />
          </Suspense>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE OVERLAYS: FIXED VERTICAL FLIGHT TRACKER & BACK TO TOP      */}
      {/* ========================================================================= */}
      {/* Fixed Vertical Flight Tracker on desktop (>= 1024px) */}
      <FixedVerticalFlightTracker postsContainer={postsContainer} diario={diario} />

      {/* Simple Back to Top Button */}
      <button
        type="button"
        onClick={handleScrollToFirstPost}
        aria-label="Torna al primo post"
        className="back-to-top-btn fixed bottom-6 right-6 z-40 opacity-0 scale-75 pointer-events-none p-3 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-amber-300 border border-stone-700/80 hover:border-amber-500/50 rounded-full shadow-2xl transition-all duration-200 group"
        style={{ opacity: 0 }}>
        <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
      </button>
    </div>
  );
}
