const socket = io();

socket.on('contentUpdate', (data) => {
    const menuContainer = document.getElementById('menu-container');
    if (!menuContainer) return;
    menuContainer.innerHTML = ''; // Clear previous content

    data.menu.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = document.createElement('h3');
        categoryElement.textContent = section.categoria;
        sectionElement.appendChild(categoryElement);

        section.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameElement = document.createElement('span');
            itemNameElement.textContent = item.nombre;
            itemElement.appendChild(itemNameElement);

            const itemPriceElement = document.createElement('span');
            itemPriceElement.textContent = `S/. ${item.precio}`;
            itemElement.appendChild(itemPriceElement);

            sectionElement.appendChild(itemElement);
        });

        menuContainer.appendChild(sectionElement);
    });
});
