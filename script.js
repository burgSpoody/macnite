let hasInteracted = false;
let allCategories = [];
let activeFilter = 'all';
const selectedApps = new Set();

//  Load app list 

fetch('applist.json')
    .then(response => response.json())
    .then(data => {
        allCategories = data.categories;
        renderApps();
        updateCount();
    });

//  Render apps (respects active filter + search query) 

function renderApps() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const appSelection = document.getElementById('app-selection');
    appSelection.innerHTML = '';

    allCategories.forEach(category => {
        if (activeFilter !== 'all' && category.id !== activeFilter) return;

        const filteredApps = query
            ? category.apps.filter(app => app.name.toLowerCase().includes(query))
            : category.apps;

        if (filteredApps.length === 0) return;

        const section = document.createElement('div');
        section.className = 'category-section';

        const header = document.createElement('div');
        header.className = 'category';
        header.innerHTML = `${category.name} <span class="category-count">${filteredApps.length}</span>`;
        section.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'app-grid';

        filteredApps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card';
            card.dataset.id = app.id;
            card.title = app.description || '';

            if (selectedApps.has(app.id)) card.classList.add('selected');

            card.addEventListener('click', () => {
                hasInteracted = true;
                if (selectedApps.has(app.id)) {
                    selectedApps.delete(app.id);
                    card.classList.remove('selected');
                } else {
                    selectedApps.add(app.id);
                    card.classList.add('selected');
                }
                updateCount();
            });

            const icon = document.createElement('img');
            icon.src = `assets/app-icons/WebP/${app.id}-dark.webp`;
            icon.alt = app.name;
            icon.className = 'app-icon';

            const name = document.createElement('span');
            name.className = 'app-name';
            name.textContent = app.name;

            const checkbox = document.createElement('div');
            checkbox.className = 'app-checkbox';

            card.appendChild(icon);
            card.appendChild(name);
            card.appendChild(checkbox);
            grid.appendChild(card);
        });

        section.appendChild(grid);
        appSelection.appendChild(section);
    });
}

//  Update selected count + button state 

function updateCount() {
    const count = selectedApps.size;
    document.getElementById('selected-count').textContent =
        count === 1 ? '1 app selected' : `${count} apps selected`;
    document.getElementById('install-btn').disabled = count === 0;
    if (count === 0) {
        document.getElementById('launch-macnite').classList.remove('visible');
    }
}
//  Category nav filtering 

document.getElementById('category-nav').addEventListener('click', e => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    e.preventDefault();

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    activeFilter = item.dataset.cat;
    renderApps();
});

//  Search filtering 

document.getElementById('search-input').addEventListener('input', () => {
    renderApps();
});

//  Install button 

document.getElementById('install-btn').addEventListener('click', e => {
    e.stopPropagation();

    console.log(JSON.stringify({ selectedApps: Array.from(selectedApps) }));

    document.getElementById('launch-macnite').classList.add('visible');
});

//  Launch MacNite button 

document.getElementById('launch-macnite').addEventListener('click', e => {
    e.stopPropagation();

    const launchBtn = document.getElementById('launch-macnite');
    if (!launchBtn.classList.contains('visible')) return;

    const appList = Array.from(selectedApps).join(',');
    window.location.href = `macnite://install?apps=${appList}`;
});