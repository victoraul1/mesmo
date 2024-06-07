const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Detailed logging middleware
app.use((req, res, next) => {
    console.log('Received request:', req.method, req.url);
    console.log('Headers:', req.headers);
    next();
});

// Middleware to determine the correct directory based on the subdomain
app.use((req, res, next) => {
    let subdomain = req.headers.host.split('.')[0];
    console.log('Subdomain extracted:', subdomain);
    let restaurantId = subdomain === 'admi' ? 'admin' : 'carta';
    req.restaurantId = restaurantId;
    console.log('Mapped subdomain to restaurant ID:', restaurantId);
    next();
});

// Serve static files dynamically from the corresponding public directory
app.use('/:id/public', (req, res, next) => {
    const baseDir = path.join(__dirname, req.params.id, 'public');
    console.log('Serving static files from:', baseDir);
    express.static(baseDir)(req, res, next);
});

// Dynamic routing to serve admin.html or index.html based on the subdomain
app.get('/:id/', (req, res) => {
    let file = req.restaurantId === 'admin' ? 'admin.html' : 'index.html';
    let filePath = path.join(__dirname, req.params.id, 'public', file);
    console.log('Serving HTML file:', filePath);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error serving file!');
        }
    });
});

// Error handling for non-existent routes
app.use((req, res, next) => {
    console.log('No route found for:', req.url);
    res.status(404).send('Page not found');
});

// Connection events for WebSocket
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
