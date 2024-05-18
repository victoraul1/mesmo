const socket = io();

// Generar el formulario de edición del menú
socket.on('contentUpdate', (data) => {
    const menuForm = document.getElementById('menu-form');
    menuForm.innerHTML = ''; // Clear previous content

    data.menu.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryElement = document.createElement('input');
        categoryElement.type = 'text';
        categoryElement.value = section.categoria;
        categoryElement.dataset.index = sectionIndex;
        categoryElement.dataset.type = 'category';
        categoryElement.classList.add('category-input');

        const addCategoryButton = document.createElement('button');
        addCategoryButton.textContent = '+';
        addCategoryButton.classList.add('add-button');
        addCategoryButton.addEventListener('click', () => addCategory(sectionIndex));

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.textContent = '-';
        deleteCategoryButton.classList.add('delete-button');
        deleteCategoryButton.addEventListener('click', () => deleteCategory(sectionIndex));

        categoryContainer.appendChild(categoryElement);
        categoryContainer.appendChild(addCategoryButton);
        categoryContainer.appendChild(deleteCategoryButton);
        sectionElement.appendChild(categoryContainer);

        section.items.forEach((item, itemIndex) => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('item-container');

            const itemNameElement = document.createElement('input');
            itemNameElement.type = 'text';
            itemNameElement.value = item.nombre;
            itemNameElement.dataset.sectionIndex = sectionIndex;
            itemNameElement.dataset.itemIndex = itemIndex;
            itemNameElement.dataset.type = 'name';
            itemNameElement.classList.add('item-input');

            const itemPriceElement = document.createElement('input');
            itemPriceElement.type = 'text';
            itemPriceElement.value = item.precio;
            itemPriceElement.dataset.sectionIndex = sectionIndex;
            itemPriceElement.dataset.itemIndex = itemIndex;
            itemPriceElement.dataset.type = 'price';
            itemPriceElement.classList.add('price-input');

            const addItemButton = document.createElement('button');
            addItemButton.textContent = '+';
            addItemButton.classList.add('add-button');
            addItemButton.addEventListener('click', () => addItem(sectionIndex, itemIndex));

            const deleteItemButton = document.createElement('button');
            deleteItemButton.textContent = '-';
            deleteItemButton.classList.add('delete-button');
            deleteItemButton.addEventListener('click', () => deleteItem(sectionIndex, itemIndex));

            itemContainer.appendChild(itemNameElement);
            itemContainer.appendChild(itemPriceElement);
            itemContainer.appendChild(addItemButton);
            itemContainer.appendChild(deleteItemButton);
            sectionElement.appendChild(itemContainer);
        });

        menuForm.appendChild(sectionElement);
    });
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
        const itemElements = sectionElement.querySelectorAll('.item-container');
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

const addCategoryButton = document.getElementById('add-category-button');
addCategoryButton.addEventListener('click', () => {
    const newCategory = {
        categoria: '',
        items: []
    };
    socket.emit('addCategory', newCategory);
});

function addCategory(sectionIndex) {
    const newItem = {
        nombre: '',
        precio: ''
    };
    socket.emit('addItem', { sectionIndex, newItem });
}

function deleteCategory(sectionIndex) {
    const sectionElement = document.querySelector(`.menu-section input[data-index="${sectionIndex}"]`).parentElement;
    sectionElement.parentElement.removeChild(sectionElement);
    saveChanges();
}

function addItem(sectionIndex, itemIndex) {
    const newItem = {
        nombre: '',
        precio: ''
    };
    socket.emit('addItem', { sectionIndex, newItem });
}

function deleteItem(sectionIndex, itemIndex) {
    const itemElement = document.querySelector(`.item-container input[data-section-index="${sectionIndex}"][data-item-index="${itemIndex}"]`).parentElement;
    itemElement.parentElement.removeChild(itemElement);
    saveChanges();
}

function saveChanges() {
    const menuForm = document.getElementById('menu-form');
    const sections = menuForm.querySelectorAll('.menu-section');
    const updatedMenu = [];

    sections.forEach(sectionElement => {
        const categoryElement = sectionElement.querySelector('input[data-type="category"]');
        const sectionIndex = categoryElement.dataset.index;
        const category = categoryElement.value;

        const items = [];
        const itemElements = sectionElement.querySelectorAll('.item-container');
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
}
