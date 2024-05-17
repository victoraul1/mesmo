const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let content = {
    banner: 'images/banner.png',
    video: 'video.mp4',
    copy: 'This is a placeholder for copy....',
    copy1: 'images/copy1.png',
    copy2: 'images/copy2.png',
    copy3: 'images/copy3.png'
};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.emit('contentUpdated', content);

    socket.on('updateContent', (data) => {
        content = data;
        io.emit('contentUpdated', content);
    });

    socket.on('saveContent', (data) => {
        content = data;
        io.emit('contentUpdated', content);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
