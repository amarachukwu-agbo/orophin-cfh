/**
 * Module dependencies.
 */
const supertest = require('supertest'),
  app = require('../../server'),
  jwt = require('jsonwebtoken'),
 expect = require('chai').expect,
 mongoose = require('mongoose'),
 should = require('chai');


const server = supertest(app);
const rootURL = '/api/auth';
const signupUrl = `${rootURL}/signup`;
let data, testData;

// delete all records in User model
mongoose.model('User').collection.drop();
const token = [];
const invalidToken = jwt.sign({ userID: 2, }, 'jsninja', { expiresIn: '6h' });
const expiredToken = jwt.sign({ userID: 2, }, 'jsninja', { expiresIn: '2s' });

describe('Test Server Connection', () => {
  it('should respond with Status connected ok', (done) => {
    server
      .get('/')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect('Content-Type', /json/);
        expect(res.statusCode).to.equal(200);
        if (err) return done(err);
        done();
      });
  });
});
describe('Catch invalid routes', () => {
  it('should return a 404 if route not found', (done) => {
    server
      .get('/ydddfh')
      .set('Connection', 'keep alive')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.message).to.equal(undefined);
        if (err) return done(err);
        done();
      });
  });
});
describe('User signup', () => {
  beforeEach(() => {
    data = {
      name: 'Emeka',
      email: 'emeka1@test.com',
      password: 'abcde'
    };
  })
  it('should return a message for null username field', (done) => {
    testData = Object.assign({}, data);
    testData.name = '';
    server
      .post(signupUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testData)
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.message.should.equal('name field cannot be empty');
        if (err) return done(err);
        done();
      });
  });
  it('should return a message for null password field', (done) => {
    testData = Object.assign({}, data);
    testData.password = '';
    server
      .post(signupUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testData)
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.message.should.equal('password field cannot be empty');
        if (err) return done(err);
        done();
      });
  });
  it('should return a message for null email field', (done) => {
    testData = Object.assign({}, data);
    delete testData.email;
    server
      .post(signupUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testData)
      .end((err, res) => {
        res.status.should.equal(400);
        res.body.message.should.equal('email field cannot be empty');
        if (err) return done(err);
        done();
      });
  });
  it('should return a message for invalid username length', (done) => {
	  testData = Object.assign({},data);
	  testData.name = 'ekc';
	    server
	    .post(signupUrl)
	    .set('Connection', 'keep alive')
	    .set('Accept', 'application/json')
	    .set('Content-Type', 'application/json')
	    .type('form')
	    .send(testData)
	    .end((err,res) => {
	      res.status.should.equal(400);
	      res.body.message.should.equal('name field must have more than 3 characters');
	      if (err) return done(err);
	      done();
	    });
	});
	it('should return a message for invalid password length', (done) => {
	  testData = Object.assign({},data);
	  testData.password = 'as';
	    server
	    .post(signupUrl)
	    .set('Connection', 'keep alive')
	    .set('Accept', 'application/json')
	    .set('Content-Type', 'application/json')
	    .type('form')
	    .send(testData)
	    .end((err,res) => {
	      res.status.should.equal(400);
	      res.body.message.should.equal('password field must have more than 3 characters');
	      if (err) return done(err);
	      done();
	    });
  });
  it('should return a message for invalid email', (done) => {
	  testData = Object.assign({},data);
	  testData.email = 'john@yahoo';
	    server
	    .post(signupUrl)
	    .set('Connection', 'keep alive')
	    .set('Accept', 'application/json')
	    .set('Content-Type', 'application/json')
	    .type('form')
	    .send(testData)
	    .end((err,res) => {
	      res.status.should.equal(400);
	      res.body.message.should.equal('Invalid Email!');
	      if (err) return done(err);
	      done();
	    });
	});
  it('should return message for successful account creation', (done) => {
    testData = Object.assign({}, data);
    server
      .post(signupUrl)
      .set('Connection', 'keep alive')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .type('form')
      .send(testData)
      .end((err, res) => {
        res.status.should.equal(201);
        token[0] = res.body.token;
        expect(res.body.message).to.equal('User Account Created Successfully');
        if (err) return done(err);
        done();
      });
    });
    it('should return message for entering an existing email', (done) => {
      testData = Object.assign({}, data);
      server
        .post(signupUrl)
        .set('Connection', 'keep alive')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .type('form')
        .send(testData)
        .end((err, res) => {
          res.status.should.equal(409);
          expect(res.body.message).to.equal('Email already exists');
          if (err) return done(err);
          done();
        });
      });
  });