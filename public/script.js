const socket = io();

socket.on('contentUpdate', (data) => {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = ''; // Clear previous content

    data.menu.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = document.createElement('h2');
        categoryElement.textContent = section.categoria;
        sectionElement.appendChild(categoryElement);

        section.items.forEach(item => {
            const itemElement = document.createElement('p');
            itemElement.textContent = `${item.nombre} - ${item.precio}`;
            sectionElement.appendChild(itemElement);
        });

        menuContainer.appendChild(sectionElement);
    });
});
