let hasInteracted = false;

fetch('applist.json')
  .then(response => response.json())
  .then(data => {
    generateApps(data);
    document.getElementById('install-btn').disabled = true;
  })

function updateCount() {
  const selectedCards = document.querySelectorAll('.app-card.selected');
  const count = selectedCards.length;

  document.getElementById('selected-count').textContent =
    count === 1 ? '1 app selected' : `${count} apps selected`;

  document.getElementById('install-btn').disabled = count === 0;

  const allCards = document.querySelectorAll('.app-card');

  if (count === 0 && hasInteracted) {
    allCards.forEach(card => { card.style.opacity = '0.4'; });
  } else if (count > 0) {
    allCards.forEach(card => {
      card.style.opacity = card.classList.contains('selected') ? '1' : '0.4';
    });
  }
}

function generateApps(data) {
  const appSelection = document.getElementById('app-selection');
  appSelection.innerHTML = '';

  data.categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';

    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.name;
    categoryDiv.appendChild(categoryTitle);

    const appGrid = document.createElement('div');
    appGrid.className = 'app-grid';

    category.apps.forEach(app => {
      const appCard = document.createElement('div');
      appCard.className = 'app-card';
      appCard.dataset.id = app.id;
      appCard.title = app.description;

      appCard.addEventListener('click', () => {
        hasInteracted = true;
        appCard.classList.toggle('selected');
        updateCount();
      });

      const img = document.createElement('img');
      img.src = `Icons/WebP/${app.id}-dark.webp`;
      img.alt = app.name;
      img.width = 100;
      img.height = 100;

      const appName = document.createElement('p');
      appName.textContent = app.name;

      appCard.appendChild(img);
      appCard.appendChild(appName);
      appGrid.appendChild(appCard);
    });

    categoryDiv.appendChild(appGrid);
    appSelection.appendChild(categoryDiv);
  });
}

// Install button — shows the launch button
document.getElementById('install-btn').addEventListener('click', (e) => {
  e.stopPropagation();

  const selectedCards = document.querySelectorAll('.app-card.selected');
  const selectedApps = [];
  selectedCards.forEach(card => {
    selectedApps.push(card.dataset.id);
  });

  console.log(JSON.stringify({ selectedApps: selectedApps }));

  // Enable the launch button
  document.getElementById('launch-macnite').classList.add('visible');
});

// Launch MacNite button — fires macnite:// with app list in URL
document.getElementById('launch-macnite').addEventListener('click', (e) => {
  e.stopPropagation();

  const launchBtn = document.getElementById('launch-macnite');
  if (!launchBtn.classList.contains('visible')) return;

  const selectedCards = document.querySelectorAll('.app-card.selected');
  const selectedApps = [];
  selectedCards.forEach(card => {
    selectedApps.push(card.dataset.id);
  });

  const appList = selectedApps.join(',');
  window.location.href = `macnite://install?apps=${appList}`;
});