const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const URLRouter = require("./routes/url.route");

app.use(bodyParser.json());
app.use("/shorten", URLRouter);
app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
