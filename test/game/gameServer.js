/**
 * Module dependencies.
 */
const supertest = require('supertest'),
  app = require('../../server'),
  { expect } = require('chai'),
  jwt = require('jsonwebtoken'),
  mongoose = require('mongoose');

const server = supertest(app);
const loginUrl = '/api/auth/login';
const gameUrl = `/api/games/${'wstr'}/start`;
const token = [];
let data, gameData;
const invalidToken = jwt.sign({ _id: 'h123h1h2hhhhhhs' }, 'invalid', { expiresIn: '3 days' });
const expiredToken = jwt.sign({ _id: 'h123h1h2hhhhhhs' }, 'expired', { expiresIn: '0.001s' });

const Game = mongoose.model('Game');
// delete all records in Game model
Game.collection.drop();

describe('User login', () => {
  beforeEach(() => {
    data = {
      auth: {
        password: 'password',
        email: 'test@test.com',
      }
    };
    gameData = {
      gameID: 'wstr',
      gamePlayers: ['kemi', 'mark', 'jennifer'],
      gameRound: 7,
      gameWinner: 'kemi'
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
  it('should return 403 status for an invalid  token', (done) => {
    server
      .post(gameUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-access-token', invalidToken)
      .set('Content-Type', 'application/json')
      .type('form')
      .send(gameData)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        expect(res.body.message).to.equal('invalid user authorization token');
        if (err) return done(err);
        done();
      });
  });
  it('should return 403 status for expired user token used', (done) => {
    setTimeout(() => {
      server
        .post(gameUrl)
        .set('Connection', 'keep alive')
        .set('Accept', 'application/json')
        .set('x-access-token', expiredToken)
        .set('Content-Type', 'application/json')
        .type('form')
        .send(gameData)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          if (err) return done(err);
          done();
        });
    }, 1500);
  });
  it('should return 201 status for successfully creating a game log', (done) => {
    server
      .post(gameUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('x-access-token', token[0])
      .set('Content-Type', 'application/json')
      .type('form')
      .send(gameData)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        if (err) return done(err);
        done();
      });
  });
});
