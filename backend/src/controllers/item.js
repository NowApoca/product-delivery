


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