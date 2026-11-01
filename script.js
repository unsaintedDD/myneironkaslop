const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const tabMain = document.getElementById('tabMain');
const tabTrash = document.getElementById('tabTrash');
const tabFav = document.getElementById('tabFav');

let currentTab = 'main'; // По умолчанию активна вкладка "Важное"

// Работа с локальной памятью браузера
function getUserData() { return JSON.parse(localStorage.getItem('mySiteData')) || {}; }
function saveUserData(data) { localStorage.setItem('mySiteData', JSON.stringify(data)); }

// Добавление в избранное
function toggleFavorite(e, url) {
    e.preventDefault();
    const data = getUserData();
    if (!data[url]) data[url] = {};
    data[url].isFavorite = !data[url].isFavorite;
    saveUserData(data);
    renderResults();
}

// Запись времени открытия
function markAsOpened(url) {
    const data = getUserData();
    if (!data[url]) data[url] = {};
    data[url].lastOpened = new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    saveUserData(data);
}

// Отрисовка списка файлов
function renderResults() {
    resultsContainer.innerHTML = '';
    const lowerQuery = searchInput.value.toLowerCase().trim();
    const userData = getUserData();

    // Фильтр по тексту поиска
    let filtered = pagesData.filter(page => page.title.toLowerCase().includes(lowerQuery));

    // Фильтр по активной вкладке
    if (currentTab === 'main') {
        filtered = filtered.filter(page => page.category === 'важное');
    } else if (currentTab === 'trash') {
        filtered = filtered.filter(page => page.category === 'хлам');
    } else if (currentTab === 'fav') {
        filtered = filtered.filter(page => userData[page.url] && userData[page.url].isFavorite);
    }

    // Создание карточек
    filtered.forEach(page => {
        const pageData = userData[page.url] || {};
        const card = document.createElement('a');
        card.href = page.url;
        card.className = "block p-5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition relative group";
        card.addEventListener('click', () => markAsOpened(page.url));

        const starColor = pageData.isFavorite ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400';

        card.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <h2 class="text-xl font-semibold text-blue-400 pr-8">${page.title}</h2>
                <span class="text-xs px-2 py-1 rounded bg-green-900 text-green-300">HTML</span>
            </div>
            <p class="text-gray-400 text-xs mb-1">Папка: <span class="text-gray-200">${page.category}</span> | Открыто: <span class="text-gray-300">${pageData.lastOpened || 'Никогда'}</span></p>
            <button class="absolute top-4 right-4 text-2xl ${starColor} transition focus:outline-none fav-btn" title="Добавить в избранное">★</button>
        `;
        
        card.querySelector('.fav-btn').addEventListener('click', (e) => toggleFavorite(e, page.url));
        resultsContainer.appendChild(card);
    });
}

// Переключение визуального стиля вкладок
function switchTab(tabName) {
    currentTab = tabName;
    tabMain.className = currentTab === 'main' ? "px-4 py-2 bg-blue-600 text-white rounded-lg transition" : "px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition";
    tabTrash.className = currentTab === 'trash' ? "px-4 py-2 bg-blue-600 text-white rounded-lg transition" : "px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition";
    tabFav.className = currentTab === 'fav' ? "px-4 py-2 bg-blue-600 text-white rounded-lg transition" : "px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition";
    renderResults();
}

// Обработчики событий
tabMain.addEventListener('click', () => switchTab('main'));
tabTrash.addEventListener('click', () => switchTab('trash'));
tabFav.addEventListener('click', () => switchTab('fav'));
searchInput.addEventListener('input', renderResults);

// Запуск
renderResults();