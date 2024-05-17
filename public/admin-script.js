const socket = io();

// Función para crear un elemento de entrada con el valor y atributos especificados
function createInputElement(value, type, sectionIndex, itemIndex, dataType) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.dataset.sectionIndex = sectionIndex;
    input.dataset.itemIndex = itemIndex;
    input.dataset.type = dataType;
    return input;
}

// Generar el formulario de edición del menú
socket.on('contentUpdate', (data) => {
    const menuForm = document.getElementById('menu-form');
    menuForm.innerHTML = ''; // Limpiar contenido anterior

    data.menu.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryElement = createInputElement(section.categoria, 'text', sectionIndex, null, 'category');
        sectionElement.appendChild(categoryElement);

        section.items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameElement = createInputElement(item.nombre, 'text', sectionIndex, itemIndex, 'name');
            const itemDescElement = createInputElement(item.descripcion, 'text', sectionIndex, itemIndex, 'desc');
            const itemPriceElement = createInputElement(item.precio, 'text', sectionIndex, itemIndex, 'price');

            itemElement.appendChild(itemNameElement);
            itemElement.appendChild(itemDescElement);
            itemElement.appendChild(itemPriceElement);

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'Eliminar';
            deleteButton.onclick = () => deleteItem(sectionIndex, itemIndex);
            itemElement.appendChild(deleteButton);

            sectionElement.appendChild(itemElement);
        });

        const addItemButton = document.createElement('button');
        addItemButton.classList.add('addDishBtn');
        addItemButton.textContent = 'Agregar Plato';
        addItemButton.onclick = () => addItem(sectionIndex);
        sectionElement.appendChild(addItemButton);

        menuForm.appendChild(sectionElement);
    });
});

// Agregar nueva categoría
document.getElementById('addCategoryBtn').addEventListener('click', () => {
    const newSection = {
        categoria: 'Nueva Categoría',
        items: []
    };
    socket.emit('addCategory', newSection);
});

// Agregar nuevo plato
function addItem(sectionIndex) {
    const newItem = {
        nombre: 'Nuevo Plato',
        descripcion: 'Descripción',
        precio: '0.00'
    };
    socket.emit('addItem', { sectionIndex, newItem });
}

// Eliminar plato
function deleteItem(sectionIndex, itemIndex) {
    socket.emit('deleteItem', { sectionIndex, itemIndex });
}

// Guardar cambios desde el formulario de administración
document.getElementById('save-button').addEventListener('click', () => {
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
            const itemDescElement = itemElement.querySelector('input[data-type="desc"]');
            const itemPriceElement = itemElement.querySelector('input[data-type="price"]');

            items.push({
                nombre: itemNameElement.value,
                descripcion: itemDescElement.value,
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
