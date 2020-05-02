const getClient = require("../database").getClient;
const constants = require("./config").constants

async function getOrders(req, res){
    const client = getClient();
    const { token, filters } = res.locals;
    const userInDB = await client.query("SELECT email FROM user WHERE token = $1;", [token]);
    if(userInDB.rows.length == 0){
        throw new Error()
    }
    if(userInDB.rows[0].permissions.indexOf(constants.viewAllOrders) < 0){
        filters.push({token})
    }
    const ordersInDB = await client.query("SELECT email FROM order WHERE token = $1;", [token]);
    const output = [];
    ordersInDB.rows.map((item) => {
        output.push({
            item
        })
    })
    res.status(200).json(output);
}

async function create(req, res){
    
}

async function modifyStatus(req, res){
    const client = getClient();
    const { token, orders, newStatus } = res.locals;
    const userInDB = await client.query("SELECT email FROM user WHERE token = $1;", [token]);
    if(userInDB.rows.length == 0){
        throw new Error()
    }
    if(userInDB.rows.permissions.indexOf(constants.modifyOrder) < 0){
        if(newStatus != constants.cancel){
            throw new Error(" Porque como usuario no podes hacer otra cosa que no sea cancelar")
        }
    }
    await client.query("UPDATE order SET status = $1 WHERE id = $2", [newStatus, orders])
    res.status(200).json();
}

async function modifyOrder(req, res){
    const client = getClient();
    const { token, id, newOrder } = res.locals;
    const userInDB = await client.query("SELECT email FROM user WHERE token = $1;", [token]);
    if(userInDB.rows.length == 0){
        throw new Error();
    }
    if(userInDB.rows.permissions.indexOf(constants.modifyOrder) < 0){
        throw new Error("Porque como usuario no podes hacer otra cosa que no sea cancelar");
    }
    await client.query("UPDATE order SET (employeeOnCharge, totalPrice, items, status, address) = $1  WHERE id = $2", [[newOrder.employeeOnCharge, newOrder.totalPrice, newOrder.items, newOrder.status, newOrder.address], id])
    res.status(200).json();
}

module.exports = {
    getOrders,
    modifyStatus
}