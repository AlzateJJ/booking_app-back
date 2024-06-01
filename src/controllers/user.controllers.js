const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { firstName, lastName, email, password, gender } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await User.create({
        firstName,
        lastName,
        email,
        gender,
        password: hashedPassword
    });
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, gender } = req.body
    const result = await User.update({
        firstName,
        lastName,
        email,
        gender,
    }, { where: {id}, returning: true });
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const { email, password } = req.body
    const userCreated = await User.findOne({where: { email: email }})
    if (!userCreated) return res.status(401).json({message: "usuario no encontrado :/"})
    const isValid = await bcrypt.compare(password, userCreated.password)
    if (!isValid) return res.status(401).json({message: "contraseña incorrecta :("})

    const accessToken = jwt.sign(
		{ user: userCreated }, // payload
		process.env.TOKEN_SECRET, // clave secreta
		{ expiresIn: '1d' } // OPCIONAL: Tiempo en el que expira el token
    )
    return res.json({user: userCreated, token: accessToken}).status(202)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}