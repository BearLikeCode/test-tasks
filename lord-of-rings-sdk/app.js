const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const logger = require("./services/logger.service");
const lordOfRings = require("./routes/lordOfRings.route");
const swaggerOptions = require("./config/swagger.config");

require("dotenv").config();
require("./utils/axios.util");

const app = express();
const specs = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use("/lordofrings", lordOfRings);

process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

module.exports = app;
