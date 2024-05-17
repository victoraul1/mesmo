const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let pageContent = {
    bannerImg: 'images/banner.jpg',
    videoSrc: 'video.mp4',
    placeholderText: 'This is a placeholder for copy.',
    copyImg1: 'images/copy1.jpg',
    copyImg2: 'images/copy2.jpg',
    copyImg3: 'images/copy3.jpg'
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/get-page-content', (req, res) => {
    res.json(pageContent);
});

app.post('/update-page', (req, res) => {
    pageContent = { ...pageContent, ...req.body };
    io.emit('pageUpdate', pageContent);
    res.json({ success: true });
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.emit('pageUpdate', pageContent);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
