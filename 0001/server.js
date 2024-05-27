const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const dirPath = path.join(__dirname, 'public');

// Autenticación básica para /admin.html
app.get('/admin.html', basicAuth({
  users: { 'admin': 'password' }, // Reemplaza 'admin' y 'password' con las credenciales que prefieras
  challenge: true,
}), (req, res) => {
  res.sendFile(path.join(dirPath, 'admin.html'));
});

// Rutas para archivos estáticos
app.use(express.static(dirPath));

// Enviar index.html como respuesta para todas las demás rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(dirPath, 'index.html'));
});

// Manejo de conexiones socket.io
io.on('connection', (socket) => {
  console.log('New client connected');

  // Leer el archivo data.json y enviarlo al cliente
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    socket.emit('load', data);
  });

  // Guardar los datos enviados por el cliente en data.json
  socket.on('save', (content) => {
    fs.writeFile(path.join(__dirname, 'data.json'), content, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      io.emit('update', content);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
