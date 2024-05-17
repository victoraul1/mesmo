const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, 'data.json');

// Leer datos desde el archivo JSON
const readData = () => {
    if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE);
        return JSON.parse(data);
    }
    return {
        banner: '',
        video: '',
        copy1: '',
        copy2: '',
        copy3: '',
        description1: '',
        description2: '',
        description3: ''
    };
};

// Escribir datos en el archivo JSON
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint para obtener los datos
app.get('/data', (req, res) => {
    res.json(readData());
});

io.on('connection', (socket) => {
    console.log('New client connected');
    
    // Enviar datos actuales al cliente
    socket.emit('update', readData());

    // Manejar cambios desde el cliente
    socket.on('save', (data) => {
        writeData(data);
        io.emit('update', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
