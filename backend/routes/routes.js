const express = require("express")
const router = express.Router()
const { 
    middleWareQUeSeEjecutaSiempre,
    noTenemosMiddleExportado
    } = require("./middleware")

const eventController = require("../src/controllers/event")
const itemController = require("../src/controllers/item")
const orderController = require("../src/controllers/order")
const productController = require("../src/controllers/product")
const userController = require("../src/controllers/user")

app.use(middleWareQUeSeEjecutaSiempre)

router.get("/order", noTenemosMiddleExportado, orderController.getOrders);
router.post("/order", noTenemosMiddleExportado, orderController.create);
router.patch("/order", noTenemosMiddleExportado, orderController.modifyStatus);
router.put("/order", noTenemosMiddleExportado, orderController.modifyOrder);

router.post("/user", noTenemosMiddleExportado, orderController.create);
router.post("/user/log", noTenemosMiddleExportado, orderController.log);

router.get("/product", noTenemosMiddleExportado, orderController.getList);
router.post("/product", noTenemosMiddleExportado, orderController.create);

module.exports = router