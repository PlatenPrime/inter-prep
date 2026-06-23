const products = [
  { title: 'Наушники Pro', price: '4 990 ₽', desc: 'Шумоподавление, 30 ч автономности.' },
  { title: 'Клавиатура Mech', price: '6 500 ₽', desc: 'Hot-swap, RGB подсветка.' },
  { title: 'Монитор 27"', price: '18 900 ₽', desc: 'IPS, 144 Гц, USB-C.' },
  { title: 'Веб-камера HD', price: '3 200 ₽', desc: '1080p, автофокус, микрофон.' },
  { title: 'Коврик XL', price: '1 490 ₽', desc: '900×400 мм, нескользящее основание.' },
  { title: 'Док-станция', price: '8 700 ₽', desc: 'Thunderbolt, 3 монитора.' },
];

const grid = document.getElementById('cardGrid');

const fragment = document.createDocumentFragment();

products.forEach((product, index) => {
  const article = document.createElement('article');
  article.className = 'card';
  article.innerHTML = `
    <img class="card__image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect fill='%23${(index % 2 ? '64748b' : '94a3b8')}' width='400' height='250'/%3E%3C/svg%3E" alt="" />
    <div class="card__body">
      <h2 class="card__title">${product.title}</h2>
      <p class="card__price">${product.price}</p>
      <p class="card__desc">${product.desc}</p>
      <button type="button" class="card__btn">В корзину</button>
    </div>
  `;
  fragment.appendChild(article);
});

grid.appendChild(fragment);

grid.addEventListener('click', (event) => {
  const btn = event.target.closest('.card__btn');
  if (!btn) return;
  const title = btn.closest('.card')?.querySelector('.card__title')?.textContent;
  btn.textContent = 'Добавлено ✓';
  btn.disabled = true;
  console.log(`Добавлено: ${title}`);
});
