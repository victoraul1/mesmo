const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected');

  // Emitir el contenido al nuevo cliente
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    socket.emit('load', data);
  });

  // Guardar el contenido y emitir una actualización
  socket.on('save', (content) => {
    fs.writeFile('data.json', content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      io.emit('update', content); // Emitir el evento de actualización
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
