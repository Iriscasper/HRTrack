const express = require("express")
const router = express.Router()
const scheduleController = require("../controllers/schedule.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.use(authMiddleware)

router.get("/", scheduleController.getByUser)
router.get("/:supplyId", scheduleController.getBySupply)
router.get("/:supplyId/:id", scheduleController.updateStatus)

module.exports = router
