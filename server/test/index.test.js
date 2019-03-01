import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('/GET', () => {
  it('should return message and status 200 for the / - base route', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal('Welcome to Politico');
        done(err);
      });
  });

  it('should return message and status 200 for the /api/v1 route', (done) => {
    chai
      .request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal('Welcome to Politico API version 1');
        done(err);
      });
  });

  it('should return status 404 for all invalid routes', (done) => {
    chai
      .request(app)
      .post('/api/v1')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.be.equal(
          'This endpoint does not exist',
        );
        done(err);
      });
  });
});
