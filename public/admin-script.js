const socket = io();

socket.on('contentUpdate', (data) => {
    const menuForm = document.getElementById('menuForm');
    menuForm.innerHTML = '';

    data.menu.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.innerHTML = `<h2>${section.title}</h2>`;
        section.items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                <input type="text" value="${item.name}" data-section="${sectionIndex}" data-item="${itemIndex}" class="item-name">
                <input type="text" value="${item.price}" data-section="${sectionIndex}" data-item="${itemIndex}" class="item-price">
            `;
            sectionElement.appendChild(itemElement);
        });
        menuForm.appendChild(sectionElement);
    });
});

const saveChanges = () => {
    const menu = [];
    const sections = document.querySelectorAll('#menuForm > div');
    
    sections.forEach((sectionElement, sectionIndex) => {
        const section = { title: sectionElement.querySelector('h2').innerText, items: [] };
        const items = sectionElement.querySelectorAll('div > input');
        
        for (let i = 0; i < items.length; i += 2) {
            const nameInput = items[i];
            const priceInput = items[i + 1];
            section.items.push({ name: nameInput.value, price: priceInput.value });
        }
        
        menu.push(section);
    });

    socket.emit('save', { menu });
};

document.getElementById('saveButton').addEventListener('click', saveChanges);
