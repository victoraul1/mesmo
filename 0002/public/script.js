

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Request initial data load when the connection is established
    socket.on('connect', () => {
        socket.emit('request-data', window.location.pathname.split('/')[1]);
    });

    socket.on('load-data', (data) => {
        document.getElementById('menu-content').innerHTML = data;
    });

    socket.on('data-error', (error) => {
        console.error('Error loading data:', error);
        alert('Failed to load menu data. Check console for details.');
    });

    socket.on('data-updated', (id, data) => {
        if (window.location.pathname.includes(id)) {
            document.getElementById('menu-content').innerHTML = data;
        }
    });
});



// document.addEventListener('DOMContentLoaded', () => {
//     const socket = io();

//     socket.on('load', (data) => {
//         document.getElementById('menu-content').innerHTML = data;
//     });

//     socket.on('update', (data) => {
//         document.getElementById('menu-content').innerHTML = data;
//     });
// });
