const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const db = require("./src/database/database")
const fs = require("fs")

async function initialize(setupFile){
    const settings = JSON.parse(fs.readFileSync(setupFile))
    await db.initialize(settings)
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    const router = require(__dirname + "/./routes/routes")
    app.use("", router);
    app.listen(settings.port)
}

initialize(process.argv[2])

module.exports = {
    initialize
}