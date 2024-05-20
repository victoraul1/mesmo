document.addEventListener('DOMContentLoaded', () => {
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['clean'],
                ['html'] // Añade esta línea para el botón HTML personalizado
            ]
        },
        formats: {
            // Añade todas las etiquetas HTML que necesitas aquí
            'bold': true,
            'italic': true,
            'underline': true,
            'link': true,
            'image': true,
            'list': true,
            'header': true,
            'code-block': true,
            // Permitir etiquetas HTML personalizadas
            'table': true,
            'td': true,
            'th': true,
            'tr': true,
            'tbody': true,
            'thead': true
        }
    });

    // Añade la funcionalidad del botón HTML
    const customButton = document.querySelector('.ql-html');
    customButton.addEventListener('click', () => {
        const modal = document.getElementById('htmlModal');
        const htmlEditor = document.getElementById('htmlEditor');
        modal.style.display = 'block';
        htmlEditor.value = quill.root.innerHTML;
    });

    const saveHtmlButton = document.getElementById('save-html');
    saveHtmlButton.addEventListener('click', () => {
        const htmlEditor = document.getElementById('htmlEditor');
        quill.root.innerHTML = htmlEditor.value;
        const modal = document.getElementById('htmlModal');
        modal.style.display = 'none';
    });

    // Cierra el modal cuando se hace clic en la "X"
    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', () => {
        const modal = document.getElementById('htmlModal');
        modal.style.display = 'none';
    });

    // Cierra el modal cuando se hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('htmlModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar contenido
    document.getElementById('save-button').addEventListener('click', () => {
        const content = quill.root.innerHTML;
        socket.emit('save', content);
    });

    socket.on('contentUpdate', (data) => {
        quill.root.innerHTML = data.content;
    });
});
