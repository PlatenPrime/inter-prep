const dropdown = document.getElementById('dropdown');
const trigger = document.getElementById('dropdownTrigger');
const menu = document.getElementById('dropdownMenu');
const log = document.getElementById('log');

const labels = {
  edit: 'Редактировать',
  duplicate: 'Дублировать',
  archive: 'В архив',
  delete: 'Удалить',
};

function isOpen() {
  return trigger.getAttribute('aria-expanded') === 'true';
}

function openMenu() {
  menu.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  menu.hidden = true;
  trigger.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  if (isOpen()) closeMenu();
  else openMenu();
}

trigger.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMenu();
});

menu.addEventListener('click', (event) => {
  const item = event.target.closest('[data-action]');
  if (!item) return;

  const action = item.dataset.action;
  log.textContent = `Выполнено: ${labels[action] ?? action}`;
  closeMenu();
});

document.addEventListener('click', (event) => {
  if (!dropdown.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isOpen()) {
    closeMenu();
    trigger.focus();
  }
});
