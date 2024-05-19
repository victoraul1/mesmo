const socket = io();

const quill = new Quill('#editor', {
    theme: 'snow'
});

socket.on('contentUpdate', (data) => {
    quill.root.innerHTML = data.content;
});

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    const content = quill.root.innerHTML;
    socket.emit('save', { content: content });
});
