const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/authRouter");
const fileRouter = require("./routes/fileRouter");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/file", fileRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
