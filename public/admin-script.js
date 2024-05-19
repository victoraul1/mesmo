const socket = io();

const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: {
            container: "#toolbar",
            handlers: {
                'code': showHtmlEditor  // Custom button handler
            }
        }
    }
});

socket.on('contentUpdate', (data) => {
    quill.clipboard.dangerouslyPasteHTML(data.content);
});

document.getElementById('save-button').addEventListener('click', () => {
    let content = quill.root.innerHTML;
    socket.emit('save', { content: content });
});

function showHtmlEditor() {
    const modal = document.getElementById('html-modal');
    const htmlEditor = document.getElementById('html-editor');
    const content = quill.root.innerHTML;

    htmlEditor.value = content;
    modal.style.display = "block";

    document.getElementById('save-html-button').onclick = function() {
        const newContent = htmlEditor.value;
        quill.clipboard.dangerouslyPasteHTML(newContent);
        modal.style.display = "none";
    };

    document.querySelector('.close').onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}
