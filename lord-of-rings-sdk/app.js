const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const logger = require("./services/logger.service");
const lordOfRings = require("./routes/lordOfRings.route");

require("dotenv").config();
require("./utils/axios.util");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/lordofrings", lordOfRings);

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

module.exports = app;
