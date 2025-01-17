const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = "cc_project";

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users =
      await prisma.$queryRaw`SELECT * FROM User WHERE email = ${email} LIMIT 1;`;
    console.log(users);
    const user = users[0];

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "Nutzer existiert noch nicht.",
      });
    }

    // Überprüfe das Passwort
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(200).json({
        success: false,
        message: "Passwort ist falsch.",
      });
    }

    // Generiere das JWT-Token
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      message: "Login erfolgreich!",
      data: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Fehler während des Logins!",
    });
  }
});

module.exports = router;
