const socket = io();

const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['code-block'] // Opción para código HTML
    ]
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
