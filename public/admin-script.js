const socket = io();

let currentMenu = [];

// Función para actualizar el formulario
function updateForm(menuData) {
    const menuForm = document.getElementById('menu-form');
    menuForm.innerHTML = ''; // Clear previous content

    menuData.forEach((section, sectionIndex) => {
        const sectionElement = document.createElement('div');
        sectionElement.classList.add('menu-section');

        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');
        sectionElement.appendChild(categoryContainer);

        const categoryElement = document.createElement('input');
        categoryElement.type = 'text';
        categoryElement.value = section.categoria;
        categoryElement.dataset.index = sectionIndex;
        categoryElement.dataset.type = 'category';
        categoryElement.classList.add('category-input');
        categoryContainer.appendChild(categoryElement);

        const categoryButtons = document.createElement('div');
        categoryButtons.classList.add('category-buttons');
        categoryContainer.appendChild(categoryButtons);

        const addCategoryButton = document.createElement('button');
        addCategoryButton.type = 'button';
        addCategoryButton.innerHTML = '+';
        addCategoryButton.classList.add('add-category-btn');
        addCategoryButton.addEventListener('click', () => {
            const newCategory = {
                categoria: '',
                items: []
            };
            menuData.push(newCategory);
            updateForm(currentMenu);
        });
        categoryButtons.appendChild(addCategoryButton);

        const deleteCategoryButton = document.createElement('button');
        deleteCategoryButton.type = 'button';
        deleteCategoryButton.innerHTML = '-';
        deleteCategoryButton.classList.add('delete-category-button');
        deleteCategoryButton.addEventListener('click', () => {
            menuData.splice(sectionIndex, 1);
            updateForm(currentMenu);
        });
        categoryButtons.appendChild(deleteCategoryButton);

        section.items.forEach((item, itemIndex) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('menu-item');

            const itemNameElement = document.createElement('input');
            itemNameElement.type = 'text';
            itemNameElement.value = item.nombre;
            itemNameElement.dataset.sectionIndex = sectionIndex;
            itemNameElement.dataset.itemIndex = itemIndex;
            itemNameElement.dataset.type = 'name';
            itemNameElement.addEventListener('input', (event) => {
                currentMenu[sectionIndex].items[itemIndex].nombre = event.target.value;
            });

            const itemPriceElement = document.createElement('input');
            itemPriceElement.type = 'text';
            itemPriceElement.value = item.precio;
            itemPriceElement.dataset.sectionIndex = sectionIndex;
            itemPriceElement.dataset.itemIndex = item
