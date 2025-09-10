import express from "express";
import Batch from "../models/Batch.js";

const router = express.Router();

// GET /dashboard/analytics: Get data for the analytics dashboard
router.get("/analytics", async (req, res) => {
  try {
    const totalBatches = await Batch.countDocuments();
    const batches = await Batch.find({});
    
    // Aggregate data for charts and metrics
    const trustBadgeCounts = batches.reduce((acc, batch) => {
      if (batch.labTest?.trustBadge) {
        acc[batch.labTest.trustBadge] = (acc[batch.labTest.trustBadge] || 0) + 1;
      }
      return acc;
    }, {});
    
    const exportReadyBatches = batches.filter(batch => batch.labTest?.trustBadge === "green").length;
    const exportReadyPercentage = totalBatches > 0 ? Math.round((exportReadyBatches / totalBatches) * 100) : 0;
    
    // You can add more complex aggregation logic here for other charts like monthly harvests
    
    res.status(200).json({
      totalBatches,
      trustBadgeCounts,
      exportReadyPercentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /dashboard/regulator: Get data for the regulator dashboard
router.get("/regulator", async (req, res) => {
  try {
    const batches = await Batch.find({});
    res.status(200).json({
      batches,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;