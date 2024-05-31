const sequelize = require('../utils/connection');
const request = require('supertest')
const app = require('../app');
const User = require('../models/User');

const main = async() => {
    try{
        // Acciones a ejecutar antes de los tests
        sequelize.sync();

        const testUser = {
            firstName: "testUser",
            lastName: "testUser",
            email: "testUser@gmail.com",
            password: "testUser",
            gender: "other"
        }

        const user = await User.findOne({ where: {email: testUser.email} })
        if (!user) {
            await request(app).post('/users').send(testUser)
        }

                
        process.exit();
    } catch(error){
        console.log(error);
    }
}

main();