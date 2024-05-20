document.addEventListener('DOMContentLoaded', () => {
  const socket = io();  
  const quill = new Quill('#editor-container', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    formats: ['bold', 'italic', 'underline', 'link', 'image', 'list', 'header']
  });

  // Guardar contenido
  document.getElementById('save-button').addEventListener('click', () => {
    const content = quill.root.innerHTML;
    socket.emit('save', content);
    // Eliminar la siguiente línea para no mostrar el alert
    // alert("Contenido guardado correctamente.");
  });
});
