type TabName = 'list' | 'board' | 'timeline' | 'calendar' | 'progress';

function activateTab(clickedLi: HTMLLIElement, name: TabName): void {
  const allItems = document.querySelectorAll<HTMLLIElement>('.kanban-nav li');

  allItems.forEach(li => {
    li.classList.remove('active');
    const iconName = li.dataset.name as TabName;
    const img = li.querySelector<HTMLImageElement>('img');
    if (img && iconName) {
      img.src = `/src/assets/${iconName}.svg`; 
    }
  });

  clickedLi.classList.add('active');
  const img = clickedLi.querySelector<HTMLImageElement>('img');
  if (img) {
    img.src = `/src/assets/${name}-active.svg`; 
  }
}


document.querySelectorAll<HTMLLIElement>('.kanban-nav li').forEach(li => {
  const name = li.dataset.name as TabName;
  if (name) li.addEventListener('click', () => activateTab(li, name));
});