const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const fs = require('fs'); // Required to read and write files

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware for detailed logging
app.use((req, res, next) => {
    console.log('Received request:', req.method, req.url);
    console.log('Headers:', req.headers);
    next();
});

// Middleware to determine the correct directory based on the subdomain
app.use((req, res, next) => {
    let subdomain = req.headers.host.split('.')[0];
    let restaurantId = subdomain === 'admi' ? 'admin' : 'carta';
    req.restaurantId = restaurantId;
    console.log('Subdomain extracted:', subdomain);
    console.log('Mapped subdomain to restaurant ID:', restaurantId);
    next();
});

// Serve static files dynamically from the corresponding public directory
app.use('/:id/public', (req, res, next) => {
    const baseDir = path.join(__dirname, req.params.id, 'public');
    express.static(baseDir)(req, res, next);
    console.log('Serving static files from:', baseDir);
});

// Dynamic routing to serve admin.html or index.html based on the subdomain
app.get('/:id/', (req, res) => {
    let file = req.restaurantId === 'admin' ? 'admin.html' : 'index.html';
    let filePath = path.join(__dirname, req.params.id, 'public', file);
    res.sendFile(filePath);
    console.log('Serving HTML file:', filePath);
});

// Route to handle the GET and POST request for data.json for each restaurant
app.get('/:id/data.json', (req, res) => {
    const dataPath = path.join(__dirname, req.params.id, 'public', 'data.json');
    res.sendFile(dataPath);
    console.log('Serving data file:', dataPath);
});

app.post('/:id/data.json', (req, res) => {
    const dataPath = path.join(__dirname, req.params.id, 'public', 'data.json');
    let content = '';

    req.on('data', (chunk) => {
        content += chunk;
    });

    req.on('end', () => {
        fs.writeFile(dataPath, content, (err) => {
            if (err) {
                console.error('Failed to save data:', err);
                res.status(500).send('Failed to save data');
                return;
            }
            res.status(200).send('Data saved successfully');
            console.log('Data saved:', dataPath);
        });
    });
});

// Connection events for WebSocket
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    // Emitting and receiving updates for data.json
    socket.on('request-data', (id) => {
        const dataPath = path.join(__dirname, id, 'public', 'data.json');
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                socket.emit('data-error', 'Failed to load data');
                console.error('Error loading data:', err);
                return;
            }
            socket.emit('load-data', JSON.parse(data));
        });
    });

    socket.on('save-data', (id, data) => {
        const dataPath = path.join(__dirname, id, 'public', 'data.json');
        fs.writeFile(dataPath, JSON.stringify(data), (err) => {
            if (err) {
                socket.emit('data-error', 'Failed to save data');
                console.error('Error saving data:', err);
                return;
            }
            socket.broadcast.emit('data-updated', id, data);
            console.log('Data updated:', dataPath);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
