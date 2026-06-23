const accordion = document.getElementById('accordion');
const triggers = accordion.querySelectorAll('.accordion__trigger');

function closePanel(trigger, panel) {
  panel.classList.remove('accordion__panel--open');
  trigger.setAttribute('aria-expanded', 'false');
  panel.addEventListener(
    'transitionend',
    () => {
      if (!panel.classList.contains('accordion__panel--open')) {
        panel.hidden = true;
      }
    },
    { once: true }
  );
}

function openPanel(trigger, panel) {
  panel.hidden = false;
  requestAnimationFrame(() => {
    panel.classList.add('accordion__panel--open');
  });
  trigger.setAttribute('aria-expanded', 'true');
}

triggers.forEach((trigger) => {
  const panelId = trigger.getAttribute('aria-controls');
  const panel = document.getElementById(panelId);

  const inner = document.createElement('div');
  inner.className = 'accordion__panel-inner';
  while (panel.firstChild) {
    inner.appendChild(panel.firstChild);
  }
  panel.appendChild(inner);

  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    triggers.forEach((otherTrigger) => {
      const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
      if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
        closePanel(otherTrigger, otherPanel);
      }
    });

    if (isOpen) {
      closePanel(trigger, panel);
    } else {
      openPanel(trigger, panel);
    }
  });
});
