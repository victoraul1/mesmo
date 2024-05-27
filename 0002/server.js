const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

// Configuración de autenticación básica solo para admin.html
app.use('/admin.html', basicAuth({
    users: { 'admin': 'password' }, // Reemplaza 'admin' y 'password' con el usuario y contraseña que prefieras
    challenge: true
}));

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('New client connected');

    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        socket.emit('load', data);
    });

    socket.on('save', (content) => {
        fs.writeFile(path.join(__dirname, 'data.json'), content, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            io.emit('update', content);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3002, () => {
    console.log('Listening on port 3002');
});
