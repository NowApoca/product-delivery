const expect = require("expect")
const userController = require("../src/controllers/user")

describe(" User Unit Testing", () => {

    it(" Test hash password", async () => {
        const password = "2PAC";
        const hashedPassword = await userController.hashPassword(password)
        expect(hashedPassword.length).toEqual(60)
    });

    it(" Test valid hash password", async () => {
        const password = "2PAC";
        const hashedPassword = await userController.hashPassword(password)
        expect(hashedPassword.length).toEqual(60)
        const isValidPassword = await userController.isValidPassword(password, hashedPassword)
        expect(isValidPassword).toEqual(true)
    });

    it(" Test invalid hash password", async () => {
        const password = "2PAC";
        const hashedPassword = await userController.hashPassword(password)
        expect(hashedPassword.length).toEqual(60)
        const isValidPassword = await userController.isValidPassword(password + " different Password", hashedPassword)
        expect(isValidPassword).toEqual(false)
    });

})