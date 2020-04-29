// index.js
require('dotenv').config();

/**
 * Required External Modules
 */
const express = require("express");
const authController = require('./controllers/auth');
const loadController = require('./controllers/load');
const uninstallController = require('./controllers/uninstall');

/**
 * App Variables
 */
const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
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
app.get('/uninstall', uninstallController);
/**
 * Server Activation
 */
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
