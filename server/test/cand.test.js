import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import pool from '../models/connect';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

let userToken;

describe('CANDIDATES', () => {
  describe('/GET candidates', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'user@email.com', password: '123456' })
        .end((err, res) => {
          userToken = res.body.data[0].token;
          done(err);
        });
    });

    it('should get the list of candidates', (done) => {
      chai
        .request(app)
        .get('/api/v1/candidates')
        .set('authorization', `Bearer ${userToken}`)
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
        .get('/api/v1/candidates')
        .set('authorization', 'efbbwj3yu63t327iugwuqiyd')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.equal('Token provided can not be authenticated');
          done(err);
        });
    });

    it('should return server connection error to database if can not get candidates', (done) => {
      const stub = sinon.stub(pool, 'query').throws();

      chai
        .request(app)
        .get('/api/v1/candidates')
        .set('authorization', `Bearer ${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          stub.restore();
          done(err);
        });
    });
  });
});
