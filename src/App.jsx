import React from 'react';
import { useWebAudio } from './hooks/useWebAudio';

import { Navbar } from './components/Navbar/Navbar';
import { ElevatorHero } from './components/ElevatorHero/ElevatorHero';
import { ToastSection } from './components/ToastSection/ToastSection';
import { Footer } from './components/Footer/Footer';

export default function App() {
  const { soundEnabled, toggleSound, playElevatorChime, playCocktailClink, playPageTurn } = useWebAudio();

  return (
    <div className="app-root">
      {/* Floating Brand Logo in Top Right */}
      <Navbar
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content */}
      <main>
        {/* 1. Elevator Hero Scroll Section */}
        <ElevatorHero
          playElevatorChime={playElevatorChime}
          playCocktailClink={playCocktailClink}
          playPageTurn={playPageTurn}
        />

        {/* 2. Toast Animation Section */}
        <ToastSection
          playCocktailClink={playCocktailClink}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
