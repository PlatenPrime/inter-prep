/**
 * Мобильное меню: открытие/закрытие, a11y, Escape, overlay
 */
(function () {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');

  if (!menuToggle || !mainNav || !overlay) return;

  const navLinks = mainNav.querySelectorAll('.main-nav__link');

  function setOpen(isOpen) {
    menuToggle.classList.toggle('is-open', isOpen);
    mainNav.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    document.body.classList.toggle('is-nav-open', isOpen);

    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
    mainNav.setAttribute('aria-hidden', String(!isOpen));
    overlay.setAttribute('aria-hidden', String(!isOpen));
  }

  function toggle() {
    const isOpen = !menuToggle.classList.contains('is-open');
    setOpen(isOpen);
  }

  function close() {
    setOpen(false);
  }

  menuToggle.addEventListener('click', toggle);
  overlay.addEventListener('click', close);

  navLinks.forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.classList.contains('is-open')) {
      close();
      menuToggle.focus();
    }
  });
})();
