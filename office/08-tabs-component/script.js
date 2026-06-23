const tabsRoot = document.getElementById('tabs');
const tabList = tabsRoot.querySelector('[role="tablist"]');
const tabs = [...tabList.querySelectorAll('[role="tab"]')];
const panels = [...tabsRoot.querySelectorAll('[role="tabpanel"]')];

function activateTab(tab) {
  const targetId = tab.getAttribute('aria-controls');

  tabs.forEach((t) => {
    const isActive = t === tab;
    t.classList.toggle('tabs__tab--active', isActive);
    t.setAttribute('aria-selected', String(isActive));
    t.tabIndex = isActive ? 0 : -1;
  });

  panels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });

  tab.focus();
}

tabList.addEventListener('click', (event) => {
  const tab = event.target.closest('[role="tab"]');
  if (!tab) return;
  activateTab(tab);
});

tabList.addEventListener('keydown', (event) => {
  const currentIndex = tabs.indexOf(document.activeElement);
  if (currentIndex === -1) return;

  let nextIndex = currentIndex;

  if (event.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === 'Home') {
    nextIndex = 0;
  } else if (event.key === 'End') {
    nextIndex = tabs.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  activateTab(tabs[nextIndex]);
});
