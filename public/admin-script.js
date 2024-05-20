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
                ['code-block'],  // Include the code-block button if you need it.
                ['html']         // Custom HTML button
            ]
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
            'code-block': true,
            'html': true  // Ensure the custom format is recognized
        }
    });

    // Function to open the custom HTML modal
    const openHtmlModal = () => {
        const modal = document.getElementById('htmlModal');
        const htmlEditor = document.getElementById('htmlEditor');
        modal.style.display = 'block';
        htmlEditor.value = editor.root.innerHTML;
    };

    // Function to save HTML content from the modal
    const saveHtmlContent = () => {
        const htmlEditor = document.getElementById('htmlEditor');
        editor.root.innerHTML = htmlEditor.value;
        document.getElementById('htmlModal').style.display = 'none';
    };

    // Event listeners for the custom HTML button and modal save button
    document.querySelector('.ql-html').addEventListener('click', openHtmlModal);
    document.getElementById('save-html').addEventListener('click', saveHtmlContent);

    // Close the modal when clicking outside of it
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('htmlModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Save button functionality to send the content to the server
    document.getElementById('save-button').addEventListener('click', () => {
        const content = editor.root.innerHTML;
        socket.emit('save', { content });
    });

    // Load initial content from the server
    socket.on('contentUpdate', (data) => {
        editor.root.innerHTML = data.content;
    });
});
