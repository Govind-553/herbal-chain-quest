import express from "express";
import Batch from "../models/Batch.js";

const router = express.Router();

// GET /batch/:id: Get full provenance information for a batch
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findOne({ batchId: id });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    res.status(200).json({
      message: "Batch information retrieved successfully.",
      batchInfo: batch,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;