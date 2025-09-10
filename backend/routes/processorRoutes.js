import express from "express";
import Batch from "../models/Batch.js";

const router = express.Router();

// POST /process: Add processing step to a batch
router.post("/", async (req, res) => {
  try {
    const { batchId, stepName, notes, completed } = req.body;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    const stepIndex = batch.processing.steps.findIndex(s => s.name === stepName);

    if (stepIndex !== -1) {
      batch.processing.steps[stepIndex] = { ...batch.processing.steps[stepIndex], completed, timestamp: new Date(), notes };
    } else {
      batch.processing.steps.push({ name: stepName, completed, timestamp: new Date(), notes });
    }

    await batch.save();
    res.status(200).json({ message: "Processing step updated successfully.", batch });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST /qrcode: Generate QR code data for a batch
router.post("/qrcode", async (req, res) => {
  try {
    const { batchId } = req.body;

    const batch = await Batch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // Check if all steps are completed
    const allStepsCompleted = batch.processing.steps.every(step => step.completed);
    if (!allStepsCompleted) {
      return res.status(400).json({ message: "All processing steps must be completed before generating a QR code." });
    }

    batch.isFinalized = true;
    batch.qrGenerated = new Date();
    await batch.save();

    const qrData = {
      batchId: batch.batchId,
      url: `http://localhost:8080/consumer?batch=${batch.batchId}`,
      timestamp: batch.qrGenerated,
      processor: "AyurChain Certified Processor"
    };

    res.status(200).json({ message: "QR code data generated successfully.", qrData });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;