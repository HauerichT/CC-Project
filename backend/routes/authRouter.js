const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { latencyHistogram, availabilityCounter } = require("../metrics");

const prisma = new PrismaClient();
const router = express.Router();

const SECRET_KEY = "cc_project";

router.post("/register", async (req, res) => {
  const end = latencyHistogram.startTimer({ operation: "register" });
  const { email, password, name } = req.body;

  try {
    const existingUserByEmail = await prisma.user.findFirst({
      where: { email },
    });
    if (existingUserByEmail) {
      availabilityCounter.inc({ operation: "register", status: "failure" });
      end();
      return res.status(200).json({
        success: false,
        message: "Nutzer mit dieser E-Mail-Adresse existiert bereits.",
      });
    }

    const existingUserByName = await prisma.user.findFirst({
      where: { name },
    });
    if (existingUserByName) {
      availabilityCounter.inc({ operation: "register", status: "failure" });
      end();
      return res.status(200).json({
        success: false,
        message: "Nutzername ist bereits vergeben.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    availabilityCounter.inc({ operation: "register", status: "success" });
    end();
    res.status(200).json({
      success: true,
      message: "Nutzer erfolgreich registriert!",
    });
  } catch (error) {
    availabilityCounter.inc({ operation: "register", status: "failure" });
    end();
    res.status(500).json({
      success: false,
      message: "Fehler während der Registrierung!",
    });
  }
});

router.post("/login", async (req, res) => {
  const end = latencyHistogram.startTimer({ operation: "login" });
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      availabilityCounter.inc({ operation: "login", status: "failure" });
      end();
      return res.status(200).json({
        success: false,
        message: "Nutzer existiert noch nicht.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      availabilityCounter.inc({ operation: "login", status: "failure" });
      end();
      return res.status(200).json({
        success: false,
        message: "Passwort ist falsch.",
      });
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    availabilityCounter.inc({ operation: "login", status: "success" });
    end();
    res.status(200).json({
      success: true,
      message: "Login erfolgreich!",
      data: token,
    });
  } catch (error) {
    availabilityCounter.inc({ operation: "login", status: "failure" });
    end();
    res.status(500).json({
      success: false,
      message: "Fehler während des Logins!",
    });
  }
});

module.exports = router;
