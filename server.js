const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataFilePath = path.join(__dirname, 'data.json');

// Middleware para servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, 'public')));

// Cargar datos iniciales desde data.json
let contentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Manejar conexiones de socket
io.on('connection', (socket) => {
    console.log('New client connected');

    // Enviar los datos iniciales al cliente recién conectado
    socket.emit('contentUpdate', contentData);

    // Manejar el evento 'save' desde la página de administración para actualizar los datos
    socket.on('save', (data) => {
        contentData = data;
        // Guardar los datos actualizados en data.json
        fs.writeFileSync(dataFilePath, JSON.stringify(contentData, null, 2));
        // Transmitir los datos actualizados a todos los clientes conectados
        io.sockets.emit('contentUpdate', contentData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
