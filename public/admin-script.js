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
                ['html'] // Añade esta línea para el botón HTML
            ]
        }
    });

    // Escapar y desescapar funciones
    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, (match) => {
            const escape = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return escape[match];
        });
    }

    function unescapeHtml(text) {
        return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (match) => {
            const unescape = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'"
            };
            return unescape[match];
        });
    }

    // Añade la funcionalidad del botón HTML
    const customHtmlButton = document.querySelector('.ql-html');
    customHtmlButton.addEventListener('click', () => {
        const modal = document.getElementById('htmlModal');
        const htmlEditor = document.getElementById('htmlEditor');
        modal.style.display = 'block';
        htmlEditor.value = escapeHtml(editor.root.innerHTML);
    });

    const saveHtmlButton = document.getElementById('save-html');
    saveHtmlButton.addEventListener('click', () => {
        const htmlEditor = document.getElementById('htmlEditor');
        editor.root.innerHTML = unescapeHtml(htmlEditor.value);
        const modal = document.getElementById('htmlModal');
        modal.style.display = 'none';
    });

    // Cierra el modal cuando se hace clic en la "x"
    const closeModalButton = document.querySelector('.close');
    closeModalButton.addEventListener('click', () => {
        const modal = document.getElementById('htmlModal');
        modal.style.display = 'none';
    });

    // Cierra el modal cuando se hace clic fuera del modal
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('htmlModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Guardar contenido
    document.getElementById('save-button').addEventListener('click', () => {
        const content = editor.root.innerHTML;
        socket.emit('save', content);
    });

    // Recibir contenido del servidor y cargarlo en el editor
    socket.on('load', (data) => {
        editor.root.innerHTML = unescapeHtml(data);
    });
});
