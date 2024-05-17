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

        section.items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('div');

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

            // Agregar botón para eliminar plato
            const deleteDishBtn = document.createElement('button');
            deleteDishBtn.classList.add('delete', 'deleteDishBtn');
            deleteDishBtn.textContent = 'Eliminar Plato';
            deleteDishBtn.addEventListener('click', () => {
                itemElement.remove();
            });
            itemElement.appendChild(deleteDishBtn);

            sectionElement.appendChild(itemElement);
        });

        // Agregar botón para agregar plato
        const addDishBtn = document.createElement('button');
        addDishBtn.classList.add('addDishBtn');
        addDishBtn.textContent = 'Agregar Plato';
        addDishBtn.addEventListener('click', () => {
            addDish(sectionElement);
        });
        sectionElement.appendChild(addDishBtn);

        // Agregar botón para eliminar categoría
        const deleteCategoryBtn = document.createElement('button');
        deleteCategoryBtn.classList.add('delete', 'deleteCategoryBtn');
        deleteCategoryBtn.textContent = 'Eliminar Categoría';
        deleteCategoryBtn.addEventListener('click', () => {
            sectionElement.remove();
        });
        sectionElement.appendChild(deleteCategoryBtn);

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
        const itemElements = sectionElement.querySelectorAll('div');
        itemElements.forEach(itemElement => {
            const itemNameElement = itemElement.querySelector('input[data-type="name"]');
            const itemPriceElement = itemElement.querySelector('input[data-type="price"]');

            if (itemNameElement && itemPriceElement) {
                items.push({
                    nombre: itemNameElement.value,
                    precio: itemPriceElement.value
                });
            }
        });

        updatedMenu.push({
            categoria: category,
            items: items
        });
    });

    socket.emit('save', { menu: updatedMenu });
});

// Funcionalidad para agregar categoría y plato
document.getElementById('addCategoryBtn').addEventListener('click', () => {
    addCategory();
});

function addCategory() {
    const sectionElement = document.createElement('div');
    sectionElement.classList.add('menu-section');

    const categoryElement = document.createElement('input');
    categoryElement.type = 'text';
    categoryElement.placeholder = 'Nombre de la Categoría';
    categoryElement.dataset.type = 'category';
    sectionElement.appendChild(categoryElement);

    // Agregar botón para agregar plato
    const addDishBtn = document.createElement('button');
    addDishBtn.classList.add('addDishBtn');
    addDishBtn.textContent = 'Agregar Plato';
    addDishBtn.addEventListener('click', () => {
        addDish(sectionElement);
    });
    sectionElement.appendChild(addDishBtn);

    // Agregar botón para eliminar categoría
    const deleteCategoryBtn = document.createElement('button');
    deleteCategoryBtn.classList.add('delete', 'deleteCategoryBtn');
    deleteCategoryBtn.textContent = 'Eliminar Categoría';
    deleteCategoryBtn.addEventListener('click', () => {
        sectionElement.remove();
    });
    sectionElement.appendChild(deleteCategoryBtn);

    document.getElementById('menu-form').appendChild(sectionElement);
}

function addDish(sectionElement) {
    const itemElement = document.createElement('div');

    const itemNameElement = document.createElement('input');
    itemNameElement.type = 'text';
    itemNameElement.placeholder = 'Nombre del Plato';
    itemNameElement.dataset.type = 'name';

    const itemPriceElement = document.createElement('input');
    itemPriceElement.type = 'text';
    itemPriceElement.placeholder = 'Precio del Plato';
    itemPriceElement.dataset.type = 'price';

   
    itemElement.appendChild(itemNameElement);
    itemElement.appendChild(itemPriceElement);

    // Agregar botón para eliminar plato
    const deleteDishBtn = document.createElement('button');
    deleteDishBtn.classList.add('delete', 'deleteDishBtn');
    deleteDishBtn.textContent = 'Eliminar Plato';
    deleteDishBtn.addEventListener('click', () => {
        itemElement.remove();
    });
    itemElement.appendChild(deleteDishBtn);

    sectionElement.appendChild(itemElement);
}
