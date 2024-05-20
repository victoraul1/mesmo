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

// Añadir botón personalizado para editar HTML
const customButton = document.querySelector('.ql-custom-html');
customButton.innerHTML = '<i class="ql-html">HTML</i>';
customButton.addEventListener('click', () => {
  const currentHtml = quill.root.innerHTML;
  const newHtml = prompt('Edit HTML', currentHtml);
  if (newHtml !== null) {
    quill.root.innerHTML = newHtml;
  }
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
