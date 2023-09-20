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
        await MySQLClient.connect();
        data = await MySQLClient.query(await sql("SELECT_SHOP_BASIC_BY_ID"));
        console.log(data);
    } catch (err) {
        next(err);
    } finally {
        await MySQLClient.end();
    }
    res.end("OK");
});

// Set application log
app.use(applicationlogger());

// execute web application
app.listen(PORT, () => {
    logger.application.info(`App listenning at ${PORT}`);
});