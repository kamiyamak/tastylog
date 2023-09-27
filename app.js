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
app.get("/test", async (req, res, next) => {
    const { MySQLClient } = require("./lib/database/client.js");
    var tran;
    try {
        tran = await MySQLClient.beginTransaction();
        await tran.executeQuery(
            "UPDATE t_shop SET score=? WHERE id=?",
            [4.11, 1]
        );
        // throw new Error("Test exxception");
        await tran.commit();
        res.end("OK");
    } catch (err) {
        await tran.rollback();
        next(err);
    }
});
app.use("/search", require("./routes/search.js"));
app.use("/shops", require("./routes/shops.js"));
app.use("/", require("./routes/index.js"));

// Set application log
app.use(applicationlogger());

// execute web application
app.listen(PORT, () => {
    logger.application.info(`App listening at ${PORT}`);
});