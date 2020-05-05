const errors = {
    noError: -1,
    // permissions
    notModifyOrderPermission: 10, 
    notCreateProductPermission: 11,
     // user errors
    userNotExist: 20,
    userNotAvailableAccount: 21,
    userInvalidLogIn: 22,
    userMailAlreadyExist: 23,
    productTypeNotExist: 30,
    //General errors
    stringNotValidLength:80,
    stringNotValidType:81,
    dateNotValid:82,
    notValidInt: 83,
    notValidToken: 84,
    notValidArray: 85,
    permissionNotExist: 86,
    menuNotExist: 87,
    notAllowedUser: 88
}

const messages = {
    "23": "La dirección de correo ingresada ya existe: "
}

module.exports = {
    errors,
    messages
}