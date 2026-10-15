import React, { useState, useEffect, useRef } from 'react';
import './ToastSection.css';

export function ToastSection({ playCocktailClink }) {
  const [isActive, setIsActive] = useState(false);
  const [isSparkle, setIsSparkle] = useState(false);
  const sectionRef = useRef(null);
  const timersRef = useRef([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  const triggerToast = () => {
    clearAllTimers();
    setIsActive(false);
    setIsSparkle(false);

    const t1 = setTimeout(() => {
      setIsActive(true);

      const t2 = setTimeout(() => {
        if (playCocktailClink) playCocktailClink();
        setIsSparkle(true);
      }, 1350);

      const t3 = setTimeout(() => {
        setIsSparkle(false);
      }, 2300);

      timersRef.current.push(t2, t3);
    }, 60);

    timersRef.current.push(t1);
  };

  const resetToast = () => {
    clearAllTimers();
    setIsActive(false);
    setIsSparkle(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerToast();
          } else {
            resetToast();
          }
        });
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      clearAllTimers();
      observer.disconnect();
    };
  }, [playCocktailClink]);

  return (
    <section className="reserve-section" id="reserve-section" ref={sectionRef}>
      <div className="reserve-container">
        
        {/* Section Header */}
        <div className="reserve-header">
          <h2 className="reserve-script">reserve</h2>
          <h3 className="reserve-sub">A TABLE</h3>
        </div>

        {/* Responsive Toast Stage (16:9 aspect-ratio frame) */}
        <div className={`toast-animation-stage ${isActive ? 'clink-active' : ''} ${isSparkle ? 'sparkle-active' : ''}`}>
          
          {/* Centered CTA Pill */}
          <div className="toast-center-cta">
            <div className="book-now-pill">
              <span>BOOK NOW</span>
            </div>
          </div>

          {/* Left Glass & Hand: Glide In from 270° */}
          <div className="toast-arm arm-left">
            <img 
              src="/assets/cocktail_left_frame.png" 
              alt="Woman's hand holding pink frothy coupe cocktail" 
              className="cocktail-img"
            />
          </div>

          {/* Right Glass & Hand: Glide In from 90° */}
          <div className="toast-arm arm-right">
            <img 
              src="/assets/cocktail_right_frame.png" 
              alt="Hand holding tequila sunrise cocktail with fresh orange wheel" 
              className="cocktail-img"
            />
          </div>

          {/* Sparkles on Contact */}
          <div className="clink-sparkle">
            <div className="spark s1">✦</div>
            <div className="spark s2">✧</div>
            <div className="spark s3">✦</div>
            <div className="spark s4">✧</div>
          </div>

        </div>

        {/* Caption & Manual Replay */}
        <div className="toast-caption">
          <p>Walk-ins welcome based on availability · Sunset hours recommended</p>
          <button className="replay-btn" onClick={triggerToast} title="Replay entrance animation">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            Replay Toast Animation
          </button>
        </div>

      </div>
    </section>
  );
}
