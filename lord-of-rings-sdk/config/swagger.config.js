const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lord of Rings SDK",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:8000/lordofrings",
      },
    ],
  },
  apis: ["./routes/lordOfRings.route.js"],
};

module.exports = swaggerOptions;
