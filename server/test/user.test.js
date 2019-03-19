import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import fs from 'fs';
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
