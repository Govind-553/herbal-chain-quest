import express from "express";
import Batch from "../models/Batch.js";

const router = express.Router();

// Mock sensor data generation
const generateSensorData = () => ({
  moistureLevel: Math.round(12 + Math.random() * 8),
  pesticideLevel: Math.round(Math.random() * 3),
  temperature: Math.round(22 + Math.random() * 8),
  humidity: Math.round(45 + Math.random() * 15),
});

// POST /collector: Record harvest data
router.post("/", async (req, res) => {
  try {
    const { species, harvestDate, location, quantity, notes } = req.body;

    if (!species || !harvestDate || !location || !quantity) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const batchId = `AYR-${Date.now().toString(36).toUpperCase()}`;
    const sensorData = generateSensorData();
    
    const newBatch = new Batch({
      batchId,
      species,
      farmer: {
        name: "Rajesh Kumar",
        location,
      },
      harvestDate: new Date(harvestDate),
      quantity: Number(quantity),
      notes,
      sensorData,
    });

    await newBatch.save();
    res.status(201).json({ message: "Harvest data submitted successfully.", batchId: newBatch.batchId });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;