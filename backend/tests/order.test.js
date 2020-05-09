const expect = require("expect")
const constants = require("../constants")
const uuid = require("uuid").v4
const {post, get, handleAsyncError} = require("./common")
const Client = require("pg").Client
const settings = require("./settings")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"))
const {errors, messages} = require("../src/common/errors")

let client = new Client({
    user: settings.dbConfig.user,
    password: settings.dbConfig.password,
    database: settings.dbConfig.database,
    port: settings.dbConfig.port,
    host: settings.dbConfig.host
});

client.connect();

describe(" Order Testing", () => {
    it('Order create',async()=>{

    })
});