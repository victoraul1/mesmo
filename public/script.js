document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socket.on('load', (data) => {
    document.getElementById('menu-content').innerHTML = data;
  });
});
