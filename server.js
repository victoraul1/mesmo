const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dataFilePath = path.join(__dirname, 'data.json');

// Middleware to serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


// Load initial content data from data.json
let contentData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Send the initial content data to the newly connected client
    socket.emit('contentUpdate', contentData);
    
    // Handle 'save' event from admin page to update content data
    socket.on('save', (data) => {
        contentData = data;
        // Save updated content data to data.json
        fs.writeFileSync(dataFilePath, JSON.stringify(contentData, null, 2));
        // Broadcast updated content data to all connected clients
        io.sockets.emit('contentUpdate', contentData);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
