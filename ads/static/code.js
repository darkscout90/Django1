// ============================================================
// 1. Сбор существующих объявлений в массив
// ============================================================
const adElements = Array.from(document.querySelectorAll('.ad'));
const ads = adElements.map(el => {
    const title = el.querySelector('h3')?.textContent?.trim() || '';
    const description = el.querySelector('p')?.textContent?.trim() || '';
    const priceEl = el.querySelector('.price');
    const priceText = priceEl?.textContent?.replace(/[^\d]/g, '') || '';
    const price = priceText ? parseInt(priceText, 10) : null;
    const phoneEl = el.querySelector('.phone');
    const phone = phoneEl?.textContent?.replace('📞 Телефон: ', '').trim() || '';
    const dateEl = el.querySelector('.date');
    const dateText = dateEl?.textContent?.replace('📅 Дата: ', '').trim() || '';
    const date = dateText ? new Date(dateText.replace(/(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})/, '$3-$2-$1T$4:$5')) : null;

    return { title, description, price, phone, date, element: el };
});

// ============================================================
// 2. Добавление панели управления (если ещё не добавлена)
// ============================================================
if (!document.getElementById('controlPanel')) {
    const container = document.querySelector('body > h1')?.parentNode;
    if (container) {
        const controls = document.createElement('div');
        controls.id = 'controlPanel';
        controls.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
        `;
        controls.innerHTML = `
            <input type="text" id="searchInput" placeholder="🔍 Поиск..." style="flex:1; min-width:150px; padding:8px; border:1px solid #ccc; border-radius:4px;">
            <select id="sortSelect" style="padding:8px; border:1px solid #ccc; border-radius:4px;">
                <option value="date-desc">📅 Сначала новые</option>
                <option value="date-asc">📅 Сначала старые</option>
                <option value="price-asc">💰 Дешевле</option>
                <option value="price-desc">💰 Дороже</option>
            </select>
            <span id="counter" style="margin-left:auto; font-size:0.9em; color:#555;">Найдено: ${ads.length}</span>
        `;
        // Вставляем перед первым объявлением или перед блоком "пусто"
        const firstAd = document.querySelector('.ad');
        const emptyBlock = document.querySelector('.empty');
        if (firstAd) container.insertBefore(controls, firstAd);
        else if (emptyBlock) container.insertBefore(controls, emptyBlock);
        else container.appendChild(controls);
    }
}

// ============================================================
// 3. Добавление кнопки "Показать телефон" (если ещё нет)
// ============================================================
adElements.forEach(el => {
    const phoneEl = el.querySelector('.phone');
    if (!phoneEl) return;
    // Если кнопка уже есть – пропускаем
    if (phoneEl.nextElementSibling?.tagName === 'BUTTON') return;

    const phoneText = phoneEl.textContent.replace('📞 Телефон: ', '').trim();
    if (!phoneText) return;

    // Скрываем номер
    phoneEl.style.display = 'none';
    const btn = document.createElement('button');
    btn.textContent = '📞 Показать телефон';
    btn.style.cssText = `
        background: #007bff;
        color: white;
        border: none;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.9em;
    `;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        phoneEl.style.display = '';
        this.remove();
    });
    phoneEl.parentNode.insertBefore(btn, phoneEl.nextSibling);
});

// ============================================================
// 4. Фильтрация и сортировка (без удаления элементов)
// ============================================================
let currentFilter = '';
let currentSort = 'date-desc';

function applyFilterAndSort() {
    const searchText = currentFilter.toLowerCase().trim();

    // Фильтрация – скрываем/показываем
    ads.forEach(ad => {
        const match = !searchText || ad.title.toLowerCase().includes(searchText) ||
                                   ad.description.toLowerCase().includes(searchText);
        ad.element.style.display = match ? '' : 'none';
    });

    // Сортировка – меняем порядок элементов в DOM
    const visibleAds = ads.filter(ad => ad.element.style.display !== 'none');
    visibleAds.sort((a, b) => {
        switch (currentSort) {
            case 'date-desc':
                return (b.date || 0) - (a.date || 0);
            case 'date-asc':
                return (a.date || 0) - (b.date || 0);
            case 'price-asc':
                return (a.price ?? Infinity) - (b.price ?? Infinity);
            case 'price-desc':
                return (b.price ?? -Infinity) - (a.price ?? -Infinity);
            default:
                return 0;
        }
    });

    // Вставляем отсортированные элементы после панели управления
    const controlPanel = document.getElementById('controlPanel');
    if (controlPanel) {
        const parent = controlPanel.parentNode;
        // Удаляем все .ad из родителя (но не удаляем сами элементы, просто перемещаем)
        // Сначала сохраняем ссылки на все .ad
        const allAds = parent.querySelectorAll('.ad');
        // Перемещаем отсортированные элементы в нужном порядке
        visibleAds.forEach((ad, index) => {
            // Если элемент уже находится на правильной позиции, не трогаем
            // Просто вставляем после controlPanel, но перед остальными
            parent.appendChild(ad.element); // appendChild перемещает элемент, если он уже есть в DOM
        });
        // Теперь все элементы, которые не в visibleAds, останутся на своих местах (но они скрыты)
        // Чтобы они не мешали, они уже скрыты display:none
    }

    // Обновляем счётчик
    const counter = document.getElementById('counter');
    if (counter) {
        const visibleCount = ads.filter(ad => ad.element.style.display !== 'none').length;
        counter.textContent = `Найдено: ${visibleCount}`;
    }

    // Если нет видимых объявлений, показываем сообщение (но не удаляем существующие)
    const visibleCount = ads.filter(ad => ad.element.style.display !== 'none').length;
    const emptyBlock = document.querySelector('.empty');
    if (visibleCount === 0) {
        if (!emptyBlock) {
            const container = document.querySelector('body > h1')?.parentNode;
            if (container) {
                const msg = document.createElement('div');
                msg.className = 'empty';
                msg.innerHTML = `<h3>Ничего не найдено 😔</h3><p>Попробуйте изменить поисковый запрос.</p>`;
                container.appendChild(msg);
            }
        }
    } else {
        if (emptyBlock) emptyBlock.remove();
    }
}

// ============================================================
// 5. Обработчики событий
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilter = this.value;
            applyFilterAndSort();
        });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            applyFilterAndSort();
        });
    }

    // Применяем сортировку по умолчанию (новые сначала)
    applyFilterAndSort();
});