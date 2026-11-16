/* STUDIO. — pienet, esteettömät käyttöliittymätoiminnot */
'use strict';

document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#nav-links');
const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const topButton = document.querySelector('.takaisin-ylos');
const mobileQuery = window.matchMedia('(max-width: 760px)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function closeMenu() {
  if (!menuButton || !menu) return;
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Avaa valikko');
}

if (menuButton && menu) {
  menuButton.hidden = false;

  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Sulje valikko' : 'Avaa valikko');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener('pointerdown', event => {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  mobileQuery.addEventListener('change', closeMenu);
}

// Aktiivinen osio navigaatiossa myös silloin, kun käyttäjä vierittää käsin.
const sections = [...document.querySelectorAll('main section[id]')];
let scrollScheduled = false;

function updateScrollUi() {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 250) + 95;
  let activeSection = 'etusivu';

  for (const section of sections) {
    if (section.offsetTop <= marker) activeSection = section.id;
  }

  for (const link of navLinks) {
    if (link.getAttribute('href') === `#${activeSection}`) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  }

  if (topButton) topButton.classList.toggle('is-visible', window.scrollY > 650);
  scrollScheduled = false;
}

window.addEventListener('scroll', () => {
  if (!scrollScheduled) {
    scrollScheduled = true;
    window.requestAnimationFrame(updateScrollUi);
  }
}, { passive: true });
window.addEventListener('resize', updateScrollUi);
updateScrollUi();

if (topButton) {
  topButton.hidden = false;
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
}

// Animaatiot tulevat käyttöön vain, jos selain tukee IntersectionObserveria.
// Ilman JavaScriptiä ja liikkeen vähennys -asetuksella kaikki sisältö näkyy aina.
const revealItems = [...document.querySelectorAll('.reveal')];
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px 25px 0px', threshold: 0.06 });

  document.documentElement.classList.add('has-reveal');
  revealItems.forEach(item => revealObserver.observe(item));
}