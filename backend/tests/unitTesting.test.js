const expect = require("expect")
const {hashPassword, normalizeUser} = require("../src/controllers/user")
const {isValidPassword} = require("../routes/middleware")
const { getFilterQuery } = require("../src/common/common")

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

    it(" Test create sql query", async () => {
        const filters = [{column: "type", value: "food"}, {column: "id", value: "IDOFPRODUCT"}];
        const table = "product";
        let query = getFilterQuery(filters, table);
        expect(query).toEqual('SELECT* from product WHERE "type" = $1 AND "id" = $2;')
    });

    it(" Test create sql query without filter", async () => {
        const table = "product";
        let query = getFilterQuery([], table);
        expect(query).toEqual('SELECT* from product;')
    });

    it(" normalize user ", async () => {
        const toFormatUser = {
            permissions: ["permissions"],
            menus: ["menus"],
            email: "test email",
            name: "test name",
            surname: "test surname",
            bornDate: "1992-12-12",
            addresses: ["testStreet 123"],
            phoneNumber: 53246346,
            wrongAttribute: "filtered attribute"
        }
        let normalizedUser = normalizeUser(toFormatUser);
        expect(Object.keys(normalizedUser).indexOf("wrongAttribute")).toEqual(-1)
        expect(normalizedUser.permissions).toEqual(toFormatUser.permissions);
        expect(normalizedUser.menus).toEqual(toFormatUser.menus);
        expect(normalizedUser.email).toEqual(toFormatUser.email);
        expect(normalizedUser.name).toEqual(toFormatUser.name);
        expect(normalizedUser.surname).toEqual(toFormatUser.surname);
        expect(normalizedUser.bornDate).toEqual(toFormatUser.bornDate);
        expect(normalizedUser.addresses).toEqual(toFormatUser.addresses);
        expect(normalizedUser.phoneNumber).toEqual(toFormatUser.phoneNumber);
    });
})
