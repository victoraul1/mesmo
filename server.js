const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Rutas para servir el index.html y admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Manejo de eventos de Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('updateContent', (data) => {
    // Guardar los datos en un archivo o en una base de datos
    fs.writeFileSync(path.join(__dirname, 'public', 'data.json'), JSON.stringify(data));
    
    // Emitir los datos actualizados a todos los clientes
    io.emit('contentUpdated', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));

