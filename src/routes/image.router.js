const { getAll } = require('../controllers/image.controllers');
const express = require('express');

const imageRouter = express.Router();

imageRouter.route('/images')
    .get(getAll)

imageRouter.route('/images/:id')
    .get(getAll) // falta el controller

module.exports = imageRouter;