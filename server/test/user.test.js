import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

describe('USERS', () => {
  describe('/POST Sign up user', () => {
    it('should register a new user with correct details', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send({
          firstname: 'foo',
          lastname: 'bar',
          othername: 'o',
          email: 'foo@email.com',
          password: '123456',
          phonenumber: '0801111111',
          passporturl: 'www.foo.com',
        })
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
        .send({ email: 'foo@email.com', password: '123456' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          done(err);
        });
    });
  });
});
