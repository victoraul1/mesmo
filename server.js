const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('New client connected');

    // Load content and send it to the client
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data.json:', err);
            return;
        }
        const menuData = JSON.parse(data);
        socket.emit('contentUpdate', menuData);
    }); 

    socket.on('save', (updatedContent) => {
        fs.writeFile('./data.json', JSON.stringify(updatedContent, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing data.json:', err);
                return;
            }
            console.log('Content updated successfully');
            io.emit('contentUpdate', updatedContent);
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
