import React, { useState, useEffect, useCallback } from 'react';
import './MenuModal.css';

const MENU_PAGES = [
  {
    id: 'cover',
    type: 'cover',
    tag: 'FOLIO N° 42',
    title: "Joanna's",
    subtitle: 'ROOFTOP COCKTAILS & DINING',
    edition: 'Penthouse Skyline Collection · Level 42',
    quote: 'Where sunset light lingers upon crystal, and each pour is an alchemy of high-altitude mixology.',
    hours: 'Sunset — 2:00 AM Daily',
  },
  {
    id: 'cocktails',
    type: 'menu',
    category: 'Part I · Sunset Alchemies',
    title: 'Signature Mixology',
    intro: 'Handcrafted by our master bar team, infused with botanicals, house infusions, and gold.',
    items: [
      {
        name: 'Golden Hour Highball',
        price: '$26',
        description: 'Hibiki Harmony Japanese Whisky, clarified white peach nectar, roasted sencha soda, 24k edible gold dust.',
        tag: 'House Favorite',
      },
      {
        name: 'Penthouse Smoke',
        price: '$28',
        description: 'Del Maguey Chichicapa Mezcal, charred rosemary syrup, blood orange amaro, smoked volcanic black salt.',
        tag: 'Smoked',
      },
      {
        name: 'Joanna’s Velvet Solstice',
        price: '$25',
        description: 'Empress 1908 indigo gin, lychee blossom nectar, crème de violette, Meyer lemon, vintage brut float.',
        tag: 'Floral & Crisp',
      },
      {
        name: 'Cloud 42 Martini',
        price: '$29',
        description: 'Belvedere 10, dry vermouth mist, cold-pressed Sicilian olive oil wash, pickled sea bean.',
        tag: 'Silky',
      },
      {
        name: 'Nocturne Espresso',
        price: '$24',
        description: 'Ocho Reposado Tequila, single-origin cold drip espresso, dark Valrhona cacao, spiced cardamom cloud foam.',
        tag: 'Rich & Bold',
      },
      {
        name: 'Kyoto Sunset Mist',
        price: '$26',
        description: 'Ki No Bi Kyoto Dry Gin, clarified ruby grapefruit, elderflower cordial, sparkling shiso leaf.',
        tag: 'Refreshing',
      },
    ],
  },
  {
    id: 'spirits-wine',
    type: 'menu',
    category: 'Part II · Effervescence & Heritage',
    title: 'Spritzes, Agave & Cellar',
    intro: 'Sunlit aperitifs, rare single-estate agaves, and vintage grand cuvées from Champagne.',
    items: [
      {
        name: 'Venetian Cloud Spritz',
        price: '$22',
        description: 'Select Aperitivo, Prosecco Superiore DOCG, blood orange mist, castelvetrano olive skewer.',
        tag: 'Aperitivo',
      },
      {
        name: 'Yuzu Botanical Fizz',
        price: '$21',
        description: 'Roku Gin, Japanese yuzu, sparkling tonic, cucumber ribbon, fresh shiso blossom.',
        tag: 'Low ABV',
      },
      {
        name: 'Clase Azul Reposado',
        price: '$48 (2oz)',
        description: 'Aged 8 months in bourbon casks. Notes of candied orange peel, toasted hazelnut, and deep roasted agave.',
        tag: 'Rare Agave',
      },
      {
        name: 'Rey Campero Tepextate Mezcal',
        price: '$42 (2oz)',
        description: 'Wild harvested 25-year agave. Intense mineral, green chili, and roasted herbal complexity.',
        tag: 'Artisanal',
      },
      {
        name: 'Dom Pérignon Brut Vintage 2013',
        price: '$78 / $420',
        description: 'Épernay, France. White peach, brioche, crushed stone, exceptional length and golden mousse.',
        tag: 'Champagne',
      },
      {
        name: 'Ruinart Blanc de Blancs',
        price: '$58 / $310',
        description: 'Reims, France. 100% premier cru Chardonnay, white flower aromas, clean chalky finish.',
        tag: 'Champagne',
      },
    ],
  },
  {
    id: 'raw-bar-bites',
    type: 'menu',
    category: 'Part III · Elevated Plates',
    title: 'Raw Bar & Savory Bites',
    intro: 'Sustainably sourced coastal seafood, Japanese A5 wagyu, and decadent rooftop pairings.',
    items: [
      {
        name: 'Hokkaido Scallop Crudo',
        price: '$32',
        description: 'Wild diver scallops, finger lime pearls, white ponzu, jalapeño oil, purple shiso blossom.',
        tag: 'Raw Bar',
      },
      {
        name: 'A5 Miyazaki Wagyu Tartare',
        price: '$38',
        description: 'Hand-cut wagyu, cured quail egg, smoked tare glaze, toasted nori brioche soldiers.',
        tag: 'Signature',
      },
      {
        name: 'Truffle Mascarpone Brioche',
        price: '$26',
        description: 'Winter black truffle butter, whipped mascarpone, comb honey, flaked Maldon salt.',
        tag: 'Vegetarian',
      },
      {
        name: 'Bluefin Toro Crispy Rice',
        price: '$30',
        description: 'Sustainably caught bluefin toro, truffle soy reduction, scallion crisp, micro cilantro.',
        tag: 'Raw Bar',
      },
      {
        name: 'Charred Spanish Octopus',
        price: '$34',
        description: 'Pimentón emulsion, fingerling crisps, pickled shallots, charred Meyer lemon.',
        tag: 'From the Grill',
      },
      {
        name: 'Artisanal Penthouse Board',
        price: '$36',
        description: 'Jamón Ibérico 100% Bellota, 36-month Comté, truffle honeycomb, Marcona almonds, focaccia.',
        tag: 'To Share',
      },
    ],
  },
  {
    id: 'dolce-digestifs',
    type: 'menu',
    category: 'Part IV · Dolce & After Hours',
    title: 'Sweet Finales & Digestifs',
    intro: 'Delicate rooftop desserts and rich nightcaps as the midnight skyline glows.',
    items: [
      {
        name: 'Yuzu Pavlova Cloud',
        price: '$18',
        description: 'Crispy French meringue, whipped yuzu curd, dragonfruit coulis, candied mint leaves.',
        tag: 'Dessert',
      },
      {
        name: 'Valrhona Noir Tart',
        price: '$20',
        description: 'Guanaja 70% dark chocolate ganache, smoked sea salt caramel, edible gold foil, Tahitian cream.',
        tag: 'Dessert',
      },
      {
        name: 'Hibiki 21 Year Old',
        price: '$95 (2oz)',
        description: 'Unrivaled elegance: cooked fruit, blackberry, ripe banana, mizunara sandalwood oak.',
        tag: 'Japanese Whisky',
      },
      {
        name: 'Amaro Nonino Quintessentia',
        price: '$19 (2oz)',
        description: 'Grappa-based infused with alpine herbs, gentian root, and caramelized orange peel.',
        tag: 'Digestif',
      },
      {
        name: 'Carajillo 42',
        price: '$22',
        description: 'Licor 43 shaken hard with freshly pulled double espresso and orange blossom essence.',
        tag: 'Nightcap',
      },
      {
        name: 'Artisanal Espresso & Petit Fours',
        price: '$16',
        description: 'Single-origin espresso served with dark chocolate truffles and Sicilian pistachios.',
        tag: 'Coffee',
      },
    ],
  },
];

export function MenuModal({ isOpen, onClose, playPageTurn }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('forward');

  // Reset to cover when opening
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goToPage = useCallback(
    (pageIndex) => {
      if (pageIndex < 0 || pageIndex >= MENU_PAGES.length || pageIndex === currentPage) {
        return;
      }
      setDirection(pageIndex > currentPage ? 'forward' : 'backward');
      setCurrentPage(pageIndex);
      if (playPageTurn) playPageTurn();
    },
    [currentPage, playPageTurn]
  );

  const nextPage = useCallback(() => {
    if (currentPage < MENU_PAGES.length - 1) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, nextPage, prevPage]);

  if (!isOpen) return null;

  const current = MENU_PAGES[currentPage];

  return (
    <div className="menu-modal-overlay" onClick={onClose}>
      <div 
        className="menu-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Joanna's Rooftop Bar Menu"
      >
        {/* Leather/Folio Spine & Gold Accent */}
        <div className="folio-spine-accent" />

        {/* Top Header & Tabs Bar */}
        <div className="menu-modal-header">
          <div className="header-meta">
            <span className="gold-crest-mini">✦</span>
            <span className="folio-label">LEVEL 42 PENTHOUSE · BEVERAGE & DINING FOLIO</span>
          </div>

          {/* Quick Page Jump Tabs */}
          <nav className="menu-tabs" aria-label="Menu Sections">
            {MENU_PAGES.map((page, idx) => (
              <button
                key={page.id}
                className={`menu-tab-btn ${currentPage === idx ? 'active' : ''}`}
                onClick={() => goToPage(idx)}
                aria-current={currentPage === idx ? 'page' : undefined}
              >
                <span className="tab-num">{String(idx + 1).padStart(2, '0')}</span>
                <span className="tab-name">
                  {idx === 0 ? 'Cover' : page.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </nav>

          {/* Close Button */}
          <button 
            className="menu-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
            title="Close menu (Esc)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Dynamic Page Sheet */}
        <div className={`folio-page-content page-anim-${direction}`} key={currentPage}>
          {current.type === 'cover' ? (
            <div className="cover-page-view">
              <div className="cover-border-box">
                <div className="cover-crest">
                  <svg width="54" height="54" viewBox="0 0 60 60" fill="none">
                    <circle cx="30" cy="30" r="28" stroke="#d4af37" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    <circle cx="30" cy="30" r="23" stroke="#d4af37" strokeWidth="1" opacity="0.9" />
                    <path d="M22 20h16M30 20v14M24 34c0 4 3 6 6 6s6-2 6-6M30 40v8M25 48h10" stroke="#d4af37" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="30" cy="27" r="1.5" fill="#f3e5ab" />
                  </svg>
                </div>

                <span className="cover-tag">{current.tag}</span>
                <h1 className="cover-title-script">{current.title}</h1>
                <h2 className="cover-subtitle">{current.subtitle}</h2>
                <div className="cover-gold-divider" />
                <p className="cover-edition">{current.edition}</p>
                <p className="cover-quote">“{current.quote}”</p>

                <div className="cover-cta-row">
                  <button className="cover-open-btn" onClick={nextPage}>
                    <span>Turn Page to Explore</span>
                    <span className="arrow-icon">→</span>
                  </button>
                </div>

                <div className="cover-footer-note">
                  <span>{current.hours}</span>
                  <span className="dot-sep">•</span>
                  <span>Reservations Recommended</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="menu-items-view">
              <div className="menu-view-header">
                <span className="menu-category-tag">{current.category}</span>
                <h2 className="menu-view-title">{current.title}</h2>
                <p className="menu-view-intro">{current.intro}</p>
                <div className="menu-view-divider" />
              </div>

              <div className="menu-items-grid">
                {current.items.map((item, index) => (
                  <div className="menu-item-card" key={index}>
                    <div className="item-header-row">
                      <div className="item-name-group">
                        <h3 className="item-name">{item.name}</h3>
                        {item.tag && <span className="item-tag">{item.tag}</span>}
                      </div>
                      <div className="item-leader" />
                      <span className="item-price">{item.price}</span>
                    </div>
                    <p className="item-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Navigation Footer */}
        <div className="menu-modal-footer">
          <button 
            className="nav-btn prev-btn" 
            onClick={prevPage}
            disabled={currentPage === 0}
            aria-label="Previous Page"
          >
            <span className="nav-arrow">←</span>
            <span className="nav-label">Previous</span>
          </button>

          <div className="pagination-group">
            <span className="pagination-text">
              Page <strong>{currentPage + 1}</strong> of {MENU_PAGES.length}
            </span>
            <div className="pagination-dots">
              {MENU_PAGES.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot-pill ${currentPage === idx ? 'active' : ''}`}
                  onClick={() => goToPage(idx)}
                  title={`Go to page ${idx + 1}`}
                  aria-label={`Go to page ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <button 
            className="nav-btn next-btn" 
            onClick={nextPage}
            disabled={currentPage === MENU_PAGES.length - 1}
            aria-label="Next Page"
          >
            <span className="nav-label">{currentPage === 0 ? 'First Page' : 'Next'}</span>
            <span className="nav-arrow">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}
