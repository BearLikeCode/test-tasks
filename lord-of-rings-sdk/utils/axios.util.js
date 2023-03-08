const axios = require("axios");
const logger = require("../services/logger.service");

module.exports = axios.interceptors.request.use(
  function (config) {
    config.baseURL = "https://the-one-api.dev/v2";
    config.headers = {
      Authorization: "Bearer " + process.env.ACCESS_TOKEN,
    };
    return config;
  },
  function (error) {
    logger.error(`Uncaught Exception: ${error.message}`, error);
    return Promise.reject(error);
  }
);
