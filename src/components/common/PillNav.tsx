import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Image from 'next/image';
import { LanguageSelector } from './LanguageSelector';
import useScrollToSection from '@/hooks/useScrollToSection';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  onClick?: (e: React.MouseEvent) => void; // Add onClick handler
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  logoBackgroundColor?: string; // New prop for logo background color
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#225217', // Default to Cal Poly Green
  pillColor = '#FDF8F0', // Default to Floral White
  hoveredPillTextColor = '#FDF8F0', // Default to Floral White
  pillTextColor = '#281909', // Default to Bistre
  logoBackgroundColor, // New prop
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const { scrollToSection } = useScrollToSection();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);

  // Ensure items array is always defined to prevent conditional hook issues
  const safeItems = useMemo(() => items || [], [items]);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return;
    }

    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        // Use safeItems.length to ensure consistent indexing
        const index = circleRefs.current.indexOf(circle);
        if (index === -1 || index >= safeItems.length) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' },
          0
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: 'auto' },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    // Set initial hidden state for mobile menu
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, {
        visibility: 'hidden',
        opacity: 0,
        scaleY: 1,
        y: 0,
        transformOrigin: 'top center',
      });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease,
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease,
        });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [safeItems, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    // Ensure index is within bounds
    if (i >= safeItems.length) return;

    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    });
  };

  const handleLeave = (i: number) => {
    // Ensure index is within bounds
    if (i >= safeItems.length) return;

    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto',
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const lines = hamburger?.querySelectorAll('.hamburger-line');
    if (lines && lines.length >= 2) {
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          },
        });
      }
    }

    onMobileMenuClick?.();
  };

  // Helper function to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);

    // Update hamburger icon state
    const hamburger = hamburgerRef.current;
    const lines = hamburger?.querySelectorAll('.hamburger-line');
    if (lines && lines.length >= 2) {
      gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
      gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
    }

    // Hide menu with animation
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.to(menu, {
        opacity: 0,
        y: 10,
        scaleY: 1,
        duration: 0.2,
        ease,
        transformOrigin: 'top center',
        onComplete: () => {
          gsap.set(menu, { visibility: 'hidden' });
        },
      });
    }
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:');

  const isNextLink = (href?: string) =>
    href && !isExternalLink(href) && !href.startsWith('/#');

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--nav-h-mobile']: '58px', // New variable for mobile height
    ['--logo']: '36px',
    ['--pill-pad-x']: '18px',
    ['--pill-gap']: '3px',
  } as React.CSSProperties;

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {isNextLink(safeItems?.[0]?.href) ? (
          <Link
            href={safeItems[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full inline-flex items-center justify-center overflow-hidden  border-2 "
            style={{
              // width: 'var(--nav-h)',
              // height: 'var(--nav-h)',
              width: 'var(--nav-h-mobile)',
              height: 'var(--nav-h-mobile)',
              background: logoBackgroundColor || 'var(--base, #000)', // Use custom color or fallback
              borderColor: '#281909',
            }}
          >
            <div ref={logoImgRef} className="w-full h-full relative ">
              <Image
                src={logo}
                alt={logoAlt}
                fill
                className="w-full h-full object-contain block"
              />
            </div>
          </Link>
        ) : (
          <a
            href={safeItems?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
            style={{
              width: 'var(--nav-h-mobile)',
              height: 'var(--nav-h-mobile)',
              background: logoBackgroundColor || 'var(--base, #000)', // Use custom color or fallback
            }}
          >
            <div ref={logoImgRef} className="w-full h-full relative">
              <Image
                src={logo}
                alt={logoAlt}
                fill
                className="w-full h-full object-contain block"
              />
            </div>
          </a>
        )}

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)',
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {safeItems.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle: React.CSSProperties = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)',
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: 'var(--base, #000)',
                      willChange: 'transform',
                    }}
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity',
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              // Check if item has a custom onClick handler
              if (item.onClick) {
                return (
                  <li
                    key={`${item.href}-${i}`}
                    role="none"
                    className="flex h-full"
                  >
                    <button
                      role="menuitem"
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={e => {
                        item.onClick?.(e);
                        // Close mobile menu when a link is clicked on mobile devices
                        if (
                          typeof window !== 'undefined' &&
                          window.innerWidth < 768
                        ) {
                          closeMobileMenu();
                        }
                      }}
                    >
                      {PillContent}
                    </button>
                  </li>
                );
              }

              // Handle anchor links (starting with /#)
              if (item.href.startsWith('/#')) {
                const sectionId = item.href.substring(2); // Remove '/#' prefix
                return (
                  <li
                    key={`${item.href}-${i}`}
                    role="none"
                    className="flex h-full"
                  >
                    <button
                      role="menuitem"
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={() => {
                        console.log(
                          `PillNav: Scrolling to section ${sectionId}`
                        );
                        scrollToSection(sectionId);
                        // Close mobile menu when a link is clicked on mobile devices
                        if (
                          typeof window !== 'undefined' &&
                          window.innerWidth < 768
                        ) {
                          closeMobileMenu();
                        }
                      }}
                    >
                      {PillContent}
                    </button>
                  </li>
                );
              }

              // Handle Next.js links
              if (isNextLink(item.href)) {
                return (
                  <li
                    key={`${item.href}-${i}`}
                    role="none"
                    className="flex h-full"
                  >
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      onClick={() => {
                        // Close mobile menu when a link is clicked on mobile devices
                        if (
                          typeof window !== 'undefined' &&
                          window.innerWidth < 768
                        ) {
                          closeMobileMenu();
                        }
                      }}
                    >
                      {PillContent}
                    </Link>
                  </li>
                );
              }

              // Handle external links and other href types
              return (
                <li
                  key={`${item.href}-${i}`}
                  role="none"
                  className="flex h-full"
                >
                  <a
                    role="menuitem"
                    href={item.href}
                    className={basePillClasses}
                    style={pillStyle}
                    aria-label={item.ariaLabel || item.label}
                    onMouseEnter={() => handleEnter(i)}
                    onMouseLeave={() => handleLeave(i)}
                    onClick={() => {
                      // Close mobile menu when a link is clicked on mobile devices
                      if (
                        typeof window !== 'undefined' &&
                        window.innerWidth < 768
                      ) {
                        closeMobileMenu();
                      }
                    }}
                  >
                    {PillContent}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border border-[#FDF8F0] flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
          style={{
            width: 'var(--nav-h-mobile)',
            height: 'var(--nav-h-mobile)',
            background: 'var(--base, #000)',
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
        </button>
      </nav>

      {/* Mobile menu with initial hidden styles applied directly in JSX */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-[3em] left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm rounded-[27px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] z-[998] origin-top"
        style={{
          ...cssVars,
          background: 'var(--base, #225217)', // Cal Poly Green background
          visibility: 'hidden',
          opacity: 0,
          transformOrigin: 'top center',
        }}
      >
        <ul className="list-none m-0 p-[3px] flex flex-col gap-[3px]">
          {safeItems.map((item, index) => {
            const defaultStyle: React.CSSProperties = {
              background: 'var(--pill-bg, #FDF8F0)', // Floral White pills
              color: 'var(--pill-text, #281909)', // Bistre text
            };
            const hoverIn = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.background = 'var(--base, #225217)'; // Cal Poly Green
              e.currentTarget.style.color = 'var(--hover-text, #FDF8F0)'; // Floral White
            };
            const hoverOut = (e: React.MouseEvent<HTMLElement>) => {
              e.currentTarget.style.background = 'var(--pill-bg, #FDF8F0)'; // Floral White
              e.currentTarget.style.color = 'var(--pill-text, #281909)'; // Bistre
            };

            const linkClasses =
              'block py-3 px-4 text-[16px] w-full text-left font-medium rounded-[50px] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]';

            // Check if item has a custom onClick handler
            if (item.onClick) {
              return (
                <li key={`${item.href}-${index}`}>
                  <button
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={e => {
                      item.onClick?.(e);
                      closeMobileMenu();
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              );
            }

            // Handle anchor links (starting with /#)
            if (item.href.startsWith('/#')) {
              const sectionId = item.href.substring(2); // Remove '/#' prefix
              return (
                <li key={`${item.href}-${index}`}>
                  <button
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => {
                      console.log(
                        `PillNav (mobile): Scrolling to section ${sectionId}`
                      );
                      scrollToSection(sectionId);
                      closeMobileMenu();
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              );
            }

            // Handle Next.js links
            if (isNextLink(item.href)) {
              return (
                <li key={`${item.href}-${index}`}>
                  <Link
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            // Handle external links and other href types
            return (
              <li key={`${item.href}-${index}`}>
                <a
                  href={item.href}
                  className={linkClasses}
                  style={defaultStyle}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
          {/* Language Selector in Mobile Menu */}
          {/* <li className="px-3 py-2">
            <div className="text-[#FDF8F0] text-sm font-medium mb-2 px-1">
              Language / Langue
            </div>
            <div className="px-1">
              <LanguageSelector
                onValueChange={() => {
                  // Close mobile menu when language is changed
                  if (
                    typeof window !== 'undefined' &&
                    window.innerWidth < 768
                  ) {
                    closeMobileMenu();
                  }
                }}
              />
            </div>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default PillNav;
