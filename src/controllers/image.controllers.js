const catchError = require('../utils/catchError');
const Image = require('../models/Image');

const getAll = catchError(async(req, res) => {
    const result = await Image.findAll()
    return res.status(200).json(result.body)
});

module.exports = {
    getAll
}