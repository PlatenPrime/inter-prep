const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const navOverlay = document.getElementById('navOverlay');
const mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');

const desktopQuery = window.matchMedia('(min-width: 48rem)');

let previousFocus = null;

function isOpen() {
  return menuToggle.getAttribute('aria-expanded') === 'true';
}

function openNav() {
  previousFocus = document.activeElement;

  navOverlay.hidden = false;
  mobileNav.hidden = false;

  requestAnimationFrame(() => {
    document.body.classList.add('nav-open');
    menuToggle.classList.add('menu-toggle--active');
    navOverlay.classList.add('nav-overlay--visible');
    mobileNav.classList.add('mobile-nav--open');
  });

  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Закрыть меню');
  mobileNav.setAttribute('aria-hidden', 'false');
  navOverlay.setAttribute('aria-hidden', 'false');

  const firstLink = mobileNav.querySelector('.mobile-nav__link');
  firstLink?.focus();
}

function closeNav() {
  document.body.classList.remove('nav-open');
  menuToggle.classList.remove('menu-toggle--active');
  navOverlay.classList.remove('nav-overlay--visible');
  mobileNav.classList.remove('mobile-nav--open');

  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  mobileNav.setAttribute('aria-hidden', 'true');
  navOverlay.setAttribute('aria-hidden', 'true');

  const onTransitionEnd = (event) => {
    if (event.target !== mobileNav || event.propertyName !== 'transform') return;
    mobileNav.hidden = true;
    navOverlay.hidden = true;
    mobileNav.removeEventListener('transitionend', onTransitionEnd);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mobileNav.hidden = true;
    navOverlay.hidden = true;
  } else {
    mobileNav.addEventListener('transitionend', onTransitionEnd);
  }

  previousFocus?.focus();
}

function toggleNav() {
  if (isOpen()) closeNav();
  else openNav();
}

menuToggle.addEventListener('click', toggleNav);

navOverlay.addEventListener('click', closeNav);

mobileLinks.forEach((link) => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isOpen()) {
    closeNav();
  }
});

function handleDesktopChange(event) {
  if (event.matches && isOpen()) {
    closeNav();
  }
}

desktopQuery.addEventListener('change', handleDesktopChange);
