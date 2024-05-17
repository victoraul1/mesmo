const socket = io();

socket.on('contentUpdate', (data) => {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    data.menu.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.innerHTML = `<h2>${section.title}</h2>`;
        section.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `<p>${item.name} - S/.${item.price}</p>`;
            sectionElement.appendChild(itemElement);
        });
        menuContainer.appendChild(sectionElement);
    });
});
