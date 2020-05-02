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
    const client = getClient();
    const {
        token,
        items,
        address,
    };
    const userInDB = await client.query('SELECT token from user WHERE token = $1;',[token]);
    if(userInDB.rows.length ==0){
        throw new Error({})
    };
    if(userInDB.rows[0].permissions.indexOf(constants.availableAccount)<0){
        throw new Error({})
    }
    const employeeOnCharge = '';
    const creation = new Date();
    let totalPrice = 0;
    const itemsToPush = [];
    items.map(function(item){
        totalPrice += item.price;
        itemsToPush.push({
            product: item.product,
            creation: new Date(),
            deleteDay: Infinity,
            optionsSelected: item.optionsSelected,
            status: constants.pendingToTake
        })
    })
    const finish = Infinity;
    const status = constants.initialStatus;
    await client.query("INSERT INTO item (product, creation, deleteDay, optionsSelected, status) VALUE $1 ", itemsToPush())
    await client.query('INSERT INTO order (employeeOnCharge,finish,totalPrice,items,status,address) VALUES $1;',[
        id,
        employeeOnCharge,
        creation,
        finish,
        totalPrice,
        items,
        status,
        address
    ]);
    res.status(200);
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

async function assignEmployee(req, res){
    const client = getClient();
    const { orderID, token } = res.locals;
    const userInDB = await client.query("SELECT email FROM user WHERE token = $1;", [token]);
    if(userInDB.rows.length == 0){
        throw new Error()
    }
    if(userInDB.rows.permissions.indexOf(constants.carryOrder) < 0){
        if(newStatus != constants.cancel){
            throw new Error("No podes llevar a cabo una orden")
        }
    }
    const orderInDB = await client.query("SELECT id FROM order WHERE id = $1;", [orderID]);
    if(orderInDB.rows.length == 0){
        throw new Error()
    }
    await client.query("UPDATE order SET employee = $1 WHERE id = $2", [userInDB.rows[0].email, orderID])
    res.status(200).json();
}

module.exports = {
    getOrders,
    modifyStatus,
    create,
    modifyOrder
}