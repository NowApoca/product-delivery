const getClient = require ("../database").getClient;
const constants = require ("../config").constants;

async function modifyStatus(req, res){
    const client = getClient();
    const { token, id, newStatus } = res.locals;
    const userInDB = await client.query("SELECT email FROM user WHERE token = $1;", [token]);
    if(userInDB.rows.length == 0){
        throw new Error({})
    }
    if(userInDB.rows.permissions.indexOf(constants.modifyItem) < 0){
        throw new Error({})
    };
    const itemStatus = await client.query('SELECT id FROM item where id = $1;',[id]);
    await client.query("UPDATE item SET status = $1 WHERE id = $2", [newStatus, id]);
    res.status(200).json();
}

async function modifyItem (req, res){
    const client = getClient();
    const {token,id,newOptions} = res.locals;
    const userInDB = await client.query('SELECT email from user where token=$1;',[token]);
    if(userInDB.rows.length<0){
        throw new Error({})
    };
    const itemStatus = await client.query('SELECT id FROM item where id = $1;',[items.id]);
    if(itemStatus.rows.status != constants.inProgress){
        throw new Error("Ya no es posible cambiar el item");
    };
    await client.query("UPDATE item SET optionsSelected = $1 WHERE id = $2", [newOptions, items]);
    res.status(200).json();
}