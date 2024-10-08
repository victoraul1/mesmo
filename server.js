const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const fs = require('fs');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Define user credentials for basic authentication
const userAuth = {
    '0001': { username: 'user1', password: 'pass1' },
    '0002': { username: 'user2', password: 'pass2' },
    '0003': { username: 'user3', password: '3quena' },
    '0004': { username: 'user4', password: 'pass4' },
    '0005': { username: 'user5', password: 'pass5' },
    '0006': { username: 'user6', password: 'pass6' },
    '0007': { username: 'user7', password: 'pass7' },
    '0008': { username: 'user8', password: 'pass8' },
    '0009': { username: 'user9', password: 'pass9' },
    '0010': { username: 'user10', password: 'pass10' },
    '0011': { username: 'user11', password: 'pass11' },
    '0012': { username: 'user12', password: 'pass12' },
    '0013': { username: 'user13', password: 'pass13' },
    '0014': { username: 'user14', password: 'pass14' },
    '0015': { username: 'user15', password: 'pass15' },
    '0016': { username: 'user16', password: 'pass16' },
    '0017': { username: 'user17', password: 'pass17' },
    '0018': { username: 'user18', password: 'pass18' },
    '0019': { username: 'user19', password: 'pass19' },
    '0020': { username: 'user20', password: 'pass20' }
};


// Helper function to generate authentication middleware
const generateAuth = (id) => {
    const users = {};
    users[userAuth[id].username] = userAuth[id].password;
    return basicAuth({
        users: users,
        challenge: true,
        realm: 'Admin'
    });
};

app.use(express.json()); // Support for JSON-encoded bodies

// Middleware for detailed logging
app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.url}`);
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
// Adding authentication only for admin.html
app.get('/:id/', (req, res, next) => {
    let file = req.restaurantId === 'admin' ? 'admin.html' : 'index.html';
    let filePath = path.join(__dirname, req.params.id, 'public', file);

    if (file === 'admin.html') {
        const authMiddleware = generateAuth(req.params.id);
        authMiddleware(req, res, () => res.sendFile(filePath));
    } else {
        res.sendFile(filePath);
    }

    console.log('Serving HTML file:', filePath);
});

// Update the path to handle the GET and POST requests for data.json
app.get('/:id/data.json', (req, res) => {
    const dataPath = path.join('/var/www/mesmo_data', req.params.id, 'data.json');
    res.sendFile(dataPath);
    console.log('Serving data file:', dataPath);
});

app.post('/:id/data.json', (req, res) => {
    const dataPath = path.join('/var/www/mesmo_data', req.params.id, 'data.json');
    fs.writeFile(dataPath, JSON.stringify(req.body), (err) => {
        if (err) {
            console.error('Failed to save data:', err);
            res.status(500).send('Failed to save data');
            return;
        }
        res.status(200).send('Data saved successfully');
        console.log('Data saved:', dataPath);
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
        const dataPath = path.join('/var/www/mesmo_data', id, 'data.json');
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
        const dataPath = path.join('/var/www/mesmo_data', id, 'data.json');
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
