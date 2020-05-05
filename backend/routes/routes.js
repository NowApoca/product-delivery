const express = require("express")
const router = express.Router()
const { 
    verifyUserCreation,
    verifyProductCreation,
    verifyUserAuthentication,
    verifyUserExist,
    requireSuccessLog,
    requireCreateProduct,
    requireVerifyToken
    } = require("./middleware")

const eventController = require("../src/controllers/event")
const itemController = require("../src/controllers/item")
const orderController = require("../src/controllers/order")
const productController = require("../src/controllers/product")
const userController = require("../src/controllers/user")

router.get("/order", orderController.getOrders);
router.post("/order", orderController.create);
router.patch("/order/modify/status", orderController.modifyStatus);
router.put("/order", orderController.modifyOrder);
router.put("/order/assign/employee", orderController.assignEmployee);

router.patch("/item", itemController.modifyStatus);
router.patch("/item,",itemController.modifyItem);

router.post("/user", verifyUserCreation, userController.create);
router.post("/user/log", verifyUserAuthentication, verifyUserExist, requireSuccessLog, userController.log);

router.get("/product", productController.getList);
router.post("/product", requireVerifyToken, requireCreateProduct, verifyProductCreation, productController.create);

module.exports = router