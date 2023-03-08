const express = require("express");
const router = express.Router();
const axios = require("axios");

/**
 * @swagger
 * paths:
 *  /movies:
 *   get:
 *     summary: Lists all the movies
 *     responses:
 *       200:
 *         description: The list of the movies
 *  /movie/{id}:
 *   get:
 *     summary: Get the movie by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The movie response by id
 *  /movie/{id}/quote:
 *   get:
 *     summary: Get the quote by id
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The movie id
 *     responses:
 *       200:
 *         description: The quote response by movie id
 */

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
