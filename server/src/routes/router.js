const router = require('express').Router();

// We import all the game routers
const userRouter = require('./user')
const matchRouter = require('./match')
const powerRouter = require('./power')

// and use them in the router
router.use(userRouter)
router.use(matchRouter)
router.use(powerRouter)

module.exports = router;