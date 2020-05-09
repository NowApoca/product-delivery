const expect = require("expect")
const constants = require("../constants")
const uuid = require("uuid").v4
const {post, get, handleAsyncError} = require("./common")
const Client = require("pg").Client
const settings = require("./settings")
const fs = require("fs")
const config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"))
const {errors, messages} = require("../src/common/errors")
const common = require ('./common');

let client = new Client({
    user: settings.dbConfig.user,
    password: settings.dbConfig.password,
    database: settings.dbConfig.database,
    port: settings.dbConfig.port,
    host: settings.dbConfig.host
})

client.connect()
describe(" Order Testing", () => {
    it('Get order invalid token',async()=>{
        const email = uuid() + "@gmail.com";
        const newUser =  {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: "UNIT",
            surname: "TEST",
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await post(settings.url + settings.port + "/user", {userData: newUser})
        expect(resultCreateUser.data.error).toEqual(errors.noError)
        const resultLogUser = await post(settings.url + settings.port + "/user/log", {
            email,
            password: newUser.password
        })
        expect(resultLogUser.data.user.email).toEqual(email)
        expect(resultLogUser.data.token.length).toEqual(36)
        const tokenErr = "error";
        const userInDB = await client.query("SELECT email FROM user WHERE token = $1;", [tokenErr]);
        expect(userInDB.error).toEqual(errors.InvalidToken);
    });
});