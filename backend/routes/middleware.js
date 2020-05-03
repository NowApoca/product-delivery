const constants = require("../constants")
const errors = require("../src/common/errors")

function validateUserToken(req, res, next){
    const { token } = req.headers;
    const isValidID = isNotValidString(token , constants.tokenLength, constants.tokenLength)
    if(isValidID){
        res.status(400).json({error: errors.isNotValidToken})
        return;
    }
    next();
}

function verifyUserCreation (req,res,next){
    const userData = req.body.userData;
    //Name check
    const checkName = isNotValidString(userData.name,constants.NameMinLength,constants.NameMaxLength);
    if(checkName == errors.stringNotValidLength){
        res.status(400).json({error: errors.stringNotValidLength,info:"Nombre de usario: " + userData.name});
        return;
    }
    if(checkName == errors.stringNotValidType){
        res.status(400).json({error: errors.stringNotValidType,info : "Nombre de usuario: " + userData.name});
        return;
    }
    //surname check
    const checkSurname = isNotValidString(userData.surname,constants.SurnameMinLength,constants.SurnameMaxLength);
    if(checkSurname == errors.stringNotValidLength){
        res.status(400).json({error: errors.stringNotValidLength,info:"Apellido de usario: " + userData.surname});
        return;
    }
    if(checkSurname == errors.stringNotValidType){
        res.status(400).json({error: errors.stringNotValidType,info : "Apellido de usuario: " + userData.surname});
        return;
    }
    //email
    const checkEmail = isNotValidString(userData.email,10,60);
    if(checkEmail == errors.stringNotValidLength){
        res.status(400).json({error: errors.stringNotValidLength,info:"Mail de usario: " + userData.email});
        return;
    }
    if(checkEmail == errors.stringNotValidType){
        res.status(400).json({error: errors.stringNotValidType,info : "Mail de usuario: " + userData.email});
        return;
    }
    //bornDate
    const checkBornDate = isNotValidDate(userData.bornDate);
    if(checkBornDate == errors.dateNotValid){
        res.status(400).json({error:errors.dateNotValid,info:"Fecha de nacimiento: " + userData.bornDate});
        return;
    }
    //password
    const checkPassword = isNotValidString(userData.password,constants.PasswordMinLength,constants.PasswordMaxLength);
    if(checkPassword == errors.stringNotValidLength){
        res.status(400).json({error: errors.stringNotValidLength,info:"Password de usario: " + userData.password});
        return;
    }
    if(checkPassword == errors.stringNotValidType){
        res.status(400).json({error: errors.stringNotValidType,info : "Password de usuario: " + userData.password});
        return;
    }
    //Addresses
    const checkAddresses = isNotValidString(userData.adresses,10,60);
    if(checkAddresses == errors.stringNotValidLength){
        res.status(400).json({error: errors.stringNotValidLength,info:"Direccion  de usario: " + userData.adresses});
        return;
    }
    if(checkAddresses == errors.stringNotValidType){
        res.status(400).json({error: errors.stringNotValidType,info : "Direccion de usuario: " + userData.addresses});
        return;
    }
    //Phone Number
    const checkPhoneNumber = isNotInt(userdata.phoneNumber);
    if(checkPhoneNumber == errors.notValidInt){
        res.status(400).json({error:errors.notValidInt,info:"Numero de telefono de usuario: " + userdata.phoneNumber});
    }
    //Permissions
    //Menus
    res.locals.userData = userData;
    next();
}

/*function verifyUserLog (req,res,next){
    const userLog = req.body.userLog;
    const checkPassword = isNotValidString (userLog.password,constants.PasswordMinLength,PasswordMaxLength);
    const checkPassword = isNotValidString(userData.password,constants.PasswordMinLength,constants.PasswordMaxLength);
    if(checkPassword == errors.stringNotValidType || checkPassword == errors.stringNotValidLength){
        res.status(400).json({error: checkPassword,info:"Contraseña invalida"});
        return;
    }
}*/


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
    isNotValidDate,
    isNotValidString,
    isNotInt,
}