const express = require("express")
const router = express.Router()
const supplyController = require("../controllers/supply.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.use(authMiddleware)

router.get("/", supplyController.getAll)
// :id indica que id toma el valor del parámetro introducido
router.get("/:id", supplyController.getOne)

router.post("/", supplyController.create)

router.put("/:id", supplyController.update)

router.delete("/:id", supplyController.remove)

module.exports = router
