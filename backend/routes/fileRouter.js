const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

const storageDirectory = path.join(__dirname, "../file_storage");

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

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const userId = req.userId;
    if (!userId) {
      return cb(new Error("Eine userId ist erforderlich!"), null);
    }

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

router.post(
  "/upload",
  extractUserId,
  upload.single("file"),
  async (req, res) => {
    try {
      const userId = parseInt(req.userId, 10);
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "Eine userId ist erforderlich!",
        });
      }

      const { originalname, filename, path: filePath } = req.file;

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

      return res.status(200).json({
        success: true,
        message: "Datei erfolgreich hochgeladen.",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Fehler beim Upload!",
      });
    }
  }
);

router.get("/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findUnique({
      where: { fileId: parseInt(fileId, 10) },
    });

    if (!file) {
      return res.status(200).json({
        success: false,
        message: "Datei nicht gefunden!",
      });
    }

    return res.download(file.filePath, file.originalName);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Herunterladen!",
    });
  }
});

router.get("/get-all-files/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(200).json({
        success: false,
        message: "Eine gültige userId ist erforderlich!",
      });
    }

    const files = await prisma.file.findMany({
      where: {
        userId: parseInt(userId, 10),
      },
      select: {
        id: true,
        originalName: true,
        uniqueName: true,
        filePath: true,
        uploadedAt: true,
      },
    });

    return res.status(200).json({
      success: true,
      files,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Fehler beim Abrufen der Dateien!",
    });
  }
});

module.exports = router;
