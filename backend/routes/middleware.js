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
    console.log(" ACA ", name, surname, email, password, bornDate, addresses, phoneNumber, permissions, menus)
    res.locals.user = {}
    const checkNameError = isNotValidString(name, constants.nameMinLength, constants.nameMaxLength);
    if(checkNameError){
        res.status(400).json({error: checkNameError,info:"Nombre de usario: " + name});
        return;
    }
    const checkSurnameError = isNotValidString(surname, constants.nameMinLength, constants.nameMaxLength);
    if(checkSurnameError){
        res.status(400).json({error: checkSurnameError,info:"Apellido de usario: " + surname});
        return;
    }
    const checkEmailError = isNotValidString(email, constants.emailMinLength, constants.emailMaxLength);
    if(checkEmailError){
        res.status(400).json({error: checkEmailError,info:"Mail de usario: " + email});
        return;
    }
    const checkBornDateError = isNotValidDate(bornDate);
    if(checkBornDateError){
        res.status(400).json({error: checkBornDateError,info:"Fecha de nacimiento: " + bornDate});
        return;
    }
    const checkPasswordError = isNotValidString(password, constants.passwordMinLength, constants.passwordMaxLength);
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
        const checkAddressError = isNotValidString(address, constants.linkMinLength, constants.linkMaxLength);
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

function verifyProductCreation (req,res,next){
    const { id, name, type, price, additionalOptions, description, image } = req.body.productData;
    const checkIdError = isNotValidString(id, constants.productIDMinLength,  constants.productIDMaxLength);
    if(checkIdError){
        res.status(400).json({error: checkIdError, info: id});
        return;
    }
    const checkNameError = isNotValidString(name, constants.nameMinLength, constants.nameMaxLength);
    if(checkNameError){
        res.status(400).json({error: checkNameError, info: name});
        return;
    }
    if(constants.productTypes.indexOf(type) < 0){
        res.status(400).json({error: errors.productTypeNotExist, info: type });
        return;
    }
    const checkPriceInt = isNotInt(price)
    if(checkPriceInt){
        res.status(400).json({error: errors.notValidInt, info: price });
        return;
    }
    const checkDescriptionError = isNotValidString(description, constants.descriptionMinLength, constants.descriptionMaxLength);
    if(checkDescriptionError){
        res.status(400).json({error: checkDescriptionError, info: description});
        return;
    }
    const checkImageError = isNotValidString(image, constants.linkMinLength, constants.linkMaxLength);
    if(checkImageError){
        res.status(400).json({error: checkImageError, info: image});
        return;
    }
    if(!Array.isArray(additionalOptions) || additionalOptions.length != 0){
        res.status(400).json({error: errors.notValidArray, info: additionalOptions});
        return;
    }
    res.locals.product = {};
    res.locals.product.id = sanitize(id);
    res.locals.product.name = sanitize(name);
    res.locals.product.type = sanitize(type);
    res.locals.product.price = price;
    res.locals.product.additionalOptions = additionalOptions;
    res.locals.product.description = sanitize(description);
    res.locals.product.image = sanitize(image);
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
    if(!isNaN(value) &&  parseInt(Number(value)) == value && !isNaN(parseInt(value, 10))){
      return;
    }
    return errors.notValidInt;
}
  
async function requireCreateProduct(req, res, next){
    const { user } = res.locals;
    if(user.permissions.indexOf(constants.permissions.createProduct) < 0){
        res.status(400).json({error: errors.notAllowedUser, info: messages[errors.userInvalidLog]});
        return;
    }
    next();
}

async function requireVerifyToken(req, res, next){
    const { token } = req.body;
    const checkValidToken = isNotValidString(token, constants.tokenMinLength,  constants.tokenMaxLength);
    if(checkValidToken){
        res.status(400).json({error: errors.notValidToken, info: messages[errors.userInvalidLog]});
        return;
    }
    const client = getClient();
    const userDB = await client.query("SELECT* from enduser WHERE token = $1;",[
        token
    ]);
    if(userDB.rows.length == 0){
        res.status(400).json({error: errors.notValidToken, info: messages[errors.userInvalidLog]});
        return;
    }
    res.locals.user = userDB.rows[0];
    next();
}

async function validateFilters(req, res, next){
    const { filters } = req.headers;
    const filtersFromHeader = JSON.parse(filters)
    const processedFilters = [];
    filtersFromHeader.map((filter) => {
        if(filter.column && filter.value){
            processedFilters.push({
                column: filter.column,
                value: filter.value
            })
        }
    });
    res.locals.filters = processedFilters;
    next();
}

module.exports = {
    validateUserToken,
    verifyUserCreation,
    verifyProductCreation,
    verifyUserAuthentication,
    verifyUserExist,
    requireSuccessLog,
    isValidPassword,
    isNotValidDate,
    isNotValidString,
    isNotInt,
    requireCreateProduct,
    requireVerifyToken,
    validateFilters
}