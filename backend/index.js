const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const fileRouter = require("./routes/fileRouter");
const metricsRouter = require("./routes/metricsRouter");
const http = require("http");
const socketIo = require("socket.io");
const { register, latencyHistogram } = require("./metrics");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 8000;

// Create HTTP-Server and init Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Erlaube alle Ursprünge
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: "*", // Erlaube alle Ursprünge
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(`User ${socket.id} joined room ${userId}`);
  });

  socket.on("leaveRoom", (userId) => {
    socket.leave(userId);
    console.log(`User ${socket.id} left room ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
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
app.use("/metrics", metricsRouter);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Health-Check Endpoints
app.get("/health/backend", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send("backend_health 1");
});

app.get("/health/frontend", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.status(200).send("frontend_health 1");
});

app.get("/health/database", async (req, res) => {
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.set("Content-Type", "text/plain");
    res.status(200).send("database_health 1");
  } catch (error) {
    res.set("Content-Type", "text/plain");
    res.status(500).send("database_health 0");
  } finally {
    await prisma.$disconnect();
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
