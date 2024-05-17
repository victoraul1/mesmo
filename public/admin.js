const socket = io();

// Enviar cambios al servidor
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
