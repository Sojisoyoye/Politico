import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import pool from '../models/connect';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

let adminToken;

const file = fs.readFileSync(path.resolve(__dirname, './asset/Andela.jpg'));

describe('USERS', () => {
  describe('/POST Sign up user', () => {
    it('should register a new user with correct details', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foo@email.com')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.status).to.be.equal(201);
          done(err);
        });
    });

    it('should return error if user with the email already exist', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foo@email.com')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(406);
          expect(res.body.status).to.be.equal(406);
          expect(res.body.message).to.equal('User with this email already exist');
          done(err);
        });
    });

    it('should return error if firstname is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', '')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if invalid firstname provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', '*&yt6579')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if lastname is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', '')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if invalid lastname is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', ')(&YT^5')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if invalid email is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobaremailcom')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if email is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', '')
        .field('password', '123456')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if password is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if invalid password is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', '')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '1234')
        .field('phonenumber', '08011111111')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if phonenumber is not provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '')
        .field('phonenumber', '')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if invalid phonenumber is provided', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .type('form')
        .field('firstname', 'foo')
        .field('lastname', 'bar')
        .field('othername', 'o')
        .field('email', 'foobar@email.com')
        .field('password', '')
        .field('phonenumber', '080abc')
        .attach('passporturl', file, 'Andela.jpg')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });
  });

  describe('/POST Log in user', () => {
    it('should log in user with correct detials', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '123456' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          done(err);
        });
    });

    it('should not log in user with incorrect email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'useremailcom', password: '123456' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should not log in user with no password', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '' })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.be.equal(422);
          done(err);
        });
    });

    it('should return error if user email can not be found', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'uuser@email.com', password: '123456' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body.message).to.equal('User with this details can not be found');
          done(err);
        });
    });

    it('should return error if password is incorrect', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '1234567' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.be.equal(401);
          expect(res.body.message).to.equal('Wrong password, try again');
          done(err);
        });
    });
  });

  describe('/GET all users', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'admin@email.com', password: '123456' })
        .end((err, res) => {
          adminToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should get the list of all users', (done) => {
      chai
        .request(app)
        .get('/api/v1/users')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return an error if invalid authorization token was specified', (done) => {
      chai
        .request(app)
        .get('/api/v1/users')
        .set('authorization', '83yrgufghfgw73t37637ugr')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Token provided can not be authenticated');
          done(err);
        });
    });

    it('should get a specific user', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/1')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal(200);
          expect(res.body).to.be.an('object');
          done(err);
        });
    });

    it('should return server error for connection error to database', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .get('/api/v1/users/1')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done();
        });
    });

    it('should return error if user can not be found', (done) => {
      chai
        .request(app)
        .get('/api/v1/users/130')
        .set('authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.be.an('object');
          expect(res.body.error).to.equal('user can not be found');
          done(err);
        });
    });
  });
});
