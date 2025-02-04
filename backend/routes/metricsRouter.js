const express = require("express");

const router = express.Router();
const { latencyHistogram } = require("../metrics");

/**
 * Report the latency of an operation.
 */
router.post("/report-latency", (req, res) => {
  try {
    // Extract the latency and operation from the request
    const { latency, operation } = req.body;

    // Check if latency and operation are provided
    if (!latency || !operation) {
      return res.status(400).json({
        success: false,
        message: "Latenz und Operation müssen angegeben werden!",
      });
    }

    // Observe the latency
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
