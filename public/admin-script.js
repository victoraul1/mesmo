const socket = io();

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['code-block'],
      ['custom-html'] // Añadir un botón personalizado para HTML
    ]
  }
});

// Añadir botón personalizado para abrir la ventana modal de HTML
const customButton = document.querySelector('.ql-custom-html');
customButton.innerHTML = 'HTML';
customButton.addEventListener('click', () => {
  document.getElementById('html-modal').style.display = 'block';
  document.getElementById('html-content').value = quill.root.innerHTML;
});

// Cerrar la ventana modal de HTML
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('html-modal').style.display = 'none';
});

// Guardar el contenido de la ventana modal de HTML
document.getElementById('save-html').addEventListener('click', () => {
  const newHtml = document.getElementById('html-content').value;
  quill.root.innerHTML = newHtml;
  document.getElementById('html-modal').style.display = 'none';
});

// Función para cargar el contenido del menú en Quill
function loadMenuContent(content) {
  quill.clipboard.dangerouslyPasteHTML(content);
}

// Recibir el contenido del menú desde el servidor
socket.on('contentUpdate', (data) => {
  loadMenuContent(data.content);
});

// Guardar el contenido del menú cuando se hace clic en "Guardar Cambios"
document.getElementById('save-button').addEventListener('click', () => {
  const content = quill.root.innerHTML;
  socket.emit('save', { content });
});
