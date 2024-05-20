document.addEventListener('DOMContentLoaded', () => {
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

  const saveButton = document.getElementById('save-button');
  saveButton.addEventListener('click', () => {
    const content = quill.root.innerHTML;
    fetch('/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    }).then(response => {
      if (response.ok) {
        alert('Contenido guardado correctamente.');
      } else {
        alert('Error al guardar el contenido.');
      }
    });
  });
});
