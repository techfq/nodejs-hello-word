"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./config");
const helmet = require("helmet");
const morgan = require("morgan");

const config = require("./config");
const studentRoutes = require("./v1/routes/student-routes");
const projectRoutes = require("./v2/routes/project-routes");

const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
   res.status(200)
      .sendFile(__dirname + "/index.html")
      .end();
});

app.use("/api/v1", studentRoutes.routes);
app.use("/api/v2", projectRoutes.routes);

// Start the server
app.listen(config.port, () => {
   console.log(`App listening on port ${config.port || 8080}`);
   console.log("Press Ctrl+C to quit.");
});
