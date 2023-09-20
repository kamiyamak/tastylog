const log4js = require("log4js");
const config = require("../../config/log4js.config.js");
var console;

log4js.configure(config);

// console logger
console = log4js.getLogger();

module.exports = {
    console
};