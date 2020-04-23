// index.js
require('dotenv').config()

/**
 * Required External Modules
 */
const express = require("express");
const authController = require('./controllers/auth');
const loadController = require('./controllers/load');

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";
/**
 *  App Configuration
 */
app.set('view engine', 'hbs');
/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
  res.status(200).send("Sections Widget Home"); // maybe unnecessary
});

app.get('/auth', authController);
app.get('/load', loadController);
/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
