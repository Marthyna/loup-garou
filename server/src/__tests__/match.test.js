// const app = require('../server')
// const request = require('supertest')

// describe('GET /matches', () => {
//   test('Test if get matches works', async () => {
//     const response = await request(app)
//       .get('/matches')
//     expect(response.statusCode).toBe(200)
//     })
// })

// describe('POST /match/new', () => {
//     test('Test if the game is correctly created', async () => {
//         const gameData = {
//             name : 'firstgame',                  
//             minNbParticipants : 6,           
//             maxNbParticipants : 6,        
//             nightDuration : 3,           
//             dayDuration :  2,         
//             startDate :  new Date(2023,5,16, 8,30,0),                    
//             werewolfProp : 0.3,               
//             contaminationProb : 0,          
//             insomniaProb   :  0.2,           
//             clairvoyanceProb:  0.4,             
//             psychicProb : 0
//         }
//         const response = await request(app)
//             .post('/users')
//             .send(gameData)

//       expect(response.statusCode).toBe(200)
//       expect(response.body).toHaveProperty('gameId')
//     })
//   })
