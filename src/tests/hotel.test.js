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

test('GET /hotels debe traer todos los hoteles', async () => {
    result = await request(app).get('/hotels')
    expect(result.body).toBeInstanceOf(Array);
    expect(result.status).toBe(200);
});

test('POST /hotels debe crear un hotel', async () => {
    const newHotel= {
        name: "hotelTest",
        description: "hotelDescriptionTest",
        price: 100,
        address: "addressHotelTest",
        lat: 111.2345,
        lon: -444.42342,
        // cityId: 1 // no es obligatorio
    }
    const result = await request(app).post('/hotels').send(newHotel).set("Authorization", `Bearer ${token}`)
    expect(result.status).toBe(201);
    expect(result.body.id).toBeDefined();
    expect(result.body.name).toBe(newHotel.name);
    id = result.body.id
});

test('GET /hotel/:id debe traer un hotel', async () => {
    result = await request(app).get('/hotels/'+id)
    expect(result.status).toBe(200);
});

test('DELETE /hotels/:id debe eliminar un hotel', async () => {
    const result = await request(app).delete(`/hotels/${id}`).set("Authorization", `Bearer ${token}`)
    expect(result.status).toBe(204);
});