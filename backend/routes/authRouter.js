const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = "cc_project";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "Nutzer mit dieser E-Mail-Adresse existiert bereits.",
      });
    }

    const existingUserByName = await prisma.user.findUnique({
      where: { name },
    });
    if (existingUserByName) {
      return res
        .status(400)
        .json({ message: "Nutzername ist bereits vergeben." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res
      .status(200)
      .json({ message: "Nutzer erfolgreich registriert!", newUser });
  } catch (error) {
    res.status(500).json({ message: "Fehler während der Registrierung!" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(400).json({ message: "Nutzer existiert noch nicht." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Passwort ist falsch." });
    }

    const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login erfolgreich!" });
  } catch (error) {
    res.status(500).json({ message: "Fehler während des Logins!" });
  }
});

module.exports = router;
