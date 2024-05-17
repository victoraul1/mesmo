const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataFilePath = path.join(__dirname, 'data.json');

app.use(express.static(path.join(__dirname, 'public')));

let contentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.emit('contentUpdate', contentData);

    socket.on('save', (data) => {
        contentData = data;
        fs.writeFileSync(dataFilePath, JSON.stringify(contentData, null, 2));
        io.sockets.emit('contentUpdate', contentData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
