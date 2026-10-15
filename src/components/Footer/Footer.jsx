import React from 'react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="f-title">JOANNA'S ROOFTOP BAR</span>
            <p>Elevated mixology and skyline views.</p>
          </div>
          <div className="footer-links">
            <a href="#elevator-hero">Elevator Reveal</a>
            <a href="#reserve-section">Reserve a Table</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Joanna's Rooftop Bar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
