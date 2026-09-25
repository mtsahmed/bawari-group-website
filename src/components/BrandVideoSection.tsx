"use client";

import { useEffect, useRef, useState } from "react";

type BrandVideoSectionProps = {
  title: string;
  subtitle: string;
  src: string;
};

export default function BrandVideoSection({
  title,
  subtitle,
  src,
}: BrandVideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  // Defer loading the ~47MB video until the section nears the viewport, and
  // pause it while scrolled away — it's a decorative loop, not content worth
  // spending battery/bandwidth on off-screen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          setIsVisible(true);
          setHasRevealed(true);
        } else {
          setIsVisible(false);
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion) return;
    if (isVisible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible, reducedMotion]);

  const revealed = hasRevealed || reducedMotion;

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-[80vh] min-h-[520px] items-center justify-center overflow-hidden bg-brand-charcoal"
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          autoPlay={!reducedMotion}
          aria-hidden="true"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/85 via-brand-charcoal/25 to-brand-charcoal/60" />
      <div
        className={`relative z-10 mx-auto max-w-3xl px-6 text-center text-white transition-all duration-700 ease-out ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
