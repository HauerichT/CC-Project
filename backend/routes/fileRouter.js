const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const { availabilityCounter } = require("../metrics");

const prisma = new PrismaClient();
const router = express.Router();

const storageDirectory = path.join(__dirname, "../file_storage");

// Extract the userId of the request
const extractUserId = (req, res, next) => {
  const userId = req.headers["user-id"] || req.body.userId;
  if (!userId) {
    return res
      .status(200)
      .json({ success: false, message: "Eine userId ist erforderlich!" });
  }
  req.userId = userId;
  next();
};

// Init the storage
const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.userId;
    const userFolder = path.join(storageDirectory, userId);

    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    cb(null, userFolder);
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/** Upload a new file */
router.post(
  "/upload",
  extractUserId,
  upload.single("file"),
  async (req, res) => {
    console.log(`Upload-Handler aufgerufen: userId=${req.userId}`);
    const clientStartTimestamp = parseInt(req.body.startTimestamp, 10);
    try {
      const userId = parseInt(req.userId, 10);
      const { originalname, filename, path: filePath } = req.file;

      // Save file informations in database
      const file = await prisma.file.create({
        data: {
          originalName: originalname,
          uniqueName: filename,
          filePath: filePath,
          userId: userId,
        },
      });
      await prisma.userFileAccess.create({
        data: {
          userId: userId,
          fileId: file.id,
        },
      });

      req.io.to(userId).emit("fileUploaded", {
        originalName: originalname,
        sessionId: req.headers["token-auth"],
        clientStartTimestamp: clientStartTimestamp,
      });

      availabilityCounter.inc({ operation: "upload", status: "success" });
      res.status(200).json({
        success: true,
        message: "Datei erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error(error);
      availabilityCounter.inc({ operation: "upload", status: "failure" });
      res.status(500).json({
        success: false,
        message: "Fehler beim Upload!",
      });
    }
  }
);

/** Delete a existing file */
router.delete(
  "/delete/:fileId/:token/:startTimestamp",
  extractUserId,
  async (req, res) => {
    try {
      const { fileId, token, startTimestamp } = req.params;

      console.log(`Upload-Handler aufgerufen: userId=${req.userId}`);
      const clientStartTimestamp = parseInt(startTimestamp, 10);

      // Find file to delete in database
      const file = await prisma.file.findUnique({
        where: { id: parseInt(fileId, 10) },
      });
      if (!file) {
        availabilityCounter.inc({ operation: "delete", status: "failure" });
        return res.status(200).json({
          success: false,
          message: "Datei nicht gefunden!",
        });
      }

      // Delete file from database
      await prisma.file.delete({
        where: { id: parseInt(fileId, 10) },
      });

      const originalName = file.originalName;
      const userId = file.userId;

      // Send real time information to all clients
      req.io.to(userId).emit("fileDeleted", {
        originalName,
        sessionId: token,
        clientStartTimestamp: clientStartTimestamp,
      });

      availabilityCounter.inc({ operation: "delete", status: "success" });
      res.status(200).json({
        success: true,
        message: "Datei erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error(error);
      availabilityCounter.inc({ operation: "delete", status: "failure" });
      res.status(500).json({
        success: false,
        message: "Fehler beim Löschen!",
      });
    }
  }
);

/** Get all files of an user */
router.get("/get-all-files/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Select all files of the user
    const files = await prisma.file.findMany({
      where: { userId: parseInt(userId, 10) },
      select: {
        id: true,
        originalName: true,
        uniqueName: true,
        filePath: true,
        uploadedAt: true,
      },
    });

    availabilityCounter.inc({ operation: "get-all-files", status: "success" });
    res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);
    availabilityCounter.inc({ operation: "get-all-files", status: "failure" });
    res.status(500).json({
      success: false,
      message: "Fehler beim Abrufen der Dateien!",
    });
  }
});

/** Download a file */
router.get("/download/:fileId", extractUserId, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = parseInt(req.userId, 10);

    // Check if file exists
    const file = await prisma.file.findUnique({
      where: { id: parseInt(fileId, 10) },
    });
    if (!file) {
      availabilityCounter.inc({ operation: "download", status: "failure" });
      return res.status(200).json({
        success: false,
        message: "Datei nicht gefunden!",
      });
    }

    // Check if user has access
    const hasAccess = await prisma.userFileAccess.findFirst({
      where: {
        userId: userId,
        fileId: parseInt(fileId, 10),
      },
    });
    if (!hasAccess) {
      availabilityCounter.inc({ operation: "download", status: "failure" });
      return res.status(200).json({
        success: false,
        message: "Zugriff verweigert!",
      });
    }

    const filePath = file.filePath;

    // Check if file exists in storage
    if (!fs.existsSync(filePath)) {
      availabilityCounter.inc({ operation: "download", status: "failure" });
      return res.status(200).json({
        success: false,
        message: "Datei wurde nicht auf dem Server gefunden!",
      });
    }

    // Return file
    res.download(filePath, file.originalName, (err) => {
      if (err) {
        console.error(err);
        availabilityCounter.inc({ operation: "download", status: "failure" });
        return res.status(200).json({
          success: false,
          message: "Fehler beim Herunterladen der Datei!",
        });
      }
    });
    availabilityCounter.inc({ operation: "download", status: "success" });
  } catch (error) {
    console.error(error);
    availabilityCounter.inc({ operation: "download", status: "failure" });
    res.status(500).json({
      success: false,
      message: "Interner Serverfehler!",
    });
  }
});

module.exports = router;
