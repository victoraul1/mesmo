const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataFilePath = path.join(__dirname, 'data.json');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Leer datos del archivo JSON al iniciar el servidor
let contentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Enviar datos iniciales a los clientes al conectarse
io.on('connection', (socket) => {
  socket.emit('contentUpdate', contentData);

  // Guardar cambios y enviar actualización a todos los clientes
  socket.on('save', (data) => {
    contentData = data;
    fs.writeFileSync(dataFilePath, JSON.stringify(contentData, null, 2), 'utf8');
    io.emit('contentUpdate', contentData);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
