"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./config");
const helmet = require("helmet");
const morgan = require("morgan");

const config = require("./config");
const studentRoutes = require("./v1/routes/student-routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
   res.status(200).send("Hello, world!").end();
});

app.use("/api/v1", studentRoutes.routes);

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(config.port, () => {
   console.log(`App listening on port ${config.port}`);
   console.log("Press Ctrl+C to quit.");
});
