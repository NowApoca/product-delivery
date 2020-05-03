const getClient = require("../database/database").getClient
const constants = require("./config").constants
const uuid = require("uuid").v4
const { handleErrorAsync } = require("../common/common")
const bcrypt = require("bcrypt")

async function create(req, res){
    const client = getClient()
    const {
        permissions,
        menus,
        email,
        name,
        surname,
        bornDate,
        password,
        addresses,
        phoneNumber
    } = res.locals;
    /** Posible implementacion ante la igualdad de mails
     * if(user == null || user.rows.length != 0){
        res.status(400).json({ error: (user === null)? errors.databaseError: errors.userEmailExists, info: "Mail de usuario: " + userData.email});
        return;
    }
     */
    if((await client.query('SELECT email from user WHERE email = $1;', [email] )).rows.length > 0){
        throw new Error({})
    }
    const hashedPassword = await hashPassword(password)
    await client.query("INSERT INTO user (permissions, menus, email, name, surname, bornDate, password, addresses, phoneNumber) VALUES $1;", [permissions,
        menus,
        email,
        name,
        surname,
        bornDate,
        hashedPassword,
        addresses,
        phoneNumber]
    );
    res.status(200)
}

async function log(req, res){
    const { email, password } = res.locals;
    const userInDB = await client.query("SELECT email,password from user WHERE email = $1;", [email])
    if(userInDB.rows.length == 0){
        throw new Error();
    }
    if(!(await isValidPassword(password, userInDB.rows[0].password))){
        throw new Error();
    }
    const token = uuid()
    await client.query("UPDATE user SET token = $1 WHERE email = $2", [token, email]);
    const user = {
        permissions: userInDB.rows[0].permissions,
        menus: userInDB.rows[0].menus,
        email: userInDB.rows[0].email,
        name: userInDB.rows[0].name,
        surname: userInDB.rows[0].surname,
        bornDate: userInDB.rows[0].bornDate,
        addresses: userInDB.rows[0].addresses,
        phoneNumber: userInDB.rows[0].phoneNumber
    }
    res.status(200).json({token, user})
}

async function hashPassword(password){
    const salt = await bcrypt.genSalt(constants.saltRounds);
    return await bcrypt.hash(password, salt);
}

async function isValidPassword(password, passwordHashed){
    return await bcrypt.compare(password, passwordHashed)
}

module.exports = {
    create: handleErrorAsync(create),
    log: handleErrorAsync(log),
    hashPassword,
    isValidPassword
}
