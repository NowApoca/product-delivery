module.exports = {
    saltRounds: 10,
    nameMaxLength : 40,
    nameMinLength : 2,
    surnameMaxLength: 50,
    surnameMinLength: 2,
    passwordMinLength: 2,
    passwordMaxLength: 60,
    emailMinLength: 8,
    emailMaxLength: 60,
    linkMinLength: 1,
    linkMaxLength: 100,
    tokenMinLength: 36,
    tokenMaxLength: 36,
    productIDMinLength: 2,
    productIDMaxLength: 40,
    descriptionMinLength: 10,
    descriptionMaxLength: 500,
    permissions: {
        availableLog: "available",
        createProduct: "createProduct"
    },
    menus: {
        customer: "customer"
    },
    productTypes: [
        "food"
    ]
}