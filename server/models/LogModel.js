const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  level: { type: String, index: true },
  message: { type: String, index: true },
  resourceId: { type: String, index: true },
  timestamp: { type: Date, index: true },
  traceId: { type: String, index: true },
  spanId: { type: String, index: true },
  commit: { type: String, index: true },
  metadata: {
    parentResourceId: String,
  },
});

const Log = mongoose.models.logs || mongoose.model("logs", LogSchema);

module.exports = { Log };
