const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware to ensure the base path is correctly set
app.use((req, res, next) => {
  const host = req.headers.host;
  let subdomain = host.split('.')[0]; // Extract subdomain like 'admin' or 'carta'
  let directory = req.url.split('/')[1]; // Extract the directory number like '0001'
  let filename = (subdomain === 'admin') ? 'admin.html' : 'index.html'; // Choose file based on subdomain
  
  if (!directory || !filename) {
    return res.status(400).send("Bad Request: Missing URL components");
  }

  let filePath = path.join(__dirname, directory, 'public', filename);
  
  if (!filePath) {
    return res.status(404).send("File path resolution error");
  }
  
  req.filePath = filePath;
  next();
});

// Serve static files from the public directories
app.use(express.static(path.join(__dirname, 'public')));

// Serve the appropriate HTML file based on subdomain and directory
app.get('/:id/*', (req, res) => {
  res.sendFile(req.filePath);
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
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
