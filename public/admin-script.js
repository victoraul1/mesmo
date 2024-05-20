document.addEventListener('DOMContentLoaded', () => {
    const editor = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['clean'],
                ['html']  // Botón HTML personalizado
            ],
            clipboard: {
                matchVisual: false  // Permitir todo el HTML
            }
        },
        formats: {
            'header': true,
            'bold': true,
            'italic': true,
            'underline': true,
            'link': true,
            'image': true,
            'list': true,
            'bullet': true,
            'html': true  // Asegurar que el formato personalizado sea reconocido
        }
    });

    // Función para abrir el modal de HTML personalizado
    const openHtmlModal = () => {
        const modal = document.getElementById('htmlModal');
        const htmlEditor = document.getElementById('htmlEditor');
        modal.style.display = 'block';
        htmlEditor.value = editor.root.innerHTML;
    };

    // Función para guardar el contenido HTML desde el modal
    const saveHtmlContent = () => {
        const htmlEditor = document.getElementById('htmlEditor');
        editor.root.innerHTML = htmlEditor.value;
        document.getElementById('htmlModal').style.display = 'none';
    };

    // Event listeners para el botón HTML personalizado y el botón de guardar del modal
    document.querySelector('.ql-html').addEventListener('click', openHtmlModal);
    document.getElementById('save-html').addEventListener('click', saveHtmlContent);

    // Cerrar el modal cuando se haga clic fuera de él
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('htmlModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Funcionalidad del botón Guardar para enviar el contenido al servidor
    document.getElementById('save-button').addEventListener('click', () => {
        const content = editor.root.innerHTML;
        socket.emit('save', { content });
    });

    // Cargar contenido inicial desde el servidor
    socket.on('contentUpdate', (data) => {
        editor.root.innerHTML = data.content;
    });
});
