document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://admi.mimenu.pe:3002');

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

    socket.on('load', (data) => {
        quill.root.innerHTML = data;
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const content = quill.root.innerHTML;
        socket.emit('save', content);
    });

    socket.on('connect', () => {
        socket.emit('load');
    });

    socket.on('update', (data) => {
        quill.root.innerHTML = data;
    });
});
