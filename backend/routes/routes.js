const express = require("express")
const router = express.Router()
const { 
    validateUserToken
    } = require("./middleware")

const eventController = require("../src/controllers/event")
const itemController = require("../src/controllers/item")
const orderController = require("../src/controllers/order")
const productController = require("../src/controllers/product")
const userController = require("../src/controllers/user")
const itemController = require("../src/controllers/item")

app.use(validateUserToken)

router.get("/order", orderController.getOrders);
router.post("/order", orderController.create);
router.patch("/order/modify/status", orderController.modifyStatus);
router.put("/order", orderController.modifyOrder);
router.put("/order/assign/employee", orderController.assignEmployee);

router.patch("/item", item.modifyStatus);
router.patch("/item,",noTenemosMiddleExportado,item.modifyItem);

router.post("/user", orderController.create);
router.post("/user/log", orderController.log);

router.get("/product", orderController.getList);
router.post("/product", orderController.create);

module.exports = router