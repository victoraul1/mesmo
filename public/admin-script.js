const socket = io();

const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['clean'],
            ['html'] // Agregar botón HTML
        ]
    }
});

// Función para abrir la ventana modal de edición HTML
function showHtmlEditor() {
    const htmlEditor = document.getElementById('htmlEditorModal');
    const htmlContent = quill.root.innerHTML;
    document.getElementById('htmlEditorContent').value = htmlContent;
    htmlEditor.style.display = 'block';
}

// Función para guardar el contenido HTML desde la ventana modal
function saveHtmlContent() {
    const htmlContent = document.getElementById('htmlEditorContent').value;
    quill.clipboard.dangerouslyPasteHTML(htmlContent);
    document.getElementById('htmlEditorModal').style.display = 'none';
}

// Cerrar la ventana modal de edición HTML
function closeHtmlEditor() {
    document.getElementById('htmlEditorModal').style.display = 'none';
}

// Botón para abrir la ventana de edición HTML
const htmlButton = document.querySelector('.ql-html');
htmlButton.addEventListener('click', showHtmlEditor);

// Botón para guardar el contenido HTML desde la ventana modal
const saveHtmlButton = document.getElementById('saveHtmlButton');
saveHtmlButton.addEventListener('click', saveHtmlContent);

// Botón para cerrar la ventana modal de edición HTML
const closeHtmlButton = document.getElementById('closeHtmlButton');
closeHtmlButton.addEventListener('click', closeHtmlEditor);

// Recibir el contenido del menú desde el servidor
socket.on('contentUpdate', (data) => {
    loadMenuContent(data.content);
});

// Función para cargar el contenido del menú en Quill
function loadMenuContent(content) {
    quill.clipboard.dangerouslyPasteHTML(content);
}

// Guardar el contenido del menú cuando se hace clic en "Guardar Cambios"
document.getElementById('save-button').addEventListener('click', () => {
    const content = quill.root.innerHTML;
    socket.emit('save', { content });
});

socket.on('save', (data) => {
    alert('Contenido guardado correctamente.');
});
