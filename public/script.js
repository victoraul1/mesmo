document.addEventListener('DOMContentLoaded', () => {
  const socket = io();  // Asegúrate de que esta línea esté presente

  socket.on('load', (data) => {
    document.getElementById('menu-content').innerHTML = data;
  });
});
