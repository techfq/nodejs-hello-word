// [START gae_node_request_example]
const express = require("express");

const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

app.use(helmet());
app.use(morgan("common"));

app.get("/v1", (req, res) => {
   res.status(200).send({ message: "Hello, world!" }).end();
});
app.get("/v1/users/:id", (req, res) => {
   res.json({
      status: "success",
      name: "Robert",
      age: 40,
   });
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
   console.log(`App listening on port ${PORT}`);
   console.log("Press Ctrl+C to quit.");
});
