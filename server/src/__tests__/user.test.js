const app = require('../server')
const request = require('supertest')

describe('GET /users', () => {
  test('Test if get users works', async () => {
    const response = await request(app)
      .get('/users')
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toBe('Returning users')
  })
})

// describe('POST /user/authenticate', () => {
//     test('Test if the user have the correct token', async () => {
//         const userData = {
//             username : 'a',
//             password : 'a'
//         }
//         const response = await request(app)
//             .post('/users')
//             .send(userData)

//       expect(response.statusCode).toBe(200)
//       expect(response.body).toHaveProperty('id')
//       expect(response.body).toHaveProperty('token')
//     })
//   })

// describe('POST /user/register', () => {
// test('Test if the user is correctly registred', async () => {
//     const userData = {
//         username : 'test',
//         password : 'test'
//     }
//     const response = await request(app)
//         .post('/users')
//         .send(userData)

//     expect(response.statusCode).toBe(200)
// })
// })