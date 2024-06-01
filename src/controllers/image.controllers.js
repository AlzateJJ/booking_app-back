const catchError = require('../utils/catchError');
const Image = require('../models/Image');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

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

const remove = catchError( async (req, res) => {
    const { id } = req.params
    const imageToDelete = await Image.findByPk(id)
    if (!imageToDelete) return res.status(404).json({message: "image not found ://"})
    await deleteFromCloudinary(imageToDelete.url)
    await imageToDelete.destroy()
    return res.sendStatus(204)
})

module.exports = {
    getAll,
    create,
    remove
}