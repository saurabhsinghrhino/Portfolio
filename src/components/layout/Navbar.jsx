import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const BRAND = "SRBX.";

// Each link now carries the id of the section it should scroll to.
// You need a matching id="..." on the actual section element in your
// page (e.g. <section id="projects">...</section>).
const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "About Me", id: "about" },
  { label: "Projects", id: "projects" },
  { label: "Contact Me", id: "contact" },
];

const MOBILE_BREAKPOINT = 550;

// How much space to leave above the target section so the fixed
// navbar doesn't cover its heading. Bump this if links still land a
// bit too high/low under the pill-shaped nav.
const SCROLL_OFFSET = 100;

export default function Navbar() {
  const wrapperRef = useRef(null);
  const navRef = useRef(null);
  const brandRef = useRef(null);
  const dividerRef = useRef(null);
  const listRef = useRef(null);
  const pillRef = useRef(null);
  const linkRefs = useRef([]);
  const charRefs = useRef(NAV_LINKS.map(() => []));

  const menuBtnRef = useRef(null);
  const barRefs = useRef([]);
  const mobileMenuRef = useRef(null);
  const mobileLinkRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMobileMenuOpenRef = useRef(false);
  const mobileMenuTweenRef = useRef(null);
  const wasMobileRef = useRef(
    typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
  );
  const lastScrollYRef = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );
  const navVisibleRef = useRef(true);

  const displayIndex = hoveredIndex ?? activeIndex;

  // ---- Smooth-scroll to a section by id, offset for the fixed navbar ----
  const scrollToSection = useCallback((id) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  const movePill = useCallback((index) => {
    if (window.innerWidth < MOBILE_BREAKPOINT) return;

    const el = linkRefs.current[index];
    const container = listRef.current;
    if (!el || !container || !pillRef.current) return;

    const elBox = el.getBoundingClientRect();
    const containerBox = container.getBoundingClientRect();

    gsap.to(pillRef.current, {
      x: elBox.left - containerBox.left,
      width: elBox.width,
      duration: 0.45,
      ease: "power3.out",
    });
  }, []);

  const animateHamburger = useCallback((open) => {
    const [top, middle, bottom] = barRefs.current;
    if (!top || !middle || !bottom) return;

    gsap.to(top, {
      y: open ? 8 : 0,
      rotation: open ? 45 : 0,
      duration: 0.35,
      ease: "power3.inOut",
    });
    gsap.to(middle, {
      opacity: open ? 0 : 1,
      scaleX: open ? 0 : 1,
      duration: 0.25,
      ease: "power2.inOut",
    });
    gsap.to(bottom, {
      y: open ? -8 : 0,
      rotation: open ? -45 : 0,
      duration: 0.35,
      ease: "power3.inOut",
    });
  }, []);

  const openMobileMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    const links = mobileLinkRefs.current.filter(Boolean);
    if (!menu) return;

    isMobileMenuOpenRef.current = true;
    setIsMobileMenuOpen(true);

    mobileMenuTweenRef.current?.kill();

    gsap.set(menu, { pointerEvents: "auto" });

    mobileMenuTweenRef.current = gsap.timeline();
    mobileMenuTweenRef.current
      .to(menu, {
        height: "auto",
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      })
      .fromTo(
        links,
        { x: -24, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.07,
          ease: "power2.out",
        },
        "-=0.2",
      );

    animateHamburger(true);
  }, [animateHamburger]);

  const closeMobileMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    const links = mobileLinkRefs.current.filter(Boolean);
    if (!menu) return;

    isMobileMenuOpenRef.current = false;
    setIsMobileMenuOpen(false);

    mobileMenuTweenRef.current?.kill();

    mobileMenuTweenRef.current = gsap.timeline({
      onComplete: () => {
        gsap.set(menu, { pointerEvents: "none", height: 0 });
      },
    });

    mobileMenuTweenRef.current
      .to(links, {
        x: -16,
        opacity: 0,
        duration: 0.2,
        stagger: 0.04,
        ease: "power2.in",
      })
      .to(
        menu,
        {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power3.in",
        },
        "-=0.05",
      );

    animateHamburger(false);
  }, [animateHamburger]);

  const toggleMobileMenu = useCallback(() => {
    gsap.fromTo(
      menuBtnRef.current,
      { scale: 0.88 },
      { scale: 1, duration: 0.45, ease: "elastic.out(1, 0.55)" },
    );

    if (isMobileMenuOpenRef.current) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }, [closeMobileMenu, openMobileMenu]);

  const handleMenuBtnEnter = () => {
    gsap.to(menuBtnRef.current, {
      scale: 1.08,
      borderColor: "rgba(251, 191, 36, 0.45)",
      boxShadow: "0 0 18px rgba(251, 191, 36, 0.25)",
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(barRefs.current.filter(Boolean), {
      backgroundColor: "#fbbf24",
      stagger: 0.04,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMenuBtnLeave = () => {
    gsap.to(menuBtnRef.current, {
      scale: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
      boxShadow: "0 0 0 rgba(251, 191, 36, 0)",
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(barRefs.current.filter(Boolean), {
      backgroundColor: "#ffffff",
      stagger: 0.04,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleMobileLinkEnter = (index) => {
    gsap.to(mobileLinkRefs.current[index], {
      x: 6,
      color: "#fbbf24",
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMobileLinkLeave = (index) => {
    gsap.to(mobileLinkRefs.current[index], {
      x: 0,
      color: index === activeIndex ? "#000000" : "rgba(255, 255, 255, 0.7)",
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleMobileLinkClick = (index) => {
    setActiveIndex(index);
    scrollToSection(NAV_LINKS[index].id);
    gsap.fromTo(
      mobileLinkRefs.current[index],
      { scale: 0.96 },
      { scale: 1, duration: 0.35, ease: "back.out(2)" },
    );
    closeMobileMenu();
  };

  const handleDesktopLinkClick = (index) => {
    setActiveIndex(index);
    scrollToSection(NAV_LINKS[index].id);
  };

  useEffect(() => {
    movePill(displayIndex);

    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;

      if (wasMobileRef.current !== mobile) {
        if (isMobileMenuOpenRef.current) {
          closeMobileMenu();
        }
        wasMobileRef.current = mobile;
      }

      if (!mobile) {
        movePill(displayIndex);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMobileMenu, displayIndex, movePill]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          clearProps: "opacity",
        },
      );
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    gsap.set(mobileMenuRef.current, {
      height: 0,
      opacity: 0,
      pointerEvents: "none",
    });
  }, []);

  // ---- Scroll direction: hide on scroll-down, reveal on scroll-up ----
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const lastY = lastScrollYRef.current;
        const wrapper = wrapperRef.current;
        const delta = currentY - lastY;

        // Ignore tiny jitters (trackpad momentum, mobile bounce) so the
        // nav doesn't flicker on scroll positions that barely moved.
        if (wrapper && Math.abs(delta) > 4) {
          if (delta < 0 && !navVisibleRef.current) {
            // scrolling up -> reveal
            navVisibleRef.current = true;
            gsap.to(wrapper, {
              y: 0,
              autoAlpha: 1,
              duration: 0.4,
              ease: "power3.out",
            });
          } else if (delta > 0 && navVisibleRef.current && currentY > 80) {
            // scrolling down -> hide (skip near the very top so it
            // doesn't vanish right as the page loads)
            navVisibleRef.current = false;
            gsap.to(wrapper, {
              y: -100,
              autoAlpha: 0,
              duration: 0.4,
              ease: "power3.out",
            });
          }
        }

        lastScrollYRef.current = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed top-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 flex-col gap-2 min-[550px]:w-auto min-[550px]:max-w-none"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <nav
        ref={navRef}
        className="flex w-full items-center justify-between gap-4 rounded-full border border-white/10 bg-white/6 px-5 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl min-[550px]:w-auto min-[550px]:justify-center min-[550px]:gap-4 min-[550px]:px-4 md:gap-6 md:px-5 lg:gap-10 lg:px-6"
        style={{ opacity: 0 }}
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleDesktopLinkClick(0);
          }}
        >
          <span
            ref={brandRef}
            className="select-none text-base font-semibold tracking-tight whitespace-nowrap text-white min-[550px]:text-lg"
          >
            <span className="text-amber-400">/</span>
            {BRAND}
          </span>
        </a>

        <div
          ref={dividerRef}
          className="hidden h-5 w-px origin-center bg-white/10 min-[550px]:block"
        />

        <ul
          ref={listRef}
          className="relative hidden min-w-0 items-center gap-1 text-sm min-[550px]:flex min-[550px]:gap-1 md:gap-2"
        >
          <div
            ref={pillRef}
            className="absolute top-0 left-0 h-full rounded-full bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.55)]"
            style={{ zIndex: 0, width: 0 }}
          />

          {NAV_LINKS.map((link, i) => (
            <li
              key={link.id}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative z-10"
            >
              <a
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleDesktopLinkClick(i);
                }}
                className={`block cursor-pointer rounded-full px-4 py-2 font-bold font-Khand transition-all duration-400 ease-in-out whitespace-nowrap  ${
                  i === displayIndex
                    ? "font-medium text-black"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label.split("").map((char, ci) => (
                  <span
                    key={ci}
                    ref={(el) => {
                      charRefs.current[i][ci] = el;
                    }}
                    className="inline-block"
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </a>
            </li>
          ))}
        </ul>

        <button
          ref={menuBtnRef}
          type="button"
          className="relative flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 min-[550px]:hidden"
          onClick={toggleMobileMenu}
          onMouseEnter={handleMenuBtnEnter}
          onMouseLeave={handleMenuBtnLeave}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              ref={(el) => {
                barRefs.current[i] = el;
              }}
              className="block h-0.5 w-5 origin-center rounded-full bg-white"
            />
          ))}
        </button>
      </nav>
      <div
        ref={mobileMenuRef}
        className="overflow-hidden min-[550px]:hidden"
        aria-hidden={!isMobileMenuOpen}
      >
        <ul className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/6 p-3 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.id}
              ref={(el) => {
                mobileLinkRefs.current[i] = el;
              }}
              onMouseEnter={() => handleMobileLinkEnter(i)}
              onMouseLeave={() => handleMobileLinkLeave(i)}
              onClick={() => handleMobileLinkClick(i)}
              className={`cursor-pointer rounded-xl px-4 py-3 text-sm transition-colors duration-300 ${
                i === activeIndex
                  ? "bg-amber-400 font-medium text-black shadow-[0_0_16px_rgba(251,191,36,0.45)]"
                  : "text-white/70"
              }`}
            >
              {link.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
