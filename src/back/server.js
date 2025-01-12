const express = require("express");
const { json } = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require('http');
const { initSocket } = require("./socket");

//Routes
const taskRoutes = require("./routes/tasks");
const categoryRoutes = require("./routes/categories");
const tagRoutes = require("./routes/tags");

const PORT = 5000;

class MainServer {
  app = express();
  server = createServer(this.app);

  constructor() {
      this.handle_middleware();
      this.handle_events();
  }

  handle_middleware = () => {
      console.log("Attemping to middleware");
      this.app.use(cors());
      this.app.use(json());
      this.app.use(bodyParser.json());
      this.app.use(this.ensureSecure);
  }

  handle_events = async () => {
      console.log("Attemping to handle request");
      this.app.use("/api/tasks", taskRoutes);
      this.app.use("/api/categories", categoryRoutes);
      this.app.use("/api/tags", tagRoutes);
  };

  start = () => {
      initSocket(this.server);

      this.server.listen(PORT, () => {
          console.log(`Starting server on port ${PORT}`);
      });
  };

  ensureSecure = (req, res, next) => {
    if (req.secure) return next();
    res.redirect('https://' + req.hostname + req.originalUrl);
  }
}

module.exports = { MainServer }