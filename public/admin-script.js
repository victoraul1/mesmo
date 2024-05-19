const socket = io();

var quill = new Quill('#editor', {
    modules: {
        toolbar: '#toolbar'
    },
    theme: 'snow'
});

// Cargar contenido inicial desde el servidor
socket.on('contentUpdate', (data) => {
    quill.root.innerHTML = data.content;
});

// Guardar cambios
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    const content = quill.root.innerHTML;
    socket.emit('save', { content });
});
