const express = require("express")
const router = express.Router()

const gamesController = require('../controllers/games.controller')

router.get("/", gamesController.getAll)
router.get("/:id", gamesController.getById)
router.post("/", gamesController.create)
router.put("/:id", gamesController.updateById)
router.delete("/:id", gamesController.deleteById)

module.exports = router