const express = require('express')
const router = express.Router()
const user = require('../controllers/user.js')

// add middleware
// router.use('/whoami', user.verifyToken)

router.get('/users', user.getUsers)

// login end point
router.post('/user/authenticate', user.authenticateUser)
// register end point
router.post('/user/register', user.registerUser)

module.exports = router