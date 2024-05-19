const socket = io();

// Recibir el contenido del menú desde el servidor
socket.on('contentUpdate', (data) => {
    const menuContent = document.getElementById('menu-content');
    menuContent.innerHTML = data.content;
});
