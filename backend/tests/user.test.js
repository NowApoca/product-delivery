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
            allowed_amount: 3,
            additionalOptions: [],
            production_type: constants.productionTypes.onDemand,
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

    xit("Create a product and get products filter by none", async () => {
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
            allowed_amount: 3,
            additionalOptions: [],
            production_type: constants.productionTypes.onDemand,
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

    xit("Create a product and get products filter by none and make an order bill", async () => {
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
            allowed_amount: 3,
            additionalOptions: [],
            production_type: constants.productionTypes.onDemand,
            description: "Test product description",
            image: "image of the product"
        };
        const resultCreateProducte = await post(settings.url + settings.port + "/product", {productData: newProduct, token: resultLogUser.data.token})
        expect(resultCreateProducte.data.error).toEqual(errors.noError)
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
        expect(resultGetProduction.data[0].product_id).toEqual(productID);
        const newOrder =  {
            items: [{product_id: productID, amount: 1, optionsSelected: []}],
            address: "address test link"
        };
        const resultCreateOrder = await post(settings.url + settings.port + "/order", {orderData: newOrder, token: resultLogUser.data.token})
        expect(resultCreateOrder.data.error).toEqual(errors.noError)
        const orderDB = await client.query("SELECT* from bill WHERE bill_id = $1;",[
            resultCreateOrder.data.bill_id
        ])
        expect(orderDB.rows.length).toEqual(1)
        expect(orderDB.rows[0].bill_id).toEqual(resultCreateOrder.data.bill_id)
        expect(orderDB.rows[0].user_email).toEqual(config.admin.email)
        expect(orderDB.rows[0].employeeOnCharge).toEqual([])
        expect(orderDB.rows[0].finishDay).toEqual(Infinity)
        expect(orderDB.rows[0].totalPrice).toEqual(newProduct.price)
        expect(orderDB.rows[0].items.length).toEqual(1)
        expect(orderDB.rows[0].status).toEqual(constants.orderStatus.initialStatus)
        expect(orderDB.rows[0].address).toEqual(newOrder.address)
        const itemDB = await client.query("SELECT* from item WHERE item_id = $1;",[
            orderDB.rows[0].items[0]
        ])
        expect(itemDB.rows[0].product).toEqual(productID)
    });
    //Error tests
    it('Create user wrong nameType',async()=>{
        const email = uuid() + "@gmail.com";
        const newUser =  {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: 1,
            surname: "TEST",
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252,
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.stringNotValidType);
        expect(resultCreateUser.info).toEqual("Nombre de usario: " + newUser.name);
    });
    
    it('Create user invalid min length',async () =>{
        const email = uuid() + "@gmail.com";
        const newUser = {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: "a",
            surname: "TEST",
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.stringNotValidLength);
        expect(resultCreateUser.info).toEqual("Nombre de usario: " + newUser.name);
    });

    it('Create user invalid max length',async () =>{
        const email = uuid() + "@gmail.com";
        const nameEr = common.getStringWithnLength(75);
        const newUser = {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: nameEr,
            surname: "TEST",
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.stringNotValidLength);
        expect(resultCreateUser.info).toEqual("Nombre de usario: " + newUser.name);
    });

    it('User creation invalid surname type',async()=>{
        const email = uuid() + "@gmail.com";
        const newUser = {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: 'UNIT2',
            surname: 1,
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.stringNotValidType);
        expect(resultCreateUser.info).toEqual("Apellido de usario: " + newUser.surname);
    });

    it('User creation invalid surname min length',async()=>{
        const email = uuid() + "@gmail.com";
        const newUser = {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: 'UNIT2',
            surname: 'a',
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.stringNotValidLength);
        expect(resultCreateUser.info).toEqual("Apellido de usario: " + newUser.surname);
    });

    it('User creation invalid surname max length',async()=>{
        const email = uuid() + "@gmail.com";
        const surnameErr = common.getStringWithnLength(75);
        const newUser = {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: 'UNIT2',
            surname: surnameErr,
            bornDate: new Date(),
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.stringNotValidLength);
        expect(resultCreateUser.info).toEqual("Apellido de usario: " + newUser.surname);
    });

    it('Create user invalid bornDate',async()=>{
        const email = uuid() + "@gmail.com";
        const surnameErr = common.getStringWithnLength(75);
        const newUser = {
            permissions: [constants.permissions.availableLog],
            menus: [constants.menus.customer],
            email,
            name: 'UNIT2',
            surname: 'TEST',
            bornDate: 'errror',
            password: uuid(),
            addresses: [],
            phoneNumber: 1245252
        };
        const resultCreateUser = await handleAsyncError( post(settings.url + settings.port + "/user", {userData:newUser}));
        expect(resultCreateUser.error).toEqual(errors.dateNotValid);
        expect(resultCreateUser.info).toEqual("Fecha de nacimiento: " + newUser.bornDate);
    });
    xit('Create User phonenumber invalid')
})