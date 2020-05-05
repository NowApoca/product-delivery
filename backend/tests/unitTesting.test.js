const expect = require("expect")
const {hashPassword} = require("../src/controllers/user")
const {isValidPassword} = require("../routes/middleware")

describe(" User Unit Testing", () => {

    it(" Test hash password", async () => {
        const password = "2PAC";
        const hashedPassword = await hashPassword(password)
        expect(hashedPassword.length).toEqual(60)
    });

    it(" Test valid hash password", async () => {
        const password = "2PAC";
        const hashedPassword = await hashPassword(password)
        expect(hashedPassword.length).toEqual(60)
        const isValidPasswordResult = await isValidPassword(password, hashedPassword)
        expect(isValidPasswordResult).toEqual(true)
    });

    it(" Test invalid hash password", async () => {
        const password = "2PAC";
        const hashedPassword = await hashPassword(password)
        expect(hashedPassword.length).toEqual(60)
        const isValidPasswordResult = await isValidPassword(password + " different Password", hashedPassword)
        expect(isValidPasswordResult).toEqual(false)
    });

})