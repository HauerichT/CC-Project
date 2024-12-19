const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
