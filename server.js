const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/admin.html', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    // Enviar el contenido del menú cuando un cliente se conecta
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return;
        }
        const menuData = JSON.parse(data);
        socket.emit('contentUpdate', menuData);
    });

    // Guardar el contenido del menú cuando se recibe desde el admin panel
    socket.on('save', (data) => {
        fs.writeFile('data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.error('Error writing data.json:', err);
                return;
            }
            io.emit('contentUpdate', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
