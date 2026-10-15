/**
 * Joanna's Rooftop Bar — Main Interactive Controller
 * Replicating Annie's Wix Studio Animation Settings
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const siteHeader = document.getElementById('siteHeader');
  const elevatorHero = document.getElementById('elevator-hero');
  const leftDoor = document.getElementById('leftDoor');
  const rightDoor = document.getElementById('rightDoor');
  const elevatorTitle = document.getElementById('elevatorTitle');
  const elevatorCab = document.getElementById('elevatorCab');
  const rooftopImg = document.getElementById('rooftopImg');
  const rooftopOriginalImg = document.getElementById('rooftopOriginalImg');
  const terraceWelcome = document.getElementById('terraceWelcome');
  const scrollIndicator = document.getElementById('scrollIndicator');
  const toggleDoorsBtn = document.getElementById('toggleDoorsBtn');
  const toggleAssetThemeBtn = document.getElementById('toggleAssetThemeBtn');
  
  const toastStage = document.getElementById('toastStage');
  const replayToastBtn = document.getElementById('replayToastBtn');
  
  const soundToggle = document.getElementById('soundToggle');
  const soundOnIcon = soundToggle.querySelector('.sound-on-icon');
  const soundOffIcon = soundToggle.querySelector('.sound-off-icon');

  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtns = [
    document.getElementById('bookNowBtn'),
    document.querySelector('.btn-primary-small'),
    document.querySelector('.btn-hero-primary')
  ];
  const closeBookingModal = document.getElementById('closeBookingModal');
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const doneBookingBtn = document.getElementById('doneBookingBtn');
  const confirmationSummary = document.getElementById('confirmationSummary');

  const wixModal = document.getElementById('wixModal');
  const openWixSpecs = document.getElementById('openWixSpecs');
  const closeWixModal = document.getElementById('closeWixModal');

  // State
  let soundEnabled = true;
  let manualDoorsOpen = false;
  let hasPlayedElevatorChime = false;
  let hasPlayedClink = false;
  let audioCtx = null;

  // ==========================================================================
  // Web Audio API Synthesizer (Elevator Chime & Crystal Toast Clink)
  // ==========================================================================
  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Penthouse Elevator Arrival Two-Tone Chime (e.g. F5 -> C6)
  function playElevatorChime() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    // Tone 1: 698.46 Hz (F5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(698.46, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Tone 2: 1046.5 Hz (C6) slightly delayed
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.5, now + 0.18);
    gain2.gain.setValueAtTime(0.25, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 1.6);
  }

  // Crystal Cocktail Glasses Clink (High resonance transient)
  function playCocktailClink() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    // High frequency primary ping (2800 Hz)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2850, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.7);

    // Harmonic shimmer (4200 Hz)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4200, now);
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now);
    osc2.stop(now + 0.5);
  }

  // Sound Toggle Control
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundOnIcon.classList.toggle('hidden', !soundEnabled);
    soundOffIcon.classList.toggle('hidden', soundEnabled);
    if (soundEnabled) {
      initAudio();
      playElevatorChime();
    }
  });

  // ==========================================================================
  // 1. ELEVATOR SCROLL ANIMATION (Wix Studio Replication)
  // ==========================================================================
  function updateElevatorScroll() {
    if (manualDoorsOpen) return;

    const scrollY = window.scrollY;
    const heroRect = elevatorHero.getBoundingClientRect();
    const heroHeight = elevatorHero.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Track scroll progress through the elevator hero track (0.0 to 1.0)
    const totalScrollableDistance = heroHeight - viewportHeight;
    let progress = Math.min(Math.max(-heroRect.top / totalScrollableDistance, 0), 1);

    // Header background blur on scroll
    if (scrollY > 50) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    // Phase 1: Doors slide open (Wix settings: 270° & 90°, Distance: 50vw/100%)
    // Door opening happens over progress 0.0 -> 0.6
    const doorProgress = Math.min(progress / 0.55, 1);
    // Apply smooth cubic curve to the scroll-driven door motion
    const easedDoor = easeInOutCubic(doorProgress);
    const doorOffsetPercent = easedDoor * 105; // 105% to clear viewport completely

    leftDoor.style.transform = `translateX(-${doorOffsetPercent}%)`;
    rightDoor.style.transform = `translateX(${doorOffsetPercent}%)`;

    // Elevator title fades out and scales slightly
    const titleOpacity = Math.max(1 - doorProgress * 1.5, 0);
    const titleScale = 1 - doorProgress * 0.1;
    elevatorTitle.style.opacity = titleOpacity;
    elevatorTitle.style.transform = `translate(-50%, -50%) scale(${titleScale})`;

    // Play chime once when doors begin opening
    if (doorProgress > 0.08 && !hasPlayedElevatorChime) {
      playElevatorChime();
      hasPlayedElevatorChime = true;
    } else if (doorProgress <= 0.02) {
      hasPlayedElevatorChime = false;
    }

    // Scroll indicator fades out quickly once user begins scrolling
    if (doorProgress > 0.05) {
      scrollIndicator.style.opacity = '0';
    } else {
      scrollIndicator.style.opacity = '1';
    }

    // Phase 2: Parallax Zoom & Stepping out onto the rooftop
    // Rooftop expands/zooms slightly (Wix Studio: Expand scale 170%)
    const rooftopScale = 1.0 + (progress * 0.16);
    rooftopImg.style.transform = `scale(${rooftopScale})`;
    rooftopOriginalImg.style.transform = `scale(${rooftopScale})`;

    // Elevator cab interior zooms outward past camera as user "steps out"
    if (progress > 0.45) {
      const exitProgress = (progress - 0.45) / 0.55;
      const cabScale = 1.0 + (exitProgress * 0.8);
      const cabOpacity = Math.max(1.0 - (exitProgress * 1.4), 0);
      elevatorCab.style.transform = `scale(${cabScale})`;
      elevatorCab.style.opacity = cabOpacity;

      // Terrace welcome content reveals
      if (progress > 0.65) {
        terraceWelcome.classList.add('visible');
      } else {
        terraceWelcome.classList.remove('visible');
      }
    } else {
      elevatorCab.style.transform = 'scale(1)';
      elevatorCab.style.opacity = '1';
      terraceWelcome.classList.remove('visible');
    }
  }

  // Smooth scroll cubic easing matching Wix Studio
  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  // Bind scroll with requestAnimationFrame for 60/120fps smoothness
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateElevatorScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call on load
  updateElevatorScroll();

  // Manual Door Toggle Button
  toggleDoorsBtn.addEventListener('click', () => {
    manualDoorsOpen = !manualDoorsOpen;
    leftDoor.style.transition = 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
    rightDoor.style.transition = 'transform 1.2s cubic-bezier(0.65, 0, 0.35, 1)';
    elevatorTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    if (manualDoorsOpen) {
      leftDoor.style.transform = 'translateX(-105%)';
      rightDoor.style.transform = 'translateX(105%)';
      elevatorTitle.style.opacity = '0';
      terraceWelcome.classList.add('visible');
      scrollIndicator.style.opacity = '0';
      playElevatorChime();
    } else {
      leftDoor.style.transform = 'translateX(0%)';
      rightDoor.style.transform = 'translateX(0%)';
      elevatorTitle.style.opacity = '1';
      terraceWelcome.classList.remove('visible');
      scrollIndicator.style.opacity = '1';
    }

    // Reset transition after animation completes so scroll remains instant
    setTimeout(() => {
      leftDoor.style.transition = '';
      rightDoor.style.transition = '';
      elevatorTitle.style.transition = '';
    }, 1300);
  });

  // Toggle between 4K Render and Original PDF Composite
  let isOriginalComposite = false;
  toggleAssetThemeBtn.addEventListener('click', () => {
    isOriginalComposite = !isOriginalComposite;
    if (isOriginalComposite) {
      rooftopImg.classList.remove('active-photo');
      rooftopOriginalImg.classList.add('active-photo');
      toggleAssetThemeBtn.querySelector('.btn-label').textContent = 'Showing: Original PDF Composite';
    } else {
      rooftopOriginalImg.classList.remove('active-photo');
      rooftopImg.classList.add('active-photo');
      toggleAssetThemeBtn.querySelector('.btn-label').textContent = 'Showing: Ultra-HD 4K Render';
    }
  });


  // ==========================================================================
  // 2. "RESERVE A TABLE" TOAST ENTRANCE ANIMATION (Wix Studio Replication)
  // ==========================================================================
  function triggerToastAnimation() {
    toastStage.classList.remove('clink-active', 'sparkle-active');
    hasPlayedClink = false;

    // Small delay to allow CSS reset
    requestAnimationFrame(() => {
      toastStage.classList.add('clink-active');

      // Wix Studio Duration is 1.5s with easeInOutCubic
      // Sound and sparkles trigger as they meet (around 1.35s)
      setTimeout(() => {
        if (!hasPlayedClink) {
          playCocktailClink();
          toastStage.classList.add('sparkle-active');
          hasPlayedClink = true;
        }
      }, 1350);

      // Fade sparkles after pop
      setTimeout(() => {
        toastStage.classList.remove('sparkle-active');
      }, 2400);
    });
  }

  // Trigger on scroll via IntersectionObserver
  const toastObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerToastAnimation();
      }
    });
  }, { threshold: 0.35 });

  if (toastStage) {
    toastObserver.observe(toastStage);
  }

  // Replay Button
  if (replayToastBtn) {
    replayToastBtn.addEventListener('click', () => {
      triggerToastAnimation();
    });
  }


  // ==========================================================================
  // 3. BOOKING MODAL LOGIC
  // ==========================================================================
  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBookingBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(bookingModal);
        // Default date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateInput = document.getElementById('bookDate');
        if (dateInput && !dateInput.value) {
          dateInput.value = tomorrow.toISOString().split('T')[0];
        }
      });
    }
  });

  if (closeBookingModal) {
    closeBookingModal.addEventListener('click', () => closeModal(bookingModal));
  }

  bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal(bookingModal);
  });

  // Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('bookDate').value;
      const timeSelect = document.getElementById('bookTime');
      const timeText = timeSelect.options[timeSelect.selectedIndex].text;
      const guests = document.getElementById('bookGuests').value;
      const areaSelect = document.getElementById('bookArea');
      const areaText = areaSelect.options[areaSelect.selectedIndex].text;
      const name = document.getElementById('bookName').value;

      confirmationSummary.innerHTML = `
        <strong>Guest:</strong> ${name}<br>
        <strong>Date & Time:</strong> ${date} at ${timeText}<br>
        <strong>Party Size:</strong> ${guests} Guests<br>
        <strong>Seating:</strong> ${areaText}<br>
        <strong>Confirmation Code:</strong> #JRN-${Math.floor(100000 + Math.random() * 900000)}
      `;

      bookingForm.classList.add('hidden');
      bookingSuccess.classList.remove('hidden');
      playCocktailClink();
    });
  }

  if (doneBookingBtn) {
    doneBookingBtn.addEventListener('click', () => {
      closeModal(bookingModal);
      setTimeout(() => {
        bookingForm.classList.remove('hidden');
        bookingSuccess.classList.add('hidden');
        bookingForm.reset();
      }, 400);
    });
  }


  // ==========================================================================
  // 4. WIX STUDIO SPECS MODAL
  // ==========================================================================
  if (openWixSpecs) {
    openWixSpecs.addEventListener('click', () => openModal(wixModal));
  }

  if (closeWixModal) {
    closeWixModal.addEventListener('click', () => closeModal(wixModal));
  }

  wixModal.addEventListener('click', (e) => {
    if (e.target === wixModal) closeModal(wixModal);
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(bookingModal);
      closeModal(wixModal);
    }
  });

  // Initialize on user interaction to unlock Web Audio autoplay policy
  document.addEventListener('click', () => {
    initAudio();
  }, { once: true });
});
