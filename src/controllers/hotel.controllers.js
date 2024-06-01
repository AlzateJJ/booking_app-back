const catchError = require('../utils/catchError');
const Hotel = require('../models/Hotel');
const City = require('../models/City');
const { Op } = require('sequelize');
const Image = require('../models/Image');
const Review = require('../models/Review');

const getAll = catchError(async(req, res) => {
    const { cityId, name } = req.query
    const whereQuerys = {}
    if (Number.isInteger(+cityId)) whereQuerys.cityId = cityId
    if (name) whereQuerys.name = { [Op.iLike]: `%${name}%` }
    const results = await Hotel.findAll({
        include: [Image, City],
        where: whereQuerys,
        raw: true, // findAll devuelve instancias de sequelize, lo cual contiene info adicional a la de los hoteles, pero yo solo quiero la info de los hoteles, por lo que añado el raw
        nest: true // para que (por el raw) no salga todo plano
    });

    const hotelsWithAvgPromises = results.map(async hotel => {
        const reviews = await Review.findAll({ where: { hotelId: hotel.id }, raw: true })
        let sumRatings = 0
        reviews.forEach(review => {
            sumRatings += Number(review.rating)
        })
        return {
            ...hotel,
            average: +(sumRatings / reviews.length).toFixed(1),
            // reviews
        }
    })
    const hotelsWithAvg = await Promise.all(hotelsWithAvgPromises) // hotelsWithAvgPromises me
    // devuelve un arreglo de promesas (por el async), para que me las resuelva todas, debo
    // definir otro arreglo que me las resuelva todas, y esto lo hago con el Promise.all 

    return res.json(hotelsWithAvg);
});

const create = catchError(async(req, res) => {
    const result = await Hotel.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Hotel.findByPk(id, { include: [City, Image] });
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Hotel.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Hotel.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}