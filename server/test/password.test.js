import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);

const { expect } = chai;

describe('/PASSWORD', () => {
  describe('/POST request password reset', () => {
    it('should send a message to the user email', (done) => {
      chai
        .request(app)
        .post('/api/v1/auth/reset')
        .send({ email: 'user@email.com' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.be.equal(200);
          expect(res.body.message).to.equal('Kindly check your email for further instruction to reset your password');
          done(err);
        });
    });
  });
});
