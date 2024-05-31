const request = require('supertest');
const app = require('../app.js');

let id
let email
let password
let token

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
    expect(result.status).toBe(201);
    id = result.body.id
    email = result.body.email
    password = newUser.password
});

test('POST /users/login debe permitir hacer log in un usuario', async () => {
    const result = await request(app).post('/users/login').send({email: email, password: password})
    expect(result.status).toBe(200);
    expect(result.body.user).toBeDefined();
    expect(result.body.user.email).toBe(email);
    expect(result.body.token).toBeDefined();
    token = result.body.token
});

test('GET /users debe traer todos los usuarios', async () => {
    const result = await request(app).get('/users').set("Authorization", `Bearer ${token}`)
    expect(result.body).toBeInstanceOf(Array);
    expect(result.status).toBe(200);
});

test('PUT /users/:id debe actualizar un usuario', async () => {
    const updatedUser = {
        firstName: "updatedUser",
        lastName: "updatedUser",
        email: "updatedUsert@gmail.com",
        password: "updatedUser",
        gender: "other"
    }
    const result = await request(app).put('/users/'+id).send(updatedUser).set("Authorization", `Bearer ${token}`)
    
    expect(result.body.id).toBeDefined();
    expect(result.status).toBe(200);
})

test('POST /users/login con credenciales incorrectas debe dar error', async () => {
    const result = await request(app)
    .post('/users/login').send({email: "incorrecto@gmail.com", password: "w"})
    .set("Authorization", `Bearer ${token}`)
    expect(result.status).toBe(401);
    expect(result.body.message).toBe("usuario no encontrado :/");
});

test('DELETE /users/:id debe eliminar un usuario', async () => {
    const result = await request(app).delete('/users/'+id).set("Authorization", `Bearer ${token}`)
    expect(result.status).toBe(204);
});