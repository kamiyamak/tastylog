const PORT = process.env.PORT;
const path = require("path");
const logger = require("./lib/log/logger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();

// express settings
app.set("view engine", "ejs");
app.disable("x-powered-by");

// static resource routing
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public")));

// dynamic resource routing
app.use("/", require("./routes/index.js"));

// Set application log
app.use(applicationlogger());

// execute web application
app.listen(PORT, () => {
    logger.application.info(`App listenning at ${PORT}`);
});