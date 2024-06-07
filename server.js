const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Log all incoming requests
app.use((req, res, next) => {
    console.log('New request:', req.method, req.url, 'Host:', req.headers.host);
    next();
});

// Middleware to determine the correct directory based on the subdomain
app.use((req, res, next) => {


    let subdomain = req.headers.host.split('.')[0]; // gets 'admi' or 'carta'
    let restaurantId;
    if (subdomain === 'admi') {
        restaurantId = 'admin';
    } else if (subdomain === 'carta') {
        restaurantId = 'carta';
    } else {
        // Handle unknown subdomain
        return res.status(404).send('Subdomain not recognized'); // Or redirect, etc.
    }
    req.restaurantId = restaurantId;
    console.log('Subdomain:', subdomain, 'Restaurant ID:', req.restaurantId);
    next();
});

// Serve static files dynamically from the corresponding public directory
app.use('/:id/public', (req, res, next) => {
    const baseDir = path.join(__dirname, req.params.id, 'public');
    express.static(baseDir)(req, res, next);
});

// Dynamic routing to serve admin.html or index.html based on the subdomain
app.get('/:id/', (req, res) => {
    let file = req.restaurantId === 'admin' ? 'admin.html' : 'index.html';
    let filePath = path.join(__dirname, req.params.id, 'public', file);
    console.log('Serving HTML file:', filePath); // Logging the path to check it's correct

    res.sendFile(filePath);
});

// Path for socket.io client script
app.get('/socket.io/socket.io.js', (req, res) => {
    res.sendFile(path.resolve('./node_modules/socket.io/client-dist/socket.io.js'));
});

// Connection events for WebSocket
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
 