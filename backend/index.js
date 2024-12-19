const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;

// Import route handlers for different functionalities
const authRouter = require("./routes/authRouter");

// Enable CORS for cross-origin requests
app.use(cors());

// Middleware to parse JSON requests with a limit of 1000mb
app.use(express.json({ limit: "1000mb" }));
// Middleware to parse URL-encoded requests with a limit of 1000mb
app.use(express.urlencoded({ limit: "1000mb", extended: true }));

// Setup routes for different API endpoints
app.use("/auth", authRouter);

// Define a basic route for the root URL
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});