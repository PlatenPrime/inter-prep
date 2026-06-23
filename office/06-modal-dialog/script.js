const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const confirmBtn = document.getElementById('confirmBtn');

let previousFocus = null;

const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function getFocusableElements() {
  return [...modal.querySelectorAll(focusableSelector)].filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

function openModal() {
  previousFocus = document.activeElement;
  modal.hidden = false;
  document.body.classList.add('modal-open');

  const focusable = getFocusableElements();
  (focusable[0] ?? modal).focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
}

openBtn.addEventListener('click', openModal);

modal.addEventListener('click', (event) => {
  if (event.target.matches('[data-close]')) closeModal();
});

confirmBtn.addEventListener('click', () => {
  alert('Элемент удалён (демо)');
  closeModal();
});

document.addEventListener('keydown', (event) => {
  if (modal.hidden) return;

  if (event.key === 'Escape') {
    closeModal();
    return;
  }

  if (event.key !== 'Tab') return;

  const focusable = getFocusableElements();
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
