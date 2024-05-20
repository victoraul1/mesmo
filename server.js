const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataFilePath = path.join(__dirname, 'data.json');

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('save', (content) => {
        fs.writeFileSync(dataFilePath, JSON.stringify({ content }), 'utf8');
        io.emit('update', content);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
