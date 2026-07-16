import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import gsap from "gsap";
import portraitSrc from "../../assets/Me1.png";

// Silhouette → full reveal filter values (animated via GSAP proxy)
const SILHOUETTE = {
  brightness: 0.15,
  contrast: 1.8,
  saturation: 0,
  sepia: 0,
  warmth: 0,
};

const REVEALED = {
  brightness: 1.05,
  contrast: 1.08,
  saturation: 1,
  sepia: 0.12,
  warmth: 1,
};

const PARALLAX_MAX = 10;
const HOVER_DURATION = 0.8;

function buildPortraitFilter(values) {
  const { brightness, contrast, saturation, sepia, warmth } = values;
  const rim =
    warmth > 0.05
      ? ` drop-shadow(0 0 28px rgba(200,169,106,${0.15 + warmth * 0.35})) drop-shadow(0 0 60px rgba(200,169,106,${warmth * 0.2}))`
      : " drop-shadow(0 8px 32px rgba(0,0,0,0.85)) drop-shadow(0 2px 8px rgba(0,0,0,0.9))";

  return `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia})${rim}`;
}

const HeroImage = forwardRef(function HeroImage(
  {
    src = portraitSrc,
    displayName = "SAURABH",
    autoPlay = true,
    className = "",
  },
  ref,
) {
  const containerRef = useRef(null);
  const typographyRef = useRef(null);
  const glowRef = useRef(null);
  const ambientRef = useRef(null);
  const portraitWrapRef = useRef(null);
  const portraitRef = useRef(null);

  const entranceTlRef = useRef(null);
  const hoverTlRef = useRef(null);
  const filterProxyRef = useRef({ ...SILHOUETTE });
  const isHoveringRef = useRef(false);
  const parallaxXRef = useRef(null);
  const parallaxYRef = useRef(null);

  // Expose entrance timeline for parent orchestration
  useImperativeHandle(ref, () => ({
    timeline: entranceTlRef.current,
    playEntrance: () => entranceTlRef.current?.play(),
    pauseEntrance: () => entranceTlRef.current?.pause(),
    restartEntrance: () => entranceTlRef.current?.restart(true),
  }));

  const applyPortraitFilter = () => {
    if (!portraitRef.current) return;
    portraitRef.current.style.filter = buildPortraitFilter(
      filterProxyRef.current,
    );
  };

  const resetParallax = () => {
    parallaxXRef.current?.(0);
    parallaxYRef.current?.(0);
  };

  // ---- Hover reveal: silhouette ↔ premium portrait ----
  const playHoverIn = () => {
    if (isHoveringRef.current) return;
    isHoveringRef.current = true;

    hoverTlRef.current?.kill();
    hoverTlRef.current = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    hoverTlRef.current
      .to(
        filterProxyRef.current,
        {
          ...REVEALED,
          duration: HOVER_DURATION,
          onUpdate: applyPortraitFilter,
        },
        0,
      )
      .to(
        portraitRef.current,
        {
          scale: 1.02,
          duration: HOVER_DURATION,
          transformOrigin: "center bottom",
        },
        0,
      )
      .to(
        glowRef.current,
        { opacity: 0.55, scale: 1.08, duration: HOVER_DURATION },
        0,
      )
      .to(ambientRef.current, { opacity: 0.35, duration: HOVER_DURATION }, 0);
  };

  const playHoverOut = () => {
    if (!isHoveringRef.current) return;
    isHoveringRef.current = false;

    hoverTlRef.current?.kill();
    hoverTlRef.current = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    hoverTlRef.current
      .to(
        filterProxyRef.current,
        {
          ...SILHOUETTE,
          duration: HOVER_DURATION,
          onUpdate: applyPortraitFilter,
        },
        0,
      )
      .to(
        portraitRef.current,
        {
          scale: 1,
          duration: HOVER_DURATION,
          transformOrigin: "center bottom",
        },
        0,
      )
      .to(
        glowRef.current,
        { opacity: 0.18, scale: 1, duration: HOVER_DURATION },
        0,
      )
      .to(ambientRef.current, { opacity: 0, duration: HOVER_DURATION }, 0);
  };

  // ---- Mouse parallax: physical, capped at 10px ----
  const handleMouseMove = (event) => {
    const container = containerRef.current;
    if (!container || !parallaxXRef.current || !parallaxYRef.current) return;

    const rect = container.getBoundingClientRect();
    const normX =
      (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const normY =
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    parallaxXRef.current(
      gsap.utils.clamp(-PARALLAX_MAX, PARALLAX_MAX, normX * PARALLAX_MAX),
    );
    parallaxYRef.current(
      gsap.utils.clamp(-PARALLAX_MAX, PARALLAX_MAX, normY * PARALLAX_MAX),
    );
  };

  const handleContainerLeave = () => {
    resetParallax();
    playHoverOut();
  };

  // ---- Mount: entrance timeline + parallax quickTo + cleanup ----
  useEffect(() => {
    const container = containerRef.current;
    const portraitWrap = portraitWrapRef.current;
    const portrait = portraitRef.current;
    const typography = typographyRef.current;
    const glow = glowRef.current;
    const ambient = ambientRef.current;

    if (!container || !portraitWrap || !portrait || !typography || !glow)
      return;

    filterProxyRef.current = { ...SILHOUETTE };
    applyPortraitFilter();

    gsap.set(portraitWrap, { x: 0, y: 0, force3D: true });
    gsap.set(portrait, { scale: 0.95, opacity: 0, force3D: true });
    gsap.set(typography, { opacity: 0, y: 48, force3D: true });
    gsap.set(glow, { opacity: 0.18, scale: 1, force3D: true });
    gsap.set(ambient, { opacity: 0 });

    // quickTo = responsive follow without jitter
    parallaxXRef.current = gsap.quickTo(portraitWrap, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    parallaxYRef.current = gsap.quickTo(portraitWrap, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    filterProxyRef.current = {
      brightness: 0.04,
      contrast: 2,
      saturation: 0,
      sepia: 0,
      warmth: 0,
    };
    applyPortraitFilter();

    // ---- Entrance: editorial fade-up reveal ----
    entranceTlRef.current = gsap.timeline({
      paused: !autoPlay,
      defaults: { ease: "power3.out" },
    });

    entranceTlRef.current
      // Typography settles at 0.4 (40%) opacity — this is the ONLY place
      // that controls final opacity now. Bump this single number if you
      // want it stronger/weaker; don't add opacity classes on the text
      // elements below or they'll multiply together again.
      .to(typography, { opacity: 0.4, y: 0, duration: 1.4 }, 0)
      .to(portrait, { opacity: 1, scale: 1, duration: 1.6 }, 0.15)
      .to(
        filterProxyRef.current,
        {
          brightness: SILHOUETTE.brightness,
          contrast: SILHOUETTE.contrast,
          saturation: SILHOUETTE.saturation,
          duration: 1.8,
          onUpdate: applyPortraitFilter,
        },
        0.25,
      );

    return () => {
      entranceTlRef.current?.kill();
      hoverTlRef.current?.kill();
      parallaxXRef.current = null;
      parallaxYRef.current = null;
    };
  }, [autoPlay]);

  const nameParts = displayName.trim().split(/\s+/);
  const useStackedName = nameParts.length > 1;

  return (
    <div
      ref={containerRef}
      // h-screen: full 100vh. Your navbar is fixed/sticky, so it
      // doesn't take up space in the document flow — this section
      // already starts at the very top of the page, same as the
      // navbar's overlay origin. Using the full viewport height (with
      // no subtraction) is what makes the bottom edge land exactly on
      // the window's bottom edge, with the navbar floating on top.
      className={`relative flex h-screen w-full items-center justify-center ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleContainerLeave}
      aria-hidden={!src}
    >
      {/* Layer 1 — Monumental typography (behind everything) */}
      <div
        ref={typographyRef}
        className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center"
        aria-hidden="true"
      >
        {useStackedName ? (
          <div
            className="flex flex-col items-center leading-[0.82] tracking-[0.25em] text-[#C8A96A] sm:tracking-[0.34em] font-Anton uppercase"
            style={{ fontWeight: 900 }}
          >
            <span className="text-[clamp(3.5rem,16vw,11rem)] ">
              {nameParts[0]}
            </span>
            <span className="text-[clamp(3rem,14vw,9.5rem)]">
              {nameParts.slice(1).join(" ")}
            </span>
          </div>
        ) : (
          <span
            className="text-center text-[clamp(3.5rem,18vw,12rem)] leading-none tracking-[0.25em] text-[#C8A96A] sm:tracking-[0.34em] font-Anton uppercase"
            style={{ fontWeight: 900 }}
          >
            {displayName}
          </span>
        )}
      </div>

      {/* Layer 2 — Blue ambient + golden glow */}
      <div
        ref={ambientRef}
        className="pointer-events-none absolute z-[1] h-[55%] w-[70%] max-w-2xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.22)_0%,transparent_70%)] blur-2xl will-change-[opacity,transform]"
        aria-hidden="true"
      />

      <div
        ref={glowRef}
        className="pointer-events-none absolute z-[2] h-[62%] w-[58%] max-w-xl rounded-full bg-[radial-gradient(ellipse_at_center,rgba(200,169,106,0.45)_0%,rgba(200,169,106,0.08)_45%,transparent_72%)] blur-3xl will-change-[opacity,transform]"
        aria-hidden="true"
      />

      {/* Layer 3 — Portrait with parallax + hover reveal */}
      <div
        ref={portraitWrapRef}
        className="relative z-[3] h-full will-change-transform"
        onMouseEnter={playHoverIn}
        onMouseLeave={playHoverOut}
      >
        {src ? (
          <img
            ref={portraitRef}
            src={src}
            alt=""
            draggable={false}
            // Width: 72-78% of viewport, generous max-w so it never
            // artificially plateaus like the old fixed px caps did.
            // Height: h-full now resolves against the wrapper's real
            // height (inherited from the container above), so
            // object-cover actually has something to crop into.
            className="mx-auto block h-full w-[72vw] max-w-[1800px] object-cover object-bottom will-change-[transform,filter] sm:w-[74vw] md:w-[76vw] lg:w-[78vw]"
            style={{
              filter: buildPortraitFilter(SILHOUETTE),
              transform: "translateZ(0)",
            }}
          />
        ) : (
          <div
            ref={portraitRef}
            className="mx-auto flex h-full w-[72vw] max-w-[1800px] items-end justify-center sm:w-[74vw] md:w-[76vw] lg:w-[78vw]"
            aria-label="Portrait placeholder"
          >
            <div className="h-[92%] w-[72%] rounded-t-[40%] bg-[#151515] opacity-40" />
          </div>
        )}
      </div>
    </div>
  );
});

export default HeroImage;
