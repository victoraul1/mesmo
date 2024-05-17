const socket = io();

socket.on('contentUpdate', (data) => {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = ''; // Clear previous content

    data.menu.forEach((section) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = section.categoria;
        sectionElement.appendChild(sectionTitle);

        section.items.forEach((item) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemName = document.createElement('span');
            itemName.classList.add('item-name');
            itemName.textContent = item.nombre;

            const itemDesc = document.createElement('span');
            itemDesc.classList.add('item-desc');
            itemDesc.textContent = item.descripcion;

            const itemPrice = document.createElement('span');
            itemPrice.classList.add('item-price');
            itemPrice.textContent = `S/. ${item.precio}`;

            const nameDescWrapper = document.createElement('div');
            nameDescWrapper.classList.add('name-desc-wrapper');
            nameDescWrapper.appendChild(itemName);
            nameDescWrapper.appendChild(itemDesc);

            itemElement.appendChild(nameDescWrapper);
            itemElement.appendChild(itemPrice);

            sectionElement.appendChild(itemElement);
        });

        menuContainer.appendChild(sectionElement);
    });
});
