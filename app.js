const PORT = process.env.PORT;
const path = require("path");
const logger = require("./lib/log/logger.js");
const accesslogger = require("./lib/log/accesslogger.js");
const applicationlogger = require("./lib/log/applicationlogger.js");
const express = require("express");
const favicon = require("serve-favicon");
const app = express();

// express settings
app.set("view engine", "ejs");
app.disable("x-powered-by");

// Expose global method to view Engine.
app.use((req, res, next) => {
    res.locals.moment = require("moment");
    res.locals.padding = require("./lib/math/math.js").padding;
    next();
});

// static resource routing
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use("/public", express.static(path.join(__dirname, "/public")));

// Set Access Log
app.use(accesslogger());

// dynamic resource routing
app.use("/", require("./routes/index.js"));
app.use("/test", async (req, res, next) => {
    const { MySQLClient, sql } = require("./lib/database/client.js");
    var data;

    try {
        data = await MySQLClient.executeQuery(await sql("SELECT_SHOP_BASIC_BY_ID"), [1]);
        console.log(data);
    } catch (err) {
        next(err);
    }

    res.end("OK");
});

// Set application log
app.use(applicationlogger());

// execute web application
app.listen(PORT, () => {
    logger.application.info(`App listening at ${PORT}`);
});