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
    xit("Create user", async () => {
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

    xit("Create user duplicated email", async () => {
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

    xit("Log user", async () => {
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

    xit("Create a product", async () => {
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
            description: "Test product description",
            image: "image of the product"
        };
        const resultCreateProduction = await post(settings.url + settings.port + "/product", {productData: newProduct, token: resultLogUser.data.token})
        expect(resultCreateProduction.data.error).toEqual(errors.noError)
        const productDB = await client.query("SELECT* from product WHERE product_id = $1;",[
            productID 
        ])
        expect(productDB.rows[0].product_id).toEqual(productID)
        expect(productDB.rows[0].name).toEqual(newProduct.name)
        expect(productDB.rows[0].type).toEqual(newProduct.type)
        expect(productDB.rows[0].price).toEqual(newProduct.price)
        expect(productDB.rows[0].additionalOptions).toEqual(newProduct.additionalOptions)
        expect(productDB.rows[0].description).toEqual(newProduct.description)
        expect(productDB.rows[0].image).toEqual(newProduct.image)
    });

    it("Create a product and get products filter by none", async () => {
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
            description: "Test product description",
            image: "image of the product"
        };
        const resultCreateProduction = await post(settings.url + settings.port + "/product", {productData: newProduct, token: resultLogUser.data.token})
        expect(resultCreateProduction.data.error).toEqual(errors.noError)
        const productDB = await client.query("SELECT* from product WHERE product_id = $1;",[
            productID 
        ])
        expect(productDB.rows[0].product_id).toEqual(productID)
        expect(productDB.rows[0].name).toEqual(newProduct.name)
        expect(productDB.rows[0].type).toEqual(newProduct.type)
        expect(productDB.rows[0].price).toEqual(newProduct.price)
        expect(productDB.rows[0].additionalOptions).toEqual(newProduct.additionalOptions)
        expect(productDB.rows[0].description).toEqual(newProduct.description)
        expect(productDB.rows[0].image).toEqual(newProduct.image)
        const resultGetProduction = await get(settings.url + settings.port + "/product", {headers: {filters: JSON.stringify([{column: "product_id", value: productID}])} })
        expect(resultGetProduction.data[0].product_id).toEqual(productID)
    });
})