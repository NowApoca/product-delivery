const getClient = require("../database/database").getClient
const constants = require("../../constants")

async function polling(){
    const client = getClient()
    const ordersInDB = await client.query("SELECT items from order WHERE status = $1", [constants.pending])
    for(const order of ordersInDB.rows){
        const itemsInDB = await client.query("SELECT status from item WHERE id = $1;", [order.items]);
        let finishedOrder = true;
        itemsInDB.rows.map((item) => {
            if(item.status != constants.finishedItem){
                finishedOrder = false;
            }
        })
        if(finishedOrder){
            await client.query("UPDATE order SET $1 WHERE id = $2;", [constants.finishedOrder, order.id]);
        }
    }
}