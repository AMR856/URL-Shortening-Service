require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const URLRouter = require("./routes/url.route");
const usersRouter = require('./routes/users.route');
const {
  authenticateToken
} = require("./middlewares/auth.js");
const { swaggerUi, swaggerDocs } = require("./config/swagger");
app.use(bodyParser.json());
app.use("/shorten", authenticateToken, URLRouter);
app.use('/auth', usersRouter);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, {
    swaggerOptions: {
      withCredentials: true, 
    },
  })
);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
