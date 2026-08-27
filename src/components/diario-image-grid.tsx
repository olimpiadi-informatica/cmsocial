"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import clsx from "clsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type DiarioImage = {
  src: string;
  thumbSrc: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  dominantColor?: string;
};

type DiarioImageGridProps = {
  images?: string | DiarioImage[];
};

const ROTATIONS = [
  "-rotate-1",
  "rotate-1",
  "-rotate-[0.6deg]",
  "rotate-[1.4deg]",
  "-rotate-[1.2deg]",
  "rotate-[0.8deg]",
];

export function DiarioImageGrid({ images }: DiarioImageGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imageList: DiarioImage[] = useMemo(() => {
    if (!images) return [];
    if (typeof images === "string") {
      try {
        return JSON.parse(images) as DiarioImage[];
      } catch {
        return [];
      }
    }
    return images;
  }, [images]);

  const totalImages = imageList.length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;

      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : totalImages - 1));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < totalImages - 1 ? prev + 1 : 0));
      }
    },
    [lightboxIndex, totalImages],
  );

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, handleKeyDown]);

  if (totalImages === 0) {
    return null;
  }

  // When more than 6 images, display 6 cards with +N overlay on the 6th
  const isCapped = totalImages > 6;
  const visibleImages = isCapped ? imageList.slice(0, 6) : imageList;
  const hiddenCount = totalImages - 5; // e.g. if 11 photos, 5 shown + 6 hidden = +6

  const currentLightboxImage = lightboxIndex === null ? null : imageList[lightboxIndex];

  return (
    <>
      <div className="my-8 not-prose">
        {/* 1 Image layout */}
        {totalImages === 1 && (
          <div className="flex justify-center">
            <PolaroidCard
              image={imageList[0]}
              rotationClass="-rotate-0.5"
              onClick={() => setLightboxIndex(0)}
              className="max-w-md w-full"
            />
          </div>
        )}

        {/* 2 Images layout */}
        {totalImages === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            <PolaroidCard
              image={imageList[0]}
              rotationClass="-rotate-1.5"
              onClick={() => setLightboxIndex(0)}
            />
            <PolaroidCard
              image={imageList[1]}
              rotationClass="rotate-1.5"
              onClick={() => setLightboxIndex(1)}
            />
          </div>
        )}

        {/* 3 Images layout */}
        {totalImages === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {imageList.map((img, idx) => (
              <PolaroidCard
                key={idx}
                image={img}
                rotationClass={ROTATIONS[idx % ROTATIONS.length]}
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}

        {/* 4 Images layout */}
        {totalImages === 4 && (
          <div className="grid grid-cols-2 gap-4 items-center">
            {imageList.map((img, idx) => (
              <PolaroidCard
                key={idx}
                image={img}
                rotationClass={ROTATIONS[idx % ROTATIONS.length]}
                onClick={() => setLightboxIndex(idx)}
              />
            ))}
          </div>
        )}

        {/* 5+ Images layout */}
        {totalImages >= 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
            {visibleImages.map((img, idx) => {
              const isLastWithOverlay = isCapped && idx === 5;
              return (
                <PolaroidCard
                  key={idx}
                  image={img}
                  rotationClass={ROTATIONS[idx % ROTATIONS.length]}
                  onClick={() => setLightboxIndex(idx)}
                  overlay={
                    isLastWithOverlay ? (
                      <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs flex flex-col items-center justify-center text-white rounded-xs transition-all group-hover:bg-stone-900/75">
                        <span className="text-xl sm:text-2xl font-bold">+{hiddenCount}</span>
                        <span className="text-xs font-medium tracking-wide uppercase opacity-90 mt-0.5">
                          Altre foto
                        </span>
                      </div>
                    ) : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal rendered via Portal into body to bypass any parent stacking contexts */}
      {lightboxIndex !== null &&
        currentLightboxImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[9999] bg-stone-950/92 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200">
            {/* Background backdrop click to close */}
            <button
              type="button"
              aria-label="Chiudi lightbox"
              onClick={() => setLightboxIndex(null)}
              className="absolute inset-0 w-full h-full cursor-default"
            />

            {/* Top Bar */}
            <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 z-10 pointer-events-auto">
              {/* Indicator A / B with solid contrast badge */}
              <div className="px-3 py-1.5 rounded-full bg-stone-900/90 border border-white/15 text-xs sm:text-sm font-medium tracking-wide shadow-sm flex items-center">
                <span className="font-semibold text-white">{lightboxIndex + 1}</span>
                <span className="text-stone-400 mx-1.5">/</span>
                <span className="text-stone-300">{totalImages}</span>
              </div>

              {/* Close button with solid contrast badge matching indicator */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Chiudi (Esc)"
                title="Chiudi (Esc)"
                className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-900/90 hover:bg-stone-800 border border-white/15 text-white shadow-sm transition-all hover:scale-105">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Main Viewer Area */}
            <div className="relative flex-1 flex items-center justify-center px-4 sm:px-14 min-h-0 z-10 pointer-events-none">
              {/* Prev Button */}
              {totalImages > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null && prev > 0 ? prev - 1 : totalImages - 1,
                    )
                  }
                  aria-label="Foto precedente (←)"
                  title="Foto precedente (←)"
                  className="pointer-events-auto absolute left-2 sm:left-4 z-10 p-2.5 sm:p-3 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white backdrop-blur-xs border border-white/15 shadow-lg transition-all hover:scale-105">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
              )}

              {/* Current Image Container */}
              <div className="relative max-h-full max-w-full flex items-center justify-center p-2 pointer-events-auto">
                <img
                  key={currentLightboxImage.src}
                  src={currentLightboxImage.src}
                  alt={currentLightboxImage.alt || "Foto diario"}
                  style={{
                    backgroundColor: currentLightboxImage.dominantColor
                      ? `#${currentLightboxImage.dominantColor}`
                      : undefined,
                  }}
                  className="max-h-[75vh] max-w-[88vw] object-contain rounded-xs shadow-2xl transition-transform duration-200"
                />
              </div>

              {/* Next Button */}
              {totalImages > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev !== null && prev < totalImages - 1 ? prev + 1 : 0,
                    )
                  }
                  aria-label="Foto successiva (→)"
                  title="Foto successiva (→)"
                  className="pointer-events-auto absolute right-2 sm:right-4 z-10 p-2.5 sm:p-3 rounded-full bg-stone-900/90 hover:bg-stone-800 text-white backdrop-blur-xs border border-white/15 shadow-lg transition-all hover:scale-105">
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Bottom Bar: Thumbnail Strip */}
            <div className="relative flex flex-col items-center gap-3 px-4 py-3 sm:py-4 z-10 bg-gradient-to-t from-stone-950/90 to-transparent pointer-events-auto">
              {/* Thumbnail Strip */}
              {totalImages > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full px-4 py-1 scrollbar-none">
                  {imageList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className={clsx(
                        "relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-xs overflow-hidden border-2 transition-all",
                        lightboxIndex === idx
                          ? "border-amber-400 scale-105 shadow-md shadow-amber-400/20"
                          : "border-transparent opacity-50 hover:opacity-100",
                      )}>
                      <img
                        src={img.thumbSrc || img.src}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function PolaroidCard({
  image,
  rotationClass,
  onClick,
  className,
  overlay,
}: {
  image: DiarioImage;
  rotationClass?: string;
  onClick: () => void;
  className?: string;
  overlay?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "group relative cursor-pointer text-left w-full block bg-white p-2.5 sm:p-3 pb-3 sm:pb-3.5 rounded-xs border border-stone-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:z-20",
        rotationClass,
        className,
      )}>
      {/* Washi Tape strip on top */}
      <div
        className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-4 sm:h-5 bg-amber-100/80 backdrop-blur-xs shadow-xs pointer-events-none z-10 opacity-90"
        style={{
          clipPath:
            "polygon(0% 0%, 5% 2px, 10% 0%, 15% 2px, 20% 0%, 25% 2px, 30% 0%, 35% 2px, 40% 0%, 45% 2px, 50% 0%, 55% 2px, 60% 0%, 65% 2px, 70% 0%, 75% 2px, 80% 0%, 85% 2px, 90% 0%, 95% 2px, 100% 0%, 100% 100%, 95% calc(100% - 2px), 90% 100%, 85% calc(100% - 2px), 80% 100%, 75% calc(100% - 2px), 70% 100%, 65% calc(100% - 2px), 60% 100%, 55% calc(100% - 2px), 50% 100%, 45% calc(100% - 2px), 40% 100%, 35% calc(100% - 2px), 30% 100%, 25% calc(100% - 2px), 20% 100%, 15% calc(100% - 2px), 10% 100%, 5% calc(100% - 2px), 0% 100%)",
        }}
      />

      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-xs bg-stone-100 aspect-4/3 flex items-center justify-center"
        style={{
          backgroundColor: image.dominantColor ? `#${image.dominantColor}` : undefined,
        }}>
        <img
          src={image.thumbSrc || image.src}
          alt={image.alt || "Foto diario"}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {overlay}
      </div>
    </button>
  );
}
