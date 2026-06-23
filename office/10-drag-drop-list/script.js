const list = document.getElementById('dndList');
const orderLog = document.getElementById('orderLog');

let draggedItem = null;

function updateOrderLog() {
  const ids = [...list.querySelectorAll('.dnd-item')].map((el) => el.dataset.id);
  orderLog.textContent = `Порядок: ${ids.join(', ')}`;
}

function clearOverStates() {
  list.querySelectorAll('.dnd-item--over').forEach((el) => el.classList.remove('dnd-item--over'));
}

list.addEventListener('dragstart', (event) => {
  const item = event.target.closest('.dnd-item');
  if (!item) return;

  draggedItem = item;
  item.classList.add('dnd-item--dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', item.dataset.id);
});

list.addEventListener('dragend', () => {
  if (draggedItem) {
    draggedItem.classList.remove('dnd-item--dragging');
    draggedItem = null;
  }
  clearOverStates();
  updateOrderLog();
});

list.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  const target = event.target.closest('.dnd-item');
  if (!target || target === draggedItem) return;

  clearOverStates();
  target.classList.add('dnd-item--over');
});

list.addEventListener('dragleave', (event) => {
  const target = event.target.closest('.dnd-item');
  if (target) target.classList.remove('dnd-item--over');
});

list.addEventListener('drop', (event) => {
  event.preventDefault();
  const target = event.target.closest('.dnd-item');
  if (!target || !draggedItem || target === draggedItem) return;

  const items = [...list.querySelectorAll('.dnd-item')];
  const draggedIndex = items.indexOf(draggedItem);
  const targetIndex = items.indexOf(target);

  if (draggedIndex < targetIndex) {
    target.after(draggedItem);
  } else {
    target.before(draggedItem);
  }

  clearOverStates();
  updateOrderLog();
});

updateOrderLog();
