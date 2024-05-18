const socket = io();

// Function to render the menu
function renderMenu(data) {
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

        const categoryButtons = document.createElement('div');
        categoryButtons.classList.add('category-buttons');

        const addCategoryButton = document.createElement('button');
        addCategoryButton.classList.add('add-category-btn');
        addCategoryButton.innerHTML = '+';
        addCategoryButton.addEventListener('click', () => {
            addCategory(sectionIndex);
        });

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.classList.add('delete', 'delete-category-btn');
        deleteCategoryButton.innerHTML = '-';
        deleteCategoryButton.addEventListener('click', () => {
            deleteCategory(sectionIndex);
        });

        categoryButtons.appendChild(addCategoryButton);
        categoryButtons.appendChild(deleteCategoryButton);

        sectionElement.appendChild(categoryElement);
        sectionElement.appendChild(categoryButtons);

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
            itemPriceElement.classList.add('price');

            const itemButtons = document.createElement('div');
            itemButtons.classList.add('item-buttons');

            const addItemButton = document.createElement('button');
            addItemButton.classList.add('add-item-btn');
            addItemButton.innerHTML = '+';
            addItemButton.addEventListener('click', () => {
                addItem(sectionIndex, itemIndex);
            });

            const deleteItemButton = document.createElement('button');
            deleteItemButton.classList.add('delete', 'delete-item-btn');
            deleteItemButton.innerHTML = '-';
            deleteItemButton.addEventListener('click', () => {
                deleteItem(sectionIndex, itemIndex);
            });

            itemButtons.appendChild(addItemButton);
            itemButtons.appendChild(deleteItemButton);

            itemElement.appendChild(itemNameElement);
            itemElement.appendChild(itemPriceElement);
            itemElement.appendChild(itemButtons);

            sectionElement.appendChild(itemElement);
        });

        menuForm.appendChild(sectionElement);
    });
}

// Load initial menu data
socket.on('contentUpdate', (data) => {
    renderMenu(data);
});

// Save button event listener
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

// Function to add a new category
function addCategory(sectionIndex) {
    socket.emit('addCategory', { categoria: '', items: [] });
}

// Function to add a new item
function addItem(sectionIndex, itemIndex) {
    socket.emit('addItem', { sectionIndex, newItem: { nombre: '', precio: '' } });
}

// Function to delete an item
function deleteItem(sectionIndex, itemIndex) {
    socket.emit('deleteItem', { sectionIndex, itemIndex });
}
