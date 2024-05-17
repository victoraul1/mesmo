const socket = io();

// Al recibir los datos actualizados del servidor
socket.on('update', (data) => {
    document.getElementById('banner').src = data.banner;
    document.getElementById('video').src = data.video;
    document.getElementById('copy1').src = data.copy1;
    document.getElementById('copy2').src = data.copy2;
    document.getElementById('copy3').src = data.copy3;
    document.getElementById('description1').innerText = data.description1;
    document.getElementById('description2').innerText = data.description2;
    document.getElementById('description3').innerText = data.description3;
});

// Guardar cambios desde el formulario de administración
const saveChanges = () => {
    const data = {
        banner: document.getElementById('bannerInput').value,
        video: document.getElementById('videoInput').value,
        copy1: document.getElementById('copy1Input').value,
        copy2: document.getElementById('copy2Input').value,
        copy3: document.getElementById('copy3Input').value,
        description1: document.getElementById('description1Input').value,
        description2: document.getElementById('description2Input').value,
        description3: document.getElementById('description3Input').value
    };
    socket.emit('save', data);
};

document.getElementById('saveButton').addEventListener('click', saveChanges);
