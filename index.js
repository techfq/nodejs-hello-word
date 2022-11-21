"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
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

// view engine setup
app.set("view engine", "ejs");

var sysStart = new Date().toLocaleString("en-vi");

app.get("/", async (req, res) => {
   const nowStart = new Date().toLocaleString("en-vi");
   res.render("index", { author: "tech.fqs", start: sysStart, now: nowStart });
});

app.use("/api/v1", studentRoutes.routes);
app.use("/api/v2", projectRoutes.routes);

// Start the server
app.listen(config.port, () => {
   console.log(`App listening on port ${config.port || 8080}`);
   console.log("Press Ctrl+C to quit.");
});
