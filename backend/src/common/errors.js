const errors = {
    noError: -1,
    isNotValidToken: 1,
    // permissions
    notModifyOrderPermission: 10, 
    notCreateProductPermission: 11,
     // user errors
    userNotExist: 20,
    userNotAvailableAccount: 21,
    userInvalidLogIn: 22,
    userMailAlreadyExist: 23,
    //General errors
    stringNotValidLength:80,
    stringNotValidType:81,
    dateNotValid:82,
    notValidInt: 83,
}

module.exports = errors