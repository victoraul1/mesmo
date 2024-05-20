document.addEventListener('DOMContentLoaded', () => {
  const socket = io();  

  socket.on('load', (data) => {
    document.getElementById('menu-content').innerHTML = data;
  });

  // Escuchar el evento 'update' para actualizar el contenido en tiempo real
  socket.on('update', (data) => {
    document.getElementById('menu-content').innerHTML = data;
  });
});
