const express = require('express')
const router = express.Router()

const powerController = require('../controllers/powers')

router.post('/power', powerController.getTargetPlayers)

module.exports = router