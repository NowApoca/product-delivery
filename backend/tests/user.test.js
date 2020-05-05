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
})

client.connect()

describe(" User Testing", () => {
    it("Create user", async () => {
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
        const newUserDB = (await client.query("SELECT* from enduser WHERE email = $1;",[
            email
        ])).rows;
        expect(newUserDB.length).toEqual(1)
        expect(newUserDB[0].permissions).toEqual(newUser.permissions)
        expect(newUserDB[0].menus).toEqual(newUser.menus)
        expect(newUserDB[0].email).toEqual(newUser.email)
        expect(newUserDB[0].name).toEqual(newUser.name)
        expect(newUserDB[0].surname).toEqual(newUser.surname)
        expect(newUserDB[0].password.length).toEqual(60)
        expect(newUserDB[0].addresses).toEqual(newUser.addresses)
        expect(newUserDB[0].phoneNumber).toEqual(newUser.phoneNumber)
    });

    it("Create user duplicated email", async () => {
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
        const newUser2 =  {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: "UNIT2",
            surname: "TEST2",
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 12452522
        };
        const resultCreateUser2 = await handleAsyncError( post(settings.url + settings.port + "/user", {userData: newUser2}) )
        expect(resultCreateUser2.error).toEqual(errors.userMailAlreadyExist)
        expect(resultCreateUser2.info).toEqual(messages[resultCreateUser2.error] + email)
    });

    it("Log user", async () => {
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
    });

    it("Create a product", async () => {
        const resultLogUser = await post(settings.url + settings.port + "/user/log", {
            email: config.admin.email,
            password: config.admin.password
        })
        expect(resultLogUser.data.user.email).toEqual(config.admin.email)
        expect(resultLogUser.data.token.length).toEqual(36)
        const productID = uuid();
        const productName = uuid();
        const newProduct =  {
            id: productID,
            name: productName,
            type: constants.productTypes[0],
            price: 6,
            additionalOptions: [],
            description: "Test product",
            image: "" 
        };
        const resultCreateUser = await post(settings.url + settings.port + "/product", {product: newProduct})
        expect(resultCreateUser.data.error).toEqual(errors.noError)
    });
})