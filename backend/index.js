const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static('public'));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Beispiel-Endpunkte
app.get('/api/files', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM files');
  res.json(rows);
});

// Echtzeitkommunikation mit Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('file-uploaded', (file) => {
    io.emit('file-update', file);
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
