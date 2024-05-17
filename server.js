const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

io.on('connection', (socket) => {
    socket.on('update content', (data) => {
        fs.writeFile(path.join(__dirname, 'public', 'index.html'), generateHTML(data), (err) => {
            if (err) throw err;
            io.emit('content updated', data);
        });
    });
});

function generateHTML(data) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Página Pública</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div>
            <img src="${data.bannerUrl}" alt="Banner">
        </div>
        <div>
            <video src="${data.videoUrl}" controls></video>
        </div>
        <div>
            <p id="copy-text">${data.copyText}</p>
        </div>
        <div>
            <img src="${data.copy1Url}" alt="Copy 1">
            <img src="${data.copy2Url}" alt="Copy 2">
            <img src="${data.copy3Url}" alt="Copy 3">
        </div>
        <script src="/socket.io/socket.io.js"></script>
        <script src="script.js"></script>
    </body>
    </html>
    `;
}

http.listen(3000, () => {
    console.log('Server running on port 3000');
});
