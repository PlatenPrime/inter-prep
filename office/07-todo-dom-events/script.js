let todos = [
  { id: 1, text: 'Повторить Flexbox', done: false },
  { id: 2, text: 'Сверстать модалку', done: true },
];
let nextId = 3;
let filter = 'all';

const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');
const itemsLeft = document.getElementById('itemsLeft');
const clearDone = document.getElementById('clearDone');
const filters = document.querySelector('.todo-filters');

function getFilteredTodos() {
  if (filter === 'active') return todos.filter((t) => !t.done);
  if (filter === 'done') return todos.filter((t) => t.done);
  return todos;
}

function render() {
  const filtered = getFilteredTodos();
  const activeCount = todos.filter((t) => !t.done).length;
  const doneCount = todos.filter((t) => t.done).length;

  if (filtered.length === 0) {
    list.innerHTML = `<li class="todo-empty">${todos.length === 0 ? 'Список пуст. Добавьте задачу.' : 'Нет задач в этой категории.'}</li>`;
  } else {
    list.innerHTML = filtered
      .map(
        (todo) => `
      <li class="todo-item${todo.done ? ' todo-item--done' : ''}" data-id="${todo.id}">
        <input type="checkbox" class="todo-item__checkbox" ${todo.done ? 'checked' : ''} aria-label="Отметить выполненной" />
        <span class="todo-item__text">${escapeHtml(todo.text)}</span>
        <button type="button" class="todo-item__delete" aria-label="Удалить">×</button>
      </li>
    `
      )
      .join('');
  }

  itemsLeft.textContent = `${activeCount} ${pluralize(activeCount, 'задача', 'задачи', 'задач')}`;
  clearDone.hidden = doneCount === 0;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pluralize(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: nextId++, text, done: false });
  input.value = '';
  render();
});

list.addEventListener('click', (event) => {
  const item = event.target.closest('.todo-item');
  if (!item) return;

  const id = Number(item.dataset.id);

  if (event.target.matches('.todo-item__checkbox')) {
    const todo = todos.find((t) => t.id === id);
    if (todo) todo.done = event.target.checked;
    render();
    return;
  }

  if (event.target.matches('.todo-item__delete')) {
    todos = todos.filter((t) => t.id !== id);
    render();
  }
});

filters.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-filter]');
  if (!btn) return;

  filter = btn.dataset.filter;
  filters.querySelectorAll('.filter').forEach((f) => f.classList.remove('filter--active'));
  btn.classList.add('filter--active');
  render();
});

clearDone.addEventListener('click', () => {
  todos = todos.filter((t) => !t.done);
  render();
});

render();
