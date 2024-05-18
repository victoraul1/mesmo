const socket = io();

// Generar el formulario de edición del menú
socket.on('contentUpdate', (data) => {
    const menuForm = document.getElementById('menu-form');
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

        const addCategoryButton = document.createElement('button');
        addCategoryButton.textContent = '+';
        addCategoryButton.classList.add('add-category');
        addCategoryButton.dataset.index = sectionIndex;
        sectionElement.appendChild(addCategoryButton);

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

            const addItemButton = document.createElement('button');
            addItemButton.textContent = '+';
            addItemButton.classList.add('add-item');
            addItemButton.dataset.sectionIndex = sectionIndex;
            addItemButton.dataset.itemIndex = itemIndex;

            const removeItemButton = document.createElement('button');
            removeItemButton.textContent = '-';
            removeItemButton.classList.add('remove-item');
            removeItemButton.dataset.sectionIndex = sectionIndex;
            removeItemButton.dataset.itemIndex = itemIndex;

            itemElement.appendChild(itemNameElement);
            itemElement.appendChild(itemPriceElement);
            itemElement.appendChild(addItemButton);
            itemElement.appendChild(removeItemButton);
            sectionElement.appendChild(itemElement);
        });

        const removeCategoryButton = document.createElement('button');
        removeCategoryButton.textContent = '-';
        removeCategoryButton.classList.add('remove-category');
        removeCategoryButton.dataset.index = sectionIndex;
        sectionElement.appendChild(removeCategoryButton);

        menuForm.appendChild(sectionElement);
    });

    addEventListeners();
});

function addEventListeners() {
    document.querySelectorAll('.add-category').forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionIndex = event.target.dataset.index;
            addCategory(sectionIndex);
        });
    });

    document.querySelectorAll('.add-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionIndex = event.target.dataset.sectionIndex;
            const itemIndex = event.target.dataset.itemIndex;
            addItem(sectionIndex, itemIndex);
        });
    });

    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionIndex = event.target.dataset.sectionIndex;
            const itemIndex = event.target.dataset.itemIndex;
            removeItem(sectionIndex, itemIndex);
        });
    });

    document.querySelectorAll('.remove-category').forEach(button => {
        button.addEventListener('click', (event) => {
            const sectionIndex = event.target.dataset.index;
            removeCategory(sectionIndex);
        });
    });
}

function addCategory(sectionIndex) {
    const menuForm = document.getElementById('menu-form');
    const sectionElement = document.createElement('div');
    sectionElement.classList.add('menu-section');

    const categoryElement = document.createElement('input');
    categoryElement.type = 'text';
    categoryElement.placeholder = 'Nueva Categoría';
    categoryElement.dataset.index = sectionIndex;
    categoryElement.dataset.type = 'category';
    sectionElement.appendChild(categoryElement);

    const addCategoryButton = document.createElement('button');
    addCategoryButton.textContent = '+';
    addCategoryButton.classList.add('add-category');
    addCategoryButton.dataset.index = sectionIndex;
    sectionElement.appendChild(addCategoryButton);

    const removeCategoryButton = document.createElement('button');
    removeCategoryButton.textContent = '-';
    removeCategoryButton.classList.add('remove-category');
    removeCategoryButton.dataset.index = sectionIndex;
    sectionElement.appendChild(removeCategoryButton);

    menuForm.appendChild(sectionElement);

    addEventListeners();
}

function addItem(sectionIndex, itemIndex) {
    const sectionElement = document.querySelector(`.menu-section:nth-child(${parseInt(sectionIndex) + 1})`);
    const itemElement = document.createElement('div');
    itemElement.classList.add('menu-item');

    const itemNameElement = document.createElement('input');
    itemNameElement.type = 'text';
    itemNameElement.placeholder = 'Nuevo Plato';
    itemNameElement.dataset.sectionIndex = sectionIndex;
    itemNameElement.dataset.itemIndex = itemIndex;
    itemNameElement.dataset.type = 'name';

    const itemPriceElement = document.createElement('input');
    itemPriceElement.type = 'text';
    itemPriceElement.placeholder = 'Precio';
    itemPriceElement.dataset.sectionIndex = sectionIndex;
    itemPriceElement.dataset.itemIndex = itemIndex;
    itemPriceElement.dataset.type = 'price';

    const addItemButton = document.createElement('button');
    addItemButton.textContent = '+';
    addItemButton.classList.add('add-item');
    addItemButton.dataset.sectionIndex = sectionIndex;
    addItemButton.dataset.itemIndex = itemIndex;

    const removeItemButton = document.createElement('button');
    removeItemButton.textContent = '-';
    removeItemButton.classList.add('remove-item');
    removeItemButton.dataset.sectionIndex = sectionIndex;
    removeItemButton.dataset.itemIndex = itemIndex;

    itemElement.appendChild(itemNameElement);
    itemElement.appendChild(itemPriceElement);
    itemElement.appendChild(addItemButton);
    itemElement.appendChild(removeItemButton);
    sectionElement.appendChild(itemElement);

    addEventListeners();
}

function removeItem(sectionIndex, itemIndex) {
    const itemElement = document.querySelector(`.menu-section:nth-child(${parseInt(sectionIndex) + 1}) .menu-item:nth-child(${parseInt(itemIndex) + 2})`);
    itemElement.remove();
}

function removeCategory(sectionIndex) {
    const sectionElement = document.querySelector(`.menu-section:nth-child(${parseInt(sectionIndex) + 1})`);
    sectionElement.remove();
}

// Guardar cambios desde el formulario de administración
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    const menuForm = document.getElementById('menu-form');
    const sections = menuForm.querySelectorAll('.menu-section');
    const updatedMenu = [];

    sections.forEach((sectionElement, sectionIndex) => {
        const categoryElement = sectionElement.querySelector('input[data-type="category"]');
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
