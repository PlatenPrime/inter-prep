const rows = [
  { id: 1, name: 'Анна К.', role: 'Frontend', status: 'active' },
  { id: 2, name: 'Борис М.', role: 'Backend', status: 'away' },
  { id: 3, name: 'Вика С.', role: 'Designer', status: 'active' },
  { id: 4, name: 'Глеб П.', role: 'QA', status: 'offline' },
  { id: 5, name: 'Дина Л.', role: 'PM', status: 'active' },
  { id: 6, name: 'Егор Т.', role: 'DevOps', status: 'active' },
  { id: 7, name: 'Жанна Р.', role: 'Frontend', status: 'away' },
  { id: 8, name: 'Илья В.', role: 'Backend', status: 'active' },
  { id: 9, name: 'Кира Н.', role: 'Designer', status: 'offline' },
  { id: 10, name: 'Лев Д.', role: 'QA', status: 'active' },
  { id: 11, name: 'Мила О.', role: 'Frontend', status: 'active' },
  { id: 12, name: 'Никита Е.', role: 'Backend', status: 'away' },
];

const statusLabels = {
  active: 'Онлайн',
  away: 'Отошёл',
  offline: 'Оффлайн',
};

let data = [...rows];
let sortKey = 'id';
let sortDir = 'asc';

const tbody = document.getElementById('tableBody');
const headers = document.querySelectorAll('.sortable');

function render() {
  const sorted = [...data].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv), 'ru');
    return sortDir === 'asc' ? cmp : -cmp;
  });

  tbody.innerHTML = sorted
    .map(
      (row) => `
    <tr>
      <td>${row.id}</td>
      <td>${row.name}</td>
      <td>${row.role}</td>
      <td><span class="status status--${row.status}">${statusLabels[row.status]}</span></td>
    </tr>
  `
    )
    .join('');
}

headers.forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }

    headers.forEach((h) => h.classList.remove('sortable--asc', 'sortable--desc'));
    th.classList.add(sortDir === 'asc' ? 'sortable--asc' : 'sortable--desc');

    render();
  });
});

render();
