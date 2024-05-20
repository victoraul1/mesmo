document.addEventListener('DOMContentLoaded', () => {
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean'],
                ['html'] // Añade esta línea para permitir el botón de HTML
            ]
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

    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', () => {
        const modal = document.getElementById('htmlModal');
        modal.style.display = 'none';
    });

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
});
