import express from "express";
import Batch from "../models/Batch.js";

const router = express.Router();

// Helper to compute trust badge based on rules
const computeTrustBadge = (testResults) => {
  const moisture = parseFloat(testResults.moistureLevel);
  const pesticide = testResults.pesticideResult;
  const heavyMetals = parseFloat(testResults.heavyMetals);
  const microbial = parseFloat(testResults.microbialCount);
  const activeCompounds = parseFloat(testResults.activeCompounds);

  const criticalFailures = [
    pesticide === "fail",
    heavyMetals > 10,
    microbial > 100000,
  ];

  const minorIssues = [
    moisture > 15 || moisture < 8,
    activeCompounds < 2,
  ];

  if (criticalFailures.some(Boolean)) {
    return "red";
  } else if (minorIssues.some(Boolean)) {
    return "yellow";
  } else {
    return "green";
  }
};

// POST /labtest: Update batch with lab test results
router.post("/", async (req, res) => {
  try {
    const { batchId, testResults } = req.body;

    if (!batchId || !testResults.moistureLevel || !testResults.pesticideResult) {
      return res.status(400).json({ message: "Please provide batch ID and required test results." });
    }

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    const trustBadge = computeTrustBadge(testResults);
    batch.labTest = { ...testResults, date: new Date(), trustBadge };

    await batch.save();
    res.status(200).json({ message: "Lab results submitted successfully.", trustBadge });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;