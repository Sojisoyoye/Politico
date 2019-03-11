import chai from 'chai';
import chaiHttp from 'chai-http';
import path from 'path';
import fs from 'fs';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

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
});
