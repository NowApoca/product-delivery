const getClient = require("../database/database").getClient


function handleErrorAsync(asyncRouteHandler) {
    const client = getClient()
	return async (req, res, next) => {
        await client.query("BEGIN")
    try{
        await asyncRouteHandler(req, res, next)
    }catch(e){
        await client.query("ROLLBACK")
        if(e.status === undefined){
            res.status(400).json({ error: e.stack, info: e})
        }else{
            res.status(e.status).json({ error: e.error, info: e.info})
        }
        return;
    }
    await client.query("COMMIT")
	};
}

module.exports = {
    handleErrorAsync
}