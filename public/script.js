const socket = io();

// Function to display the menu
function displayMenu(menuData) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = ''; // Clear previous content

    menuData.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = document.createElement('h2');
        categoryElement.textContent = section.categoria;
        sectionElement.appendChild(categoryElement);

        section.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameElement = document.createElement('span');
            itemNameElement.textContent = item.nombre;
            itemElement.appendChild(itemNameElement);

            const itemPriceElement = document.createElement('span');
            itemPriceElement.textContent = item.precio;
            itemElement.appendChild(itemPriceElement);

            sectionElement.appendChild(itemElement);
        });

        menuContainer.appendChild(sectionElement);
    });
}

// Listen for menu updates
socket.on('contentUpdate', (data) => {
    displayMenu(data.menu);
});
 