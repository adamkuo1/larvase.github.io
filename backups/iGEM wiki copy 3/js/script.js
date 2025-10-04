// --- Mobile menu toggle & submenu handling ---
function toggleMobileMenu() {
  const nav = document.getElementById('mobile-nav');
  const icon = document.getElementById('menu-icon');
  if (!nav || !icon) return;
  nav.classList.toggle('show');
  icon.textContent = nav.classList.contains('show') ? 'close' : 'menu';
}

// Expand/collapse submenus on tap/click
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.mobile-toggle');
  if (!toggle) return;
  const dropdown = toggle.parentElement;
  const submenu = dropdown ? dropdown.querySelector('.mobile-submenu') : null;
  if (!submenu) return;
  e.preventDefault();
  dropdown.classList.toggle('open');
  submenu.style.display = dropdown.classList.contains('open') ? 'flex' : 'none';
});
        


        // Dynamic navigation background on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('nav');
            if (window.scrollY > 50) {
                nav.style.background = 'rgba(255, 255, 255, 0.95)';
                nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.15)';
            } else {
                nav.style.background = 'rgba(255, 255, 255, 0.85)';
                nav.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
            }
        });

        // Intersection Observer for section animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate cards with delay
                    const cards = entry.target.querySelectorAll('.about-card, .stat-item, .team-member');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);



        // Observe all .sentences elements
        document.querySelectorAll('.sentences').forEach(sentence => {
        sectionObserver.observe(sentence);
        });



        // Observe all sections
        document.querySelectorAll('.section:not(.hero)').forEach(section => {
            sectionObserver.observe(section);
        });

        





        // Parallax effect for subtle movement
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const sections = document.querySelectorAll('.section');
            
            sections.forEach((section, index) => {
                const rate = scrolled * -0.3;
                if (index % 2 === 0) {
                    section.style.transform = `translateY(${rate * 0.1}px)`;
                }
            });
        });

        // Smooth page load animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });

        //Add smooth transition to negivations
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

// --- Keep mobile menu state consistent on resize ---
(function() {
  const MOBILE_BP = 905; // must match CSS breakpoint
  let resizeTimer = null;
  function syncMenuToWidth() {
    const nav = document.getElementById('mobile-nav');
    const icon = document.getElementById('menu-icon');
    if (!nav || !icon) return;
    if (window.innerWidth > MOBILE_BP) {
      // Hide mobile menu and reset icon when desktop layout is active
      nav.classList.remove('show');
      icon.textContent = 'menu';
    }
  }
  // Run on load
  window.addEventListener('load', syncMenuToWidth);
  // Debounced resize
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(syncMenuToWidth, 100);
  });
})();

// ==========================
// Team Page – Flip Cards JS
// ==========================
(function () {
  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlipCards);
  } else {
    initFlipCards();
  }

  function initFlipCards() {
    const flipCards = Array.from(document.querySelectorAll('.flip-card'));
    if (!flipCards.length) return;

    const isTouchOnly = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    // Helper: close all cards except optionally one
    const unflipAll = (except) => {
      flipCards.forEach((card) => {
        const inner = card.querySelector('.flip-card-inner');
        if (!inner) return;
        if (inner !== except) inner.classList.remove('is-flipped');
      });
    };

    flipCards.forEach((card) => {
      const inner = card.querySelector('.flip-card-inner');
      if (!inner) return;

      // Accessibility: make the card focusable and button-like
      inner.setAttribute('tabindex', '0');
      inner.setAttribute('role', 'button');
      inner.setAttribute('aria-pressed', 'false');

      // On touch devices, use click/tap to toggle flip instead of hover
      if (isTouchOnly) {
        card.classList.add('tap-flip');
        inner.addEventListener('click', (e) => {
          // Ignore clicks that originate from links or scroll gestures
          if ((e.target.closest('a'))) return;
          const willFlipOn = !inner.classList.contains('is-flipped');
          unflipAll(willFlipOn ? inner : null);
          inner.classList.toggle('is-flipped');
          inner.setAttribute('aria-pressed', inner.classList.contains('is-flipped'));
        });
      }

      // Keyboard support (Enter/Space)
      inner.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const willFlipOn = !inner.classList.contains('is-flipped');
          unflipAll(willFlipOn ? inner : null);
          inner.classList.toggle('is-flipped');
          inner.setAttribute('aria-pressed', inner.classList.contains('is-flipped'));
        }
        // ESC closes the current card
        if (e.key === 'Escape') {
          inner.classList.remove('is-flipped');
          inner.setAttribute('aria-pressed', 'false');
        } 
      });
    });

    // Close any open card when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target.closest('.flip-card')) return;
      unflipAll(null);
    });
  }
})();

// Style hook: when we toggle .is-flipped via JS, mirror the hover effect
// (The CSS should already flip on :hover. Add this small helper class support.)

// ==========================
// Hero (Team) – Opening Reveal
// ==========================
(function () {
  const HERO_SELECTOR = '.hero.hero--team[data-hero]';
  const REVEAL_DELAY_MS = 900;      // time to keep the title visible before fading

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else { fn(); }
  }

  function onImageReady(img, cb) {
    if (!img) { cb(); return; }
    if (img.complete && img.naturalWidth > 0) { cb(); return; }
    const done = () => { img.removeEventListener('load', done); img.removeEventListener('error', done); cb(); };
    img.addEventListener('load', done, { once: true });
    img.addEventListener('error', done, { once: true });
  }

  function reveal() {
    const hero = document.querySelector(HERO_SELECTOR);
    if (!hero) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const img = hero.querySelector('.hero__img');

    onImageReady(img, () => {
      // Give the browser one frame to paint the initial (dark, zoomed) state
      requestAnimationFrame(() => {
        if (prefersReduced) {
          hero.classList.add('is-revealed');
          return;
        }
        setTimeout(() => {
          hero.classList.add('is-revealed');
        }, REVEAL_DELAY_MS);
      });
    });
  }

  ready(reveal);
})();