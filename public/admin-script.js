const socket = io();

socket.on('contentUpdate', (data) => {
    const menuForm = document.getElementById('menu-form');
    if (!menuForm) return;
    menuForm.innerHTML = ''; // Clear previous content

    data.menu.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = document.createElement('input');
        categoryElement.type = 'text';
        categoryElement.value = section.categoria;
        categoryElement.dataset.index = sectionIndex;
        categoryElement.dataset.type = 'category';
        sectionElement.appendChild(categoryElement);

        section.items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameElement = document.createElement('input');
            itemNameElement.type = 'text';
            itemNameElement.value = item.nombre;
            itemNameElement.dataset.sectionIndex = sectionIndex;
            itemNameElement.dataset.itemIndex = itemIndex;
            itemNameElement.dataset.type = 'name';

            const itemPriceElement = document.createElement('input');
            itemPriceElement.type = 'text';
            itemPriceElement.value = item.precio;
            itemPriceElement.dataset.sectionIndex = sectionIndex;
            itemPriceElement.dataset.itemIndex = itemIndex;
            itemPriceElement.dataset.type = 'price';

            itemElement.appendChild(itemNameElement);
            itemElement.appendChild(itemPriceElement);
            sectionElement.appendChild(itemElement);
        });

        menuForm.appendChild(sectionElement);
    });
});

const addCategoryButton = document.getElementById('add-category');
addCategoryButton.addEventListener('click', () => {
    const menuForm = document.getElementById('menu-form');
    const sectionElement = document.createElement('div');
    sectionElement.classList.add('menu-section');

    const categoryElement = document.createElement('input');
    categoryElement.type = 'text';
    categoryElement.placeholder = 'Nueva Categoría';
    categoryElement.dataset.type = 'category';
    sectionElement.appendChild(categoryElement);

    menuForm.appendChild(sectionElement);
});

// Guardar cambios desde el formulario de administración
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    const menuForm = document.getElementById('menu-form');
    const sections = menuForm.querySelectorAll('.menu-section');
    const updatedMenu = [];

    sections.forEach(sectionElement => {
        const categoryElement = sectionElement.querySelector('input[data-type="category"]');
        const sectionIndex = categoryElement.dataset.index;
        const category = categoryElement.value;

        const items = [];
        const itemElements = sectionElement.querySelectorAll('.menu-item');
        itemElements.forEach(itemElement => {
            const itemNameElement = itemElement.querySelector('input[data-type="name"]');
            const itemPriceElement = itemElement.querySelector('input[data-type="price"]');

            items.push({
                nombre: itemNameElement.value,
                precio: itemPriceElement.value
            });
        });

        updatedMenu.push({
            categoria: category,
            items: items
        });
    });

    socket.emit('save', { menu: updatedMenu });
});
