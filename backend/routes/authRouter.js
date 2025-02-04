const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = "cc_project";

/**
 * Register a new user.
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUserByEmail) {
      return res.status(200).json({
        success: false,
        message: "Nutzer mit dieser E-Mail-Adresse existiert bereits.",
      });
    }

    const existingUserByName = await prisma.user.findFirst({
      where: { name },
    });
    if (existingUserByName) {
      return res.status(200).json({
        success: false,
        message: "Nutzername ist bereits vergeben.",
      });
    }

    // Hash the password and create the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    res.status(200).json({
      success: true,
      message: "Nutzer erfolgreich registriert!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fehler während der Registrierung!",
    });
  }
});

/**
 * Login an existing user.
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Nutzer existiert noch nicht.",
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        message: "Passwort ist falsch.",
      });
    }

    // Create a token to authenticate the user
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login erfolgreich!",
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Fehler während des Logins!",
    });
  }
});

module.exports = router;
