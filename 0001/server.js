const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public')); // General static file serving

app.get('/0001/admin', function(req, res) {
    res.sendFile(path.join(__dirname, '0001/public/admin.html'));
});

app.get('/0001/carta', function(req, res) {
    res.sendFile(path.join(__dirname, '0001/public/index.html'));
});

// Repeat for 0002 and other directories if necessary

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 




// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const fs = require('fs');
// const path = require('path');
// const basicAuth = require('express-basic-auth');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// const dirPath = path.join(__dirname, 'public');

// // Configuración de autenticación básica solo para /admin.html
// app.get('/admin.html', basicAuth({
//     users: { 'admin': 'password' }, // Reemplaza 'admin' y 'password' con las credenciales que prefieras
//     challenge: true,
// }), (req, res) => {
//     res.sendFile(path.join(dirPath, 'admin.html'));
// });

// // Rutas para archivos estáticos y para index.html
// app.use(express.static(dirPath));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(dirPath, 'index.html'));
// });

// io.on('connection', (socket) => {
//     console.log('New client connected');

//     fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
//         if (err) {
//             console.error(err);
//             return;
//         }
//         socket.emit('load', data);
//     });

//     socket.on('save', (content) => {
//         fs.writeFile(path.join(__dirname, 'data.json'), content, (err) => {
//             if (err) {
//                 console.error(err);
//                 return;
//             }
//             io.emit('update', content);
//         });
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

// const PORT = 3001;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
