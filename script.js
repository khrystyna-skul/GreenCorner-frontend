document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://127.0.0.1:8000/api/plants/';
    const container = document.getElementById('plants-list');
    const modal = document.getElementById('plant-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.getElementById('close-modal');

    let allPlants = [];

    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error(`Помилка сервера (статус ${response.status})`);
            return response.json();
        })
        .then(data => {
            container.innerHTML = '';

            if (data && Array.isArray(data.items)) {
                allPlants = data.items;
            } else if (Array.isArray(data)) {
                allPlants = data;
            } else if (data && Array.isArray(data.results)) {
                allPlants = data.results;
            }

            if (allPlants.length === 0) {
                container.innerHTML = '<p class="status-message">Список рослин порожній.</p>';
                return;
            }

            allPlants.forEach(item => {
                const card = document.createElement('div');
                card.className = 'plant-card';

                const name = item.name || 'Без назви';
                const latinName = item.latinName ? `<em>(${item.latinName})</em>` : '';
                const price = item.price ? `${item.price} грн` : '';
                const imageUrl = item.imageUrl || '';

                card.innerHTML = `
                    ${imageUrl ? `<img src="${imageUrl}" alt="${name}" class="plant-image" onerror="this.style.display='none'">` : ''}
                    <div class="plant-info">
                        <h3>🌱 ${name}</h3>
                        ${latinName ? `<p class="latin-name">${latinName}</p>` : ''}
                        ${price ? `<p class="price">${price}</p>` : ''}
                        <button class="details-btn">Детальніше</button>
                    </div>
                `;

                card.addEventListener('click', () => openPlantDetails(item));

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            container.innerHTML = `<div class="error-message"><p>Помилка завантаження даних.</p></div>`;
        });

    function openPlantDetails(plant) {
        const typeName = plant.type ? plant.type.name : '—';
        const familyName = plant.family ? plant.family.name : '—';
        const nurseryName = plant.nursery ? plant.nursery.name : '—';

        modalBody.innerHTML = `
            <h2>🌱 ${plant.name}</h2>
            ${plant.latinName ? `<p class="latin-name"><em>${plant.latinName}</em></p>` : ''}
            ${plant.imageUrl ? `<img src="${plant.imageUrl}" alt="${plant.name}" class="modal-image">` : ''}
            
            <div class="details-grid">
                <p><strong>Ціна:</strong> ${plant.price || '—'} грн</p>
                <p><strong>В наявності:</strong> ${plant.stock ?? '—'} шт.</p>
                <p><strong>Освітлення:</strong> ${plant.lightLevel || '—'}</p>
                <p><strong>Складність догляду:</strong> ${plant.difficulty || '—'}</p>
                <p><strong>Безпечно для тварин:</strong> ${plant.petSafe ? 'Так 🐾' : 'Ні ⚠️'}</p>
                <p><strong>Тип:</strong> ${typeName}</p>
                <p><strong>Родина:</strong> ${familyName}</p>
                <p><strong>Розплідник:</strong> ${nurseryName}</p>
            </div>
        `;
        modal.style.display = 'block';
    }

    closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };
});