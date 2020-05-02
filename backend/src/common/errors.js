const errors = {
    noError: -1,
    isNotValidToken: 1,
    notModifyOrderPermission: 10, // permissions
    notCreateProductPermission: 11,
    userNotExist: 20, // user errors
    userNotAvailableAccount: 21,
    userInvalidLogIn: 22,
    userMailAlreadyExist: 23,
}

module.exports = errors