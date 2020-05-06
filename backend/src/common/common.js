const getClient = require("../database/database").getClient
const {messages} = require("./errors")

function handleErrorAsync(asyncRouteHandler) {
    const client = getClient()
	return async (req, res, next) => {
        await client.query("BEGIN")
    try{
        await asyncRouteHandler(req, res, next)
    }catch(e){
        const errorMessage = JSON.parse(e.message);
        await client.query("ROLLBACK")
        if(errorMessage.status === undefined){
            res.status(400).json({ error: e.stack, info: e})
        }else{
            res.status(errorMessage.status).json({ error: errorMessage.error, info: messages[errorMessage.error] + errorMessage.info})
        }
        return;
    }
    await client.query("COMMIT")
	};
}

function getFilterQuery(filters, table){
    let query = "SELECT* from "+ table;
    const filterLength = filters.length;
    const values = [];
    if(filters.length > 0){
      query += " WHERE "
    }
    filters.map((filter, index) => {
      query += '"' + filter.column + '" = $' + (index + 1) 
      if(filterLength != index + 1){
        query += " AND "
      }
      values.push(filter.value)
    })
    query += ";";
    return {
        query,
        values};
}

module.exports = {
    handleErrorAsync,
    getFilterQuery
}