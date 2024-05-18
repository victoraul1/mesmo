const socket = io();

// Función para generar el formulario de edición del menú
const generateMenuForm = (data) => {
    const menuForm = document.getElementById('menu-form');
    menuForm.innerHTML = ''; // Limpiar el contenido previo

    data.menu.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = document.createElement('input');
        categoryElement.type = 'text';
        categoryElement.value = section.categoria;
        categoryElement.dataset.index = sectionIndex;
        categoryElement.classList.add('category-input');
        sectionElement.appendChild(categoryElement);

        const categoryButtonsDiv = document.createElement('div');
        categoryButtonsDiv.classList.add('buttons-div');

        const addCategoryButton = document.createElement('button');
        addCategoryButton.innerHTML = '+';
        addCategoryButton.classList.add('add-category-button');
        addCategoryButton.addEventListener('click', (event) => {
            event.preventDefault();
            const newCategory = {
                categoria: '',
                items: []
            };
            socket.emit('addCategory', newCategory);
        });
        categoryButtonsDiv.appendChild(addCategoryButton);

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.innerHTML = '-';
        deleteCategoryButton.classList.add('delete-category-button');
        deleteCategoryButton.addEventListener('click', (event) => {
            event.preventDefault();
            socket.emit('deleteCategory', sectionIndex);
        });
        categoryButtonsDiv.appendChild(deleteCategoryButton);

        sectionElement.appendChild(categoryButtonsDiv);

        section.items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameElement = document.createElement('input');
            itemNameElement.type = 'text';
            itemNameElement.value = item.nombre;
            itemNameElement.dataset.sectionIndex = sectionIndex;
            itemNameElement.dataset.itemIndex = itemIndex;
            itemNameElement.classList.add('item-name-input');

            const itemPriceElement = document.createElement('input');
            itemPriceElement.type = 'text';
            itemPriceElement.value = item.precio;
            itemPriceElement.dataset.sectionIndex = sectionIndex;
            itemPriceElement.dataset.itemIndex = itemIndex;
            itemPriceElement.classList.add('item-price-input');

            const itemButtonsDiv = document.createElement('div');
            itemButtonsDiv.classList.add('buttons-div');

            const addItemButton = document.createElement('button');
            addItemButton.innerHTML = '+';
            addItemButton.classList.add('add-item-button');
            addItemButton.addEventListener('click', (event) => {
                event.preventDefault();
                const newItem = {
                    nombre: '',
                    precio: ''
                };
                socket.emit('addItem', { sectionIndex, newItem });
            });
            itemButtonsDiv.appendChild(addItemButton);

            const deleteItemButton = document.createElement('button');
            deleteItemButton.innerHTML = '-';
            deleteItemButton.classList.add('delete-item-button');
            deleteItemButton.addEventListener('click', (event) => {
                event.preventDefault();
                socket.emit('deleteItem', { sectionIndex, itemIndex });
            });
            itemButtonsDiv.appendChild(deleteItemButton);

            itemElement.appendChild(itemNameElement);
            itemElement.appendChild(itemPriceElement);
            itemElement.appendChild(itemButtonsDiv);
            sectionElement.appendChild(itemElement);
        });

        menuForm.appendChild(sectionElement);
    });
};

// Escuchar la actualización de contenido desde el servidor
socket.on('contentUpdate', (data) => {
    generateMenuForm(data);
});

// Guardar cambios desde el formulario de administración
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', (event) => {
    event.preventDefault();
    const menuForm = document.getElementById('menu-form');
    const sections = menuForm.querySelectorAll('.menu-section');
    const updatedMenu = [];

    sections.forEach(sectionElement => {
        const categoryElement = sectionElement.querySelector('.category-input');
        const sectionIndex = categoryElement.dataset.index;
        const category = categoryElement.value;

        const items = [];
        const itemElements = sectionElement.querySelectorAll('.menu-item');
        itemElements.forEach(itemElement => {
            const itemNameElement = itemElement.querySelector('.item-name-input');
            const itemPriceElement = itemElement.querySelector('.item-price-input');

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
