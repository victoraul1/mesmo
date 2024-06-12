
document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const quill = new Quill('#editor-container', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, false] }],
                ['bold', 'italic', 'underline'],
                ['link', 'image'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        },
        formats: ['bold', 'italic', 'underline', 'link', 'image', 'list', 'header']
    });

    // Request initial data load when the connection is established
    socket.on('connect', () => {
        socket.emit('request-data', window.location.pathname.split('/')[1]);
    });

    socket.on('load-data', (data) => {
        quill.root.innerHTML = data;
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const content = quill.root.innerHTML;
        socket.emit('save-data', window.location.pathname.split('/')[1], content);
    });

    socket.on('data-error', (error) => {
        console.error('Error with data:', error);
        alert('Failed to save or load data. Check console for details.');
    });

    socket.on('data-updated', (id, data) => {
        if (window.location.pathname.includes(id)) {
            quill.root.innerHTML = data;
        }
    });
});




