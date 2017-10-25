/* eslint no-underscore-dangle: 0 */

const app = require('../../server');

const { expect } = require('chai'),
  supertest = require('supertest');

const request = supertest(app);

let data;
const loginURl = '/api/auth/login';

describe('User login test', () => {
  beforeEach(() => {
    data = {
      auth: {
        password: 'password',
        email: 'test@test.com',
      }
    };
  });

  it('should return 200 for succesful login', (done) => {
    request.post(loginURl)
      .send(data)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.token).to.be.a('string');
        expect(res.body.message).to.equal('login successful');
        expect(res.body.user._id).to.be.a('string');
        done();
      });
  });

  it('should return 401 for wrong password', (done) => {
    const invalidData = Object.assign({}, data);
    invalidData.auth.password = 'extremely wrong password';
    request.post(loginURl)
      .send(invalidData)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.token).to.be.a('undefined');
        expect(res.body.message).to.equal('wrong email or password');
        done();
      });
  });

  it('should return 401 for wrong email(one that doesn\'t in the db)', (done) => {
    const invalidData = Object.assign({}, data);
    invalidData.auth.email = 'somethingrandom@mail.com';
    request.post('/api/auth/login')
      .send(invalidData)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.token).to.be.a('undefined');
        expect(res.body.message).to.equal('wrong email or password');
        done();
      });
  });

  it('should return 400 if auth property is not on req.body', (done) => {
    const invalidData = Object.assign({}, data);
    delete invalidData.auth;

    request.post(loginURl)
      .send(invalidData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('auth property is required on request body');
        done();
      });
  });

  it('should return 400 for if no password is passed ', (done) => {
    const invalidData = Object.assign({}, data);
    delete invalidData.auth.password;

    request.post(loginURl)
      .send(invalidData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('email and password are required');
        done();
      });
  });

  it('return 400 for if no email is passed', (done) => {
    const invalidData = Object.assign({}, data);
    delete invalidData.auth.email;

    request.post(loginURl)
      .send(invalidData)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('email and password are required');
        done();
      });
  });
});
