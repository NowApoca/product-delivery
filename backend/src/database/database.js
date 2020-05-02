const Client = require("pg").Client

let client;

async function initialize(settings){
    client = new Client({
        user: settings.user,
        password: settings.password,
        database: settings.database,
        port: settings.port,
        host: settings.host,
    })
    await createTables();
    client.connect()
}

const insertStrings = {
    user:'CREATE TABLE user (\
            "token" varchar(64),\
            "permissions" varchar(64)[],\
            "menus" varchar(64)[],\
            "email" varchar(64),\
            "name" varchar(64),\
            "surname" varchar(64),\
            "bornDate" date,\
            "password" varchar(64),\
            "addresses" varchar(64)[],\
            "phoneNumber" varchar(64)\
        );',
    product:'CREATE TABLE product (\
        "id" varchar(64),\
        "name" varchar(64),\
        "type" varchar(64),\
        "price" integer,\
        "additionalOptions" varchar(64)[],\
        "description" varchar(64),\
        "image" varchar(64)\
        );',
    item:'CREATE TABLE item (\
            "id" integer,\
            "product" integer,\
            "creation" date,\
            "finishDay" date,\
            "optionsSelected" varchar(64)[],\
            "status" varchar(64)\
        );',
    order:'CREATE TABLE order (\
            "id"         integer,\
            "employeeOnCharge"    varchar(64)[],\
            "creation"         date,\
            "finishDay"    date,\
            "totalPrice"         integer,\
            "items"    int REFERENCES item (item_id) ON UPDATE CASCADE,\
            "status"         integer,\
            "address"        varchar(64)\
        );'
}

async function createTables(){
    const query = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type= 'BASE TABLE' ;");
    for(const table of tables){
        const index = query.rows.findIndex(obj => obj.table_name === table);
        if(index < 0){
            await client.query(insertStrings[table]);
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