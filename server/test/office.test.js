import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
const { expect } = chai;

describe('/POST political office', () => {
  it('should create a new political office', (done) => {
    chai
      .request(app)
      .post('/api/v1/offices')
      .send({
        type: 'Federal',
        name: 'President',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });
});

describe('/GET political offices', () => {
  it('should get the list of all the political offices', (done) => {
    chai
      .request(app)
      .get('/api/v1/offices')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body.data).to.be.an('array');
        done(err);
      });
  });
});
