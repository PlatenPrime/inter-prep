const layout = document.getElementById('layout');
const toggleBtn = document.getElementById('toggleSidebar');

toggleBtn.addEventListener('click', () => {
  const collapsed = layout.classList.toggle('layout--collapsed');
  toggleBtn.textContent = collapsed ? 'Развернуть сайдбар' : 'Свернуть сайдбар';
});
