const express = require('express')
const router = express.Router()
const match = require('../controllers/match')

router.get('/matches', match.getNotStartedMatches)
router.post('/match/new', match.newGame)


module.exports = router