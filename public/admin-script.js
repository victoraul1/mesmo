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
                ['code-block'] // Añade esta línea para permitir el bloque de código
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
            'bullet': true,
            'header': true,
            'code-block': true
        }
    });

    const htmlModal = document.getElementById('htmlModal');
    const htmlInput = document.getElementById('html-input');
    const guardarHtmlBtn = document.getElementById('guardar-html');
    const guardarHtmlContentBtn = document.getElementById('guardar-html-content');
    const spanClose = document.getElementsByClassName('close')[0];

    guardarHtmlBtn.addEventListener('click', () => {
        const html = editor.root.innerHTML;
        localStorage.setItem('editorContent', html);
        alert('Contenido guardado');
    });

    document.querySelector('#htmlModal .close').onclick = function() {
        htmlModal.style.display = 'none';
    };

    document.getElementById('html-btn').onclick = function() {
        htmlInput.value = editor.root.innerHTML;
        htmlModal.style.display = 'block';
    };

    guardarHtmlContentBtn.addEventListener('click', () => {
        const html = htmlInput.value;
        editor.root.innerHTML = html;
        htmlModal.style.display = 'none';
    });

    // Cargar el contenido guardado si existe
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
        editor.root.innerHTML = savedContent;
    }
});
