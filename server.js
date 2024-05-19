const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataPath = path.join(__dirname, 'data.json');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New client connected');

    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const menuData = JSON.parse(data);
        socket.emit('contentUpdate', menuData);
    });

    socket.on('save', (data) => {
        fs.writeFile(dataPath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            io.emit('contentUpdate', data);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});

