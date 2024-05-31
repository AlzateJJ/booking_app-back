const request = require('supertest');
const app = require('../app.js');

let token
let id

beforeAll(async () => {
    const credentials = { 
        email: "testUser@gmail.com",
        password: "testUser"
    }
    const result = await request(app).post('/users/login').send(credentials)
    token = result.body.token
})

test('GET /cities debe traer todas las ciudades', async () => {
    result = await request(app).get('/cities')
    expect(result.body).toBeInstanceOf(Array);
    expect(result.status).toBe(200);
});

test('POST /cities debe crear una ciudad', async () => {
    const newCity= {
        name: "cityTestName",
        country: "cityTestCountry",
        countryId: "ZZ"
    }
    const result = await request(app).post('/cities').send(newCity).set("Authorization", `Bearer ${token}`)
    expect(result.status).toBe(201);
    expect(result.body.id).toBeDefined();
    expect(result.body.name).toBe(newCity.name);
    id = result.body.id
});

test('DELETE /cities/:id debe eliminar una ciudad', async () => {
    const result = await request(app).delete(`/cities/${id}`).set("Authorization", `Bearer ${token}`)
    expect(result.status).toBe(204);
});