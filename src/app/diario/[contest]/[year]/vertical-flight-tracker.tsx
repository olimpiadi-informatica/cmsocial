"use client";

import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { RemoteDiario } from "~/lib/diari";

import airplaneImg from "./airplane.png";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const H = 460;

type Props = {
  postsContainer: HTMLDivElement | null;
  diario: RemoteDiario;
};

export function FixedVerticalFlightTracker({ postsContainer }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (!postsContainer) return;

      gsap.set(".vertical-trail-mask-line", {
        strokeDasharray: H,
        strokeDashoffset: H,
      });

      gsap.set(".vertical-airplane-carrier", {
        y: 0,
      });

      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: postsContainer,
          start: "top 35%",
          end: "bottom 75%",
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      tl.to(".vertical-airplane-carrier", {
        y: H,
        ease: "none",
      }).to(
        ".vertical-trail-mask-line",
        {
          strokeDashoffset: 0,
          ease: "none",
        },
        0,
      );
    },
    { scope: svgRef, dependencies: [postsContainer] },
  );

  return (
    <aside
      aria-label="Progresso di lettura diario"
      className="fixed-vertical-tracker fixed left-[max(0.75rem,calc(50vw-24rem-5.5rem))] top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:flex flex-col items-center justify-center gap-2 select-none opacity-0 transition-opacity duration-300"
      style={{ opacity: 0 }}>
      {/* Origin City / Departure */}
      <span className="text-[11px] font-mono font-bold text-stone-500 tracking-wider">
        Partenza
      </span>

      {/* SVG Straight Flight Route */}
      <div className="relative w-12 h-[460px]">
        <svg
          ref={svgRef}
          aria-hidden="true"
          className="w-full h-full overflow-visible"
          viewBox={`0 0 48 ${H}`}
          preserveAspectRatio="none">
          <defs>
            <mask id="vertical-trail-mask" maskUnits="userSpaceOnUse">
              <line
                className="vertical-trail-mask-line"
                x1="24"
                y1="0"
                x2="24"
                y2={H}
                stroke="white"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </mask>
          </defs>

          {/* Base Dashed Flight Line */}
          <line
            x1="24"
            y1="0"
            x2="24"
            y2={H}
            stroke="#a8a29e"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            strokeOpacity="0.4"
          />

          {/* Active Glowing Masked Trail that matches airplane position 1:1 */}
          <g mask="url(#vertical-trail-mask)">
            <line
              x1="24"
              y1="0"
              x2="24"
              y2={H}
              stroke="#f59e0b"
              strokeWidth="3"
              strokeOpacity="0.9"
              strokeLinecap="round"
            />
            <line
              x1="24"
              y1="0"
              x2="24"
              y2={H}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeOpacity="0.95"
              strokeDasharray="3 4"
            />
          </g>

          {/* Moving Airplane */}
          <g
            className="vertical-airplane-carrier will-change-transform"
            transform="translate(24, 0)">
            <image
              href={airplaneImg.src}
              width={30}
              height={(30 * airplaneImg.height) / airplaneImg.width}
              x={-15}
              y={(-15 * airplaneImg.height) / airplaneImg.width}
              className="rotate-90"
              style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))" }}
            />
          </g>
        </svg>
      </div>

      {/* Destination City */}
      <span className="text-[11px] font-mono font-bold text-stone-500 tracking-wider text-center max-w-[6rem] leading-tight break-words">
        Arrivo
      </span>
    </aside>
  );
}
