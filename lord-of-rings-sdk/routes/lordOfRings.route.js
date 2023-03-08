const express = require("express");
const router = express.Router();
const axios = require("axios");

/* GET home page. */
router.get("/movies", function (req, res, next) {
  axios.get("/movie").then((response) => {
    res.send(response.data.docs);
  });
});

router.get("/movie/:id", function (req, res, next) {
  axios.get(`/movie/${req.params.id}`).then((response) => {
    res.send(response.data.docs);
  });
});

router.get("/movie/:id/quote", function (req, res, next) {
  axios.get(`/movie/${req.params.id}/quote`).then((response) => {
    res.send(response.data.docs);
  });
});

module.exports = router;
