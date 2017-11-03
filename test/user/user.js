
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../../server');

const request = supertest(app);

const searchEndpoint = '/api/search/users';
const inviteEndpoint = '/api/users/invite';
// let users;

describe('Users search test', () => {
  it('should return Enter a value', (done) => {
    request.get(`${searchEndpoint}?q=`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('Enter a value');
        done();
      });
  });
  it('should return 200 if user exists', (done) => {
    request.get(`${searchEndpoint}?q=emeka`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('should return 200 if user exist', (done) => {
    request.get(`${searchEndpoint}?q=e`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });
  it('should return no users found', (done) => {
    request.get(`${searchEndpoint}?q=zzzzz`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.message).to.equal('No user found');
        done();
      });
  });
});

describe('Invite users test', () => {
  it('should return 200 for valid inputs', (done) => {
    request.post(inviteEndpoint)
      .send({
        mailTo: 'test@test.com',
        gameLink: 'anylink'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Message sent successfully');
        done();
      });
  });
  it('should return 400 when called with invalid inputs', (done) => {
    request.post(inviteEndpoint)
      .send({
        mailTo: '',
        gameLink: ''
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('An error occured while trying to send your mail');
        done();
      });
  });
  it('should return 400 when called without email ', (done) => {
    request.post(inviteEndpoint)
      .send({
        gameLink: 'alink'
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal('An error occured while trying to send your mail');
        done();
      });
  });
});
