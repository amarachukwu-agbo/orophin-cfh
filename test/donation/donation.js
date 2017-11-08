/**
 * Module dependencies.
 */
const supertest = require('supertest'),
  app = require('../../server'),
  { expect } = require('chai');

const server = supertest(app);
const loginUrl = '/api/auth/login';
const token = [];
let data;

describe('User Donations', () => {
  beforeEach(() => {
    data = {
      auth: {
        password: 'password',
        email: 'test@test.com',
      }
    };
  });
  it('should return 200 for succesful login', (done) => {
    server.post(loginUrl)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
        expect(res.body.message).to.equal('login successful');
        expect(res.body.user._id).to.be.a('string');
        token[0] = res.body.token;
        done();
      });
  });
  it('should return a message if user has not made any donations', (done) => {
    server
      .get('/api/donations')
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-access-token', token[0])
      .set('Content-Type', 'application/json')
      .type('form')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('User has not made any donations');
        if (err) return done(err);
        done();
      });
  });
});
