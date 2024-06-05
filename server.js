const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

app.use((req, res, next) => {
    let subdomain = req.headers.host.split('.')[0]; // gets 'admi' or 'carta'
    req.restaurantId = subdomain === 'admi' ? 'admin' : 'carta';
    next();
});

// Serve static files dynamically from the corresponding public directory
app.use('/:id/public', (req, res, next) => {
    let baseDir = path.join(__dirname, req.params.id, 'public');
    console.log('Base directory for static files:', baseDir); // Debugging output
    express.static(baseDir)(req, res, next);
});

// Dynamic routing to serve admin.html or index.html based on the subdomain
app.get('/:id/', (req, res) => {
    let file = req.restaurantId === 'admin' ? 'admin.html' : 'index.html';
    res.sendFile(path.join(__dirname, req.params.id, 'public', file));
});

// Path for socket.io client script
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve('./node_modules/socket.io/client-dist/socket.io.js'));
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


