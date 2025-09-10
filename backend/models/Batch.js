import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true,
    unique: true,
  },
  species: {
    type: String,
    required: true,
  },
  farmer: {
    name: String,
    location: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  harvestDate: {
    type: Date,
    required: true,
  },
  quantity: Number,
  notes: String,
  sensorData: {
    moistureLevel: Number,
    pesticideLevel: Number,
    temperature: Number,
    humidity: Number,
  },
  labTest: {
    date: Date,
    moistureLevel: Number,
    pesticideResult: String,
    heavyMetals: Number,
    microbialCount: Number,
    activeCompounds: Number,
    trustBadge: {
      type: String,
      enum: ["green", "yellow", "red"],
    },
  },
  processing: {
    processor: String,
    date: Date,
    steps: [{
      name: String,
      completed: Boolean,
      timestamp: Date,
      notes: String,
    }],
  },
  isFinalized: {
    type: Boolean,
    default: false,
  },
  qrGenerated: Date,
});

const Batch = mongoose.model("Batch", BatchSchema);

export default Batch;