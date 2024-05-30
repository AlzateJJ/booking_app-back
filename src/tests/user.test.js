const request = require('supertest');
const app = require('../app.js');

let id
let email
let password

test('GET /users debe traer todos los usuarios', async () => {
    const result = await request(app).get('/users')
    expect(result.body).toBeInstanceOf(Array);
    expect(result.status).toBe(200);
});

test('POST /users debe crear un usuario', async () => {
    const newUser = {
        firstName: "testUser",
        lastName: "testUser",
        email: "testUser@gmail.com",
        password: "testUser",
        gender: "other"
    }
    const result = await request(app).post('/users').send(newUser)
    expect(result.body.firstName).toBe(newUser.firstName);
    expect(result.body.id).toBeDefined();
    id = result.body.id
    expect(result.status).toBe(201);
});

test('PUT /users/:id debe actualizar un usuario', async () => {
    const updatedUser = {
        firstName: "updatedUser",
        lastName: "updatedUser",
        email: "updatedUsert@gmail.com",
        password: "updatedUser",
        gender: "other"
    }
    const result = await request(app).put('/users/'+id).send(updatedUser)
    email = result.body.email
    password = "testUser" // no se puede actualizar
    expect(result.body.id).toBeDefined();
    expect(result.status).toBe(200);
})

test('POST /users/login debe verificar si un user puede hacer log in', async () => {
    const result = await request(app).post('/users/login').send({email: email, password: password})
    expect(result.status).toBe(200);
    expect(result.body.user).toBeDefined();
    expect(result.body.user.email).toBe(email);
    expect(result.body.token).toBeDefined();
});

test('POST /users/login con credenciales incorrectas debe dar error', async () => {
    const result = await request(app).post('/users/login').send({email: "incorrecto@gmail.com", password: "w"})
    expect(result.status).toBe(401);
    expect(result.body.message).toBe("usuario no encontrado :/");
});

test('DELETE /users/:id debe eliminar un usuario', async () => {
    const result = await request(app).delete('/users/'+id)
    expect(result.status).toBe(204);
});