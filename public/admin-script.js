const socket = io();

let currentMenu = [];

// Función para actualizar el formulario
function updateForm(menuData) {
    const menuForm = document.getElementById('menu-form');
    menuForm.innerHTML = ''; // Clear previous content

    menuData.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = document.createElement('input');
        categoryElement.type = 'text';
        categoryElement.value = section.categoria;
        categoryElement.dataset.index = sectionIndex;
        categoryElement.dataset.type = 'category';
        sectionElement.appendChild(categoryElement);

        const addItemButton = document.createElement('button');
        addItemButton.type = 'button';
        addItemButton.innerHTML = '+';
        addItemButton.classList.add('add-item-button');
        addItemButton.addEventListener('click', () => {
            const newItem = {
                nombre: '',
                precio: ''
            };
            section.items.push(newItem);
            updateForm(currentMenu);
        });
        sectionElement.appendChild(addItemButton);

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.type = 'button';
        deleteCategoryButton.innerHTML = '-';
        deleteCategoryButton.classList.add('delete-category-button');
        deleteCategoryButton.addEventListener('click', () => {
            menuData.splice(sectionIndex, 1);
            updateForm(currentMenu);
        });
        sectionElement.appendChild(deleteCategoryButton);

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

            const addItemButton = document.createElement('button');
            addItemButton.type = 'button';
            addItemButton.innerHTML = '+';
            addItemButton.classList.add('add-item-button');
            addItemButton.addEventListener('click', () => {
                const newItem = {
                    nombre: '',
                    precio: ''
                };
                section.items.push(newItem);
                updateForm(currentMenu);
            });
            itemElement.appendChild(addItemButton);

            const deleteItemButton = document.createElement('button');
            deleteItemButton.type = 'button';
            deleteItemButton.innerHTML = '-';
            deleteItemButton.classList.add('delete-item-button');
            deleteItemButton.addEventListener('click', () => {
                section.items.splice(itemIndex, 1);
                updateForm(currentMenu);
            });
            itemElement.appendChild(deleteItemButton);

            sectionElement.appendChild(itemElement);
        });

        menuForm.appendChild(sectionElement);
    });
}

// Generar el formulario de edición del menú
socket.on('contentUpdate', (data) => {
    currentMenu = data.menu;
    updateForm(currentMenu);
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

    currentMenu = updatedMenu;
    socket.emit('save', { menu: currentMenu });
});
