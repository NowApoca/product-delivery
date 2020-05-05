const constants = require("../constants")
const {errors, messages} = require("../src/common/errors")
const sanitize = require("sanitizer").sanitize
const getClient = require("../src/database/database").getClient
const bcrypt = require("bcrypt");

function validateUserToken(req, res, next){
    const { token } = req.headers;
    const isValidID = isNotValidString(token , constants.tokenLength, constants.tokenLength)
    if(isValidID){
        res.status(400).json({error: errors.isNotValidToken, info: "Token: " + token})
        return;
    }
    next();
}

function verifyUserCreation (req,res,next){
    const { name, surname, email, password, bornDate, addresses, phoneNumber, permissions, menus  } = req.body.userData;
    res.locals.user = {}
    const checkNameError = isNotValidString(name,constants.nameMinLength,constants.nameMaxLength);
    if(checkNameError){
        res.status(400).json({error: checkNameError,info:"Nombre de usario: " + name});
        return;
    }
    const checkSurnameError = isNotValidString(surname,constants.SurnameMinLength,constants.SurnameMaxLength);
    if(checkSurnameError){
        res.status(400).json({error: checkSurnameError,info:"Apellido de usario: " + surname});
        return;
    }
    const checkEmailError = isNotValidString(email,10,60);
    if(checkEmailError){
        res.status(400).json({error: checkEmailError,info:"Mail de usario: " + email});
        return;
    }
    const checkBornDateError = isNotValidDate(bornDate);
    if(checkBornDateError){
        res.status(400).json({error: checkBornDateError,info:"Fecha de nacimiento: " + bornDate});
        return;
    }
    const checkPasswordError = isNotValidString(password,constants.passwordMinLength,constants.passwordMaxLength);
    if(checkPasswordError){
        res.status(400).json({error: checkPasswordError, info:"Contraseña muy larga."});
        return;
    }
    const checkAddressesError = Array.isArray(addresses);
    if(!checkAddressesError){
        res.status(400).json({error: errors.notValidArray,info:"Direcciones de usario: " + adresses});
        return;
    }
    for(const address of addresses){
        const checkAddressError = isNotValidString(address,constants.linkMinLength,constants.linkMaxLength);
        if(checkAddressError){
            res.status(400).json({error: checkAddressError, info: "Dirección inválida: " + address });
            return;
        }
    }
    const checkPhoneNumber = isNotInt(phoneNumber);
    if(checkPhoneNumber == errors.notValidInt){
        res.status(400).json({error:errors.notValidInt,info:"Numero de telefono de usuario: " + phoneNumber});
    }
    const checkPermissionsError = Array.isArray(permissions);
    if(!checkPermissionsError){
        res.status(400).json({error: errors.notValidArray,info:"Direcciones de usario: " + adresses});
        return;
    }
    for(const permission of permissions){
        if(constants.permissions[permission] < 0){
            res.status(400).json({error: errors.permissionNotExist, info: "Permiso inválido: " + permission });
            return;
        }
    }
    const checkMenusError = Array.isArray(menus);
    if(!checkMenusError){
        res.status(400).json({error: errors.notValidArray,info:"Direcciones de usario: " + adresses});
        return;
    }
    for(const menu of menus){
        if(constants.menus[menu] < 0){
            res.status(400).json({error: error.menuNotExist, info: "Menú inválido: " + menu });
            return;
        }
    }
    res.locals.user.name = sanitize(name);
    res.locals.user.surname = sanitize(surname);
    res.locals.user.email = sanitize(email);
    res.locals.user.bornDate = bornDate;
    res.locals.user.password = sanitize(password);
    res.locals.user.phoneNumber = sanitize(phoneNumber);
    res.locals.user.addresses = addresses.map((address) => { return sanitize(address) } );
    res.locals.user.permissions = permissions.map((permission) => { return sanitize(permission) } );
    res.locals.user.menus = menus.map((menu) => { return sanitize(menu) } );
    next();
}

function verifyUserAuthentication(req,res,next){
    const {email, password} = req.body;
    const checkPassword = isNotValidString (password, constants.passwordMinLength, constants.passwordMaxLength);
    if(checkPassword){
        res.status(400).json({error: checkPassword, info: messages[checkPassword]});
        return;
    }
    const checkEmail = isNotValidString (email, constants.emailMinLength, constants.emailMaxLength);
    if(checkEmail){
        res.status(400).json({error: checkEmail, info: messages[checkEmail] + email});
        return;
    }
    res.locals.password = sanitize(password);
    res.locals.email = sanitize(email);
    next()
}

async function verifyUserExist(req, res, next){
    const { email } = res.locals;
    const client = getClient()
    const userDB = await client.query("SELECT* from enduser WHERE email = $1;",[
        email
    ]);
    if(userDB.rows.length == 0){
        res.status(400).json({error: errors.userInvalidLog, info: messages[errors.userInvalidLog]});
        return;
    }
    res.locals.user = userDB.rows[0];
    next();
}

async function requireSuccessLog(req,res,next){
    const {email, password, user} = res.locals;
    if(!(await isValidPassword(password, user.password))){
        res.status(400).json({error: errors.userInvalidLog, info: messages[errors.userInvalidLog]});
        return;
    }
    next();
}

async function isValidPassword(password, passwordHashed){
    return await bcrypt.compare(password, passwordHashed)
}

function isNotValidString(stringValue, min, max){
  if(typeof stringValue !== 'string' && !(stringValue instanceof String)){
      return errors.stringNotValidType;
  }
  if(stringValue.length > max || stringValue.length < min){
      return errors.stringNotValidLength;
  }
  return;
}

function isNotValidDate(date){
    if((new Date(date)) == "Invalid Date"){
      return errors.dateNotValid;
    }
  }

  function isNotInt(value) {
    // check also if string is valid number
    if(!isNaN(value) &&  parseInt(Number(value)) == value && !isNaN(parseInt(value, 10))){
      return;
    }
    return errors.notValidInt;
  }
  

module.exports = {
    validateUserToken,
    verifyUserCreation,
    verifyUserAuthentication,
    verifyUserExist,
    requireSuccessLog,
    isValidPassword,
    isNotValidDate,
    isNotValidString,
    isNotInt,
}