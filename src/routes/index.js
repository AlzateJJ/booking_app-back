const express = require('express');
const userRouter = require('./user.route');
const cityRouter = require('./city.route');
const router = express.Router();

// colocar las rutas aquí
router.use(userRouter)
router.use(cityRouter)

module.exports = router;