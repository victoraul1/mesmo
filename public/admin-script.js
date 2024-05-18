const socket = io();

// Función para guardar los valores del formulario actual
function getCurrentFormValues() {
    const menuForm = document.getElementById('menu-form');
    const sections = menuForm.querySelectorAll('.menu-section');
    const updatedMenu = [];

    sections.forEach(sectionElement => {
        const categoryElement = sectionElement.querySelector('input[data-type="category"]');
        const sectionIndex = categoryElement.dataset.index;
        const category = categoryElement.value;

        const items = [];
        const itemElements = sectionElement.querySelectorAll('div.menu-item');
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

    return updatedMenu;
}

// Función para establecer los valores del formulario actual
function setCurrentFormValues(updatedMenu) {
    const menuForm = document.getElementById('menu-form');
    menuForm.innerHTML = ''; // Clear previous content

    updatedMenu.forEach((section, sectionIndex) => {
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
}

// Generar el formulario de edición del menú
socket.on('contentUpdate', (data) => {
    setCurrentFormValues(data.menu);
});

// Función para agregar una nueva categoría
function addCategory() {
    const currentFormValues = getCurrentFormValues();
    currentFormValues.push({
        categoria: '',
        items: []
    });
    setCurrentFormValues(currentFormValues);
}

// Función para agregar un nuevo ítem
function addItem(sectionIndex) {
    const currentFormValues = getCurrentFormValues();
    currentFormValues[sectionIndex].items.push({
        nombre: '',
        precio: ''
    });
    setCurrentFormValues(currentFormValues);
}

// Función para eliminar una categoría
function deleteCategory(sectionIndex) {
    const currentFormValues = getCurrentFormValues();
    currentFormValues.splice(sectionIndex, 1);
    setCurrentFormValues(currentFormValues);
}

// Función para eliminar un ítem
function deleteItem(sectionIndex, itemIndex) {
    const currentFormValues = getCurrentFormValues();
    currentFormValues[sectionIndex].items.splice(itemIndex, 1);
    setCurrentFormValues(currentFormValues);
}

// Guardar cambios desde el formulario de administración
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    const updatedMenu = getCurrentFormValues();
    socket.emit('save', { menu: updatedMenu });
});
