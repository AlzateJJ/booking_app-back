const catchError = require('../utils/catchError');
const Image = require('../models/Image');
const { uploadToCloudinary } = require('../utils/cloudinary');

const getAll = catchError(async(req, res) => {
    const result = await Image.findAll()
    return res.status(200).json(result)
});

const create = catchError( async (req, res) => {
    if (!req.file) res.status(400).json({message: "debes enviar la imagen"})
    const { url } = await uploadToCloudinary(req.file)
    const { hotelId } = req.body
    const image = await Image.create({
        url: url,
        hotelId: hotelId
    })
    return res.status(201).json(image)
})

module.exports = {
    getAll,
    create
}