const app = require('./app')
const request = require('supertest')

describe('app', () => {

  it('always returns ok', () => {
    return request(app).get('/').expect('ok')
  })

})
