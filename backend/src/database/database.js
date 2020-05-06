const Client = require("pg").Client
const bcrypt = require("bcrypt");
const constants = require("../controllers/config").constants

let client;

async function initialize(settings){
    client = new Client({
        user: settings.dbConfig.user,
        password: settings.dbConfig.password,
        database: settings.dbConfig.database,
        port: settings.dbConfig.port,
        host: settings.dbConfig.host,
    })
    client.connect()
    await createTables(settings);
}

const insertStrings = {
    enduser:'CREATE TABLE enduser (\
            "token" varchar(64),\
            "permissions" varchar(64)[],\
            "menus" varchar(64)[],\
            "email" varchar(64),\
            "name" varchar(64),\
            "surname" varchar(64),\
            "bornDate" date,\
            "password" varchar(64),\
            "addresses" varchar(64)[],\
            "phoneNumber" integer\
        );',
    product:'CREATE TABLE product (\
        "product_id" varchar(64),\
        "name" varchar(64),\
        "type" varchar(64),\
        production_type varchar(64),\
        "price" integer,\
        allowed_amount integer,\
        "additionalOptions" varchar(64)[],\
        "description" varchar(64),\
        "image" varchar(64)\
        );',
    item:'CREATE TABLE item (\
            "item_id" varchar(64),\
            "product" varchar(64),\
            "price" integer,\
            "creation" date,\
            "finishDay" date,\
            "optionsSelected" varchar(64)[],\
            "status" varchar(64)\
        );',
    bill:'CREATE TABLE bill (\
            "bill_id"         varchar(64),\
            "user_email"         varchar(64),\
            "employeeOnCharge"    varchar(64)[],\
            "creation"         date,\
            "finishDay"    date,\
            "totalPrice"         integer,\
            "items"    varchar(64)[],\
            "status"         varchar(64),\
            "address"        varchar(64)\
        );'
}

async function createTables(settings){
    const tables = Object.keys(insertStrings);
    const query = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type= 'BASE TABLE' ;");
    for(const table of tables){
        const index = query.rows.findIndex(obj => obj.table_name === table);
        if(index < 0){
            await client.query(insertStrings[table]);
            if(table == "enduser"){
                const salt = await bcrypt.genSalt(constants.saltRounds);
                const hashedPassword = await bcrypt.hash(settings.admin.password, salt);
                await client.query('INSERT INTO enduser (permissions, menus, email, name, surname, "bornDate", password, addresses, "phoneNumber") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);',[
                    Object.keys(constants.permissions),
                    Object.keys(constants.menus),
                    settings.admin.email,
                    settings.admin.name,
                    settings.admin.surname,
                    settings.admin.bornDate,
                    hashedPassword,
                    settings.admin.addresses,
                    settings.admin.phoneNumber
                ])
            }
        }
    }
}

function getClient(){
    return client;
}

module.exports = {
    initialize,
    getClient
}