const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de autenticación básica solo para /admin.html
app.get('/0001/admin.html', basicAuth({
    users: { 'admin': 'password' }, // Reemplaza 'admin' y 'password' con el usuario y contraseña que prefieras
    challenge: true
}), (req, res) => {
    res.sendFile(path.join(__dirname, '0001', 'public', 'admin.html'));
});

// Rutas para archivos estáticos y para index.html
app.use('/0001', express.static(path.join(__dirname, '0001', 'public')));

app.get('/0001', (req, res) => {
    res.sendFile(path.join(__dirname, '0001', 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('New client connected');

    fs.readFile(path.join(__dirname, '0001', 'data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        socket.emit('load', data);
    });

    socket.on('save', (content) => {
        fs.writeFile(path.join(__dirname, '0001', 'data.json'), content, (err) => {
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

server.listen(3001, () => {
    console.log('Listening on port 3001');
});
