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
                ['html'] // Añade esta línea para el botón de edición HTML
            ]
        }
    });

    // Añadir la funcionalidad del botón HTML
    const htmlEditButton = Quill.import('modules/htmlEditButton');
    quill.getModule('toolbar').addHandler('html', function() {
        const htmlModal = document.getElementById('htmlModal');
        const htmlEditor = document.getElementById('htmlEditor');
        htmlModal.style.display = 'block';
        htmlEditor.value = quill.root.innerHTML;

        document.getElementById('save-html').addEventListener('click', () => {
            quill.root.innerHTML = htmlEditor.value;
            htmlModal.style.display = 'none';
        });

        document.querySelector('.close').addEventListener('click', () => {
            htmlModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === htmlModal) {
                htmlModal.style.display = 'none';
            }
        });
    });

    // Guardar contenido
    document.getElementById('save-button').addEventListener('click', () => {
        const content = quill.root.innerHTML;
        socket.emit('save', content);
    });
});
