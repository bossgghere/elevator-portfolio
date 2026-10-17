import React, { useState, useEffect, useRef } from 'react';
import { MenuModal } from '../MenuModal/MenuModal';
import './ElevatorHero.css';

export function ElevatorHero({ playElevatorChime, playCocktailClink, playPageTurn }) {
  const [manualDoorsOpen, setManualDoorsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const trackRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const titleRef = useRef(null);
  const cabRef = useRef(null);
  const rooftopRef = useRef(null);
  const welcomeRef = useRef(null);
  const indicatorRef = useRef(null);
  const hotspotRef = useRef(null);
  const manualDoorsOpenRef = useRef(false);

  manualDoorsOpenRef.current = manualDoorsOpen;

  useEffect(() => {
    let rafId = null;
    let hasPlayedChime = false;

    const onScroll = () => {
      if (manualDoorsOpenRef.current) return;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (!trackRef.current) {
          rafId = null;
          return;
        }

        const rect = trackRef.current.getBoundingClientRect();
        const totalDistance = trackRef.current.offsetHeight - window.innerHeight;
        if (totalDistance <= 0) {
          rafId = null;
          return;
        }

        const progress = Math.min(Math.max(-rect.top / totalDistance, 0), 1);

        // Phase 1: Elevator Doors Open (progress 0.0 -> 0.55)
        const doorProgress = Math.min(progress / 0.55, 1);
        const easedDoor = doorProgress < 0.5 
          ? 4 * doorProgress * doorProgress * doorProgress 
          : 1 - Math.pow(-2 * doorProgress + 2, 3) / 2;
        const doorOffset = easedDoor * 105;

        if (leftDoorRef.current) {
          leftDoorRef.current.style.transform = `translate3d(-${doorOffset}%, 0, 0)`;
        }
        if (rightDoorRef.current) {
          rightDoorRef.current.style.transform = `translate3d(${doorOffset}%, 0, 0)`;
        }

        // Title fading & scaling
        const titleOpacity = Math.max(1 - doorProgress * 1.5, 0);
        const titleScale = 1 - doorProgress * 0.1;
        if (titleRef.current) {
          titleRef.current.style.opacity = titleOpacity;
          titleRef.current.style.transform = `translate3d(-50%, -50%, 0) scale(${titleScale})`;
        }

        // Rooftop Background Zoom (Default)
        const rooftopScale = 1.0 + (progress * 0.16);
        if (rooftopRef.current) {
          rooftopRef.current.style.transform = `scale3d(${rooftopScale}, ${rooftopScale}, 1)`;
        }

        // Bar Menu Hotspot visibility tracking doors
        if (doorProgress > 0.25) {
          if (hotspotRef.current) hotspotRef.current.classList.add('visible');
        } else {
          if (hotspotRef.current) hotspotRef.current.classList.remove('visible');
        }

        // Elevator Cab Exit Zoom (stepping out of the elevator)
        if (progress > 0.45) {
          const exitP = (progress - 0.45) / 0.55;
          const cabScale = 1.0 + (exitP * 0.8);
          const cabOpacity = Math.max(1.0 - (exitP * 1.4), 0);
          if (cabRef.current) {
            cabRef.current.style.transform = `scale3d(${cabScale}, ${cabScale}, 1)`;
            cabRef.current.style.opacity = cabOpacity;
          }
          if (welcomeRef.current) {
            if (progress > 0.65) {
              welcomeRef.current.classList.add('visible');
            } else {
              welcomeRef.current.classList.remove('visible');
            }
          }
        } else {
          if (cabRef.current) {
            cabRef.current.style.transform = 'scale3d(1, 1, 1)';
            cabRef.current.style.opacity = 1;
          }
          if (welcomeRef.current) {
            welcomeRef.current.classList.remove('visible');
          }
        }

        // Scroll indicator fade
        if (indicatorRef.current) {
          indicatorRef.current.style.opacity = doorOffset > 5 ? '0' : '1';
        }

        // Elevator chime trigger
        if (doorProgress > 0.08 && !hasPlayedChime) {
          if (playElevatorChime) playElevatorChime();
          hasPlayedChime = true;
        } else if (doorProgress <= 0.02) {
          hasPlayedChime = false;
        }

        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [playElevatorChime]);

  // Open & Close Menu Handlers
  const handleOpenMenu = () => {
    if (playCocktailClink) playCocktailClink();
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // Manual Door Toggle Button
  const handleToggleDoors = () => {
    setManualDoorsOpen(prev => {
      const next = !prev;
      if (next && playElevatorChime) playElevatorChime();

      if (leftDoorRef.current && rightDoorRef.current && titleRef.current) {
        leftDoorRef.current.style.transition = 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
        rightDoorRef.current.style.transition = 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
        titleRef.current.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        if (next) {
          leftDoorRef.current.style.transform = 'translate3d(-105%, 0, 0)';
          rightDoorRef.current.style.transform = 'translate3d(105%, 0, 0)';
          titleRef.current.style.opacity = '0';
          if (welcomeRef.current) welcomeRef.current.classList.add('visible');
          if (indicatorRef.current) indicatorRef.current.style.opacity = '0';
          if (hotspotRef.current) hotspotRef.current.classList.add('visible');
        } else {
          leftDoorRef.current.style.transform = 'translate3d(0, 0, 0)';
          rightDoorRef.current.style.transform = 'translate3d(0, 0, 0)';
          titleRef.current.style.opacity = '1';
          if (welcomeRef.current) welcomeRef.current.classList.remove('visible');
          if (indicatorRef.current) indicatorRef.current.style.opacity = '1';
          if (hotspotRef.current) hotspotRef.current.classList.remove('visible');
        }

        setTimeout(() => {
          if (leftDoorRef.current) leftDoorRef.current.style.transition = '';
          if (rightDoorRef.current) rightDoorRef.current.style.transition = '';
          if (titleRef.current) titleRef.current.style.transition = '';
        }, 1300);
      }

      return next;
    });
  };

  return (
    <section className="elevator-scroll-track" id="elevator-hero" ref={trackRef}>
      <div className="elevator-sticky-viewport">
        
        {/* Background Layer: 4K Rooftop Terrace */}
        <div className="rooftop-bg-layer">
          <div className="rooftop-scene-viewport" ref={rooftopRef}>
            <img 
              src="/assets/rooftop_bar_terrace.jpg" 
              alt="Joanna's Rooftop Bar Terrace" 
              className="rooftop-photo"
            />

            {/* Bar Counter Interactive Menu Hotspot */}
            <div 
              className="bar-menu-hotspot"
              ref={hotspotRef}
              onClick={handleOpenMenu}
              role="button"
              tabIndex={0}
              aria-label="Open Joanna's Bar Menu"
              title="Click to explore the Cocktail & Dining Menu"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenMenu();
                }
              }}
            >
              {/* Tabletop Folio Stand Object */}
              <div className="bar-menu-stand-wrap">
                <div className="hotspot-glow-ring" />
                <div className="tabletop-menu-book">
                  <div className="book-spine-gold" />
                  <div className="book-crest-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="1.5">
                      <path d="M4 5h16M12 5v9M8 14c0 2.5 1.8 4 4 4s4-1.5 4-4M12 18v3M9 21h6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="book-brand">JOANNA'S</span>
                  <span className="book-sub">MENU</span>
                </div>
              </div>

              {/* Floating Aesthetic Cue Badge */}
              <div className="hotspot-callout-badge">
                <span className="cue-sparkle">✦</span>
                <span className="cue-title">BAR MENU</span>
                <span className="cue-action">Tap to Open</span>
              </div>
            </div>
          </div>
          
          <div className="sunlight-overlay" />

          {/* Floating Terrace Welcome Overlay */}
          <div className="terrace-welcome" ref={welcomeRef}>
            <span className="pill-tag">WELCOME TO THE PENTHOUSE</span>
            <h2 className="terrace-title">Where the Skyline Meets the Sunset</h2>
            <p className="terrace-tagline">Open-air mixology, sunlit breezes, and unforgettable panoramic horizons.</p>
            <div className="terrace-cta-group">
              <button 
                className="btn-hero-primary"
                onClick={handleOpenMenu}
                title="Open Cocktail & Dining Menu"
              >
                ✦ Explore Bar Menu
              </button>
              <a href="#reserve-section" className="btn-hero-glass">Reserve Experience</a>
            </div>
          </div>
        </div>

        {/* Elevator Interior Cab */}
        <div className="elevator-cab" ref={cabRef}>
          {/* Left Elevator Door */}
          <div className="elevator-door left-door" ref={leftDoorRef}>
            <div className="door-inner">
              <div className="door-shadow-edge" />
            </div>
          </div>

          {/* Right Elevator Door */}
          <div className="elevator-door right-door" ref={rightDoorRef}>
            <div className="door-inner">
              <div className="door-shadow-edge" />
            </div>
          </div>

          {/* Centered Elevator Door Typography */}
          <div className="elevator-title-overlay" ref={titleRef}>
            <div className="title-sub">WELCOME TO</div>
            <h1 className="title-script">Joannas</h1>
            <div className="title-sub bottom">ROOFTOP BAR</div>
          </div>

          {/* Elevator Frame & Floor Indicator */}
          <div className="elevator-frame-overlay">
            <div className="elevator-indicator-panel">
              <div className="floor-display">
                <span className="floor-arrow">▲</span>
                <span className="floor-num">42</span>
              </div>
              <div className="floor-label">PENTHOUSE ROOFTOP</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" ref={indicatorRef}>
          <span className="scroll-text">Scroll down to step out of the elevator</span>
          <div className="scroll-mouse">
            <div className="scroll-wheel" />
          </div>
        </div>

        {/* Quick Controls: Toggle Doors */}
        <div className="elevator-quick-controls">
          <button 
            className="control-pill" 
            onClick={handleToggleDoors}
            title="Toggle elevator door open/close animation manually"
          >
            <span className="dot" />
            <span>{manualDoorsOpen ? 'Close Doors' : 'Open / Close Doors'}</span>
          </button>
        </div>

      </div>

      {/* Minimal Aesthetic Folio Menu Modal */}
      <MenuModal 
        isOpen={isMenuOpen} 
        onClose={handleCloseMenu} 
        playPageTurn={playPageTurn} 
      />
    </section>
  );
}

