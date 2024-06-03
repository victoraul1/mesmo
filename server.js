const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use((req, res, next) => {
    let subdomain = req.headers.host.split('.')[0];
    req.restaurantId = subdomain === 'admi' ? 'admin' : 'carta';
    next();
});

app.use('/:id/public', express.static((req, res, next) => {
    return path.join(__dirname, req.params.id, 'public');
}));

app.get('/:id/', (req, res) => {
    let file = req.restaurantId === 'admin' ? 'admin.html' : 'index.html';
    res.sendFile(path.join(__dirname, req.params.id, 'public', file));
});

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
