const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let content = '';

io.on('connection', (socket) => {
  socket.emit('load', content);

  socket.on('save', (data) => {
    content = data;
    fs.writeFileSync(path.join(__dirname, 'public', 'data.json'), JSON.stringify({ content }), 'utf8');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
