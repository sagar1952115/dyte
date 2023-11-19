const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Log } = require("./models/LogModel");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

app.use(cors());

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("connected");
});

app.use(bodyParser.json());

app.post("/logs/ingest", async (req, res) => {
  const logData = req.body;

  // Check if the log format is correct

  if (!isValidLogFormat(logData)) {
    return res.status(400).send("Invalid log data format");
  }

  try {
    // Save the log to the database
    await Log.create(logData);
    res.status(200).send("Log ingested successfully");
  } catch (error) {
    console.error("Error ingesting log:", error);
    res.status(500).send("Internal Server Error");
  }
});

function buildQuery(queryParams) {
  // Build a MongoDB query based on the specified parameters
  const query = {};

  if (queryParams.level) {
    query.level = { $regex: queryParams.level };
  }
  if (queryParams.message) {
    query.message = { $regex: queryParams.message };
  }
  if (queryParams.resourceId) {
    query.resourceId = { $regex: queryParams.resourceId };
  }
  if (queryParams.timestamp) {
    query.timestamp = { $regex: queryParams.timestamp };
  }
  if (queryParams.traceId) {
    query.traceId = { $regex: queryParams.traceId };
  }
  if (queryParams.spanId) {
    query.spanId = { $regex: queryParams.spanId };
  }
  if (queryParams.commit) {
    query.commit = { $regex: queryParams.commit };
  }
  if (queryParams.metadata && queryParams.metadata.parentResourceId) {
    query.metadata.parentResourceId = {
      $regex: queryParams.metadata.parentResourceId,
    };
  }

  return query;
}

app.get("/logs", async (req, res) => {
  // Retrieve logs from the database based on query parameters
  try {
    const query = buildQuery(req.query);
    const logs = await Log.find(query);
    return res.json(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App listening at port ${process.env.PORT}`);
});

function isValidLogFormat(logData) {
  // Check if the log fields are present or not
  return (
    logData &&
    logData.level &&
    logData.message &&
    logData.resourceId &&
    logData.timestamp &&
    logData.traceId &&
    logData.spanId &&
    logData.commit &&
    logData.metadata &&
    logData.metadata.parentResourceId
  );
}
