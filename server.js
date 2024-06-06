const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Middleware to determine the correct directory and file based on the subdomain and URL path
app.use((req, res, next) => {
  const host = req.headers.host;
  let subdomain = host.split('.')[0]; // This assumes your subdomain is the first part of the host, like 'admin' or 'carta'
  const directory = req.path.split('/')[1]; // This gets the directory like '0001' or '0002'
  let filename = (subdomain === 'admin') ? 'admin.html' : 'index.html'; // Determine the file to serve based on subdomain

  req.servePath = path.join(__dirname, directory, 'public', filename);
  next();
});

// Serve static files dynamically from the corresponding public directory
app.use((req, res, next) => {
  express.static(path.join(__dirname, req.params.id, 'public'))(req, res, next);
});

// Serve the appropriate HTML file based on subdomain and directory
app.get('/:id/*', (req, res) => {
  res.sendFile(req.servePath);
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
