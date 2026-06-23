const container = document.getElementById('toastContainer');
const demo = document.querySelector('.demo');

const messages = {
  success: 'Операция выполнена успешно!',
  error: 'Произошла ошибка. Попробуйте снова.',
  info: 'Новая версия доступна для скачивания.',
};

const AUTO_DISMISS_MS = 3000;

function removeToast(toast) {
  toast.classList.add('toast--leaving');
  toast.addEventListener(
    'animationend',
    () => toast.remove(),
    { once: true }
  );
}

function showToast(type) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <p class="toast__message">${messages[type] ?? type}</p>
    <button type="button" class="toast__close" aria-label="Закрыть">×</button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast__close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  const timer = setTimeout(() => removeToast(toast), AUTO_DISMISS_MS);
  toast.addEventListener('mouseenter', () => clearTimeout(timer));
}

demo.addEventListener('click', (event) => {
  const type = event.target.dataset.toast;
  if (!type) return;
  showToast(type);
});
