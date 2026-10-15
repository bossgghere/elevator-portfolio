import React from 'react';
import './Navbar.css';

export function Navbar({ soundEnabled, onToggleSound }) {
  return (
    <div className="floating-top-right">
      <a href="#elevator-hero" className="floating-brand-logo" aria-label="Joanna's Rooftop Bar">
        <span className="brand-text">JOANNA'S</span>
        <span className="brand-sub">ROOFTOP · LVL 42</span>
      </a>

      {/* Subtle discreet audio button next to logo */}
      <button 
        className="floating-audio-toggle"
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute Ambient Audio' : 'Unmute Ambient Audio'}
        aria-label="Toggle Audio"
      >
        {soundEnabled ? (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        )}
      </button>
    </div>
  );
}
