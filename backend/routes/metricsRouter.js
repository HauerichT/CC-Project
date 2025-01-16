const express = require("express");

const router = express.Router();
const { latencyHistogram } = require("../metrics");

router.post("/report-latency", (req, res) => {
  try {
    const { latency, operation } = req.body;

    if (!latency || !operation) {
      return res.status(400).json({
        success: false,
        message: "Latenz und Operation müssen angegeben werden!",
      });
    }

    latencyHistogram.observe({ operation }, latency);

    res
      .status(200)
      .json({ success: true, message: "Latenz erfolgreich gespeichert!" });
  } catch (error) {
    console.error("Fehler beim Speichern der Latenz:", error);
    res
      .status(500)
      .json({ success: false, message: "Fehler beim Speichern der Latenz!" });
  }
});

module.exports = router;
