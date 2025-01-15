const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const fileRouter = require("./routes/fileRouter");
const http = require("http");
const socketIo = require("socket.io");
const { register } = require("./metrics");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 8000;

// Create HTTP-Server and init Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log(`${socket.id} hat sich verbunden.`);

  // Benutzerraum beitreten
  socket.on("joinRoom", (userId) => {
    console.log(`Socket ${socket.id} tritt Raum ${userId} bei.`);
    socket.join(userId); // Benutzer tritt seinem eigenen Raum bei
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} hat sich getrennt.`);
  });
});

// Make Socket.IO available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/auth", authRouter);
app.use("/file", fileRouter);

// Health-Check Endpoints
app.get("/health/backend", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send("UP");
});

app.get("/health/frontend", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send("UP");
});

app.get("/health/database", async (req, res) => {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.set("Content-Type", "text/plain");
    res.status(200).send("UP");
  } catch (error) {
    res.set("Content-Type", "text/plain");
    res.status(500).send("DOWN");
  } finally {
    await prisma.$disconnect();
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
