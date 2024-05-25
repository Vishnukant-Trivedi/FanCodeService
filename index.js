const express = require('express');
const helper = require("./src/lib/helper");
const config = require('./config/config');
const app = express();
const port = config.server.port;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//Register routes
helper
    .fileList('./src/routes')
    .forEach(filePath => require(`./${filePath.toString()}`)(app));

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = {
  app: app
}