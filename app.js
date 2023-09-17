const PORT = process.env.PORT;
const express = require("express");
const app = express();

app.get("/", (req,res) => {
    res.end("Hello, world");
});

app.listen(PORT, () => {
    console.log(`App listenning at ${PORT}`);
});