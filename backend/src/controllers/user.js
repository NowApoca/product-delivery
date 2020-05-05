const getClient = require("../database/database").getClient
const constants = require("./config").constants
const uuid = require("uuid").v4
const { handleErrorAsync } = require("../common/common")
const bcrypt = require("bcrypt");
const {errors} = require("../common/errors")

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
    } = res.locals.user;
    if((await client.query('SELECT email from enduser WHERE email = $1;', [email] )).rows.length > 0){
        throw new Error(JSON.stringify({status: 400, error: errors.userMailAlreadyExist, info: email}))
    }
    const hashedPassword = await hashPassword(password)
    await client.query('INSERT INTO enduser (permissions, menus, email, name, surname, "bornDate", password, addresses, "phoneNumber") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);', [permissions,
        menus,
        email,
        name,
        surname,
        bornDate,
        hashedPassword,
        addresses,
        phoneNumber]
    );
    res.status(200).json({error: errors.noError})
}

async function hashPassword(password){
    const salt = await bcrypt.genSalt(constants.saltRounds);
    return await bcrypt.hash(password, salt);
}

async function log(req, res){
    const { user } = res.locals;
    const client = getClient()
    const token = uuid()
    await client.query("UPDATE enduser SET token = $1 WHERE email = $2", [token, user.email]);
    res.status(200).json({token, user: normalizeUser(user) })
}

function normalizeUser(user){
    return {
        permissions: user.permissions,
        menus: user.menus,
        email: user.email,
        name: user.name,
        surname: user.surname,
        bornDate: user.bornDate,
        addresses: user.addresses,
        phoneNumber: user.phoneNumber
    }
}

module.exports = {
    create: handleErrorAsync(create),
    log: handleErrorAsync(log),
    hashPassword
}
