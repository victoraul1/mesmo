const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin.html'));
});

app.post('/save', (req, res) => {
  const content = req.body.content;
  fs.writeFile(path.join(__dirname, 'public/data.json'), JSON.stringify({ content }), (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al guardar el contenido.');
    } else {
      res.status(200).send('Contenido guardado correctamente.');
    }
  });
});

app.get('/data', (req, res) => {
  fs.readFile(path.join(__dirname, 'public/data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer el contenido.');
    } else {
      res.status(200).json(JSON.parse(data));
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
