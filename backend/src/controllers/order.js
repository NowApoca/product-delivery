const getClient = require("../database/database").getClient;
const constants = require("./config").constants
const uuid = require("uuid").v4
const {errors} = require("../common/errors")

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
    const { order, user} = res.locals;
    const employeeOnCharge = [];
    const creation = new Date();
    let totalPrice = 0;
    const itemsToPush = [];
    const itemsIDs = [];
    order.items.map(function(item){
        console.log(item)
        if(item.production_type == constants.productionTypes.onDemand){
            totalPrice += item.price;
            const itemID = uuid();
            itemsIDs.push(itemID)
            itemsToPush.push({
                item_id: itemID,
                product_id: item.product_id,
                creation: new Date(),
                deleteDay: Infinity,
                optionsSelected: item.optionsSelected,
                status: constants.pendingToTake,
                price: item.price
            })
            return;
        }
    })
    const finish = Infinity;
    const status = constants.orderStatus.initialStatus;
    await Promise.all(itemsToPush.map( async (item) => {
        await client.query('INSERT INTO item (item_id,product,price,creation,"finishDay","optionsSelected",status) VALUES ($1,$2,$3,$4,$5,$6,$7);', [
            item.item_id,
            item.product_id,
            item.price,
            item.creation,
            item.deleteDay,
            item.optionsSelected,
            item.status
        ])
    }))
    const bill_id = uuid()
    console.log(bill_id,
        user.email,
        employeeOnCharge,
        creation,
        finish,
        totalPrice,
        itemsIDs,
        status,
        order.address)
    await client.query('INSERT INTO bill (bill_id, user_email, "employeeOnCharge",CREATION, "finishDay","totalPrice",items,status,address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);',[
        bill_id,
        user.email,
        employeeOnCharge,
        creation,
        finish,
        totalPrice,
        itemsIDs,
        status,
        order.address
    ]);
    res.status(200).json({error: errors.noError, bill_id });
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
    switch(newStatus){
        case constants.isCanceled || constants.hasArrived:
            await hasEnd(orders)
        break;
        case constants.hasDelivered:
            await hasChange(orders)
        break;
        default:
            throw new Error()
    }
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

async function hasEnd(orders){
    const finishDay = new Date();
    for(const orderID of orders){
        const orderInDB = await client.query("SELECT items from order WHERE id = $1", [orderID]);
        await client.query("UPDATE item SET (status, finishDay) VALUES ($1, $2) WHERE id = $3;", [constants.isCanceled, finishDay, orderInDB.rows[0].items],)
        await client.query("UPDATE order SET (status, finishDay) VALUES ($1, $2) WHERE id = $3;", [constants.isCanceled, finishDay, orderID],)
    }
}

async function hasChange(orders){
    for(const orderID of orders){
        const orderInDB = await client.query("SELECT items from order WHERE id = $1", [orderID]);
        await client.query("UPDATE item SET status = $1 WHERE id = $2;", [constants.hasDelivered, orderInDB.rows[0].items],)
        await client.query("UPDATE order SET status = $1 WHERE id = $2;", [constants.hasDelivered, orderID],)
    }
}

module.exports = {
    getOrders,
    modifyStatus,
    create,
    modifyOrder,
    assignEmployee
}